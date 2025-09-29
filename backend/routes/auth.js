const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Lấy thông tin profile
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
