export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // in seconds
  publishDate: Date;
  thumbnail?: string;
  episodeNumber?: number;
  season?: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}

export interface AudioState {
  currentEpisode: Episode | null;
  playbackState: PlaybackState;
  queue: Episode[];
}

export interface UserPreferences {
  favoriteEpisodes: string[]; // episode IDs
  isDarkMode: boolean;
  lastPlayedEpisode: string | null;
  lastPlayedPosition: number;
  volume: number;
}

export interface RSSFeed {
  title: string;
  description: string;
  episodes: Episode[];
  lastUpdated: Date;
} 