# RxJS Rules

## Overview
RxJS is a reactive programming library for composing asynchronous and event-based operations using observables.

## Installation & Setup
- RxJS is included with Angular by default.
- Import operators individually from `rxjs` and `rxjs/operators`.

## Usage Patterns
- Use the `async` pipe in templates to subscribe and unsubscribe automatically.
- Use `pipe()` to compose operators — keep chains readable and not too long.
- Use `switchMap` for search/typeahead (cancels previous), `mergeMap` for parallel operations, `concatMap` for sequential.
- Use `catchError` within the pipe to handle errors without killing the observable stream.
- Use `BehaviorSubject` for state that needs an initial value and `Subject` for events.
- Use `takeUntilDestroyed()` or `takeUntil` with a destroy subject for manual subscriptions.

## Anti-Patterns
- Do not nest subscribes — use higher-order mapping operators (`switchMap`, `mergeMap`, `concatMap`).
- Do not subscribe in a service and store the result — return the observable and let the consumer subscribe.
- Do not use `any` as the observable type — always type your observables.

## Common Pitfalls
- Always unsubscribe from long-lived observables to prevent memory leaks.
- Be aware of cold vs hot observables — HTTP calls are cold (replay on each subscribe).
- Use `shareReplay` when multiple subscribers need the same data without re-triggering the source.
- Do not use `toPromise()` — use `firstValueFrom()` or `lastValueFrom()` instead.
