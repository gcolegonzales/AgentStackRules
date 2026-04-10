import { select, checkbox, input, confirm } from '@inquirer/prompts';
import { toDisplayName } from './display-names.js';
import { getTechnologies, getVersions, getLibraries, hasLibrariesDir, findStack } from './discovery.js';
import { openInEditor } from './editor.js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Create a new technology in the rulebook (directory + rules.md + libraries/).
 */
async function createNewTechnology(rulebookRoot, category, label) {
  const techName = await input({ message: `Enter the ${label} name (e.g., vue, fastapi, mongodb):` });
  if (!techName.trim()) return null;

  const id = techName.trim().toLowerCase().replace(/\s+/g, '-');
  const techDir = path.join(rulebookRoot, category, id);

  if (fs.existsSync(techDir)) {
    console.log(`  "${id}" already exists in ${category}/. Select it from the list instead.`);
    return null;
  }

  // Create directory structure
  fs.mkdirSync(techDir, { recursive: true });
  if (category !== 'database') {
    fs.mkdirSync(path.join(techDir, 'libraries'), { recursive: true });
  }

  // Copy template into rules.md
  const templatePath = path.join(rulebookRoot, 'templates', `${category}.md`);
  const displayName = toDisplayName(id);
  let content = `# ${displayName} Rules\n`;
  if (fs.existsSync(templatePath)) {
    content = fs.readFileSync(templatePath, 'utf-8').replace(/\{name\}/g, displayName);
  }

  const rulesPath = path.join(techDir, 'rules.md');
  fs.writeFileSync(rulesPath, content, 'utf-8');
  console.log(`  Created: ${category}/${id}/rules.md`);
  if (category !== 'database') {
    console.log(`  Created: ${category}/${id}/libraries/`);
  }
  openInEditor(rulesPath);

  return {
    id,
    path: path.join(category, id),
  };
}

/**
 * Create a new version file from template and open in editor.
 */
async function createNewVersion(rulebookRoot, category, techId) {
  const versionName = await input({ message: 'Enter the version identifier (e.g., react-19, dotnet-12):' });
  if (!versionName.trim()) return null;

  const id = versionName.trim().toLowerCase().replace(/\s+/g, '-');
  const filePath = path.join(rulebookRoot, category, techId, `${id}.md`);

  // Read the category template and populate
  const templatePath = path.join(rulebookRoot, 'templates', `${category}.md`);
  let content = `# ${toDisplayName(id)} Version-Specific Rules\n\nVersion-specific rules and overrides go here.\n`;
  if (fs.existsSync(templatePath)) {
    content = fs.readFileSync(templatePath, 'utf-8').replace(/\{name\}/g, toDisplayName(id));
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  Created: ${filePath}`);
  openInEditor(filePath);

  return { id, path: path.join(category, techId, id) };
}

/**
 * Create a new library file from template and open in editor.
 */
async function createNewLibrary(rulebookRoot, category, techId) {
  const libName = await input({ message: 'Enter the library name (e.g., axios, tailwind):' });
  if (!libName.trim()) return null;

  const id = libName.trim().toLowerCase().replace(/\s+/g, '-');
  const filePath = path.join(rulebookRoot, category, techId, 'libraries', `${id}.md`);

  const templatePath = path.join(rulebookRoot, 'templates', 'library.md');
  let content = `# ${toDisplayName(id)} Rules\n`;
  if (fs.existsSync(templatePath)) {
    content = fs.readFileSync(templatePath, 'utf-8').replace(/\{name\}/g, toDisplayName(id));
  }

  // Ensure libraries dir exists
  const libDir = path.dirname(filePath);
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  Created: ${filePath}`);
  openInEditor(filePath);

  return { id, path: path.join(category, techId, 'libraries', id) };
}

/**
 * Prompt for technology selection within a category.
 */
async function promptTechnology(rulebookRoot, category, label) {
  const techs = getTechnologies(rulebookRoot, category);

  const choices = [
    ...techs.map(t => ({ name: toDisplayName(t.id), value: t })),
    { name: 'Create New', value: '__new__' },
    { name: 'None', value: null },
  ];

  const answer = await select({ message: `Select your ${label}:`, choices });

  if (answer === '__new__') {
    return await createNewTechnology(rulebookRoot, category, label);
  }
  return answer;
}

/**
 * Prompt for version selection.
 */
async function promptVersion(rulebookRoot, category, tech) {
  const versions = getVersions(rulebookRoot, category, tech.id);

  if (versions.length === 0) {
    const wantsVersion = await confirm({
      message: `No unique version rules detected for ${toDisplayName(tech.id)}. Do you want to specify a version?`,
      default: false,
    });
    if (wantsVersion) {
      return await createNewVersion(rulebookRoot, category, tech.id);
    }
    return null;
  }

  const choices = [
    ...versions.map(v => ({ name: toDisplayName(v.id), value: v })),
    { name: 'Add New Version', value: '__new__' },
    { name: 'Skip', value: null },
  ];

  const answer = await select({ message: `Which version of ${toDisplayName(tech.id)}?`, choices });

  if (answer === '__new__') {
    return await createNewVersion(rulebookRoot, category, tech.id);
  }
  return answer;
}

/**
 * Prompt for library selection (multi-select with inline "Add New Library").
 * If the user selects "Add New Library", create it and re-prompt the full list.
 */
async function promptLibraries(rulebookRoot, category, tech) {
  if (!hasLibrariesDir(rulebookRoot, category, tech.id)) return [];

  while (true) {
    const libs = getLibraries(rulebookRoot, category, tech.id);
    const choices = [
      ...libs.map(l => ({ name: toDisplayName(l.id), value: l })),
      { name: 'Add New Library', value: '__new__' },
    ];

    const selected = await checkbox({
      message: `Which libraries do you use with ${toDisplayName(tech.id)}?`,
      choices,
    });

    const addNew = selected.some(s => s === '__new__');
    const selectedLibs = selected.filter(s => s !== '__new__');

    if (addNew) {
      await createNewLibrary(rulebookRoot, category, tech.id);
      // Re-prompt with the updated list
      continue;
    }

    return selectedLibs;
  }
}

/**
 * Prompt for a full category (technology + version + libraries).
 */
async function promptCategory(rulebookRoot, category, label, includeLibraries = true) {
  const tech = await promptTechnology(rulebookRoot, category, label);
  if (!tech) return { tech: null, version: null, libraries: [] };

  const version = await promptVersion(rulebookRoot, category, tech);
  const libraries = includeLibraries
    ? await promptLibraries(rulebookRoot, category, tech)
    : [];

  return { tech, version, libraries };
}

/**
 * Run the full init flow. Returns the user's selections.
 */
export async function runInitFlow(rulebookRoot, existingConfig) {
  console.log('');
  console.log('  ============================================');
  console.log('  Agent Rules - Project Configuration');
  console.log('  ============================================');
  console.log('');
  console.log('  This will add a reference to your local AgentStackRules');
  console.log('  rulebook in this project directory.');
  console.log('');
  console.log('  This needs to be run in each individual repository');
  console.log('  that you want configured with rulebook references.');
  console.log('');

  // Step 1: Check for existing config
  if (existingConfig) {
    console.log('  This project already has a stack config:');
    if (existingConfig.frontend) console.log(`    Frontend: ${toDisplayName(existingConfig.frontend)}`);
    if (existingConfig.backend) console.log(`    Backend: ${toDisplayName(existingConfig.backend)}`);
    if (existingConfig.database) console.log(`    Database: ${toDisplayName(existingConfig.database)}`);
    console.log('');

    const action = await select({
      message: 'What would you like to do?',
      choices: [
        { name: 'Update stack configuration', value: 'update' },
        { name: 'Just set up my local environment', value: 'local' },
      ],
    });

    if (action === 'local') {
      return { localOnly: true };
    }
  }

  // Step 2-4: Frontend
  const frontend = await promptCategory(rulebookRoot, 'frontend', 'frontend framework');

  // Step 5-7: Backend
  const backend = await promptCategory(rulebookRoot, 'backend', 'backend framework');

  // Step 8-9: Database (no libraries)
  const database = await promptCategory(rulebookRoot, 'database', 'database', false);

  // Step 10: Stack detection
  const frontendId = frontend.tech?.id || null;
  const backendId = backend.tech?.id || null;
  const stack = findStack(rulebookRoot, frontendId, backendId);

  if (stack) {
    console.log(`\n  Stack rules found: ${toDisplayName(stack.id)}`);
  }

  // Step 11: Confirm
  console.log('\n  Your stack configuration:');
  if (frontend.tech) {
    const vLabel = frontend.version ? ` (${toDisplayName(frontend.version.id)})` : '';
    console.log(`    Frontend: ${toDisplayName(frontend.tech.id)}${vLabel}`);
    if (frontend.libraries.length > 0) {
      console.log(`      Libraries: ${frontend.libraries.map(l => toDisplayName(l.id)).join(', ')}`);
    }
  }
  if (backend.tech) {
    const vLabel = backend.version ? ` (${toDisplayName(backend.version.id)})` : '';
    console.log(`    Backend: ${toDisplayName(backend.tech.id)}${vLabel}`);
    if (backend.libraries.length > 0) {
      console.log(`      Libraries: ${backend.libraries.map(l => toDisplayName(l.id)).join(', ')}`);
    }
  }
  if (database.tech) {
    const vLabel = database.version ? ` (${toDisplayName(database.version.id)})` : '';
    console.log(`    Database: ${toDisplayName(database.tech.id)}${vLabel}`);
  }
  if (stack) {
    console.log(`    Stack rules: ${stack.id}`);
  }
  console.log('');

  const confirmed = await confirm({ message: 'Confirm and write configuration?', default: true });
  if (!confirmed) {
    console.log('  Cancelled. Run agent-rules init again to start over.');
    return null;
  }

  return {
    frontend: frontend.tech,
    frontendVersion: frontend.version,
    frontendLibraries: frontend.libraries,
    backend: backend.tech,
    backendVersion: backend.version,
    backendLibraries: backend.libraries,
    database: database.tech,
    databaseVersion: database.version,
    stack,
  };
}
