import { Request, Response } from 'express';
import prisma from '../prisma';

export const getUsersService = async (req: Request, res: Response) => {
    {
        const { query } = req;

        if (query.q && typeof query.q === 'string') {
            const searchParam = query.q.toLowerCase();

            const csvData = await prisma.csvData.findMany({
                where: {
                    OR: [
                        { name: { contains: searchParam, mode: 'insensitive' } },
                        { country: { contains: searchParam, mode: 'insensitive' } },
                        { city: { contains: searchParam, mode: 'insensitive' } },
                        { favoriteSport: { contains: searchParam, mode: 'insensitive' } },
                    ]
                }
            });
            return res.status(200).json(csvData);
        }

        const csvData = await prisma.csvData.findMany();
        return res.status(200).json(csvData);


    }
}
