
import { Options } from 'csv-parser';
import multer from 'multer';

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, './uploads');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const upload = multer({ storage });

const snakeToCamelCase = (str: string) => {
    return str.replace(/([-_][a-z])/g, (group) => {
        return group[1].toUpperCase();
    });
};

export const csvOptions: Options = {
    separator: ',',
    mapHeaders:({header}) => snakeToCamelCase(header), 
};

