# Existing Project Scan

Use this flow when a user wants to scan an existing codebase to detect its stack and generate project-specific rules.

## Prerequisites

- You must know the **rulebook root** — the absolute path to the AgentStackRules repo.
- You must know the **target project path** — the absolute path to the project to scan.

## Flow

### 1. Identify the target project

If the user provided a path, use it. Otherwise ask. Verify the path exists.

### 2. Confirmation checkpoint — before scanning

Before reading any source files, explain what you are about to do:

> "I am going to scan the codebase at [path] to detect your technology stack. This will read through package.json, project files, source code imports, and folder structure. Shall I proceed?"

Wait for confirmation before scanning.

### 3. Scan the project

Read these files/locations to detect the stack:

**Frontend detection:**
- `package.json` — look for React, Angular, Vue, etc. in dependencies
- `angular.json` — indicates Angular
- Source file imports — `import React`, `from '@angular'`, etc.
- Folder structure — `src/components/`, `src/app/`, `pages/`, etc.

**Backend detection:**
- `*.csproj` / `*.sln` — .NET projects. Check `TargetFramework` for version.
- `package.json` — Node.js backend (check for Express, Fastify, etc.)
- `tsconfig.json` — TypeScript
- `requirements.txt` / `pyproject.toml` — Python

**Database detection:**
- Connection strings in config files (appsettings.json, .env, etc.)
- ORM configuration (DbContext for EF, prisma/schema.prisma for Prisma)
- Migration files

**Library detection:**
- `package.json` dependencies for frontend/Node libraries
- `*.csproj` PackageReference entries for .NET libraries
- Import statements in source files

### 4. Present findings

Show the user what you detected:

```
I detected the following stack:
  Frontend: React 19
    Libraries: MUI, Zod, React Query
  Backend: .NET 8
    Libraries: Entity Framework, MediatR, FluentValidation
  Database: Azure SQL Server

Is this correct? Anything to add or remove?
```

Let the user correct the findings. Ask about versions if you could not detect them.

### 5. Determine project name

Read the git remote to derive the project name:

```bash
git -C <target-project-path> remote get-url origin
```

Parse the repo name from the URL (e.g., `https://github.com/org/fuel-fueloptimization.git` → `fuel-fueloptimization`).

If no git remote exists, fall back to the folder name. Confirm with the user:

> "I'll use 'fuel-fueloptimization' as the project name in the rulebook. Sound right?"

### 6. Check for existing project entry

Check if `projects/<project-name>/` already exists in the rulebook. If it does, ask:

> "This project already has rules in the rulebook. Do you want to regenerate them (this will overwrite existing project rules) or just update the config files?"

### 7. Confirmation checkpoint — before generating rules

> "I am going to scan the codebase in detail and generate project-specific rules under `projects/<project-name>/` in the rulebook. This will analyze code patterns, conventions, and architecture. Proceed?"

### 8. Generate project-specific rules

For each detected technology and library:

1. **Scan the codebase** for patterns — folder structure, naming conventions, architecture patterns, error handling approach, common patterns in the code.
2. **Check for a matching generic rule file** in the rulebook. If one exists, read it.
3. **Write project-specific rules** that reflect what the project actually does. Use the template structure from `templates/` as a guide for section headings, but fill in with real observed patterns.
4. **Where the project is inconsistent or silent** on something the generic rules cover, suggest incorporating the generic best practice:
   > "I noticed this project doesn't have a consistent pattern for error handling. The general rulebook recommends using ProblemDetails for API error responses. Want me to include that recommendation?"
5. Write the rules into `projects/<project-name>/<category>/<framework>/rules.md` and `projects/<project-name>/<category>/<framework>/libraries/<library>.md`.

Also create `projects/<project-name>/overview.md` with:
- What the project is (if determinable from README or code)
- The full stack summary
- High-level architecture observations

### 9. Write config files into the target project

Build the config object with both project and generic rule paths. The `project` field should be set to the project name.

Call the write-config script the same way as in `new-project-setup.md` step 6.

### 10. Done

Tell the user:
- Project-specific rules have been generated in the rulebook under `projects/<project-name>/`
- Config files have been written to the target project
- They should review the generated rules and adjust as needed
- Commit both the rulebook changes and the project config files
- Other developers will need their own `.agent-rules-root` setup
