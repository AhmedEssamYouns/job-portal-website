const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  sections: [
    {
      content: { type: String, required: false },
      code: { type: String, default: '' },
      questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    },
  ],
});

module.exports = mongoose.model('Slide', slideSchema);
