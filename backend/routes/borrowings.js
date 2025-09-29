const express = require('express');
const router = express.Router();
const {
  getAllBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBook,
  getUserBorrowings,
  getOverdueBooks,
  getStatistics
} = require('../controllers/borrowingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Lấy tất cả mượn sách (admin)
router.get('/', authenticateToken, requireRole(['admin']), getAllBorrowings);

// Lấy thống kê (admin)
router.get('/statistics', authenticateToken, requireRole(['admin']), getStatistics);

// Lấy sách quá hạn (admin)
router.get('/overdue', authenticateToken, requireRole(['admin']), getOverdueBooks);

// Lấy lịch sử mượn sách của user hiện tại
router.get('/my-borrowings', authenticateToken, getUserBorrowings);

// Lấy thông tin mượn sách theo ID
router.get('/:id', authenticateToken, getBorrowingById);

// Tạo mượn sách mới
router.post('/', authenticateToken, createBorrowing);

// Trả sách
router.put('/:id/return', authenticateToken, returnBook);

module.exports = router;
