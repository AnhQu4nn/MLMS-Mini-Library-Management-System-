const { pool } = require('../config/database');

class Borrowing {
  static async create(borrowingData) {
    const { user_id, book_id, borrow_date, due_date, notes } = borrowingData;
    
    const [result] = await pool.execute(
      'INSERT INTO borrowings (user_id, book_id, borrow_date, due_date, notes) VALUES (?, ?, ?, ?, ?)',
      [user_id, book_id, borrow_date, due_date, notes]
    );
    
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, u.full_name as user_name, u.email as user_email, 
       bk.title as book_title, bk.author as book_author
       FROM borrowings b
       JOIN users u ON b.user_id = u.id
       JOIN books bk ON b.book_id = bk.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT b.*, u.full_name as user_name, u.email as user_email, 
             bk.title as book_title, bk.author as book_author
      FROM borrowings b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
    `;
    let params = [];
    let conditions = [];

    if (filters.user_id) {
      conditions.push('b.user_id = ?');
      params.push(filters.user_id);
    }

    if (filters.status) {
      conditions.push('b.status = ?');
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT b.*, bk.title as book_title, bk.author as book_author
       FROM borrowings b
       JOIN books bk ON b.book_id = bk.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async returnBook(id, return_date) {
    const [result] = await pool.execute(
      'UPDATE borrowings SET return_date = ?, status = "returned" WHERE id = ?',
      [return_date, id]
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE borrowings SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async getOverdueBooks() {
    const [rows] = await pool.execute(
      `SELECT b.*, u.full_name as user_name, u.email as user_email, 
             bk.title as book_title, bk.author as book_author,
             DATEDIFF(CURDATE(), b.due_date) as days_overdue
       FROM borrowings b
       JOIN users u ON b.user_id = u.id
       JOIN books bk ON b.book_id = bk.id
       WHERE b.status = 'borrowed' AND b.due_date < CURDATE()
       ORDER BY days_overdue DESC`
    );
    return rows;
  }

  static async updateOverdueStatus() {
    const [result] = await pool.execute(
      `UPDATE borrowings SET status = 'overdue' 
       WHERE status = 'borrowed' AND due_date < CURDATE()`
    );
    return result.affectedRows;
  }

  static async getStatistics() {
    const [totalBorrowings] = await pool.execute(
      'SELECT COUNT(*) as count FROM borrowings'
    );
    
    const [activeBorrowings] = await pool.execute(
      'SELECT COUNT(*) as count FROM borrowings WHERE status = "borrowed"'
    );
    
    const [overdueBorrowings] = await pool.execute(
      'SELECT COUNT(*) as count FROM borrowings WHERE status = "overdue"'
    );

    return {
      total: totalBorrowings[0].count,
      active: activeBorrowings[0].count,
      overdue: overdueBorrowings[0].count
    };
  }
}

module.exports = Borrowing;
