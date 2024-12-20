const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  levels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  rating: { type: Number, default: 0 }, 
  totalRating: { type: Number, default: 0 }, 
  commentCount: { type: Number, default: 0 },
  price: { type: Number, default: 0 }, 
});

module.exports = mongoose.model("Course", courseSchema);
