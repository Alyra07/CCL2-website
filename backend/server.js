const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const express = require('express');
const app = express();
const port = 3000;

app.use(cors());
    app.use(fileUpload({
        createParentPath: true
}));

app.use(express.static('public'));
app.use(express.static(__dirname +'/public'));

// Index (Main Page) Render
app.get('/', (req, res) => {
    res.send('Hello World!');
    // res.render('index.jsx', { title: 'CCL App' });
});

const db = require('./services/database.js');
const path = require("path");

app.set("views", path.join(__dirname,'views'));
app.set("view engine", "ejs");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

function errorHandler(err, req, res, next) {
    res.render('error', {error :err})
}
app.use(errorHandler)

app.listen(port, () => {
 console.log(`Example app listening at 
    http://localhost:${port}`);
});
