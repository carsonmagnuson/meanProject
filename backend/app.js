const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*"); // setting headers to bypass CORS error - allow access from all servers
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use("/api/posts",(req, res, next) => {
  const posts = [
    {
      id: 'h12jkkj3h4',
      title: 'first server-side post',
      content: 'gottem'
    },
    {
      id: 'h42kk8j99dj',
      title: 'second server-side post',
      content: 'gottem again!'
    }
  ];
  res.status(200).json({
    message: 'posts sent successfully.',
    posts: posts
  });
});

module.exports = app;
