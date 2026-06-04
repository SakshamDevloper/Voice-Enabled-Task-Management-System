const Task = require('../models/task.model');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.sub });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.sub
    });

    const { createNotification } = require('./notification.controller');
    await createNotification(
      req.user.sub,
      'task-created',
      'Task Created',
      `Task "${task.title}" has been successfully created.`,
      task._id
    );

    res.json(task);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findOne({ _id: req.params.id, user: req.user.sub });
    if (!oldTask) return res.status(404).json({ error: 'Task not found' });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.sub },
      req.body,
      { new: true }
    );

    const { createNotification } = require('./notification.controller');
    if (req.body.status === 'done' && oldTask.status !== 'done') {
      await createNotification(
        req.user.sub,
        'task-completed',
        'Task Completed',
        `Task "${task.title}" has been marked as completed.`,
        task._id
      );
    } else if (req.body.status && req.body.status !== oldTask.status) {
      await createNotification(
        req.user.sub,
        'task-updated',
        'Task Status Updated',
        `Task "${task.title}" status changed to ${req.body.status}.`,
        task._id
      );
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.sub
    });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};