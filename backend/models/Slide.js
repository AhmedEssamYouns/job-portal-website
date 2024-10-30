const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  // Array of content strings
  content: [{ type: String, required: false }],
  // Array of code strings
  code: [{ type: String, default: '' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('Slide', slideSchema);
