## Quick Orientation for AI coding agents

This file captures the minimal, concrete knowledge needed to be productive in the Fibertest30 backend.

### Big-picture architecture
- Main projects live under `src/`: `Fibertest30.Api`, `Fibertest30.Application`, `Fibertest30.Infrastructure`, `Fibertest30.Domain`, `Fibertest30.HtmlTemplates`.
- API is a gRPC server (gRPC-Web enabled). Look at `src/Fibertest30.Api/Program.cs` and `MapGrpcServices(...)` for registered gRPC services (e.g. `CoreService`, `GraphService`, `RtuMgmtService`).
- Typical flow: gRPC -> `Fibertest30.Api` services -> MediatR requests handled in `Fibertest30.Application` -> persistence in `Fibertest30.Infrastructure` (EF Core + MySQL) and event store.
- Dependency injection and service registration are centralized in extension methods:
  - `AddPresentationServices` in `Fibertest30.Api/ConfigureServices.cs`
  - `AddApplicationServices` in `Fibertest30.Application/ConfigureServices.cs`
  - `AddInfrastructureServices` in `Fibertest30.Infrastructure/ConfigureServices.cs`

### Key patterns & conventions to follow
- Authentication: custom middleware `CustomAuthenticationMiddleware` (see `Fibertest30.Api`) and two JWT schemes:
  - Local JWT: configured from `JwtSettings` in `appsettings.json`
  - External JWT: has a hard-coded example Keycloak URL in `ConfigureServices.cs`
  - Tests use environment `Test` which disables token lifetime validation.
- Migrations: EF Core migrations live conceptually under `Persistence/Migrations` in `Fibertest30.Infrastructure` and are managed from the repo root `Backend/src` using `--project` and `--startup-project` flags (see infra `Readme.md`).
- Lifetimes: many long-lived services are registered as `Singleton` (Model, dispatchers, processors). Be careful when changing lifetimes — logic assumes singletons in many places.
- Logging: Serilog is configured in `Program.cs` and may forward to Elasticsearch if `Elasticsearch:Url` and `Elasticsearch:IndexPrefix` are set in configuration.

### Important files & locations (start here)
- API startup & wiring: `src/Fibertest30.Api/Program.cs`
- Service registration: `src/*/ConfigureServices.cs` for each layer
- App configuration: `src/Fibertest30.Api/appsettings.json` (MySQL host/port, JwtSettings, Kestrel endpoints)
- EF migration helper: `src/Fibertest30.Infrastructure/Readme.md` (copy/paste commands for migrations)
- Protobuf definitions: `src/Fibertest30.Api/Protos/`
- Unit tests: `tests/Fibertest30.Application.UnitTests/`
- Third-party native .NET assemblies: `libs/fiberizer/` (prebuilt DLLs used by the project)

### Concrete commands & workflows
- Build and run API (from `Backend/src`):
  - dotnet restore
  - dotnet build
  - dotnet run --project Fibertest30.Api
- Run tests (from repo root or `Backend/src`):
  - dotnet test tests/Fibertest30.Application.UnitTests
- EF Core (migrations / DB update) — run from `Backend/src`:
  - Add migration:
    dotnet ef migrations add SomeMigrationNameLetsNotAddSpaces --project Fibertest30.Infrastructure --startup-project Fibertest30.Api --output-dir "Persistence/Migrations"
  - List migrations:
    dotnet ef migrations list --project Fibertest30.Infrastructure --startup-project Fibertest30.Api
  - Apply migration to MySQL (normal):
    dotnet ef database update --project Fibertest30.Infrastructure --startup-project Fibertest30.Api
  - Apply to a sqlite file (example from infra README):
    dotnet ef database update --project Fibertest30.Infrastructure --startup-project Fibertest30.Api --connection "Data Source=data\rtu.db"

### Project-specific gotchas & hints
- `Program.cs` changes current directory to the app output dir except in `Test` environment — tests expect in-memory or isolated filesystem behavior. Prefer using the `Test` environment for unit/integration tests.
- gRPC-Web: `app.UseGrpcWeb()` must be placed between `UseRouting()` and endpoints. The code already follows that; be careful when refactoring middleware order.
- Warmup & Background services: in production the app triggers `WarmupService` on `ApplicationStarted`. Background services are registered in `Program.cs` (e.g., `RtuDataProcessorBackgroundService`). Changes to their lifetimes or ordering can affect startup.
- Event store initialization: `IEventStoreService.InitializeBothDbAndService()` is called on startup; altering initialization order may break the write model seeding.
- Migrations folder entries are excluded in the infra csproj (see `Fibertest30.Infrastructure.csproj` lines that remove `Persistence\Migrations\**`) — follow existing patterns when editing migration files.

### Where to look for examples in code
- MediatR pipeline behaviors (authorization, validation, logging): `Fibertest30.Application/ConfigureServices.cs` and classes `AuthorizationBehaviour`, `ValidationBehaviour`, `LogRequestBehaviour`.
- JWT token creation: `Fibertest30.Infrastructure/Identity/JwtTokenGenerator.cs` and `JwtSettings.cs`.
- Data contexts & initializers: `Fibertest30.Infrastructure` contains `ServerDbContext`, `FtDbContext`, and initializers `ServerDbContextInitializer` and `FtDbContextInitializer` used during startup.

If anything above is unclear or you need more detail (e.g., list of concrete gRPC methods, proto-to-service mapping, or test-specific startup flags), tell me which area to expand and I will iterate.
