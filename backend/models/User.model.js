const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName:  { type: String, trim: true },
  email:     { type: String, unique: true, sparse: true, lowercase: true },
  phone:     { type: String, unique: true, sparse: true },
  password:  { type: String },
  role:      { type: String, default: 'user' },
  provider:  { type: String, enum: ['email', 'github', 'microsoft', 'google', 'phone'], default: 'email' },
  providerId: { type: String },
  avatar:    { type: String },
  notificationsEnabled: { type: Boolean, default: true },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sound: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
