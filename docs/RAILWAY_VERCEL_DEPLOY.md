# Railway + Vercel Deployment

This project should be deployed in a split setup:

- PostgreSQL on Railway
- Nest API on Railway via Docker
- Prisma migrations on Railway via Docker
- Next.js frontend on Vercel

This is the correct production shape for the current repository.

Important architectural note:

- Do not deploy PostgreSQL as your own Docker container on Railway unless you have a very specific reason.
- Use Railway PostgreSQL service instead.
- Use Docker deployment on Railway for the backend services that already exist in this repo: `migrate` and `api`.

## Why This Shape Fits This Repo

The repository already has the necessary container split:

- `Dockerfile.migrate` runs `prisma migrate deploy`
- `Dockerfile.api` runs the Nest backend
- `docker-compose.yml` also contains `db`, but on Railway that role should be replaced by Railway PostgreSQL service

Also note an important detail:

- Vercel is not just serving static frontend here
- the Next.js app uses Prisma and Auth.js on the server side
- so Vercel also needs access to the same production `DATABASE_URL`

## Recommended Rollout Order

1. Create PostgreSQL service on Railway.
2. Get Railway database connection values.
3. Deploy `migrate` service on Railway with the production `DATABASE_URL`.
4. Deploy `api` service on Railway with the same database and app secrets.
5. Obtain the public API URL from Railway.
6. Deploy frontend on Vercel with the same database access plus the API URLs.

## Step 1. Create PostgreSQL On Railway

In Railway:

1. Create a new project or use the existing one.
2. Add `PostgreSQL` service from Railway templates.
3. Wait until the database finishes provisioning.

After that Railway will provide variables such as:

- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

For this repository, `DATABASE_URL` is the main variable you need.

## Step 2. Deploy Prisma Migrations On Railway

Create a separate Railway service for migrations.

Recommended service name:

- `migrate`

Set these Railway service variables:

- `RAILWAY_DOCKERFILE_PATH=Dockerfile.migrate`
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`

If your Railway PostgreSQL service is named differently, replace `Postgres` with the actual Railway service name.

What this service does:

- builds from `Dockerfile.migrate`
- runs `npx prisma migrate deploy`
- exits successfully

This service should be redeployed before or together with backend releases whenever Prisma migrations change.

## Step 3. Deploy Nest API On Railway

Create another Railway service.

Recommended service name:

- `api`

Set these Railway service variables:

- `RAILWAY_DOCKERFILE_PATH=Dockerfile.api`
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `AUTH_SECRET=<strong random secret>`
- `INTERNAL_API_SECRET=<strong random secret>`
- `AUTH_SESSION_STRATEGY=jwt`
- `PORT=8082`
- `SOCKET_SERVER_PORT=8082`
- `ALLOWED_ORIGIN=https://<your-vercel-domain>`
- `SWAGGER_ENABLED=false`
- `INVITE_SHARED_MAX_USES=10`
- `INVITE_EXPIRES_HOURS=168`

Optional provider variables if you use OAuth:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`

After deployment, Railway will give your API a public domain.

Example:

- `https://api-production-xxxx.up.railway.app`

That public URL becomes the browser-facing backend URL for Vercel.

## Step 4. Configure Vercel Frontend

The frontend on Vercel needs more than public API URLs.

Because this Next.js app uses:

- Auth.js adapter with Prisma
- server-side auth/session reads
- server-side API proxying to Nest

Vercel must also receive the same production `DATABASE_URL`.

Set these Vercel environment variables:

- `DATABASE_URL=<same Railway Postgres DATABASE_URL>`
- `AUTH_SECRET=<same AUTH_SECRET as Railway api>`
- `AUTH_SESSION_STRATEGY=jwt`
- `INTERNAL_API_SECRET=<same INTERNAL_API_SECRET as Railway api>`
- `NEST_API_URL=https://<your-railway-api-domain>`
- `NEXT_PUBLIC_API_BASE_URL=https://<your-railway-api-domain>`
- `NEXT_PUBLIC_APP_URL=https://<your-vercel-domain>`
- `NEXT_PUBLIC_SOCKET_PORT=443`
- `ALLOWED_ORIGIN=https://<your-vercel-domain>`

Optional:

- `NEXT_PUBLIC_WS_URL=wss://<your-railway-api-domain>`

OAuth variables on Vercel should also be present if sign-in providers are enabled:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`

## Important Variable Rules

### `DATABASE_URL`

Must be identical for:

- Railway `migrate`
- Railway `api`
- Vercel frontend

Why:

- Prisma migrations run against that database
- Nest reads and writes domain data there
- Next/Auth.js also reads and writes auth-related data there

If Vercel does not get `DATABASE_URL`, auth and server-side session flow will break.

### `AUTH_SECRET`

Must be the same on:

- Railway `api`
- Vercel frontend

Use a long random secret in production.

### `INTERNAL_API_SECRET`

Must also be the same on:

- Railway `api`
- Vercel frontend

Why:

- Next.js signs internal service requests to Nest
- Nest validates them

If the values differ, all proxied protected requests will fail.

### `NEST_API_URL`

For Vercel, this should be the public Railway API URL, not an internal Railway hostname.

Reason:

- Vercel is outside Railway private networking
- it cannot use Railway internal service DNS

So use:

- `NEST_API_URL=https://<railway-api-public-domain>`

not:

- `http://api:8082`
- `http://api.railway.internal:8082`

## What To Do With `docker-compose.yml`

Keep it.

It remains useful for:

- local full-stack development
- validating the container split locally
- understanding service responsibilities

But in production the mapping changes:

- local `db` compose service -> Railway PostgreSQL service
- local `migrate` compose service -> Railway Docker service from `Dockerfile.migrate`
- local `api` compose service -> Railway Docker service from `Dockerfile.api`
- local `web` compose service -> Vercel project

## Minimal Production Matrix

### Railway Postgres

- managed PostgreSQL service
- source of truth for `DATABASE_URL`

### Railway Migrate

- Dockerfile: `Dockerfile.migrate`
- required vars: `DATABASE_URL`
- job behavior: one-shot migration runner

### Railway API

- Dockerfile: `Dockerfile.api`
- required vars: `DATABASE_URL`, `AUTH_SECRET`, `INTERNAL_API_SECRET`, `PORT`, `ALLOWED_ORIGIN`
- output: public API URL

### Vercel Web

- source: repository root Next.js app
- required vars: `DATABASE_URL`, `AUTH_SECRET`, `INTERNAL_API_SECRET`, `NEST_API_URL`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_URL`

## First Production Bring-Up Checklist

1. Railway PostgreSQL is created and healthy.
2. `migrate` service has run successfully.
3. `api` service starts and answers `/health`.
4. Vercel has the same `DATABASE_URL`, `AUTH_SECRET`, and `INTERNAL_API_SECRET`.
5. `NEXT_PUBLIC_API_BASE_URL` points to Railway API public domain.
6. `NEST_API_URL` on Vercel also points to Railway API public domain.
7. `ALLOWED_ORIGIN` on Railway API is set to the Vercel frontend domain.
8. OAuth callback URLs are updated to the real Vercel domain.

## Most Likely Mistakes

### Mistake 1. Deploying database as a custom Docker container on Railway

You can do it, but it is the wrong default here.

It creates unnecessary operational burden:

- persistence management
- upgrades
- backups
- manual tuning

Use Railway PostgreSQL service instead.

### Mistake 2. Giving `DATABASE_URL` only to Railway API

That will break Next/Auth.js on Vercel.

Vercel also needs database access.

### Mistake 3. Using Railway private hostnames from Vercel

Vercel cannot reach Railway private network.

Use the public Railway API domain in Vercel env vars.

### Mistake 4. Different `INTERNAL_API_SECRET` values on Vercel and Railway API

Then the Next proxy layer will fail authorization when forwarding requests to Nest.

### Mistake 5. Forgetting to run migrations before backend rollout

If schema and runtime drift apart, API or auth flow can fail at startup or during requests.

## Short Version

Your production order should be:

1. Railway PostgreSQL service
2. Railway `migrate` Docker service
3. Railway `api` Docker service
4. Vercel frontend

And the key rule is:

- one production database
- one shared `DATABASE_URL`
- same `AUTH_SECRET` where auth code runs
- same `INTERNAL_API_SECRET` where Next talks to Nest