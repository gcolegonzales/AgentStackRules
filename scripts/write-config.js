#!/usr/bin/env node

/**
 * write-config.js — Zero-dependency utility for writing consistent config files
 * into a target project. Called by AI agents, not by humans directly.
 *
 * Usage:
 *   echo '{ "targetPath": "...", "rulebookRoot": "...", "config": { ... } }' | node write-config.js
 *
 * Input (JSON via stdin):
 *   targetPath   — absolute path to the target project root
 *   rulebookRoot — absolute path to the AgentStackRules repo
 *   config       — the stack config object (project, stack, etc.)
 *
 * Output files written to targetPath:
 *   ai-stack.config.json
 *   .agent-rules-root
 *   .gitignore (updated)
 *   CLAUDE.md (marker block)
 *   .cursorrules (marker block)
 *   .github/copilot-instructions.md (marker block)
 */

import fs from 'node:fs';
import path from 'node:path';

const MARKER_START = '<!-- RULEBOOK:START -->';
const MARKER_END = '<!-- RULEBOOK:END -->';

const PATH_CONVENTIONS = {
  genericRules: '{category}/{framework}/rules.md',
  genericVersion: '{category}/{framework}/{version}.md',
  genericLibrary: '{category}/{framework}/libraries/{library}.md',
  projectOverview: 'projects/{project}/overview.md',
  projectRules: 'projects/{project}/{category}/{framework}/rules.md',
  projectLibrary: 'projects/{project}/{category}/{framework}/libraries/{library}.md',
};

// ── Resolve paths from config ──────────────────────────────────────────────

function resolvePaths(config) {
  const { project, stack } = config;
  const sections = [];

  const categories = ['frontend', 'backend', 'database'];

  // Project overview
  if (project) {
    const overviewPath = PATH_CONVENTIONS.projectOverview.replace('{project}', project);
    sections.push({ type: 'projectOverview', path: overviewPath });
  }

  for (const category of categories) {
    const entry = stack?.[category];
    if (!entry) continue;

    const fw = entry.framework;

    // Project-specific rules
    if (project) {
      const projRule = PATH_CONVENTIONS.projectRules
        .replace('{project}', project)
        .replace('{category}', category)
        .replace('{framework}', fw);
      sections.push({ type: 'projectRule', category, framework: fw, path: projRule });

      // Project-specific library rules
      if (entry.libraries) {
        for (const lib of entry.libraries) {
          const projLib = PATH_CONVENTIONS.projectLibrary
            .replace('{project}', project)
            .replace('{category}', category)
            .replace('{framework}', fw)
            .replace('{library}', lib);
          sections.push({ type: 'projectLibrary', category, framework: fw, library: lib, path: projLib });
        }
      }
    }

    // Generic rules
    const genRule = PATH_CONVENTIONS.genericRules
      .replace('{category}', category)
      .replace('{framework}', fw);
    sections.push({ type: 'genericRule', category, framework: fw, path: genRule });

    // Generic version
    if (entry.version) {
      const genVer = PATH_CONVENTIONS.genericVersion
        .replace('{category}', category)
        .replace('{framework}', fw)
        .replace('{version}', entry.version);
      sections.push({ type: 'genericVersion', category, framework: fw, path: genVer });
    }

    // Generic library rules
    if (entry.libraries) {
      for (const lib of entry.libraries) {
        const genLib = PATH_CONVENTIONS.genericLibrary
          .replace('{category}', category)
          .replace('{framework}', fw)
          .replace('{library}', lib);
        sections.push({ type: 'genericLibrary', category, framework: fw, library: lib, path: genLib });
      }
    }
  }

  return sections;
}

// ── Build the agent config block ───────────────────────────────────────────

function buildAgentBlock(config, resolvedPaths) {
  const lines = [];
  lines.push(MARKER_START);
  lines.push('# Stack Rules (CRITICAL)');
  lines.push('');
  lines.push('Read `.agent-rules-root` for the absolute path to the rulebook repository.');
  lines.push('All rule file paths below are relative to that root.');
  lines.push('');
  lines.push('At the START of every task, determine what kind of work you are doing and');
  lines.push('read the relevant rule files BEFORE planning, designing, or writing any code.');
  lines.push('This includes architectural decisions, implementation plans, code reviews,');
  lines.push('and any recommendations.');
  lines.push('');

  // Group project-specific rules
  const projectRules = resolvedPaths.filter(p => p.type.startsWith('project'));
  const genericRules = resolvedPaths.filter(p => p.type.startsWith('generic'));

  if (projectRules.length > 0) {
    lines.push('## Project-specific rules (PRIMARY — read these first)');
    lines.push('');

    const overview = projectRules.find(p => p.type === 'projectOverview');
    if (overview) {
      lines.push(`- Project overview: \`${overview.path}\``);
      lines.push('');
    }

    for (const cat of ['frontend', 'backend', 'database']) {
      const catRules = projectRules.filter(p => p.category === cat);
      if (catRules.length === 0) continue;

      const fw = catRules[0].framework;
      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
      lines.push(`### ${label} (${fw})`);

      const mainRule = catRules.find(p => p.type === 'projectRule');
      if (mainRule) lines.push(`- \`${mainRule.path}\``);

      const libs = catRules.filter(p => p.type === 'projectLibrary');
      for (const lib of libs) {
        lines.push(`- \`${lib.path}\``);
      }
      lines.push('');
    }
  }

  if (genericRules.length > 0) {
    lines.push('## Generic rules (secondary reference)');
    lines.push('');
    lines.push('Use these for broader best-practice context. Where project-specific rules');
    lines.push('are silent on a topic, these provide general guidance.');
    lines.push('');

    for (const cat of ['frontend', 'backend', 'database']) {
      const catRules = genericRules.filter(p => p.category === cat);
      if (catRules.length === 0) continue;

      const fw = catRules[0].framework;
      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
      lines.push(`### ${label} (${fw})`);

      const mainRule = catRules.find(p => p.type === 'genericRule');
      if (mainRule) lines.push(`- \`${mainRule.path}\``);

      const ver = catRules.find(p => p.type === 'genericVersion');
      if (ver) lines.push(`- \`${ver.path}\``);

      const libs = catRules.filter(p => p.type === 'genericLibrary');
      if (libs.length > 0) {
        lines.push('- Libraries:');
        for (const lib of libs) {
          lines.push(`  - \`${lib.path}\``);
        }
      }
      lines.push('');
    }
  }

  lines.push('When your task spans multiple areas, read ALL applicable rule files.');
  lines.push('Project-specific rules always take priority over generic rules.');
  lines.push(MARKER_END);

  return lines.join('\n');
}

// ── File writers ───────────────────────────────────────────────────────────

function writeConfigFile(targetPath, config) {
  const fullConfig = {
    version: 2,
    ...config,
    rulebookRoot: '.agent-rules-root',
    pathConventions: PATH_CONVENTIONS,
  };
  const filePath = path.join(targetPath, 'ai-stack.config.json');
  fs.writeFileSync(filePath, JSON.stringify(fullConfig, null, 2) + '\n', 'utf-8');
}

function writeAgentRulesRoot(targetPath, rulebookRoot) {
  const filePath = path.join(targetPath, '.agent-rules-root');
  fs.writeFileSync(filePath, rulebookRoot + '\n', 'utf-8');
}

function updateGitignore(targetPath) {
  const gitignorePath = path.join(targetPath, '.gitignore');
  const entry = '.agent-rules-root';

  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf-8');
  }

  const lines = content.split('\n').map(l => l.trim());
  if (lines.includes(entry)) return;

  const separator = content.length > 0 && !content.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(gitignorePath, content + separator + entry + '\n', 'utf-8');
}

function updateAgentFile(targetPath, relativePath, block) {
  const filePath = path.join(targetPath, relativePath);

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, block + '\n', 'utf-8');
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const startIdx = content.indexOf(MARKER_START);
  const endIdx = content.indexOf(MARKER_END);

  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + MARKER_END.length);
    content = before + block + after;
  } else {
    content = block + '\n\n' + content;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

// ── Main ───────────────────────────────────────────────────────────────────

let inputData = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', chunk => { inputData += chunk; });
process.stdin.on('end', () => {
  try {
    const { targetPath, rulebookRoot, config } = JSON.parse(inputData);

    if (!targetPath || !rulebookRoot || !config) {
      console.error('Error: input must include targetPath, rulebookRoot, and config');
      process.exit(1);
    }

    if (!fs.existsSync(targetPath)) {
      console.error(`Error: target path does not exist: ${targetPath}`);
      process.exit(1);
    }

    const resolvedPaths = resolvePaths(config);
    const agentBlock = buildAgentBlock(config, resolvedPaths);

    writeConfigFile(targetPath, config);
    writeAgentRulesRoot(targetPath, rulebookRoot);
    updateGitignore(targetPath);
    updateAgentFile(targetPath, 'CLAUDE.md', agentBlock);
    updateAgentFile(targetPath, '.cursorrules', agentBlock);
    updateAgentFile(targetPath, '.github/copilot-instructions.md', agentBlock);

    console.log('Successfully wrote config files to ' + targetPath);
    console.log('Files written:');
    console.log('  ai-stack.config.json');
    console.log('  .agent-rules-root');
    console.log('  .gitignore (updated)');
    console.log('  CLAUDE.md');
    console.log('  .cursorrules');
    console.log('  .github/copilot-instructions.md');
  } catch (err) {
    console.error('Error: ' + err.message);
    process.exit(1);
  }
});
