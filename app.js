const createError = require('http-errors');
const express = require('express');
const multer = require('multer');
const uploader = multer();
const logger = require('morgan');

const employeeRouter = require('./routes/employee.route');
const departmentRouter = require('./routes/department.route');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(uploader.single('avatar'));

app.use('/employees', employeeRouter);
app.use('/departments', departmentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
