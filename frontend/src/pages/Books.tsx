import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Alert,
  Snackbar,
  Menu,
  ListItemIcon,
  ListItemText,
  Fade,
  Slide
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  MenuBook,
  FilterList,
  MoreVert,
  Visibility,
  Star,
  Category,
  Person,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { booksAPI, borrowingsAPI } from '../services/api';
import { Book } from '../types';
import Layout from '../components/Layout/Layout';

const Books: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [myBorrowedBooks, setMyBorrowedBooks] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [borrowingBook, setBorrowingBook] = useState<Book | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [menuAnchor, setMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({});

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    category: '',
    description: '',
    total_copies: 1,
    location: ''
  });

  const [borrowForm, setBorrowForm] = useState({
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    notes: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchMyBorrowedBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, selectedCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.books);
    } catch (error) {
      showSnackbar('Lỗi khi tải danh sách sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await booksAPI.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMyBorrowedBooks = async () => {
    try {
      const response = await borrowingsAPI.getMyBorrowings();
      const borrowedBookIds = response.borrowings
        .filter((borrowing: any) => borrowing.status === 'borrowed')
        .map((borrowing: any) => borrowing.book_id);
      setMyBorrowedBooks(borrowedBookIds);
    } catch (error) {
      console.error('Error fetching my borrowed books:', error);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setBookForm({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        publication_year: book.publication_year || new Date().getFullYear(),
        category: book.category || '',
        description: book.description || '',
        total_copies: book.total_copies,
        location: book.location || ''
      });
    } else {
      setEditingBook(null);
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publication_year: new Date().getFullYear(),
        category: '',
        description: '',
        total_copies: 1,
        location: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
  };

  const handleSaveBook = async () => {
    try {
      if (editingBook) {
        await booksAPI.update(editingBook.id, bookForm);
        showSnackbar('Cập nhật sách thành công!', 'success');
      } else {
        await booksAPI.create(bookForm);
        showSnackbar('Thêm sách thành công!', 'success');
      }
      fetchBooks();
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi lưu sách', 'error');
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      try {
        await booksAPI.delete(bookId);
        showSnackbar('Xóa sách thành công!', 'success');
        fetchBooks();
      } catch (error) {
        showSnackbar('Có lỗi xảy ra khi xóa sách', 'error');
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, bookId: number) => {
    setMenuAnchor({ ...menuAnchor, [bookId]: event.currentTarget });
  };

  const handleMenuClose = (bookId: number) => {
    setMenuAnchor({ ...menuAnchor, [bookId]: null });
  };

  const handleOpenBorrowDialog = (book: Book) => {
    setBorrowingBook(book);
    setBorrowForm({
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setOpenBorrowDialog(true);
  };

  const handleCloseBorrowDialog = () => {
    setOpenBorrowDialog(false);
    setBorrowingBook(null);
  };

  const handleBorrowBook = async () => {
    if (!borrowingBook || !user) return;

    try {
      console.log('Attempting to borrow book:', borrowingBook.title);
      await borrowingsAPI.create({
        book_id: borrowingBook.id,
        borrow_date: new Date().toISOString().split('T')[0],
        due_date: borrowForm.due_date,
        notes: borrowForm.notes
      });
      console.log('Book borrowed successfully');
      showSnackbar('✅ Mượn sách thành công!', 'success');
      
      // Add notification
      addNotification({
        type: 'success',
        title: '📚 Mượn sách thành công',
        message: `Bạn đã mượn "${borrowingBook.title}" thành công. Hạn trả: ${new Date(borrowForm.due_date).toLocaleDateString('vi-VN')}`,
        bookTitle: borrowingBook.title,
        dueDate: borrowForm.due_date
      });
      
      fetchBooks(); // Refresh to update available copies
      fetchMyBorrowedBooks(); // Refresh borrowed books list
      handleCloseBorrowDialog();
    } catch (error) {
      console.error('Error borrowing book:', error);
      showSnackbar('❌ Có lỗi xảy ra khi mượn sách: ' + (error as Error).message, 'error');
    }
  };

  const canEdit = user?.role === 'admin';

  return (
    <Layout>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Slide direction="down" in timeout={400}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  📚 Quản lý Sách
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tổng cộng {filteredBooks.length} cuốn sách
                </Typography>
              </Box>
              {canEdit && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  size="large"
                  sx={{ borderRadius: 3 }}
                >
                  Thêm sách mới
                </Button>
              )}
            </Box>
          </Slide>

          {/* Search and Filter */}
          <Slide direction="up" in timeout={600}>
            <Card sx={{ mb: 4, p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Danh mục"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterList color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {filteredBooks.length} kết quả
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Slide>

          {/* Books Grid */}
          <Grid container spacing={3}>
            {filteredBooks.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <Fade in timeout={800 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.4)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48
                          }}
                        >
                          <MenuBook />
                        </Avatar>
                        {canEdit && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, book.id)}
                          >
                            <MoreVert />
                          </IconButton>
                        )}
                      </Box>

                      <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                        {book.title}
                      </Typography>

                      <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                        <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {book.author}
                        </Typography>
                      </Box>

                      {book.category && (
                        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                          <Category sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Chip label={book.category} size="small" />
                        </Box>
                      )}

                      {book.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            flexGrow: 1
                          }}
                        >
                          {book.description}
                        </Typography>
                      )}

                      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto', mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Còn lại
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {book.available_copies}/{book.total_copies}
                          </Typography>
                        </Box>
                        <Chip
                          label={book.available_copies > 0 ? 'Có sẵn' : 'Hết sách'}
                          color={book.available_copies > 0 ? 'success' : 'error'}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      {/* Borrow Button Logic */}
                      {book.available_copies === 0 ? (
                        // Hết sách - chỉ hiện chip đỏ
                        <Chip
                          label="Hết sách"
                          color="error"
                          sx={{ fontWeight: 600, width: '100%', justifyContent: 'center' }}
                        />
                      ) : myBorrowedBooks.includes(book.id) ? (
                        // Đã mượn - hiện chip xanh
                        <Chip
                          label="Đã mượn"
                          color="success"
                          sx={{ fontWeight: 600, width: '100%', justifyContent: 'center' }}
                        />
                      ) : (
                        // Có thể mượn - hiện button
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenBorrowDialog(book)}
                          sx={{ borderRadius: 2 }}
                        >
                          Mượn sách
                        </Button>
                      )}

                      {book.publication_year && (
                        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                          <CalendarToday sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            Xuất bản: {book.publication_year}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>

                    {/* Menu */}
                    <Menu
                      anchorEl={menuAnchor[book.id]}
                      open={Boolean(menuAnchor[book.id])}
                      onClose={() => handleMenuClose(book.id)}
                    >
                      <MenuItem onClick={() => { handleOpenDialog(book); handleMenuClose(book.id); }}>
                        <ListItemIcon>
                          <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Chỉnh sửa</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => { handleDeleteBook(book.id); handleMenuClose(book.id); }}>
                        <ListItemIcon>
                          <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Xóa</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {filteredBooks.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <MenuBook sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy sách nào
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          {editingBook ? '✏️ Chỉnh sửa sách' : '➕ Thêm sách mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên sách"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tác giả"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ISBN"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nhà xuất bản"
                value={bookForm.publisher}
                onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Năm xuất bản"
                type="number"
                value={bookForm.publication_year}
                onChange={(e) => setBookForm({ ...bookForm, publication_year: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Danh mục"
                value={bookForm.category}
                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số lượng"
                type="number"
                value={bookForm.total_copies}
                onChange={(e) => setBookForm({ ...bookForm, total_copies: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vị trí"
                value={bookForm.location}
                onChange={(e) => setBookForm({ ...bookForm, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={3}
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveBook}>
            {editingBook ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Borrow Dialog */}
      <Dialog
        open={openBorrowDialog}
        onClose={handleCloseBorrowDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          📖 Mượn sách: {borrowingBook?.title}
        </DialogTitle>
        <DialogContent>
          {borrowingBook && (
            <Box sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,188,212,0.1)', borderRadius: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <MenuBook />
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{borrowingBook.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {borrowingBook.author}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hạn trả"
                    type="date"
                    value={borrowForm.due_date}
                    onChange={(e) => setBorrowForm({ ...borrowForm, due_date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ghi chú (tùy chọn)"
                    multiline
                    rows={3}
                    value={borrowForm.notes}
                    onChange={(e) => setBorrowForm({ ...borrowForm, notes: e.target.value })}
                    placeholder="Thêm ghi chú về việc mượn sách..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseBorrowDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleBorrowBook}>
            Xác nhận mượn
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Books;
