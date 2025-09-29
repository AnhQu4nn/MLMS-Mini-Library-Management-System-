import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Chip,
  Paper,
  Alert,
  Snackbar,
  Fade,
  Slide,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Home,
  Edit,
  Save,
  Cancel,
  AdminPanelSettings,
  LibraryBooks,
  PersonOutline
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import Layout from '../components/Layout/Layout';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEdit = () => {
    setProfileForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setProfileForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await usersAPI.update(user.id, profileForm);
      showSnackbar('Cập nhật thông tin thành công!', 'success');
      setEditing(false);
      
      // Update local user data
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Refresh page to update user context
      window.location.reload();
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi cập nhật thông tin', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings />;
      default: return <PersonOutline />;
    }
  };

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

  if (!user) return null;

  return (
    <Layout>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Slide direction="down" in timeout={400}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  👤 Hồ sơ cá nhân
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quản lý thông tin tài khoản của bạn
                </Typography>
              </Box>
              {!editing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  size="large"
                  sx={{ borderRadius: 3 }}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    size="large"
                    sx={{ borderRadius: 3 }}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    size="large"
                    sx={{ borderRadius: 3 }}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </Box>
              )}
            </Box>
          </Slide>

          <Grid container spacing={4}>
            {/* Profile Card */}
            <Grid item xs={12} md={4}>
              <Slide direction="right" in timeout={600}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(45deg, #00BCD4, #4DD0E1)',
                      fontSize: '3rem',
                      fontWeight: 700
                    }}
                  >
                    {user.full_name.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {user.full_name}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    @{user.username}
                  </Typography>

                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={getRoleLabel(user.role)}
                    color={getRoleColor(user.role) as any}
                    sx={{ fontWeight: 600, mb: 3 }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    Thành viên từ {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </Typography>
                </Card>
              </Slide>
            </Grid>

            {/* Information Card */}
            <Grid item xs={12} md={8}>
              <Slide direction="left" in timeout={600}>
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                      Thông tin cá nhân
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Họ và tên"
                          value={editing ? profileForm.full_name : user.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color={editing ? 'primary' : 'action'} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={editing ? profileForm.email : user.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color={editing ? 'primary' : 'action'} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          value={editing ? profileForm.phone : user.phone || 'Chưa cập nhật'}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone color={editing ? 'primary' : 'action'} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Tên đăng nhập"
                          value={user.username}
                          disabled
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Địa chỉ"
                          multiline
                          rows={3}
                          value={editing ? profileForm.address : user.address || 'Chưa cập nhật'}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                                <Home color={editing ? 'primary' : 'action'} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>

            {/* Account Security */}
            <Grid item xs={12}>
              <Slide direction="up" in timeout={800}>
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                      🔒 Bảo mật tài khoản
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, bgcolor: 'rgba(0,188,212,0.1)', border: '1px solid rgba(0,188,212,0.2)' }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Mật khẩu
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Thay đổi mật khẩu định kỳ để bảo mật tài khoản
                          </Typography>
                          <Button variant="outlined" size="small">
                            Đổi mật khẩu
                          </Button>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, bgcolor: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)' }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Phiên đăng nhập
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Đăng xuất khỏi tất cả thiết bị
                          </Typography>
                          <Button variant="outlined" color="error" size="small" onClick={logout}>
                            Đăng xuất
                          </Button>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Fade>

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

export default Profile;
