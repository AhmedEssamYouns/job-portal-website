const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
  name: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false }
});

module.exports = mongoose.model('Comment', commentSchema);
