const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  passwordResetCode: { type: String, default: null },
  passwordResetVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }, 

});

module.exports = mongoose.model('User', userSchema);
