import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Chip,
  Tooltip,
  Badge
} from '@mui/material';
import {
  MenuBook,
  Dashboard,
  LibraryBooks,
  People,
  Assignment,
  Notifications,
  AccountCircle,
  ExitToApp,
  Settings
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ px: 3, minHeight: 80 }}>
        <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <MenuBook sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ background: 'linear-gradient(45deg, #00BCD4, #4DD0E1)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MLMS
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Library Management System
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              color={isActive('/dashboard') ? 'primary' : 'inherit'}
              startIcon={<Dashboard />}
              onClick={() => handleNavigation('/dashboard')}
              sx={{ 
                borderRadius: 3,
                ...(isActive('/dashboard') && {
                  backgroundColor: 'rgba(0,188,212,0.1)',
                  border: '1px solid rgba(0,188,212,0.3)'
                })
              }}
            >
              Dashboard
            </Button>

            <Button
              color={isActive('/books') ? 'primary' : 'inherit'}
              startIcon={<LibraryBooks />}
              onClick={() => handleNavigation('/books')}
              sx={{ 
                borderRadius: 3,
                ...(isActive('/books') && {
                  backgroundColor: 'rgba(0,188,212,0.1)',
                  border: '1px solid rgba(0,188,212,0.3)'
                })
              }}
            >
              Sách
            </Button>

            {user.role === 'admin' && (
              <>
                <Button
                  color={isActive('/borrowings') ? 'primary' : 'inherit'}
                  startIcon={<Assignment />}
                  onClick={() => handleNavigation('/borrowings')}
                  sx={{ 
                    borderRadius: 3,
                    ...(isActive('/borrowings') && {
                      backgroundColor: 'rgba(0,188,212,0.1)',
                      border: '1px solid rgba(0,188,212,0.3)'
                    })
                  }}
                >
                  Mượn/Trả
                </Button>

                <Button
                  color={isActive('/users') ? 'primary' : 'inherit'}
                  startIcon={<People />}
                  onClick={() => handleNavigation('/users')}
                  sx={{ 
                    borderRadius: 3,
                    ...(isActive('/users') && {
                      backgroundColor: 'rgba(0,188,212,0.1)',
                      border: '1px solid rgba(0,188,212,0.3)'
                    })
                  }}
                >
                  Người dùng
                </Button>
              </>
            )}

            <Tooltip title="Thông báo">
              <IconButton 
                color="inherit" 
                sx={{ mx: 1 }}
                onClick={handleNotificationOpen}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box display="flex" alignItems="center" gap={2} sx={{ ml: 2, pl: 2, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <Box textAlign="right">
                <Typography variant="body2" fontWeight={600}>
                  {user.full_name}
                </Typography>
                <Chip 
                  label={getRoleLabel(user.role)} 
                  color={getRoleColor(user.role) as any}
                  size="small"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </Box>

              <Tooltip title="Tài khoản">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      background: 'linear-gradient(45deg, #00BCD4, #4DD0E1)',
                      fontWeight: 600
                    }}
                  >
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>

            {/* Notification Menu */}
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 300,
                  maxWidth: 400,
                  borderRadius: 3
                }
              }}
            >
              {notifications.length === 0 ? (
                <MenuItem>
                  <Box textAlign="center" py={2}>
                    <Typography variant="body2" color="text.secondary">
                      🎉 Không có thông báo mới
                    </Typography>
                  </Box>
                </MenuItem>
              ) : (
                <>
                  {unreadCount > 0 && (
                    <MenuItem 
                      onClick={() => {
                        markAllAsRead();
                        handleNotificationClose();
                      }}
                      sx={{ borderBottom: '1px solid #E5E7EB', justifyContent: 'center' }}
                    >
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        Đánh dấu tất cả đã đọc ({unreadCount})
                      </Typography>
                    </MenuItem>
                  )}
                  {notifications.slice(0, 5).map((notification) => (
                    <MenuItem 
                      key={notification.id}
                      onClick={() => {
                        markAsRead(notification.id);
                        handleNotificationClose();
                      }}
                      sx={{ 
                        backgroundColor: notification.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                        '&:hover': {
                          backgroundColor: notification.isRead ? 'rgba(0,0,0,0.04)' : 'rgba(79, 70, 229, 0.1)'
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {notification.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {notification.createdAt.toLocaleString('vi-VN', { 
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                  {notifications.length > 5 && (
                    <MenuItem onClick={handleNotificationClose}>
                      <Typography variant="body2" color="primary" textAlign="center" width="100%">
                        Xem thêm {notifications.length - 5} thông báo khác...
                      </Typography>
                    </MenuItem>
                  )}
                </>
              )}
            </Menu>

            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 3
                }
              }}
            >
              <MenuItem onClick={() => { handleNavigation('/profile'); handleMenuClose(); }}>
                <AccountCircle sx={{ mr: 2 }} />
                Hồ sơ cá nhân
              </MenuItem>
              <MenuItem onClick={() => { handleNavigation('/my-borrowings'); handleMenuClose(); }}>
                <Assignment sx={{ mr: 2 }} />
                Lịch sử mượn sách
              </MenuItem>
              <MenuItem onClick={() => { handleNavigation('/settings'); handleMenuClose(); }}>
                <Settings sx={{ mr: 2 }} />
                Cài đặt
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ExitToApp sx={{ mr: 2 }} />
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
