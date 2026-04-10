# Zod Rules

## Overview
Zod is a TypeScript-first schema validation library for parsing and validating data at runtime.

## Installation & Setup
- Install `zod` as a dependency.
- Define schemas close to where they are used or in a shared `schemas/` directory.

## Usage Patterns
- Use Zod schemas to validate all external data (API responses, form inputs, URL params).
- Infer TypeScript types from schemas using `z.infer<typeof schema>` — do not duplicate type definitions.
- Use `.parse()` when you want to throw on invalid data. Use `.safeParse()` when you want to handle errors gracefully.
- Compose schemas using `.extend()`, `.merge()`, `.pick()`, and `.omit()`.
- Use `.transform()` for data normalization during parsing.

## Anti-Patterns
- Do not write separate TypeScript interfaces and Zod schemas for the same data — derive one from the other.
- Do not catch and ignore Zod validation errors silently.
- Do not use Zod for internal function arguments between trusted code — it is for system boundaries.

## Common Pitfalls
- Remember that `.parse()` throws `ZodError`, not a plain `Error`.
- Use `.optional()` and `.nullable()` correctly — they are not the same thing.
- When using with forms (React Hook Form, etc.), use the appropriate resolver adapter.
