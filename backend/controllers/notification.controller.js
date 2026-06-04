const Notification = require('../models/Notification.model');

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNotification = async (userId, type, title, message, taskId = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      taskId
    });
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err.message);
  }
};

exports.clearOldNotifications = async (userId) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({
      userId,
      createdAt: { $lt: thirtyDaysAgo }
    });
  } catch (err) {
    console.error('Error clearing old notifications:', err.message);
  }
};
