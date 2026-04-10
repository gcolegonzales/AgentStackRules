# AngularJS Rules

## Overview
AngularJS (1.x) is a legacy JavaScript framework. These rules focus on maintainability and stability for existing applications.

## Project Structure
- Organize by feature, not by type (controllers, services, directives).
- Each feature folder should contain its controller, template, service, and tests.
- Use a consistent naming convention: `featureName.controller.js`, `featureName.service.js`, etc.

## Component Patterns
- Prefer components (`.component()`) over directives for UI elements.
- Use controllerAs syntax instead of `$scope`.
- Keep controllers thin — move business logic to services.
- Use one-way bindings (`<`) instead of two-way bindings (`=`) where possible.

## State Management
- Manage shared state through services, not `$rootScope`.
- Do not broadcast events via `$rootScope.$broadcast` for state changes — use service methods.
- Keep service state minimal and well-documented.

## Performance
- Minimize the number of watchers. Avoid `$watch` when possible.
- Use one-time bindings (`::expression`) for values that do not change.
- Use `track by` in `ng-repeat` to help AngularJS track DOM elements efficiently.
- Avoid `$apply` and `$digest` calls unless interfacing with non-Angular code.

## Common Pitfalls
- Do not use `$scope` directly — use controllerAs syntax.
- Avoid deep watching objects (`$watch` with `true` as third argument) — it is expensive.
- Do not mix jQuery DOM manipulation with AngularJS — let AngularJS manage the DOM.
- Be aware of digest cycle performance when adding watchers.
- Plan for migration to Angular (2+) where feasible.
