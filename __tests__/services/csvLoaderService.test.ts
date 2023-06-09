import { Request, Response } from 'express';
import { csvLoadService } from '../../src/services/csvLoadService';
import { prismaMock } from '../prismaSingleton';

const fileContent = `name,city,country,favoriteSport
John Doe,New York,USA,Basketball
Jane Smith,London,UK,Football
Mike Johnson,Paris,France,Tennis`;
jest.mock('fs', () => ({
    createReadStream: jest.fn().mockImplementation(() => {
        const stream = require('stream');
        const readable = new stream.Readable();
        readable.push(fileContent);
        readable.push(null);
        return readable;
    }),
    unlinkSync: jest.fn()
}));
const fs = require('fs');

describe('csvLoadService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should upload and process a CSV file', async () => {


        const mockCsvData = [
            {
                name: 'John Doe',
                city: 'New York',
                country: 'USA',
                favoriteSport: 'Basketball',
            },
            {
                name: 'Jane Smith',
                city: 'London',
                country: 'UK',
                favoriteSport: 'Football',
            },
            {
                name: 'Mike Johnson',
                city: 'Paris',
                country: 'France',
                favoriteSport: 'Tennis',
            },
        ];

        prismaMock.csvData.createMany.mockResolvedValue({ count: 4 });


        const mockFile = {
            originalname: 'test.csv',
        };

        const mockRequest: any = {
            file: mockFile,
        } as Request;

        const mockResponse: any = {
            status(_num: number) {
                return this;
            },
            send: jest.fn(),
            json: jest.fn(),
        };

        const responseSpy = jest.spyOn(mockResponse, 'status');



        await csvLoadService(mockRequest, mockResponse);

        expect(fs.createReadStream).toHaveBeenCalledWith(`./uploads/${mockFile.originalname}`);
        expect(responseSpy).toHaveBeenCalledWith(200);
        expect(prismaMock.csvData.createMany).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'File uploaded successfully',
            data: { count: 4 },
        });
        expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('should return an error if no file is uploaded', async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;

        await csvLoadService(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith('No file uploaded');
        expect(fs.createReadStream).not.toHaveBeenCalled();
        expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should handle errors during CSV processing', async () => {
        const mockFile = {
            originalname: 'test.csv',
        };

        const mockRequest = {
            file: mockFile,
        } as Request;

        const mockResponse: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };

        const mockError = 'Internal server error';


        fs.createReadStream.mockImplementation(() => {
            const stream = require('stream');
            const readable = new stream.Readable();
            readable.emit('error', mockError);
            return readable;
        });

        await csvLoadService(mockRequest, mockResponse);

        expect(fs.createReadStream).toHaveBeenCalledWith(`./uploads/${mockFile.originalname}`);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith(mockError);
    });
});

