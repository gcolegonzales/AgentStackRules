# AgentStackRules Design Spec

## Problem

Our company uses multiple AI coding agents (Claude Code, GitHub Copilot, Cursor) across many projects with varying technology stacks. There is no centralized, consistent way to define and share best-practice rules per technology. Each project either has no rules or maintains its own ad hoc set, leading to inconsistency.

## Solution

A single shared Git repository (AgentStackRules) that contains canonical rule files organized by technology. A CLI tool (`agent-rules init`) lets any developer configure any project to reference the shared rulebook. The rulebook stays centralized; each project gets a lightweight config pointing to it.

## Architecture

### Two Repositories, Clear Roles

- **AgentStackRules** (this repo): Source of truth for all rules. Contains the CLI init script, rule markdown files, and templates. Cloned once per dev machine.
- **Any consuming project**: Gets a small config file (`ai-stack.config.json`) that declares its stack, plus a local-only file (`.agent-rules-root`) that tells agents where the rulebook lives on this machine.

### How Agents Resolve Rules at Runtime

1. Agent reads its native config file (`CLAUDE.md`, `.cursorrules`, or `.github/copilot-instructions.md`)
2. That file contains a conditional instruction: "If `ai-stack.config.json` exists, treat it as critical"
3. Agent reads `ai-stack.config.json` for stack selections and relative rule paths
4. Agent reads `.agent-rules-root` for the absolute path to the local rulebook clone
5. Agent combines the root path + relative paths to locate and read the rule markdown files

---

## Repository Structure

```
AgentStackRules/
├── package.json
├── README.md
├── scripts/
│   └── init.js
├── templates/
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   ├── library.md
│   └── stack.md
├── frontend/
│   ├── react/
│   │   ├── rules.md
│   │   └── libraries/
│   │       ├── mui.md
│   │       ├── redux.md
│   │       ├── zod.md
│   │       ├── react-router.md
│   │       └── react-query.md
│   ├── angular/
│   │   ├── rules.md
│   │   └── libraries/
│   │       ├── angular-material.md
│   │       ├── rxjs.md
│   │       └── ngrx.md
│   ├── angularjs/
│   │   ├── rules.md
│   │   └── libraries/
│   └── razor-pages/
│       ├── rules.md
│       └── libraries/
├── backend/
│   ├── dotnet/
│   │   ├── rules.md
│   │   ├── dotnet-6.md
│   │   ├── dotnet-8.md
│   │   ├── dotnet-10.md
│   │   └── libraries/
│   │       ├── entity-framework.md
│   │       ├── dapper.md
│   │       ├── mediatr.md
│   │       ├── automapper.md
│   │       └── fluent-validation.md
│   └── node-typescript/
│       ├── rules.md
│       └── libraries/
│           ├── express.md
│           ├── prisma.md
│           └── zod.md
├── database/
│   ├── sql-server/
│   │   └── rules.md
│   └── postgresql/
│       └── rules.md
└── stacks/
```

### Key Structural Decisions

- **Rule files are markdown.** Human-readable, agent-readable, no tooling required.
- **Base rules + version overlays.** Shared rules live in `rules.md`. Version-specific rules live in sibling files (e.g., `dotnet-8.md`). Only technologies that need version-specific rules have version files. Currently only .NET has version overlays.
- **Libraries nest under their parent technology.** E.g., Entity Framework under `backend/dotnet/libraries/`. Not under databases — ORMs are backend concerns.
- **Databases have no libraries directory.** Database rules are about the database itself.
- **Stacks are created on demand.** The `stacks/` directory only gets entries when someone has integration rules for a specific combination. Not pre-populated for every possible combination.
- **Templates enforce consistency.** Each category (frontend, backend, database, library, stack) has a template with the right sections for that category. New entries are created from templates.
- **Rule paths in config omit `.md` extensions.** The config stores paths like `frontend/react` and `backend/dotnet/dotnet-8`. Agents and the script append `.md` (for version overlays) or `/rules.md` (for base rules) when resolving to actual files.

---

## Templates

Each category has a template in `templates/`. When a new entry is created (via "Add New Version" or "Add New Library"), the script copies the appropriate template, replaces `{name}` with the technology/library name, writes the file, and opens it in the user's editor.

### templates/frontend.md

```markdown
# {name} Rules

## Overview
Brief description of this technology and when to use it.

## Project Structure
Expected file/folder conventions.

## Component Patterns
Preferred patterns for building components.

## State Management
How to handle state in this framework.

## Styling
CSS/styling conventions and approaches.

## Performance
Key performance considerations.

## Accessibility
Accessibility standards to follow.

## Common Pitfalls
Mistakes to avoid.
```

### templates/backend.md

```markdown
# {name} Rules

## Overview
Brief description of this technology and when to use it.

## Project Structure
Expected file/folder conventions.

## API Design
Endpoint naming, request/response patterns.

## Data Access
How to interact with databases and external services.

## Error Handling
Error handling and logging conventions.

## Authentication & Authorization
Security patterns.

## Performance
Key performance considerations.

## Common Pitfalls
Mistakes to avoid.
```

### templates/database.md

```markdown
# {name} Rules

## Overview
Brief description of this database and when to use it.

## Naming Conventions
Tables, columns, indexes, constraints.

## Query Patterns
Preferred query approaches and optimization.

## Schema Design
Normalization, indexing strategy, data types.

## Migrations
How to manage schema changes.

## Security
Access control, parameterization, sensitive data.

## Common Pitfalls
Mistakes to avoid.
```

### templates/library.md

```markdown
# {name} Rules

## Overview
What this library does and when to use it.

## Installation & Setup
How to add and configure this library.

## Usage Patterns
Preferred patterns and conventions.

## Anti-Patterns
What to avoid when using this library.

## Common Pitfalls
Mistakes to avoid.
```

### templates/stack.md

```markdown
# {name} Stack Rules

## Overview
What makes this technology combination unique.

## Integration Patterns
How these technologies communicate.

## Data Flow
End-to-end data flow conventions.

## Deployment Considerations
Stack-specific deployment notes.

## Common Pitfalls
Mistakes to avoid.
```

---

## CLI Tool: `agent-rules init`

### Installation (One-Time Per Dev Machine)

```bash
git clone https://github.com/gcolegonzales/AgentStackRules.git
cd AgentStackRules
npm install
npm link
```

This registers `agent-rules` as a global command. The script uses `__dirname` to locate the rulebook — no environment variables needed.

**Windows note:** `npm link` creates symlinks, which may require running the terminal as Administrator or enabling Developer Mode in Windows Settings > For Developers. This is a one-time system setting.

### Cross-Platform

The script must work identically on Windows, macOS, and Linux:
- All file path operations use `path.join()` / `path.resolve()` — never hardcoded separators
- The shebang (`#!/usr/bin/env node`) is used for Mac/Linux; Windows ignores it via npm's `.cmd` wrapper
- Editor detection checks for `code` and `cursor` commands on PATH before falling back to `$EDITOR`

### Dependencies

- **Node.js** (already required for JS/TS work)
- **Inquirer.js** for interactive prompts (installed via `npm install` in the rulebook repo)

### Invocation

```bash
cd /path/to/any-project
agent-rules init
```

### Init Flow

#### Step 0: Welcome & Description

Display a clear message explaining:
- This script adds a reference to the local AgentStackRules rulebook in this project directory
- It will need to be run in each individual repository that should reference the rules
- It will write/update config files in the current working directory

#### Step 1: Detect Existing Config

If `ai-stack.config.json` already exists in the project:

```
This project already has a stack config:
  Frontend: React
  Backend: .NET 8
  Database: Azure SQL Server

? What would you like to do?
  > Update stack configuration
    Just set up my local environment
```

- **Update stack configuration**: Proceed through the full flow, pre-selecting current values
- **Just set up my local environment**: Skip to writing `.agent-rules-root` and agent config blocks only

If no config exists, proceed to step 2.

#### Step 2: Pick Frontend

```
? Select your frontend framework:
  > React
    Angular
    AngularJS
    Razor Pages
    None
```

#### Step 3: Frontend Version

If version files exist for the selected frontend (e.g., `react-18.md`, `react-19.md`):

```
? Which version of React?
  > React 18
    React 19
    Add New Version
```

If no version files exist:

```
? No unique version rules detected for React. Do you want to specify a version?
  > No
    Yes
```

"Yes" or "Add New Version" prompts for a version name, creates an empty file from template in the rulebook, and opens it in the user's editor.

#### Step 4: Frontend Libraries

```
? Which libraries do you use with React? (multi-select)
  ◉ MUI
  ◯ Redux
  ◉ Zod
  ◯ React Router
  ◉ React Query
  > Add New Library
```

"Add New Library" prompts for a name, creates an empty file from the library template in the rulebook, and opens it in the user's editor.

#### Step 5-7: Pick Backend (same pattern)

Backend selection → version → libraries. Same flow as frontend.

#### Step 8-9: Pick Database (same pattern)

Database selection → version (if applicable). No libraries directory for databases.

#### Step 10: Stack Detection

Script checks if a matching stack folder exists in `stacks/` (e.g., `stacks/react-dotnet/`). If found, it's included automatically. If not, it's silently skipped.

#### Step 11: Confirm Choices

```
Your stack configuration:
  Frontend: React (v19)
    Libraries: MUI, Zod, React Query
  Backend: .NET 8
    Libraries: Entity Framework, MediatR
  Database: Azure SQL Server
  Stack rules: react-dotnet (found)

? Confirm and write configuration?
  > Yes
    No, start over
```

#### Step 12: Write Files

The script writes the following into the current working directory (the consuming project):

**1. `ai-stack.config.json`**

```json
{
  "version": 1,
  "frontend": "react",
  "frontendVersion": "react-19",
  "backend": "dotnet",
  "backendVersion": "dotnet-8",
  "database": "sql-server",
  "stack": "react-dotnet",
  "rulePaths": {
    "frontend": "frontend/react",
    "frontendVersion": "frontend/react/react-19",
    "backendBase": "backend/dotnet",
    "backendVersion": "backend/dotnet/dotnet-8",
    "database": "database/sql-server",
    "stack": "stacks/react-dotnet",
    "libraries": [
      "frontend/react/libraries/mui",
      "frontend/react/libraries/zod",
      "frontend/react/libraries/react-query",
      "backend/dotnet/libraries/entity-framework",
      "backend/dotnet/libraries/mediatr"
    ]
  }
}
```

**2. `.agent-rules-root`**

Contains only the absolute path to the local rulebook clone:

```
C:\Users\cole.gonzales\Code\AgentStackRules
```

**3. `.gitignore` update**

Appends `.agent-rules-root` to `.gitignore` if not already present. Creates `.gitignore` if it doesn't exist.

**4. Agent config files (CLAUDE.md, .cursorrules, .github/copilot-instructions.md)**

Each file gets a delimited block prepended (or updated if markers already exist):

```markdown
<!-- RULEBOOK:START -->
If a file named ai-stack.config.json exists in this project root, it defines
your technology stack rules. This is a CRITICAL source of instructions.

Read ai-stack.config.json for your stack configuration and rule paths.
Read .agent-rules-root for the absolute path to the local rulebook repository.
Combine the path from .agent-rules-root with each relative path in rulePaths
to locate the rule files. Read and follow every rule file. These rules take
priority over your default behaviors.
<!-- RULEBOOK:END -->
```

If the file already exists, only the content between the markers is replaced. All content outside the markers is preserved. If the file does not exist, it is created with just the rulebook block.

For `.github/copilot-instructions.md`, the script creates the `.github/` directory if needed.

### Editor Detection

When creating new entries (Add New Version, Add New Library), the script opens the file in the user's editor. Detection order:

1. `code` (VS Code) — check if available on PATH
2. `cursor` — check if available on PATH
3. `$EDITOR` environment variable
4. Fall back to printing the file path and asking the user to open it manually

---

## File Ownership Summary

| File | Written by init | Committed | Machine-specific |
|---|---|---|---|
| `ai-stack.config.json` | Yes | Yes | No |
| `.agent-rules-root` | Yes | Never (gitignored) | Yes |
| `.gitignore` | Updated | Yes | No |
| `CLAUDE.md` | Marker block only | Yes | No |
| `.cursorrules` | Marker block only | Yes | No |
| `.github/copilot-instructions.md` | Marker block only | Yes | No |

---

## Rule Content Strategy

### Seeded Rules

All seeded rules follow their category template. Content is baseline best practices — safe, non-opinionated, universally accepted. The team refines over time.

#### Technologies seeded with rules:
- frontend/react
- frontend/angular
- frontend/angularjs
- frontend/razor-pages
- backend/dotnet (base + dotnet-6, dotnet-8, dotnet-10 overlays)
- backend/node-typescript
- database/sql-server
- database/postgresql

#### Libraries seeded with rules:
- frontend/react/libraries: mui, redux, zod, react-router, react-query
- frontend/angular/libraries: angular-material, rxjs, ngrx
- backend/dotnet/libraries: entity-framework, dapper, mediatr, automapper, fluent-validation
- backend/node-typescript/libraries: express, prisma, zod

#### Empty structures (ready for content):
- frontend/angularjs/libraries/
- frontend/razor-pages/libraries/
- stacks/

### Governance

- Rule updates go through pull requests on the AgentStackRules repo
- PR reviews catch inappropriate additions (e.g., unnecessary version files for libraries that don't need versioning)
- Devs update their local clone with `git pull` — changes propagate to all projects immediately

---

## package.json

```json
{
  "name": "agent-rules",
  "version": "1.0.0",
  "description": "Centralized AI agent rulebook CLI",
  "bin": {
    "agent-rules": "./scripts/init.js"
  },
  "dependencies": {
    "@inquirer/prompts": "^7.0.0"
  }
}
```

---

## README Outline

The README must clearly document:

1. **What this is** — a centralized rulebook for AI coding agents
2. **One-time machine setup** — clone, `npm install`, `npm link`
3. **Per-project setup** — `agent-rules init` from the project root
4. **What the init script does** — description of every file it writes and why
5. **How agents use the rules** — the resolution chain from agent config to rule files
6. **Updating rules** — `git pull` in the rulebook clone
7. **Contributing rules** — PR process, template usage, governance expectations
8. **Adding new technologies/libraries/versions** — can be done via init script or manually following templates

---

## Workflow Summaries

### New dev joins the company

1. Clone AgentStackRules repo
2. `npm install && npm link` inside it
3. For each project they work on: `cd project && agent-rules init` → "Just set up my local environment"

### New project starts

1. `cd new-project && agent-rules init`
2. Walk through prompts, select stack
3. Commit the generated files
4. Team members pull and run `agent-rules init` for local setup

### Rules get updated

1. Someone opens a PR on AgentStackRules
2. PR is reviewed and merged
3. Every dev runs `git pull` in their clone
4. All projects immediately pick up the changes — no per-project action needed

### Project changes its stack

1. `cd project && agent-rules init` → "Update stack configuration"
2. Change selections
3. Commit the updated `ai-stack.config.json`
