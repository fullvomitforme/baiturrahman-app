# AGENTS.md - Development Guidelines for Masjid Baiturrahim

This document provides guidance for AI agents working on the Masjid Baiturrahim codebase.

## Project Overview

Masjid Baiturrahim is a full-stack mosque management system with:
- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS 4, Bun
- **Backend**: Go 1.21+ API using Gin framework and GORM
- **Database**: PostgreSQL 15+
- **Repository**: Monorepo structure with `frontend/` and `backend/` directories

## Build Commands

### Docker (Recommended)
```bash
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
```

### Frontend
```bash
cd frontend
bun install             # Install dependencies
bun run dev             # Dev server on port 3000
bun run build           # Production build
bun run start           # Start production server
bun run lint            # Run ESLint
```

### Backend
```bash
cd backend
go run cmd/server/main.go    # Run server on port 8080
go build -o server cmd/server/main.go   # Build binary
air                           # Hot-reload (requires Air)
```

### Database Connection
```bash
psql -h localhost -p 5432 -U heulasuser -d baiturrahim_app
```

## Code Style Guidelines

### TypeScript (Frontend)

**Imports**
- Use `@/` alias for absolute imports (e.g., `import { api } from '@/lib/axios'`)
- Group imports: React → external libraries → internal components/utilities
- Use named imports for libraries: `import { useState } from 'react'`
- Default export for main API client: `import api from '@/lib/axios'`

**Types**
- Use TypeScript interfaces for object shapes (not type aliases for objects)
- Export interfaces from `src/types/index.ts`
- Prefix event handler types: `onClick?: () => void`
- Use optional properties (`?`) for optional fields

**Components**
- Use `'use client'` directive at the top of client components
- Default export named component functions: `export function Navbar()`
- Destructure props with explicit typing
- Use compound components pattern for related UI elements
- Prefer functional components over class components

**Naming**
- Components: PascalCase (`PrayerTimesSection`)
- Hooks: camelCase with `use` prefix (`useUIStore`)
- Variables/functions: camelCase (`isMenuOpen`, `toggleDarkMode`)
- Constants: SCREAMING_SNAKE_CASE for config values
- Files: kebab-case for utilities, PascalCase for components

**State Management**
- Local state: `useState`, `useReducer`
- Global state: Zustand (`uiStore`, `authStore`, `contentStore`)
- Server state: TanStack Query hooks in `src/services/hooks.ts`

**Styling**
- Use Tailwind CSS utility classes
- Use `cn()` helper from `@/lib/utils` for class merging
- Follow color palette: `primary-500`, `accent-400` from tailwind.config.ts
- Use `dark:` prefix for dark mode styles

### Go (Backend)

**Imports**
- Standard library first, then third-party, then internal packages
- Group imports with blank lines between groups:
```go
import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "masjid-baiturrahim-backend/config"
    "masjid-baiturrahim-backend/internal/models"
)
```

**Packages**
- Handlers: `package handlers` in `internal/handlers/`
- Models: `package models` in `internal/models/`
- Middleware: `package middleware` in `internal/middleware/`
- Services: `package services` in `internal/services/`
- Utils: `package utils` in `internal/utils/`

**Functions**
- Use receiver methods on Handler struct for route handlers
- First parameter always `c *gin.Context`
- Get DB from context: `db := c.MustGet("db").(*gorm.DB)`
- Return responses using `utils.SuccessResponse()`, `utils.ErrorResponse()`, `utils.PaginatedSuccessResponse()`

**Naming**
- Files: snake_case (`auth_handler.go`, `prayer_times.go`)
- Structs: PascalCase (`PrayerTime`, `Event`)
- Fields: PascalCase with JSON tags (`ID string `json:"id"`)
- Variables: camelCase (`userID`, `isPublished`)
- Constants: PascalCase or SCREAMING_SNAKE_CASE
- Interfaces: PascalCase with `er` suffix (`Handler`, `Service`)

**Error Handling**
- Return errors via `utils.ErrorResponse(c, statusCode, message)`
- Use early returns for validation errors
- Log errors before returning: `utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())`
- Use context for user context: `c.Set("userID", claims.UserID)`

**Database**
- Use GORM with auto-migration on startup
- Models in `internal/models/` with `gorm.Model` embedded
- Relationships defined with GORM tags
- Soft deletes supported via `gorm.DeletedAt`

### General Conventions

**Git Commits**
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Keep commits atomic and focused
- Write clear, descriptive messages

**File Organization**
- Keep files small (<300 lines where possible)
- One component per file
- Related utilities in same file
- Feature-based organization for complex features

**Security**
- Never commit secrets or credentials
- Use environment variables for sensitive data
- Validate all inputs on backend
- Use parameterized queries (GORM handles this)
- Sanitize user-generated content

**Performance**
- Use server components by default in Next.js
- Client components only when interactivity needed
- Memoize expensive computations
- Lazy load non-critical components
- Use proper pagination for large datasets

## API Patterns

### Response Format
```json
// Success
{"success": true, "data": {...}, "message": "optional message"}

// Paginated
{"success": true, "data": [...], "page": 1, "limit": 10, "total": 100, "total_pages": 10}

// Error
{"success": false, "error": "error message"}
```

### Authentication
- JWT tokens via `Authorization: Bearer <token>` header
- Admin routes require `role: "admin"` in JWT claims
- 401 responses trigger automatic logout on frontend

### Base URL
- Frontend API calls: `http://localhost:8080/api/v1`
- Environment: `NEXT_PUBLIC_API_URL`

## Testing

No test framework is currently configured. When adding tests:
- Frontend: Vitest or Jest
- Backend: Go's `testing` package with testify
- Run tests with `bun test` (frontend) or `go test` (backend)

## Additional Notes

- Use `clsx` and `tailwind-merge` for class manipulation
- Lenis for smooth scrolling on landing pages
- Framer Motion for animations
- Radix UI for accessible primitives
- Arabic/Islamic theming: Emerald primary, Teal accent, Gold secondary
