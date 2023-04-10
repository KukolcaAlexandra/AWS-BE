//import service from '../service/data-model.js';
import { getItemsFromDB } from '../service/db-service/db-client.js';

export const getProductsList = async (event) => {
  try {
    //const data = await service.getProductsData();
    const data = await getItemsFromDB();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data),
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
