import { createServer } from  './server';

const app = createServer();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('app listening on port 3000!');
})
