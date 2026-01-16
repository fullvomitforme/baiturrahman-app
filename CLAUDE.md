# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Masjid Baiturrahim is a **full-stack mosque management system** with completely separated frontend and backend architectures. The project is organized as a monorepo with:

- **Frontend**: Next.js 16 with App Router, TypeScript, and Tailwind CSS 4
- **Backend**: Go 1.21+ API server using Gin framework and GORM
- **Database**: PostgreSQL 15+

## Development Commands

### Docker (Recommended)
```bash
# Start all services (PostgreSQL, backend, frontend)
docker-compose up -d

# Stop all services
docker-compose down
```

### Frontend Development
```bash
cd frontend
bun install          # Install dependencies
bun run dev          # Start dev server on port 3000
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
go run cmd/server/main.go    # Start server on port 8080
go build -o server cmd/server/main.go  # Build binary
air                         # Hot-reload development (requires Air)
```

### Environment Setup

**Backend** (`backend/.env`):
```
PORT=8080
ENVIRONMENT=development
DATABASE_URL=postgres://user:password@localhost:5432/dbname?sslmode=disable
JWT_SECRET=your-secret-key-min-32-characters
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Note: The frontend API client appends `/v1` to the base URL automatically.

## Architecture

### Project Structure

```
├── frontend/                    # Next.js frontend
│   ├── app/
│   │   ├── (public)/           # Public pages (landing, tentang, kegiatan, kontak)
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   └── login/              # Authentication pages
│   ├── components/
│   │   ├── landing/            # Landing page components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   └── shared/             # Navbar, footer, etc.
│   └── lib/
│       ├── api.ts              # Axios instance with interceptors
│       ├── utils.ts            # Utility functions (cn helper)
│       └── constants.ts        # App constants
│
├── backend/                     # Go API server
│   ├── cmd/server/             # Application entry point
│   ├── internal/
│   │   ├── handlers/           # HTTP request handlers (controllers)
│   │   ├── models/             # GORM database models
│   │   ├── middleware/         # Auth, CORS, logging, rate limiting
│   │   ├── database/           # Connection, migrations, seeding
│   │   ├── services/           # Business logic layer
│   │   └── utils/              # Validators, helpers
│   └── config/                 # Configuration loading
│
└── docker-compose.yml          # Container orchestration
```

### API Architecture

**Base URL**: `http://localhost:8080/api/v1`

**Route Organization**:
- Public routes: `/api/v1/{resource}` (GET requests)
- Auth routes: `/api/v1/auth/*` (login, refresh)
- Protected routes: Require JWT authentication via `Authorization: Bearer <token>` header
- Admin routes: `/api/v1/admin/*` (require auth + admin role, full CRUD)

**Authentication Flow**:
1. POST `/api/v1/auth/login` with credentials → Returns JWT access token
2. Frontend stores token in `localStorage` (key: `token`)
3. Axios interceptor automatically adds `Authorization: Bearer <token>` to requests
4. 401 responses trigger automatic logout and redirect to `/login`

**Key Entities**:
- Mosque Info (singleton)
- Structure (organizational chart, reorderable)
- Prayer Times (daily/monthly, bulk operations)
- Content Sections (toggleable, reorderable)
- Events (public with slug support)
- Announcements
- Donations (with payment methods)
- Users (role-based access: admin/user)

### Frontend Architecture

**App Router Structure**:
- Route groups `(public)` and `(dashboard)` for logical separation
- File-based routing with parallel layouts
- Server components by default, client components marked with `"use client"`

**State Management**:
- TanStack Query for server state caching and synchronization
- React Hook Form + Zod for form validation
- next-themes for dark mode persistence

**Design System**:
- Islamic-inspired theming (Emerald/Teal primary, Gold secondary, Deep Blue accent)
- Typography: Amiri/Cairo (headings), Inter (body), Scheherazade New (Arabic)
- Mobile-first responsive design
- RTL support ready for Arabic text
- Dark mode optimized for night prayers

**UI Components**:
- shadcn/ui primitives (Radix UI under the hood)
- Tailwind CSS with custom config in `frontend/tailwind.config.ts`
- Component variants using `class-variance-authority`

### Backend Architecture

**Clean Architecture Layers**:
1. **Handlers** (`internal/handlers/`): HTTP request/response handling, validation
2. **Services** (`internal/services/`): Business logic, external API calls
3. **Models** (`internal/models/`): GORM database schema definitions
4. **Middleware** (`internal/middleware/`): Cross-cutting concerns (auth, CORS, logging)

**Database**:
- GORM AutoMigrate runs on server startup
- Default admin seeded automatically if no users exist
- Connection pooling and retry logic configured

**Middleware Chain** (in order):
1. CORS (configured via `FRONTEND_URL`)
2. Logger
3. Rate Limiter
4. Error Handler
5. Database injection into Gin context

**Key Patterns**:
- Handlers receive `*gin.Context` with DB injected via `c.MustGet("db")`
- JWT validation via `middleware.AuthRequired()`
- Role-based access checked in handlers
- Image upload support with cloud storage integration

## Important Implementation Details

### API Client Configuration
The frontend axios instance (`frontend/lib/api.ts`) includes:
- Request interceptor: Auto-injects JWT from `localStorage`
- Response interceptor: Handles 401 errors with automatic logout

### Role-Based Access Control
- Admin users can access `/api/v1/admin/*` routes
- Regular users can access protected routes but not admin endpoints
- Role field in User model determines permissions

### Content Management Features
- **Reordering**: Structure, content sections, and payment methods support drag-and-drop reordering via `PUT /api/v1/admin/{resource}/reorder`
- **Toggle**: Content sections can be enabled/disabled via `PUT /api/v1/admin/content/:id/toggle`
- **Bulk Operations**: Prayer times support bulk creation and auto-generation

### Image Handling
- Admin route: `POST /api/v1/admin/upload` for image uploads
- Delete route: `DELETE /api/v1/admin/upload` with image URL in request body
- Images used in events, content sections, and structure members

### Prayer Times
- Daily prayer times with date-based queries
- Monthly view: `GET /api/v1/prayer-times/month?year=2024&month=1`
- Auto-generation: `POST /api/v1/admin/prayer-times/generate` (calculates prayer times for date range)

### Donation System
- Public donations: `POST /api/v1/donations` (unauthenticated)
- Admin confirmation: `PUT /api/v1/admin/donations/:id/confirm`
- Statistics: `GET /api/v1/admin/donations/stats`
- Export: `GET /api/v1/admin/donations/export`

## Package Management

- **Frontend**: Bun (`bun.lock`) - Preferred over npm/yarn
- **Backend**: Go modules (`go.mod`)
- Root package.json exists but `frontend/` has its own complete package.json

## Database Operations

**Migrations**: Automatic via GORM AutoMigrate on server startup
**Seeding**: Default admin user created if users table is empty
**Manual Connection**: Use psql with Docker Compose credentials:
```
User: heulasuser
Password: heulaspassword
Database: baiturrahim_app
Port: 5432
```

## Testing

No test framework currently configured. When adding tests:
- Frontend: Consider Vitest or Jest
- Backend: Use Go's built-in `testing` package with testify for assertions

## Deployment Considerations

1. Set `ENVIRONMENT=production` in backend `.env`
2. Change `JWT_SECRET` to a secure random string (min 32 characters)
3. Update `FRONTEND_URL` to production domain
4. Configure database connection string for production PostgreSQL
5. Build frontend: `bun run build` in `frontend/`
6. Build backend: `go build -o server cmd/server/main.go` in `backend/`
