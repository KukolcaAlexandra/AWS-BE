import { jest } from '@jest/globals';
import { importProductsFile } from '../index.js';
import service from '../service/getSignedUrl.js';

const mockData = 'test_url';

describe('test importProductsFile function', () => {
  it('return 200 status and signedUrl', async () => {
    const spy = jest.spyOn(service, 'getPresignedUrl');
    spy.mockReturnValue(mockData);

    const event = {
      queryStringParameters: {
        name: 'test',
      }
    };

    const expectedResult = {
      statusCode: 200,
      body: 'test_url',
    };

    const result = await importProductsFile(event);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedResult.body);
  });

  it('return 404 error', async () => {
    const event = {
      queryStringParameters: {}
    };

    const expectedResult = {"body": "{\"message\":\"Name query parameter is missing\"}", "statusCode": 404};

    const result = await importProductsFile(event);
    expect(result.statusCode).toEqual(404);
    expect(result).toEqual(expectedResult);
  });
});
