var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");

const db = mongoose.connection;

const uri = "mongodb+srv://thanhthoa:Alice2907%40@nodjesapi.hq6qd.mongodb.net/NodjesAPI?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true },  { useUnifiedTopology: true });
//  client.connect(async (err) => {
//  const collection = await client.db("NodjesAPI").collection("items");
//  if(!err){
//    console.log("success connected");
//  }
//   client.close();
// });
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected")
})
.catch(err => console.log(err)); 





var indexRouter = require('./routes/backend/index');
var app = express();
let systemConfig = require('./config/system'); 
app.use(expressLayouts);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set("layout", "backend"); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
