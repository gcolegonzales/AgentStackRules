const DISPLAY_OVERRIDES = {
  'dotnet': '.NET',
  'dotnet-6': '.NET 6',
  'dotnet-8': '.NET 8',
  'dotnet-10': '.NET 10',
  'angularjs': 'AngularJS',
  'sql-server': 'Azure SQL Server',
  'node-typescript': 'Node.js (TypeScript)',
  'mui': 'MUI',
  'rxjs': 'RxJS',
  'ngrx': 'NgRx',
  'react-query': 'React Query / TanStack Query',
  'react-router': 'React Router',
  'angular-material': 'Angular Material',
  'entity-framework': 'Entity Framework',
  'fluent-validation': 'FluentValidation',
  'mediatr': 'MediatR',
  'automapper': 'AutoMapper',
  'razor-pages': 'Razor Pages',
};

export function toDisplayName(id) {
  if (DISPLAY_OVERRIDES[id]) return DISPLAY_OVERRIDES[id];
  return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function addDisplayOverride(id, displayName) {
  DISPLAY_OVERRIDES[id] = displayName;
}
