const { pool } = require('../config/database');

class Book {
  static async create(bookData) {
    const { 
      title, author, isbn, publisher, publication_year, 
      category, description, total_copies = 1, location 
    } = bookData;
    
    const [result] = await pool.execute(
      `INSERT INTO books (title, author, isbn, publisher, publication_year, 
       category, description, total_copies, available_copies, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, publisher, publication_year, category, 
       description, total_copies, total_copies, location]
    );
    
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll(filters = {}) {
    let query = 'SELECT * FROM books';
    let params = [];
    let conditions = [];

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.author) {
      conditions.push('author LIKE ?');
      params.push(`%${filters.author}%`);
    }

    if (filters.title) {
      conditions.push('title LIKE ?');
      params.push(`%${filters.title}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async update(id, bookData) {
    const { 
      title, author, isbn, publisher, publication_year, 
      category, description, total_copies, location 
    } = bookData;
    
    const [result] = await pool.execute(
      `UPDATE books SET title = ?, author = ?, isbn = ?, publisher = ?, 
       publication_year = ?, category = ?, description = ?, total_copies = ?, location = ? 
       WHERE id = ?`,
      [title, author, isbn, publisher, publication_year, category, 
       description, total_copies, location, id]
    );
    
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateAvailableCopies(id, change) {
    const [result] = await pool.execute(
      'UPDATE books SET available_copies = available_copies + ? WHERE id = ?',
      [change, id]
    );
    return result.affectedRows > 0;
  }

  static async getAvailableBooks() {
    const [rows] = await pool.execute(
      'SELECT * FROM books WHERE available_copies > 0 ORDER BY title'
    );
    return rows;
  }

  static async getCategories() {
    const [rows] = await pool.execute(
      'SELECT DISTINCT category FROM books WHERE category IS NOT NULL ORDER BY category'
    );
    return rows.map(row => row.category);
  }
}

module.exports = Book;
