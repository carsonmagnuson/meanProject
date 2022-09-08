const express = require('express');

const Post = require('../models/post');
const router = express.Router();


router.post('', (req, res, next) => { // change our posts
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

router.put('/:id', (req, res, next) => {
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

router.get('', (req, res, next) => { // get our posts
  Post.find()
    .then(documents => {
      res.status(200).json({ //200 means 'all g'
        message: 'Posts fetched successfully.',
        posts: documents
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found.'})
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result);
    res.status(200).json({message: "Post deleted."});
  });
});

module.exports = router;
