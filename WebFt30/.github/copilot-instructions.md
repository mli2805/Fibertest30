## Quick orientation for automated coding agents

This is an Angular (v19) single-page application that talks to a Backend via gRPC (protobuf-ts generated code). Use these notes to be immediately productive and to follow established patterns.

High-level facts

- Project root: `src/` is the Angular app. Main module: `src/app/app.module.ts`.
- gRPC generated types live in `src/grpc-generated/` and are consumed across the app (imports like `import * as grpc from 'src/grpc-generated'`).
- The app uses NgRx (store, effects) and some @ngrx/component-store for localized state.
- UI is component-driven under `src/app/features/*`. Shared components are in `src/app/shared`, core services and state are in `src/app/core`.

Build / dev / test commands (canonical)

- Install deps: `npm install` (local .tgz libs are referenced in `package.json` under `libs/fiberizer`).
- Dev server: `npm start` (runs `ng serve`, default configuration = `development` in `angular.json`).
- Build production: `npm run build` (Angular CLI build). Use `--configuration server` or `--configuration development` for other envs.
- Watch build: `npm run watch`.
- Unit tests: `npm test` (Karma). TeamCity runner: use `--configuration teamcity` which maps to `karma.conf.teamcity.js`.
- Lint: `npm run lint` (uses `@angular-eslint`).
- Analyze bundles: `npm run analyze` (produces `stats.json` + `webpack-bundle-analyzer`).

gRPC generation and conventions

- Generated files: `src/grpc-generated/*`. Do NOT manually edit these files. If backend proto changes are required, regenerate.
- Generation script: `scripts/generate-grpc.ts`. Typical invocation shown in repo: `npx ts-node ./scripts/generate-grpc.ts` (requires `protoc` + `protobuf-ts` toolchain installed on the environment).
- The generation script also applies a small post-processing step to add `override` for some methods (see `fix4114Issue`) — preserve that logic when adjusting generation.
- Examples of proto usage: converters in `src/app/core/map.utils.ts` (lots of mapping from grpc types to app models) and imports like `src/grpc-generated/google/protobuf/timestamp`.

Error handling / networking patterns

- Server errors are converted using `src/app/core/grpc/grpc.utils.ts` (helpers like `toServerError`, `isNoConnection`, `isInternalServerError`). Follow this pattern when calling services.
- Effects and services commonly wrap grpc calls with `GrpcUtils` mapping (see `src/app/core/auth/auth.effects.ts` for a canonical example).

Service boundaries and common layers

- `src/app/core/grpc/services/*` contains typed wrappers around backend RPCs (barrel exported from `src/app/core/grpc/index.ts`). Prefer using those services rather than calling generated clients directly.
- Mapping layer: `src/app/core/map.utils.ts` (and additional mapping helpers) translate between gRPC DTOs and UI/domain models. Use these mapping helpers consistently.
- Feature components under `src/app/features/*` should depend on `core` and `shared` only; keep feature-specific logic inside the feature folder.

Front-end conventions worth following

- SCSS is the default for component styles (Angular schematics configured in `angular.json`).
- Component selectors use the `rtu` prefix (see `angular.json` `prefix`).
- i18n strings live under `src/assets/i18n/*.json` (update keys when adding messages). Example: `src/assets/i18n/en.json`.
- Leaflet (map) assets are copied in `angular.json` via `assets` configuration. When updating leaflet, ensure images/styles are preserved in the build config.

Dependencies and notable configs

- Local vendor libs: `libs/fiberizer/*.tgz` (installed via `package.json` file: references). Tests/dev machines must have these present or `npm install` will fail.
- `angular.json` contains `allowedCommonJsDependencies` for `moment`, `leaflet`, etc. If you add CommonJS packages, add them here to avoid build warnings.
- Environments: `src/environments/environment.ts`, `environment.development.ts`, and `environment.server.ts`. `angular.json` contains file replacements for dev/server builds.

Short examples / patterns (copy/paste friendly)

- Typical gRPC error handling in an Effect:

  See `src/app/core/auth/auth.effects.ts` where errors are caught and mapped like:

  catchError(error => of(AuthActions.loginFailure({ error: GrpcUtils.toServerError(error) })))

- Mapping from grpc timestamp to Date: use the generated proto helper, e.g. `Timestamp.toDate(grpc.timestampField!)` (seen in `src/app/core/map.utils.ts`).

What automated agents should avoid changing

- Do not edit `src/grpc-generated/*` manually — change protos + run the generator.
- Avoid changing `angular.json` or `tsconfig.*` unless a follow-up task explicitly requires it (these have project-wide effects).

Useful files to open when investigating a task

- App root and wiring: `src/app/app.module.ts`, `src/main.ts`, `src/index.html`.
- Core GRPC helpers: `src/app/core/grpc/grpc.utils.ts`, `src/app/core/grpc/index.ts`, `src/app/core/grpc/services/*`.
- Mapping and DTO translation: `src/app/core/map.utils.ts`.
- Feature examples: `src/app/features/gis/*` and `src/app/features/rtus/*`.
- GRPC generation: `scripts/generate-grpc.ts` and `src/grpc-generated/`.

If something is missing

- Ask for: (1) backend proto path access / protoc tool availability, or (2) CI specifics if you need to run TeamCity jobs locally. Otherwise follow the patterns above.

If you want a narrower guide (tests, adding a new feature, or updating protos), tell me which and I'll expand with step-by-step commands.
