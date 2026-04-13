# AgentStackRules — Agent Instructions

This directory contains instructions for AI agents working with the AgentStackRules rulebook. Read this file first to determine which instruction file you need, then read only that file.

## What is this?

AgentStackRules is a centralized repository of coding rules and best practices organized by technology. It supports two types of rules:

- **Generic rules** — universal best practices per technology (in `frontend/`, `backend/`, `database/`)
- **Project-specific rules** — how a specific project uses those technologies (in `projects/`)

## What does the user want to do?

| User request | Read this file |
|---|---|
| "Set up agent-rules for a new project" | `instructions/new-project-setup.md` |
| "Scan this project" / "Generate rules for this project" | `instructions/existing-project-scan.md` |
| "Add a new framework/library/version to the rulebook" | `instructions/creating-entries.md` |
| "How does the config work?" / troubleshooting | `instructions/config-format.md` |
| "How do the agent config files work?" | `instructions/agent-config-files.md` |
| "Where do things go?" / structure questions | `instructions/directory-structure.md` |

## Important principles

- **Always confirm before large actions.** Before scanning a project, creating rule sets, or writing config files into a target project, explain what you are about to do and ask for confirmation.
- **Project-specific rules are primary.** When a project has entries in `projects/`, those take priority over generic rules. Generic rules are secondary reference.
- **Be conversational.** Handle typos, ambiguity, and shorthand naturally. If the user says "dotnet" or ".net" or ".NET 8", you know what they mean.
- **Fill in real content.** When creating new rule files, write actual best practices — not empty templates with placeholder text.
