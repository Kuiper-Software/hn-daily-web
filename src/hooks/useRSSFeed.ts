import { useQuery } from '@tanstack/react-query';
import { fetchRSSFeed, RSSChannel } from '../utils/rssParser';

const RSS_FEED_URL = 'https://feeds.buzzsprout.com/2008321.rss'; // Example RSS feed URL

export const useRSSFeed = (feedUrl?: string) => {
  const url = feedUrl || RSS_FEED_URL;
  
  return useQuery<RSSChannel, Error>({
    queryKey: ['rss-feed', url],
    queryFn: () => fetchRSSFeed(url),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 