# .NET Rules

## Overview
.NET is a cross-platform framework for building web APIs, services, and applications using C#.

## Project Structure
- Use the standard solution/project layout: `.sln` at the root, projects in `src/`, tests in `tests/`.
- Separate concerns into projects: API, Domain, Infrastructure, Application.
- Use namespaces that mirror the folder structure.
- Keep controllers thin — delegate to services or handlers.

## API Design
- Use RESTful conventions: nouns for resources, HTTP verbs for actions.
- Return appropriate status codes (200, 201, 204, 400, 404, 500).
- Use `[ApiController]` attribute on controllers for automatic model validation.
- Use DTOs for request/response bodies — do not expose domain entities directly.
- Version APIs using URL path versioning (`/api/v1/resource`).

## Data Access
- Use repository or service patterns to abstract data access from controllers.
- Use async/await for all I/O operations.
- Use parameterized queries or an ORM — never concatenate user input into SQL.
- Keep database transactions as short as possible.

## Error Handling
- Use global exception handling middleware.
- Return `ProblemDetails` for API error responses.
- Log exceptions with structured logging (Serilog, Microsoft.Extensions.Logging).
- Do not catch exceptions you cannot handle — let them propagate to the global handler.
- Use specific exception types, not generic `Exception`.

## Authentication & Authorization
- Use the built-in authentication and authorization middleware.
- Use `[Authorize]` attributes on controllers and actions.
- Store secrets in environment variables or a secrets manager — never in source code.
- Validate and sanitize all user input.

## Performance
- Use async/await throughout the request pipeline.
- Use response caching and output caching where appropriate.
- Avoid blocking calls (`Task.Result`, `Task.Wait()`) in async code.
- Use `IMemoryCache` or distributed cache for frequently accessed data.

## Common Pitfalls
- Do not use `async void` — always return `Task` or `Task<T>`.
- Do not capture the synchronization context in library code — use `ConfigureAwait(false)`.
- Register services with the correct lifetime (Transient, Scoped, Singleton).
- Do not resolve scoped services from a singleton.
- Always dispose of `HttpClient` properly — use `IHttpClientFactory`.
