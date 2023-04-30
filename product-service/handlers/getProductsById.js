import service from "../service/db-service/db-client";

export const getProductsById = async (event) => {
  const { id } = event.pathParameters;
  console.log(`getProductsById id=${id} event=${event}`);
  try {
    const data = await service.getItemFromDB(id);

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    return {
      statusCode: 200,
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
