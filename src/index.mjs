import express from 'express';
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';


const app = express();


app.use(express.json())
app.use(cookieParser('secret'))
app.use(routes)



const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`)
    next();
}


const PORT = process.env.PORT || 3000;

app.get('/',
    (request, response) => {
        response.cookie('hello' , 'world' ,{maxAge: 10000, signed : true});
        response.status(201).send({ msg: 'Hello, world!' });
    })




app.use(loggingMiddleware, (request, response, next) => {
    console.log('finished Logging');
    next();
});



app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

