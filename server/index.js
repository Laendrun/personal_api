require('dotenv').config();
const express = require('express');
const morgan = require('morgan'); 
const cors = require('cors');
const path = require('path');
const axios = require('axios').default;


// /API router
const api = require('./routes/api');

// Middlewares
const { checkTokenSetUser } = require('./routes/api/middlewares');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(checkTokenSetUser);
app.use('/public', express.static(__dirname + '/public'));

app.get('/login/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/html/login.html'));
});

app.get('/dashboard/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/html/dashboard.html'));
});

app.get('/sitemap.xml', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/public/sitemap.xml'));
});

app.use('/api/', api);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.port || 4000;
app.listen(port, () => {
  console.log('listening on port', port);
});
