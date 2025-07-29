# PGAGI Content Dashboard

## Overview

PGAGI is a modern web application that serves as a personalized content aggregation dashboard for Sanika Padaval, combining news, movies, and social media content in a single interface. The application follows a full-stack architecture with React on the frontend, Express.js on the backend, and in-memory storage for content management. Features include drag-and-drop content reordering, Redux state management, dark mode, and comprehensive search functionality.

## User Preferences

Preferred communication style: Simple, everyday language.
Default User: Sanika Padaval (sanika6701@gmail.com)

## Recent Changes (July 29, 2025)

- ✓ Updated default user information from "John Doe" to "Sanika Padaval"
- ✓ Changed default email from "john@pgagi.com" to "sanika6701@gmail.com" 
- ✓ Added sample content data to demonstrate dashboard functionality
- ✓ Fixed React Beautiful DND drag-and-drop implementation issues
- ✓ Personalized social media content to include Sanika's tech posts
- ✓ Configured default user preferences for technology and finance categories
- ✓ Implemented trending and favorites sections per assignment requirements
- ✓ Added proper content filtering for all tabs (News, Movies, Social, Trending, Favorites)
- ✓ Enhanced sample data with trending indicators and additional content variety
- ✓ Created comprehensive README.md with complete project documentation
- ✓ Ensured full compliance with all assignment requirements and submission guidelines

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Redux Toolkit with Redux Persist for local state persistence
- **Data Fetching**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Connect-pg-simple for PostgreSQL-based sessions
- **Development**: Integrated Vite development server for hot reloading

### Key Architectural Decisions
1. **Monorepo Structure**: Single repository with client, server, and shared code
2. **Type Safety**: Full TypeScript implementation across frontend and backend
3. **Component-First Design**: Reusable UI components following atomic design principles
4. **API-First Approach**: RESTful API design with proper error handling

## Key Components

### Data Layer
- **Database Schema**: Four main tables (users, contentItems, userFavorites, userContentOrder)
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for runtime type validation
- **Storage Abstraction**: Interface-based storage layer supporting in-memory and database implementations

### Frontend Components
- **Dashboard**: Main content aggregation interface with filtering and search
- **Content Grid**: Responsive grid layout with drag-and-drop reordering
- **Sidebar**: Navigation and category filtering
- **Theme Provider**: Light/dark mode support with system preference detection
- **Settings Modal**: User preference management

### Backend Services
- **Content API**: Endpoints for content CRUD operations and search
- **User Management**: User profiles and preference handling
- **Favorites System**: Content bookmarking functionality
- **Content Ordering**: Personalized content arrangement

## Data Flow

1. **Content Aggregation**: Backend fetches content from various sources (news APIs, movie databases, social platforms)
2. **State Management**: Frontend uses Redux for local state and React Query for server state
3. **Real-time Updates**: Vite HMR for development, WebSocket support ready for production
4. **Persistence**: User preferences and content order stored in PostgreSQL
5. **Caching**: React Query handles client-side caching with configurable stale times

## External Dependencies

### Production Dependencies
- **UI Library**: Radix UI components for accessibility and functionality
- **Animation**: Framer Motion for smooth transitions and interactions
- **Database**: Neon serverless PostgreSQL for cloud-native data storage
- **HTTP Client**: Axios for external API communications
- **Date Handling**: date-fns for consistent date formatting

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Database**: Drizzle Kit for schema migrations and database management
- **Code Quality**: ESBuild for fast production builds
- **Development**: Replit integration with error overlay and cartographer

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server integrated with Express
- **Error Handling**: Runtime error overlay for debugging
- **Database**: Connection to Neon PostgreSQL via environment variables

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Environment**: Node.js production mode with environment-based configuration
- **Database**: Production PostgreSQL connection with connection pooling

### Key Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Performance Optimization**: Code splitting, lazy loading, and efficient re-renders
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Ready**: Server-side rendering preparation and meta tag management

The application is designed to be scalable, maintainable, and user-friendly, with a focus on performance and developer experience.