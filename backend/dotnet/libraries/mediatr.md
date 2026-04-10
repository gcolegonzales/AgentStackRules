# MediatR Rules

## Overview
MediatR is an in-process messaging library implementing the mediator pattern for .NET. It decouples request handling from request dispatching.

## Installation & Setup
- Install `MediatR` and register it with `AddMediatR()` in the DI container.
- Scan the assembly containing your handlers.

## Usage Patterns
- Use `IRequest<TResponse>` for commands and queries that return a result.
- Use `IRequest` (no generic) for commands that return nothing.
- Use `INotification` for events that multiple handlers may process.
- Keep handlers focused — one handler per request type.
- Use pipeline behaviors for cross-cutting concerns (validation, logging, transactions).
- Name requests clearly: `CreateOrderCommand`, `GetOrderByIdQuery`.

## Anti-Patterns
- Do not use MediatR as a replacement for direct method calls within the same bounded context when there is no benefit to the indirection.
- Do not put business logic in pipeline behaviors — they are for cross-cutting concerns only.
- Do not inject `IMediator` into domain entities.

## Common Pitfalls
- Handlers are resolved through DI — ensure they are registered correctly.
- Notification handlers run in sequence by default, not in parallel.
- Do not rely on handler execution order for notifications.
