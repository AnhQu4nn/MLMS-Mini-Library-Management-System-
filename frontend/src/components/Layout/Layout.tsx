import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <Header />
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4, 
          px: { xs: 2, sm: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
