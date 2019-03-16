var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

// Passport
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Routing
var views = require('./routes').views;
var api = require('./routes').api;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport
app.use(require('express-session')({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use('/', views);
app.use('/api', api.authenticator);
app.use('/api/user', api.user);
app.use('/api/supplier', api.supplier);
app.use('/api/department', api.department);
app.use('/api/materialT', api.materialT);
app.use('/api/client', api.client);
app.use('/api/job', api.job);
app.use('/api/process', api.process);
app.use('/api/purchase', api.purchase);
app.use('/api/role', api.role);
app.use('/api/material', api.material);
app.use('/api/scrap', api.scrap);
app.use('/api/effort', api.effort);
app.use('/api/scrapEffort', api.scrapEffort);
app.use('/api/expense', api.expense);
app.use('/api/processreport', api.processReport);
app.use('/api/product', api.product);
app.use('/api/purchaseOrder', api.purchaseOrder);
app.use('/api/productPurchase', api.productPurchase);
app.use('/api/report', api.report);
app.use('/api/empEffortReport', api.empEffortReport);


// passport config
var User = require('./models').User;
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose
mongoose.connect(config.mongo_url);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: err
      });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: {}
   });
});

module.exports = app;

require('./serverSetup').setup();
