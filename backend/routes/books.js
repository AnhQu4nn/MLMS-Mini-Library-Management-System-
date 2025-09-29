const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAvailableBooks,
  getCategories
} = require('../controllers/bookController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Lấy tất cả sách (public)
router.get('/', getAllBooks);

// Lấy sách có sẵn (public)
router.get('/available', getAvailableBooks);

// Lấy danh mục sách (public)
router.get('/categories', getCategories);

// Lấy sách theo ID (public)
router.get('/:id', getBookById);

// Tạo sách mới (admin, librarian)
router.post('/', authenticateToken, requireRole(['admin', 'librarian']), createBook);

// Cập nhật sách (admin, librarian)
router.put('/:id', authenticateToken, requireRole(['admin', 'librarian']), updateBook);

// Xóa sách (admin, librarian)
router.delete('/:id', authenticateToken, requireRole(['admin', 'librarian']), deleteBook);

module.exports = router;
