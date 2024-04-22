import {Router} from 'express';
import { checkSchema, query, validationResult, matchedData } from 'express-validator';
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexById } from '../utils/middlewares.mjs';

const router = Router();

router.get('/api/users', query("filter").isString().notEmpty().withMessage('Must Not Be Empty').isLength({ min: 3, max: 10 }).withMessage('Must Be At Least  3-10 characters'), (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const { query: { filter, value } } = request
    if (!filter && !value) return response.send(mockUsers)
    if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )

    return response.send(mockUsers)
})


router.get('/api/users/:id', resolveIndexById, (request, response) => {
    const { findUserIndex } = request;
    const finduser = mockUsers[findUserIndex];
    if (!finduser) return response.sendStatus(404);
    return response.send(finduser);
})

router.post('/api/users', checkSchema(createUserValidationSchema), (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if (!result.isEmpty()) {
        return response.status(400).send({ errors: result.array() })
    }

    const data = matchedData(request)
    console.log(data);

    const { body } = request;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return response.status(201).send(newUser)

})

router.put('/api/users/:id', resolveIndexById, (request, response) => {
    const { body, params: { id } } = request;
    const parseId = parseInt(id); // Ensure parseId is defined in this scope

    // Access findUserIndex through the request object
    const findUserIndex = request.findUserIndex;

    mockUsers[findUserIndex] = { id: parseId, ...body };
    return response.sendStatus(200);
});

router.patch('/api/users/:id', resolveIndexById, (request, response) => {
    const { body, findUserIndex } = request;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
})


router.delete('/api/users/:id', resolveIndexById, (request, response) => {
    const { findUserIndex } = request
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
})

export default router; 