# NgRx Rules

## Overview
NgRx is a reactive state management library for Angular based on the Redux pattern.

## Installation & Setup
- Install `@ngrx/store`, `@ngrx/effects`, and `@ngrx/store-devtools`.
- Register the store in the app module or with `provideStore()` for standalone apps.
- Use the NgRx CLI schematics to generate boilerplate.

## Usage Patterns
- Define actions using `createAction` and `props`.
- Define reducers using `createReducer` with `on()` handlers.
- Use selectors (`createSelector`) for reading state — never access the store shape directly.
- Use effects (`createEffect`) for side effects (API calls, navigation, logging).
- Group actions, reducers, selectors, and effects by feature.

## Anti-Patterns
- Do not put UI state (modal open/close, form dirty) in the global store unless it is shared.
- Do not dispatch actions from within reducers.
- Do not subscribe to the store in effects to trigger other actions — use action streams.
- Avoid overly granular actions — group related state changes.

## Common Pitfalls
- Always handle loading, success, and error states for async operations.
- Use `createFeature` to reduce boilerplate for feature state.
- Keep effects focused — one effect per side effect concern.
- Test reducers as pure functions and effects using marble testing or `provideMockActions`.
