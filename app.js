//Author: Nguyen Duy Huy
require('dotenv').config()
var createError = require('http-errors');
const express = require('express');
var path = require('path');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var ejs = require("ejs");

var flash = require('connect-flash');
var jwt = require("jsonwebtoken");
const MongoStore = require('connect-mongo');

const { isActiveRoute } = require('./api/helper/routeHelpers');
const app = express();
const PORT = 5000 || process.env.PORT;

//connect DB
const connectDB = require('./config/database.js');
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })
}));

app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(middleware).use(express.static('public'));


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main'); 
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute; 

app.use('/', require('./api/controller/admin'));
app.use('/', require('./api/controller/user'));
app.use('/', require('./api/controller/cate'));
app.use('/', require('./api/controller/product'));

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
});