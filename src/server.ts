import express from 'express';
import routes from './routes';

export function createServer() {
    const app = express();

    app.use(express.json()); app.use(express.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Content-Type', 'application/json');
        res.header('Accept', 'application/json');
        next();
    });

    app.use('/api', routes);

    return app;
};
