const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const createError = require('http-errors');
const logger = require('morgan');
const bodyParser = require("body-parser");
const socketIo = require('./socket.io');

const indexRouter = require('./routes/index');
const roomsRouter = require('./routes/rooms');

const app = express();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/secure-chat';

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/rooms', roomsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Error');
});

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {

    const server = http.createServer(app);
    socketIo.init(server);
    server.listen(PORT, () => {
      console.log(`Server is working on port ${PORT}`)
    });
  });
