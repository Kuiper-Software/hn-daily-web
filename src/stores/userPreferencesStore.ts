import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferencesStore {
  favoriteEpisodes: string[];
  lastPlayedEpisode: string | null;
  lastPlayedPosition: number;
  volume: number;
  
  // Actions
  addToFavorites: (episodeId: string) => void;
  removeFromFavorites: (episodeId: string) => void;
  isFavorite: (episodeId: string) => boolean;
  setLastPlayed: (episodeId: string, position: number) => void;
  setVolume: (volume: number) => void;
  clearLastPlayed: () => void;
}

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      favoriteEpisodes: [],
      lastPlayedEpisode: null,
      lastPlayedPosition: 0,
      volume: 1,

      addToFavorites: (episodeId: string) => {
        set((state) => ({
          favoriteEpisodes: [...state.favoriteEpisodes, episodeId],
        }));
      },

      removeFromFavorites: (episodeId: string) => {
        set((state) => ({
          favoriteEpisodes: state.favoriteEpisodes.filter(id => id !== episodeId),
        }));
      },

      isFavorite: (episodeId: string) => {
        const { favoriteEpisodes } = get();
        return favoriteEpisodes.includes(episodeId);
      },

      setLastPlayed: (episodeId: string, position: number) => {
        set({
          lastPlayedEpisode: episodeId,
          lastPlayedPosition: position,
        });
      },

      setVolume: (volume: number) => {
        set({ volume });
      },

      clearLastPlayed: () => {
        set({
          lastPlayedEpisode: null,
          lastPlayedPosition: 0,
        });
      },
    }),
    {
      name: 'user-preferences-store',
    }
  )
); 