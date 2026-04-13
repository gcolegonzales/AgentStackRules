# Creating New Entries

Use this when adding a new framework, version, or library to the rulebook.

## Important

When creating new entries, **write real best-practice content** — not empty templates with placeholder text. Use the templates in `templates/` as a guide for section structure, but fill every section with actual, useful rules and guidance.

## Adding a new framework

1. Determine the category: `frontend/`, `backend/`, or `database/`
2. Choose an identifier: lowercase, hyphenated (e.g., `vue`, `fastapi`, `mongodb`)
3. Create the directory structure:
   ```
   {category}/{framework}/
   ├── rules.md
   └── libraries/       (not for database)
   ```
4. Read the appropriate template from `templates/{category}.md`
5. Write `rules.md` using the template section structure, filled with real best practices for that framework
6. Confirmation checkpoint: "I'm about to create a new {category} entry for {framework} in the rulebook. This will add `{category}/{framework}/rules.md` with best-practice rules. Proceed?"

## Adding a new version

1. Identify the parent framework (e.g., `backend/dotnet/`)
2. Choose a version identifier: `{framework}-{version}` (e.g., `dotnet-12`, `react-20`)
3. Create `{category}/{framework}/{version-id}.md`
4. Write version-specific rules: what is different or new in this version, preferred patterns, migration notes from previous versions
5. Do not duplicate content from the base `rules.md` — version files are overlays that extend or override the base

## Adding a new library

1. Identify the parent framework (e.g., `frontend/react/`)
2. Choose an identifier: lowercase, hyphenated (e.g., `axios`, `tailwind`)
3. Create `{category}/{framework}/libraries/{library}.md`
4. Read the library template from `templates/library.md`
5. Write the library rules using the template section structure, filled with real best practices

## Naming conventions

- Framework identifiers: `react`, `angular`, `dotnet`, `node-typescript`, `sql-server`, `postgresql`
- Version identifiers: `{framework}-{version}` — e.g., `dotnet-8`, `react-19`
- Library identifiers: lowercase, hyphenated — e.g., `entity-framework`, `react-query`, `angular-material`
- All identifiers are lowercase with hyphens, no spaces, no special characters
