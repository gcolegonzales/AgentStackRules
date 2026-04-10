# React Rules

## Overview
React is a JavaScript library for building user interfaces using a component-based architecture.

## Project Structure
- Group files by feature or route, not by type.
- Keep components, hooks, and utilities close to where they are used.
- Use an `index.ts` barrel export only at feature boundaries, not for every folder.

## Component Patterns
- Use functional components exclusively. Do not use class components.
- Keep components small and focused on a single responsibility.
- Use PascalCase for component names and filenames.
- Extract reusable logic into custom hooks prefixed with `use`.
- Prefer composition over prop drilling — use children and render props when appropriate.
- Use fragments (`<>...</>`) to avoid unnecessary wrapper divs.

## State Management
- Start with local state (`useState`) and lift state only when needed.
- Use `useReducer` for complex state logic within a component.
- Use context sparingly — it is not a replacement for a state management library.
- Avoid storing derived values in state. Compute them during render.

## Styling
- Be consistent with the styling approach chosen for the project.
- Avoid inline styles unless values are dynamic.
- Use CSS modules, styled-components, or a utility framework consistently — do not mix approaches.

## Performance
- Use `React.memo` only when profiling shows unnecessary re-renders.
- Use `useMemo` and `useCallback` only when there is a measurable performance need.
- Avoid creating new objects or functions inside render unless necessary.
- Use lazy loading (`React.lazy`) for route-level code splitting.

## Accessibility
- Use semantic HTML elements (`button`, `nav`, `main`, `section`).
- Always provide `alt` text for images.
- Ensure interactive elements are keyboard accessible.
- Use ARIA attributes only when semantic HTML is insufficient.
- Test with a screen reader periodically.

## Common Pitfalls
- Do not mutate state directly. Always use the setter function.
- Always provide a stable `key` prop when rendering lists. Do not use array index as key if the list can reorder.
- Do not call hooks conditionally or inside loops.
- Clean up side effects in `useEffect` return functions (timers, subscriptions, event listeners).
- Avoid excessive `useEffect` — if you are syncing state with props, you likely do not need an effect.
