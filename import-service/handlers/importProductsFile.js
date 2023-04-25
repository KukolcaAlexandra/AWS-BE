import { S3Client } from "@aws-sdk/client-s3";
import service from '../service/getSignedUrl';

export const importProductsFile = async (event) => {
  const queryStringParameters = event.queryStringParameters;

  if (!queryStringParameters?.name) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Name query parameter is missing',
      }),
    };
  }
  const client = new S3Client({region: 'us-east-1'});

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${queryStringParameters?.name}`,
  };

  try {
    const signedUrl = await service.getPresignedUrl(client, params);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: signedUrl,
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
