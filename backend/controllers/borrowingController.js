const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');

const getAllBorrowings = async (req, res) => {
  try {
    const { user_id, status } = req.query;
    const filters = {};
    
    if (user_id) filters.user_id = user_id;
    if (status) filters.status = status;

    const borrowings = await Borrowing.getAll(filters);
    res.json({ borrowings });
  } catch (error) {
    console.error('Lỗi lấy danh sách mượn sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getBorrowingById = async (req, res) => {
  try {
    const { id } = req.params;
    const borrowing = await Borrowing.findById(id);
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin mượn sách' });
    }
    
    res.json({ borrowing });
  } catch (error) {
    console.error('Lỗi lấy thông tin mượn sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createBorrowing = async (req, res) => {
  try {
    const { book_id, borrow_date, due_date, notes } = req.body;
    const user_id = req.user.id;

    // Kiểm tra sách có sẵn không
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    if (book.available_copies <= 0) {
      return res.status(400).json({ message: 'Sách đã hết, không thể mượn' });
    }

    // Tạo bản ghi mượn sách
    const borrowingId = await Borrowing.create({
      user_id, book_id, borrow_date, due_date, notes
    });

    // Giảm số lượng sách có sẵn
    await Book.updateAvailableCopies(book_id, -1);

    const borrowing = await Borrowing.findById(borrowingId);
    
    res.status(201).json({ 
      message: 'Mượn sách thành công', 
      borrowing 
    });
  } catch (error) {
    console.error('Lỗi mượn sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { return_date } = req.body;

    const borrowing = await Borrowing.findById(id);
    if (!borrowing) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin mượn sách' });
    }

    if (borrowing.status === 'returned') {
      return res.status(400).json({ message: 'Sách đã được trả' });
    }

    // Cập nhật trạng thái trả sách
    await Borrowing.returnBook(id, return_date);
    
    // Tăng số lượng sách có sẵn
    await Book.updateAvailableCopies(borrowing.book_id, 1);

    const updatedBorrowing = await Borrowing.findById(id);
    
    res.json({ 
      message: 'Trả sách thành công', 
      borrowing: updatedBorrowing 
    });
  } catch (error) {
    console.error('Lỗi trả sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getUserBorrowings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const borrowings = await Borrowing.getByUserId(user_id);
    res.json({ borrowings });
  } catch (error) {
    console.error('Lỗi lấy lịch sử mượn sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    // Cập nhật trạng thái quá hạn
    await Borrowing.updateOverdueStatus();
    
    const overdueBooks = await Borrowing.getOverdueBooks();
    res.json({ overdueBooks });
  } catch (error) {
    console.error('Lỗi lấy sách quá hạn:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const stats = await Borrowing.getStatistics();
    res.json({ statistics: stats });
  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getAllBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBook,
  getUserBorrowings,
  getOverdueBooks,
  getStatistics
};
