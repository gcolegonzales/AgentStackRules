# AgentStackRules

Shared, centralized rules for AI coding agents (Claude Code, GitHub Copilot, Cursor). One repo holds all the rules. Every project points to it with a small config file.

---

## Quick Start

There are two steps: **install the CLI** (once per machine), then **configure each project**.

### Step 1: Install the CLI (once per machine)

You need [Node.js](https://nodejs.org/) v18+ and Git.

```bash
git clone https://github.com/gcolegonzales/AgentStackRules.git
cd AgentStackRules
npm install
npm link
```

That's it. You now have the `agent-rules` command available globally.

**Windows note:** `npm link` creates symlinks. You may need to either run your terminal as **Administrator** or enable **Developer Mode** (Windows Settings > For Developers). This is a one-time system setting.

### Step 2: Configure a project

Open a terminal in the root of the project you want to set up:

```bash
cd C:\Users\you\Code\your-project
agent-rules init
```

The script walks you through selecting your frontend, backend, database, versions, and libraries. When it finishes, it writes config files into the project. Commit them and you're done.

### Step 3: Other developers on the same project

Once the first person commits the config, everyone else just needs to:

1. Have the CLI installed (Step 1 above)
2. Pull the latest project code
3. Run `agent-rules init` in the project root
4. Choose **"Just set up my local environment"** when prompted

This writes a local-only file (`.agent-rules-root`) that points to their own clone of this rulebook. Nothing else to commit.

### Updating rules

When someone merges rule changes into this repo:

```bash
cd /path/to/AgentStackRules
git pull
```

Every project picks up the changes immediately. No re-running init, no per-project action.

---

## What the init script does

When you run `agent-rules init` in a project, it writes these files:

| File | What it does | Committed? |
|---|---|---|
| `ai-stack.config.json` | Declares the project's tech stack and which rule files apply | Yes |
| `.agent-rules-root` | Points to your local clone of this repo (machine-specific) | No (auto-gitignored) |
| `CLAUDE.md` | Tells Claude Code where to find and how to use the rules | Yes |
| `.cursorrules` | Tells Cursor where to find and how to use the rules | Yes |
| `.github/copilot-instructions.md` | Tells GitHub Copilot where to find and how to use the rules | Yes |

If `CLAUDE.md`, `.cursorrules`, or `.github/copilot-instructions.md` already exist in the project, the script only touches content between `<!-- RULEBOOK:START -->` and `<!-- RULEBOOK:END -->` markers. Everything else in those files is left alone.

---

## How agents use the rules

The agent config files (CLAUDE.md, .cursorrules, etc.) tell agents to:

1. Read `.agent-rules-root` to find where the rulebook lives on this machine
2. Based on the type of work (frontend, backend, database), read the relevant rule files before planning or writing code
3. Treat those rules as critical instructions

The specific rule file paths are written directly into the agent config so agents know exactly which files to read for each type of work.

---

## Repository Structure

```
AgentStackRules/
├── scripts/             # CLI tool
├── templates/           # Templates for new rule entries
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

### How rules are organized

- **Base rules** live in `rules.md` inside each technology folder
- **Version-specific rules** are sibling `.md` files (e.g., `dotnet-8.md`) that extend the base
- **Library rules** live in `libraries/` under their parent technology
- **Stack rules** in `stacks/` cover concerns specific to a frontend + backend combination

---

## Contributing

### Editing existing rules

1. Find the rule file in the repo
2. Edit the markdown
3. Submit a pull request

### Adding new technologies, libraries, or versions

**From the init script:** Every selection prompt includes a "Create New" or "Add New" option right in the list. Select it, enter a name, and the script scaffolds the directory and files from a template and opens the rules file in your editor. The list re-appears with your new entry included so you can select it and continue.

**Manually:** Copy the relevant template from `templates/`, rename it, place it in the right directory, and fill in the content.

### Templates

Each category has a template in `templates/` that defines the standard sections for consistency:

- `templates/frontend.md` — frontend frameworks
- `templates/backend.md` — backend frameworks
- `templates/database.md` — databases
- `templates/library.md` — libraries
- `templates/stack.md` — stack combinations

### Governance

- All rule changes go through pull requests
- PR reviews verify rules are safe, non-opinionated, and broadly applicable
- Version files should only exist for technologies where version differences actually matter
- Rules are refined over time based on real experience
