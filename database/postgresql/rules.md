# PostgreSQL Rules

## Overview
PostgreSQL is an open-source relational database known for standards compliance and extensibility.

## Naming Conventions
- Use snake_case for table names: `orders`, `order_items`.
- Use snake_case for column names: `first_name`, `created_at`.
- Use lowercase for all identifiers — PostgreSQL folds unquoted identifiers to lowercase.
- Name indexes with the pattern: `idx_table_name_column_name`.
- Name constraints explicitly: `pk_orders`, `fk_order_items_orders`, `chk_orders_status`.

## Query Patterns
- Always use parameterized queries — never concatenate user input into SQL.
- Use `EXPLAIN ANALYZE` to understand and optimize query plans.
- Use CTEs for readable multi-step queries.
- Use `EXISTS` instead of `COUNT` for existence checks.
- Use `RETURNING` clause on INSERT/UPDATE/DELETE to avoid extra SELECT queries.
- Prefer `jsonb` over `json` for JSON columns — it supports indexing and is more efficient.

## Schema Design
- Every table should have a primary key.
- Use appropriate types: `TEXT` instead of `VARCHAR` when no limit is needed, `TIMESTAMPTZ` for timestamps.
- Use `UUID` for primary keys when rows may be created across distributed systems.
- Add indexes for columns used in WHERE, JOIN, and ORDER BY.
- Use partial indexes for queries that filter on a specific condition.
- Use foreign keys to enforce referential integrity.

## Migrations
- Use a migration tool — do not apply schema changes manually.
- Keep migrations small, focused, and reversible.
- Test migrations against realistic data volumes.
- Be careful with locking — `ALTER TABLE` on large tables can lock the table. Use `CONCURRENTLY` for index creation.

## Security
- Use the principle of least privilege for database roles.
- Use connection pooling (PgBouncer) for applications with many short-lived connections.
- Never store credentials in source code — use environment variables or a secrets manager.
- Enable SSL for all connections.

## Common Pitfalls
- PostgreSQL identifiers are case-sensitive only when quoted. Avoid quoted identifiers.
- `NULL` handling differs from some databases — use `IS NULL`, not `= NULL`.
- Vacuum and analyze run automatically but monitor them under heavy write workloads.
- Be careful with `TRUNCATE` in transactions — it acquires an exclusive lock.
