var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/allPanels', require('./routes/allPanels'));
app.use('/getPanel', require('./routes/getPanel'));
app.use('/findPanels', require('./routes/findPanels'));

app.use('/raw_hv_data', require('./routes/raw_hv_data'));
app.use('/getHVData', require('./routes/getHVData'));

app.use('/panel_qc', require('./routes/panel_qc'));
app.use('/all_panel_qc', require('./routes/all_panel_qc'));
app.use('/plane_qc', require('./routes/plane_qc'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
