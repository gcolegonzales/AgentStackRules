# Entity Framework Rules

## Overview
Entity Framework Core (EF Core) is the recommended ORM for .NET applications interacting with relational databases.

## Installation & Setup
- Use `Microsoft.EntityFrameworkCore` and the appropriate database provider package.
- Register the DbContext in dependency injection with the correct lifetime (Scoped).
- Keep the DbContext class focused — do not put business logic in it.

## Usage Patterns
- Use migrations for all schema changes. Never modify the database schema manually.
- Use async methods (`ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`) for all database operations.
- Use `IQueryable` to build queries and defer execution until the data is needed.
- Use projection (`Select`) to fetch only the columns you need.
- Use `Include` and `ThenInclude` for eager loading related entities. Be explicit about what you load.
- Use navigation properties to express relationships. Configure them in `OnModelCreating` or with data annotations.

## Anti-Patterns
- Do not use lazy loading unless you fully understand the N+1 query implications.
- Do not call `ToList()` before applying filters — filter in the database, not in memory.
- Do not use `Find()` in loops — batch lookups with `Where` and `Contains`.
- Do not put raw SQL in application code unless EF Core's query translation is insufficient.
- Do not track entities you only read — use `AsNoTracking()` for read-only queries.

## Common Pitfalls
- Always review the SQL EF generates — use logging or a profiler during development.
- Keep migrations small and focused. One logical change per migration.
- Do not edit generated migration files unless you understand the consequences.
- Be careful with global query filters — they apply to all queries including joins.
- Dispose of DbContext properly — the DI container handles this when registered as Scoped.
