import express, { request, response } from 'express';
import { query, validationResult, body } from 'express-validator'

const app = express();

app.use(express.json())

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`)
    next();
}

const resolveIndexById = (request, response, next) => {
    const { body, params: { id } } = request;
    const parseId = parseInt(id);

    if (isNaN(parseId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);

    if (findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex; // Attach findUserIndex to the request object
    next(); // Proceed to the next middleware or route handler
}


const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: 'Bee6ix', displayname: 'Bambo' },
    { id: 2, username: 'Bellogg', displayname: 'Ayodeji' },
    { id: 4, username: 'Bamford', displayname: 'Ayo' },
    { id: 5, username: 'Mide', displayname: 'Tope' },
    { id: 6, username: 'Nike', displayname: 'Williams' },
    { id: 7, username: 'Olamide', displayname: 'tunmise' },
]

app.get('/',
    (request, response) => {
        response.status(201).send({ msg: 'Hello, world!' });
    })





app.get('/api/users', query("filter").isString().notEmpty().withMessage('Must Not Be Empty').isLength({min : 3, max : 10}).withMessage('Must Be At Least  3-10 characters'), (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const { query: { filter, value } } = request
    if (!filter && !value) return response.send(mockUsers)
    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )

    return response.send(mockUsers)
})

app.use(loggingMiddleware, (request, response, next) => {
    console.log('finished Logging');
    next();
});

app.post('/api/users', (request, response) => {
    console.log(request.body)
    const { body } = request;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return response.status(201).send(newUser)

})

app.get('/api/users/:id', resolveIndexById, (request, response) => {
    const { findUserIndex } = request;
    const finduser = mockUsers[findUserIndex];
    if (!finduser) return response.sendStatus(404);
    return response.send(finduser);
})


app.get('/api/products', (request, response) => {
    response.status(201).send([
        { id: 123, username: 'chicken', price: '3:99' }
    ]);
})

app.put('/api/users/:id', resolveIndexById, (request, response) => {
    const { body, params: { id } } = request;
    const parseId = parseInt(id); // Ensure parseId is defined in this scope

    // Access findUserIndex through the request object
    const findUserIndex = request.findUserIndex;

    mockUsers[findUserIndex] = { id: parseId, ...body };
    return response.sendStatus(200);
});

app.patch('/api/users/:id', resolveIndexById, (request, response) => {
    const { body, findUserIndex } = request;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
})


app.delete('/api/users/:id', resolveIndexById, (request, response) => {
    const { findUserIndex } = request
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
})


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

