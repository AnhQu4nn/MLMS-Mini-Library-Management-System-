const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ users });
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.findByUsername(userData.username);
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const existingEmail = await User.findByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const userId = await User.create(userData);
    const user = await User.findById(userId);
    
    res.status(201).json({ 
      message: 'Thêm người dùng thành công', 
      user 
    });
  } catch (error) {
    console.error('Lỗi thêm người dùng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    // Kiểm tra quyền: chỉ admin hoặc chính user đó mới được cập nhật
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Không có quyền cập nhật thông tin này' });
    }
    
    const updated = await User.update(id, userData);
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    const user = await User.findById(id);
    res.json({ 
      message: 'Cập nhật người dùng thành công', 
      user 
    });
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Không cho phép xóa chính mình
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'Không thể xóa tài khoản của chính mình' });
    }
    
    const deleted = await User.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
