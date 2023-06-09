import fs from 'fs';
import { Request, Response } from 'express';
import { z } from 'zod';
import csvParser from 'csv-parser';
import { csvOptions } from '../multerSetup';
import prisma from '../prisma';

const csvSchema = z.object({
    name: z.string(),
    country: z.string(),
    city: z.string(),
    favoriteSport: z.string(),
});

function readFileThenRemoveAsync<T>(filePath: string, parser: (row: any) => T): Promise<T[]> {
    return new Promise(function(resolve, reject) {
        const data: T[] = [] as T[];
        fs.createReadStream(filePath).pipe(csvParser(csvOptions)).on('data', (row) => {
            const rowData = parser(row); 
            data.push(rowData);
        }).on('end', () => {
            resolve(data);
        }).on('error', (err) => {
            fs.unlinkSync(filePath);
            reject(err);
        }).on('close', () => {
            fs.unlinkSync(filePath);
        });
    });
}

type CsvDataType = z.infer<typeof csvSchema>;
export const csvLoadService = async (req: Request, res: Response) => {

    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).send('No file uploaded');
    }
    try {
        const filePath = `./uploads/${uploadedFile.originalname}`;
        const data  = await readFileThenRemoveAsync<CsvDataType>(filePath, csvSchema.parse);
        const csvData = await prisma.csvData.createMany({ data });

        return res.status(200).json({ message: 'File uploaded successfully',data: csvData});
    } catch (err) {
       if (err instanceof Error) {
           return res.status(400).send(err.message);
       }

       return res.status(500).send('Internal server error');
    }


}
