const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  levels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  rating: { type: Number, default: 0 }, // Calculated based on comments
  totalRating: { type: Number, default: 0 }, // Sum of all comment ratings
  commentCount: { type: Number, default: 0 }, // Number of comments
});

module.exports = mongoose.model("Course", courseSchema);
