const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true }, 
  date: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false }
});

module.exports = mongoose.model('Comment', commentSchema);
