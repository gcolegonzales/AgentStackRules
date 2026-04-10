# React Router Rules

## Overview
React Router is the standard routing library for React single-page applications.

## Installation & Setup
- Use `react-router-dom` for web applications.
- Set up the router at the app root using `BrowserRouter` or `createBrowserRouter`.

## Usage Patterns
- Define routes declaratively using the route configuration object or `<Route>` components.
- Use `<Link>` and `<NavLink>` for navigation — do not use anchor tags for internal routes.
- Use `useNavigate` for programmatic navigation.
- Use `useParams` to access URL parameters and `useSearchParams` for query strings.
- Use route-level code splitting with `React.lazy` and `Suspense`.
- Use loader functions for data fetching when using the data router API.

## Anti-Patterns
- Do not use `window.location` for navigation within the app.
- Do not hardcode route paths as strings throughout the codebase — define route constants.
- Avoid deeply nested route definitions that are hard to follow.

## Common Pitfalls
- Always handle the "not found" case with a catch-all route.
- Use relative paths in nested routes.
- Protect routes that require authentication using wrapper components or route guards.
