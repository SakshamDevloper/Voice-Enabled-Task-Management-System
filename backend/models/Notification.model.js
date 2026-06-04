const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['task-created', 'task-completed', 'task-updated', 'task-overdue', 'task-assigned'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  read: { type: Boolean, default: false },
  sound: { type: Boolean, default: true },
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-delete notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('Notification', notificationSchema);
