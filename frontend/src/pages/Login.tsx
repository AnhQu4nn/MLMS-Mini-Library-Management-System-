import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Slide
} from '@mui/material';
import {
  MenuBook,
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c1427 0%, #1a1f3a 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(0,188,212,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,107,107,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Box>
            <Slide direction="up" in timeout={600}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, sm: 5 },
                  borderRadius: 4,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(45deg, #00BCD4, #4DD0E1, #FF6B6B)'
                  }
                }}
              >
                <Box sx={{ mb: 4 }}>
                  <MenuBook 
                    sx={{ 
                      fontSize: 64, 
                      mb: 2,
                      background: 'linear-gradient(45deg, #00BCD4, #4DD0E1)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} 
                  />
                  <Typography variant="h3" fontWeight={800} gutterBottom>
                    MLMS
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Hệ thống Quản lý Thư viện
                  </Typography>
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 3
                    }}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Chưa có tài khoản?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/register"
                      sx={{ 
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Đăng ký ngay
                    </Link>
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tài khoản demo
                  </Typography>
                </Divider>

                <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => quickLogin('admin', 'password')}
                    sx={{ borderRadius: 20 }}
                  >
                    Admin
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => quickLogin('member1', 'password')}
                    sx={{ borderRadius: 20 }}
                  >
                    Thành viên
                  </Button>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
