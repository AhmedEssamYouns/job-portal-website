const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slide' }],
  completedByUsers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completed: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Level', levelSchema);
