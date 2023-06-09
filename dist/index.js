"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const app = (0, server_1.createServer)();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
