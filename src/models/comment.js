const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    type: { type: String, required: true, default: false },
    grade: { type: String, required: true, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, // ref sets up a relationship with the User model},{})
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
