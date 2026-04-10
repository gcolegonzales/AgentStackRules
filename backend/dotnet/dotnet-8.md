# .NET 8 Version-Specific Rules

## Overview
.NET 8 is an LTS release with significant performance improvements and new features.

## Key Differences
- Use the minimal hosting model (`WebApplication.CreateBuilder`) — it is the standard.
- Native AOT compilation is available for suitable workloads.
- Use `TimeProvider` for testable time-dependent code instead of `DateTime.Now`.
- Use `FrozenDictionary` and `FrozenSet` for read-heavy lookup collections.
- Use keyed services for dependency injection when multiple implementations of the same interface are needed.

## Preferred Patterns
- Use primary constructors for simple classes and records.
- Use collection expressions (`[1, 2, 3]`) where supported.
- Use `IExceptionHandler` for global exception handling instead of middleware.
- Use output caching middleware for API response caching.

## Common Pitfalls
- If upgrading from .NET 6, review breaking changes especially around `System.Text.Json` behavior.
- Native AOT has limitations — not all libraries are compatible. Test thoroughly if using it.
