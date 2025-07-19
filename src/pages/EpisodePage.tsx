import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Slider,
  Chip,
  Button,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
} from '@mui/icons-material';
import { useEpisodesStore } from '../stores/episodesStore';
import { useAudioStore } from '../stores/audioStore';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';
import { formatDuration, formatDateFull } from '../utils/timeUtils';

const EpisodePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEpisodeById } = useEpisodesStore();
  const {
    currentEpisode,
    playbackState,
    setCurrentEpisode,
    play,
    pause,
    seek,
  } = useAudioStore();
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    lastPlayedEpisode,
    lastPlayedPosition,
  } = useUserPreferencesStore();

  const episode = id ? getEpisodeById(id) : null;
  const isCurrentEpisode = currentEpisode?.id === episode?.id;
  const isEpisodeFavorite = episode ? isFavorite(episode.id) : false;

  useEffect(() => {
    if (episode && !currentEpisode) {
      setCurrentEpisode(episode);
      
      // Resume from last played position if this was the last played episode
      if (lastPlayedEpisode === episode.id && lastPlayedPosition > 0) {
        setTimeout(() => {
          seek(lastPlayedPosition);
        }, 1000);
      }
    }
  }, [episode, currentEpisode, setCurrentEpisode, lastPlayedEpisode, lastPlayedPosition, seek]);

  if (!episode) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h5" color="text.secondary">
          Episode not found
        </Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Episodes
        </Button>
      </Container>
    );
  }

  const handlePlayPause = () => {
    if (!isCurrentEpisode) {
      setCurrentEpisode(episode);
    }
    
    if (playbackState.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSeek = (_event: Event, newValue: number | number[]) => {
    const time = Array.isArray(newValue) ? newValue[0] : newValue;
    seek(time);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, playbackState.currentTime - 10);
    seek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(playbackState.duration, playbackState.currentTime + 10);
    seek(newTime);
  };

  const handleToggleFavorite = () => {
    if (isEpisodeFavorite) {
      removeFromFavorites(episode.id);
    } else {
      addToFavorites(episode.id);
    }
  };

  const progress = playbackState.duration > 0 
    ? (playbackState.currentTime / playbackState.duration) * 100 
    : 0;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Navigation */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h6" component="span">
          Episode Details
        </Typography>
      </Box>

      {/* Episode Card */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Episode Artwork */}
          <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
            <CardMedia
              component="img"
              sx={{
                width: { xs: 200, md: 300 },
                height: { xs: 200, md: 300 },
                borderRadius: 2,
                boxShadow: 4,
                mx: 'auto',
              }}
                             image={episode.thumbnail || '/default-podcast-cover.svg'}
              alt={episode.title}
            />
          </Box>

          {/* Episode Info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, flex: 1 }}>
                {episode.title}
              </Typography>
              <IconButton
                onClick={handleToggleFavorite}
                color={isEpisodeFavorite ? 'error' : 'default'}
                sx={{ ml: 2 }}
              >
                {isEpisodeFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                label={formatDuration(episode.duration)}
                variant="outlined"
                size="small"
              />
              <Chip
                label={formatDateFull(episode.publishDate)}
                variant="outlined"
                size="small"
              />
              {episode.episodeNumber && (
                <Chip
                  label={`Episode ${episode.episodeNumber}`}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>

            <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
              {episode.description}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Player Controls */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Now Playing
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Slider
            value={isCurrentEpisode ? playbackState.currentTime : 0}
            max={isCurrentEpisode ? playbackState.duration : episode.duration}
            onChange={handleSeek}
            aria-label="Episode progress"
            sx={{
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formatDuration(isCurrentEpisode ? playbackState.currentTime : 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDuration(isCurrentEpisode ? playbackState.duration : episode.duration)}
            </Typography>
          </Box>
        </Box>

        {/* Playback Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={handleSkipBackward}
            size="large"
            disabled={!isCurrentEpisode}
          >
            <Replay10Icon />
          </IconButton>

          <IconButton
            onClick={handlePlayPause}
            size="large"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 64,
              height: 64,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            {isCurrentEpisode && playbackState.isPlaying ? (
              <PauseIcon sx={{ fontSize: 32 }} />
            ) : (
              <PlayIcon sx={{ fontSize: 32 }} />
            )}
          </IconButton>

          <IconButton
            onClick={handleSkipForward}
            size="large"
            disabled={!isCurrentEpisode}
          >
            <Forward10Icon />
          </IconButton>
        </Box>

        {/* Progress Text */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {progress > 0 && `${Math.round(progress)}% complete`}
            {isCurrentEpisode && playbackState.isPlaying && ' • Playing'}
            {isCurrentEpisode && playbackState.isPaused && ' • Paused'}
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default EpisodePage; 