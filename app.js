const dotenv = require('dotenv-safe');

if (process.env.NODE_ENV !== 'development') {
    dotenv.config({
        allowEmptyValues: true,
        example: '.env.example',
    });
};

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// const path = require('path');

const limiter = require('./middlewares/rateLimiter')
const errorHandler = require('./middlewares/errorHandling')
const auth = require('./auth');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/user.routes');
const postsRouter = require('./routes/post.routes');
const likesRouter = require('./routes/like.routes');
const swaggerDocsRouter = require('./routes/swagger.routes');

const app = express();

app.use(logger('dev'));
app.use(cors({ preflightContinue: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth.middleware);
app.use(limiter); // Replace with `app.use('/api', limiter)` if you only want to rate limit /api endpoints
app.use(swaggerDocsRouter);

app.use('/', indexRouter);
app.use('/auth', authRouter);

//tell our app to use our user routes and prefix them with /api
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/likes', likesRouter);

//custom error handling
app.use(errorHandler);

module.exports = app;
