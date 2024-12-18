const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  levels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Level' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  rating: { type: Number, default: 0 } // Average rating for the course
});

courseSchema.methods.calculateRating = async function() {
  const comments = await this.populate('comments').execPopulate();
  const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
  this.rating = totalRating / comments.length;
  await this.save();
};

module.exports = mongoose.model('Course', courseSchema);
