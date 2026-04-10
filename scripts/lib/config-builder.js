/**
 * Build the ai-stack.config.json content from user selections.
 */
export function buildConfig(selections) {
  const config = {
    version: 1,
  };

  const rulePaths = {};

  if (selections.frontend) {
    config.frontend = selections.frontend.id;
    rulePaths.frontend = selections.frontend.path;

    if (selections.frontendVersion) {
      config.frontendVersion = selections.frontendVersion.id;
      rulePaths.frontendVersion = selections.frontendVersion.path;
    }
  }

  if (selections.backend) {
    config.backend = selections.backend.id;
    rulePaths.backendBase = selections.backend.path;

    if (selections.backendVersion) {
      config.backendVersion = selections.backendVersion.id;
      rulePaths.backendVersion = selections.backendVersion.path;
    }
  }

  if (selections.database) {
    config.database = selections.database.id;
    rulePaths.database = selections.database.path;

    if (selections.databaseVersion) {
      config.databaseVersion = selections.databaseVersion.id;
      rulePaths.databaseVersion = selections.databaseVersion.path;
    }
  }

  if (selections.stack) {
    config.stack = selections.stack.id;
    rulePaths.stack = selections.stack.path;
  }

  const libraries = [];
  if (selections.frontendLibraries) {
    libraries.push(...selections.frontendLibraries.map(lib => lib.path));
  }
  if (selections.backendLibraries) {
    libraries.push(...selections.backendLibraries.map(lib => lib.path));
  }
  if (libraries.length > 0) {
    rulePaths.libraries = libraries;
  }

  config.rulePaths = rulePaths;
  return config;
}
