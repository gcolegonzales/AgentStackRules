import fs from 'node:fs';
import path from 'node:path';

/**
 * Get available technologies for a category (frontend, backend, database).
 * Each subfolder with a rules.md is a technology.
 */
export function getTechnologies(rulebookRoot, category) {
  const categoryDir = path.join(rulebookRoot, category);
  if (!fs.existsSync(categoryDir)) return [];

  return fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .filter(entry => fs.existsSync(path.join(categoryDir, entry.name, 'rules.md')))
    .map(entry => ({
      id: entry.name,
      path: path.join(category, entry.name),
    }));
}

/**
 * Get available version overlay files for a technology.
 * Version files are .md files in the technology folder that are NOT rules.md.
 */
export function getVersions(rulebookRoot, category, techId) {
  const techDir = path.join(rulebookRoot, category, techId);
  if (!fs.existsSync(techDir)) return [];

  return fs.readdirSync(techDir, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .filter(entry => entry.name.endsWith('.md') && entry.name !== 'rules.md')
    .map(entry => {
      const id = entry.name.replace('.md', '');
      return {
        id,
        path: path.join(category, techId, id),
      };
    });
}

/**
 * Get available libraries for a technology.
 * Each .md file in the libraries/ subfolder is a library.
 */
export function getLibraries(rulebookRoot, category, techId) {
  const libDir = path.join(rulebookRoot, category, techId, 'libraries');
  if (!fs.existsSync(libDir)) return [];

  return fs.readdirSync(libDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => {
      const id = entry.name.replace('.md', '');
      return {
        id,
        path: path.join(category, techId, 'libraries', id),
      };
    });
}

/**
 * Check if a stack folder exists for a given frontend+backend combo.
 * Returns the stack info or null.
 */
export function findStack(rulebookRoot, frontendId, backendId) {
  if (!frontendId || !backendId) return null;

  const stackId = `${frontendId}-${backendId}`;
  const stackDir = path.join(rulebookRoot, 'stacks', stackId);

  if (fs.existsSync(stackDir) && fs.existsSync(path.join(stackDir, 'rules.md'))) {
    return {
      id: stackId,
      path: path.join('stacks', stackId),
    };
  }
  return null;
}

/**
 * Check if a technology has a libraries/ subdirectory.
 */
export function hasLibrariesDir(rulebookRoot, category, techId) {
  const libDir = path.join(rulebookRoot, category, techId, 'libraries');
  return fs.existsSync(libDir);
}
