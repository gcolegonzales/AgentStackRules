# MUI Rules

## Overview
MUI (Material UI) is a React component library implementing Google's Material Design.

## Installation & Setup
- Use `@mui/material` as the core package.
- Install `@emotion/react` and `@emotion/styled` as peer dependencies.
- Set up a custom theme using `createTheme` and wrap the app with `ThemeProvider`.

## Usage Patterns
- Use MUI components as building blocks — do not recreate components that MUI already provides.
- Customize components through the theme object, not inline `sx` overrides on every instance.
- Use the `sx` prop for one-off style adjustments. Use `styled()` for reusable styled components.
- Use MUI's spacing system (`theme.spacing()`) for consistent margins and padding.
- Use the `Typography` component for all text to maintain consistency.

## Anti-Patterns
- Do not override MUI styles with raw CSS classes — use the theme or `sx` prop.
- Do not mix MUI components with other UI libraries in the same project.
- Avoid deeply nested `Box` components — use `Stack` and `Grid` for layout.

## Common Pitfalls
- Always import from `@mui/material` (not `@mui/material/Button` individual paths) unless bundle size analysis shows a need.
- Theme customization should be centralized, not scattered across components.
- Be mindful of bundle size — use tree shaking and only import what you need.
