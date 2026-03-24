# My Pet Project

Full-stack task/board management app:
- Frontend: Next.js (App Router), next-auth, next-intl, MUI, RTK Query
- Backend: NestJS, Prisma, PostgreSQL, Swagger, Socket.IO

## Features

- OAuth sign-in (Google/GitHub/Facebook, if configured)
- Board-based collaboration with roles and custom roles
- Ticket creation, editing, reorder, comments, estimates
- Invite links (personal/shared) with expiration and usage limits
- Realtime notifications over Socket.IO
- Swagger API docs for backend integration and QA checks

## Repository Structure

- `src/`: Next.js app and frontend source
- `server-nest/`: NestJS API server
- `prisma/`: Prisma schema and migrations (shared DB schema)
- `messages/`: i18n dictionaries (`en`, `ru`, `uk`)
- `.github/workflows/ci.yml`: CI pipeline

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 16+ (local or container)

## Environment Variables

Use `.env.example` in repository root as the source of truth.

Minimal required values for local start:
- `DATABASE_URL`
- `AUTH_SECRET`
- `INTERNAL_API_SECRET`
- `NEST_API_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `ALLOWED_ORIGIN`

Optional but recommended:
- `SWAGGER_ENABLED`, `SWAGGER_PATH`
- `RATE_LIMIT_TTL_MS`, `RATE_LIMIT_MAX_REQUESTS`
- OAuth provider IDs/secrets

## Local Development

1. Install frontend dependencies:
```bash
npm ci
```

2. Install backend dependencies:
```bash
cd server-nest
npm ci
cd ..
```

3. Start PostgreSQL (option A: docker):
```bash
docker compose up -d db
```

4. Apply Prisma migrations from repository root:
```bash
npx prisma migrate deploy
```

5. Start backend:
```bash
cd server-nest
npm run start:dev
```

6. Start frontend (new terminal):
```bash
npm run dev
```

Frontend: `http://localhost:3000`
Backend API: `http://localhost:8082`
Swagger: `http://localhost:8082/api/docs`

## Backend Commands

Run in `server-nest/`:

```bash
npm run build
npm run start:dev
npm run test
npm run test:e2e
```

## Frontend Commands

Run in repository root:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Security Baseline

Implemented baseline protections:
- Nest global rate limiting (`@nestjs/throttler`)
- Stricter throttles on public invitation endpoints
- `helmet` in Nest bootstrap
- Next.js security headers (CSP, frame/options, referrer, permissions)
- Frontend middleware rate limiting for auth/invite routes

Before production:
- Set strong secrets for `AUTH_SECRET` and `INTERNAL_API_SECRET`
- Restrict `ALLOWED_ORIGIN` to real frontend domain
- Disable Swagger in prod if public docs are not desired (`SWAGGER_ENABLED=false`)
- Use HTTPS and managed Postgres with backups

## Testing

- Unit tests include invitation-state and permission checks in `server-nest/src/boards/boards.service.spec.ts`
- E2E smoke test includes health endpoint in `server-nest/test/health.e2e-spec.ts`

CI runs frontend lint/build plus backend build/tests on push and PR.

## API and Swagger

Swagger is enabled by default in non-production and can be explicitly controlled:
- `SWAGGER_ENABLED=true|false`
- `SWAGGER_PATH=api/docs`

Main domain endpoints:
- `GET /health`
- `GET/POST /boards`
- `GET /boards/:id`
- `DELETE /boards/:boardId`
- Ticket, column, member, role, invitation routes under `/boards/*`
- Public invite routes under `/invitations/*`

## Release Notes (Current)

This branch includes:
- Full Swagger documentation on controllers and DTOs
- Invite flow hardening and session-safe acceptance
- Board deletion endpoint and UI action
- Error boundaries (`error.tsx`, `not-found.tsx`)
- CI pipeline and backend test scaffolding
- Security headers and rate limiting
