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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  Menu,
  ListItemIcon,
  ListItemText,
  Fade,
  Slide,
  Autocomplete
} from '@mui/material';
import {
  Add,
  Search,
  Assignment,
  FilterList,
  MoreVert,
  CheckCircle,
  Schedule,
  Warning,
  Person,
  MenuBook,
  CalendarToday,
  Undo
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { borrowingsAPI, booksAPI, usersAPI } from '../services/api';
import { Borrowing, Book, User } from '../types';
import Layout from '../components/Layout/Layout';

const Borrowings: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState<Borrowing[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [menuAnchor, setMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({});

  const [borrowingForm, setBorrowingForm] = useState({
    book_id: 0,
    user_id: 0,
    borrow_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBorrowings();
  }, [borrowings, searchTerm, selectedStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [borrowingsResponse, booksResponse, usersResponse] = await Promise.all([
        borrowingsAPI.getAll(),
        booksAPI.getAll(),
        usersAPI.getAll()
      ]);
      
      setBorrowings(borrowingsResponse.borrowings);
      setBooks(booksResponse.books);
      setUsers(usersResponse.users);
    } catch (error) {
      showSnackbar('Lỗi khi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterBorrowings = () => {
    let filtered = borrowings;

    if (searchTerm) {
      filtered = filtered.filter(borrowing =>
        borrowing.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrowing.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrowing.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(borrowing => borrowing.status === selectedStatus);
    }

    setFilteredBorrowings(filtered);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = () => {
    setBorrowingForm({
      book_id: 0,
      user_id: 0,
      borrow_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateBorrowing = async () => {
    try {
      await borrowingsAPI.create(borrowingForm);
      showSnackbar('Tạo phiếu mượn thành công!', 'success');
      fetchData();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi tạo phiếu mượn', 'error');
    }
  };

  const handleReturnBook = async (borrowingId: number) => {
    if (window.confirm('Xác nhận trả sách?')) {
      try {
        await borrowingsAPI.returnBook(borrowingId, new Date().toISOString().split('T')[0]);
        showSnackbar('Trả sách thành công!', 'success');
        fetchData();
      } catch (error) {
        showSnackbar('Có lỗi xảy ra khi trả sách', 'error');
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, borrowingId: number) => {
    setMenuAnchor({ ...menuAnchor, [borrowingId]: event.currentTarget });
  };

  const handleMenuClose = (borrowingId: number) => {
    setMenuAnchor({ ...menuAnchor, [borrowingId]: null });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrowed': return <Schedule />;
      case 'overdue': return <Warning />;
      case 'returned': return <CheckCircle />;
      default: return <Assignment />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed': return 'primary';
      case 'overdue': return 'error';
      case 'returned': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'borrowed': return 'Đang mượn';
      case 'overdue': return 'Quá hạn';
      case 'returned': return 'Đã trả';
      default: return status;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === 'borrowed' && new Date(dueDate) < new Date();
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const availableBooks = books.filter(book => book.available_copies > 0);

  return (
    <Layout>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Slide direction="down" in timeout={400}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  📖 Quản lý Mượn/Trả Sách
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tổng cộng {filteredBorrowings.length} phiếu mượn
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenDialog}
                size="large"
                sx={{ borderRadius: 3 }}
              >
                Tạo phiếu mượn
              </Button>
            </Box>
          </Slide>

          {/* Statistics Cards */}
          <Slide direction="up" in timeout={600}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2" fontWeight={600}>
                          Đang mượn
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                          {borrowings.filter(b => b.status === 'borrowed').length}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <Schedule sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2" fontWeight={600}>
                          Quá hạn
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                          {borrowings.filter(b => b.status === 'overdue' || isOverdue(b.due_date, b.status)).length}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                        <Warning sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2" fontWeight={600}>
                          Đã trả
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                          {borrowings.filter(b => b.status === 'returned').length}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                        <CheckCircle sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2" fontWeight={600}>
                          Tổng cộng
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                          {borrowings.length}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                        <Assignment sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Slide>

          {/* Search and Filter */}
          <Slide direction="up" in timeout={800}>
            <Card sx={{ mb: 4, p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm theo sách, người mượn..."
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
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={selectedStatus}
                      label="Trạng thái"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterList color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="borrowed">Đang mượn</MenuItem>
                      <MenuItem value="overdue">Quá hạn</MenuItem>
                      <MenuItem value="returned">Đã trả</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {filteredBorrowings.length} kết quả
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Slide>

          {/* Borrowings Table */}
          <Slide direction="up" in timeout={1000}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(0,188,212,0.1)' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Sách</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Người mượn</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ngày mượn</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Hạn trả</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBorrowings.map((borrowing) => (
                    <TableRow
                      key={borrowing.id}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                            <MenuBook />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} noWrap>
                              {borrowing.book_title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {borrowing.book_author}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {borrowing.user_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {borrowing.user_email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(borrowing.borrow_date).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={isOverdue(borrowing.due_date, borrowing.status) ? 'error.main' : 'text.primary'}
                        >
                          {new Date(borrowing.due_date).toLocaleDateString('vi-VN')}
                        </Typography>
                        {isOverdue(borrowing.due_date, borrowing.status) && (
                          <Typography variant="caption" color="error.main">
                            Quá hạn {getDaysOverdue(borrowing.due_date)} ngày
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(isOverdue(borrowing.due_date, borrowing.status) ? 'overdue' : borrowing.status)}
                          label={getStatusText(isOverdue(borrowing.due_date, borrowing.status) ? 'overdue' : borrowing.status)}
                          color={getStatusColor(isOverdue(borrowing.due_date, borrowing.status) ? 'overdue' : borrowing.status) as any}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {borrowing.status === 'borrowed' && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Undo />}
                            onClick={() => handleReturnBook(borrowing.id)}
                            sx={{ borderRadius: 20 }}
                          >
                            Trả sách
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Slide>

          {filteredBorrowings.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy phiếu mượn nào
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>

      {/* Create Borrowing Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>📖 Tạo phiếu mượn sách</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={availableBooks}
                getOptionLabel={(book) => `${book.title} - ${book.author}`}
                value={availableBooks.find(book => book.id === borrowingForm.book_id) || null}
                onChange={(_, value) => setBorrowingForm({ ...borrowingForm, book_id: value?.id || 0 })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn sách"
                    required
                    fullWidth
                  />
                )}
                renderOption={(props, book) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography fontWeight={600}>{book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.author} • Còn {book.available_copies}/{book.total_copies}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={users}
                getOptionLabel={(user) => `${user.full_name} (@${user.username})`}
                value={users.find(user => user.id === borrowingForm.user_id) || null}
                onChange={(_, value) => setBorrowingForm({ ...borrowingForm, user_id: value?.id || 0 })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn người mượn"
                    required
                    fullWidth
                  />
                )}
                renderOption={(props, user) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography fontWeight={600}>{user.full_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username} • {user.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày mượn"
                type="date"
                value={borrowingForm.borrow_date}
                onChange={(e) => setBorrowingForm({ ...borrowingForm, borrow_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hạn trả"
                type="date"
                value={borrowingForm.due_date}
                onChange={(e) => setBorrowingForm({ ...borrowingForm, due_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={3}
                value={borrowingForm.notes}
                onChange={(e) => setBorrowingForm({ ...borrowingForm, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreateBorrowing}
            disabled={!borrowingForm.book_id || !borrowingForm.user_id}
          >
            Tạo phiếu mượn
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

export default Borrowings;
