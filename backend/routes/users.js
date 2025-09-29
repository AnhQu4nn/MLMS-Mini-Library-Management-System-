const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Lấy tất cả người dùng (admin)
router.get('/', authenticateToken, requireRole(['admin']), getAllUsers);

// Lấy người dùng theo ID (admin hoặc chính user đó)
router.get('/:id', authenticateToken, getUserById);

// Tạo người dùng mới (admin)
router.post('/', authenticateToken, requireRole(['admin']), createUser);

// Cập nhật người dùng (admin hoặc chính user đó)
router.put('/:id', authenticateToken, updateUser);

// Xóa người dùng (admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteUser);

module.exports = router;
