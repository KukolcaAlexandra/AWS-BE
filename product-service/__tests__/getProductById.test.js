import { jest } from '@jest/globals';
import { getProductsById } from '../index.js';
import service from '../service/data-model.js';

const mockData = { id: 5, title: 'Test' };

describe('test getProductsById function', () => {
  it('return 200 status and found product', async () => {
    const spy = jest.spyOn(service, 'getProductsDataById');
    spy.mockReturnValue(mockData);

    const event = {
      pathParameters: {
          id: '5',
      }
    };

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({ id: 5, title: 'Test'}),
    };

    const result = await getProductsById(event);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedResult.body);
  });

  it('return 404 error', async () => {
    const spy = jest.spyOn(service, 'getProductsDataById');
    spy.mockReturnValue();

    const event = {
      pathParameters: {
          id: '5',
      }
    };

    const expectedResult = {"body": "{\"message\":\"Product not found\"}", "statusCode": 404};

    const result = await getProductsById(event);
    expect(result.statusCode).toEqual(404);
    expect(result).toEqual(expectedResult);
  });
});

