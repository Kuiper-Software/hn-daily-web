import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useNavigationStore } from './stores/navigationStore';
import { useAudioStore } from './stores/audioStore';
import AppHeader from './components/layout/AppHeader';
import MiniPlayer from './components/player/MiniPlayer';
import HomePage from './pages/HomePage';
import EpisodePage from './pages/EpisodePage';
import AudioPlayer from './components/player/AudioPlayer';

function App() {
  const location = useLocation();
  const { setCurrentRoute, setMiniPlayerVisible } = useNavigationStore();
  const { currentEpisode } = useAudioStore();

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);

  useEffect(() => {
    setMiniPlayerVisible(!!currentEpisode);
  }, [currentEpisode, setMiniPlayerVisible]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppHeader />
      
      <Box
        component="main"
        sx={{
          flex: 1,
          pb: currentEpisode ? '80px' : 0, // Add padding for mini player
          transition: 'padding-bottom 0.3s ease',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/episode/:id" element={<EpisodePage />} />
        </Routes>
      </Box>

      {/* Audio Player Component (hidden) */}
      <AudioPlayer />

      {/* Mini Player */}
      {currentEpisode && <MiniPlayer />}
    </Box>
  );
}

export default App; 