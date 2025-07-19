import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useEpisodesStore } from '../stores/episodesStore';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';
import { useRSSFeed } from '../hooks/useRSSFeed';
import EpisodeList from '../components/episode/EpisodeList';
import { RSS_FEED_URL } from '../constants';

const HomePage: React.FC = () => {
  const {
    filteredEpisodes,
    searchQuery,
    setSearchQuery,
    setEpisodes,
    setLoading,
    setError,
    error: storeError,
  } = useEpisodesStore();
  
  const { favoriteEpisodes } = useUserPreferencesStore();
  const { data: rssData, isLoading, error, refetch } = useRSSFeed(RSS_FEED_URL);
  
  const [tabValue, setTabValue] = React.useState(0);

  // Update store when RSS data changes
  useEffect(() => {
    if (rssData) {
      setEpisodes(rssData.episodes);
      setError(null);
    }
  }, [rssData, setEpisodes, setError]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Update error state
  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    refetch();
  };

  const getDisplayEpisodes = () => {
    if (tabValue === 1) {
      // Show only favorites
      return filteredEpisodes.filter(episode => favoriteEpisodes.includes(episode.id));
    }
    return filteredEpisodes;
  };

  const displayEpisodes = getDisplayEpisodes();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Episodes
        </Typography>
        
        {rssData && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {rssData.description}
          </Typography>
        )}

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search episodes..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Episodes" />
            <Tab label={`Favorites (${favoriteEpisodes.length})`} />
          </Tabs>
        </Box>
      </Box>

      {/* Error State */}
      {storeError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <RefreshIcon
              sx={{ cursor: 'pointer' }}
              onClick={handleRefresh}
            />
          }
        >
          {storeError}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Episodes List */}
      {!isLoading && !storeError && (
        <>
          {displayEpisodes.length > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {displayEpisodes.length} episode{displayEpisodes.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
                {tabValue === 1 && ' in favorites'}
              </Typography>
              <EpisodeList episodes={displayEpisodes} />
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {tabValue === 1 ? 'No favorite episodes yet' : 'No episodes found'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 1
                  ? 'Start adding episodes to your favorites by clicking the heart icon.'
                  : searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'Check back later for new episodes.'
                }
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default HomePage; 