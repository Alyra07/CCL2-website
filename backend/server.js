const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middleware/verifyToken');

const app = express();
const port = 5000;

app.use(cors());
app.use(fileUpload({ createParentPath: true }));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers
const indexRoute = require('./routes/index.js');
const profilesRoute = require('./routes/profiles.js');
const listingsRoute = require('./routes/listings.js');

// Use routers
app.use('/', indexRoute);
app.use('/profile', profilesRoute);
app.use('/api/listings', listingsRoute);

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