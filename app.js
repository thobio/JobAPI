require('dotenv').config();
require('express-async-errors');

//extra security check packages

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

//Express
const express = require('express');
const connectDB = require('./db/connect');
const { authenticationMiddeleware } = require('./middlewares/auth')

const authRouter = require('./routers/authRouter');
const jobRouter = require('./routers/jobRouter');


const errorHandlerMiddleware = require('./middlewares/error-handler');
const notFound = require('./middlewares/not-found');

const app = express();

// Middleware
app.set('trust proxy', 1);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss());


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationMiddeleware, jobRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();


