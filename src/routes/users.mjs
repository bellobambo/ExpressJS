import { Router } from 'express';
import { checkSchema, query, validationResult, matchedData } from 'express-validator';
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexById } from '../utils/middlewares.mjs';
import { User } from '../mongoose/schema/user.mjs';

const router = Router();

router.get('/api/users', query("filter").isString().notEmpty().withMessage('Must Not Be Empty')
    .isLength({ min: 3, max: 10 }).withMessage('Must Be At Least  3-10 characters'),
    (request, response) => {
        console.log(request.session);
        console.log(request.session.id);
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

router.post('/api/users', async (request, response) => {
   
        const {body} = request;

        const newUser = new User(body);
        try {
            const savedUser = await newUser.save();
            return response.status(201).send(savedUser)
        } catch (error) {
            console.log(error)
            return response.status(400).send({ msg: 'Bad Request' })
        }

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