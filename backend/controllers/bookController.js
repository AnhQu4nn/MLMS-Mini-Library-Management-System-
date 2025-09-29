const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
  try {
    const { category, author, title } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (author) filters.author = author;
    if (title) filters.title = title;

    const books = await Book.getAll(filters);
    res.json({ books });
  } catch (error) {
    console.error('Lỗi lấy danh sách sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    res.json({ book });
  } catch (error) {
    console.error('Lỗi lấy thông tin sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const bookData = req.body;
    const bookId = await Book.create(bookData);
    const book = await Book.findById(bookId);
    
    res.status(201).json({ 
      message: 'Thêm sách thành công', 
      book 
    });
  } catch (error) {
    console.error('Lỗi thêm sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = req.body;
    
    const updated = await Book.update(id, bookData);
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    const book = await Book.findById(id);
    res.json({ 
      message: 'Cập nhật sách thành công', 
      book 
    });
  } catch (error) {
    console.error('Lỗi cập nhật sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Book.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    res.json({ message: 'Xóa sách thành công' });
  } catch (error) {
    console.error('Lỗi xóa sách:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.getAvailableBooks();
    res.json({ books });
  } catch (error) {
    console.error('Lỗi lấy sách có sẵn:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Book.getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAvailableBooks,
  getCategories
};
