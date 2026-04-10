# Redux Rules

## Overview
Redux is a predictable state container for JavaScript apps. Use Redux Toolkit (RTK) as the standard way to write Redux logic.

## Installation & Setup
- Use `@reduxjs/toolkit` and `react-redux`.
- Configure the store using `configureStore` from RTK.
- Use the `Provider` component at the app root.

## Usage Patterns
- Define state slices using `createSlice` — this handles actions and reducers together.
- Use `createAsyncThunk` for async operations.
- Access state with `useSelector` and dispatch actions with `useDispatch`.
- Keep slice state normalized — avoid deeply nested objects.
- Co-locate slice files with the features they serve.

## Anti-Patterns
- Do not use legacy Redux patterns (manual action types, switch-case reducers, `connect()`).
- Do not put non-serializable values in the store (functions, class instances, Promises).
- Do not use Redux for all state — local UI state (modals, form inputs) belongs in component state.
- Avoid dispatching many actions in sequence — batch related changes in a single action or thunk.

## Common Pitfalls
- Always use RTK's `createSlice` — it uses Immer internally, so you can write "mutating" logic safely.
- Do not mutate state outside of RTK reducers.
- Keep selectors simple. Use `createSelector` from Reselect for derived data.
