import { useEffect, useRef } from 'react';
import { useAudioStore } from '../../stores/audioStore';
import { useUserPreferencesStore } from '../../stores/userPreferencesStore';

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentEpisode,
    playbackState,
    setAudioElement,
    updatePlaybackState,
  } = useAudioStore();
  const { setLastPlayed } = useUserPreferencesStore();

  // Initialize audio element
  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  // Update audio source when episode changes
  useEffect(() => {
    if (audioRef.current && currentEpisode) {
      audioRef.current.src = currentEpisode.audioUrl;
      audioRef.current.load();
    }
  }, [currentEpisode]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      updatePlaybackState({
        duration: audio.duration,
      });
    };

    const handleTimeUpdate = () => {
      updatePlaybackState({
        currentTime: audio.currentTime,
      });

      // Save progress every 5 seconds
      if (currentEpisode && Math.floor(audio.currentTime) % 5 === 0) {
        setLastPlayed(currentEpisode.id, audio.currentTime);
      }
    };

    const handlePlay = () => {
      updatePlaybackState({
        isPlaying: true,
        isPaused: false,
      });
    };

    const handlePause = () => {
      updatePlaybackState({
        isPlaying: false,
        isPaused: true,
      });
    };

    const handleEnded = () => {
      updatePlaybackState({
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
      });
    };

    const handleError = () => {
      console.error('Audio playback error');
      updatePlaybackState({
        isPlaying: false,
        isPaused: false,
      });
    };

    // Media Session API for background playback
    const setupMediaSession = () => {
      if ('mediaSession' in navigator && currentEpisode) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentEpisode.title,
          artist: 'The Bootup Podcast',
          artwork: currentEpisode.thumbnail ? [
            {
              src: currentEpisode.thumbnail,
              sizes: '512x512',
              type: 'image/png',
            },
          ] : [],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          audio.play();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          audio.pause();
        });

        navigator.mediaSession.setActionHandler('seekbackward', () => {
          audio.currentTime = Math.max(0, audio.currentTime - 10);
        });

        navigator.mediaSession.setActionHandler('seekforward', () => {
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
        });
      }
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Setup media session when episode changes
    if (currentEpisode) {
      setupMediaSession();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentEpisode, updatePlaybackState, setLastPlayed]);

  // Apply volume and playback rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackState.volume;
      audioRef.current.playbackRate = playbackState.playbackRate;
    }
  }, [playbackState.volume, playbackState.playbackRate]);

  return (
    <audio
      ref={audioRef}
      preload="metadata"
      style={{ display: 'none' }}
    />
  );
};

export default AudioPlayer; 