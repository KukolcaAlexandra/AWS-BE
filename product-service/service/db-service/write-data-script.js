import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v1 as uuidv1 } from 'uuid';
import { ddbDocClient } from "./create-dynamodb-client.js";
import { mockProductsData, mockStocksData } from '../mock-data.js';

export const putItem = async (params) => {
  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
};

// Set the parameters.
const getProductParams = ({ title, description, price }) => ({
  TableName: "products",
  Item: {
    id: uuidv1(),
    title,
    description,
    price,
  },
});

const getStocksParams = ({ product_id, count }) => ({
  TableName: "stocks",
  Item: {
    product_id,
    count,
  },
});

mockProductsData.forEach(async (item) => {
  const data = getProductParams(item);
  await putItem(data);
});

mockStocksData.forEach(async (item) => {
  const data = getStocksParams(item);
  await putItem(data);
});
