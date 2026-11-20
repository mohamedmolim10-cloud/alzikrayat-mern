const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  occupation: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
