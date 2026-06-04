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

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});