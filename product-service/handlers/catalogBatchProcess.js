import { SNSClient } from "@aws-sdk/client-sns";
import dbService from '../service/db-service/db-client.js';
import emailService from '../service/sendEmail.js';

export const catalogBatchProcess = async (event) => {
  try {
    const snsClient = new SNSClient({ region: process.env.REGION });
    const products = event.Records.map(({ body }) => JSON.parse(body));


    for (const product of products) {
      const { title, description, price, count } = product;
      if (!title || !description || !price || count === undefined) {
        console.log('Product is invalid', product);
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Product data is invalid',
          }),
        };
      }
      await dbService.createItemDB({ title, description, price, count: Number(count) });
      await emailService.sendEmail(snsClient, product);
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
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
