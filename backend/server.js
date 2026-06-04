const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Performance optimizations
app.use(compression({ level: 6 })); // Gzip compression
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Optimized body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Health check endpoint for quick responses
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// MongoDB connection with optimized settings
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 45000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true
})
  .then(() => console.log('MongoDB connected with optimized pooling'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Setup WebSocket server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => {
    clients.delete(ws);
  });
});

global.broadcastNotification = (notification) => {
  const payload = JSON.stringify(notification);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
};

// Scheduler for Overdue Tasks
const Task = require('./models/task.model');
const Notification = require('./models/Notification.model');
const { createNotification } = require('./controllers/notification.controller');

const checkOverdueTasks = async () => {
  try {
    const now = new Date();
    const overdueTasks = await Task.find({
      dueDate: { $lte: now },
      status: { $ne: 'done' }
    });

    for (const task of overdueTasks) {
      const alreadyNotified = await Notification.findOne({
        taskId: task._id,
        type: 'task-overdue'
      });

      if (!alreadyNotified) {
        await createNotification(
          task.user,
          'task-overdue',
          'Task Overdue Alert',
          `Task "${task.title}" is past its due date/time!`,
          task._id
        );
      }
    }
  } catch (err) {
    console.error('Error checking overdue tasks:', err);
  }
};

// Start checking every 15 seconds
setInterval(checkOverdueTasks, 15000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});