import { S3 } from "@aws-sdk/client-s3";
import csv from 'csv-parser';

export const importFileParser = async (event, _context, callback) => {
  try {
    const client = new S3({ region: 'us-east-1' });

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const getObjectResult = await client.getObject({
      Bucket: bucket,
      Key: key,
    });
    
    const bodyStream = getObjectResult.Body;

    await bodyStream
      .pipe(csv())
      .on('data', async (data) => {
        console.log('data', data);
      })
      .on('error', (error) => {
        console.log('s3Stream error', error);
        callback(1, 'error');
      })
      .on('end', async () => {
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
