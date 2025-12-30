# Masjid Baiturrahim - Management Website

Full-stack mosque management website with separated API architecture.

## Project Structure

```
/mosque-website
  /frontend (Next.js 14 with App Router)
    /app
      /(public) - Public pages (landing, tentang, kegiatan, kontak)
      /(dashboard) - Dashboard pages (protected)
      /login - Login page
    /components
      /landing - Landing page components
      /dashboard - Dashboard components
      /ui - shadcn/ui components
      /shared - Shared components (navbar, footer)
    /lib - Utilities and API client
    /public - Static assets
    /styles - Global styles
  
  /backend (Go - Completely Separated)
    /cmd/server - Main application entry point
    /internal
      /handlers - API controllers
      /models - GORM models
      /middleware - Auth, CORS, logging
      /database - Connection and migrations
      /services - Business logic
      /utils - Helpers and validators
    /config - Configuration
    /migrations - Database migrations
```

## Tech Stack

### Frontend
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS 4 with custom Islamic theme
- shadcn/ui components
- Framer Motion (animations)
- TanStack Query (data fetching)
- Zod (validation)
- axios (API calls)
- next-themes (dark mode)
- react-hook-form (forms)
- date-fns (date formatting)
- qrcode.react (QR generation)

### Backend
- Go 1.21+
- Gin framework
- GORM v2
- JWT-go (authentication)
- golang-jwt/jwt/v5
- CORS middleware
- validator/v10
- godotenv
- PostgreSQL driver

### Database
- PostgreSQL 15+

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Go 1.21+
- Docker and Docker Compose (optional)
- PostgreSQL 15+ (if not using Docker)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-masjid
```

2. Set up environment variables:

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

3. Using Docker Compose (Recommended):

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Backend API on port 8080
- Frontend on port 3000

4. Manual Setup:

**Backend:**
```bash
cd backend
go mod download
go run cmd/server/main.go
```

**Frontend:**
```bash
cd frontend
bun install
bun run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user (protected)

### Content Management
- `GET /api/content` - List all content
- `POST /api/content` - Create content (protected)
- `PUT /api/content/:id` - Update content (protected)
- `DELETE /api/content/:id` - Delete content (protected)

### Structure
- `GET /api/structure` - List all structure members
- `POST /api/structure` - Create structure member (protected)
- `PUT /api/structure/:id` - Update structure member (protected)
- `DELETE /api/structure/:id` - Delete structure member (protected)

### Donations
- `GET /api/donations` - List all donations (protected)
- `POST /api/donations` - Create donation (protected)
- `PUT /api/donations/:id` - Update donation (protected)
- `DELETE /api/donations/:id` - Delete donation (protected)

### Schedules
- `GET /api/schedules` - List all schedules (protected)
- `POST /api/schedules` - Create schedule (protected)
- `PUT /api/schedules/:id` - Update schedule (protected)
- `DELETE /api/schedules/:id` - Delete schedule (protected)

### Announcements
- `GET /api/announcements` - List all announcements (protected)
- `POST /api/announcements` - Create announcement (protected)
- `PUT /api/announcements/:id` - Update announcement (protected)
- `DELETE /api/announcements/:id` - Delete announcement (protected)

## Design System

The project uses an Islamic-inspired design system with:
- **Colors**: Emerald/Teal (primary), Gold (secondary), Deep Blue (accent)
- **Typography**: Amiri/Cairo for headings, Inter for body, Scheherazade New for Arabic
- **Mobile-first**: Responsive design optimized for mobile devices
- **Dark mode**: Optimized for night prayers
- **RTL support**: Ready for Arabic text

## Development

### Frontend Development
```bash
cd frontend
bun run dev
```

### Backend Development
```bash
cd backend
go run cmd/server/main.go
```

### Database Migrations
Migrations run automatically on server start using GORM AutoMigrate.

## Production Deployment

1. Build frontend:
```bash
cd frontend
bun run build
```

2. Build backend:
```bash
cd backend
go build -o server cmd/server/main.go
```

3. Set production environment variables
4. Run migrations
5. Start services

## License

MIT
