# DESIGN

## Product Pillars
- **Free-Range TFT mindset** – Coaching players to flex around the lobby rather than memorising factory builds. The BLT metaphor (Board strength, Health, Economy, Mental) threads through copy, art, and layout.
- **Author-first publishing** – Discussions are written as React components so writers can iterate on styling, add interactions later, and keep long-form notes maintainable.
- **Future-facing platform** – Account management, newsletter hooks, and placeholder directories prepare the ground for richer duo tooling once data sources are ready.

## High-Level Architecture
- **Entry point** – `src/main.tsx` mounts the TanStack Router instance generated in `src/routeTree.gen.ts`. Structural sharing, intent-based preloading, and scroll restoration ship out-of-the-box.
- **App shell** – `src/routes/__root.tsx` wraps every route with `AuthProvider`, `Header`, `Footer`, and the TanStack Devtools panel. Auth context is therefore available anywhere in the tree.
- **Routing** – Each page is a file route under `src/routes/`. Nested directories mirror URL structure (`/discussions`, `/account`). Search params are validated in-place (e.g. `src/routes/discussions.tsx` keeps the `tag` filter typed).
- **Content pipeline** – `src/content/posts.tsx` exports a typed array of posts composed of custom typography primitives from `src/components/typography.tsx`. `listPosts` and `findPostBySlug` provide deterministic access for index/detail routes and the footer.

## Data & State Flows
- **Authentication** – `src/components/AuthProvider.tsx` bootstraps the Supabase client from `src/lib/supabaseClient.ts` and tracks `user`, `session`, loading state, and password recovery status. Consumers call `useAuth()` for hydrated values.
- **Account UX** – `src/routes/account/index.tsx` reacts to auth state and mode selection:
  - When no Supabase keys are present it renders a configuration hint.
  - Logged-in users see profile details, password update fields, and a sign-out action.
  - Guests can sign in, sign up, or trigger password reset flows. Form submission state is handled locally with optimistic messaging.
- **Discussions** – `src/routes/discussions/index.tsx` memoizes available tags, filters posts by the active query param, and demonstrates progressive enhancement (filter actions update the router search state and keep deep links shareable). `src/routes/discussions.$slug.tsx` renders the article layout and gracefully handles missing slugs.
- **Footer digest** – `src/components/Footer.tsx` reuses `listPosts()` to surface the three newest entries automatically, eliminating manual curation.

## Styling System
- **Tailwind tokens** – `src/styles.css` defines the Rosé Pine–inspired palette, gradients, and layout helpers. The project relies on Tailwind CSS v4 with native `@theme` tokens; extend those tokens instead of ad-hoc CSS to stay consistent in dark/light modes.
- **Typography primitives** – `src/components/typography.tsx` centralises headings, body copy, block quotes, and list styles so long-form content stays cohesive and easier to restyle.
- **Layout primitives** – `.container`, `.hero-gradient`, and `.gradient-text` classes drive consistent spacing and accent treatments across routes.

## Motion & Interaction
- **Hero typewriter** – `src/components/Typewriter.tsx` cycles through bait meta phrases using `motion-plus` and custom cursor styling, reinforcing the “Meta is fake” message.
- **ScrollHighlight** – `src/components/ScrollHighlight.tsx` animates the BLT pillars with `motion/react`, tracking the active section as the user scrolls to keep focus and to hint at future interactivity.
- **Micro-interactions** – Navigation, cards, and CTAs lean on lightweight hover/tap animations to keep the farm aesthetic punchy without overwhelming the content.

## Visual Identity
- Illustration assets under `public/` (Pengu mascots, BLT ingredients) reinforce the playful farm theme.
- Copywriting maintains agricultural metaphors (coop, harvest, seasoning). Design decisions ensure those metaphors are echoed visually via warm gradients and rounded surfaces.
- Dark mode is supported automatically thanks to the CSS custom property overrides wired into `styles.css`.

## Extension Points
- **Content expansion** – Items, Strategies, and Units routes currently ship with placeholder messaging. Once a CMS or Supabase tables are added, these routes can adopt the same content primitives or load data via router loaders.
- **Partner tools** – Supabase auth sets groundwork for multi-author publishing, duo progress tracking, and private resources.
- **Automation** – Future work includes wiring newsletter signup to Supabase functions or a third-party provider and adding Vitest coverage around auth edge cases and motion components.

Keep future contributions aligned with the Free-Range ethos: adaptive gameplay guidance, friendly farm theming, and composable React building blocks.
