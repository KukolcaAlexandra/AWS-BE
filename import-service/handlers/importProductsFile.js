import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = 'nodejs-aws-s3';

export const importProductsFile = async (event) => {
  const queryStringParameters = event.queryStringParameters;
  const client = new S3Client({region: 'us-east-1'});

  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${queryStringParameters?.name}`,
  };

  const command = new PutObjectCommand(params);

  try {
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: signedUrl,
    };
  } catch (error) {
  }
};
