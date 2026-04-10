# Angular Material Rules

## Overview
Angular Material is the official Material Design component library for Angular.

## Installation & Setup
- Install via `ng add @angular/material`.
- Import only the modules you use — do not import the entire library.
- Set up a custom theme in a dedicated `theme.scss` file.

## Usage Patterns
- Use Angular Material components before building custom ones.
- Use the theming system for consistent colors, typography, and spacing.
- Use `MatDialog` for modals, `MatSnackBar` for notifications.
- Use `MatTable` with `MatSort` and `MatPaginator` for data tables.
- Use CDK utilities (overlay, drag-drop, clipboard) for advanced interactions.

## Anti-Patterns
- Do not override Material styles with `!important` — use the theming API.
- Do not import entire modules you only use one component from.
- Do not mix Angular Material with other UI component libraries.

## Common Pitfalls
- Remember to add components to the imports array of the module or standalone component that uses them.
- Custom themes must define primary, accent, and warn palettes.
- Test with different viewport sizes — not all Material components are responsive by default.
