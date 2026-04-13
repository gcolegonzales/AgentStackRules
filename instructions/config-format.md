# Config Format

## ai-stack.config.json

This file lives in the target project root and declares the project's technology stack. It is committed to git so all team members share the same stack definition.

### Schema

```json
{
  "version": 2,
  "project": "fuel-fueloptimization",
  "rulebookRoot": ".agent-rules-root",
  "pathConventions": {
    "genericRules": "{category}/{framework}/rules.md",
    "genericVersion": "{category}/{framework}/{version}.md",
    "genericLibrary": "{category}/{framework}/libraries/{library}.md",
    "projectOverview": "projects/{project}/overview.md",
    "projectRules": "projects/{project}/{category}/{framework}/rules.md",
    "projectLibrary": "projects/{project}/{category}/{framework}/libraries/{library}.md"
  },
  "stack": {
    "frontend": {
      "framework": "react",
      "version": "react-19",
      "libraries": ["mui", "zod", "react-query"]
    },
    "backend": {
      "framework": "dotnet",
      "version": "dotnet-8",
      "libraries": ["entity-framework", "mediatr"]
    },
    "database": {
      "framework": "sql-server"
    }
  }
}
```

### Fields

- **version** — always `2`. Used to detect config format changes.
- **project** — the project identifier, derived from git remote. `null` if the project has not been scanned and has no project-specific rules.
- **rulebookRoot** — always `".agent-rules-root"`. Tells agents to read that file for the absolute path.
- **pathConventions** — string templates for resolving rule file paths. The write-config script always writes these identically. Agents substitute `{category}`, `{framework}`, `{version}`, `{library}`, and `{project}` from the `stack` and `project` fields.
- **stack** — the technology selections.
  - Each category (`frontend`, `backend`, `database`) contains:
    - **framework** — the framework identifier (e.g., `react`, `dotnet`, `sql-server`)
    - **version** — (optional) the version identifier (e.g., `react-19`, `dotnet-8`)
    - **libraries** — (optional, not used for database) array of library identifiers

### How to resolve a rule file path

1. Read `.agent-rules-root` to get the absolute rulebook path.
2. Pick the appropriate `pathConventions` template.
3. Substitute the variables from `stack` and `project`.
4. Join the rulebook root + the resolved relative path.

Example — finding the project-specific frontend rules:
- Template: `projects/{project}/{category}/{framework}/rules.md`
- project = `fuel-fueloptimization`, category = `frontend`, framework = `react`
- Result: `projects/fuel-fueloptimization/frontend/react/rules.md`
- Full path: `<rulebook-root>/projects/fuel-fueloptimization/frontend/react/rules.md`

## .agent-rules-root

A plain text file in the target project root containing a single line: the absolute path to the local AgentStackRules clone. This file is always gitignored because it is machine-specific.

Example content:
```
C:\Users\cole.gonzales\Code\AgentStackRules
```

## Priority

- **Project-specific rules** (in `projects/`) are the primary source of truth.
- **Generic rules** (in `frontend/`, `backend/`, `database/`) are secondary reference for broader best practices and for filling gaps where project-specific rules are silent.
