const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '24h'
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password, full_name, phone, address } = req.body;

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo user mới
    const userId = await User.create({
      username, email, password, full_name, phone, address
    });

    const user = await User.findById(userId);
    const token = generateToken(userId);

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin profile:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { register, login, getProfile };
