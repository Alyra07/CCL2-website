const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const verifyToken = require('./middleware/auth');
// routers
const indexRouter = require('./routes/index.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(fileUpload({ createParentPath: true }));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.get('/protected', verifyToken, (req, res) => {
  res.send(`Hello, ${req.user.email}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

function errorHandler(err, req, res, next) {
  res.render('error', { error: err });
}
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});