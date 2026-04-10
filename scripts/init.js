#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInitFlow } from './lib/prompts.js';
import { buildConfig } from './lib/config-builder.js';
import { writeAllFiles, writeAgentRulesRoot, updateGitignore, updateAgentFile } from './lib/writer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rulebookRoot = path.resolve(__dirname, '..');
const projectRoot = process.cwd();

// Check that we're not running inside the rulebook repo itself
if (path.resolve(projectRoot) === path.resolve(rulebookRoot)) {
  console.error('\n  Error: You are inside the AgentStackRules repository.');
  console.error('  Run this command from inside the project you want to configure.\n');
  console.error('  Example:');
  console.error('    cd /path/to/your-project');
  console.error('    agent-rules init\n');
  process.exit(1);
}

// Check for subcommand
const args = process.argv.slice(2);
const command = args[0];

if (command !== 'init') {
  console.log('\n  Usage: agent-rules init\n');
  console.log('  Run this from inside the project directory you want to configure.');
  console.log('  It will set up AI agent rules based on your technology stack.\n');
  process.exit(0);
}

// Check for existing config
let existingConfig = null;
const configPath = path.join(projectRoot, 'ai-stack.config.json');
if (fs.existsSync(configPath)) {
  try {
    existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch {
    console.log('  Warning: existing ai-stack.config.json could not be parsed. Starting fresh.\n');
  }
}

// Run the init flow
const selections = await runInitFlow(rulebookRoot, existingConfig);

if (!selections) {
  process.exit(0);
}

// Local-only mode: just write .agent-rules-root and agent config blocks
if (selections.localOnly) {
  writeAgentRulesRoot(projectRoot, rulebookRoot);
  updateGitignore(projectRoot);
  updateAgentFile(projectRoot, 'CLAUDE.md');
  updateAgentFile(projectRoot, '.cursorrules');
  updateAgentFile(projectRoot, '.github/copilot-instructions.md');

  console.log('\n  Local environment set up successfully!');
  console.log('  Written:');
  console.log('    .agent-rules-root (gitignored)');
  console.log('    Updated CLAUDE.md, .cursorrules, .github/copilot-instructions.md');
  console.log('');
  process.exit(0);
}

// Full mode: build config and write everything
const config = buildConfig(selections);
writeAllFiles(projectRoot, rulebookRoot, config);

console.log('\n  Configuration complete!');
console.log('  Written:');
console.log('    ai-stack.config.json');
console.log('    .agent-rules-root (gitignored)');
console.log('    .gitignore (updated)');
console.log('    CLAUDE.md');
console.log('    .cursorrules');
console.log('    .github/copilot-instructions.md');
console.log('');
console.log('  Next steps:');
console.log('    1. Commit the new and updated files to your repository');
console.log('    2. Other devs will need to run "agent-rules init" in this project');
console.log('       to set up their local environment pointing to their own rulebook installation');
console.log('');
