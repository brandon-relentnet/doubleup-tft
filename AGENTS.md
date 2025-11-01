# Repository Guidelines

## Project Structure & Module Organization
The Vite + React app lives in `src/`. `main.tsx` boots the TanStack Router tree defined in `src/routes/`, so keep feature routes in that directory and co-locate loaders and components where possible. Shared UI belongs in `src/components/` (PascalCase per file). Typed content helpers live in `src/content/`. `styles.css` configures Tailwind v4 layers; extend tokens there instead of editing generated CSS. `src/routeTree.gen.ts` is generated—do not hand edit it. Static assets reside in `public/`, and build artifacts land in `dist/`; treat both as source-of-truth and disposable respectively.

## Build, Test, and Development Commands
- `npm run dev`: start the Vite dev server on port 3000 with hot reloading.
- `npm run build`: compile production assets and run TypeScript type-checking.
- `npm run serve`: preview the production build locally.
- `npm run test`: execute the Vitest suite once in headless mode.
- `npm run lint`: run the @tanstack/eslint-config rule set.
- `npm run format`: invoke Prettier (pass paths or flags, e.g. `npm run format -- --check src`).
- `npm run check`: apply Prettier writes and ESLint fixes—run before pushing.

## Coding Style & Naming Conventions
TypeScript + JSX throughout. Follow Prettier defaults (2-space indent, single quotes, trailing commas, no semicolons). Components, hooks, and context providers use PascalCase filenames, while route files follow TanStack Router patterns (`discussions.$slug.tsx` for dynamic segments). Keep props typed explicitly when re-exported, prefer functional components with hooks, Tailwind utility classes, and motion primitives over ad-hoc styles, and delete unused imports promptly to satisfy ESLint.

## Testing Guidelines
Vitest with the jsdom environment and Testing Library are available. Co-locate specs next to the source (`Header.test.tsx`) and mirror component names. Test user-visible behavior and router loader output rather than implementation detail. Target coverage for new routes, shared UI, and content utilities. Run `npm run test -- --watch` while iterating and ensure `npm run test` passes cleanly before committing.

## Commit & Pull Request Guidelines
Commit messages use concise sentence-case summaries (see `git log`). Keep related changes grouped and run `npm run check` first. Pull requests should describe intent, list notable UI or data updates, and attach before/after screenshots for visual tweaks. Link relevant issues or discussions, call out follow-up actions, and wait for automated checks to succeed before requesting review.
