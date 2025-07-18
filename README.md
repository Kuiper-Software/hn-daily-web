# The Bootup Podcast

A modern, feature-rich podcast player web application built with React, TypeScript, and Material-UI. Stream podcast episodes with background playback, favorites management, and persistent playback state.

## 🚀 Features

### Core Functionality
- **RSS Feed Integration**: Fetches and displays podcast episodes from RSS feeds
- **Audio Playback**: Full-featured audio player with play, pause, seek, and skip controls
- **Background Playback**: Continue listening when the app is minimized with Media Session API
- **Mini Player**: Persistent bottom player for quick access to playback controls
- **Episode Detail View**: Rich episode information with full playback controls

### User Experience
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Favorites System**: Bookmark episodes with localStorage persistence
- **Search & Filter**: Find episodes quickly with real-time search
- **Virtualized Lists**: Smooth performance with large episode lists
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progress Persistence**: Resume episodes from where you left off

### Performance & Quality
- **TypeScript**: Type-safe development with strict compiler settings
- **State Management**: Zustand stores with persistence middleware
- **Caching**: Smart caching strategy for RSS feeds and user data
- **Error Handling**: Graceful error states and retry mechanisms
- **Testing Ready**: Vitest setup with testing utilities

## 🛠 Tech Stack

### Frontend Framework
- **React 18.x** - Modern React with hooks and concurrent features
- **TypeScript 5.x** - Type-safe JavaScript for better development experience
- **Vite 5.x** - Fast build tool and development server

### UI & Styling
- **Material-UI 5.x** - Comprehensive React component library
- **Emotion** - CSS-in-JS styling solution
- **Material Icons** - Consistent icon system

### State Management
- **Zustand 4.x** - Lightweight state management
- **Zustand Persist** - Automatic state persistence to localStorage

### Data Fetching
- **TanStack Query 5.x** - Server state management with caching
- **Native Fetch API** - Modern HTTP client

### Development Tools
- **ESLint** - Code linting and quality checks
- **Prettier** - Consistent code formatting
- **Vitest** - Fast unit testing framework

### Additional Libraries
- **React Router DOM** - Client-side routing
- **React Window** - Virtual scrolling for performance
- **date-fns** - Date manipulation utilities

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the-bootup-podcast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started
1. The app will automatically load a default RSS feed on startup
2. Browse episodes on the home page
3. Use the search bar to find specific episodes
4. Click on any episode card to view details
5. Use the play button to start listening

### Playback Controls
- **Play/Pause**: Click the play button on episode cards or in the player
- **Seek**: Drag the progress bar or use the slider in episode details
- **Skip**: Use 10-second forward/backward buttons
- **Background Play**: Minimize the app and use lock screen controls

### Favorites
- Click the heart icon on any episode to add/remove from favorites
- Access favorites through the "Favorites" tab on the home page
- Favorites are automatically saved to localStorage

### Theme Switching
- Click the theme toggle icon in the header
- Choice is automatically saved and restored on next visit

## 🔧 Configuration

### RSS Feed URL
Update the RSS feed URL in `src/hooks/useRSSFeed.ts`:

```typescript
const RSS_FEED_URL = 'your-rss-feed-url-here';
```

### CORS Proxy
The app uses a CORS proxy service for RSS feeds. You can configure this in `src/utils/rssParser.ts`:

```typescript
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── episode/        # Episode-related components
│   ├── layout/         # Layout components
│   └── player/         # Audio player components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── stores/             # Zustand state stores
├── theme/              # Material-UI theme configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── test/               # Test configuration
```

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## 🔄 State Management

The app uses Zustand for state management with the following stores:

### Audio Store
- Current episode and playback state
- Audio element reference and controls
- Queue management

### Episodes Store
- RSS feed data and loading states
- Search functionality and filtered results

### Theme Store
- Dark/light mode preference
- Persistent theme selection

### User Preferences Store
- Favorite episodes
- Last played episode and position
- Volume settings

### Navigation Store
- Current route tracking
- Mini player visibility state

## 🎨 Theming

The app supports both light and dark themes using Material-UI's theming system:

- **Light Theme**: Clean, minimal design with blue accents
- **Dark Theme**: Dark background with blue and pink accents
- **System Detection**: Automatically detects system preference
- **Persistent Choice**: Saves user's theme preference

## 📱 Responsive Design

The app is built with a mobile-first approach:

- **Mobile (xs)**: Optimized for phones with touch-friendly controls
- **Tablet (sm/md)**: Adapted layout for medium screens
- **Desktop (lg/xl)**: Full-featured layout with sidebar potential

## 🔊 Audio Features

### Media Session API
- Lock screen controls (play, pause, skip)
- Notification area integration
- Background playback support

### Playback State
- Automatic resume from last position
- Cross-session persistence
- Progress tracking every 5 seconds

### Audio Controls
- 10-second skip forward/backward
- Seek by clicking/dragging progress bar
- Volume control (planned for future release)

## 🚀 Performance Optimizations

### Virtualization
- Episode lists use React Window for smooth scrolling
- Only renders visible items for better performance

### Caching
- RSS feed data cached for 5 minutes
- User preferences persisted to localStorage
- Audio metadata cached for quick access

### Bundle Optimization
- Code splitting with React Router
- Tree shaking for smaller bundles
- Optimized Material-UI imports

## 🔒 Security Considerations

- Input sanitization for RSS feed data
- CORS proxy for external RSS feeds
- Local storage data validation
- Content Security Policy ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- TanStack team for React Query
- Zustand contributors for the simple state management
- RSS feed providers for content access 