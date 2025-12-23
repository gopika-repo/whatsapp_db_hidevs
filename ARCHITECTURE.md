# Architecture Documentation

## Overview

The WhatsApp Business Dashboard is built using modern web technologies with a focus on maintainability, scalability, and developer experience. This document outlines the architectural decisions and patterns used throughout the application.

## Technology Stack

### Core Framework
- **Next.js 14+**: React framework with App Router for server-side rendering and routing
- **TypeScript**: Static typing for improved code quality and developer experience
- **React 18+**: UI library with concurrent features

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Pre-built, customizable React components
- **Lucide React**: Icon library

### State Management
- **Zustand**: Lightweight state management solution
- **React Context**: For authentication context sharing

### Data Fetching & API
- **Axios**: HTTP client with interceptor support
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Developer Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Prettier**: Code formatting (configured via ESLint)

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with global providers
│   ├── page.tsx           # Home page (redirects to dashboard)
│   └── [route]/           # Feature-based route folders
│
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components (Sidebar, Header, etc.)
│   ├── common/           # Shared components (LoadingSpinner, etc.)
│   └── [feature]/        # Feature-specific components
│
├── lib/                   # Utility libraries
│   ├── api-client.ts     # Axios instance with interceptors
│   ├── auth.ts           # Authentication utilities
│   ├── constants.ts      # Application constants
│   └── utils.ts          # Helper functions (cn, etc.)
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useApi.ts         # API request hook
│   └── useToast.ts       # Toast notification hook
│
├── store/                 # Zustand stores
│   ├── authStore.ts      # Authentication state
│   ├── appStore.ts       # App-wide UI state
│   └── chatStore.ts      # Chat-related state
│
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types and interfaces
│
├── context/               # React context providers
│   └── AuthContext.tsx   # Authentication context
│
└── middleware.ts          # Next.js middleware for route protection
```

## Architectural Patterns

### 1. Feature-Based Organization

The application follows a feature-based folder structure where related components, hooks, and utilities are grouped by feature rather than by technical concern.

```
app/
├── contacts/              # Contacts feature
│   └── page.tsx
├── chats/                 # Chats feature
│   └── page.tsx
└── campaigns/             # Campaigns feature
    └── page.tsx
```

### 2. Separation of Concerns

- **Presentation**: Components focus solely on UI rendering
- **Business Logic**: Hooks and stores handle business logic
- **Data Access**: API client handles all HTTP requests
- **State Management**: Zustand stores manage application state

### 3. Authentication Flow

```
User Login
    ↓
Login Form (components)
    ↓
useAuth Hook
    ↓
authStore (Zustand)
    ↓
API Client (Axios)
    ↓
Backend API
    ↓
JWT Token Storage (localStorage)
    ↓
Automatic Token Injection (Axios Interceptor)
```

### 4. Route Protection

Protected routes are handled via Next.js middleware:

1. Middleware checks for authentication token in cookies
2. If not authenticated, redirects to `/login`
3. If authenticated and on `/login`, redirects to `/dashboard`
4. Public routes (e.g., `/login`) are accessible without authentication

### 5. API Integration

The application uses a centralized API client (`lib/api-client.ts`) that:

- Adds Bearer token to all requests
- Handles token refresh on 401 errors
- Provides typed request methods (get, post, put, patch, delete)
- Manages error handling consistently

### 6. State Management Strategy

**Zustand Stores:**

- **authStore**: User authentication state, login/logout actions
- **appStore**: UI state (sidebar open/closed, dark mode)
- **chatStore**: Chat and message state

**Why Zustand?**
- Lightweight and minimal boilerplate
- TypeScript-first API
- No context provider needed
- Easy to test and debug

### 7. Type Safety

All data structures are typed using TypeScript interfaces:

```typescript
// types/index.ts
export interface User { ... }
export interface Contact { ... }
export interface Chat { ... }
```

This ensures:
- Compile-time error checking
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

## Component Architecture

### Layout Components

**Sidebar** (`components/layout/Sidebar.tsx`)
- Navigation menu
- Active route highlighting
- User profile section
- Collapse/expand functionality

**Header** (`components/layout/Header.tsx`)
- Search bar
- Dark mode toggle
- User actions

**MainLayout** (`components/layout/MainLayout.tsx`)
- Combines Sidebar and Header
- Handles responsive spacing
- Applied to all protected routes

### Page Components

Each page component follows this structure:

```typescript
'use client';

import { MainLayout } from '@/components/layout/MainLayout';
// Other imports...

export default function PageName() {
  // Hooks
  // State
  // Effects
  // Handlers

  return (
    <MainLayout>
      {/* Page content */}
    </MainLayout>
  );
}
```

## Data Flow

### Client → Server

```
Component
    ↓
useApi Hook / Store Action
    ↓
API Client (Axios)
    ↓ (Request Interceptor adds JWT)
Backend API
```

### Server → Client

```
Backend API
    ↓
API Client (Axios)
    ↓ (Response Interceptor handles errors)
Store Update (Zustand)
    ↓
Component Re-render
```

## Error Handling

### API Errors

1. API client catches errors
2. Errors are logged to console
3. Error messages displayed via toast notifications
4. 401 errors trigger automatic token refresh or logout

### Component Errors

1. ErrorBoundary component catches runtime errors
2. Displays user-friendly error message
3. Provides reload option

## Performance Considerations

### Code Splitting

- Next.js automatically code-splits by route
- Dynamic imports used for heavy components
- Lazy loading for non-critical features

### Optimization Strategies

1. **Image Optimization**: Next.js Image component
2. **Font Optimization**: Next.js Font optimization
3. **Client Components**: Only use `'use client'` when necessary
4. **Memoization**: React.memo for expensive renders
5. **Virtual Scrolling**: For large lists (future enhancement)

## Security

### Authentication

- JWT tokens stored in localStorage
- Tokens sent in Authorization header
- Automatic token refresh on expiry
- Protected routes via middleware

### XSS Prevention

- React automatically escapes output
- Sanitize user input before rendering
- Use TypeScript for type safety

### CSRF Protection

- API client includes CSRF tokens (if configured)
- SameSite cookie policy

## Testing Strategy (Future)

### Unit Tests

- Test utility functions
- Test custom hooks
- Test store actions

### Integration Tests

- Test API client
- Test authentication flow
- Test form submissions

### E2E Tests

- Test critical user flows
- Test protected routes
- Test login/logout

## Deployment

### Build Process

```bash
npm run build     # Creates optimized production build
npm run start     # Starts production server
```

### Environment Variables

Required for deployment:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name

### Hosting Platforms

**Recommended**: Vercel (optimal Next.js support)

**Alternatives**:
- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

## Future Enhancements

### Planned Features

1. Real-time messaging (WebSocket integration)
2. File upload support
3. Advanced search and filtering
4. Analytics dashboard
5. Multi-language support (i18n)
6. Role-based access control (RBAC)
7. Webhook management
8. Message scheduling
9. Chat assignment and routing
10. Performance monitoring

### Technical Improvements

1. Add comprehensive test coverage
2. Implement Server Components where possible
3. Add PWA support
4. Optimize bundle size
5. Add Storybook for component documentation
6. Implement proper logging system
7. Add monitoring and error tracking (Sentry)
8. Implement rate limiting on client side

## Best Practices

### Component Guidelines

1. Keep components small and focused
2. Use TypeScript for all new code
3. Extract reusable logic into custom hooks
4. Use Shadcn UI components when available
5. Follow naming conventions (PascalCase for components)

### Code Style

1. Use functional components with hooks
2. Prefer const over let
3. Use arrow functions for consistency
4. Add JSDoc comments for complex functions
5. Keep functions pure when possible

### State Management

1. Use local state for component-specific state
2. Use Zustand for shared application state
3. Avoid prop drilling (use context or store)
4. Keep state as close to where it's used as possible

### API Integration

1. Always handle loading and error states
2. Use TypeScript interfaces for API responses
3. Implement retry logic for failed requests
4. Cache responses when appropriate

## Troubleshooting

### Common Issues

**Build Errors**
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors with `npm run type-check`
- Clear `.next` folder and rebuild

**Authentication Issues**
- Verify API_URL environment variable
- Check browser console for errors
- Clear localStorage and try again

**Styling Issues**
- Check Tailwind CSS configuration
- Verify class names are correct
- Inspect element in browser DevTools

## Contributing

When contributing to this project:

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Update this documentation for architectural changes
4. Test your changes thoroughly
5. Follow the commit message conventions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

---

Last Updated: December 2024
