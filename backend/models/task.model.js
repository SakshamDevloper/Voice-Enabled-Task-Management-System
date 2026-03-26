const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'inprog', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'med', 'high'],
    default: 'med'
  },
  category: String,
  dueDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);