# Agent Config Files

The write-config script writes agent-specific config files into the target project so that AI agents automatically know about the rulebook.

## Files

| File | Agent | Purpose |
|---|---|---|
| `CLAUDE.md` | Claude Code | Workspace rules loaded on every request |
| `.cursorrules` | Cursor | Workspace rules loaded on every request |
| `.github/copilot-instructions.md` | GitHub Copilot | Custom instructions for Copilot |

## Marker format

Each file contains a block delimited by markers:

```
<!-- RULEBOOK:START -->
... rulebook instructions ...
<!-- RULEBOOK:END -->
```

The write-config script only modifies content between these markers. Any content outside the markers (project-specific instructions the team has written) is preserved.

If the file does not exist, it is created with just the marker block. If it exists without markers, the block is prepended.

## Block content

The block is generated dynamically by the write-config script based on the project's `ai-stack.config.json`. It contains:

1. Instructions to read `.agent-rules-root` for the rulebook location
2. Instructions to read relevant rules before planning, designing, or writing code
3. Pre-resolved file paths for project-specific rules (primary)
4. Pre-resolved file paths for generic rules (secondary reference)
5. Priority guidance: project-specific rules take precedence

The paths are fully resolved at write time so agents do not need to do template substitution. They can read the paths directly.

## When to regenerate

The agent config blocks should be regenerated when:
- The stack changes (new framework, version, or library added/removed)
- The project gets scanned for the first time (project-specific paths get added)
- The rulebook structure changes

To regenerate, call the write-config script with the updated config.
