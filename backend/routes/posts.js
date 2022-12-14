const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type.");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); // this is executed relative to the server.js file, so path must reflect that
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single("image"), (req, res, next) => { // change our posts
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({ // 201 means 'all g, new resource created'
      message: 'Posts added successfully.',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
  console.log(post);
});

router.put(
  '/:id',
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    })
    console.log(req.file);
    Post.updateOne({_id: req.params.id}, post).then(result => {
      console.log(result);
      res.status(200).json({message: "Update successful."});
    });
  });

router.get('', (req, res, next) => { // get our posts
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage-1)) // skip to after whatever current page is displaying
      .limit(pageSize); // cuts off the rest of results after page size limit - can be inefficient for large datasets tho
  }
  postQuery
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
