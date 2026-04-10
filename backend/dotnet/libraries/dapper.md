# Dapper Rules

## Overview
Dapper is a lightweight micro-ORM for .NET that maps SQL query results to objects with minimal overhead.

## Installation & Setup
- Install the `Dapper` NuGet package.
- Use `IDbConnection` (typically `SqlConnection`) to execute queries.
- Manage connections through dependency injection — do not create connections manually in business logic.

## Usage Patterns
- Use parameterized queries for all database operations. Never concatenate user input.
- Use `QueryAsync` and `ExecuteAsync` for async operations.
- Use `Query<T>` for typed results and anonymous types only for one-off queries.
- Use `SqlMapper.AddTypeHandler` for custom type mappings.
- Keep SQL in the repository layer, not in controllers or services.

## Anti-Patterns
- Do not use string concatenation or interpolation for SQL parameters.
- Do not open and close connections manually in every method — use `using` statements or let DI manage lifetime.
- Do not mix Dapper and EF Core on the same DbContext without understanding the implications.

## Common Pitfalls
- Dapper does not track changes — you must write explicit INSERT, UPDATE, DELETE statements.
- Multi-mapping (joining tables) requires careful `splitOn` parameter usage.
- Be aware of connection pooling — do not hold connections open longer than necessary.
