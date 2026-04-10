# Prisma Rules

## Overview
Prisma is a TypeScript-first ORM that provides type-safe database access with a declarative schema.

## Installation & Setup
- Install `prisma` (dev dependency) and `@prisma/client`.
- Define the schema in `prisma/schema.prisma`.
- Run `npx prisma generate` after schema changes to regenerate the client.
- Use `npx prisma migrate dev` for development migrations and `npx prisma migrate deploy` for production.

## Usage Patterns
- Use a single `PrismaClient` instance (singleton) — do not create new instances per request.
- Use `select` and `include` to fetch only the data you need.
- Use transactions (`prisma.$transaction`) for operations that must succeed or fail together.
- Define relations in the schema and use Prisma's relation queries instead of manual joins.
- Use Prisma's generated types for all database-related TypeScript types.

## Anti-Patterns
- Do not use raw SQL unless Prisma's query API is genuinely insufficient.
- Do not create multiple PrismaClient instances — it exhausts database connections.
- Do not skip migrations and modify the database schema manually.

## Common Pitfalls
- Run `prisma generate` after every schema change — TypeScript types will be stale otherwise.
- Prisma's `findUnique` requires a unique field — use `findFirst` for non-unique queries.
- Be mindful of N+1 queries when iterating over relations — use `include` to eager load.
- Connection pool size defaults may be too low for production — configure via the connection string.
