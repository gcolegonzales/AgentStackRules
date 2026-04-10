# AgentStackRules

A centralized rulebook for AI coding agents. Define best-practice rules per technology stack in one shared repository, then configure any project to reference them. Supports Claude Code, GitHub Copilot, and Cursor.

## How It Works

This repository contains markdown rule files organized by technology. A CLI tool (`agent-rules init`) configures any project to reference the relevant rules. The rulebook stays centralized here; each project gets a lightweight config file pointing back to it.

**AI agents resolve rules at runtime like this:**

1. Agent reads its config file (`CLAUDE.md`, `.cursorrules`, or `.github/copilot-instructions.md`)
2. That file tells the agent to read `ai-stack.config.json` if it exists
3. Agent reads `ai-stack.config.json` for the project's stack and rule paths
4. Agent reads `.agent-rules-root` for the local path to this rulebook clone
5. Agent combines the paths and reads the rule files

## One-Time Machine Setup

Every developer does this once on their machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- Git

### Steps

```bash
git clone https://github.com/gcolegonzales/AgentStackRules.git
cd AgentStackRules
npm install
npm link
```

This registers `agent-rules` as a global command on your machine.

> **Windows users:** `npm link` creates symlinks, which may require running the terminal as **Administrator** or enabling **Developer Mode** in Windows Settings > For Developers. This is a one-time system setting.

## Per-Project Setup

Run this from inside any project directory you want to configure:

```bash
cd /path/to/your-project
agent-rules init
```

The script will:

1. Show a welcome message explaining what it does
2. Ask you to select your frontend framework, backend framework, and database
3. Ask about versions and libraries for each selection
4. Confirm your choices
5. Write configuration files into the project

### Files Written to Your Project

| File | Purpose | Committed to git? |
|---|---|---|
| `ai-stack.config.json` | Declares the project's stack and rule paths | **Yes** |
| `.agent-rules-root` | Stores the absolute path to your local rulebook clone | **No** (auto-gitignored) |
| `CLAUDE.md` | Tells Claude Code to read the rulebook | **Yes** |
| `.cursorrules` | Tells Cursor to read the rulebook | **Yes** |
| `.github/copilot-instructions.md` | Tells GitHub Copilot to read the rulebook | **Yes** |

The agent config files (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`) use delimited markers (`<!-- RULEBOOK:START -->` / `<!-- RULEBOOK:END -->`). If these files already exist in your project, only the content between the markers is updated — your existing content outside the markers is preserved.

### When the Project Already Has a Config

If `ai-stack.config.json` already exists (because a teammate already set it up), the script detects it and asks:

- **Update stack configuration** — re-select technologies and rewrite the config
- **Just set up my local environment** — only writes `.agent-rules-root` and the agent config blocks (most common for new team members)

## Updating Rules

When rules are updated in this repository:

```bash
cd /path/to/AgentStackRules
git pull
```

That's it. Every project that references the rulebook picks up the changes immediately — no per-project action needed.

## Repository Structure

```
AgentStackRules/
├── scripts/             # CLI tool
├── templates/           # Templates for new entries (frontend, backend, database, library, stack)
├── frontend/
│   ├── react/           # rules.md + libraries/
│   ├── angular/         # rules.md + libraries/
│   ├── angularjs/       # rules.md + libraries/
│   └── razor-pages/     # rules.md + libraries/
├── backend/
│   ├── dotnet/          # rules.md + version overlays (dotnet-6.md, etc.) + libraries/
│   └── node-typescript/ # rules.md + libraries/
├── database/
│   ├── sql-server/      # rules.md
│   └── postgresql/      # rules.md
└── stacks/              # Combination-specific rules (created on demand)
```

### Rule Organization

- **Base rules** live in `rules.md` inside each technology folder
- **Version-specific rules** are sibling `.md` files (e.g., `dotnet-8.md`) that override or extend the base
- **Library rules** live in a `libraries/` subfolder under their parent technology
- **Stack rules** in `stacks/` cover integration concerns for specific technology combinations

## Contributing Rules

### Editing Existing Rules

1. Find the rule file in the repository structure
2. Edit the markdown content
3. Submit a pull request

### Adding New Technologies, Libraries, or Versions

**Via the init script:** When running `agent-rules init`, you can select "Add New Version" or "Add New Library" at the relevant prompt. The script creates the file from the appropriate template and opens it in your editor.

**Manually:** Copy the relevant template from `templates/`, rename it, place it in the correct directory, and fill in the content.

### Templates

Each category has a template in `templates/` that defines the standard sections:

- `templates/frontend.md` — for new frontend frameworks
- `templates/backend.md` — for new backend frameworks
- `templates/database.md` — for new databases
- `templates/library.md` — for new libraries
- `templates/stack.md` — for new stack combinations

Always follow the template structure to keep rules consistent across technologies.

### Governance

- All rule changes go through pull requests
- PR reviews should verify that rules are safe, non-opinionated, and universally applicable
- Version files should only be added for technologies where version differences matter
- The team refines rules over time based on real-world experience

## Workflows

### New developer joins the company

1. Clone this repo and run `npm install && npm link`
2. For each project: `cd project && agent-rules init` → "Just set up my local environment"

### New project starts

1. `cd new-project && agent-rules init`
2. Walk through prompts, select stack
3. Commit the generated files
4. Teammates pull and run `agent-rules init` for their local setup

### Project changes its stack

1. `cd project && agent-rules init` → "Update stack configuration"
2. Change selections
3. Commit the updated `ai-stack.config.json`
