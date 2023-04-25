import service from '../service/db-service/db-client.js';

export const getProductsList = async (event) => {
  try {
    console.log('getProductsList event', event);
    const data = await service.getItemsFromDB();
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
