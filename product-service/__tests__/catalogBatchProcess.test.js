import { jest } from '@jest/globals';
import { catalogBatchProcess } from '../index.js';
import dbService from '../service/db-service/db-client.js';
import emailService from '../service/sendEmail.js';

describe('test catalogBatchProcess function', () => {
  it('return 200 status', async () => {
    const dbServiceSpy = jest.spyOn(dbService, 'createItemDB');
    dbServiceSpy.mockReturnValue(undefined);
    const emailSpy = jest.spyOn(emailService, 'sendEmail');
    emailSpy.mockReturnValue(undefined);

    const event = {
      Records: [{
        body: '{"title":"product2","description":"product2 description","price":"200","count":"20"}',
      }],
    };

    const result = await catalogBatchProcess(event);
    expect(result.statusCode).toEqual(200);
  });

  it('return 400 error', async () => {
    const event = {
      Records: [{
        body: '{"title":"product2","description":"product2 description","price":"200"}',
      }],
    };

    const expectedResult = {"body": "{\"message\":\"Product data is invalid\"}", "statusCode": 400};

    const result = await catalogBatchProcess(event);
    expect(result.statusCode).toEqual(400);
    expect(result).toEqual(expectedResult);
  });
});
