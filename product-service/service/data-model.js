import { mockProductsData } from './mock-data.js';

const getProductsData = async () => {
  return Promise.resolve(mockProductsData);
}

const getProductsDataById = async (id) => {
  const data = mockProductsData.find((item) => {
    return item.id == id;
  });
  return Promise.resolve(data);
}

export default {
  getProductsData,
  getProductsDataById
}
