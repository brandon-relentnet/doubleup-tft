# DoubleUp TFT

Free-Range Teamfight Tactics notes for Double Up duos. This site packages long-form breakdowns, mindset checklists, and upcoming reference tools so players can grow their own wins instead of copying the weekly meta.

## Features
- Farm-flavored homepage with motion highlights for the BLT framework (Board strength, Health, Economy, Mental)
- Discussion hub with tag filtering, long-form summaries, and evergreen React-powered content primitives
- Supabase-backed account area with sign in/up, password recovery, confirmation resend, and session-aware UI
- Footer roundup that auto-surfaces the three freshest field reports
- Roadmapped directories for items, strategies, and units once the content pipeline is in place

## Tech Stack
- React 19 with Vite 7 and the TanStack Router file-based plugin
- Tailwind CSS 4 using a custom Rosé Pine–inspired palette in `src/styles.css`
- Motion and motion-plus for scroll-triggered flourishes and the hero typewriter
- Supabase JavaScript client (optional) managed through a global auth provider
- TypeScript, Vitest, Testing Library, ESLint, and Prettier for safety and consistency

## Getting Started
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev` (http://localhost:3000)
3. Compile the production bundle and run type checks: `npm run build`

### Useful Commands
- `npm run test` – execute the Vitest suite once in headless mode
- `npm run lint` – apply the TanStack ESLint configuration
- `npm run format -- --check src` – verify Prettier formatting
- `npm run check` – write Prettier fixes and apply ESLint autofixes (run before committing)

## Environment Variables
Authentication is disabled by default. Provide Supabase credentials to turn on the account experience:

```
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Missing values trigger friendly copy and short-circuit all auth calls so local development keeps running cleanly.

## Project Layout
```
src/
  components/        // Shared UI (Header, Footer, AuthProvider, motion widgets)
  content/           // Typed blog posts rendered as React nodes
  lib/               // Supabase client bootstrap
  routes/            // TanStack Router file-based routes
  styles.css         // Tailwind layers and design tokens
public/              // Mascot illustrations and static assets
```

## Authoring Content
- Create or edit posts in `src/content/posts.tsx`
- Each entry exposes a `Content` function that returns typography components (`Heading`, `Paragraph`, etc.) for consistent styling
- Tags are optional but power the `/discussions` filter pills and keep the active search query in sync
- The footer highlights the three most recent posts automatically—no manual curation required

## Development Notes
- The router tree is generated into `src/routeTree.gen.ts`; do not edit it manually
- `AuthProvider` keeps Supabase sessions fresh and injects auth state via `useAuth`
- Motion-based components rely on the `motion` package’s React bindings; keep animations light to maintain page performance
- Tailwind tokens live in `src/styles.css`; extend colors or spacing there instead of reaching for ad-hoc CSS

## Roadmap
- Populate the Items, Strategies, and Units routes once the CMS pipeline is wired up
- Introduce duo progress tracking and newsletter integrations
- Add automated tests around auth flows and ScrollHighlight interactions

Questions or ideas? Open an issue or drop a note in the discussions—just keep it farm fresh.
