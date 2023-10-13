//Author: Nguyen Duy Huy
require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.static('public'));

//Templating Engine
app.use(expressLayout); //Declare
app.set('layout', './layouts/main');  //main.ejs
app.set('view engine', 'ejs');

app.use('/', require('./api/controller/main')); // lấy controller

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
});