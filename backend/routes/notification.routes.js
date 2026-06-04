const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notification.controller');
const protect = require('../middleware/auth.middleware');

router.get('/user/:userId', protect, getNotifications);
router.patch('/:notificationId/read', protect, markAsRead);
router.delete('/:notificationId', protect, deleteNotification);

module.exports = router;
