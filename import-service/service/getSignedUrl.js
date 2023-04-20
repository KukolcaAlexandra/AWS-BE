import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const getPresignedUrl = async (client, params) => {
  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return signedUrl;
}

export default {
  getPresignedUrl,
}
