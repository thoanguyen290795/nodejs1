
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
let systemConfig = require('./config/system'); 
let databaseConfig = require('./config/database'); 
const mongoose = require('mongoose');
const db = mongoose.connection;



//  mongoose.connect("mongodb+srv://thanhthoa:Alice2907%40@nodjesapi.hq6qd.mongodb.net/nodejs_training?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}); 
mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@nodjesapi.hq6qd.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}); 

//define path 
global.__base = __dirname + '/';
global.__path_config = __base + "config/"; 
global.__path_routes = __base + "routes/"; 
global.__path_helper = __base + "helper/";
global.__path_schemas = __base + "schemas/";  
global.__path_validates = __base + "validates/";  
global.__path_views = __base + "views/";  
global.__path_public = __base + "public/";  


var indexRouter = require(__path_routes + 'backend/index');
var app = express();
app.use(expressLayouts); 
app.use(cookieParser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("layout", "backend"); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//local variable 
app.locals.systemConfig = systemConfig; 

//setup router 
app.use(`/${systemConfig.prefixAdmin}`, indexRouter);

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
  res.render('error', { title: 'Error Page' });
});

module.exports = app;
