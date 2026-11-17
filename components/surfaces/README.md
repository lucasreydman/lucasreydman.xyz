# Surfaces

A surface is one screen of a product Lucas built, rebuilt here as live markup
in that product's own brand, with sample data. The home page's shots are made
of them, and each project page shows them large.

Read `kit.tsx`, `types.ts`, the "surfaces" and "brand scopes" blocks in
`app/globals.css`, and `fbi.tsx` (the reference implementation) before writing
one.

## The contract

One file per project: `components/surfaces/<brand>.tsx`. It exports its screen
components and one list:

```tsx
export const SURFACES: SurfaceDef[] = [
  { id: "tpdl-matchup", title: "Matchup", caption: "...", tile: TpdlMatchup, full: TpdlMatchupFull },
];
```

Every screen is wrapped in `<Surface w={...} brand="..." label="...">`.

- `w` is the design width in pixels. Inside, everything is sized in design
  pixels and the whole screen scales with its box.
- Spacing utilities are design pixels times four: `p-4` is 16, `gap-2.5` is 10,
  `h-11` is 44, `w-84` is 336. Any multiple of 0.25 works.
- Type is `t-<px>`: `t-13`, `t-10.5`. Radius is `r-<px>`. Border width is
  `bw-<px>` (plain `border` stays a hairline, which is usually right).
- Never use `text-sm`, `text-[13px]`, `rounded-lg`, `rem` or raw `px` lengths
  inside a surface: they do not scale. For a one-off length write
  `w-[calc(var(--px)*342)]`.
- Line height is unitless: `leading-none`, `leading-tight`, `leading-[1.3]`.
- Do not put `container-type` on anything inside a surface.

### Sizes

- **Tile**: `w` between 360 and 440. It is shown about 330 pixels wide on the
  wall, so nothing smaller than `t-10`, and most text `t-11` or larger. A tile
  is a focused fragment of the product (one panel, five rows, one card), not
  the whole page shrunk down. Height is whatever the content needs, between
  roughly 0.7 and 1.5 times the width. Vary it between tiles.
- **Full**: `w` between 720 and 960, for the project page, where it is shown
  up to about 1000 pixels wide. This is the fuller screen: more rows, the side
  panel, the header.
- **Phone**: products that are installed phone apps use `<Phone>` from the kit.
  The screen inside is 320 wide. Put it on a ground with margin, for example
  `<Surface w={400}>` with `px-8 pt-10` and the phone running off the bottom
  edge (`-mb-24` on a clipped parent) so the tile is not a full phone tall.

### Brand

`brand="tpdl"` puts the subtree inside `.b-tpdl`, which sets the shared tokens
to that project's values: `bg-ground`, `bg-card`, `bg-raised`, `text-ink`,
`text-secondary`, `text-muted`, `border-line`, `bg-accent`, `text-accent`,
`text-accent-ink`, and the fonts `font-display`, `font-sans`, `font-mono`.

Anything else the product uses (position colours, tier fills, a second accent)
is written as a literal hex copied from the product's own stylesheet, with a
comment naming the file it came from. The goal is that someone who uses the
real product recognises it at a glance: same type, same colours, same corner
radius, same density, same wording.

Logos, icons and wordmarks are the real ones, in `public/brand/<brand>/`.
Small interface icons (chevrons, a bolt) are inline SVGs copied from, or
matching, the icon set the product uses. No emoji.

### Data

Sample data, chosen to look like a good day in the product:

- Real, well known athletes and teams are fine, with believable numbers. A real
  player is shown with his real headshot, through `Headshot` in the kit (ESPN's
  public CDN, by athlete id). Never put initials where a headshot goes.
- Never show a real, named player as injured, out, or moved to an injured list
  with a made-up reason or date.
- Private leagues: invent the team and manager names. Never use a real league
  member's name. Blakey: invented members only, first name and initial.
- Numbers must be internally consistent (totals add up, ranks are in order,
  a 62% chance is not next to a "+150" fair price).
- Where the product computes something from a formula that exists in its repo,
  compute the sample values the same way.

### Motion

Most surfaces are still. A surface may have one moving detail when the real
product moves there (a live dot, a clock running down, a draw being revealed).
Keep it slow and small. Use CSS only, in `components/surfaces/<brand>.css`
imported from the tsx file, with keyframe names prefixed by the brand.
Movement that changes content should run on hover of the tile: the tile
wrapper carries `group/tile`, so `group-hover/tile:` variants work.
Reduced motion is handled globally.

Screens with real controls (a slider, a toggle) go in a separate
`<brand>-live.tsx` with `"use client"` and pass `interactive` to `Surface`.

### Copy

All visible text and comments follow the repo's writing rules: no em dashes,
no "quietly", no "it's not X, it's Y", no three-item lists for rhythm, no
hype words. Labels are the product's own labels.
