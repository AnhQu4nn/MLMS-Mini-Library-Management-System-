const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { username, email, password, full_name, phone, address, role = 'member' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, phone, address, role]
    );
    
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, full_name, phone, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT id, username, email, full_name, phone, address, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  static async update(id, userData) {
    const { username, email, full_name, phone, address, role } = userData;
    const [result] = await pool.execute(
      'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, role = ? WHERE id = ?',
      [username, email, full_name, phone, address, role, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
