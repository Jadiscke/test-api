"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const multerSetup_1 = require("./multerSetup");
function createServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Content-Type', 'application/json');
        res.header('Accept', 'application/json');
        next();
    });
    app.post('/api/upload/csv', multerSetup_1.upload.single('file'), (req, res) => {
        const uploadedFile = req.file;
        if (!uploadedFile) {
            return res.status(400).send('No file uploaded');
        }
        const filePath = `./uploads/${uploadedFile.originalname}`;
        fs_1.default.createReadStream(filePath).pipe((0, csv_parser_1.default)(multerSetup_1.csvOptions)).on('data', (row) => {
            console.log(row);
        }).on('end', () => {
            res.status(200).send('File Upload Successfully');
        }).on('error', (err) => {
            res.status(500).send(err);
        }).on('close', () => {
            fs_1.default.unlinkSync(filePath);
        });
    });
    return app;
}
exports.createServer = createServer;
;
