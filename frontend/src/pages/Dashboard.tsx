import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Fade,
  Slide
} from '@mui/material';
import {
  MenuBook,
  People,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  Visibility,
  ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { borrowingsAPI, booksAPI, usersAPI } from '../services/api';
import { Statistics, Book, Borrowing } from '../types';
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [myBorrowings, setMyBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch books
        const booksResponse = await booksAPI.getAll();
        setRecentBooks(booksResponse.books.slice(0, 5));

        // Fetch user's borrowings
        if (user) {
          const borrowingsResponse = await borrowingsAPI.getMyBorrowings();
          setMyBorrowings(borrowingsResponse.borrowings.slice(0, 5));
        }

        // Fetch statistics for admin
        if (user?.role === 'admin') {
          const [statsResponse, usersResponse] = await Promise.all([
            borrowingsAPI.getStatistics(),
            usersAPI.getAll()
          ]);
          setStatistics({
            totalBooks: booksResponse.books.length,
            totalUsers: usersResponse.users.length,
            totalBorrowings: statsResponse.statistics.total,
            overdueBooks: statsResponse.statistics.overdue
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      default: return 'primary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      default: return 'Thành viên';
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

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <LinearProgress sx={{ width: 200, mb: 2 }} />
            <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Fade in timeout={600}>
        <Box>
          {/* Welcome Section */}
          <Slide direction="up" in timeout={400}>
            <Paper
              sx={{
                p: 4,
                mb: 4
              }}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}
                >
                  {user?.full_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600} gutterBottom>
                    Xin chào, {user?.full_name || user?.username}!
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={getRoleLabel(user?.role || 'member')}
                      color={getRoleColor(user?.role || 'member') as any}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Slide>

          {/* Statistics Cards */}
          {user?.role === 'admin' && statistics && (
            <Slide direction="up" in timeout={600}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography color="text.secondary" variant="body2" fontWeight={600}>
                            Tổng số sách
                          </Typography>
                          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                            {statistics.totalBooks}
                          </Typography>
                        </Box>
                        <Avatar sx={{ width: 48, height: 48 }}>
                          <MenuBook sx={{ fontSize: 24 }} />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography color="text.secondary" variant="body2" fontWeight={600}>
                            Người dùng
                          </Typography>
                          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                            {statistics.totalUsers}
                          </Typography>
                        </Box>
                        <Avatar sx={{ width: 48, height: 48 }}>
                          <People sx={{ fontSize: 24 }} />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography color="text.secondary" variant="body2" fontWeight={600}>
                            Lượt mượn
                          </Typography>
                          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                            {statistics.totalBorrowings}
                          </Typography>
                        </Box>
                        <Avatar sx={{ width: 48, height: 48 }}>
                          <TrendingUp sx={{ fontSize: 24 }} />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography color="text.secondary" variant="body2" fontWeight={600}>
                            Quá hạn
                          </Typography>
                          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                            {statistics.overdueBooks}
                          </Typography>
                        </Box>
                        <Avatar sx={{ width: 48, height: 48 }}>
                          <Warning sx={{ fontSize: 24 }} />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Slide>
          )}

          <Grid container spacing={4}>
            {/* Recent Books */}
            <Grid item xs={12} lg={6}>
              <Slide direction="right" in timeout={800}>
                <Card sx={{ height: 'fit-content' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                      <Typography variant="h6" fontWeight={700}>
                        📚 Sách mới nhất
                      </Typography>
                      <IconButton size="small" onClick={() => navigate('/books')}>
                        <Visibility />
                      </IconButton>
                    </Box>
                    
                    <List dense>
                      {recentBooks.map((book) => (
                        <ListItem key={book.id} sx={{ px: 0, borderRadius: 2, mb: 1 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                              <MenuBook />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography fontWeight={600} noWrap>
                                {book.title}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {book.author} • {book.category}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Chip
                              label={`${book.available_copies}/${book.total_copies}`}
                              color={book.available_copies > 0 ? 'success' : 'error'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>

            {/* My Borrowings */}
            <Grid item xs={12} lg={6}>
              <Slide direction="left" in timeout={800}>
                <Card sx={{ height: 'fit-content' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                      <Typography variant="h6" fontWeight={700}>
                        📖 Sách đang mượn
                      </Typography>
                      <IconButton size="small" onClick={() => navigate('/my-borrowings')}>
                        <ArrowForward />
                      </IconButton>
                    </Box>

                    {myBorrowings.length === 0 ? (
                      <Box textAlign="center" py={4}>
                        <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                        <Typography color="text.secondary">
                          Bạn chưa mượn sách nào
                        </Typography>
                      </Box>
                    ) : (
                      <List dense>
                        {myBorrowings.map((borrowing) => (
                          <ListItem key={borrowing.id} sx={{ px: 0, borderRadius: 2, mb: 1 }}>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: getStatusColor(borrowing.status) + '.main', width: 40, height: 40 }}>
                                <Schedule />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography fontWeight={600} noWrap>
                                  {borrowing.book_title}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  Hạn trả: {new Date(borrowing.due_date).toLocaleDateString('vi-VN')}
                                </Typography>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Chip
                                label={getStatusText(borrowing.status)}
                                color={getStatusColor(borrowing.status) as any}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Layout>
  );
};

export default Dashboard;
