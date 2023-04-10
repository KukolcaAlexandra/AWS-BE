import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { v1 as uuidv1 } from 'uuid';
import { ddbDocClient } from "./create-dynamodb-client.js";

export async function getItemsFromDB() {
  try {
    const { Items: products } = await ddbDocClient.send(new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
    }));
    const { Items: stocks } = await ddbDocClient.send(new ScanCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
    }));
    const mergedData = products.map((product) => {
      const productInStock = stocks.find((item) => item.product_id === product.id);
      return {...product, count: productInStock.count || 0};
    })
    console.log("Success - item added or updated", mergedData);
    return mergedData;
  } catch (err) {
    console.log("Error", err.stack);
  }
}

export async function getItemFromDB(id) {
  try {
    const { Item: product } = await ddbDocClient.send(new GetCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: {
        id,
      },
    }));
    console.log("Success - item added or updated product", product);

    const { Item: stock } = await ddbDocClient.send(new GetCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
      Key: {
        product_id: id,
      },
    }));
    console.log("Success - item added or updated stocks", stock);

    return {...product, count: stock.count};

  } catch (err) {
    console.log("Error", err.stack);
  }
}
