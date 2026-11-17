import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Headshot, Surface } from "./kit";
import type { SurfaceDef } from "./types";
import "./tpdl.css";

/*
  TPDL (The People's Dynasty League), rebuilt from tpdl's own screens.

  Colours, radii and type sizes come from its `src/app/globals.css`: the dark
  court `#0a0e12`, the green signal `#22e58a`, Barlow Condensed for titles and
  numerals (`.display`, `.num`), Barlow for text, 14px cards, 7px chips. Layout
  and wording follow `src/app/(app)/matchup`, `team`, `draft`, `league` and
  `player/[id]`, and the shared rows in `src/components`.

  The NBA players are real and their lines are sample lines. The league's
  teams and managers are invented. Every fantasy total, projection and win
  chance on these screens is computed below with the app's own formulas.

  Two liberties:
  - The phone here is the app's own width, 390, so every row has the room it
    has on a real phone. The kit's phone is 320 and made names and status
    lines wrap where the app never does.
  - The app sets labels at 8.5 to 9.5px. On a tile they are raised to 10px so
    they stay readable at wall size. The desktop screen keeps the real sizes.
  Player headshots are ESPN's, by athlete id, the source the app itself uses.
*/

/* ─── tokens the brand scope does not carry (tpdl: src/app/globals.css) ───── */

const C = {
  bg2: "#0f141a",
  surface3: "#232e39",
  line2: "#2f3d49",
  muted2: "#6f7f8d",
  green2: "#15c474",
  greenDim: "rgba(34, 229, 138, 0.14)",
  greenGlow: "rgba(34, 229, 138, 0.45)",
  red: "#ff5a6a",
  redDim: "rgba(255, 90, 106, 0.14)",
  amber: "#ffc53d",
  amberDim: "rgba(255, 197, 61, 0.14)",
  blue: "#5ab8ff",
  blueDim: "rgba(90, 184, 255, 0.14)",
} as const;

/** One design pixel times n, for the lengths that are not on the spacing scale. */
const px = (n: number) => `calc(var(--px) * ${n})`;

const DISPLAY = "font-display font-bold tracking-[-0.01em]";
const NUM = "font-display font-bold tabular-nums tracking-[-0.02em]";
const LABEL = "font-bold uppercase tracking-[0.09em] text-muted";
const CARD = "r-14 border border-line bg-card";
const ROW = "flex items-center gap-2.5 border-t border-line px-3 py-2.5 first:border-t-0";
const CHIP = "inline-flex flex-none items-center justify-center r-7 border font-extrabold uppercase tracking-[0.06em] leading-none";
const SCREEN = "bg-ground text-ink [font-feature-settings:'tnum'_1,'ss01'_1]";

/* ─── scoring and projection (tpdl: src/lib/scoring.ts, settings.ts) ──────── */

const SCORING = { pts: 1, reb: 1.2, ast: 1.5, stl: 3.5, blk: 3.5, tov: -1, tpm: 0.5, fgm: 1, ftm: 0.5, dd: 5, td: 5 };

type Box = {
  min: number; pts: number; reb: number; ast: number; stl: number; blk: number; tov: number; pf: number;
  fgm: number; fga: number; tpm: number; tpa: number; ftm: number; fta: number; dd: boolean; td: boolean; fpts: number;
};

/** A box score line. Points come from the makes, and fantasy points from `scoreLine`. */
function box(min: number, fgm: number, fga: number, tpm: number, tpa: number, ftm: number, fta: number, reb: number, ast: number, stl: number, blk: number, tov: number, pf: number): Box {
  const pts = 2 * fgm + tpm + ftm;
  const tens = [pts, reb, ast, stl, blk].filter((v) => v >= 10).length;
  const dd = tens >= 2;
  const td = tens >= 3;
  const s = SCORING;
  const total = pts * s.pts + reb * s.reb + ast * s.ast + stl * s.stl + blk * s.blk + tov * s.tov + tpm * s.tpm + fgm * s.fgm + ftm * s.ftm + (dd ? s.dd : 0) + (td ? s.td : 0);
  return { min, pts, reb, ast, stl, blk, tov, pf, fgm, fga, tpm, tpa, ftm, fta, dd, td, fpts: Math.round(total * 100) / 100 };
}

const fp = (n: number, digits = 1) => n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const round1 = (n: number) => Math.round(n * 10) / 10;

/* ─── the league (invented teams and managers) ────────────────────────────── */

type Team = { name: string; color: string; handle?: string };

/* Colours are from tpdl's team palette, src/lib/colors.ts. */
const T = {
  net: { name: "Net Profit", color: "#22E58A", handle: "theo" },
  brick: { name: "Brick City", color: "#FF6B35", handle: "nadia" },
  dunk: { name: "Dunk Tank", color: "#5AB8FF" },
  heat: { name: "Heat Check", color: "#FF4D6D" },
  board: { name: "Board Men", color: "#B388FF" },
  tip: { name: "Tip Drill", color: "#FFC53D" },
  moon: { name: "Moon Shots", color: "#4DD4C5" },
  air: { name: "Air Ballers", color: "#9BE564" },
  fast: { name: "Fast Breaks", color: "#F2A6FF" },
  glass: { name: "Glass Eaters", color: "#FF9F5A" },
} satisfies Record<string, Team>;

/** tpdl: src/components/Avatar.tsx, `monogram`. */
function monogram(name: string) {
  const letters = name.replace(/['’]s\b/g, "").split(/[\s-]+/).filter(Boolean).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return letters.length >= 2 ? letters.slice(0, 2) : name.slice(0, 2).toUpperCase();
}

function Avatar({ t, size }: { t: Team; size: number }) {
  return (
    <span
      className={cn(DISPLAY, "inline-flex flex-none items-center justify-center r-999 leading-none text-[#0a0e12]")}
      style={{ width: px(size), height: px(size), background: t.color, fontSize: px(Math.round(size * 0.42)), letterSpacing: "-0.02em", boxShadow: `inset 0 0 0 ${px(1.5)} rgba(0,0,0,0.35)` }}
    >
      {monogram(t.name)}
    </span>
  );
}

/** tpdl: `.headshot` in src/app/globals.css: a circle on surface-3 with a 1.5px ring. The picture is ESPN's, scaled in
 *  tpdl.css so the head and shoulders fill the circle. */
function Face({ id, size = 40 }: { id: number; size?: number }) {
  return (
    <span className="relative block flex-none overflow-hidden r-999 bg-[#232e39]" style={{ width: px(size), height: px(size) }}>
      <Headshot league="nba" id={id} className="tpdl-face h-full w-full bg-transparent" />
      <span className="absolute inset-0 r-999" style={{ boxShadow: `inset 0 0 0 ${px(1.5)} ${C.line2}` }} />
    </span>
  );
}

/** The phone these screens sit in, at the app's own width: a 390 screen in a 406 body. With `h` the whole phone shows;
 *  without it the screen is as tall as its content and the tile hides the bottom edge. */
function TPhone({ children, h }: { children: ReactNode; h?: number }) {
  return (
    <div className="relative mx-auto w-101.5 r-54 bg-[#0c0c0d] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_24px_48px_rgba(0,0,0,0.35)]">
      <div className={cn("relative overflow-hidden r-46", SCREEN)} style={h ? { height: px(h) } : undefined}>
        <div className="absolute left-1/2 top-2.75 z-20 h-7 w-26 -translate-x-1/2 r-14 bg-black" />
        <div className="flex h-12 items-center justify-between px-8 t-15 font-semibold">
          <span>9:41</span>
          <span className="h-3 w-5.5 r-1.5 border border-current opacity-80" />
        </div>
        {children}
      </div>
    </div>
  );
}

/** A phone running off the bottom of its tile. The screen ends in a spacer the tile hides, so the cut always falls
 *  right after the last row: `gap` leaves 8 pixels under it, without it an open card meets the edge. */
function PhoneTile({ children, gap }: { children: ReactNode; gap?: boolean }) {
  return (
    <div className="overflow-hidden px-5.5 pt-6">
      <div className="-mb-14">
        <TPhone>
          {children}
          <div className={gap ? "h-14" : "h-12"} />
        </TPhone>
      </div>
    </div>
  );
}

/* ─── icons (tpdl: src/components/Icon.tsx and TabBar.tsx) ────────────────── */

const ICONS = {
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  back: <path d="M15 6l-6 6 6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.6v.01" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  swap: <path d="M7 7h11l-3-3M17 17H6l3 3" />,
  check: <path d="m5 12 4 4 10-10" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />,
  users3: (
    <>
      <circle cx="12" cy="7.5" r="3" />
      <path d="M6.5 20c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
      <circle cx="5" cy="10" r="2.2" />
      <path d="M1.5 19c0-2.4 1.5-4.2 3.8-4.4" />
      <circle cx="19" cy="10" r="2.2" />
      <path d="M22.5 19c0-2.4-1.5-4.2-3.8-4.4" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14" r="5" />
      <path d="M8 3 10 9M16 3l-2 6M8 3h8" />
    </>
  ),
  history: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4.5l3 2" />
    </>
  ),
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1.2" />
      <circle cx="15" cy="15" r="1.2" />
      <circle cx="15" cy="9" r="1.2" />
      <circle cx="9" cy="15" r="1.2" />
    </>
  ),
  ball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" />
      <path d="M5.5 5.5c3 2.5 3 10.5 0 13M18.5 5.5c-3 2.5-3 10.5 0 13" />
    </>
  ),
  team: (
    <>
      <path d="M8.2 3a3.8 3.8 0 0 0 7.6 0h1.9c.1 3.3 1.2 5.4 2.3 6.3V21H4V9.3C5.1 8.4 6.2 6.3 6.3 3z" />
      <path d="M9.5 14h5" />
    </>
  ),
  players: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  matchup: (
    <>
      <path d="M2.8 6.4 8.8 4.6v14.8l-6-1.8z" />
      <path d="M21.2 6.4l-6-1.8v14.8l6-1.8z" />
      <path d="M13 7.6 11.1 12h1.9l-1.9 4.4" />
    </>
  ),
  league: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0z" />
      <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </>
  ),
} as const;

function Icon({ name, className, stroke = 2.2, fill }: { name: keyof typeof ICONS; className?: string; stroke?: number; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("inline-block flex-none", className)} fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

/* ─── small parts shared by the screens ───────────────────────────────────── */

/** tpdl: `.live-dot.live-dot-red`. It pulses while the tile is hovered. */
function LiveDot({ size = 8 }: { size?: number }) {
  return <span className="tpdl-live inline-block flex-none r-999 bg-[#ff5a6a]" style={{ width: px(size), height: px(size), boxShadow: `0 0 ${px(10)} rgba(255,90,106,0.7)` }} />;
}

/** tpdl: src/components/Avatar.tsx, `slotTone` and `slotLabel`. */
function slotTone(slot: string): { bg: string; fg: string } {
  switch (slot) {
    case "PG": case "SG": case "G": return { bg: C.blueDim, fg: C.blue };
    case "SF": case "PF": case "F": return { bg: "rgba(255,159,90,0.16)", fg: "#FF9F5A" };
    case "C": return { bg: "rgba(179,136,255,0.16)", fg: "#B388FF" };
    case "UTIL": return { bg: "rgba(77,212,197,0.16)", fg: "#4DD4C5" };
    case "IR": return { bg: "rgba(178,34,52,0.26)", fg: "#E0475B" };
    case "TAXI": return { bg: C.amberDim, fg: C.amber };
    default: return { bg: C.surface3, fg: "var(--muted)" };
  }
}
const slotLabel = (slot: string) => (slot === "UTIL" ? "FLEX" : slot === "IR" ? "IL" : slot);

function SlotChip({ slot, sm }: { slot: string; sm?: boolean }) {
  const t = slotTone(slot);
  return (
    <span className={cn(CHIP, "border-transparent", sm ? "h-5.5 min-w-8.5 px-1 t-10" : "h-7.5 w-11 t-11")} style={{ background: t.bg, color: t.fg }}>
      {slotLabel(slot)}
    </span>
  );
}

/** The small status chips: DD, TODAY, NO GAME, INJ. */
function Tag({ children, bg, fg, className }: { children: ReactNode; bg: string; fg: string; className?: string }) {
  return (
    <span className={cn(CHIP, "h-4.5 border-transparent px-1.25 t-10", className)} style={{ background: bg, color: fg }}>
      {children}
    </span>
  );
}

const DD = () => <Tag bg={C.blueDim} fg={C.blue} className="h-4">DD</Tag>;

/** tpdl: src/components/StatLine.tsx, `StatGrid`. Eight cells, dashes before tip-off. */
function StatGrid({ l, muted, small = "t-10" }: { l: Box | null; muted?: boolean; small?: string }) {
  const cells: [string, number | undefined][] = [["min", l?.min], ["pts", l?.pts], ["reb", l?.reb], ["ast", l?.ast], ["stl", l?.stl], ["blk", l?.blk], ["to", l?.tov], ["pf", l?.pf]];
  return (
    <div className={cn("flex justify-between", muted && "opacity-45")}>
      {cells.map(([k, v]) => (
        <div key={k} className="text-center">
          <div className={cn(NUM, "t-13 leading-none text-ink")}>{v ?? "–"}</div>
          <div className={cn("mt-0.5 font-bold uppercase leading-[1.3] tracking-wide text-muted", small)}>{k}</div>
        </div>
      ))}
    </div>
  );
}

/** tpdl: `StatLine` in compact mode: the big three and a DD badge. */
function StatLine({ l, small }: { l: Box; small: string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
      {([[l.pts, "pts"], [l.reb, "reb"], [l.ast, "ast"]] as [number, string][]).map(([v, k]) => (
        <span key={k} className="whitespace-nowrap">
          <span className={cn(NUM, "font-extrabold text-ink")}>{v}</span>
          <span className={cn("ml-0.5 font-bold uppercase tracking-wide text-muted", small)}>{k}</span>
        </span>
      ))}
      {l.dd ? <DD /> : null}
    </span>
  );
}

/** tpdl: src/app/(app)/player/[id]/perGame.ts, `shootPct` and `shootColor`. */
const shootPct = (made: number, att: number) => (att > 0 ? `${Math.round((made / att) * 100)}%` : "–");
const SHOOT_CUTS: Record<string, number[]> = { FG: [55, 47, 40, 33], "3P": [42, 36, 31, 25], FT: [90, 80, 70, 60] };
function shootColor(kind: string, made: number, att: number) {
  if (att < 3) return "var(--muted)";
  const pct = (made / att) * 100;
  const [, good, ok, poor] = SHOOT_CUTS[kind.startsWith("3") ? "3P" : kind];
  return pct >= good ? "var(--accent)" : pct >= ok ? "var(--muted)" : pct >= poor ? "rgba(255,90,106,0.85)" : C.red;
}

/* ─── this week's matchup (sample data, the app's own maths) ──────────────── */

type Game =
  | { state: "pre"; opp: string; time: string }
  | { state: "in"; opp: string; period: number; clock: string; us: number; them: number }
  | { state: "post"; opp: string; us: number; them: number };

type Starter = { slot: string; name: string; id: number; team: string; pos: string; proj: number; left: number; game: Game; line?: Box };

const ordinal = (n: number) => ["", "1st", "2nd", "3rd", "4th"][n];

/** tpdl: src/lib/queries.ts, `remainingFraction`: the share of a game still to be played. */
function remainingFraction(g: Game) {
  if (g.state === "pre") return 1;
  if (g.state === "post") return 0;
  const [m, s] = g.clock.split(":").map(Number);
  const played = (g.period - 1) * 12 + (12 - (m + s / 60));
  return Math.max(0, 1 - played / 48);
}

/** tpdl: src/components/PlayerLine.tsx, `gameLabel`, as the matchup cell prints it. */
function gameText(g: Game) {
  if (g.state === "pre") return { text: `${g.opp} · ${g.time}`, score: "" };
  if (g.state === "in") return { text: `${g.opp} · ${ordinal(g.period)} ${g.clock}`, score: `${g.us}-${g.them}` };
  return { text: `${g.opp} · ${g.us > g.them ? "W" : "L"}`, score: `${g.us}-${g.them}` };
}

/* Wednesday's slate. Both sides of a game carry the same clock and score. */
const OKC_DEN = { period: 2, clock: "7:45" };
const SAS_HOU = { period: 3, clock: "6:10" };
const ORL_ATL = { period: 4, clock: "9:30" };
const DAL_MIN = { period: 3, clock: "2:48" };
const CHI_DET = { period: 2, clock: "5:12" };

const MINE: Starter[] = [
  { slot: "PG", name: "Cade Cunningham", id: 4432166, team: "DET", pos: "PG", proj: 49.4, left: 2, game: { state: "in", opp: "vs CHI", ...CHI_DET, us: 47, them: 44 }, line: box(17, 4, 9, 1, 3, 4, 4, 2, 4, 1, 0, 1, 1) },
  { slot: "SG", name: "Donovan Mitchell", id: 3908809, team: "CLE", pos: "SG", proj: 43.5, left: 2, game: { state: "post", opp: "vs IND", us: 121, them: 113 }, line: box(36, 11, 22, 4, 10, 5, 6, 5, 6, 2, 0, 3, 2) },
  { slot: "SF", name: "Jaylen Brown", id: 3917376, team: "PHI", pos: "SG/SF", proj: 40.2, left: 1, game: { state: "post", opp: "vs MIA", us: 101, them: 108 }, line: box(34, 8, 18, 2, 6, 3, 4, 6, 4, 1, 0, 3, 3) },
  { slot: "PF", name: "Paolo Banchero", id: 4432573, team: "ORL", pos: "PF", proj: 41.8, left: 2, game: { state: "in", opp: "@ ATL", ...ORL_ATL, us: 89, them: 92 }, line: box(30, 8, 17, 1, 4, 5, 7, 8, 5, 0, 1, 3, 2) },
  { slot: "C", name: "Victor Wembanyama", id: 5104157, team: "SAS", pos: "C", proj: 54.6, left: 2, game: { state: "in", opp: "@ HOU", ...SAS_HOU, us: 71, them: 66 }, line: box(22, 7, 13, 2, 5, 3, 4, 8, 2, 1, 3, 2, 2) },
  { slot: "G", name: "Tyrese Maxey", id: 4431678, team: "PHI", pos: "PG", proj: 44.1, left: 1, game: { state: "post", opp: "vs MIA", us: 101, them: 108 }, line: box(37, 9, 21, 3, 9, 6, 6, 3, 7, 1, 0, 2, 2) },
  { slot: "F", name: "Evan Mobley", id: 4432158, team: "CLE", pos: "PF/C", proj: 37.9, left: 2, game: { state: "post", opp: "vs IND", us: 121, them: 113 }, line: box(33, 7, 12, 0, 1, 4, 6, 11, 3, 1, 2, 1, 3) },
  { slot: "UTIL", name: "Austin Reaves", id: 4066457, team: "LAL", pos: "SG", proj: 36.4, left: 1, game: { state: "pre", opp: "@ GSW", time: "10:00PM" } },
  { slot: "UTIL", name: "Domantas Sabonis", id: 3155942, team: "SAC", pos: "C", proj: 43.0, left: 2, game: { state: "pre", opp: "vs PHX", time: "10:30PM" } },
  { slot: "UTIL", name: "Jalen Williams", id: 4593803, team: "OKC", pos: "SG/SF", proj: 38.2, left: 2, game: { state: "in", opp: "@ DEN", ...OKC_DEN, us: 41, them: 38 }, line: box(14, 3, 7, 1, 3, 0, 0, 2, 2, 1, 0, 1, 2) },
];

const THEIRS: Starter[] = [
  { slot: "PG", name: "Jalen Brunson", id: 3934672, team: "NYK", pos: "PG", proj: 42.3, left: 2, game: { state: "post", opp: "@ BOS", us: 104, them: 112 }, line: box(36, 10, 22, 3, 8, 6, 7, 3, 8, 1, 0, 3, 2) },
  { slot: "SG", name: "Anthony Edwards", id: 4594268, team: "MIN", pos: "SG", proj: 45.2, left: 1, game: { state: "in", opp: "vs DAL", ...DAL_MIN, us: 78, them: 74 }, line: box(25, 7, 16, 3, 8, 4, 5, 4, 3, 1, 0, 2, 2) },
  { slot: "SF", name: "Jalen Johnson", id: 4701230, team: "ATL", pos: "SF/PF", proj: 43.7, left: 2, game: { state: "in", opp: "vs ORL", ...ORL_ATL, us: 92, them: 89 }, line: box(31, 7, 14, 1, 3, 3, 4, 9, 6, 2, 1, 3, 3) },
  { slot: "PF", name: "Pascal Siakam", id: 3149673, team: "IND", pos: "PF", proj: 37.5, left: 2, game: { state: "post", opp: "@ CLE", us: 113, them: 121 }, line: box(34, 8, 17, 1, 4, 3, 4, 6, 4, 0, 1, 2, 3) },
  { slot: "C", name: "Nikola Jokic", id: 3112335, team: "DEN", pos: "C", proj: 61.8, left: 2, game: { state: "in", opp: "vs OKC", ...OKC_DEN, us: 38, them: 41 }, line: box(15, 4, 6, 0, 1, 2, 2, 6, 4, 0, 0, 1, 1) },
  { slot: "G", name: "Stephen Curry", id: 3975, team: "GSW", pos: "PG", proj: 41.0, left: 1, game: { state: "pre", opp: "vs LAL", time: "10:00PM" } },
  { slot: "F", name: "Bam Adebayo", id: 4066261, team: "MIA", pos: "PF/C", proj: 36.8, left: 1, game: { state: "post", opp: "@ PHI", us: 108, them: 101 }, line: box(34, 6, 13, 0, 1, 5, 6, 10, 4, 1, 1, 2, 3) },
  { slot: "UTIL", name: "Alperen Sengun", id: 4871144, team: "HOU", pos: "C", proj: 44.9, left: 2, game: { state: "in", opp: "vs SAS", ...SAS_HOU, us: 66, them: 71 }, line: box(21, 5, 11, 0, 1, 3, 5, 6, 4, 1, 0, 2, 3) },
  { slot: "UTIL", name: "Devin Booker", id: 3136193, team: "PHX", pos: "SG", proj: 40.6, left: 2, game: { state: "pre", opp: "@ SAC", time: "10:30PM" } },
  { slot: "UTIL", name: "Karl-Anthony Towns", id: 3136195, team: "NYK", pos: "C", proj: 42.4, left: 2, game: { state: "post", opp: "@ BOS", us: 104, them: 112 }, line: box(33, 7, 15, 2, 5, 4, 4, 12, 2, 0, 1, 3, 4) },
];

type Day = { wd: string; n: number; pts: number | null; games: number };

/**
 * A team's week, the way tpdl's src/lib/leagueweek.ts builds it: points so
 * far, what is still expected (`remProj`) and how uncertain that is (`remVar`).
 * Each game left adds (0.5 x projection)^2 of noise, a game that has not tipped
 * off adds the 7% chance he sits it, and 15% of the whole remainder is shared
 * projection error.
 */
function teamWeek(team: Team, starters: Starter[], before: Day[], after: Day[], addsUsed: number) {
  const NOISE = 0.5;
  const SIT_BASE = 0.07;
  const today = round1(starters.reduce((a, s) => a + (s.line?.fpts ?? 0), 0));
  const total = round1(before.reduce((a, d) => a + (d.pts ?? 0), 0) + today);
  let remProj = 0;
  let remVar = 0;
  let todayLeft = 0;
  const add = (proj: number, frac: number, pre: boolean) => {
    const exp = proj * frac;
    remProj += exp;
    remVar += (NOISE * proj) ** 2 * frac;
    if (pre && exp > 0) remVar += exp * exp * SIT_BASE * (1 - SIT_BASE);
  };
  for (const s of starters) {
    const frac = remainingFraction(s.game);
    todayLeft += s.proj * frac;
    add(s.proj, frac, s.game.state === "pre");
    for (let i = 0; i < s.left; i++) add(s.proj, 1, true);
  }
  remVar += (0.15 * remProj) ** 2;
  const finals = starters.filter((s) => s.game.state === "post").length;
  const played = before.reduce((a, d) => a + d.games, 0);
  return {
    team, starters, addsUsed, today, total, remProj, remVar,
    proj: round1(total + remProj),
    todayProj: round1(today + todayLeft),
    gamesPlayed: played + finals,
    gamesTotal: played + starters.length + starters.reduce((a, s) => a + s.left, 0),
    days: [...before, { wd: "Wed", n: 11, pts: today, games: starters.length }, ...after],
  };
}

/** tpdl: src/lib/winprob.ts. A Student-t with 5 degrees of freedom on the gap between the two projected finals. */
function winProb(a: { total: number; remProj: number; remVar: number }, b: { total: number; remProj: number; remVar: number }) {
  const mu = a.total + a.remProj - (b.total + b.remProj);
  const sd = Math.sqrt(a.remVar + b.remVar);
  if (sd < 1e-6) return mu > 0 ? 1 : mu < 0 ? 0 : 0.5;
  const th = Math.atan(mu / sd / Math.sqrt(5));
  const c = Math.cos(th);
  return 0.5 + (th + Math.sin(th) * c * (1 + (2 / 3) * c * c)) / Math.PI;
}

const future = (games: number[]): Day[] => [["Thu", 12], ["Fri", 13], ["Sat", 14], ["Sun", 15]].map(([wd, n], i) => ({ wd: wd as string, n: n as number, pts: null, games: games[i] }));

const LEFT = teamWeek(T.net, MINE, [{ wd: "Mon", n: 9, pts: 296.8, games: 6 }, { wd: "Tue", n: 10, pts: 186.4, games: 4 }], future([3, 6, 3, 5]), 2);
const RIGHT = teamWeek(T.brick, THEIRS, [{ wd: "Mon", n: 9, pts: 201.5, games: 5 }, { wd: "Tue", n: 10, pts: 249.7, games: 6 }], future([4, 5, 4, 4]), 1);
const WP = winProb(LEFT, RIGHT);
const WP_PCT = Math.round(WP * 100);
const LEAD = round1(LEFT.total - RIGHT.total);
const ADD_LIMIT = 4;
/* The league's middle score so far this week. Both teams in this matchup sit above it. */
const MEDIAN = { now: 742.6 };

/* ─── matchup: the pieces ─────────────────────────────────────────────────── */

/** tpdl: src/lib/names.ts, `shortName`. */
function shortName(name: string, max = 22) {
  if (name.length <= max) return name;
  const parts = name.split(" ");
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}

/** One starter in the paired grid. tpdl: `Cell` in src/app/(app)/matchup/MatchupView.tsx. */
function Cell({ s, side, desk }: { s: Starter; side: "left" | "right"; desk?: boolean }) {
  const R = side === "right";
  const g = s.game;
  const live = g.state === "in";
  const has = g.state !== "pre";
  const { text, score } = gameText(g);
  const small = desk ? "t-8.5" : "t-10";
  return (
    <div className={cn(CARD, "relative overflow-hidden px-2 py-1.5", R && "text-right")} style={{ minHeight: px(96) }}>
      <div className={cn("absolute inset-y-0 w-0.75", R ? "right-0" : "left-0")} style={{ background: live ? "var(--accent)" : g.state === "post" ? C.line2 : C.blue }} />
      <div className={cn("flex items-center justify-between gap-1", R && "flex-row-reverse")}>
        <Face id={s.id} />
        <div className={cn("flex flex-col", R ? "items-start" : "items-end")}>
          {has ? (
            <span className={cn(NUM, "t-24 leading-none", live && "text-accent")}>{fp(s.line?.fpts ?? 0)}</span>
          ) : (
            <span className={cn(NUM, "t-22 leading-none text-[#6f7f8d]")}>{fp(s.proj)}</span>
          )}
          <span className={cn(LABEL, small, "leading-[1.5]")}>{has ? (live ? "live" : "final") : "proj"}</span>
        </div>
      </div>
      <div className={cn("mt-1 whitespace-nowrap font-bold leading-[1.15]", desk ? "t-14" : "t-13")}>{desk ? s.name : shortName(s.name)}</div>
      <div className="mt-0.75 t-11 leading-tight text-muted">
        <span className="font-semibold text-secondary">{s.team}</span> · {s.pos}
      </div>
      <div className={cn("mt-0.5 whitespace-nowrap t-11 leading-tight", live ? "font-bold text-accent" : "text-muted")}>
        {live ? <span className="mr-1 inline-block align-middle"><LiveDot size={5} /></span> : null}
        {text}
        {score ? <span className={cn(NUM, "whitespace-nowrap")}> {score}</span> : null}
      </div>
      {!desk && s.line && !live ? (
        <div className="mt-0.75 t-11 leading-tight">
          <StatLine l={s.line} small="t-10" />
        </div>
      ) : null}
      {desk ? (
        <div className="mt-2 border-t border-line pt-1.5">
          <StatGrid l={s.line ?? null} muted={!s.line} small="t-8.5" />
        </div>
      ) : null}
    </div>
  );
}

function TeamBadge({ t, align }: { t: Team; align: "left" | "right" }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", align === "right" && "flex-row-reverse text-right")}>
      <Avatar t={t} size={40} />
      <div className="min-w-0">
        <div className={cn(DISPLAY, "t-16 leading-[1.1]")}>{t.name}</div>
        <div className="t-11 leading-tight text-muted">@{t.handle}</div>
      </div>
    </div>
  );
}

/** tpdl: src/components/ProjToggle.tsx, resting on Current. */
function ProjToggle() {
  return (
    <div className="inline-grid grid-cols-2 r-999 bg-[#232e39] p-0.5 t-11 font-extrabold">
      <span className="flex h-6 items-center justify-center r-999 bg-card px-3 text-ink shadow-[0_1px_3px_rgba(0,0,0,0.35)]">Current</span>
      <span className="flex h-6 items-center justify-center px-3 text-muted">Projected</span>
    </div>
  );
}

/** The scoreboard card: both totals, the lead, projected finals and the win chance. */
function ScoreCard({ median, desk }: { median?: boolean; desk?: boolean }) {
  const small = desk ? "t-8.5" : "t-10";
  const leftWin = LEAD > 0;
  const stats: [string, string][] = [
    ["Games played", `${LEFT.gamesPlayed}/${LEFT.gamesTotal}`],
    ["Adds used", `${LEFT.addsUsed}/${ADD_LIMIT}`],
    ["Adds used", `${RIGHT.addsUsed}/${ADD_LIMIT}`],
    ["Games played", `${RIGHT.gamesPlayed}/${RIGHT.gamesTotal}`],
  ];
  const rows = [
    { key: "l", t: LEFT.team as Team | null, pts: LEFT.total },
    { key: "r", t: RIGHT.team as Team | null, pts: RIGHT.total },
    { key: "m", t: null as Team | null, pts: MEDIAN.now },
  ].sort((a, b) => b.pts - a.pts);
  const max = Math.max(...rows.map((r) => r.pts));
  return (
    <div className="overflow-hidden r-14 border border-line" style={{ background: `linear-gradient(180deg, var(--card) 0%, ${C.bg2} 100%)` }}>
      <div className="grid grid-cols-2 gap-2 px-3 pt-2.5">
        <TeamBadge t={LEFT.team} align="left" />
        <TeamBadge t={RIGHT.team} align="right" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end px-3 pb-1.5 pt-0.5">
        <div className={cn(NUM, "t-50 leading-none", leftWin ? "text-ink [text-shadow:0_0_22px_rgba(255,255,255,0.1)]" : "text-secondary")}>{fp(LEFT.total)}</div>
        <div className="px-2 pb-2.5 text-center">
          <div className={cn(LABEL, "t-10 leading-[1.5]")}>vs</div>
          <div className={cn(NUM, "mt-0.5 t-13 leading-[1.4]", LEAD > 0 ? "text-accent" : "text-[#ff5a6a]")}>
            {LEAD > 0 ? "+" : ""}
            {fp(LEAD)}
          </div>
        </div>
        <div className={cn(NUM, "text-right t-50 leading-none", leftWin ? "text-secondary" : "text-ink")}>{fp(RIGHT.total)}</div>
      </div>
      <div className="px-3 pb-1">
        <div className="mb-1 flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className={cn(NUM, "t-18 leading-none", LEFT.proj > RIGHT.proj ? "text-accent" : "text-[#ff5a6a]")}>{fp(LEFT.proj)}</span>
            <span className={cn(LABEL, small)}>week proj</span>
          </div>
          <div className="flex flex-row-reverse items-baseline gap-1.5">
            <span className={cn(NUM, "t-18 leading-none", RIGHT.proj > LEFT.proj ? "text-accent" : "text-[#ff5a6a]")}>{fp(RIGHT.proj)}</span>
            <span className={cn(LABEL, small)}>week proj</span>
          </div>
        </div>
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: `${px(44)} 1fr ${px(44)}` }}>
          <span className={cn(NUM, "t-15", WP >= 0.5 ? "text-accent" : "text-secondary")}>{WP_PCT}%</span>
          <div className="relative h-3.5 overflow-hidden r-999 border border-[#2f3d49] bg-[#232e39]">
            <div className="absolute inset-y-0 right-0" style={{ width: `${(1 - WP) * 100}%`, background: "linear-gradient(90deg, rgba(255,90,106,0.35), rgba(255,90,106,0.7))" }} />
            <div className="absolute inset-y-0 left-0 r-999" style={{ width: `${WP * 100}%`, background: `linear-gradient(90deg, ${C.green2}, var(--accent))`, boxShadow: `0 0 ${px(12)} ${C.greenGlow}` }} />
          </div>
          <span className={cn(NUM, "text-right t-15", WP < 0.5 ? "text-accent" : "text-secondary")}>{100 - WP_PCT}%</span>
        </div>
        <div className={cn(LABEL, small, "mt-1 text-center")}>win chance</div>
      </div>
      <div className="mt-1 grid grid-cols-4 border-t border-line px-3 pb-2.5 pt-2">
        {stats.map(([l, v], i) => (
          <div key={i} className={i < 2 ? "text-left" : "text-right"}>
            <div className={cn(LABEL, small, "whitespace-nowrap", desk && "tracking-[0.04em]")}>{l}</div>
            <div className={cn(NUM, "t-14 leading-tight text-secondary")}>{v}</div>
          </div>
        ))}
      </div>
      {median ? (
        <div className="border-t border-line bg-[#0f141a] px-3 pb-3 pt-2.5">
          <div className="mb-2 flex items-center justify-between">
            <div className={cn(LABEL, "t-10.5")}>League median</div>
            <ProjToggle />
          </div>
          {rows.map((r) => (
            <div key={r.key} className="grid h-8.5 items-center gap-2.5" style={{ gridTemplateColumns: `${px(24)} 1fr ${px(64)}` }}>
              {r.t ? <Avatar t={r.t} size={24} /> : <span className={cn(LABEL, "text-center t-8")}>MED</span>}
              <div className={cn("overflow-hidden r-999 bg-[#232e39]", r.t ? "h-2.5" : "h-0.75")}>
                <div className="h-full r-999" style={{ width: `${(r.pts / max) * 100}%`, background: r.t ? "var(--accent)" : "var(--secondary)", boxShadow: r.t ? `0 0 ${px(10)} ${C.greenGlow}` : "none" }} />
              </div>
              <span className={cn(NUM, "text-right", r.t ? "t-16 text-accent" : "t-15 text-secondary")}>{fp(r.pts)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** The matchup header: week picker, the day, and the Live button. */
function MatchupTopbar() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-line px-4 py-2">
      <div className="-ml-1.5">
        <span className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap r-999 border border-line bg-raised pl-3 pr-2.5">
          <span className="t-13 font-extrabold">Week 4</span>
          <Icon name="down" className="h-2.75 w-2.75 text-muted" stroke={3} />
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={cn(DISPLAY, "whitespace-nowrap t-19 leading-none")}>Wed, Nov 11</span>
        <span className="inline-flex h-4 items-center r-999 px-1.5 t-10 font-extrabold leading-none tracking-wider" style={{ background: C.greenDim, color: "var(--accent)" }}>TODAY</span>
        <Icon name="down" className="h-3 w-3 text-muted" stroke={3} />
      </div>
      <div className="flex justify-end">
        <span className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap r-999 border border-line bg-raised pl-2.5 pr-3">
          <LiveDot />
          <span className="t-13 font-extrabold">Live</span>
        </span>
      </div>
    </div>
  );
}

function StartersHead() {
  return (
    <div className="mb-1.5 mt-1 flex items-center justify-between pb-1.5 pt-2">
      <div className={cn(DISPLAY, "t-20 leading-[1.4]")}>Starters</div>
      <div className="t-11.5 text-muted">
        Wed 11 · <span className={NUM}>{fp(LEFT.today)}</span> <span className="text-[#6f7f8d]">vs</span> <span className={NUM}>{fp(RIGHT.today)}</span>
      </div>
    </div>
  );
}

function Pairs({ count, desk }: { count: number; desk?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      {MINE.slice(0, count).map((s, i) => (
        <div key={s.name} className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-1.5">
          <Cell s={s} side="left" desk={desk} />
          <div className="flex items-center justify-center">
            <SlotChip slot={s.slot} sm />
          </div>
          <Cell s={THEIRS[i]} side="right" desk={desk} />
        </div>
      ))}
    </div>
  );
}

/** The live head to head on a phone: the hero screen. */
export function TpdlMatchup() {
  return (
    <Surface w={450} brand="tpdl" label={`TPDL matchup screen. ${LEFT.team.name} ${fp(LEFT.total)}, ${RIGHT.team.name} ${fp(RIGHT.total)}, with a ${WP_PCT} percent win chance and the starters paired by lineup slot.`} className="bg-[#05080b]">
      <PhoneTile gap>
        <MatchupTopbar />
        <div className="px-3 pb-1 pt-2">
          <ScoreCard />
        </div>
        <div className="px-3">
          <StartersHead />
          <Pairs count={2} />
        </div>
      </PhoneTile>
    </Surface>
  );
}

/* ─── matchup on a desk (tpdl: src/app/desktop.css and the lg: rules) ─────── */

const OTHERS: [Team, Team][] = [[T.net, T.brick], [T.dunk, T.tip], [T.heat, T.glass], [T.board, T.air], [T.moon, T.fast]];

function DayStrip({ mine, opp }: { mine: Day[]; opp?: Day[] }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {mine.map((d, i) => {
        const o = opp?.[i];
        const today = d.wd === "Wed";
        const ahead = o && d.pts != null && o.pts != null ? d.pts > o.pts : false;
        const behind = o && d.pts != null && o.pts != null ? o.pts > d.pts : false;
        return (
          <div key={d.n} className={cn("flex flex-col items-center r-12 border pb-1 pt-1.5", today ? "border-accent bg-raised" : "border-transparent")}>
            <span className={cn(LABEL, "t-9.5 leading-none", today && "text-accent")}>{d.wd}</span>
            <span className={cn(NUM, "mt-1 t-17 leading-none", today ? "text-ink" : "text-secondary")}>{d.n}</span>
            <span className={cn(NUM, "mt-1.5 t-12.5 leading-none", ahead ? "text-accent" : d.pts != null ? "text-ink" : "text-[#6f7f8d]")}>{d.pts != null ? fp(d.pts) : "–"}</span>
            {opp ? <span className={cn(NUM, "mt-1 t-11 leading-none", behind ? "text-accent" : "text-muted")}>{o?.pts != null ? fp(o.pts) : "–"}</span> : null}
            <span className="mt-1 flex h-4 items-center justify-center">
              {today ? (
                <span className="inline-flex h-3.75 items-center r-999 px-1.5 t-8.5 font-extrabold tracking-wider" style={{ background: C.greenDim, color: "var(--accent)" }}>TODAY</span>
              ) : (
                <span className="t-9 leading-none text-[#6f7f8d]">{d.games} gm</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const SIDE_TABS: [keyof typeof ICONS, string][] = [["team", "Team"], ["players", "Players"], ["matchup", "Matchup"], ["league", "League"], ["more", "More"]];
const SIDE_MORE: [keyof typeof ICONS, string][] = [["chat", "Direct messages"], ["live", "Live feed"], ["medal", "Leaders"], ["history", "League history"], ["dice", "Draft hub"], ["ball", "Draft room"]];

function SideNav() {
  return (
    <div className="flex w-55 flex-none flex-col gap-0.5 border-r border-line px-3 pb-5 pt-5.5">
      <div className="flex items-center gap-2.5 px-2 pb-4">
        <Image src="/brand/tpdl/icon.png" alt="" width={512} height={512} className="h-10 w-10 r-12" />
        <span className="min-w-0">
          <span className={cn(DISPLAY, "block t-22 leading-none")}>TPDL</span>
          <span className="mt-0.5 block t-11 leading-tight text-muted">The People’s Dynasty League</span>
        </span>
      </div>
      <div className="mx-0.5 mb-2.5 flex h-10 items-center gap-2.5 r-11 border border-[#2f3d49] bg-card pl-3 pr-2.5 t-14 font-bold text-muted">
        <Icon name="search" className="h-4.25 w-4.25" />
        <span className="flex-1">Search</span>
        <span className="inline-flex h-5 items-center r-6 border border-[#2f3d49] bg-raised px-1.5 t-10.5 font-bold leading-none tracking-[0.04em]">Ctrl K</span>
      </div>
      {SIDE_TABS.map(([icon, label]) => {
        const on = label === "Matchup";
        return (
          <div key={label} className={cn("flex h-11.5 items-center gap-3 r-12 px-3 t-15 font-extrabold", on ? "text-accent" : "text-muted")} style={on ? { background: C.greenDim, boxShadow: `inset 0 0 0 ${px(1.5)} var(--accent)` } : undefined}>
            <span className="relative flex-none">
              <Icon name={icon} className="h-5.5 w-5.5" />
              {label === "League" ? <span className={cn(NUM, "absolute -right-2.5 -top-1.5 h-4.25 min-w-4.25 r-999 bg-[#ff5a6a] px-1 text-center t-10.5 leading-[1.62] text-white")}>3</span> : null}
            </span>
            {label}
          </div>
        );
      })}
      <div className={cn(LABEL, "px-3 pb-1.5 pt-5 t-10.5")}>League</div>
      {SIDE_MORE.map(([icon, label]) => (
        <div key={label} className="flex h-11.5 items-center gap-3 r-12 px-3 t-15 font-extrabold text-muted">
          <Icon name={icon} className="h-5.5 w-5.5" />
          {label}
        </div>
      ))}
      <div className="mt-auto px-2 pt-4 t-12 leading-snug text-muted">
        Signed in as <b className="text-secondary">{T.net.name}</b>
      </div>
    </div>
  );
}

/** The same matchup at desktop width: the sidebar, the scoreboard column, and both lineups with full box score lines. */
export function TpdlMatchupFull() {
  return (
    <Surface w={960} brand="tpdl" label={`TPDL matchup at desktop width. The scoreboard, the league median, the week by day and this week's other matchups sit on the left. Both lineups run side by side on the right with full box score lines.`} className={SCREEN}>
      <div className="flex">
        <SideNav />
        <div className="min-w-0 flex-1">
          <MatchupTopbar />
          <div className="px-3 pt-2.5">
            <div className="grid grid-cols-2 gap-0.75 r-12 border border-line bg-raised p-0.75">
              <span className="flex h-8 items-center justify-center r-9 t-12.5 font-extrabold tracking-[0.02em] text-accent" style={{ background: C.greenDim, boxShadow: `inset 0 0 0 ${px(1.5)} var(--accent)` }}>My matchup</span>
              <span className="flex h-8 items-center justify-center r-9 t-12.5 font-extrabold tracking-[0.02em] text-muted">League matchups</span>
            </div>
          </div>
          <div className="grid items-start" style={{ gridTemplateColumns: `${px(336)} minmax(0, 1fr)` }}>
            <div>
              <div className="px-3 pb-1 pt-2">
                <ScoreCard median desk />
              </div>
              <div className="px-3 pt-2">
                <DayStrip mine={LEFT.days} opp={RIGHT.days} />
              </div>
              <div className="flex flex-col gap-1.5 px-3 py-2.5">
                {OTHERS.map(([a, b], i) => (
                  <div key={a.name} className={cn("grid h-11.5 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 r-12 border px-2 t-12.5 font-extrabold leading-tight", i === 0 ? "border-accent" : "border-[#2f3d49] bg-card")} style={i === 0 ? { background: C.greenDim } : undefined}>
                    <span className="flex items-center gap-2">
                      <Avatar t={a} size={28} />
                      {a.name}
                    </span>
                    <span className="t-11 font-semibold text-muted">vs</span>
                    <span className="flex items-center justify-end gap-2 text-right">
                      {b.name}
                      <Avatar t={b} size={28} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pb-4 pl-1 pr-3 pt-2">
              <StartersHead />
              <Pairs count={5} desk />
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ─── team: the daily lineup ──────────────────────────────────────────────── */

type RosterRow = { slot: string; name: string; id: number; team: string; pos: string; proj: number; game: Game | null; line?: Box };

/** One roster row. tpdl: `PlayerLine` in src/components/PlayerLine.tsx: four fixed lines, then the points. */
function PlayerLine({ r }: { r: RosterRow }) {
  const g = r.game;
  const live = g?.state === "in";
  const showPts = !!g && g.state !== "pre";
  const t = g ? gameText(g) : null;
  const result = g?.state === "post" ? (g.us > g.them ? "W" : "L") : "";
  return (
    <div className={ROW}>
      <SlotChip slot={r.slot} />
      <Face id={r.id} />
      <div className="min-w-0 flex-1">
        <div className="h-4.5 whitespace-nowrap t-14 font-bold leading-[1.29]">{r.name}</div>
        <div className="mt-0.5 flex h-4.5 items-center gap-1.5 overflow-hidden whitespace-nowrap t-12 text-muted">
          <span>
            <span className="font-semibold text-secondary">{r.pos}</span> · {r.team}
          </span>
        </div>
        <div className={cn("mt-1 flex h-4.5 items-center gap-1 overflow-hidden whitespace-nowrap t-12", live ? "font-bold text-accent" : g?.state === "post" ? "text-muted" : g ? "text-secondary" : "text-[#6f7f8d]")}>
          {g?.state === "pre" ? <Tag bg={C.blueDim} fg={C.blue}>TODAY</Tag> : null}
          {!g ? <Tag bg={C.surface3} fg="var(--secondary)" className="border-[#2f3d49] opacity-60">NO GAME</Tag> : null}
          {t ? <span>{g?.state === "post" ? t.text.replace(/ · [WL]$/, "") : t.text}</span> : null}
          {result ? <span className={cn("font-extrabold", result === "W" ? "text-accent" : "text-[#ff5a6a]")}>{result}</span> : null}
          {t?.score ? <span className={cn(NUM, !live && "text-secondary")}>{t.score}</span> : null}
          {r.line?.dd ? <DD /> : null}
        </div>
        <div className="mt-1.5">
          <StatGrid l={r.line ?? null} muted={!r.line} />
        </div>
      </div>
      <div className="flex w-14 flex-none flex-col items-center">
        {showPts ? (
          <>
            <div className={cn(NUM, "t-24 leading-none", live && "text-accent")}>{fp(r.line?.fpts ?? 0)}</div>
            {live ? (
              <div className={cn(LABEL, "mt-0.5 flex items-center gap-1 t-10 text-[#ff5a6a]")}>
                <LiveDot size={5} />
                live
              </div>
            ) : (
              <div className={cn(LABEL, "mt-0.5 t-10")}>final</div>
            )}
          </>
        ) : (
          <>
            <div className={cn(NUM, "t-22 leading-none text-muted")}>{g ? fp(r.proj) : "–"}</div>
            <div className={cn(LABEL, "mt-0.5 t-10")}>{g ? "proj" : "idle"}</div>
          </>
        )}
      </div>
    </div>
  );
}

function SecHead({ title, count }: { title: string; count: string }) {
  return (
    <div className="mb-1.5 mt-3 flex items-center justify-between pb-1.5 pt-2">
      <div className={cn(DISPLAY, "t-18 leading-[1.4]")}>{title}</div>
      <div className={cn(LABEL, "t-10.5")}>{count}</div>
    </div>
  );
}

const asRow = (s: Starter): RosterRow => ({ slot: s.slot, name: s.name, id: s.id, team: s.team, pos: s.pos, proj: s.proj, game: s.game, line: s.line });

const IL_ROW: RosterRow = {
  slot: "IR", name: "Dejounte Murray", id: 3907497, team: "NOP", pos: "PG", proj: 0, game: null,
};
const TAXI_ROW: RosterRow = {
  slot: "TAXI", name: "Dylan Harper", id: 5037871, team: "SAS", pos: "PG/SG", proj: 24.8,
  game: { state: "in", opp: "@ HOU", ...SAS_HOU, us: 71, them: 66 }, line: box(14, 3, 6, 1, 2, 2, 2, 2, 3, 1, 0, 1, 1),
};

/** The daily lineup: starters by slot, then the injured list and the taxi squad, where nobody scores. */
export function TpdlTeam() {
  return (
    <Surface w={460} brand="tpdl" label={`TPDL team screen. Today's starters by lineup slot with live and final lines, ${fp(LEFT.today)} points so far, then the long-term injured list and the taxi squad.`} className={SCREEN}>
      <div className="px-3 pb-4 pt-2">
        <div className="mb-1.5 flex items-end justify-between pb-1.5 pt-2">
          <div>
            <div className={cn(DISPLAY, "t-22 leading-none")}>Starters</div>
            <div className={cn(LABEL, "mt-1 t-10")}>Wed Nov 11</div>
          </div>
          <div className="text-right">
            <div className={cn(NUM, "t-26 leading-none")}>{fp(LEFT.today)}</div>
            <div className={cn(LABEL, "t-10")}>proj {fp(LEFT.todayProj)}</div>
          </div>
        </div>
        <div className="mb-2 flex gap-2">
          <span className="flex h-8.5 flex-1 items-center justify-center gap-1.5 r-9 bg-accent t-13 font-extrabold tracking-[0.01em] text-[#061009]">
            <Icon name="bolt" className="h-4 w-4" fill />
            Auto-set lineup
          </span>
          <span className="flex h-8.5 w-30.5 flex-none items-center justify-between r-9 border border-[#2f3d49] bg-raised px-3 t-13 font-extrabold tracking-[0.01em]">
            Averages
            <Icon name="down" className="h-3.25 w-3.25" stroke={2.8} />
          </span>
        </div>
        <div className={CARD}>
          {MINE.slice(0, 2).map((s) => (
            <PlayerLine key={s.name} r={asRow(s)} />
          ))}
        </div>
        <SecHead title="Long-term injured list" count="1/1" />
        <div className={CARD}>
          <PlayerLine r={IL_ROW} />
        </div>
        <SecHead title="Taxi squad" count="1/1" />
        <div className={CARD}>
          <PlayerLine r={TAXI_ROW} />
        </div>
      </div>
    </Surface>
  );
}

/* ─── rookie lottery (tpdl: src/lib/draft.ts, src/app/(app)/draft) ────────── */

/** tpdl: `lotteryOdds`. The league's own weights win when they fit the pool; otherwise a preset or a linear ramp. */
function lotteryOdds(n: number, custom?: number[]): number[] {
  if (custom?.length === n && custom.every((x) => x >= 0)) return custom;
  const presets: Record<number, number[]> = { 6: [25, 21, 18, 15, 12, 9], 5: [28, 24, 20, 16, 12], 4: [30, 27, 23, 20], 3: [40, 33, 27], 8: [20, 17, 15, 13, 11, 10, 8, 6] };
  if (presets[n]) return presets[n];
  const base = Array.from({ length: n }, (_, i) => n - i);
  const sum = base.reduce((a, b) => a + b, 0);
  return base.map((b) => Math.round((b / sum) * 1000) / 10);
}

/* The league's defaults in tpdl's src/lib/settings.ts: six teams enter, four picks are drawn. */
const LOTTERY = { teams: 6, draws: 4, weights: [24, 24, 24, 18, 6, 4], rounds: 4 };
/* The final standings, best first. The bottom six are the pool, worst first. */
const FINAL: Team[] = [T.heat, T.net, T.dunk, T.brick, T.board, T.moon, T.tip, T.glass, T.fast, T.air];
const POOL = FINAL.slice(-LOTTERY.teams).reverse();
const POOL_ODDS = lotteryOdds(POOL.length, LOTTERY.weights);
/* One run of the draw: Tip Drill jumped from fourth, Board Men from sixth. */
const DRAWN: Team[] = [T.tip, T.air, T.glass, T.board];
/* `runLottery` order: the drawn picks, the rest of the pool worst first, then everyone else worst first. */
const ORDER: Team[] = [...DRAWN, ...POOL.filter((t) => !DRAWN.includes(t)), ...FINAL.slice(0, FINAL.length - LOTTERY.teams).reverse()];
/* Picks are revealed from the last one up. Three to ten are showing; hovering reveals the second. */
const REVEALED_FROM = 3;

function LotteryRow({ t, pick }: { t: Team; pick: number }) {
  const drawn = DRAWN.includes(t);
  const odds = POOL.includes(t) ? POOL_ODDS[POOL.indexOf(t)] : null;
  const shown = pick >= REVEALED_FROM;
  const next = pick === REVEALED_FROM - 1;
  const body = (
    <>
      <Avatar t={t} size={30} />
      <span className="flex-1 t-14.5 font-bold leading-[1.4]">{t.name}</span>
      {drawn ? <span className={cn(CHIP, "h-5 min-w-9 border-transparent px-1.75 t-11 text-accent")} style={{ background: C.greenDim }}>drawn</span> : null}
      {odds != null ? <span className={cn(NUM, "w-7 text-right t-12 text-muted")}>{odds}%</span> : null}
    </>
  );
  return (
    <div className={cn(ROW, "relative h-12.75", shown && drawn && "bg-[rgba(34,229,138,0.14)]", next && "transition-colors delay-150 duration-500 group-hover/tile:bg-[rgba(34,229,138,0.14)]")}>
      <span className={cn(NUM, "w-7 t-18 leading-[1.4]")}>{pick}</span>
      {shown ? (
        body
      ) : next ? (
        <span className="relative flex h-full flex-1 items-center">
          <span className="tracking-widest text-[#6f7f8d] transition-opacity duration-300 group-hover/tile:opacity-0">••••••••</span>
          <span className="absolute inset-0 flex translate-y-2 items-center gap-2.5 opacity-0 transition delay-150 duration-500 ease-out group-hover/tile:translate-y-0 group-hover/tile:opacity-100">{body}</span>
        </span>
      ) : (
        <span className="flex-1 tracking-widest text-[#6f7f8d]">••••••••</span>
      )}
    </div>
  );
}

/** The draft room on lottery night: the order is revealed from the last pick up. */
export function TpdlLottery() {
  return (
    <Surface w={450} brand="tpdl" label="TPDL draft room, lottery tab. The draft order is being revealed from the last pick up, with each lottery team's odds at the first pick. Picks three to ten are showing and the top two are still hidden." className="bg-[#05080b]">
      <PhoneTile>
          <div className="border-b border-line">
            <div className="flex items-center gap-3 px-4 py-2">
              <span className="flex h-10 w-10 flex-none items-center justify-center r-999 border border-[#2f3d49] bg-raised">
                <Icon name="back" className="h-4.5 w-4.5" stroke={2.6} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="whitespace-nowrap t-10.5 font-bold uppercase leading-[1.5] tracking-[0.06em] text-muted">2027 rookie draft · {LOTTERY.rounds} rounds · lottery done</div>
                <div className={cn(DISPLAY, "t-26 leading-none")}>Draft room</div>
              </div>
            </div>
            <div className="px-3 pb-2">
              <div className="grid grid-cols-3 gap-0.75 r-12 border border-line bg-raised p-0.75">
                {["Board", "Prospects", "Lottery"].map((k) => (
                  <span key={k} className={cn("flex h-9 items-center justify-center r-9 t-13 font-extrabold tracking-[0.02em]", k === "Lottery" ? "text-accent" : "text-muted")} style={k === "Lottery" ? { background: C.greenDim, boxShadow: `inset 0 0 0 ${px(1.5)} var(--accent)` } : undefined}>
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="px-3 pt-3">
            <div className="flex items-center justify-between">
              <div className={cn(LABEL, "t-10.5")}>Lottery results · May 3, 2027</div>
              <span className="flex h-8.5 items-center r-9 bg-accent px-3 t-13 font-extrabold tracking-[0.01em] text-[#061009]">Reveal next ▸</span>
            </div>
            {/* the six lottery picks; the rest of the round runs on below the tile */}
            <div className="mt-3 overflow-hidden border border-b-0 border-line bg-card" style={{ borderRadius: `${px(14)} ${px(14)} 0 0` }}>
              {ORDER.slice(0, LOTTERY.teams).map((t, i) => (
                <LotteryRow key={t.name} t={t} pick={i + 1} />
              ))}
            </div>
          </div>
      </PhoneTile>
    </Surface>
  );
}

/* ─── league: standings and trades ────────────────────────────────────────── */

/* Three weeks in. Every week is two results, the opponent and the league median, so each team has played six. */
const STANDINGS: { t: Team; w: number; l: number; pf: number }[] = [
  { t: T.dunk, w: 5, l: 1, pf: 4512.4 },
  { t: T.heat, w: 5, l: 1, pf: 4391.0 },
  { t: T.net, w: 4, l: 2, pf: 4446.7 },
  { t: T.board, w: 4, l: 2, pf: 4280.3 },
  { t: T.brick, w: 3, l: 3, pf: 4301.9 },
  { t: T.moon, w: 3, l: 3, pf: 4188.5 },
  { t: T.tip, w: 3, l: 3, pf: 4102.2 },
  { t: T.glass, w: 2, l: 4, pf: 4015.8 },
  { t: T.fast, w: 1, l: 5, pf: 3902.6 },
  { t: T.air, w: 0, l: 6, pf: 3744.1 },
];
const BYES = 2;
const PLAYOFF_TEAMS = 6;
const SEED_PRIZE = 200;
/* The tab strip scrolls sideways. On Trades it has scrolled to bring that tab into view. */
const LEAGUE_TABS = ["Standings", "Live", "Chat", "DM", "Transactions", "Trades", "Block", "Schedule", "Playoffs", "Records"];

function LeagueTop({ active }: { active: string }) {
  /* only the tabs that fit the strip whole */
  const from = LEAGUE_TABS.indexOf(active);
  const tabs = LEAGUE_TABS.slice(from, from + (active === "Standings" ? 5 : 4));
  return (
    <div className="border-b border-line">
      <div className="px-4 py-2">
        <div className={cn(LABEL, "t-10.5")}>The People’s Dynasty League</div>
        <div className={cn(DISPLAY, "t-26 leading-none")}>League</div>
      </div>
      <div className="flex gap-1.5 overflow-hidden px-3 pb-2 pt-1.5">
        {tabs.map((k) => {
          const badge = k === "Chat" ? 3 : k === "Trades" ? 1 : 0;
          return (
            <span key={k} className={cn("relative flex h-8.5 flex-none items-center r-999 border px-3.5 t-13 font-extrabold", k === active ? "border-transparent bg-accent text-[#0a0e12]" : "border-line text-muted")}>
              {k}
              {badge ? <span className={cn(NUM, "absolute -right-1 -top-1 h-4 min-w-4 r-999 bg-accent px-1 text-center t-10 leading-[1.6] text-[#0a0e12]", k === active && "shadow-[0_0_0_1px_#0a0e12]")}>{badge}</span> : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CutLine({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 border-t border-line bg-[#0f141a] px-3 py-1">
      <span className="h-px flex-1 opacity-55" style={{ background: color }} />
      <span className="t-10 font-bold uppercase leading-[1.4] tracking-[0.09em]" style={{ color }}>{label}</span>
      <span className="h-px flex-1 opacity-55" style={{ background: color }} />
    </div>
  );
}

/** tpdl: src/components/Prize.tsx over `tierStyle("gold")` in PickMark.tsx. */
function Prize({ amount }: { amount: number }) {
  return (
    <span className={cn(CHIP, "h-4.5 gap-0.5 border-transparent pl-1 pr-1.5 t-10 text-[#2A1D04]")} style={{ background: "linear-gradient(140deg, #FFF0B8 0%, #F5C451 42%, #A97B1F 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.25)" }}>
      <svg viewBox="0 0 24 24" className="h-2.75 w-2.75" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6l-1.5 3.5h-3Z" />
        <path d="M10.5 6.5C6 8.5 4 12.5 4 15.5 4 19 7 21 12 21s8-2 8-5.5c0-3-2-7-6.5-9" />
      </svg>
      ${amount}
    </span>
  );
}

/** `rows` shows the top of the table only and leaves the card open at the bottom, ending on the playoff line. */
function StandingsBody({ rows }: { rows?: number }) {
  const cols = { gridTemplateColumns: `${px(22)} 1fr ${px(46)} ${px(34)} ${px(62)}` } as CSSProperties;
  const list = rows ? STANDINGS.slice(0, rows) : STANDINGS;
  const best = Math.max(...STANDINGS.map((s) => s.w - s.l));
  return (
    <div className="px-3 pt-3">
      <div className="mb-2.5 flex items-center justify-between px-1">
        <span className={cn(LABEL, "t-10.5")}>Standings</span>
        <span className="flex h-7.5 w-7.5 items-center justify-center r-999 border border-line bg-raised text-secondary">
          <Icon name="info" className="h-4.25 w-4.25" stroke={2.4} />
        </span>
      </div>
      <div className={cn("overflow-hidden border border-line bg-card", rows ? "border-b-0" : "r-14")} style={rows ? { borderRadius: `${px(14)} ${px(14)} 0 0` } : undefined}>
        <div className="grid items-center border-b border-line bg-raised px-3 py-2 t-10 font-bold uppercase tracking-[0.09em] text-secondary" style={cols}>
          <span className="text-center">#</span>
          <span className="pl-2.5">Team</span>
          <span className="text-center">Record</span>
          <span className="text-center">GB</span>
          <span className="text-center">PF</span>
        </div>
        {list.map((s, i) => {
          const gb = (best - (s.w - s.l)) / 2;
          return (
            <div key={s.t.name}>
              {i === BYES ? <CutLine label="bye line" color="var(--accent)" /> : null}
              {i === PLAYOFF_TEAMS ? <CutLine label="playoff line" color={C.red} /> : null}
              <div className={cn("grid items-center px-3 py-2.5", i > 0 && "border-t border-line", s.t === T.net && "bg-[rgba(34,229,138,0.14)]")} style={cols}>
                <span className={cn(NUM, "text-center t-15 text-secondary")}>{i + 1}</span>
                <span className="flex min-w-0 items-center gap-2.5 pr-2">
                  <Avatar t={s.t} size={34} />
                  <span className="min-w-0 whitespace-nowrap t-14.5 font-bold leading-[1.15]">{s.t.name}</span>
                  {i === 0 ? <Prize amount={SEED_PRIZE} /> : null}
                </span>
                <span className={cn(NUM, "text-center t-16")}>{s.w}-{s.l}</span>
                <span className={cn(NUM, "text-center t-14 text-secondary")}>{gb > 0 ? (Number.isInteger(gb) ? gb : gb.toFixed(1)) : "–"}</span>
                <span className={cn(NUM, "whitespace-nowrap text-center t-15 text-secondary")}>{fp(s.pf)}</span>
              </div>
            </div>
          );
        })}
        {rows === PLAYOFF_TEAMS ? <CutLine label="playoff line" color={C.red} /> : null}
      </div>
    </div>
  );
}

/** League standings: seed, record, games back and points for, with the bye line and the playoff line drawn in. */
export function TpdlLeague() {
  return (
    <Surface w={450} brand="tpdl" label="TPDL league screen, standings tab. Ten teams by record with games back and points for. A bye line sits under the top two seeds and a playoff line under the sixth." className="bg-[#05080b]">
      <PhoneTile>
        <LeagueTop active="Standings" />
        <StandingsBody rows={PLAYOFF_TEAMS} />
      </PhoneTile>
    </Surface>
  );
}

/** tpdl: `.tabbar` and `.tab-ind` in src/app/globals.css, with the tabs from src/components/TabBar.tsx. */
function TabBar({ active }: { active: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-white/[0.07] bg-[#0d1217] px-3 pb-6 pt-1.5 shadow-[0_-12px_32px_rgba(0,0,0,0.35)]" style={{ height: px(82) }}>
      {SIDE_TABS.map(([icon, label]) => {
        const on = label === active;
        return (
          <span key={label} className={cn("relative flex flex-col items-center justify-center gap-0.75 t-10 font-extrabold uppercase leading-none tracking-[0.06em]", on ? "text-accent" : "text-muted")}>
            {on ? <span className="absolute inset-x-0 -inset-y-0.5 r-16 border border-[rgba(34,229,138,0.3)]" style={{ background: "linear-gradient(180deg, rgba(34,229,138,0.22), rgba(34,229,138,0.08))", boxShadow: `0 0 ${px(20)} rgba(34,229,138,0.18), inset 0 1px 0 rgba(255,255,255,0.08)` }} /> : null}
            <span className="relative">
              <Icon name={icon} className={label === "Matchup" ? "h-6.5 w-6.5" : "h-6 w-6"} />
              {label === "League" ? <span className={cn(NUM, "absolute -right-2.5 -top-1.5 h-4.25 min-w-4.25 r-999 bg-[#ff5a6a] px-1 text-center t-10.5 leading-[1.62] text-white")}>3</span> : null}
            </span>
            <span className="relative">{label}</span>
          </span>
        );
      })}
    </div>
  );
}

const BTN = "flex items-center justify-center gap-1.5 font-extrabold tracking-[0.01em]";
const BTN_SM = cn(BTN, "h-8.5 r-9 t-13");

type Trade = { from: Team; to: Team; status: "pending" | "accepted"; gives: string[]; gets: string[]; message?: string; at: string; respond?: boolean };

/* Pick labels read the way tpdl's src/lib/tradeRows.ts writes them. */
const TRADES: Trade[] = [
  {
    from: T.tip, to: T.net, status: "pending", respond: true, at: "Nov 11, 8:52 PM",
    gives: ["Jaren Jackson Jr.", "2027 R1 (Tip Drill) (top-3 protected)"],
    gets: ["Evan Mobley", "2027 R2 (Net Profit)"],
    message: "Mobley fits my window. The first is yours unless it lands top 3.",
  },
  { from: T.heat, to: T.fast, status: "accepted", at: "Nov 9, 4:15 PM", gives: ["2027 R2 (Heat Check)"], gets: ["Jrue Holiday"] },
];

function TradeCard({ t }: { t: Trade }) {
  const pending = t.status === "pending";
  return (
    <div className={cn(CARD, "p-3")}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap t-13">
          <Avatar t={t.from} size={24} />
          <span className="font-bold">{t.from.name}</span>
          <span className="text-muted">→</span>
          <Avatar t={t.to} size={24} />
          <span className="font-bold">{t.to.name}</span>
        </div>
        <span className="flex flex-none items-center gap-1">
          <span className={cn(CHIP, "h-5 border-transparent px-1.5 t-10")} style={pending ? { background: C.amberDim, color: C.amber } : { background: C.greenDim, color: "var(--accent)" }}>{t.status}</span>
          <Icon name="chevron" className="h-4 w-4 text-muted" stroke={2.6} />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 t-13 leading-[1.35]">
        {([[t.from, t.gives], [t.to, t.gets]] as [Team, string[]][]).map(([team, items]) => (
          <div key={team.name}>
            <div className={cn(LABEL, "mb-1 t-10 tracking-[0.06em]")}>{team.name} sends</div>
            {items.map((x) => {
              /* a protection stays whole when the label needs a second line */
              const [pick, prot] = x.split(" (top-");
              return (
                <div key={x} className="font-semibold">
                  <span className="whitespace-nowrap">{pick}</span>
                  {prot ? <span className="whitespace-nowrap"> (top-{prot}</span> : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {t.message ? <div className="mt-2 t-12 italic text-secondary">“{t.message}”</div> : null}
      <div className="mt-2 t-11 text-muted">{t.at}</div>
      {t.respond ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <span className={cn(BTN_SM, "bg-accent text-[#061009]")}><Icon name="check" className="h-4 w-4" stroke={2.8} />Accept</span>
          <span className={cn(BTN_SM, "border border-[#2f3d49] bg-raised")}><Icon name="swap" className="h-3.75 w-3.75" stroke={2.6} />Counter</span>
          <span className={cn(BTN_SM, "text-[#ff5a6a]")} style={{ background: C.redDim }}><Icon name="x" className="h-3.75 w-3.75" stroke={2.8} />Decline</span>
        </div>
      ) : null}
    </div>
  );
}

function TradesBody() {
  const offers = TRADES.filter((t) => t.status !== "accepted");
  const done = TRADES.filter((t) => t.status === "accepted");
  return (
    <div className="px-3 pt-3">
      <div className="mb-3 grid grid-cols-[2fr_1fr] gap-2">
        <span className={cn(BTN, "h-11 r-12 bg-accent t-15 text-[#061009]")}><Icon name="swap" className="h-4 w-4" stroke={2.6} />Propose Trade</span>
        <span className={cn(BTN, "h-11 whitespace-nowrap r-12 border border-[#2f3d49] bg-raised t-13")}><Icon name="users3" className="h-4 w-4" stroke={2.3} />Multi-Team</span>
      </div>
      <div className={cn(CARD, ROW, "mb-4")}>
        <span className="flex h-9 w-9 flex-none items-center justify-center r-999" style={{ background: C.amberDim, color: C.amber }}>
          <Icon name="star" className="h-4.25 w-4.25" stroke={2.4} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block t-14.5 font-bold leading-[1.4]">Trade block</span>
          <span className="block whitespace-nowrap t-12 text-muted">4 listed: players and picks up for offers</span>
        </span>
        <Icon name="chevron" className="h-4 w-4" stroke={2.6} />
      </div>
      {([["Your offers", offers], ["Completed trades", done]] as [string, Trade[]][]).map(([title, list]) => (
        <div key={title} className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <div className={cn(DISPLAY, "t-18 leading-[1.4]")}>{title}</div>
            <div className={cn(LABEL, "t-10.5")}>{list.length}</div>
          </div>
          <div className="flex flex-col gap-2">
            {list.map((t) => (
              <TradeCard key={t.at} t={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Two whole phones: the standings, and the trades tab with an offer waiting on an answer. */
export function TpdlLeagueFull() {
  return (
    <Surface w={948} brand="tpdl" label="Two TPDL league screens side by side. On the left, the standings with the bye line and the playoff line. On the right, the trades tab: an offer of a player and a protected first round pick waiting on an answer, above the league's completed trades." className="bg-[#05080b]">
      <div className="flex justify-center gap-12 px-11 py-11">
        {(["Standings", "Trades"] as const).map((tab) => (
          <div key={tab} className="flex-none">
            <TPhone h={800}>
              <LeagueTop active={tab} />
              {tab === "Standings" ? <StandingsBody /> : <TradesBody />}
              <TabBar active="League" />
            </TPhone>
          </div>
        ))}
      </div>
    </Surface>
  );
}

/* ─── player page: fantasy points and the game log ────────────────────────── */

type LogGame = { day: string; opp: string; us: number; them: number; line: Box };

const LOG: LogGame[] = [
  { day: "Mon Dec 7", opp: "vs DAL", us: 124, them: 109, line: box(34, 10, 19, 2, 5, 8, 9, 5, 6, 1, 1, 2, 2) },
  { day: "Sat Dec 5", opp: "@ MEM", us: 118, them: 112, line: box(36, 10, 21, 1, 4, 8, 8, 4, 6, 1, 1, 3, 3) },
  { day: "Thu Dec 3", opp: "vs LAL", us: 108, them: 114, line: box(37, 9, 22, 2, 7, 7, 9, 6, 5, 1, 0, 4, 2) },
  { day: "Tue Dec 1", opp: "@ POR", us: 131, them: 104, line: box(29, 9, 15, 2, 4, 5, 5, 3, 10, 1, 0, 2, 1) },
  { day: "Sun Nov 29", opp: "vs HOU", us: 115, them: 110, line: box(35, 8, 19, 1, 5, 8, 9, 5, 5, 1, 1, 3, 2) },
];
const GAMES_PLAYED = 21;
/* The last five is the mean of the five games in the log, as the page computes it. */
const WINDOWS: [string, number][] = [
  ["Season", 55.2],
  ["Last 30d", 56.9],
  ["Last 5g", LOG.reduce((a, g) => a + g.line.fpts, 0) / LOG.length],
  ["ROS proj.", 54.6],
  ["25-26", 52.9],
];

/** A player's page: where he ranks, his fantasy points per game over five windows, and the game log. */
export function TpdlPlayer() {
  return (
    <Surface w={420} brand="tpdl" label="TPDL player page for Shai Gilgeous-Alexander. His season rank, fantasy points per game across the season, the last 30 days and the last five games, then the game log with each box score line and its fantasy points." className={SCREEN}>
      <div className="pb-4">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <span className="flex h-10 w-10 flex-none items-center justify-center r-999 border border-[#2f3d49] bg-raised">
            <Icon name="back" className="h-4.5 w-4.5" stroke={2.6} />
          </span>
          <div className="min-w-0 flex-1">
            <div className={cn(LABEL, "t-10.5")}>PG · OKC</div>
            <div className={cn(DISPLAY, "t-22 leading-none")}>Shai Gilgeous-Alexander</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-3 pt-3">
          <div className={cn(CARD, "overflow-hidden")}>
            <div className={cn(LABEL, "flex justify-between border-b border-line px-3 py-2 t-10.5")}>
              <span>Fantasy points</span>
              <span>{GAMES_PLAYED} games played</span>
            </div>
            <div className="grid grid-cols-2 border-b border-line">
              {[["#2", "Season total rank"], ["#2", "Per-game rank"]].map(([v, l], i) => (
                <div key={l} className={cn("px-3 py-2.5 text-center", i === 0 && "border-r border-line")}>
                  <div className={cn(NUM, "t-24 leading-none text-accent")}>{v}</div>
                  <div className={cn(LABEL, "mt-1 t-10")}>{l}</div>
                </div>
              ))}
            </div>
            <div className={cn(LABEL, "px-3 pt-2.5 t-10")}>Per game</div>
            <div className="grid grid-cols-5 px-2 pb-2.5 pt-1.5 text-center">
              {WINDOWS.map(([l, v], i) => (
                <div key={l}>
                  <div className={cn(NUM, "leading-none", i === 0 ? "t-24" : "t-20 text-secondary")}>{v.toFixed(1)}</div>
                  <div className={cn(LABEL, "mt-1 t-10 tracking-[0.05em]")}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={cn(CARD, "overflow-hidden")}>
            <div className={cn(LABEL, "border-b border-line px-3 py-2 t-10.5")}>Game log</div>
            {LOG.slice(0, 3).map((g) => {
              const won = g.us > g.them;
              const l = g.line;
              return (
                <div key={g.day} className={cn(ROW, "gap-3")}>
                  <div className="w-19.5 flex-none">
                    <div className="t-12.5 font-bold leading-[1.4]">{g.day}</div>
                    <div className="mt-0.5 t-11 leading-[1.4] text-muted">{g.opp}</div>
                    <div className={cn(NUM, "mt-0.5 whitespace-nowrap t-11 leading-[1.4]", won ? "text-accent" : "text-[#ff5a6a]")}>
                      {won ? "W" : "L"} {g.us}-{g.them}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <StatGrid l={l} />
                    <div className="mt-2 grid grid-cols-3 border-t border-line">
                      {([["FG", l.fgm, l.fga], ["3PT", l.tpm, l.tpa], ["FT", l.ftm, l.fta]] as [string, number, number][]).map(([k, m, a], i) => (
                        <div key={k} className={cn("pt-1.5 text-center", i > 0 && "border-l border-line")}>
                          <div className={cn(NUM, "t-13 leading-none")}>{m}/{a}</div>
                          <div className={cn(LABEL, "mt-1 whitespace-nowrap t-10 tracking-[0.05em]")}>
                            {k} · <span style={{ color: shootColor(k, m, a) }}>{shootPct(m, a)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex w-11 flex-none flex-col items-center gap-1">
                    <div className={cn(NUM, "t-20 leading-none")}>{l.fpts.toFixed(1)}</div>
                    {l.dd ? <DD /> : null}
                  </div>
                </div>
              );
            })}
            {/* tpdl: `MoreToggle` in src/components/MoreList.tsx */}
            <div className="flex h-10 items-center justify-center gap-1.5 border-t border-line t-12.5 font-bold text-secondary">
              Show all games ({GAMES_PLAYED})
              <Icon name="down" className="h-3.5 w-3.5" stroke={2.6} />
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ─── the mark (tpdl: src/lib/ogCard.tsx, the card it sends when a link is shared) ── */

export function TpdlMark() {
  return (
    <Surface w={400} brand="tpdl" label="The TPDL app icon over its name, The People's Dynasty League." className="bg-ground">
      <div className="flex flex-col px-9 pb-9 pt-10" style={{ backgroundImage: "radial-gradient(circle at 26% 24%, rgba(34,229,138,0.18) 0%, rgba(34,229,138,0.05) 30%, rgba(10,14,18,0) 56%)" }}>
        <Image src="/brand/tpdl/icon.png" alt="" width={512} height={512} className="h-29 w-29 r-26" />
        <p className="mt-8 font-display t-46 font-extrabold leading-[0.95] text-ink">The People’s Dynasty League</p>
        <p className="mt-3.5 t-14 font-medium text-muted">10 teams · NBA dynasty · head-to-head points</p>
        <div className="mt-7 flex items-center gap-3.5">
          <span className="h-1.5 w-17 r-999 bg-accent" />
          <span className="t-12 font-medium text-muted">live scoring, trades, rookie draft</span>
        </div>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "tpdl-matchup",
    title: "Matchup",
    caption:
      "The live head to head: both totals, each side's projected final and the chance of winning, with starters paired by lineup slot. Scores come from ESPN box scores every 20 seconds, and the win chance is a Student-t on the gap between the two projections.",
    tile: TpdlMatchup,
    full: TpdlMatchupFull,
  },
  {
    id: "tpdl-team",
    title: "Daily lineup",
    caption:
      "Lineups are set by the day. Each row is one roster spot with the player's game and box score line, and one tap fills every slot with the highest projected players who have a game. Injured list and taxi squad players stay on the roster but do not score.",
    tile: TpdlTeam,
  },
  {
    id: "tpdl-lottery",
    title: "Rookie lottery",
    caption:
      "The six teams that finish lowest enter a weighted draw for the top four picks, and the rest of the round follows the standings in reverse. The order is revealed from the last pick up, with each lottery team's odds at the first pick beside its name.",
    tile: TpdlLottery,
  },
  {
    id: "tpdl-league",
    title: "Standings",
    caption:
      "Every week counts twice, once against the opponent and once against the league median score. The top six make the playoffs and the top two seeds skip the first round. Trades can carry players, picks, pick protections and swap rights.",
    tile: TpdlLeague,
    full: TpdlLeagueFull,
  },
  {
    id: "tpdl-player",
    title: "Player page",
    caption:
      "Where a player ranks in the league's scoring, his fantasy points per game over the season, the last 30 days and the last five games, and every game with its box score line. The rest-of-season figure blends ESPN's projection with what he has done so far.",
    tile: TpdlPlayer,
  },
  {
    id: "tpdl-mark",
    title: "TPDL",
    caption: "The app icon and the league's name, set the way the app's own link card sets them.",
    tile: TpdlMark,
  },
];
