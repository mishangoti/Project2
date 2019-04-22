var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');
var http = require('http').Server(app);
// const dotenv = require('dotenv');
// dotenv.load({ path: '.env-dev' });

// load routers for api
var apiRouter = require('./routes/apiv1/api');

// load routers for web
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var homeRouter = require('./routes/home');
var customersRouter = require('./routes/customers');
var retailersRouter = require('./routes/retailers');
var productsRouter = require('./routes/products');
var categorysRouter = require('./routes/categorys');
var sliderRouter = require('./routes/slider');
var managesliderRouter = require('./routes/manageslider');
var htmltopdfRouter = require('./routes/htmltopdf');
var storeRouter = require('./routes/store');
var processtopayRouter = require('./routes/processtopay');
var trackRouter = require('./routes/track');
var orderRouter = require('./routes/orders');
var sallerRouter = require('./routes/saller');
var myproductsRouter = require('./routes/myproducts');
var myordersRouter = require('./routes/myorders');
var payRouter = require('./routes/pay');
var sendmailRouter = require('./routes/sendmail');

var app = express();
const mysql = require('mysql');
// var host = `${req.protocol}://${req.hostname}:${port}`;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
    database: 'project2'
});
// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})) 
// connect flash
app.use(flash());
// global var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

// inclide css and js
// app.use(express.static(__dirname + '/public'));
// app.use(express.static('public'))

// api
app.use('/api', apiRouter);

// web
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/home', homeRouter);
app.use('/customers', customersRouter);
app.use('/retailers', retailersRouter);
app.use('/products', productsRouter);
app.use('/categorys', categorysRouter);
app.use('/slider', sliderRouter);
app.use('/manageslider', managesliderRouter);
app.use('/htmltopdf', htmltopdfRouter);
app.use('/store', storeRouter);
app.use('/processtopay', processtopayRouter);
app.use('/track', trackRouter);
app.use('/orders', orderRouter);
app.use('/saller', sallerRouter);
app.use('/myproducts', myproductsRouter);
app.use('/myorders', myordersRouter);
app.use('/pay', payRouter);
app.use('/sendmail', sendmailRouter);

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
