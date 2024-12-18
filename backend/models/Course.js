const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  levels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Level' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Course', courseSchema);
