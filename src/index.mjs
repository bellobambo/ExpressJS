import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    response.status(201).send({ msg: 'Hello, world!' });
})

app.get('/api/users', (request, response) => {
    response.status(201).send([
        { id: 1, username: 'Bee6ix', displayname: 'Bambo' },
        { id: 1, username: 'Bellogg', displayname: 'Ayodeji' },
        { id: 1, username: 'Bamford', displayname: 'Ayo' }
    ]);
})
app.get('/api/products', (request, response) => {
    response.status(201).send([
        { id: 123, username: 'chicken', price: '3:99' }
    ]);
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

