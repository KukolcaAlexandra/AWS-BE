import { mockProducts } from './mock-data.js';

export const getProductsData = async () => {
  return Promise.resolve(mockProducts);
}
