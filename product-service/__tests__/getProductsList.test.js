import { jest } from '@jest/globals';
import { getProductsList } from '../index.js';
import service from '../service/data-model.js';

const mockList = [{ id: 1, title: 'Test1'}, { id: 2, title: 'Test2'}];

const expectedResult = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify(mockList),
};

describe('test getProductsList function', () => {
  it('return 200 status and list of product', async () => {
    const spy = jest.spyOn(service, 'getProductsData');
    spy.mockReturnValue(mockList);

    const result = await getProductsList();

    expect(result.statusCode).toEqual(200);
    expect(result).toEqual((expectedResult));
  });
});
