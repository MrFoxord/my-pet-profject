# My Pet Project

My Pet Project is a collaborative task and board management platform for small teams, founders, executors, and product-oriented workflows.

It combines a board-style interface with role-aware access control, invitation flows, realtime updates, and a full-stack architecture where the frontend and backend share the same collaboration model.

## For Users

### What This Project Is

This application helps people organize work inside boards.

Each board can represent a team workspace, a client area, an internal delivery flow, or a personal planning space. Inside a board, work is structured through columns and tickets, and access can be adjusted at both board level and ticket level.

The goal is not only to store tasks, but to support controlled collaboration:
- who can enter a board;
- who can see or edit specific work items;
- how invitations work;
- how changes appear in realtime;
- how administration stays inside the product instead of external scripts.

### Core Product Principles

- Boards are the main workspace unit. A board contains columns, tickets, members, roles, invitations, and notifications.
- Access is explicit. The system supports board roles, custom roles, and ticket-level access policies.
- Collaboration should stay understandable. Users see shared work, invitations, comments, and notifications in one flow.
- Administration should be built in. Board settings, invite rules, custom roles, and member management are available from the dashboard.
- Realtime matters. Important updates propagate through the interface without forcing full page refresh behavior.

### Main Capabilities

- Authentication through Auth.js with optional OAuth providers.
- Board creation and board-based workspace separation.
- Ticket creation, editing, moving between columns, commenting, and estimating.
- Board member roles: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.
- Custom board roles for narrower permission control.
- Personal and shared invitation links with expiration and usage limits.
- In-app notifications with realtime delivery.
- Multilingual interface with English, Russian, and Ukrainian dictionaries.

### How Collaboration Works

- A board owner or admin can configure invite rules and manage members.
- Members can work with tickets according to board role and ticket policy.
- Shared invite links allow controlled onboarding into a board.
- Personal invites allow direct access for a known email.
- Ticket access policy can restrict viewing, editing, deleting, commenting, estimating, and access management.

### Current Product Scope

The current application already covers the main collaborative board flow:
- authentication;
- boards;
- columns;
- tickets;
- comments;
- invitations;
- role-based access;
- in-app notifications.

Email notifications are intentionally not part of the current shipped scope yet.

## For Developers

### Architecture Overview

The repository is a full-stack workspace with two runtime applications:

- Frontend: Next.js App Router application in [src](src)
- Backend: NestJS API server in [server-nest](server-nest)
- Database: PostgreSQL with Prisma schema and migrations in [prisma](prisma)

High-level flow:
- the browser talks to the Next.js app;
- Next.js serves the UI and proxies protected API calls;
- NestJS owns the board domain, validation, invitation lifecycle, access checks, and realtime notifications;
- PostgreSQL stores auth, boards, tickets, invitations, comments, and notifications.

### Main Tech Stack

- Next.js 16 with App Router
- React 19
- Auth.js / next-auth
- next-intl
- MUI
- RTK Query
- NestJS 11
- Prisma 7
- PostgreSQL 16
- Socket.IO

### Repository Layout

- [src](src): frontend application code
- [src/app](src/app): App Router routes and pages
- [src/components](src/components): UI and dashboard components
- [src/store](src/store): RTK Query and client state wiring
- [server-nest/src](server-nest/src): Nest modules, controllers, services, realtime, auth
- [prisma](prisma): root Prisma schema and migration history
- [messages](messages): translation dictionaries
- [docs/DEV_NOTES.md](docs/DEV_NOTES.md): engineering context and implementation notes

### Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 16+ or Docker

### Environment Setup

Use [.env.example](.env.example) as the source of truth.

Minimum required variables for local development:
- `DATABASE_URL`
- `AUTH_SECRET`
- `INTERNAL_API_SECRET`
- `NEST_API_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `ALLOWED_ORIGIN`
- `PORT`

Useful optional variables:
- OAuth credentials for Google, GitHub, Facebook
- `SWAGGER_ENABLED`
- `SWAGGER_PATH`
- `INVITE_EXPIRES_HOURS`
- `INVITE_SHARED_MAX_USES`
- `RATE_LIMIT_TTL_MS`
- `RATE_LIMIT_MAX_REQUESTS`

Important implementation detail:
- the Nest app loads `.env` from either its own folder or the repository root;
- in normal local development, keeping the main env file in the repository root is enough.

### First-Time Local Setup

1. Install frontend dependencies from the repository root.

```bash
npm ci
```

2. Install backend dependencies.

```bash
cd server-nest
npm ci
cd ..
```

3. Copy the environment template and fill it.

```bash
cp .env.example .env
```

On Windows PowerShell, `Copy-Item .env.example .env` works as well.

4. Start PostgreSQL.

Using Docker:

```bash
docker compose up -d db
```

This starts PostgreSQL 16 on `localhost:5432` with database `my_pet_profect`.

5. Apply Prisma migrations from the repository root.

```bash
npx prisma migrate deploy
```

6. Start the Nest backend.

```bash
cd server-nest
npm run start:dev
```

7. Start the Next frontend in a separate terminal.

```bash
npm run dev
```

After startup:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8082`
- Swagger: `http://localhost:8082/api/docs`

### Docker Setup

The repository is now prepared for containerized deployment with four services:
- `db`: PostgreSQL
- `migrate`: one-shot Prisma migration runner
- `api`: NestJS backend
- `web`: Next.js frontend

Files involved:
- [docker-compose.yml](docker-compose.yml)
- [Dockerfile.web](Dockerfile.web)
- [Dockerfile.api](Dockerfile.api)
- [Dockerfile.migrate](Dockerfile.migrate)
- [.dockerignore](.dockerignore)

To start the whole stack locally in Docker:

```bash
docker compose up --build
```

To run it in background:

```bash
docker compose up --build -d
```

To stop everything:

```bash
docker compose down
```

To stop everything and remove the database volume too:

```bash
docker compose down -v
```

Useful commands:

```bash
docker compose logs -f web
docker compose logs -f api
docker compose ps
```

The compose chain is designed like this:
- PostgreSQL starts first;
- `migrate` waits for the database and applies Prisma migrations;
- `api` starts only after migrations complete successfully;
- `web` starts after the backend becomes healthy.

### Docker Environment Notes

For Docker and cloud deployment, there is one important distinction:

- `NEST_API_URL` is internal and used by the Next server container to talk to the backend container.
- `NEXT_PUBLIC_API_BASE_URL` is public and used by the browser.

Typical values:

Local Docker Compose:
- `NEST_API_URL=http://api:8082`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8082`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

Cloud server behind a real domain:
- `NEST_API_URL=http://api:8082`
- `NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com` or your chosen public gateway URL
- `NEXT_PUBLIC_APP_URL=https://your-domain.com`

If websocket traffic goes through a reverse proxy or separate public endpoint, set:
- `NEXT_PUBLIC_WS_URL=wss://your-domain.com/realtime`

### Deploying on a Cloud Server

For a single VPS or cloud VM, the practical deployment flow is:

1. Copy the project to the server.
2. Create a production `.env` based on [.env.example](.env.example).
3. Set real production values for secrets, domain URLs, OAuth credentials, and database access.
4. Open the required ports on the server or place the stack behind a reverse proxy.
5. Start the stack with Docker Compose.

Example:

```bash
docker compose up --build -d
```

Recommended production shape:
- expose only the frontend publicly when possible;
- place frontend and API behind Nginx, Caddy, Traefik, or a cloud load balancer;
- terminate HTTPS at the reverse proxy;
- keep PostgreSQL inaccessible from the public internet unless there is a very specific reason.

### Railway + Vercel Deployment

If you want to run PostgreSQL and Nest on Railway, while keeping the Next.js frontend on Vercel, use the dedicated guide:

- [docs/RAILWAY_VERCEL_DEPLOY.md](docs/RAILWAY_VERCEL_DEPLOY.md)

That guide documents the correct split for this repository:

- Railway PostgreSQL service instead of self-hosted `db` container
- Railway Docker deployment for `migrate` and `api`
- Vercel deployment for the frontend
- shared production `DATABASE_URL` for Railway and Vercel

### Production Checklist for Docker Deployment

- Replace development secrets in `.env`.
- Set `ALLOWED_ORIGIN` to the real frontend domain.
- Set correct public URLs in `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_BASE_URL`.
- Decide whether Swagger should stay enabled in production.
- Make sure database persistence is attached to real storage.
- Add reverse proxy, TLS, and backups before public exposure.

### Windows Note

On some Windows PowerShell setups, `npm.ps1` or `npx.ps1` can be blocked by execution policy.

If that happens, run commands like this instead:

```bash
cmd /c npm run dev
cmd /c npm run build
cmd /c npx prisma migrate deploy
```

### Daily Development Commands

From the repository root:

```bash
npm run dev
npm run build
npm run lint
```

From [server-nest](server-nest):

```bash
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

### Database and Prisma Notes

- The primary migration history is in [prisma/migrations](prisma/migrations).
- The root schema is [prisma/schema.prisma](prisma/schema.prisma).
- The project uses PostgreSQL.
- If schema changes are introduced, regenerate Prisma artifacts and create migrations deliberately instead of editing migration history by hand.

### Testing and Validation

Useful validation commands:

Frontend:

```bash
npm run lint
npm run build
```

Backend:

```bash
cd server-nest
npm run build
npm run test
npm run test:e2e
```

Important existing backend coverage includes:
- [server-nest/src/boards/boards-domain.spec.ts](server-nest/src/boards/boards-domain.spec.ts)
- [server-nest/src/boards/boards.service.spec.ts](server-nest/src/boards/boards.service.spec.ts)
- [server-nest/test/boards-risk-flows.e2e-spec.ts](server-nest/test/boards-risk-flows.e2e-spec.ts)
- [server-nest/test/health.e2e-spec.ts](server-nest/test/health.e2e-spec.ts)

### API and Swagger

Swagger is enabled by default outside production unless disabled explicitly.

Relevant variables:
- `SWAGGER_ENABLED=true|false`
- `SWAGGER_PATH=api/docs`

Common endpoints:
- `GET /health`
- `GET /boards`
- `POST /boards`
- `GET /boards/:id`
- `PATCH /boards/:id`
- `DELETE /boards/:boardId`
- board ticket, member, role, column, and invitation routes under `/boards/*`
- public invitation routes under `/invitations/*`

### Security and Runtime Notes

Current baseline includes:
- Nest validation pipes
- `helmet`
- CORS control via `ALLOWED_ORIGIN`
- internal service-to-service auth via `INTERNAL_API_SECRET`
- rate limiting on API paths
- protected Next proxy for authenticated flows

Before any production deployment:
- use strong secrets for `AUTH_SECRET` and `INTERNAL_API_SECRET`;
- restrict `ALLOWED_ORIGIN` to the real frontend domain;
- review Swagger exposure;
- use managed PostgreSQL and backups;
- review invite TTL and shared invite limits.

### Project Status

The board domain is already decomposed into focused backend services for:
- access control;
- invitations;
- members;
- roles;
- board structure;
- tickets;
- notifications.

The current release focus is the collaborative board workflow. Email delivery is still a separate later milestone.
