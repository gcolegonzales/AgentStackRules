# Node.js (TypeScript) Rules

## Overview
Node.js with TypeScript for building server-side applications and APIs with type safety.

## Project Structure
- Use `src/` for source code, `dist/` for compiled output.
- Organize by feature or domain, not by technical layer.
- Use `tsconfig.json` with strict mode enabled.
- Keep entry points clear (`src/index.ts` or `src/server.ts`).

## API Design
- Use RESTful conventions: nouns for resources, HTTP verbs for actions.
- Return consistent response shapes with appropriate status codes.
- Use middleware for cross-cutting concerns (auth, logging, error handling).
- Validate request bodies at the API boundary using a validation library.

## Data Access
- Use parameterized queries — never concatenate user input into queries.
- Use an ORM or query builder for type-safe database interactions.
- Use connection pooling for database connections.
- Keep database logic in a data access layer, not in route handlers.

## Error Handling
- Use a centralized error handling middleware.
- Create typed error classes for different error categories.
- Log errors with structured logging.
- Return consistent error response shapes to clients.
- Never expose internal error details (stack traces, SQL errors) in API responses.

## Authentication & Authorization
- Use established libraries for JWT or session-based auth.
- Store secrets in environment variables — never in source code.
- Validate and sanitize all user input.
- Use middleware to enforce authorization on protected routes.

## Performance
- Use async/await for all I/O operations.
- Do not block the event loop with CPU-intensive synchronous code.
- Use streaming for large file operations.
- Set appropriate timeouts for external service calls.

## Common Pitfalls
- Always handle promise rejections — unhandled rejections crash the process.
- Do not use `any` type — use `unknown` and narrow with type guards.
- Keep `node_modules` out of version control. Use `package-lock.json` for deterministic installs.
- Be explicit about TypeScript `strict` mode settings — do not disable strictness.
