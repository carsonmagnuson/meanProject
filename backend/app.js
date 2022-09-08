const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/post');

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

app.post('/api/posts', (req, res, next) => { // change our posts
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((createdPost) => {
    res.status(201).json({ // 201 means 'all g, new resource created'
      message: 'Posts added successfully.',
      postId: createdPost._id
    });
  });
  console.log(post);
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successful."});
  });
});

app.get('/api/posts', (req, res, next) => { // get our posts
  Post.find()
    .then(documents => {
      res.status(200).json({ //200 means 'all g'
        message: 'Posts fetched successfully.',
        posts: documents
      });
    });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found.'})
    }
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result);
    res.status(200).json({message: "Post deleted."});
  });
});

module.exports = app;
