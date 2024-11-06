const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq', 'multiple-correct', 'ordering', 'drag-and-drop'],
    required: true,
  },
  options: [{ type: String }], 
  correctAnswers: [{ type: String }],
  slideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  code: { type: String }, 
});

module.exports = mongoose.model('Question', questionSchema);
