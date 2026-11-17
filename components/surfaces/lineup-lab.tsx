import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Headshot, Surface } from "./kit";
import type { SurfaceDef } from "./types";

/*
  Lineup Lab, rebuilt from fantasy-lineup-lab's own components.

  Colours come from its `src/index.css`: navy ground, three panel steps, teal,
  the up and down colours and the six position colours. Type is Poppins.
  Layout, wording and sizes follow `src/components` file for file: Impact.tsx
  (impact cards, verdict, week bars), TeamPanel.tsx and PlayerRow.tsx (lineups),
  TradeBar.tsx (the trade), PlayerSheet.tsx (the projection breakdown).

  The players and their headshots are real, the fantasy teams are invented and every figure is a
  sample. Lineup totals are summed from the starters below, the deltas are the
  difference of those sums, and the chart is drawn from the same weekly numbers.
*/

/* src/index.css: tokens the shared brand scope does not carry. */
const UP = "#1ee3a0";
const DOWN = "#ff4f6d";
const FAINT = "#5d6579";
const POS_COLOR: Record<string, string> = {
  QB: "#ff2a6d",
  RB: "#00ceb8",
  WR: "#58a7ff",
  TE: "#ffae58",
  K: "#bd66ff",
  DEF: "#d89a6a",
};
/* Impact.tsx: the two series colours of the week chart. */
const YOU = "#14a896";
const THEM = "#d95926";

/** A hairline ring, as the product's `ring-1 ring-line`. */
const RING = "shadow-[0_0_0_1px_var(--line)]";
/** The small uppercase heading the product puts over every block. */
const EYEBROW = "font-semibold uppercase tracking-wider text-muted";

/* ── sample league ─────────────────────────────────────────────────────── */

const ME = "Turf Monsters";
const PARTNER = "Sunday Scaries";
const WEEKS = [12, 13, 14] as const;
const WEEK = 12;

type Player = {
  name: string;
  short: string;
  pos: keyof typeof POS_COLOR;
  team: string;
  opp: string;
  /** Lineup Lab projection for the week on screen. */
  pts: number;
  /** Sleeper's projection for the same week. */
  slp: number;
  /** ESPN athlete id, for the headshot. Team defenses have none. */
  espn?: number;
};

const P = {
  hurts: { name: "Jalen Hurts", short: "J. Hurts", pos: "QB", team: "PHI", opp: "vs NYG", pts: 21.38, slp: 20.64, espn: 4040715 },
  bijan: { name: "Bijan Robinson", short: "B. Robinson", pos: "RB", team: "ATL", opp: "@ NO", pts: 19.82, slp: 20.31, espn: 4430807 },
  hubbard: { name: "Chuba Hubbard", short: "C. Hubbard", pos: "RB", team: "CAR", opp: "@ TB", pts: 11.17, slp: 11.6, espn: 4241416 },
  achane: { name: "De'Von Achane", short: "D. Achane", pos: "RB", team: "MIA", opp: "vs BUF", pts: 18.93, slp: 18.2, espn: 4429160 },
  stbrown: { name: "Amon-Ra St. Brown", short: "A. St. Brown", pos: "WR", team: "DET", opp: "vs CHI", pts: 18.64, slp: 17.92, espn: 4374302 },
  wilson: { name: "Garrett Wilson", short: "G. Wilson", pos: "WR", team: "NYJ", opp: "@ NE", pts: 14.86, slp: 14.12, espn: 4569618 },
  addison: { name: "Jordan Addison", short: "J. Addison", pos: "WR", team: "MIN", opp: "@ GB", pts: 11.58, slp: 11.95, espn: 4429205 },
  mcbride: { name: "Trey McBride", short: "T. McBride", pos: "TE", team: "ARI", opp: "vs SEA", pts: 14.27, slp: 14.73, espn: 4361307 },
  smith: { name: "DeVonta Smith", short: "D. Smith", pos: "WR", team: "PHI", opp: "vs NYG", pts: 12.74, slp: 12.21, espn: 4241478 },
  aubrey: { name: "Brandon Aubrey", short: "B. Aubrey", pos: "K", team: "DAL", opp: "@ WAS", pts: 9.41, slp: 9.1, espn: 3953687 },
  den: { name: "Denver Broncos", short: "Denver Broncos", pos: "DEF", team: "DEN", opp: "vs LV", pts: 8.12, slp: 7.6 },
  spears: { name: "Tyjae Spears", short: "T. Spears", pos: "RB", team: "TEN", opp: "@ JAX", pts: 7.84, slp: 7.61, espn: 4428557 },

  mayfield: { name: "Baker Mayfield", short: "B. Mayfield", pos: "QB", team: "TB", opp: "vs CAR", pts: 19.56, slp: 18.88, espn: 3052587 },
  cook: { name: "James Cook", short: "J. Cook", pos: "RB", team: "BUF", opp: "@ MIA", pts: 16.42, slp: 16.05, espn: 4379399 },
  collins: { name: "Nico Collins", short: "N. Collins", pos: "WR", team: "HOU", opp: "vs IND", pts: 16.81, slp: 17.2, espn: 4258173 },
  jeudy: { name: "Jerry Jeudy", short: "J. Jeudy", pos: "WR", team: "CLE", opp: "vs BAL", pts: 9.24, slp: 9.61, espn: 4241463 },
  laporta: { name: "Sam LaPorta", short: "S. LaPorta", pos: "TE", team: "DET", opp: "vs CHI", pts: 11.18, slp: 10.74, espn: 4430027 },
  pollard: { name: "Tony Pollard", short: "T. Pollard", pos: "RB", team: "TEN", opp: "@ JAX", pts: 8.63, slp: 9.02, espn: 3916148 },
  dicker: { name: "Cameron Dicker", short: "C. Dicker", pos: "K", team: "LAC", opp: "vs KC", pts: 8.84, slp: 8.5, espn: 4362081 },
  pit: { name: "Pittsburgh Steelers", short: "Pittsburgh Steelers", pos: "DEF", team: "PIT", opp: "@ CIN", pts: 7.56, slp: 7.9 },
  coker: { name: "Jalen Coker", short: "J. Coker", pos: "WR", team: "CAR", opp: "@ TB", pts: 5.92, slp: 6.2, espn: 4695883 },
} satisfies Record<string, Player>;

type Id = keyof typeof P;
type Tag = "acquired" | "elevated" | "autodrop" | "autoadd";
type Slot = { slot: string; id: Id; tag?: Tag; replaces?: Id };

/* The trade: you send Wilson and Hubbard, you receive Achane. */
const SEND: Id[] = ["wilson", "hubbard"];
const RECEIVE: Id[] = ["achane"];

const ME_BEFORE: Id[] = ["hurts", "bijan", "hubbard", "stbrown", "wilson", "mcbride", "smith", "aubrey", "den"];
const ME_AFTER: Slot[] = [
  { slot: "QB", id: "hurts" },
  { slot: "RB", id: "bijan" },
  { slot: "RB", id: "achane", tag: "acquired", replaces: "hubbard" },
  { slot: "WR", id: "stbrown" },
  { slot: "WR", id: "addison", tag: "elevated", replaces: "wilson" },
  { slot: "TE", id: "mcbride" },
  { slot: "FLEX", id: "smith" },
  { slot: "K", id: "aubrey" },
  { slot: "DEF", id: "den" },
];

const PARTNER_BEFORE: Id[] = ["mayfield", "achane", "cook", "collins", "jeudy", "laporta", "pollard", "dicker", "pit"];
/* TeamPanel.tsx pairs each new starter with a starter who lost his spot: Hubbard takes
   Achane's, and Wilson's arrival is what sends Pollard to the bench. */
const PARTNER_AFTER: Slot[] = [
  { slot: "QB", id: "mayfield" },
  { slot: "RB", id: "cook" },
  { slot: "RB", id: "hubbard", tag: "acquired", replaces: "achane" },
  { slot: "WR", id: "collins" },
  { slot: "WR", id: "wilson", tag: "acquired", replaces: "pollard" },
  { slot: "TE", id: "laporta" },
  { slot: "FLEX", id: "jeudy" },
  { slot: "K", id: "dicker" },
  { slot: "DEF", id: "pit" },
];

const sum = (ids: Id[]) => ids.reduce((s, id) => s + P[id].pts, 0);

type WeekTotals = { week: number; before: number; after: number };
type Side = { label: string; name: string; weeks: WeekTotals[]; moves: string };

/* Week 12 is summed from the lineups above. Weeks 13 and 14 are sample totals. */
const MINE: Side = {
  label: "You",
  name: ME,
  moves: "1 added",
  weeks: [
    { week: 12, before: sum(ME_BEFORE), after: sum(ME_AFTER.map((s) => s.id)) },
    { week: 13, before: 127.34, after: 129.5 },
    { week: 14, before: 132.08, after: 138.41 },
  ],
};
const THEIRS: Side = {
  label: "Trade partner",
  name: PARTNER,
  moves: "1 dropped",
  weeks: [
    { week: 12, before: sum(PARTNER_BEFORE), after: sum(PARTNER_AFTER.map((s) => s.id)) },
    { week: 13, before: 108.92, after: 116.85 },
    { week: 14, before: 119.44, after: 122.05 },
  ],
};

const total = (side: Side, key: "before" | "after") => side.weeks.reduce((s, w) => s + w[key], 0);
const delta = (side: Side) => total(side, "after") - total(side, "before");

/* ── ui.tsx ────────────────────────────────────────────────────────────── */

const fmt = (n: number) => n.toFixed(2);
const fmt1 = (n: number) => n.toFixed(1);
const signed = (n: number, digits = 2) => `${n > 0.004 ? "+" : n < -0.004 ? "−" : "±"}${Math.abs(n).toFixed(digits)}`;

/* Weekly projection tiers per position: strong, solid, thin. */
const TIERS: Record<string, [number, number, number]> = {
  QB: [22, 16, 12],
  RB: [16, 10.5, 7],
  WR: [16, 10.5, 7],
  TE: [12.5, 8, 5.5],
  K: [10, 8, 6],
  DEF: [10, 7, 5],
};

function tierColor(pos: string, pts: number) {
  const t = TIERS[pos];
  if (pts >= t[0]) return UP;
  if (pts >= t[1]) return "var(--ink)";
  if (pts >= t[2]) return "color-mix(in srgb, var(--ink) 72%, var(--ground))";
  return POS_COLOR.TE;
}

function Delta({ value, digits = 2, className }: { value: number; digits?: number; className?: string }) {
  return (
    <span className={cn("tnum font-semibold", className)} style={{ color: value > 0.004 ? UP : value < -0.004 ? DOWN : "var(--muted)" }}>
      {signed(value, digits)}
    </span>
  );
}

const FLEX = ["RB", "WR", "TE"];

/** The slot pill: a tint of the position colour, or a three-way split for the flex. */
function SlotBadge({ slot, phone }: { slot: string; phone?: boolean }) {
  const bench = slot === "BN";
  const background = bench
    ? "#272d3f"
    : slot === "FLEX"
      ? `linear-gradient(135deg, ${FLEX.map(
          (p, i) => `color-mix(in srgb, ${POS_COLOR[p]} 32%, transparent) ${(i / 3) * 100}% ${((i + 1) / 3) * 100}%`,
        ).join(", ")})`
      : `color-mix(in srgb, ${POS_COLOR[slot]} 20%, transparent)`;
  return (
    <span
      className={cn("inline-flex h-7 shrink-0 items-center justify-center r-6 font-semibold tracking-wide", phone ? "w-9 t-10" : "w-11 t-11")}
      style={{ background, color: bench ? "var(--muted)" : slot === "FLEX" ? "var(--ink)" : POS_COLOR[slot] }}
    >
      {slot}
    </span>
  );
}

/**
 * The player's circle, ringed in his position colour as `PlayerAvatar` draws it.
 * A team defense has no headshot, so it shows the team's abbreviation.
 */
function PlayerAvatar({ id, size }: { id: Id; size: "sm" | "md" | "lg" }) {
  const p: Player = P[id];
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden r-999 bg-[#272d3f] font-semibold text-muted",
        size === "sm" && "h-6 w-6",
        size === "md" && "h-9 w-9 t-10",
        size === "lg" && "h-13 w-13",
      )}
    >
      {p.espn ? <Headshot league="nfl" id={p.espn} className="h-full w-full bg-[#272d3f] [&>img]:origin-top [&>img]:scale-[1.15]" /> : p.team}
      <span
        className="absolute inset-0 r-999"
        style={{ boxShadow: `inset 0 0 0 calc(var(--px) * 1.5) color-mix(in srgb, ${POS_COLOR[p.pos]} 55%, transparent)` }}
      />
    </span>
  );
}

function TeamAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center r-999 bg-[#272d3f] font-semibold text-muted", className)}>
      {name.slice(0, 1)}
    </span>
  );
}

function PosText({ pos }: { pos: string }) {
  return (
    <span className="font-semibold" style={{ color: POS_COLOR[pos] }}>
      {pos}
    </span>
  );
}

/* LogoMark.tsx: the flask, its liquid drawn as three lineup rows. */
function LogoMark({ className }: { className?: string }) {
  const g = useId();
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00ceb8" />
          <stop offset="1" stopColor="#3f8cff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${g})`} />
      <path d="M24.5 11.5h15" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
      <path
        d="M27.5 12v13.2L15.6 45.4a5 5 0 0 0 4.3 7.6h24.2a5 5 0 0 0 4.3-7.6L36.5 25.2V12"
        fill="none"
        stroke="#fff"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <rect x="21.5" y="34.2" width="21" height="4" rx="2" fill="#fff" />
      <rect x="19.2" y="40.6" width="25.6" height="4" rx="2" fill="#fff" fillOpacity=".8" />
      <rect x="18.6" y="47" width="26.8" height="2.6" rx="1.3" fill="#fff" fillOpacity=".55" />
    </svg>
  );
}

const TradeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 5h11M10 2l3 3-3 3M14 11H3M6 8l-3 3 3 3" />
  </svg>
);

/* ── Impact.tsx ────────────────────────────────────────────────────────── */

function Verdict() {
  const me = delta(MINE);
  const partner = delta(THEIRS);
  const text =
    me > 0.05 && partner > 0.05
      ? "Win-win on projections"
      : me > 0.05
        ? "Helps you, hurts them"
        : partner > 0.05
          ? "Helps them more than you"
          : me < -0.05 && partner < -0.05
            ? "Hurts both lineups"
            : "Roughly neutral";
  const color = me > 0.05 ? UP : me < -0.05 ? DOWN : "var(--muted)";
  return (
    <span
      className="r-999 px-3 py-1 t-12 font-semibold"
      style={{ color, background: me > 0.05 || me < -0.05 ? `color-mix(in srgb, ${color} 15%, transparent)` : "#272d3f" }}
    >
      {text}
    </span>
  );
}

function ImpactCard({ side }: { side: Side }) {
  const d = delta(side);
  return (
    <div className="flex items-center gap-3 r-12 bg-raised px-4 py-3">
      <TeamAvatar name={side.name} className="h-9 w-9 t-14" />
      <div className="min-w-0 flex-1">
        <div className={cn(EYEBROW, "t-11")}>{side.label}</div>
        <div className="t-14 font-medium leading-snug">{side.name}</div>
      </div>
      <div className="text-right">
        <div className="tnum t-12 text-muted">
          {fmt1(total(side, "before"))} → <span className="text-ink">{fmt1(total(side, "after"))}</span>
        </div>
        <Delta value={d} digits={1} className="block t-22 leading-tight" />
        <div className="tnum t-11 text-[#5d6579]">{signed(d / side.weeks.length, 1)} / wk</div>
      </div>
    </div>
  );
}

/** A round step that splits `span` into about four gridlines. */
function niceStep(span: number) {
  const raw = span / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  return ([1, 2, 2.5, 5, 10].find((m) => m * mag >= raw) ?? 10) * mag;
}

/** A bar from the zero line to its value, rounded only at its data end. */
function barPath(x: number, w: number, y0: number, y1: number) {
  const h = Math.abs(y1 - y0);
  const r = Math.min(3, w / 2, h);
  if (h < 0.5) return "";
  if (y1 < y0) return `M${x},${y0}V${y1 + r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 + r}V${y0}Z`;
  return `M${x},${y0}V${y1 - r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 - r}V${y0}Z`;
}

const ROWS = MINE.weeks.map((w, i) => ({
  week: w.week,
  you: w.after - w.before,
  them: THEIRS.weeks[i].after - THEIRS.weeks[i].before,
}));

/** The by-week chart, with the geometry of `WeekBars`. `width` is the plot's design width. */
function WeekBars({ width, phone }: { width: number; phone?: boolean }) {
  const values = ROWS.flatMap((r) => [r.you, r.them]);
  const lo0 = Math.min(0, ...values);
  const hi0 = Math.max(0, ...values);
  const step = niceStep(Math.max(hi0 - lo0, 2));
  const lo = Math.floor(lo0 / step) * step;
  const hi = Math.ceil(hi0 / step) * step || step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);

  const GUTTER = 34;
  const TOP = 8;
  const PLOT_H = 150;
  const LABELS = 22;
  const H = TOP + PLOT_H + LABELS;
  const colW = (width - GUTTER) / ROWS.length;
  const barW = Math.max(3, Math.min(16, (colW - 10) / 2));
  const y = (v: number) => TOP + ((hi - v) / (hi - lo)) * PLOT_H;
  const zero = y(0);
  const band = Math.min(colW - 4, barW * 2 + 28);
  const selected = ROWS.find((r) => r.week === WEEK) ?? ROWS[0];

  return (
    <div className="mt-5">
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 t-11.5">
        <span className={cn("text-muted", phone && "w-full")}>Change in projected starting lineup, by week</span>
        <span className={cn("flex items-center gap-1.5", !phone && "ml-auto")}>
          <i className="inline-block h-2.5 w-2.5 r-3" style={{ background: YOU }} /> You
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 r-3" style={{ background: THEM }} /> {PARTNER}
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${H}`} className="block w-full overflow-visible">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={GUTTER} x2={width} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={t === 0 ? 1.5 : 1} strokeDasharray={t === 0 ? undefined : "2 4"} />
            <text x={GUTTER - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize="10" fill={FAINT} style={{ fontVariantNumeric: "tabular-nums" }}>
              {t > 0 ? `+${t}` : t === 0 ? "0" : `−${Math.abs(t)}`}
            </text>
          </g>
        ))}
        {ROWS.map((r, i) => {
          const cx = GUTTER + i * colW + colW / 2;
          const on = r.week === WEEK;
          return (
            <g key={r.week}>
              {on && <rect x={cx - band / 2} y={TOP - 4} width={band} height={PLOT_H + LABELS + 2} rx={8} fill="rgb(255 255 255 / 0.06)" />}
              <path d={barPath(cx - barW - 1, barW, zero, y(r.you))} fill={YOU} />
              <path d={barPath(cx + 1, barW, zero, y(r.them))} fill={THEM} />
              <text x={cx} y={TOP + PLOT_H + 15} textAnchor="middle" fontSize="10.5" fontWeight={on ? 700 : 500} fill={on ? "var(--ink)" : "var(--muted)"}>
                W{r.week}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 t-11.5 text-muted">
        <span className="font-semibold text-ink">Week {WEEK}</span>
        <span className="tnum">You {signed(selected.you, 1)}</span>
        <span className="tnum">
          {PARTNER} {signed(selected.them, 1)}
        </span>
        <span className={cn("text-[#5d6579]", phone && "w-full")}>Tap a week to see its lineups below.</span>
      </div>
    </div>
  );
}

function Impact({ width, phone }: { width: number; phone?: boolean }) {
  return (
    <div className={cn("r-16 bg-card p-4", RING)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className={cn(EYEBROW, "t-13")}>
          Projected impact · Weeks {WEEKS[0]}–{WEEKS[WEEKS.length - 1]}
        </h4>
        <Verdict />
      </div>
      <div className={cn("grid gap-3", !phone && "grid-cols-2")}>
        <ImpactCard side={MINE} />
        <ImpactCard side={THEIRS} />
      </div>
      <WeekBars width={width} phone={phone} />
    </div>
  );
}

/* ── PlayerRow.tsx and TeamPanel.tsx ───────────────────────────────────── */

const TAG: Record<Tag, { label: string; color: string }> = {
  acquired: { label: "NEW", color: "#00ceb8" },
  elevated: { label: "▲ START", color: UP },
  autodrop: { label: "AUTO-DROP", color: DOWN },
  autoadd: { label: "AUTO-ADD", color: POS_COLOR.WR },
};

function Grip() {
  return (
    <span className="flex w-3 shrink-0 justify-center text-[#5d6579]">
      <svg viewBox="0 0 8 14" fill="currentColor" className="h-3.5 w-2">
        <circle cx="2" cy="2" r="1.3" />
        <circle cx="6" cy="2" r="1.3" />
        <circle cx="2" cy="7" r="1.3" />
        <circle cx="6" cy="7" r="1.3" />
        <circle cx="2" cy="12" r="1.3" />
        <circle cx="6" cy="12" r="1.3" />
      </svg>
    </span>
  );
}

type RowAction = "trade" | "more" | "keep";

/**
 * One roster row. `phone` is the layout the product uses under 640 pixels: a
 * narrower slot pill, the three-dot button, and Sleeper's number without its label.
 */
function PlayerRow({
  id,
  slot,
  tag,
  replaces,
  phone,
  action,
  dimmed,
  fixed,
  last,
}: Slot & { phone?: boolean; action: RowAction; dimmed?: boolean; fixed?: boolean; last?: boolean }) {
  const p = P[id];
  const diff = p.pts - p.slp;
  const old = replaces ? P[replaces] : null;
  return (
    <div
      className={cn("flex items-center py-2 pr-3", fixed ? "pl-3" : "pl-1.5", phone ? "gap-2" : "gap-3", !last && "border-b border-line/60", dimmed && "opacity-45")}
    >
      {!fixed && <Grip />}
      <SlotBadge slot={slot} phone={phone} />
      <PlayerAvatar id={id} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap t-14 font-medium">{p.name}</span>
          {tag && (
            <span
              className="shrink-0 whitespace-nowrap r-4 px-1.5 py-0.5 t-10 font-bold leading-[1.4] tracking-wider"
              style={{ color: TAG[tag].color, background: `color-mix(in srgb, ${TAG[tag].color} 15%, transparent)` }}
            >
              {TAG[tag].label}
            </span>
          )}
        </div>
        <div className="t-11.5 text-muted">
          <PosText pos={p.pos} /> {p.team}
          <span className="ml-1.5">{p.opp}</span>
        </div>
        {old && (
          <div className="t-11 text-[#5d6579]">
            replaces {old.short} ({fmt(old.pts)})
          </div>
        )}
      </div>

      {action === "trade" && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center r-999 border border-line/70 text-muted">
          <TradeIcon className="h-3.5 w-3.5" />
        </span>
      )}
      {action === "more" && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center r-999 border border-line/70 text-muted">
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
          </svg>
        </span>
      )}
      {action === "keep" && <span className="shrink-0 r-999 bg-[#272d3f] px-3 py-1.5 t-11.5 font-semibold">Keep</span>}

      <div className={cn("shrink-0 text-right", phone ? "w-13" : "w-16")}>
        <div className="tnum t-14.5 font-semibold leading-snug" style={{ color: tierColor(p.pos, p.pts) }}>
          {fmt(p.pts)}
        </div>
        <div className="tnum whitespace-nowrap t-10.5 text-[#5d6579]">
          {!phone && "SLP "}
          {fmt(p.slp)}
          <span className="ml-0.5" style={{ color: diff > 0 ? UP : DOWN }}>
            {diff > 0 ? "▲" : "▼"}
          </span>
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ side }: { side: Side }) {
  const w = side.weeks[0];
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3">
      <TeamAvatar name={side.name} className="h-10 w-10 t-14" />
      <div className="min-w-0 flex-1">
        <div className={cn(EYEBROW, "t-11")}>{side.label}</div>
        <div className="t-15 font-semibold leading-snug">{side.name}</div>
      </div>
      <div className="text-right">
        <div className="t-11 text-muted">Week {w.week} proj</div>
        <div className="tnum t-15 font-semibold leading-snug">
          <span className="text-[#5d6579]">{fmt(w.before)}</span>
          <span className="mx-1 text-[#5d6579]">→</span>
          {fmt(w.after)}
        </div>
        <Delta value={w.after - w.before} className="block t-12 leading-snug" />
      </div>
    </div>
  );
}

function RosterStrip({ side }: { side: Side }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-raised px-4 py-2 t-12">
      <span>
        Roster <span className="tnum font-semibold">16/16</span>
      </span>
      <span className="text-muted">{side.moves} · rest-of-season moves</span>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <div className={cn(EYEBROW, "border-b border-line/60 px-4 pb-1.5 pt-4 t-11")}>{children}</div>;
}

function TeamPanel({ side, slots, phone }: { side: Side; slots: Slot[]; phone?: boolean }) {
  return (
    <div className={cn("min-w-0 overflow-hidden r-16 bg-card", RING)}>
      <PanelHeader side={side} />
      <RosterStrip side={side} />
      <SectionTitle>Starters</SectionTitle>
      {slots.map((s, i) => (
        <PlayerRow key={s.id} {...s} phone={phone} action={phone ? "more" : "trade"} last={i === slots.length - 1} />
      ))}
    </div>
  );
}

/* ── the screens ───────────────────────────────────────────────────────── */

/** The impact panel as it stacks on a phone: both teams, the verdict, the week chart. */
export function LineupLabImpact() {
  return (
    <Surface
      w={420}
      brand="lineup-lab"
      label="Lineup Lab projected impact panel: both teams' projected lineup totals before and after a trade over weeks 12 to 14, a win-win verdict, and a bar chart of the change by week."
      className="bg-ground p-3"
    >
      <Impact width={364} phone />
    </Surface>
  );
}

function Pill({ children, on, className }: { children: ReactNode; on?: string; className?: string }) {
  return (
    <span className={cn("whitespace-nowrap r-999 px-3.5 py-1.5 t-12 font-semibold", on ?? "text-muted", className)}>{children}</span>
  );
}

function WeekSelect({ value }: { value: number }) {
  return (
    <span className={cn("flex items-center gap-2 r-8 bg-[#272d3f] px-2 py-1.5 t-12 font-medium text-ink", RING)}>
      {value}
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
        <path d="M2.5 4.5L6 8l3.5-3.5" />
      </svg>
    </span>
  );
}

/** The trade screen on a desk: range tabs, projection source, impact panel, both lineups. */
export function LineupLabImpactFull() {
  return (
    <Surface
      w={960}
      brand="lineup-lab"
      label="Lineup Lab trade screen: week range tabs, the projected impact panel with its by-week chart, and both teams' starting lineups after the trade with each player's projection."
      className="bg-ground"
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-6">
        <LogoMark className="h-7 w-7" />
        <span className="t-16 font-bold tracking-tight">Lineup Lab</span>
        <div className="ml-auto flex items-center gap-2.5">
          <TeamAvatar name="Couch Coordinators" className="h-7 w-7 t-12" />
          <div className="leading-tight">
            <div className="t-13 font-semibold">Couch Coordinators</div>
            <div className="t-11 text-muted">10 teams · PPR · Week {WEEK}</div>
          </div>
          <span className="ml-1 r-999 bg-[#272d3f] px-3 py-1.5 t-12 font-medium text-muted">Switch</span>
          <span className="flex items-center gap-1.5 r-999 bg-accent/15 px-3 py-1.5 t-12 font-semibold text-accent">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <rect x="4" y="1.5" width="8" height="13" rx="2" />
              <path d="M8 5v5M6 8l2 2 2-2" />
            </svg>
            Get the app
          </span>
        </div>
      </div>

      <div className="space-y-4 px-6 pb-6 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn("flex r-999 bg-raised p-1", RING)}>
              <Pill>This week</Pill>
              <Pill on="bg-accent text-ground">Next 3 weeks</Pill>
              <Pill>Rest of season</Pill>
              <Pill>Playoffs</Pill>
            </div>
            <div className="flex items-center gap-1.5 t-12 text-muted">
              Wk <WeekSelect value={WEEKS[0]} /> to <WeekSelect value={WEEKS[WEEKS.length - 1]} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(EYEBROW, "t-11")}>Projections</span>
            <div className={cn("flex r-999 bg-raised p-1", RING)}>
              <Pill>Sleeper</Pill>
              <Pill on="bg-[#58a7ff] text-ground">Lineup Lab</Pill>
            </div>
            <span className={cn("flex h-7 w-7 items-center justify-center r-999 t-13 font-semibold text-muted", RING)}>?</span>
          </div>
        </div>

        <Impact width={880} />

        <div className="flex items-center justify-between pt-2">
          <h4 className={cn(EYEBROW, "t-13")}>Lineups after trade · Week {WEEK}</h4>
          <div className="flex items-center gap-1">
            {(["M7.5 2.5L4 6l3.5 3.5", "M4.5 2.5L8 6l-3.5 3.5"] as const).map((d, i) => (
              <span key={d} className={cn("flex h-8 w-8 items-center justify-center r-999 bg-card text-muted", RING, i === 0 && "opacity-30")}>
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3 w-3">
                  <path d={d} />
                </svg>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 items-start gap-4">
          <TeamPanel side={MINE} slots={ME_AFTER} />
          <TeamPanel side={THEIRS} slots={PARTNER_AFTER} />
        </div>
      </div>
    </Surface>
  );
}

/** One team's starters after the trade, in the phone layout. */
export function LineupLabLineup() {
  return (
    <Surface
      w={440}
      brand="lineup-lab"
      label="Lineup Lab lineup panel: Turf Monsters' nine starters for week 12 after the trade, with slot chips in position colours, a new arrival, a bench player promoted to start, and each projection beside Sleeper's."
      className="bg-ground p-3"
    >
      <TeamPanel side={MINE} slots={ME_AFTER} phone />
    </Surface>
  );
}

function TradeChip({ id }: { id: Id }) {
  const p = P[id];
  return (
    <span className="flex items-center gap-2 r-999 bg-[#272d3f] p-1 t-13">
      <PlayerAvatar id={id} size="sm" />
      <span className="whitespace-nowrap font-medium">{p.short}</span>
      <PosText pos={p.pos} />
      <span className="flex h-6 w-6 items-center justify-center text-muted">×</span>
    </span>
  );
}

function TradeSide({ title, subtitle, ids, clear }: { title: string; subtitle: string; ids: Id[]; clear?: boolean }) {
  return (
    <div className="min-w-0">
      {/* Only the first title line has to stay clear of the Reset button. */}
      <div className={cn("flex items-baseline gap-2", clear ? "mb-4.5 pr-24" : "mb-2")}>
        <span className={cn(EYEBROW, "t-11")}>{title}</span>
        <span className="t-11 text-[#5d6579]">{subtitle}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {ids.map((id) => (
          <TradeChip key={id} id={id} />
        ))}
        <span className="flex h-8 items-center gap-1.5 r-999 border border-dashed border-line px-3 t-13 text-muted">
          <span className="t-16 leading-none">+</span> Add player
        </span>
      </div>
    </div>
  );
}

/** A team's header and roster count over the one move the tool made to keep the roster legal. */
function MovePanel({ side, children }: { side: Side; children: ReactNode }) {
  return (
    <div className={cn("overflow-hidden r-16 bg-card", RING)}>
      <PanelHeader side={side} />
      <RosterStrip side={side} />
      {children}
    </div>
  );
}

/** The trade bar, and under it the roster move each side needs once the trade is in. */
export function LineupLabTrade() {
  return (
    <Surface
      w={440}
      brand="lineup-lab"
      label="Lineup Lab trade bar: you send Garrett Wilson and Chuba Hubbard and receive De'Von Achane. Below, the open roster spot is filled with a waiver pickup and the trade partner's extra player is dropped."
      className="space-y-3 bg-ground p-3"
    >
      <div className={cn("relative r-16 bg-card p-4", RING)}>
        <span className={cn("absolute right-3 top-3 flex items-center gap-1.5 r-999 bg-[#272d3f] px-3 py-1.5 t-12 font-semibold", RING)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" />
            <path d="M2.5 2.5v3h3" />
          </svg>
          Reset
        </span>
        <div className="flex flex-col gap-4">
          <TradeSide title="You send" subtitle={`to ${PARTNER}`} ids={SEND} clear />
          <TradeSide title="You receive" subtitle={`from ${PARTNER}`} ids={RECEIVE} />
        </div>
      </div>

      <MovePanel side={MINE}>
        <PlayerRow id="spears" slot="BN" tag="autoadd" phone action="more" fixed last />
      </MovePanel>
      <MovePanel side={THEIRS}>
        <PlayerRow id="coker" slot="BN" tag="autodrop" phone action="keep" dimmed fixed last />
      </MovePanel>
    </Surface>
  );
}

/* blend.ts: what each step added to Sleeper's number, in BLEND_LABEL's words. */
const BLEND: [string, number][] = [
  ["ESPN consensus", -0.26],
  ["Sportsbooks", 0.84],
  ["Game script", 0.27],
  ["Matchup", -0.12],
];

/** The player card with its projection breakdown: Sleeper's number, each adjustment, the result. */
export function LineupLabBlend() {
  const p = P.achane;
  return (
    <Surface
      w={400}
      brand="lineup-lab"
      label="Lineup Lab player card for De'Von Achane, week 12: Sleeper's projection of 18.20, adjusted by ESPN consensus, sportsbooks, game script and matchup to a Lineup Lab projection of 18.93."
      className="bg-[#07080c] pt-8"
    >
      <div className={cn("r-24 rounded-b-none bg-card", RING)}>
        <div className="flex items-center gap-3 border-b border-line px-5 pb-4 pt-5">
          <PlayerAvatar id="achane" size="lg" />
          <div className="min-w-0 flex-1">
            <div className="t-18 font-semibold leading-snug">{p.name}</div>
            <div className="t-12.5 text-muted">
              <PosText pos={p.pos} /> {p.team} · Week {WEEK} {p.opp}
            </div>
          </div>
          <div className="text-right">
            <div className="tnum t-20 font-semibold leading-snug">{fmt(p.pts)}</div>
            <div className="t-11 text-muted">proj pts</div>
          </div>
          <span className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center self-start text-muted">
            <svg viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-3.5 w-3.5">
              <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
            </svg>
          </span>
        </div>

        <div className="px-5 py-4">
          <div className={cn(EYEBROW, "mb-2 t-11")}>Week {WEEK} projection</div>
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 t-13">
            <span className="text-muted">Sleeper</span>
            <span className="tnum text-right">{fmt(p.slp)}</span>
            {BLEND.map(([label, v]) => (
              <span key={label} className="contents">
                <span className="text-muted">{label}</span>
                <span className="tnum text-right" style={{ color: v > 0 ? UP : DOWN }}>
                  {signed(v)}
                </span>
              </span>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 t-13 font-semibold">
            <span>Lineup Lab</span>
            <span className="tnum">{fmt(p.pts)}</span>
          </div>
        </div>

        <div className="border-t border-line px-5 pb-4 pt-3">
          <div className="flex items-center justify-center gap-2 r-16 bg-accent/15 px-4 py-3 t-14 font-semibold text-accent">
            <TradeIcon className="h-3.5 w-3.5" />
            Undo this trade piece
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** The flask and the wordmark as the header sets them, over the home page's headline. */
export function LineupLabMark() {
  return (
    <Surface w={400} brand="lineup-lab" label="The Lineup Lab logo: a flask whose liquid is three lineup rows, beside the Lineup Lab wordmark." className="bg-ground">
      <div className="flex flex-col items-center px-6 py-20">
        <div className="flex items-center gap-5">
          <LogoMark className="h-18 w-18" />
          <span className="whitespace-nowrap t-40 font-bold leading-none tracking-tight">Lineup Lab</span>
        </div>
        <p className="mt-7 t-16 font-bold tracking-tight">
          See the trade <span className="text-accent">in your lineup.</span>
        </p>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "lineup-lab-impact",
    title: "Projected impact",
    caption:
      "What a trade does to both starting lineups over the weeks you pick, with the change drawn week by week. Each total is the best legal lineup for that week, solved before and after the trade.",
    tile: LineupLabImpact,
    full: LineupLabImpactFull,
  },
  {
    id: "lineup-lab-lineup",
    title: "Lineups after the trade",
    caption:
      "One team's starters once the trade is in: who is new, who came off the bench and whose spot he took. Slots are filled by an exact assignment solver, so overlapping flex spots are handled.",
    tile: LineupLabLineup,
  },
  {
    id: "lineup-lab-trade",
    title: "Trade builder",
    caption:
      "The players going each way, and the move each roster then needs. An open spot is filled with the best waiver pickup and an extra player is cut where it costs the rest-of-season lineups least.",
    tile: LineupLabTrade,
  },
  {
    id: "lineup-lab-blend",
    title: "Projection blend",
    caption:
      "How one player's Lineup Lab projection is built from Sleeper's. ESPN's projection is averaged in, sportsbook props set the stats they price, then game script and the opposing defense adjust the rest.",
    tile: LineupLabBlend,
  },
  {
    id: "lineup-lab-mark",
    title: "Lineup Lab mark",
    caption: "The flask logo, its liquid drawn as three lineup rows, with the wordmark in Poppins.",
    tile: LineupLabMark,
  },
];
