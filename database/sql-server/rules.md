# Azure SQL Server Rules

## Overview
Azure SQL Server is a managed relational database service. These rules cover query patterns, schema design, and operational practices.

## Naming Conventions
- Use PascalCase for table names: `Orders`, `OrderItems`.
- Use PascalCase for column names: `FirstName`, `CreatedDate`.
- Prefix primary keys with the table name: `OrderId`, `CustomerId`.
- Name foreign keys to match the referenced column: `OrderItems.OrderId` references `Orders.OrderId`.
- Name indexes with the pattern: `IX_TableName_ColumnName`.
- Name constraints explicitly: `PK_Orders`, `FK_OrderItems_Orders`, `CK_Orders_Status`.

## Query Patterns
- Always use parameterized queries — never concatenate user input into SQL.
- Use `SET NOCOUNT ON` in stored procedures.
- Avoid `SELECT *` — list the columns you need explicitly.
- Use `EXISTS` instead of `COUNT` when checking for the presence of rows.
- Use CTEs (Common Table Expressions) for readable multi-step queries.
- Avoid cursors — use set-based operations instead.

## Schema Design
- Every table should have a primary key.
- Use appropriate data types — do not use `NVARCHAR(MAX)` when a reasonable max length is known.
- Use `DATETIME2` instead of `DATETIME` for new columns.
- Add indexes for columns frequently used in WHERE, JOIN, and ORDER BY clauses.
- Do not over-index — each index has a write cost. Review index usage periodically.
- Use foreign keys to enforce referential integrity.

## Migrations
- Use a migration tool (EF Core Migrations, DbUp, Flyway) — do not apply changes manually.
- Keep migrations small and reversible where possible.
- Test migrations against a copy of production data before deploying.
- Never modify a migration that has already been applied to a shared environment.

## Security
- Use the principle of least privilege for database accounts.
- Use managed identities for Azure SQL connections where possible.
- Never store connection strings with passwords in source code.
- Enable auditing and threat detection in Azure SQL.
- Always use parameterized queries to prevent SQL injection.

## Common Pitfalls
- Be aware of parameter sniffing — use `OPTIMIZE FOR` or `RECOMPILE` hints when needed.
- Avoid implicit conversions in WHERE clauses — they prevent index usage.
- Do not use triggers for business logic — they are hard to debug and maintain.
- Monitor long-running queries and deadlocks using Azure SQL diagnostics.
