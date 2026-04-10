# FluentValidation Rules

## Overview
FluentValidation is a .NET library for building strongly-typed validation rules using a fluent API.

## Installation & Setup
- Install `FluentValidation` and `FluentValidation.AspNetCore` (or `FluentValidation.DependencyInjectionExtensions`).
- Register validators with `AddValidatorsFromAssemblyContaining<T>()`.

## Usage Patterns
- Create one validator class per request/command DTO.
- Use the fluent API (`RuleFor`, `Must`, `When`) for clear, readable rules.
- Use `WithMessage` to provide user-friendly error messages.
- Use `Include` to compose common validation rules from shared validators.
- Validate at the API boundary — use automatic validation via the ASP.NET pipeline or MediatR pipeline behavior.

## Anti-Patterns
- Do not put business logic in validators — they should validate shape and constraints, not business rules.
- Do not validate the same thing in multiple places. Validate once at the entry point.
- Do not throw exceptions from validators — return validation results.

## Common Pitfalls
- Async validators (`MustAsync`, `WhenAsync`) require the validator to be called with `ValidateAsync`.
- When using with MediatR, create a validation pipeline behavior to run validators automatically.
- `CascadeMode.Stop` prevents running subsequent rules on a property after the first failure — use it to avoid redundant error messages.
