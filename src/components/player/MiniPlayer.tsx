import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Avatar,
  Slider,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  ExpandLess as ExpandIcon,
  VolumeUp as VolumeUpIcon,
  VolumeDown as VolumeDownIcon,
  VolumeMute as VolumeMuteIcon,
} from '@mui/icons-material';
import { useAudioStore } from '../../stores/audioStore';
import { formatDuration } from '../../utils/timeUtils';

const MiniPlayer: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentEpisode,
    playbackState,
    play,
    pause,
    setVolume,
  } = useAudioStore();

  if (!currentEpisode) return null;

  const handleTogglePlayback = () => {
    if (playbackState.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleExpand = () => {
    navigate(`/episode/${currentEpisode.id}`);
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const volume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volume / 100); // Convert from 0-100 to 0-1
  };

  const handleVolumeMute = () => {
    setVolume(playbackState.volume > 0 ? 0 : 1);
  };

  const getVolumeIcon = () => {
    if (playbackState.volume === 0) return <VolumeMuteIcon />;
    if (playbackState.volume < 0.5) return <VolumeDownIcon />;
    return <VolumeUpIcon />;
  };

  const progress = playbackState.duration > 0 
    ? (playbackState.currentTime / playbackState.duration) * 100 
    : 0;

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderRadius: 0,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 2,
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'primary.main',
          },
        }}
      />
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          minHeight: 64,
        }}
      >
        {/* Episode Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onClick={handleExpand}
        >
          <Avatar
            src={currentEpisode.thumbnail}
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              flexShrink: 0,
            }}
          >
            {currentEpisode.title.charAt(0)}
          </Avatar>
          
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentEpisode.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {formatDuration(playbackState.currentTime)} / {formatDuration(playbackState.duration)}
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleTogglePlayback}
            size="large"
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          >
            {playbackState.isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          
          {/* Volume Control */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minWidth: 120,
              mx: 1,
            }}
          >
            <Tooltip title={`Volume: ${Math.round(playbackState.volume * 100)}%`}>
              <IconButton
                onClick={handleVolumeMute}
                size="small"
                color="primary"
              >
                {getVolumeIcon()}
              </IconButton>
            </Tooltip>
            <Slider
              value={playbackState.volume * 100}
              onChange={handleVolumeChange}
              aria-label="Volume"
              min={0}
              max={100}
              size="small"
              sx={{
                ml: 1,
                color: 'primary.main',
                '& .MuiSlider-track': {
                  border: 'none',
                },
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: 'primary.main',
                  '&:before': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                  },
                },
              }}
            />
          </Box>
          
          <IconButton
            onClick={handleExpand}
            size="small"
            color="primary"
          >
            <ExpandIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default MiniPlayer; 