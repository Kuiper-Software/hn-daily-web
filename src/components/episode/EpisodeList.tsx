import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Box, Typography } from '@mui/material';
import { Episode } from '../../types';
import EpisodeCard from './EpisodeCard';

interface EpisodeListProps {
  episodes: Episode[];
  isLoading?: boolean;
}

interface ItemRendererProps {
  index: number;
  style: React.CSSProperties;
  data: Episode[];
}

const ItemRenderer: React.FC<ItemRendererProps> = ({ index, style, data }) => {
  const episode = data[index];
  
  return (
    <div style={{ ...style, padding: '8px 16px' }}>
      <EpisodeCard episode={episode} />
    </div>
  );
};

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading episodes...</Typography>
      </Box>
    );
  }

  if (episodes.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No episodes found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or check back later for new episodes.
        </Typography>
      </Box>
    );
  }

  // Calculate item height (card height + padding)
  const itemHeight = 136; // 120px image + 16px padding

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={episodes.length}
            itemSize={itemHeight}
            itemData={episodes}
            overscanCount={5}
          >
            {ItemRenderer}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};

export default EpisodeList; 