require("dotenv-safe").config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const auth = require("./auth");

//Bring in Mongoose so we can communicate with MongoDB
const mongoose = require('mongoose')

//Use mongoose to connect to MongoDB. Display success or failure message depending on connection status
mongoose.connect(process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/myApplication", { useNewUrlParser: true })
    .then(() => {
        console.log("we have connected to mongo")
    }).catch(() => {
        console.log("could not connect to mongo")
    })

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/user.routes');
const postsRouter = require('./routes/post.routes');
const likesRouter = require('./routes/like.routes');
const swaggerDocsRouter = require("./routes/swagger.routes");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth.middleware)
app.use(swaggerDocsRouter);

app.use('/', indexRouter);
app.use('/auth', authRouter);

//tell our app to use our user routes and prefix them with /api
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/likes', likesRouter);

//custom error hadndling
app.use((err, req, res, next) => {
    // some packages pass an error with a status property instead of statusCode
    // reconcile that difference here by copying err.status to err.statusCode
    if (err.status) {
      err.statusCode = err.status;
    }
    if (err.statusCode >= 400 && err.statusCode < 500) {
      if (err.statusCode === 401) {
        res.set(
          "WWW-Authenticate",
          `Bearer realm="POST your username and password to /auth/login to receive a token"`
        );
      }
      res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode
      });
    } else {
      res.status(err.statusCode || 500);
      res.json({
        message: err.message,
        statusCode: res.statusCode
      });
      // morgan is NOT an error handler, so must add error to req so morgan has access to it
      // also ensure req/res gets passed to following morgan logging middleware by calling next()
      req.error = err;
      console.log(err);
      next();
    }
  })

module.exports = app;
