import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useThemeStore } from '../../stores/themeStore';

const AppHeader: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            The Bootup Podcast
          </Typography>
        </Box>
        
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 