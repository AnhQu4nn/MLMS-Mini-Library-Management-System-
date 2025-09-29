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
  Slide
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Person,
  FilterList,
  MoreVert,
  Email,
  Phone,
  Home,
  AdminPanelSettings,
  LibraryBooks,
  PersonOutline
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import { User } from '../types';
import Layout from '../components/Layout/Layout';

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [menuAnchor, setMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({});

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    address: '',
    role: 'member' as 'admin' | 'member',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.users);
    } catch (error) {
      showSnackbar('Lỗi khi tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role,
        password: ''
      });
    } else {
      setEditingUser(null);
      setUserForm({
        username: '',
        email: '',
        full_name: '',
        phone: '',
        address: '',
        role: 'member',
        password: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        const updateData = { ...userForm };
        if (!updateData.password) {
          delete updateData.password;
        }
        await usersAPI.update(editingUser.id, updateData);
        showSnackbar('Cập nhật người dùng thành công!', 'success');
      } else {
        await usersAPI.create(userForm);
        showSnackbar('Thêm người dùng thành công!', 'success');
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi lưu người dùng', 'error');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (currentUser?.id === userId) {
      showSnackbar('Không thể xóa tài khoản của chính mình', 'error');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await usersAPI.delete(userId);
        showSnackbar('Xóa người dùng thành công!', 'success');
        fetchUsers();
      } catch (error) {
        showSnackbar('Có lỗi xảy ra khi xóa người dùng', 'error');
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setMenuAnchor({ ...menuAnchor, [userId]: event.currentTarget });
  };

  const handleMenuClose = (userId: number) => {
    setMenuAnchor({ ...menuAnchor, [userId]: null });
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

  const canEdit = currentUser?.role === 'admin';

  return (
    <Layout>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Slide direction="down" in timeout={400}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  👥 Quản lý Người dùng
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tổng cộng {filteredUsers.length} người dùng
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
                  Thêm người dùng
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
                    placeholder="Tìm kiếm theo tên, username, email..."
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
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      value={selectedRole}
                      label="Vai trò"
                      onChange={(e) => setSelectedRole(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterList color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="admin">Quản trị viên</MenuItem>
                      <MenuItem value="member">Thành viên</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {filteredUsers.length} kết quả
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Slide>

          {/* Users Table */}
          <Slide direction="up" in timeout={800}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(0,188,212,0.1)' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Người dùng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ngày tạo</TableCell>
                    {canEdit && <TableCell sx={{ fontWeight: 700 }} align="center">Thao tác</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: getRoleColor(user.role) + '.main',
                              width: 48,
                              height: 48
                            }}
                          >
                            {user.full_name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {user.full_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                            <Email sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                          </Box>
                          {user.phone && (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Phone sx={{ fontSize: 16 }} />
                              <Typography variant="body2" color="text.secondary">
                                {user.phone}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role) as any}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                        </Typography>
                      </TableCell>
                      {canEdit && (
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, user.id)}
                            disabled={currentUser?.id === user.id}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            anchorEl={menuAnchor[user.id]}
                            open={Boolean(menuAnchor[user.id])}
                            onClose={() => handleMenuClose(user.id)}
                          >
                            <MenuItem onClick={() => { handleOpenDialog(user); handleMenuClose(user.id); }}>
                              <ListItemIcon>
                                <Edit fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Chỉnh sửa</ListItemText>
                            </MenuItem>
                            {currentUser?.id !== user.id && (
                              <MenuItem onClick={() => { handleDeleteUser(user.id); handleMenuClose(user.id); }}>
                                <ListItemIcon>
                                  <Delete fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Xóa</ListItemText>
                              </MenuItem>
                            )}
                          </Menu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Slide>

          {filteredUsers.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy người dùng nào
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
          {editingUser ? '✏️ Chỉnh sửa người dùng' : '➕ Thêm người dùng mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                required
                disabled={!!editingUser}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={userForm.role}
                  label="Vai trò"
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                >
                  <MenuItem value="member">Thành viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                multiline
                rows={2}
                value={userForm.address}
                onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={editingUser ? "Mật khẩu mới (để trống nếu không thay đổi)" : "Mật khẩu"}
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required={!editingUser}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {editingUser ? 'Cập nhật' : 'Thêm mới'}
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

export default Users;
