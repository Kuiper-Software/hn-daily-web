import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { Episode } from '../../types';
import { useAudioStore } from '../../stores/audioStore';
import { useUserPreferencesStore } from '../../stores/userPreferencesStore';
import { formatDuration, formatDate } from '../../utils/timeUtils';

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const navigate = useNavigate();
  const { setCurrentEpisode, play, currentEpisode } = useAudioStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useUserPreferencesStore();

  const isCurrentEpisode = currentEpisode?.id === episode.id;
  const isEpisodeFavorite = isFavorite(episode.id);

  const handlePlayEpisode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentEpisode(episode);
    play();
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEpisodeFavorite) {
      removeFromFavorites(episode.id);
    } else {
      addToFavorites(episode.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/episode/${episode.id}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
        border: isCurrentEpisode ? 2 : 0,
        borderColor: isCurrentEpisode ? 'primary.main' : 'transparent',
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ display: 'flex' }}>
        {/* Episode Image */}
        <CardMedia
          component="img"
          sx={{
            width: 120,
            height: 150,
            flexShrink: 0,
            objectFit: 'cover',
          }}
          image={episode.thumbnail || '/default-podcast-cover.svg'}
          alt={episode.title}
        />

        {/* Episode Content */}
        <CardContent sx={{ flex: 1, px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1.3,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {episode.title}
            </Typography>
            
            <IconButton
              size="small"
              onClick={handleToggleFavorite}
              sx={{ ml: 1, flexShrink: 0 }}
            >
              {isEpisodeFavorite ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {truncateText(episode.description, 150)}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={formatDuration(episode.duration)}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(episode.publishDate)}
              </Typography>
            </Box>

            <IconButton
              color="primary"
              onClick={handlePlayEpisode}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                width: 40,
                height: 40,
              }}
            >
              <PlayIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default EpisodeCard; 