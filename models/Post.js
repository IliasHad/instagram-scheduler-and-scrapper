const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  username_img: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
    required: true,
  },


});
module.exports = mongoose.model("Post", userSchema);
