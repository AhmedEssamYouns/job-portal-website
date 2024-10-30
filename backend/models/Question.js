const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq', 'multiple-correct', 'ordering', 'drag-and-drop'],
    required: true,
  },
  options: [{ type: String }], // Options for MCQ or multiple correct
  correctAnswers: [{ type: String }], // Correct answer(s) for multiple correct or ordering
  slideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  code: { type: String }, // Field to store code snippets related to the question
});

module.exports = mongoose.model('Question', questionSchema);
