import { mockUsers } from "./constants.mjs";

export const resolveIndexById = (request, response, next) => {
    const { body, params: { id } } = request;
    const parseId = parseInt(id);

    if (isNaN(parseId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);

    if (findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex; // Attach findUserIndex to the request object
    next(); // Proceed to the next middleware or route handler
}
