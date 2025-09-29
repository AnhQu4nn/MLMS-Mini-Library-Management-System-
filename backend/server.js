const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const borrowingRoutes = require('./routes/borrowings');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'MLMS API đang hoạt động!', 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint không tồn tại' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Lỗi server:', err);
  res.status(500).json({ 
    message: 'Lỗi server nội bộ', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📚 MLMS API sẵn sàng phục vụ!`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
};

startServer();
