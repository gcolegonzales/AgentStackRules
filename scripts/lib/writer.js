import fs from 'node:fs';
import path from 'node:path';

const RULEBOOK_MARKER_START = '<!-- RULEBOOK:START -->';
const RULEBOOK_MARKER_END = '<!-- RULEBOOK:END -->';

/**
 * Build a dynamic rulebook block that includes the actual config paths
 * so agents know exactly which rules to read based on the work they're doing.
 */
function buildRulebookBlock(config) {
  const lines = [];
  lines.push(RULEBOOK_MARKER_START);
  lines.push('# Stack Rules (CRITICAL)');
  lines.push('');
  lines.push('This project uses a centralized rulebook. The file .agent-rules-root contains');
  lines.push('the absolute path to the local rulebook repository. Read it to resolve the');
  lines.push('rule file paths below. Each path is relative to that root and ends in .md');
  lines.push('(for version files) or /rules.md (for base technology rules).');
  lines.push('');
  lines.push('## When to read which rules');
  lines.push('');
  lines.push('At the START of every task, determine what kind of work you are doing and');
  lines.push('read the relevant rule files BEFORE planning, designing, or writing any code.');
  lines.push('This includes architectural decisions, implementation plans, code reviews,');
  lines.push('and any recommendations. These rules are CRITICAL instructions that take');
  lines.push('priority over your defaults.');
  lines.push('');

  if (config && config.rulePaths) {
    const rp = config.rulePaths;

    if (rp.frontend) {
      lines.push('### Frontend work (UI components, pages, styling, client-side logic)');
      lines.push(`- Read: \`${rp.frontend}/rules.md\``);
      if (rp.frontendVersion) {
        lines.push(`- Read: \`${rp.frontendVersion}.md\``);
      }
      if (rp.libraries) {
        const frontendLibs = rp.libraries.filter(l => l.startsWith(rp.frontend + '/libraries/'));
        if (frontendLibs.length > 0) {
          lines.push('- Read these library rules if using the library in your changes:');
          for (const lib of frontendLibs) {
            lines.push(`  - \`${lib}.md\``);
          }
        }
      }
      lines.push('');
    }

    if (rp.backendBase) {
      lines.push('### Backend work (APIs, services, controllers, server-side logic)');
      lines.push(`- Read: \`${rp.backendBase}/rules.md\``);
      if (rp.backendVersion) {
        lines.push(`- Read: \`${rp.backendVersion}.md\``);
      }
      if (rp.libraries) {
        const backendLibs = rp.libraries.filter(l => l.startsWith(rp.backendBase + '/libraries/'));
        if (backendLibs.length > 0) {
          lines.push('- Read these library rules if using the library in your changes:');
          for (const lib of backendLibs) {
            lines.push(`  - \`${lib}.md\``);
          }
        }
      }
      lines.push('');
    }

    if (rp.database) {
      lines.push('### Database work (queries, schema changes, migrations, SQL)');
      lines.push(`- Read: \`${rp.database}/rules.md\``);
      if (rp.databaseVersion) {
        lines.push(`- Read: \`${rp.databaseVersion}.md\``);
      }
      lines.push('');
    }

    if (rp.stack) {
      lines.push('### Full-stack / integration work');
      lines.push(`- Read: \`${rp.stack}/rules.md\``);
      lines.push('');
    }
  }

  lines.push('If your task spans multiple areas (e.g., frontend + backend), read ALL');
  lines.push('applicable rule files. When in doubt, read more rather than fewer.');
  lines.push(RULEBOOK_MARKER_END);

  return lines.join('\n');
}

// Fallback block when no config is available (local-only setup)
const FALLBACK_RULEBOOK_BLOCK = `${RULEBOOK_MARKER_START}
# Stack Rules (CRITICAL)

This project uses a centralized rulebook. If ai-stack.config.json exists in
this project root, read it along with .agent-rules-root to find the rule files.

At the START of every task, read ai-stack.config.json for the stack config and
rule paths. Read .agent-rules-root for the absolute path to the rulebook repo.
Combine them to locate the rule files. Determine what kind of work you are doing
(frontend, backend, database) and read the relevant rules BEFORE planning,
designing, or writing any code. This includes architectural decisions,
implementation plans, code reviews, and any recommendations. These rules are
CRITICAL and take priority over your defaults.
${RULEBOOK_MARKER_END}`;

/**
 * Write ai-stack.config.json to the project root.
 */
export function writeConfig(projectRoot, config) {
  const configPath = path.join(projectRoot, 'ai-stack.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  return configPath;
}

/**
 * Write .agent-rules-root with the absolute path to the rulebook clone.
 */
export function writeAgentRulesRoot(projectRoot, rulebookRoot) {
  const filePath = path.join(projectRoot, '.agent-rules-root');
  fs.writeFileSync(filePath, rulebookRoot + '\n', 'utf-8');
  return filePath;
}

/**
 * Add .agent-rules-root to .gitignore if not already present.
 */
export function updateGitignore(projectRoot) {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  const entry = '.agent-rules-root';

  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf-8');
  }

  const lines = content.split('\n').map(l => l.trim());
  if (lines.includes(entry)) return; // already present

  const separator = content.length > 0 && !content.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(gitignorePath, content + separator + entry + '\n', 'utf-8');
}

/**
 * Update an agent config file with the rulebook block.
 * If the file exists and has markers, replace only the marker content.
 * If the file exists without markers, prepend the block.
 * If the file doesn't exist, create it with just the block.
 */
export function updateAgentFile(projectRoot, relativePath, config) {
  const filePath = path.join(projectRoot, relativePath);
  const block = config ? buildRulebookBlock(config) : FALLBACK_RULEBOOK_BLOCK;

  // Ensure parent directory exists (for .github/copilot-instructions.md)
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, block + '\n', 'utf-8');
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  const startIdx = content.indexOf(RULEBOOK_MARKER_START);
  const endIdx = content.indexOf(RULEBOOK_MARKER_END);

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing block
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + RULEBOOK_MARKER_END.length);
    content = before + block + after;
  } else {
    // Prepend block
    content = block + '\n\n' + content;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Write all project files.
 */
export function writeAllFiles(projectRoot, rulebookRoot, config) {
  const files = [];

  files.push(writeConfig(projectRoot, config));
  files.push(writeAgentRulesRoot(projectRoot, rulebookRoot));
  updateGitignore(projectRoot);
  updateAgentFile(projectRoot, 'CLAUDE.md', config);
  updateAgentFile(projectRoot, '.cursorrules', config);
  updateAgentFile(projectRoot, '.github/copilot-instructions.md', config);

  return files;
}
