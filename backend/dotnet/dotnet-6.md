# .NET 6 Version-Specific Rules

## Overview
.NET 6 is an LTS release. It introduced minimal APIs and the simplified hosting model.

## Key Differences
- Uses the minimal hosting model (`WebApplication.CreateBuilder`) by default but many existing projects still use `Startup.cs`.
- If the project uses `Startup.cs`, follow that pattern consistently — do not mix both styles.
- Minimal APIs are available but may not be used in existing projects. Follow the existing pattern.

## End of Support
- .NET 6 reached end of support in November 2024. Plan migration to .NET 8 or later.
- Avoid adding new features that rely on .NET 6-specific behavior.
- When making changes, prefer patterns that are forward-compatible with .NET 8.

## Common Pitfalls
- `DateOnly` and `TimeOnly` types are available in .NET 6 but may have limited serialization support in some libraries.
- Hot reload has limitations in .NET 6 compared to later versions.
