import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Alert,
  Fade,
  Slide,
  LinearProgress,
  Button
} from '@mui/material';
import {
  Search,
  Assignment,
  FilterList,
  CheckCircle,
  Schedule,
  Warning,
  MenuBook,
  CalendarToday,
  Person,
  Timeline
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { borrowingsAPI } from '../services/api';
import { Borrowing } from '../types';
import Layout from '../components/Layout/Layout';

const MyBorrowings: React.FC = () => {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchMyBorrowings();
  }, []);

  useEffect(() => {
    filterBorrowings();
  }, [borrowings, searchTerm, selectedStatus]);

  const fetchMyBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingsAPI.getMyBorrowings();
      setBorrowings(response.borrowings);
    } catch (error) {
      console.error('Error fetching my borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBorrowings = () => {
    let filtered = borrowings;

    if (searchTerm) {
      filtered = filtered.filter(borrowing =>
        borrowing.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrowing.book_author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(borrowing => borrowing.status === selectedStatus);
    }

    setFilteredBorrowings(filtered);
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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const borrowedCount = borrowings.filter(b => b.status === 'borrowed').length;
  const overdueCount = borrowings.filter(b => b.status === 'overdue' || isOverdue(b.due_date, b.status)).length;
  const returnedCount = borrowings.filter(b => b.status === 'returned').length;

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <LinearProgress sx={{ width: 200, mb: 2 }} />
            <Typography color="text.secondary">Đang tải lịch sử mượn sách...</Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Slide direction="down" in timeout={400}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  📚 Lịch sử mượn sách
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Theo dõi tất cả sách bạn đã mượn
                </Typography>
              </Box>
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
                          {borrowedCount}
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
                          {overdueCount}
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
                          {returnedCount}
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
                        <Timeline sx={{ fontSize: 28 }} />
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
                    placeholder="Tìm kiếm theo tên sách, tác giả..."
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

          {/* Borrowings Grid */}
          <Grid container spacing={3}>
            {filteredBorrowings.map((borrowing, index) => (
              <Grid item xs={12} md={6} lg={4} key={borrowing.id}>
                <Fade in timeout={1000 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
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
                        <Chip
                          icon={getStatusIcon(isOverdue(borrowing.due_date, borrowing.status) ? 'overdue' : borrowing.status)}
                          label={getStatusText(isOverdue(borrowing.due_date, borrowing.status) ? 'overdue' : borrowing.status)}
                          color={getStatusColor(isOverdue(borrowing.due_date, borrowing.status) ? 'overdue' : borrowing.status) as any}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                        {borrowing.book_title}
                      </Typography>

                      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {borrowing.book_author}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Mượn: {new Date(borrowing.borrow_date).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                          <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography
                            variant="body2"
                            color={isOverdue(borrowing.due_date, borrowing.status) ? 'error.main' : 'text.secondary'}
                          >
                            Hạn: {new Date(borrowing.due_date).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>

                        {borrowing.status === 'borrowed' && (
                          <Box sx={{ mt: 2 }}>
                            {isOverdue(borrowing.due_date, borrowing.status) ? (
                              <Alert severity="error" sx={{ p: 1 }}>
                                <Typography variant="caption" fontWeight={600}>
                                  Quá hạn {getDaysOverdue(borrowing.due_date)} ngày
                                </Typography>
                              </Alert>
                            ) : (
                              <Alert severity="info" sx={{ p: 1 }}>
                                <Typography variant="caption" fontWeight={600}>
                                  Còn {getDaysUntilDue(borrowing.due_date)} ngày
                                </Typography>
                              </Alert>
                            )}
                          </Box>
                        )}

                        {borrowing.return_date && (
                          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                            <CheckCircle sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                            <Typography variant="body2" color="success.main">
                              Đã trả: {new Date(borrowing.return_date).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        )}

                        {borrowing.notes && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Ghi chú: {borrowing.notes}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {filteredBorrowings.length === 0 && (
            <Box textAlign="center" py={8}>
              <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {borrowings.length === 0 ? 'Bạn chưa mượn sách nào' : 'Không tìm thấy kết quả'}
              </Typography>
              {borrowings.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Hãy khám phá thư viện và mượn những cuốn sách yêu thích!
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Layout>
  );
};

export default MyBorrowings;
