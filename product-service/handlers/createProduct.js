import { createItemDB } from '../service/db-service/db-client.js';

export const createProduct = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const {title, description, price, count} = data;
    console.log(`createProduct title=${title} description=${description} price=${price} count=${count} event=${event}`);
    
    if (!title || !description || !price || count === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Product data is invalid',
        }),
      };
    }
    await createItemDB(data);
    
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
