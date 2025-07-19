import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Episode, PlaybackState } from '../types';

interface AudioStore {
  currentEpisode: Episode | null;
  playbackState: PlaybackState;
  queue: Episode[];
  audioElement: HTMLAudioElement | null;
  
  // Actions
  setCurrentEpisode: (episode: Episode) => void;
  updatePlaybackState: (state: Partial<PlaybackState>) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setAudioElement: (element: HTMLAudioElement) => void;
  addToQueue: (episode: Episode) => void;
  removeFromQueue: (episodeId: string) => void;
  clearQueue: () => void;
}

const initialPlaybackState: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
};

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      currentEpisode: null,
      playbackState: initialPlaybackState,
      queue: [],
      audioElement: null,

      setCurrentEpisode: (episode: Episode) => {
        set({ currentEpisode: episode });
      },

      updatePlaybackState: (state: Partial<PlaybackState>) => {
        set(prevState => ({
          playbackState: { ...prevState.playbackState, ...state },
        }));
      },

      play: () => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.play();
          set(state => ({
            playbackState: {
              ...state.playbackState,
              isPlaying: true,
              isPaused: false,
            },
          }));
        }
      },

      pause: () => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.pause();
          set(state => ({
            playbackState: {
              ...state.playbackState,
              isPlaying: false,
              isPaused: true,
            },
          }));
        }
      },

      stop: () => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
          set(state => ({
            playbackState: {
              ...state.playbackState,
              isPlaying: false,
              isPaused: false,
              currentTime: 0,
            },
          }));
        }
      },

      seek: (time: number) => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.currentTime = time;
          set(state => ({
            playbackState: {
              ...state.playbackState,
              currentTime: time,
            },
          }));
        }
      },

      setVolume: (volume: number) => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.volume = volume;
          set(state => ({
            playbackState: {
              ...state.playbackState,
              volume,
            },
          }));
        }
      },

      setPlaybackRate: (rate: number) => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.playbackRate = rate;
          set(state => ({
            playbackState: {
              ...state.playbackState,
              playbackRate: rate,
            },
          }));
        }
      },

      setAudioElement: (element: HTMLAudioElement) => {
        set({ audioElement: element });
      },

      addToQueue: (episode: Episode) => {
        set(state => ({
          queue: [...state.queue, episode],
        }));
      },

      removeFromQueue: (episodeId: string) => {
        set(state => ({
          queue: state.queue.filter(episode => episode.id !== episodeId),
        }));
      },

      clearQueue: () => {
        set({ queue: [] });
      },
    }),
    {
      name: 'audio-store',
      partialize: (state) => ({
        currentEpisode: state.currentEpisode,
        playbackState: {
          ...state.playbackState,
          isPlaying: false, // Don't persist playing state
        },
        queue: state.queue,
      }),
    }
  )
); 