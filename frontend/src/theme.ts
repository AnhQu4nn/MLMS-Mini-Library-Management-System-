import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { 
      main: '#4F46E5', // Indigo - như Notion, Figma
      light: '#6366F1', 
      dark: '#3730A3',
      contrastText: '#FFFFFF'
    },
    secondary: { 
      main: '#6B7280', // Neutral gray - như GitHub
      light: '#9CA3AF', 
      dark: '#374151',
      contrastText: '#FFFFFF'
    },
    background: { 
      default: '#F9FAFB', // Subtle gray - như Linear, Vercel
      paper: '#FFFFFF' 
    },
    text: { 
      primary: '#111827', // Dark gray - tốt cho readability
      secondary: '#6B7280' 
    },
    success: { 
      main: '#10B981', // Emerald - như Stripe
      light: '#34D399',
      dark: '#047857'
    },
    warning: { 
      main: '#F59E0B', // Amber
      light: '#FBBF24',
      dark: '#D97706'
    },
    error: { 
      main: '#EF4444', // Red - như GitHub
      light: '#F87171',
      dark: '#DC2626'
    },
    info: {
      main: '#3B82F6', // Blue - như Twitter
      light: '#60A5FA',
      dark: '#2563EB'
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    }
  },
  shape: { borderRadius: 12 }, // Rounded như modern apps
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', color: '#111827', letterSpacing: '-0.025em' },
    h2: { fontWeight: 600, fontSize: '2rem', color: '#111827', letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, fontSize: '1.75rem', color: '#111827', letterSpacing: '-0.025em' },
    h4: { fontWeight: 600, fontSize: '1.5rem', color: '#111827', letterSpacing: '-0.025em' },
    h5: { fontWeight: 500, fontSize: '1.25rem', color: '#111827' },
    h6: { fontWeight: 500, fontSize: '1.125rem', color: '#111827' },
    button: { textTransform: 'none', fontWeight: 500 },
    body1: { color: '#374151' },
    body2: { color: '#6B7280' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F9FAFB',
          margin: 0,
          padding: 0,
          overflow: 'auto'
        },
        html: {
          height: '100%',
          overflow: 'auto'
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 500,
          textTransform: 'none',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease-in-out'
        },
        contained: {
          backgroundColor: '#4F46E5',
          color: '#FFFFFF',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&:hover': {
            backgroundColor: '#3730A3',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        },
        outlined: {
          borderColor: '#D1D5DB',
          color: '#374151',
          '&:hover': {
            backgroundColor: '#F9FAFB',
            borderColor: '#9CA3AF'
          }
        },
        text: {
          color: '#6B7280',
          '&:hover': {
            backgroundColor: '#F3F4F6'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#D1D5DB'
            },
            '&:hover fieldset': {
              borderColor: '#9CA3AF'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4F46E5',
              borderWidth: '2px'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#6B7280'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111827',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #E5E7EB'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          boxShadow: 'none'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 12px',
          color: '#6B7280',
          '&:hover': {
            backgroundColor: '#F3F4F6',
            color: '#4F46E5'
          },
          '&.Mui-selected': {
            backgroundColor: '#EEF2FF',
            color: '#4F46E5',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#E0E7FF'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8
        },
        colorPrimary: {
          backgroundColor: '#EEF2FF',
          color: '#3730A3'
        },
        colorSecondary: {
          backgroundColor: '#F3F4F6',
          color: '#374151'
        },
        colorSuccess: {
          backgroundColor: '#D1FAE5',
          color: '#047857'
        },
        colorError: {
          backgroundColor: '#FEE2E2',
          color: '#DC2626'
        },
        colorWarning: {
          backgroundColor: '#FEF3C7',
          color: '#D97706'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F9FAFB',
            color: '#374151',
            fontWeight: 600,
            borderBottom: '1px solid #E5E7EB'
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
          '&.MuiAlert-standardSuccess': {
            backgroundColor: '#F0FDF4',
            borderColor: '#BBF7D0',
            color: '#166534'
          },
          '&.MuiAlert-standardError': {
            backgroundColor: '#FEF2F2',
            borderColor: '#FECACA',
            color: '#991B1B'
          },
          '&.MuiAlert-standardWarning': {
            backgroundColor: '#FFFBEB',
            borderColor: '#FED7AA',
            color: '#92400E'
          },
          '&.MuiAlert-standardInfo': {
            backgroundColor: '#EFF6FF',
            borderColor: '#BFDBFE',
            color: '#1E40AF'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4F46E5',
          color: '#FFFFFF',
          fontWeight: 600
        }
      }
    }
  }
};

const theme = createTheme(baseTheme);
export default theme;