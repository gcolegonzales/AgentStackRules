import { execSync } from 'node:child_process';

/**
 * Detect available editor on PATH.
 * Returns the command name or null.
 */
function detectEditor() {
  const candidates = ['code', 'cursor'];

  for (const cmd of candidates) {
    try {
      execSync(`${cmd} --version`, { stdio: 'ignore' });
      return cmd;
    } catch {
      // not found, try next
    }
  }

  if (process.env.EDITOR) {
    return process.env.EDITOR;
  }

  return null;
}

/**
 * Open a file in the user's editor.
 * Returns true if opened, false if no editor found.
 */
export function openInEditor(filePath) {
  const editor = detectEditor();

  if (!editor) {
    console.log(`\n  Could not detect an editor. Please open this file manually:`);
    console.log(`  ${filePath}\n`);
    return false;
  }

  try {
    execSync(`${editor} "${filePath}"`, { stdio: 'ignore' });
    return true;
  } catch {
    console.log(`\n  Failed to open editor. Please open this file manually:`);
    console.log(`  ${filePath}\n`);
    return false;
  }
}
