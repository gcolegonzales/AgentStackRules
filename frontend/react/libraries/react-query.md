# React Query / TanStack Query Rules

## Overview
React Query (TanStack Query) manages server state — fetching, caching, synchronizing, and updating data from APIs.

## Installation & Setup
- Use `@tanstack/react-query`.
- Set up `QueryClientProvider` at the app root.
- Configure sensible defaults for stale time, cache time, and retry behavior.

## Usage Patterns
- Use `useQuery` for GET requests and `useMutation` for POST/PUT/DELETE operations.
- Use meaningful, structured query keys: `['todos', { status: 'active' }]`.
- Invalidate queries after mutations using `queryClient.invalidateQueries`.
- Use `select` option to transform or filter data from the cache.
- Co-locate query hooks with the features that use them. Create custom hooks that wrap `useQuery`.

## Anti-Patterns
- Do not store server data in Redux or local state when React Query is managing it.
- Do not refetch on every render — configure appropriate stale times.
- Do not call `queryClient.fetchQuery` in components — use `useQuery` hooks.
- Avoid overly broad query invalidation that refetches unrelated data.

## Common Pitfalls
- Set `staleTime` appropriately — the default of 0 means data is always considered stale.
- Handle loading, error, and success states explicitly in every query consumer.
- Use `enabled` option to conditionally run queries, not conditional hook calls.
- Remember that React Query caches by query key — inconsistent keys cause duplicate fetches.
