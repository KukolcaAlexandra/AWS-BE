import { S3, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import csv from 'csv-parser';

const copyObject = async ({ client, bucket, key }) => {
  const input = {
    Bucket: bucket,
    CopySource: `${bucket}/${key}`,
    Key: key.replace('uploaded', 'parsed'),
  };
  const command = new CopyObjectCommand(input);
  await client.send(command);
}

const deleteObject = async ({ client, bucket, key }) => {
  const input = {
    Bucket: bucket,
    Key: key,
  };
  const command = new DeleteObjectCommand(input);
  await client.send(command);
}

const writeToSQS = async ({ client, queueUrl, messageBody }) => {
  const input = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  };
  await client.send(new SendMessageCommand(input));
}


export const importFileParser = async (event, _context, callback) => {
  try {
    const clientS3 = new S3({ region: process.env.REGION });
    const clientSQS = new SQSClient({ region: process.env.REGION });
    

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const getObjectResult = await clientS3.getObject({
      Bucket: bucket,
      Key: key,
    });
    
    const bodyStream = getObjectResult.Body;

    await bodyStream
      .pipe(csv({ separator: ';' }))
      .on('data', async (data) => {
        await writeToSQS({ client: clientSQS, queueUrl: process.env.SQS_URL, messageBody: JSON.stringify(data) });
      })
      .on('error', (error) => {
        console.log('s3Stream error', error);
        callback(1, 'error');
      })
      .on('end', async () => {
        await copyObject({ client: clientS3, bucket, key })
        await deleteObject({ client: clientS3, bucket, key });
        callback(0, 'success');
      });
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: event,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Your function executed with error!',
        input: event,
      }, null, 2),
    };
  }
};
