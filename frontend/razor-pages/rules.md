# Razor Pages Rules

## Overview
Razor Pages is a page-based model in ASP.NET Core for building server-rendered web UI.

## Project Structure
- Organize pages by feature area using folders under `/Pages`.
- Keep page models (`.cshtml.cs`) next to their corresponding Razor files (`.cshtml`).
- Use `_ViewImports.cshtml` for shared using statements and tag helpers.
- Use `_Layout.cshtml` for shared layout and navigation.

## Component Patterns
- Keep page models focused — each handles one page.
- Use handler methods (`OnGet`, `OnPost`, `OnGetAsync`, `OnPostAsync`) clearly.
- Use partial views and view components for reusable UI fragments.
- Prefer tag helpers over HTML helpers for cleaner markup.

## State Management
- Use page model properties for request-scoped data.
- Use TempData for data that must survive a redirect.
- Use session state sparingly and only for small amounts of user-specific data.
- Do not store large objects in ViewData or ViewBag.

## Styling
- Use a consistent CSS framework across pages.
- Keep page-specific styles in dedicated CSS files.
- Use bundling and minification for production.

## Performance
- Use asynchronous handler methods (`OnGetAsync`, `OnPostAsync`) for I/O operations.
- Enable response caching where appropriate.
- Minimize ViewData and TempData usage.

## Common Pitfalls
- Always validate model state in POST handlers before processing.
- Use anti-forgery tokens for all form submissions (enabled by default in Razor Pages).
- Do not put business logic in page models — delegate to services.
- Be careful with model binding — use `[BindProperty]` explicitly and validate input.
