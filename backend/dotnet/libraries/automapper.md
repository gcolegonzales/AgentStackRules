# AutoMapper Rules

## Overview
AutoMapper is a convention-based object mapping library for .NET that eliminates manual mapping code between similar objects.

## Installation & Setup
- Install `AutoMapper` and register with `AddAutoMapper()` in the DI container.
- Define mapping profiles in classes that inherit from `Profile`.
- Keep profiles co-located with the feature they serve.

## Usage Patterns
- Use `CreateMap<TSource, TDestination>()` in profile constructors.
- Rely on convention-based mapping for properties with matching names and types.
- Use `ForMember` for explicit member configuration when conventions do not apply.
- Use `ProjectTo<T>()` with EF Core for efficient database queries that only select mapped columns.
- Inject `IMapper` through constructor injection.

## Anti-Patterns
- Do not use AutoMapper for complex transformations with business logic — write manual mapping methods instead.
- Do not create mappings inline — always use profiles.
- Do not map domain entities directly to other domain entities — mapping is for crossing layer boundaries (entity to DTO).

## Common Pitfalls
- Unmapped properties are silently ignored by default. Use `AssertConfigurationIsValid()` in tests to catch this.
- Bidirectional mapping (`ReverseMap`) can hide unintended mappings — use it carefully.
- Flattening conventions can produce surprising results — be explicit when property names diverge.
