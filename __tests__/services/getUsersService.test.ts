import { Request, Response } from 'express';
import { getUsersService } from '../../src/services/getUsersService';
import { prismaMock } from '../prismaSingleton';


describe('getUsersService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all CSV data if no query parameter is provided', async () => {
    const mockRequest = {
      query: {},
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    const mockCsvData = [
      { id: 1, name: 'John Doe', city: 'New York', country: 'USA', favoriteSport: 'Basketball' },
      { id: 2, name: 'Jane Smith', city: 'London', country: 'UK', favoriteSport: 'Football' },
    ];

    prismaMock.csvData.findMany.mockResolvedValue(mockCsvData);

    await getUsersService(mockRequest, mockResponse);

    expect(prismaMock.csvData.findMany).toHaveBeenCalledWith();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCsvData);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it('should return filtered CSV data based on the query parameter', async () => {
    const mockQuery = { q: 'basketball' };

    const mockRequest: any = {
      query: mockQuery,
    };

    const mockResponse = {
      status(){
          return this
      },
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    const responseSpy = jest.spyOn(mockResponse, 'status');

    const mockCsvData = [
      { id: 1, name: 'John Doe', city: 'New York', country: 'USA', favoriteSport: 'Basketball' },
    ];

    prismaMock.csvData.findMany.mockResolvedValue(mockCsvData);

    await getUsersService(mockRequest, mockResponse);

    expect(prismaMock.csvData.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: 'basketball', mode: 'insensitive' } },
          { country: { contains: 'basketball', mode: 'insensitive' } },
          { city: { contains: 'basketball', mode: 'insensitive' } },
          { favoriteSport: { contains: 'basketball', mode: 'insensitive' } },
        ],
      },
    });
    expect(responseSpy).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCsvData);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it('should handle errors and return 500 status code', async () => {
    const mockRequest = {
      query: {},
    } as Request;

    const mockResponse = {
      status() {
          return this
      },
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    const responseSpy = jest.spyOn(mockResponse, 'status');

    prismaMock.csvData.findMany.mockRejectedValue(new Error('Database error'));

    await getUsersService(mockRequest, mockResponse);

    expect(prismaMock.csvData.findMany).toHaveBeenCalledWith();
    expect(responseSpy).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith('Internal server error');
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});

