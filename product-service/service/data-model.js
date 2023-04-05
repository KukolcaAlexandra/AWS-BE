import { mockProductsData } from './mock-data.js';

export const getProductsData = async () => {
  return Promise.resolve(mockProductsData);
}

export const getProductsDataById = async (id) => {
  const data = mockProductsData.find((item) => {
    return item.id == id;
  });
  return Promise.resolve(data);
}