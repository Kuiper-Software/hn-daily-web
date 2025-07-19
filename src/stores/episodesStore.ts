import { create } from 'zustand';
import { Episode } from '../types';

interface EpisodesStore {
  episodes: Episode[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filteredEpisodes: Episode[];
  
  // Actions
  setEpisodes: (episodes: Episode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  filterEpisodes: () => void;
  getEpisodeById: (id: string) => Episode | undefined;
}

export const useEpisodesStore = create<EpisodesStore>((set, get) => ({
  episodes: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  filteredEpisodes: [],

  setEpisodes: (episodes: Episode[]) => {
    set({ episodes });
    get().filterEpisodes();
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setSearchQuery: (searchQuery: string) => {
    set({ searchQuery });
    get().filterEpisodes();
  },

  filterEpisodes: () => {
    const { episodes, searchQuery } = get();
    
    if (!searchQuery.trim()) {
      set({ filteredEpisodes: episodes });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = episodes.filter(episode =>
      episode.title.toLowerCase().includes(query) ||
      episode.description.toLowerCase().includes(query)
    );

    set({ filteredEpisodes: filtered });
  },

  getEpisodeById: (id: string) => {
    const { episodes } = get();
    return episodes.find(episode => episode.id === id);
  },
})); 