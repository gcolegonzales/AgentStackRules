# New Project Setup

Use this flow when a user wants to configure a new project (or a project with no existing rules) to use the AgentStackRules rulebook.

## Prerequisites

- You must know the **rulebook root** — the absolute path to the AgentStackRules repo on this machine. If you are currently in the rulebook repo, use the current working directory. Otherwise, ask the user.
- You must know the **target project path** — the absolute path to the project to configure. The user may provide this, or you may need to ask.

## Flow

### 1. Identify the target project

If the user provided a path, use it. Otherwise ask:
> "What is the path to the project you want to configure?"

Verify the path exists before proceeding.

### 2. Ask about the frontend

Ask conversationally: "What frontend framework does this project use?"

- Check what exists in the rulebook under `frontend/` for matching entries.
- Handle typos and shorthand naturally ("react", "React", "re act" → React).
- If the user names something that does not exist in the rulebook, offer to create it (see `instructions/creating-entries.md`).
- "None" is a valid answer.

If a framework is selected:
- **Version:** Check if version files exist for that framework in the rulebook (e.g., `frontend/react/react-19.md`). If versions exist, ask which one. If none exist, ask: "Do you want to specify a version?" If yes, create the version file with real content.
- **Libraries:** Check what exists in `frontend/{framework}/libraries/`. Ask which ones the project uses. If the user names one that does not exist, offer to create it.

### 3. Ask about the backend

Same pattern as frontend. Check `backend/` in the rulebook.

### 4. Ask about the database

Same pattern. Check `database/` in the rulebook. Databases do not have a libraries subdirectory.

### 5. Confirmation checkpoint

Before writing anything, present a summary:

```
Here is the stack configuration I will write:
  Frontend: React (react-19)
    Libraries: MUI, Zod
  Backend: .NET (dotnet-8)
    Libraries: Entity Framework, MediatR
  Database: Azure SQL Server

I will write config files into: C:\Users\cole\Code\new-project

This will create/update:
  - ai-stack.config.json
  - .agent-rules-root (gitignored)
  - .gitignore
  - CLAUDE.md
  - .cursorrules
  - .github/copilot-instructions.md

Proceed?
```

### 6. Write config files

Build the config object:

```json
{
  "project": null,
  "stack": {
    "frontend": {
      "framework": "react",
      "version": "react-19",
      "libraries": ["mui", "zod"]
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

Note: `project` is null for new projects that have not been scanned. Only scanned projects get a `projects/` directory entry.

Call the write-config script:

```bash
echo '<json>' | node <rulebook-root>/scripts/write-config.js
```

Where `<json>` is:

```json
{
  "targetPath": "<absolute path to target project>",
  "rulebookRoot": "<absolute path to rulebook repo>",
  "config": { ... the config object above ... }
}
```

### 7. Done

Tell the user:
- The config files have been written
- They should commit the new files to their repo
- Other developers will need to run through this setup (from the rulebook repo) to configure their `.agent-rules-root` pointing to their own local rulebook clone
- The generic rules in the rulebook are now their starting reference for best practices
