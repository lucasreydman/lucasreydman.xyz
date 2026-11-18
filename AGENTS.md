<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# lucasreydman.xyz

Personal website for Lucas Reydman, a software developer looking for work in software, analytics and AI. Sport is the subject of most of the work, and it is not the whole pitch (Lucas, 2026-11-17: "this is about sports but also about software development and AI"): keep all three in the hero and the contact line. The two headlines say "Software, analytics and AI" without the word "sports" so they also read for a general audience (Lucas, same day); the hero sub, the page metadata and the résumé summary use the same wording. Sport is named in the About text and shown by the work itself. Live at `lucasreydman.xyz`, on the Vercel project `lucasreydman-xyz`, deployed from `main`.

## What this site is

A portfolio, and a single scroll. In order: who he is, the job he has now, the other things he has built, where he has worked, about him, how to reach him.

**History, so nobody repeats it.** A chrome 3D edition, a lime scoreboard, paper and ink, and then (2026-11-11) a masonry "gallery wall" with filter chips. The wall was a misreading: Lucas pointed at two galleries of well-made motion and UI pieces as a lesson in craft, and the site copied the galleries' layout. Do not build a gallery, a grid of tiles, or filters.

**The lesson that was meant** (from the pieces on motionvideo.xyz and inspora.design, and the directions their authors wrote):
- The page reads top to bottom as one piece. Where the stage holds, the scroll still drives everything on it.
- One idea per shot, lots of empty space, one accent.
- Type rises out of a mask line. Things arrive on a spring with a small settle, never a bounce. Nothing loops.
- The real product is the subject, shown large enough to read, with words that say what it is for. No placeholder cards.
- Banned: blanket fade-ins, bouncy easing, glows, particles, small labels above headings, dead time, anything that looks like a template.

**How the page is built:**
- `components/site/hero.tsx`: the sentence, what he does now, and the two actions, with his portrait beside it. Lucas removed the formula and ranked-row cards (2026-11-12), then asked for his photo and a clean graphic there (2026-11-16: "my photo could be there too ... cool graphic / animation / something super clean"). `components/site/hero-figure.tsx` is the portrait arriving as data and then as itself: the panel opens as an even field of small dots, a sweep from left to right sizes each dot by how dark the photograph is there, so he appears as a picture made of plotted points, and a second sweep lets the photograph itself through. It plays once; afterwards a pointer opens a round window back onto the dots. It is one picture shown as data and then as itself, with nothing to read. What was rejected on the way, all the same day: chart axes with an unlabelled point (it could not be read), a ball flying between two captioned stops (it made no sense and the captions were filler), and then no motion at all (he had asked for a more creative animation, not for none). No diagrams beside him, no captions, no product cards or numbers in the hero.
- `components/site/fbi-chapter.tsx`: FBI Basketball as a chapter. It opens by saying what FBI is and what he does there, then a held stage steps through four screens with what each is for, and it closes on the engine and the cards.
- `components/motion/stage.tsx`: the held stage. Lucas likes that the page stops and goes through the screens, but the first version felt like being stuck because nothing moved for long stretches. The rule: **something always answers the scroll.** A progress rail fills, the held screen pans inside its frame, the next screen slides up over the last in proportion to the scroll, and the position eases toward the scroll each frame. Keep all four if this is ever touched.
- `components/site/project-shot.tsx`: every other project is one shot in its own brand, with one screen at readable size. `Shot` (in `components/motion/scroll.tsx`) sets `--e` as the panel settles and `data-in` when it has arrived; the type (`Words`) and screens (`.rise`) then come up. Styles are pure functions of those variables; see the "shots" block in `app/globals.css`.
- What each shot shows is picked in `content/scroll.ts`.
- Then `experience-band`, `about-band` and the footer.

Other routes: `/work/[brand]`, one page per project in its own brand (wordmark, screens, "Everything it does", "The math", "Under the hood"); `/resume` and `/resume/print`, the one-page Letter sheet the PDF is made from.

FBI Basketball is his current job and leads. Blakey Breakthrough was client work. The rest are projects for his own leagues and questions: never present them as businesses.

**Order and actions** (Lucas, 2026-11-16). The order is in `content/projects.ts`, with the reasons in the comment above the list: the job, then the four that make the analytics case, then the tools for his own fantasy play, then PhantomGM (unfinished, built with the FBI team), then Blakey (client work) into Experience. Every project ends on one of these, set by its `action` there and drawn by `components/site/project-action.tsx`:
- **Free tool, linked**: GLUE Index, SHARPRFI, Fandex, Lineup Lab, Hitlist. Load the address signed out before adding or changing one.
- **Coming soon, no link**: Playcaller and PhantomGM.
- **Email about a build**: TPDL (a platform for your own league) and Blakey (freelance work for a business or brand).
- FBI links to its site from the chapter.

**Controls and the click through** (Lucas, 2026-11-16: "amazing hover animations, and click animations, transitions"). The "controls" block in `app/globals.css` holds all of it, under the same rules as the shots: the spring, one move per control, nothing loops, no glow.
- `.btn`: any button-shaped link. A press pushes it in and it returns on the spring.
- `.btn-line`: the outlined button. Its fill comes up from the bottom edge and the label turns over.
- `Arrow` (`components/site/arrow.tsx`): the glyph at the end of an action, `out` for leaving the site, `go` for staying, `down` for a file or a move down the page. On hover it leaves the way it points and comes back in from behind.
- `.lift`: a screen that is a link rises toward the pointer.
- A project's wordmark is wrapped in React's `ViewTransition` with the same name on the home page and on its own page, so on a click it travels from the panel to the top of the page. Keep the name on both ends, and keep the wordmark outside any block that fades in.
- These use `scale` and `translate`, never `transform`, because a control often sits inside a `.rise` block whose transform is already animated.

## The site's own identity

Built like a team identity: two colours and one accent.
- **Midnight** `#11163a` and **ice** `#f1f3fb` are the pair (ink and ground; `.midnight` turns them over for the dark band).
- **Signal yellow** `#ffc928` is the accent: the primary action, the selected filter, small markers. Nothing else.
- **Type:** Zalando Sans Expanded for the name and headlines (sentence case, bold), Zalando Sans for text, Martian Mono for dates and figures. No Geist or Inter in the site's own chrome.
- **Mark:** `components/site/mark.tsx`, L and R as one shape. The L is a pair of axes and its base runs under the R, which stands on it in the accent. The R is the headline typeface's own R at matching stroke weight. Nothing else is drawn on it: Lucas rejected rounds of marks with charts, balls and stripes added as overthought (2026-11-16).
- Radius 8 for controls, 12 for screens. No decoration.

## Brands and surfaces

`app/globals.css` has a scope per project (`.b-fbi`, `.b-tpdl`, ...) that redefines the shared tokens with that project's real values. `app/fonts.ts` loads each project's real typefaces.

A surface is a rebuilt product screen. Read `components/surfaces/README.md` before touching one: it defines the sizing system (`t-13`, `r-8`, spacing in design pixels), tile and full sizes, data rules and motion rules. One file per project in `components/surfaces/`, each exporting `SURFACES`.

Data rules that matter: sample data only; real athletes are fine and are shown with their real headshot through `Headshot` in the kit (never initials in a headshot's place, Lucas rejected those); never attach an invented injury to a real, named player; invented names for private leagues and for every Blakey member; no league or team logos; numbers must be internally consistent.

## Content

- `content/projects.ts` is the registry (brand, sport, what it is, his part).
- `content/work.ts` and `content/box-score.ts` hold each write-up: deck, intro, and the method steps with formulas and charts (`components/figures/figures.tsx`, computed from the project's real constants, themed by the brand tokens).
- `content/depth/<brand>.ts` is the full feature and engineering inventory, written from each repo. Keep it true to the code; no usage or results claims.
- `content/resume.ts` feeds the résumé page, the print sheet and the Experience section.
- After changing the résumé: build, start, then `node tools/make-resume.mjs <url>` and commit the PDF. It fails if the sheet runs past one page.

Credit: SHARPRFI was built with Francisco Nevarez. PhantomGM is being built by the FBI Basketball team, Lucas included: credit it to the team and never to a named individual (Lucas, 2026-11-11: "we build it together"). The same goes for FBI itself: say "the FBI team" or "FBI's analysts", and do not name colleagues.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4. `npm run dev` / `npm run build` / `npm run lint`.

## Component sourcing: prefer registries over hand-rolling

Before building any component from scratch, check these registries (all shadcn-compatible; code lands in the repo as editable files we own). All four are configured as namespaces in `components.json`. Install with `npx shadcn@latest add @<namespace>/<component>`. The shadcn MCP server is configured in `.mcp.json`.

| Registry | Namespace | Use for |
|---|---|---|
| **Motion Primitives** | `@motion-primitives` | Text effects, animated numbers, spotlight cards, magnetic buttons, dock, marquee |
| **Kokonut UI** | `@kokonutui` | Cards, buttons and inputs with micro-interactions, animated backgrounds |
| **Watermelon UI** | `@watermelon` | Full blocks: heroes, footers, pricing sections; Radix a11y built in |
| **Bklit UI** | `@bklit` | Charts and data visuals: animated draw-ins, gradient fills, radial counters |

Registry quirks (verified 2026-08-06):
- **Motion Primitives**: motion-primitives.com sits behind Vercel attack-challenge bot protection and often 429s CLI requests. Fallback that works: `npx motion-primitives@latest add <name>`.
- **Watermelon UI**: registry path is `https://registry.watermelon.sh/r/{name}.json`. The `/r/` segment is required; their README implies otherwise and is wrong.
- **Kokonut UI**: some components expect shared helpers from `npx shadcn@latest add https://kokonutui.com/r/utils.json`. Install that first if a component fails on missing imports.
- **Bklit UI**: docs say host `ui.bklit.com`, which 301s to `bklit.com`. `components.json` points at the canonical host.

Rules:
- Registry components are **starting material**. Always restyle to this project's tokens, and never ship default state.
- Install one component, read its code, adapt. Stacking whole pre-made blocks unmodified is its own kind of slop.

## Docs: don't trust training data

- **Motion**: fetch `https://motion.dev/llms.txt` for current API docs. Old Framer Motion patterns are stale.
- **Next.js / Tailwind v4 / shadcn**: use the context7 MCP. Tailwind v4 has no `tailwind.config.js`; theme lives in `globals.css` under `@theme`.

## Writing rules (all text, including code comments)

These apply to visible copy, code comments, commit messages and anything written back to Lucas.

- No em dashes unless genuinely unavoidable. Use a period, comma, colon or hyphen.
- No "quietly".
- No variation of "and here's the kicker".
- No variation of "it's not [X], it's [Y]". State the thing directly.
- No profound-sounding words that carry no meaning.
- No rule of three: do not list items in groups of three for rhythm. Listing three real things for a reason is fine.

## Content workflow

All copy comes from `content/`: `profile.ts`, `work.ts`, `box-score.ts`, `resume.ts`. Scenes map those files onto layout and should not hold copy of their own.

Lucas provides the raw material. Do not invent biography, achievements, or portfolio items. When content is needed and not provided, ask. Placeholder slots are fine in the interim, clearly marked `{/* TODO: content from Lucas */}`.
