# Zod Rules (Node/TypeScript Backend)

## Overview
Zod is a TypeScript-first schema validation library. On the backend, use it to validate API request bodies, query parameters, and external data.

## Installation & Setup
- Install `zod` as a dependency.
- Define schemas in a shared location or co-located with the routes that use them.

## Usage Patterns
- Validate all incoming request data (body, params, query) at the API boundary.
- Use `z.infer<typeof schema>` to derive TypeScript types from schemas — single source of truth.
- Use `.safeParse()` in middleware to return structured validation errors to clients.
- Compose schemas using `.extend()`, `.merge()`, `.pick()`, and `.omit()`.
- Use `.transform()` for coercion (e.g., string to number for query params).

## Anti-Patterns
- Do not write separate TypeScript interfaces and Zod schemas for the same data.
- Do not validate inside business logic — validate at the entry point and trust the types downstream.
- Do not catch and ignore validation errors.

## Common Pitfalls
- `.parse()` throws `ZodError` — handle it in your error middleware.
- Use `.coerce.number()` for query parameters that arrive as strings.
- When sharing schemas between frontend and backend, put them in a shared package.
