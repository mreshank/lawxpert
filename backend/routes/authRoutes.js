const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  let token = null;
  // Check cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header
  if (!token && req.headers['authorization']) {
    const header = req.headers['authorization'];
    if (header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }
  }
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "9NUG9mteauGQbEKGAqbehYZDeqwTP3WZJzuNQtYf");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.profile);

module.exports = router; 