import express, { request, response } from 'express';
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport'
// import './strategies/localStrategy.mjs'
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

import './strategies/discordStrategy.mjs'


const app = express();


mongoose.connect('mongodb+srv://bellobambo21:Ayodeji2001@cluster0.pvwkgbs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('connected to db')).catch((err) => console.log(err))


app.use(express.json())
app.use(cookieParser('secret'))
app.use(session({
    secret: 'Bambo',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    }),
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(routes);

app.post('/api/auth', passport.authenticate('local'), (request, response) => {
    response.sendStatus(200)
})

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`)
    next();
}


app.get('/api/auth/status', (request, response) => {
    console.log(`Inside /auth/status endpoint`)
    console.log(request.user)
    console.log(request.session)


    return request.user ? response.send(request.user) : response.sendStatus(401)
})


app.post('/api/auth/logout', (request, response) => {
    if (!request.user) return response.sendStatus(401);

    request.logout((err) => {
        if (err) return response.sendStatus(400);
        response.send(200)
    })
})

const PORT = process.env.PORT || 3000;


app.get('/api/auth/discord', passport.authenticate('discord'));
app.get('/api/auth/discord/redirect',
    passport.authenticate('discord'),
    (request, response) => {
        response.sendStatus(200);
    })



app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

app.use(loggingMiddleware, (request, response, next) => {
    console.log('finished Logging');
    next();
});

app.get('/',
    (request, response) => {
        console.log(request.session.id);
        request.session.visited = true;
        response.cookie('hello', 'world', { maxAge: 10000, signed: true });
        response.status(201).send({ msg: 'Hello, world!' });
    })


app.post('/api/auth', (request, response) => {
    const { body: { username, password } } = request;
    const finduser = mockUsers.find((user) => user.username === username);
    if (!finduser || finduser.password !== password) return response.status(401).send({ msg: 'Bad Credentials' });

    request.session.user = finduser;
    return response.status(200).send(finduser)
})

app.get('/api/auth/status', (request, response) => {
    request.sessionStore.get(request.sessionID, (err, session) => {
        console.log(session);
    })
    return request.session.user ? response.status(200).send(request.session.user) :
        response.status(401).send({ msg: 'Not Authenticated' });
})


app.post('/api/cart', (request, response) => {
    if (!request.session.user) return response.sendStatus(401);
    const { body: item } = request;

    const { cart } = request.session;

    if (cart) {
        cart.push(item)
    } else {
        request.session.cart = [item];
    }

    return response.status(201).send(item)

})


app.get('/api/cart', (request, response) => {
    if (!request.session.user) return response.sendStatus(401);
    return response.send(request.session.cart ?? []);
})





