const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: 604800 }); // 7 days in seconds
};

// Cached user lookups for performance
const userCache = new Map();
const CACHE_TTL = 60000; // 1 minute

const getCachedUser = async (email, phone) => {
  const cacheKey = email || phone;
  const cached = userCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }
  
  const user = await User.findOne({ $or: [{ email }, { phone }] });
  if (user) {
    userCache.set(cacheKey, { user, timestamp: Date.now() });
  }
  return user;
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!email && !phone) return res.status(400).json({ message: 'Email or phone required' });

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) return res.status(409).json({ message: 'User already registered' });

    const hash = password ? await bcrypt.hash(password, 12) : null;
    const user = await User.create({ 
      firstName, 
      lastName, 
      email, 
      phone,
      password: hash,
      provider: password ? 'email' : 'phone'
    });

    const token = generateToken(user._id);
    
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email, 
        phone, 
        firstName, 
        lastName 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const user = await getCachedUser(email, phone);
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (email && password) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        phone: user.phone, 
        firstName: user.firstName, 
        avatar: user.avatar 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.oauthLogin = async (req, res) => {
  try {
    const { provider, providerId, email, firstName, lastName, avatar } = req.body;
    let user = await User.findOne({ $or: [{ providerId }, { email }] });
    
    if (!user) {
      user = await User.create({ provider, providerId, email, firstName, lastName, avatar });
    } else if (user.providerId !== providerId) {
      user.providerId = providerId;
      user.provider = provider;
      if (!user.avatar) user.avatar = avatar;
      await user.save();
    }

    // Clear cache after user update
    const cacheKey = email || user.phone;
    userCache.delete(cacheKey);

    const token = generateToken(user._id);
    
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        firstName: user.firstName, 
        avatar: user.avatar, 
        provider 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-password');
    
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newToken = generateToken(user._id);
    
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ 
      token: newToken, 
      user: { 
        id: user._id, 
        email: user.email, 
        firstName: user.firstName, 
        avatar: user.avatar 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('-password');
    
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cache periodically
setInterval(() => {
  for (const [key, value] of userCache.entries()) {
    if (Date.now() - value.timestamp > CACHE_TTL) {
      userCache.delete(key);
    }
  }
}, CACHE_TTL);