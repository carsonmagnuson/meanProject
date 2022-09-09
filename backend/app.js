const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();


const postsRoutes = require('./routes/posts')

const app = express();
const api_key = process.env.API_KEY;

mongoose.connect("mongodb+srv://carson:" + api_key + "@cluster0.aojkljv.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database.');
  })
  .catch(() => {
    console.log('Connection failed.');
  });

app.use(bodyParser.json()); // parses req data into json
app.use(bodyParser.urlencoded({extended: false})); // parses url encoded data
app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*"); // setting headers to bypass CORS error - allow access from all servers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
