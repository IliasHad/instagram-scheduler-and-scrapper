require("dotenv").config();

const express = require("express");
const router = express.Router();
const { getPostData } = require("../helpers/get-post-data");
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const adapter = new FileAsync("db.json");

// Mongoose Models
const Post = require("../models/Post");
low(adapter).then((db) => {
  router.get("/", (req, res, next) => {
    const posts = db.get("posts").find().value();
    console.log(posts);
    res.status(200).json({ posts });
  });

  router.post("/", (req, res, next) => {
    console.log(req.body);
    let id = req.body.url.split("/p/")[1].split("/")[0];

    const posts = db
      .get("posts")
      .find({ postId: id })
      .value()

      .then((post) => {
        console.log(post);
      });

    /*
    if (posts.length === 0) {
      getPostData(req.body.url).then(
        ({ description, author, image, id, username_img }) => {
          db.get("posts")
            .push({
              description,
              author,
              image,
              username_img,
              postId: id,
              isPublished: false,
            })
            .write();

          res.status(201).json({
            message: "Post Created",
            posts: db.get("posts").find().value(),
          });
        }
       
      );
    }*/
  });
  // Set db default values
  return db.defaults({ posts: [] }).write();
});

module.exports = router;
