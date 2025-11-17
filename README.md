# Bookmy

Minimal Next.js (TypeScript) starter for Bookmy — a multi-tenant booking platform.

Getting started

1. Install dependencies:

```powershell
npm install
```

2. Run dev server:

```powershell
npm run dev
```

Environment

Create a `.env.local` file with variables you need. Example in `.env.example`.

Production / Postgres notes

1. Add your production DB url to `.env.production` or to your host's environment variables. Example value:

```text
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
```

2. To apply the Prisma schema to your Postgres DB (first deploy) you can run locally or from CI:

```powershell
# (run in project root)
npm run db:push      # quick sync: applies schema to database
npm run prisma:generate

# optional: open Prisma Studio to inspect data
npm run studio
```

If you prefer a migration-based production workflow, create migrations from your current schema and use `npx prisma migrate deploy` in CI.

