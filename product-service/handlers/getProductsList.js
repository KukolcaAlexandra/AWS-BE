import { getProductsData } from '../service/data-model.js';

export const getProductsList = async (event) => {
  const data = await getProductsData();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
