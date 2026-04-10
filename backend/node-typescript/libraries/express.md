# Express Rules

## Overview
Express is a minimal web framework for Node.js for building APIs and web applications.

## Installation & Setup
- Install `express` and `@types/express` for TypeScript support.
- Structure the app with separate files for routes, middleware, and configuration.

## Usage Patterns
- Use `Router` to organize routes by feature.
- Use middleware for request parsing, authentication, logging, and error handling.
- Use `express.json()` for JSON body parsing.
- Keep route handlers thin — delegate to service functions.
- Use async route handlers and pass errors to `next()` for centralized error handling.

## Anti-Patterns
- Do not put business logic in route handlers.
- Do not use `app.use()` for everything — be specific about which routes need which middleware.
- Do not silently swallow errors in async handlers.

## Common Pitfalls
- Express does not handle async errors by default. Use a wrapper or `express-async-errors` to catch rejected promises.
- Define the error handling middleware last, with four parameters `(err, req, res, next)`.
- Set appropriate security headers — use the `helmet` middleware.
- Be careful with middleware ordering — it executes in the order it is registered.
