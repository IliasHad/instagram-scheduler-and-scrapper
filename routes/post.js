require("dotenv").config();

const express = require("express");
const router = express.Router();
const {getPostData} = require("../helpers/get-post-data")
const checkAuth = require("../middleware/check-auth");
const mongoose = require('mongoose');

// Mongoose Models
const Post = require("../models/Post");

router.get("/", (req, res, next) => {
  Post.find().then((posts) => {
    console.log(posts);
    res.status(200).json({ posts });
  });
});


router.post("/", (req, res, next) => {
  console.log(req.body)
  let id = req.body.url.split("/p/")[1].split("/")[0];

  Post.find({ postId: id }).then((posts) => {
    console.log(posts)
    if (posts.length === 0) {
      getPostData(req.body.url).then(({ description, author, image, id, username_img }) => {
        const post = new Post({
          _id: mongoose.Types.ObjectId(),

            description,
            author,
            image,
            username_img,
            postId: id,
            isPublished: false
        
        });
    
          post
            .save()
    
            .then((result) => {
              console.log(result);
    
              res.status(201).json({
                message: "Post Created",
                posts: result
              });
            });
      });
   
    }
  });
});

module.exports = router;
