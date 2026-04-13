# Directory Structure

## Top-level layout

```
AgentStackRules/
├── instructions/        # Agent instructions (you are here)
├── scripts/             # Utility scripts (write-config.js)
├── templates/           # Section templates for new entries
├── frontend/            # Generic frontend framework rules
├── backend/             # Generic backend framework rules
├── database/            # Generic database rules
├── stacks/              # Stack combination rules (frontend + backend)
├── projects/            # Project-specific rules
└── README.md
```

## Generic rules: `frontend/`, `backend/`, `database/`

Each framework has its own directory:

```
{category}/{framework}/
├── rules.md                    # Base rules for this framework
├── {framework}-{version}.md    # Version-specific overlay (optional)
└── libraries/                  # Library rules (not for database)
    ├── {library}.md
    └── ...
```

Examples:
- `frontend/react/rules.md` — base React rules
- `frontend/react/react-19.md` — React 19 specific rules
- `frontend/react/libraries/mui.md` — MUI rules
- `backend/dotnet/rules.md` — base .NET rules
- `backend/dotnet/dotnet-8.md` — .NET 8 specific rules
- `backend/dotnet/libraries/entity-framework.md` — Entity Framework rules
- `database/sql-server/rules.md` — Azure SQL Server rules

### Key points

- **Base rules** (`rules.md`) contain shared best practices that apply regardless of version.
- **Version files** are overlays — they only contain what is different or new in that version. They do not duplicate the base rules.
- **Libraries** live under their parent framework, not under database. ORMs like Entity Framework go under `backend/dotnet/libraries/`, not under `database/`.
- **Database** entries do not have a `libraries/` subdirectory.

## Stack rules: `stacks/`

For rules that only apply to a specific frontend + backend combination:

```
stacks/{frontend}-{backend}/
└── rules.md
```

Example: `stacks/react-dotnet/rules.md`

Stack directories are created on demand — only when someone has integration rules for a specific combination.

## Project-specific rules: `projects/`

Each scanned project gets its own directory that mirrors the generic structure:

```
projects/{project-name}/
├── overview.md                              # High-level project summary
├── frontend/{framework}/
│   ├── rules.md                             # How THIS project uses the framework
│   └── libraries/
│       └── {library}.md                     # How THIS project uses the library
├── backend/{framework}/
│   ├── rules.md
│   └── libraries/
│       └── {library}.md
└── database/{framework}/
    └── rules.md
```

The project name is derived from the git remote URL (e.g., `fuel-fueloptimization`).

Project-specific rules describe how the actual project uses each technology — observed patterns, conventions, architecture decisions. They are not copies of the generic rules.

## Templates: `templates/`

Templates define the standard section structure for each type of entry:

- `templates/frontend.md` — sections for a frontend framework
- `templates/backend.md` — sections for a backend framework
- `templates/database.md` — sections for a database
- `templates/library.md` — sections for a library
- `templates/stack.md` — sections for a stack combination

When creating new entries, use these as a guide for what sections to include. Fill every section with real content.
