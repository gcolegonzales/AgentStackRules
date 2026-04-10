# Angular Rules

## Overview
Angular is a TypeScript-based framework for building single-page applications with a structured, opinionated architecture.

## Project Structure
- Follow the Angular CLI default structure.
- One component, service, or pipe per file.
- Group by feature module, not by type.
- Use shared modules for truly cross-cutting components and pipes.
- Lazy-load feature modules via the router.

## Component Patterns
- Use the Angular CLI to generate components, services, and modules.
- Prefer OnPush change detection for all components unless there is a specific reason not to.
- Keep templates readable. Extract complex template logic into component methods or pipes.
- Use smart (container) and dumb (presentational) component separation.
- Communicate from parent to child via `@Input()`, from child to parent via `@Output()` with EventEmitter.

## State Management
- For simple apps, services with BehaviorSubject are sufficient.
- For complex state, use NgRx or a similar pattern.
- Avoid storing state in components that should be shared.
- Keep state as close to where it is used as possible.

## Styling
- Use component-scoped styles (default Angular behavior via ViewEncapsulation).
- Use SCSS for stylesheets.
- Avoid `::ng-deep` unless absolutely necessary — it breaks encapsulation.

## Performance
- Use OnPush change detection.
- Use `trackBy` functions in `*ngFor` directives.
- Lazy-load feature modules.
- Avoid expensive computations in templates — use pipes instead.
- Unsubscribe from observables to prevent memory leaks (use `takeUntilDestroyed`, `async` pipe, or manual unsubscribe).

## Accessibility
- Use semantic HTML elements.
- Provide `alt` text for images.
- Use Angular CDK a11y utilities where applicable.
- Ensure all interactive elements are keyboard navigable.

## Common Pitfalls
- Always unsubscribe from observables that do not complete on their own.
- Do not manipulate the DOM directly — use Angular bindings and directives.
- Avoid circular dependency between modules.
- Do not put heavy logic in constructors — use `ngOnInit` for initialization.
- Be careful with two-way binding (`[(ngModel)]`) in reactive forms — pick one approach per form.
