const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
});

module.exports = mongoose.model("Comment", commentSchema);
