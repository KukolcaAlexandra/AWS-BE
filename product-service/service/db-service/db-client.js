import { ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
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

export async function createItemDB(data) {
  try {
    const { title, description, price, count } = data;
    const id = uuidv1();
    const productParams = {
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Item: {
        id,
        title,
        description,
        price,
      },
    };
    const stocksParams = {
      TableName: process.env.STOCKS_TABLE_NAME,
      Item: {
        product_id: id,
        count,
      },
    };
    await ddbDocClient.send(new PutCommand(productParams));
    await ddbDocClient.send(new PutCommand(stocksParams));

  } catch (err) {
    console.log("Error", err.stack);
  }
}
