import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Headshot, Phone, StatusBar, Surface } from "./kit";
import type { SurfaceDef } from "./types";
import "./phantomgm.css";

/*
  PhantomGM, rebuilt from fbi-basketball's app/phantomgm and
  components/phantomgm. It is a work in progress there, open to admins only.

  Colours, radii and type come from app/phantomgm/pgm.css: Ink ground, Bone
  text, Glow (#a298e7) for whatever is PhantomGM's doing, red and amber for
  state only. Archivo widened for headings and figures, Geist for reading,
  Geist Mono for times. The wordmark and the logo are never shown together
  as a lockup (brand-kit/phantomgm/README.md).

  The players are real, with ESPN's public headshots by athlete id, and every
  lineup and move is sample data. No named player is shown as out or injured. The
  leagues and fantasy teams are invented. The win chances are computed the
  way lib/phantomgm/impact.ts computes them.
*/

/* ── sample data ─────────────────────────────────────────────────────────── */

/** lib/daily/odds.ts matchupProbability: more than half the categories, a tie split evenly. */
function matchupProbability(ps: readonly number[]): number {
  let dist = [1];
  for (const p of ps) {
    const next = new Array<number>(dist.length + 1).fill(0);
    dist.forEach((v, k) => {
      next[k] += v * (1 - p);
      next[k + 1] += v * p;
    });
    dist = next;
  }
  const n = ps.length;
  let win = 0;
  for (let k = 0; k <= n; k++) {
    if (2 * k > n) win += dist[k];
    else if (2 * k === n) win += dist[k] / 2;
  }
  return win;
}

/** Each category's chance to win: with the lineup Fantrax holds now, and with the plan. */
const CATS: { label: string; now: number; plan: number }[] = [
  { label: "FG%", now: 0.52, plan: 0.51 },
  { label: "FT%", now: 0.68, plan: 0.69 },
  { label: "3PM", now: 0.41, plan: 0.46 },
  { label: "PTS", now: 0.57, plan: 0.62 },
  { label: "REB", now: 0.33, plan: 0.49 },
  { label: "AST", now: 0.36, plan: 0.55 },
  { label: "STL", now: 0.48, plan: 0.58 },
  { label: "BLK", now: 0.74, plan: 0.77 },
  { label: "TO", now: 0.38, plan: 0.29 },
];

const pct = (p: number) => Math.round(p * 100);
const WIN_NOW = pct(matchupProbability(CATS.map((c) => c.now)));
const WIN_PLAN = pct(matchupProbability(CATS.map((c) => c.plan)));
const CATS_PLAN = CATS.reduce((s, c) => s + c.plan, 0).toFixed(1);

type MoveKind = "start" | "sit";
type Move = { kind: MoveKind; name: string; to: string; why: string; cats?: string[] };

type Slot = {
  pos: string;
  name: string;
  /** ESPN athlete id, for the headshot. */
  id: number;
  meta: string;
  was?: string;
  cats?: string[];
  dim?: boolean;
};

/** Harbour City Dynasty, tonight: the lineup the plan sets, slot by slot. */
const LINEUP: Slot[] = [
  { pos: "PG", name: "Tyrese Maxey", id: 4431678, meta: "PHI vs BOS" },
  { pos: "SG", name: "Derrick White", id: 3078576, meta: "BOS @ PHI" },
  { pos: "G", name: "Dyson Daniels", id: 4869342, meta: "ATL vs SAC", was: "Jordan Poole", cats: ["STL", "AST"] },
  { pos: "SF", name: "Franz Wagner", id: 4566434, meta: "ORL @ CHA" },
  { pos: "PF", name: "Jalen Johnson", id: 4701230, meta: "ATL vs SAC" },
  { pos: "F", name: "Trey Murphy III", id: 4397688, meta: "NOP · no game", dim: true },
  { pos: "C", name: "Chet Holmgren", id: 4433255, meta: "OKC vs GSW" },
  { pos: "Flx", name: "Jalen Williams", id: 4593803, meta: "OKC vs GSW" },
  { pos: "Flx2", name: "Walker Kessler", id: 4433136, meta: "LAL @ POR", was: "Herbert Jones", cats: ["REB", "BLK"] },
  { pos: "Flx3", name: "Coby White", id: 4395651, meta: "CHA vs ORL" },
];

const TONIGHT_MOVES: Move[] = [
  { kind: "start", name: "Dyson Daniels", to: "G", why: "1 game", cats: ["STL", "AST"] },
  { kind: "start", name: "Walker Kessler", to: "Flx2", why: "1 game", cats: ["REB", "BLK"] },
  { kind: "sit", name: "Jordan Poole", to: "Bench", why: "no game" },
  { kind: "sit", name: "Herbert Jones", to: "Bench", why: "no game" },
];

type Starter = { name: string; id: number; ring?: boolean; dim?: boolean };

type LeagueCardData = {
  league: string;
  team: string;
  record: string;
  rank: string;
  chips: string[];
  opponent: string;
  now: number;
  plan: number;
  right: string;
  playing: number;
  slots: number;
  starters: Starter[];
  moves: Move[];
  pickup: { name: string; id: number; lines: [string, string] };
  foot: string;
};

const CARD_CATS: LeagueCardData = {
  league: "Harbour City Dynasty",
  team: "Midnight Shift",
  record: "2-1",
  rank: "4th",
  chips: ["H2H 9-cat", "Dynasty"],
  opponent: "Dunk Tank",
  now: WIN_NOW,
  plan: WIN_PLAN,
  right: `${CATS_PLAN} of ${CATS.length} cats`,
  playing: LINEUP.filter((s) => !s.dim).length,
  slots: LINEUP.length,
  starters: LINEUP.map((s) => ({ name: s.name, id: s.id, ring: !!s.was, dim: s.dim })),
  moves: TONIGHT_MOVES,
  pickup: { name: "Keon Ellis", id: 4702177, lines: ["Free agent · joins today · 3 starts", "+2% to win · no drop needed"] },
  foot: "+1 more move",
};

const CARD_POINTS: LeagueCardData = {
  league: "Tuesday Night Pickup",
  team: "Second Unit",
  record: "3-0",
  rank: "1st",
  chips: ["H2H points", "4 games per slot"],
  opponent: "Glass Cleaners",
  now: 47,
  plan: 52,
  right: "1,386 more pts",
  playing: 7,
  slots: 9,
  starters: [
    { name: "Jalen Brunson", id: 3934672 },
    { name: "Payton Pritchard", id: 4066354, ring: true },
    { name: "Cade Cunningham", id: 4432166 },
    { name: "Mikal Bridges", id: 3147657 },
    { name: "Evan Mobley", id: 4432158 },
    { name: "Bam Adebayo", id: 4066261 },
    { name: "Desmond Bane", id: 4066320, ring: true },
    { name: "Josh Hart", id: 3062679, dim: true },
  ],
  moves: [
    { kind: "start", name: "Payton Pritchard", to: "SG", why: "1 game" },
    { kind: "start", name: "Desmond Bane", to: "Flx", why: "1 game" },
    { kind: "sit", name: "Naz Reid", to: "Bench", why: "F games saved for better nights" },
  ],
  pickup: { name: "Ayo Dosunmu", id: 4397002, lines: ["Free agent · joins today · 3 starts", "+21.4 pts · drop Kelly Olynyk"] },
  foot: "First tip 7:00 PM",
};

/* ── icons: lucide, the set the product uses, and its own bolt ───────────── */

function Ico({ children, className, sw = 2 }: { children: ReactNode; className?: string; sw?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)}>
      {children}
    </svg>
  );
}

const ICON = {
  moon: (
    <>
      <path d="M18 5h4" />
      <path d="M20 3v4" />
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </>
  ),
  grid: (
    <>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </>
  ),
  activity: <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />,
  sliders: (
    <>
      <path d="M10 5H3" />
      <path d="M12 19H3" />
      <path d="M14 3v4" />
      <path d="M16 17v4" />
      <path d="M21 12h-9" />
      <path d="M21 19h-5" />
      <path d="M21 5h-7" />
      <path d="M8 10v4" />
      <path d="M8 12H3" />
    </>
  ),
  zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  up: (
    <>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </>
  ),
  down: (
    <>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  slash: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M22 2 2 22" />
    </>
  ),
} as const;

/** components/phantomgm/run-sheet.tsx Bolt. */
function Bolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("shrink-0", className)}>
      <path d="M13.2 2.5 4.6 13.4c-.4.5 0 1.1.6 1.1h5.3l-1.2 6.9c-.1.7.8 1.1 1.2.5l8.6-10.9c.4-.5 0-1.1-.6-1.1h-5.3l1.2-6.9c.1-.7-.8-1.1-1.2-.5Z" />
    </svg>
  );
}

/* ── small pieces (components/phantomgm/bits.tsx) ────────────────────────── */

/** A round photo frame (pgm.css ".pgm-ph"): a player's headshot, or one initial for the signed-in manager. */
function Ph({ name, id, sm, ring, dim, stack }: { name: string; id?: number; sm?: boolean; ring?: boolean; dim?: boolean; stack?: boolean }) {
  const frame = cn(
    "pgm-ph r-99 bw-1.5",
    sm ? "h-7 w-7" : "h-9 w-9",
    ring ? "border-accent" : "border-[#2e3448]",
    ring && !stack && "pgm-ph-ring",
    stack && "pgm-ph-stack -ml-1 first:ml-0",
  );
  if (id != null) return <Headshot league="nba" id={id} className={cn(frame, dim && "pgm-ph-dim")} />;
  return <span className={cn(frame, "pgm-tag flex shrink-0 items-center justify-center leading-none text-muted", sm ? "t-10" : "t-11")}>{name.slice(0, 1)}</span>;
}

function Wordmark({ className }: { className?: string }) {
  return <Image src="/brand/phantomgm/wordmark.png" alt="" width={1200} height={272} className={cn("w-auto", className)} />;
}

function StatusPill({ tone, children }: { tone: "fix" | "set"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-6.5 shrink-0 items-center gap-1.5 whitespace-nowrap r-99 border pl-2 pr-2.5 t-11 font-[650] leading-none",
        tone === "fix" ? "border-[rgba(255,93,93,0.28)] bg-[rgba(255,93,93,0.13)] text-[#ff5d5d]" : "border-accent/40 bg-accent/15 text-accent",
      )}
    >
      <span className="h-1.5 w-1.5 r-99 bg-current" />
      {children}
    </span>
  );
}

function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex h-5 shrink-0 items-center whitespace-nowrap r-6 border border-line bg-raised px-1.5 t-10 font-semibold leading-none text-secondary", className)}>{children}</span>;
}

/** The categories a start helps most in this matchup. */
function Why({ cats }: { cats: string[] }) {
  return (
    <span className="ml-auto flex shrink-0 gap-1">
      {cats.map((c) => (
        <span key={c} className="r-4 bg-accent/15 px-1.5 py-1 t-10 font-bold leading-none tracking-[0.03em] text-accent">
          {c}
        </span>
      ))}
    </span>
  );
}

function Switch({ on, lg }: { on: boolean; lg?: boolean }) {
  return (
    <span className={cn("relative block shrink-0 r-99 border", lg ? "h-8 w-14" : "h-6.5 w-11", on ? "border-accent bg-accent" : "border-[#2e3448] bg-[#1e2230]")}>
      <span
        className={cn(
          "pgm-knob absolute r-99",
          lg ? "top-[calc(var(--px)*3)] h-6 w-6" : "top-[calc(var(--px)*3)] h-4.5 w-4.5",
          on ? "right-[calc(var(--px)*3)] bg-accent-ink" : "left-[calc(var(--px)*3)] bg-secondary",
        )}
      />
    </span>
  );
}

/** The matchup line every card and the league screen lead with (bits.tsx MatchupMeter). */
function Matchup({ opponent, now, plan, right }: { opponent: string; now: number; plan: number; right: string }) {
  return (
    <div className="grid gap-2 r-13 border border-line bg-[#0b0d12] px-3.5 py-3">
      <div className="flex items-center justify-between gap-2.5">
        <span className="min-w-0 truncate t-11.5 font-semibold leading-tight text-muted">Win chance vs {opponent}</span>
        <span className="flex h-5 shrink-0 items-center r-5 bg-accent/15 px-1.5 font-mono t-11 font-bold leading-none text-accent">+{plan - now}</span>
      </div>
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="pgm-n t-25 leading-none text-ink">
          {plan}%<span className="ml-2 font-sans t-12 font-medium tracking-normal text-muted">was {now}%</span>
        </span>
        <span className="whitespace-nowrap t-12 leading-none text-secondary tnum">{right}</span>
      </div>
      <div className="relative h-2.5 overflow-hidden r-99 bg-[#1e2230]">
        <span className="absolute inset-y-0 left-0 r-99 bg-[#2e3448]" style={{ width: `${now}%` }} />
        <span className="absolute inset-y-0 left-0 r-99 bg-accent" style={{ width: `${plan}%` }} />
        <span className="absolute inset-y-0 left-1/2 w-[calc(var(--px)*1.5)] bg-[rgba(243,245,250,0.35)]" />
      </div>
    </div>
  );
}

/** Every category's chance, now (grey) and with the plan; the ones still in play flagged (bits.tsx CategoryBars). */
function CategoryBars() {
  return (
    <div>
      {CATS.map((c, i) => {
        const d = pct(c.plan) - pct(c.now);
        const swing = c.plan > 0.35 && c.plan < 0.65;
        const tone = c.plan >= 0.65 ? "#a298e7" : c.plan > 0.35 ? "#ffb547" : "#ff5d5d";
        return (
          <div key={c.label} className={cn("grid grid-cols-[calc(var(--px)*30)_calc(var(--px)*32)_minmax(0,1fr)_calc(var(--px)*30)_calc(var(--px)*22)] items-center gap-1.5 py-1.5", i > 0 && "border-t border-line/60")}>
            <span className="pgm-tag t-11.5 leading-none text-ink">{c.label}</span>
            <span className="font-mono t-10 font-semibold leading-none text-[#ffb547]">{swing ? "swing" : ""}</span>
            <span className="relative block h-1.5 overflow-hidden r-99 bg-[#1e2230]">
              <span className="absolute inset-y-0 left-0 r-99 bg-[#2e3448]" style={{ width: `${pct(c.now)}%` }} />
              <span className="absolute inset-y-0 left-0 r-99" style={{ width: `${pct(c.plan)}%`, background: tone }} />
              <span className="absolute inset-y-0 left-1/2 w-[calc(var(--px)*1.5)] bg-[rgba(243,245,250,0.35)]" />
            </span>
            <span className="text-right font-mono t-11.5 font-semibold leading-none text-ink tnum">{pct(c.plan)}%</span>
            <span className={cn("text-right font-mono t-11.5 font-semibold leading-none tnum", d > 0 ? "text-accent" : "text-[#ff5d5d]")}>{d === 0 ? "" : d > 0 ? `+${d}` : d}</span>
          </div>
        );
      })}
    </div>
  );
}

const VERB: Record<MoveKind, string> = { start: "Start", sit: "Bench" };

/** One move on two lines: who and where, then why (league-card.tsx MoveRow). */
function MoveRow({ m }: { m: Move }) {
  return (
    <div className="grid min-h-12.5 grid-cols-[calc(var(--px)*24)_minmax(0,1fr)] items-center gap-2.5 px-2 py-1.5">
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center r-7",
          m.kind === "start" && "bg-accent/15 text-accent",
          m.kind === "sit" && "bg-[#1e2230] text-muted",
        )}
      >
        <Ico className="h-3.5 w-3.5" sw={2.6}>
          {m.kind === "start" ? ICON.up : ICON.down}
        </Ico>
      </span>
      <div className="grid min-w-0 gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={cn("shrink-0 t-11 font-bold leading-none", m.kind === "start" && "text-accent", m.kind === "sit" && "text-muted")}>{VERB[m.kind]}</span>
          <span className="min-w-0 whitespace-nowrap t-13 font-[650] leading-tight text-ink">{m.name}</span>
          <span
            className={cn(
              "pgm-tag ml-auto flex h-5 shrink-0 items-center r-5 border px-1.5 t-10.5 leading-none",
              m.kind === "start" ? "border-accent/40 bg-accent/15 text-accent" : "border-line bg-raised text-secondary",
            )}
          >
            {m.to}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 whitespace-nowrap t-11.5 leading-tight text-muted">{m.why}</span>
          {m.cats ? <Why cats={m.cats} /> : null}
        </div>
      </div>
    </div>
  );
}

/* ── the phone frame (app/phantomgm/layout.tsx, components/phantomgm/nav.tsx) ── */

function TopBar() {
  return (
    <div className="relative z-10 flex h-12 shrink-0 items-center gap-2.5 border-b border-line bg-[#0b0d12] px-3.5">
      <Wordmark className="h-5.5" />
      <span className="flex-1" />
      <span className="flex h-7 items-center gap-1.5 whitespace-nowrap r-99 border border-accent/40 bg-accent/15 px-2.5 t-11 font-[650] leading-none text-accent">
        <span className="h-1.5 w-1.5 r-99 bg-current" />
        Auto on
      </span>
      <Ph name="Lucas" sm />
    </div>
  );
}

const TABS = [
  { label: "Tonight", icon: ICON.moon },
  { label: "Leagues", icon: ICON.grid },
  { label: "Activity", icon: ICON.activity },
  { label: "Settings", icon: ICON.sliders },
] as const;

function Tab({ i, active }: { i: number; active: string }) {
  const t = TABS[i];
  const on = t.label === active;
  return (
    <span className={cn("flex h-11.5 flex-col items-center justify-center gap-1 t-10 font-[650] leading-none tracking-[0.02em]", on ? "pgm-tab-on text-ink" : "text-muted")}>
      <Ico className={cn("h-5 w-5", on && "text-accent")}>{t.icon}</Ico>
      {t.label}
    </span>
  );
}

/** The bottom tab bar, Run raised in the middle. */
function TabBar({ active }: { active: string }) {
  return (
    <div className="relative z-10 grid h-18 shrink-0 grid-cols-5 items-start border-t border-line bg-[#0b0d12] px-2 pt-1.5">
      <Tab i={0} active={active} />
      <Tab i={1} active={active} />
      <span className="pgm-run -mt-5 flex h-12.5 w-12.5 items-center justify-center justify-self-center r-99 bg-accent text-accent-ink">
        <Bolt className="h-5.5 w-5.5" />
      </span>
      <Tab i={2} active={active} />
      <Tab i={3} active={active} />
    </div>
  );
}

/* ── 1. Tonight: one league's plan, on the phone ─────────────────────────── */

function LineupSlot({ s, first }: { s: Slot; first: boolean }) {
  const changed = !!s.was;
  return (
    <div className={cn("relative grid grid-cols-[calc(var(--px)*44)_minmax(0,1fr)] items-center gap-2.5 px-3 py-2", !first && "border-t border-line", changed && "pgm-slot-changed")}>
      {changed ? <span className="absolute bottom-2 left-0 top-2 w-[calc(var(--px)*2.5)] r-2 bg-accent" /> : null}
      <span className={cn("pgm-tag r-7 border py-1.5 text-center t-11.5 leading-none", changed ? "border-accent/40 bg-accent/15 text-accent" : "border-line bg-raised text-muted")}>{s.pos}</span>
      <div className="grid min-w-0 gap-1">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <Ph name={s.name} id={s.id} ring={changed} dim={s.dim} />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 whitespace-nowrap t-13 font-[650] leading-tight text-ink">
                {s.name}
              </span>
              <span className="mt-0.5 block t-11 leading-tight text-muted tnum">{s.meta}</span>
            </span>
          </span>
        </div>
        {changed ? (
          <span className="flex items-center gap-1.5 whitespace-nowrap t-11 leading-none text-muted">
            <span className="t-10 font-semibold">Was</span>
            <s className="decoration-[rgba(255,93,93,0.7)]">{s.was}</s>
            {s.cats ? <Why cats={s.cats} /> : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** One league in full on the phone: the matchup, the categories, then the moves and the lineup. */
export function PgmTonight() {
  return (
    <Surface
      w={400}
      brand="phantomgm"
      label={`PhantomGM on a phone: tonight's plan for one fantasy matchup. Win chance ${WIN_PLAN}%, up from ${WIN_NOW}%, each of nine categories with its chance, then the lineup moves.`}
      className="pgm-wall"
    >
      <div className="h-152.5 px-8 pt-8">
        <Phone className="pgm-frame-bg flex h-160 flex-col text-ink">
          <StatusBar />
          <TopBar />
          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="pgm-scroll px-3.5 pt-3.5">
              <h3 className="pgm-d t-21 text-ink">Harbour City Dynasty</h3>
              <div className="mt-2 flex items-center gap-1.5">
                <StatusPill tone="fix">4 moves for tonight</StatusPill>
                <Chip>H2H 9-cat</Chip>
                <Chip>Dynasty</Chip>
              </div>

              <div className="mt-3.5 r-18 border border-line bg-card p-3">
                <Matchup opponent="Dunk Tank" now={WIN_NOW} plan={WIN_PLAN} right={`${CATS_PLAN} of ${CATS.length} cats`} />
                <div className="mb-1 mt-3 flex items-baseline justify-between px-0.5">
                  <span className="t-11.5 font-semibold leading-none text-muted">Categories</span>
                  <span className="t-10.5 leading-none text-muted">grey = Fantrax now</span>
                </div>
                <div className="px-0.5">
                  <CategoryBars />
                </div>
              </div>

              <div className="mb-2.5 mt-6 flex items-center justify-between">
                <h4 className="pgm-d t-17 text-ink">Lineups</h4>
                <span className="flex h-8 items-center gap-1.5 r-9 bg-accent px-3 t-12 font-bold leading-none text-accent-ink">
                  <Bolt className="h-3.5 w-3.5" />
                  Save tonight
                </span>
              </div>
              <p className="mb-2.5 t-11.5 leading-tight text-muted tnum">Wed, Nov 11 · first tip 7:00 PM</p>
              <div className="r-18 border border-line bg-card p-1.5">
                {TONIGHT_MOVES.map((m) => (
                  <MoveRow key={m.name} m={m} />
                ))}
              </div>
              <div className="mt-3 overflow-hidden r-18 border border-line bg-card">
                {LINEUP.map((s, i) => (
                  <LineupSlot key={s.pos} s={s} first={i === 0} />
                ))}
              </div>
            </div>
          </div>
        </Phone>
      </div>
    </Surface>
  );
}

/* ── 1b. Tonight on a desk: the deck of leagues (app/phantomgm/page.tsx) ──── */

function LeagueCard({ c }: { c: LeagueCardData }) {
  return (
    <article className="row-span-6 grid grid-rows-subgrid gap-y-3.5 overflow-hidden r-18 border border-line bg-card">
      <div className="grid content-start justify-items-start gap-2 px-4 pt-3.5">
        <StatusPill tone="fix">Moves to make</StatusPill>
        <h4 className="pgm-d t-16 leading-[1.22] text-ink">{c.league}</h4>
        <p className="-mt-0.5 flex items-baseline gap-2 whitespace-nowrap t-12 leading-tight">
          <span className="font-semibold text-secondary">{c.team}</span>
          <span className="font-bold text-ink tnum">
            {c.record}
            <span className="font-normal text-muted"> · {c.rank}</span>
          </span>
        </p>
        <div className="flex gap-1.5">
          {c.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      </div>

      <div className="mx-4">
        <Matchup opponent={c.opponent} now={c.now} plan={c.plan} right={c.right} />
      </div>

      <div className="mx-4 grid content-start gap-2">
        <div className="flex items-baseline justify-between gap-2.5 whitespace-nowrap">
          <span className="t-11.5 font-semibold leading-none text-muted">Tonight</span>
          <span className="t-12 leading-none">
            <b className="pgm-n text-ink">{c.playing}</b>
            <span className="text-muted">
              {" "}
              of {c.slots} starters playing
            </span>
          </span>
        </div>
        <span className="flex items-center">
          {c.starters.map((p) => (
            <Ph key={p.name} name={p.name} id={p.id} sm stack ring={p.ring} dim={p.dim} />
          ))}
        </span>
      </div>

      <div className="mx-2 grid content-start gap-0.5">
        {c.moves.slice(0, 3).map((m) => (
          <MoveRow key={m.name} m={m} />
        ))}
      </div>

      <div className="mx-4 grid min-h-14 grid-cols-[calc(var(--px)*28)_minmax(0,1fr)_auto] items-center gap-2.5 r-13 border border-line bg-[#0b0d12] px-2.5 py-2">
        <Ph name={c.pickup.name} id={c.pickup.id} sm />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="shrink-0 t-11 font-bold leading-none text-accent">Best pickup</span>
            <span className="t-13 font-[650] leading-tight text-ink">{c.pickup.name}</span>
          </div>
          <p className="mt-1 whitespace-nowrap t-11 leading-[1.35] text-muted tnum">
            {c.pickup.lines[0]}
            <br />
            {c.pickup.lines[1]}
          </p>
        </div>
        <span className="flex h-8 items-center r-9 bg-accent px-3 t-12 font-bold leading-none text-accent-ink">Add</span>
      </div>

      <div className="flex items-center gap-2 border-t border-line bg-[rgba(11,13,18,0.5)] px-4 py-2.5">
        <span className="min-w-0 flex-1 truncate t-12 leading-none text-muted tnum">{c.foot}</span>
        <span className="flex h-8 items-center gap-1.5 r-9 bg-accent px-3 t-12 font-bold leading-none text-accent-ink">
          <Bolt className="h-3.5 w-3.5" />
          Set lineup
        </span>
        <span className="flex h-8 items-center gap-1 r-9 border border-[#2e3448] bg-raised pl-3 pr-2 t-12 font-bold leading-none text-ink">
          Open
          <Ico className="h-3.5 w-3.5">{ICON.chevron}</Ico>
        </span>
      </div>
    </article>
  );
}

const DECK = [CARD_CATS, CARD_POINTS];
/** Four leagues on the account; the two in the deck have moves, the other two are already set. */
const LEAGUE_COUNT = 4;
const SET_COUNT = LEAGUE_COUNT - DECK.length;
/** The hero's figures, added up the way app/phantomgm/page.tsx TonightStats adds them. */
const MOVES_PLANNED = DECK.reduce((n, c) => n + c.moves.length, 0);
const WINS_ADDED = DECK.reduce((s, c) => s + (c.plan - c.now) / 100, 0);
const RING = 2 * Math.PI * 40;

function Stat({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="min-w-0 r-13 border border-line bg-[rgba(8,9,13,0.55)] px-3 py-2.5">
      <div className="t-11 font-semibold leading-tight text-muted">{label}</div>
      <div className={cn("pgm-n mt-1.5 t-20 leading-[1.1]", className ?? "text-ink")}>{children}</div>
    </div>
  );
}

/** The Tonight screen at desktop width: the sidebar, the night's figures, and the leagues that have moves. */
export function PgmTonightFull() {
  return (
    <Surface
      w={960}
      brand="phantomgm"
      label="PhantomGM's Tonight screen on a desktop: two of four leagues set, six moves planned, and a card for each league that has moves, with its win chance, tonight's starters, the moves and the best pickup."
      className="pgm-frame-bg"
    >
      <div className="flex text-ink">
        <aside className="flex w-52 shrink-0 flex-col border-r border-line bg-[rgba(11,13,18,0.7)] px-3 pb-4 pt-5">
          <Wordmark className="ml-1 h-6.5 self-start" />
          <nav className="mt-5.5 grid gap-0.5">
            {TABS.map((t) => {
              const on = t.label === "Tonight";
              return (
                <span key={t.label} className={cn("relative flex h-9.5 items-center gap-2.5 r-11 px-3 t-13 font-semibold leading-none", on ? "bg-raised text-ink" : "text-muted")}>
                  {on ? <span className="absolute inset-y-0 left-0 w-0.5 r-2 bg-accent" /> : null}
                  <Ico className={cn("h-4 w-4", on && "text-accent")}>{t.icon}</Ico>
                  {t.label}
                </span>
              );
            })}
          </nav>
          <span className="flex-1" />
          <div className="r-18 border border-line bg-card p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center r-10 border border-accent/40 bg-accent/15 text-accent">
                <Ico className="h-4 w-4">{ICON.zap}</Ico>
              </span>
              <div className="min-w-0">
                <div className="t-13 font-bold leading-tight">Autopilot on</div>
                <div className="mt-0.5 t-11 leading-tight text-muted tnum">Next run 6:30 PM</div>
              </div>
            </div>
            <span className="mt-3 flex h-8 items-center justify-center gap-1.5 r-9 bg-accent t-12 font-bold leading-none text-accent-ink">
              <Bolt className="h-3.5 w-3.5" />
              Run now
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 px-1">
            <Ph name="Lucas" sm />
            <span className="t-12 leading-none text-secondary">Lucas</span>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6.5 pb-8 pt-6.5">
          <section className="pgm-hero r-18 border border-line px-5 py-5">
            <div className="t-11.5 font-semibold leading-tight text-muted">Wednesday, November 11</div>
            <div className="mt-2 flex items-end gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="pgm-d t-30 text-ink">Lucas, here is tonight.</h3>
                <p className="mt-2 t-14 leading-normal text-secondary tnum">9 NBA games, first tip 7:00 PM</p>
              </div>
              <span className="flex h-11.5 shrink-0 items-center gap-2 r-13 bg-accent px-5 t-14.5 font-bold leading-none text-accent-ink">
                <Bolt className="h-4 w-4" />
                Run autopilot
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="relative h-20 w-20 shrink-0">
                <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90">
                  <circle cx="46" cy="46" r="40" fill="none" stroke="#1e2230" strokeWidth="9" />
                  <circle className="pgm-ring-fill" cx="46" cy="46" r="40" fill="none" stroke="#a298e7" strokeWidth="9" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING * (1 - SET_COUNT / LEAGUE_COUNT)} />
                </svg>
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 leading-none">
                  <span className="pgm-n t-20 text-ink">
                    {SET_COUNT}/{LEAGUE_COUNT}
                  </span>
                  <span className="t-10 font-semibold text-muted">set</span>
                </span>
              </span>
              <div className="grid min-w-0 flex-1 grid-cols-4 gap-2.5">
                <Stat label="Need you" className="text-[#ff5d5d]">
                  {DECK.length}
                </Stat>
                <Stat label="Moves planned">{MOVES_PLANNED}</Stat>
                <Stat label="Wins added" className="text-accent">
                  +{WINS_ADDED.toFixed(1)}
                </Stat>
                <Stat label="Matchups">3</Stat>
              </div>
            </div>
          </section>

          <div className="mb-3 mt-6 flex items-baseline justify-between">
            <h3 className="pgm-d t-19 text-ink">Your leagues</h3>
            <span className="t-12 font-semibold leading-none text-secondary">All {LEAGUE_COUNT}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3.5">
            {DECK.map((c) => (
              <LeagueCard key={c.league} c={c} />
            ))}
          </div>
        </main>
      </div>
    </Surface>
  );
}

/* ── 2. Autopilot: the card from Settings (app/phantomgm/settings/page.tsx) ── */

/** The cron's runs, every 30 minutes from 14:00 to 04:30 UTC (components/phantomgm/schedule.tsx), drawn in Eastern time. */
const RUNS = Array.from({ length: 30 }, (_, i) => i * 30);
const SPAN = RUNS[RUNS.length - 1];
/** 6:10 PM Eastern on the sample night: 550 minutes after the 9:00 AM run. */
const NOW = 550;
const at = (min: number) => `${((min / SPAN) * 96 + 2).toFixed(2)}%`;

const FEATURES = [
  { icon: ICON.refresh, title: "Re-plans every 30 minutes" },
  { icon: ICON.lock, title: "Hands off once a game tips" },
  { icon: ICON.slash, title: "Adds and drops only when you say" },
] as const;

/** Autopilot switched on, with the day's runs as ticks and a marker at now. */
export function PgmAutopilot() {
  return (
    <Surface
      w={400}
      brand="phantomgm"
      label="PhantomGM's autopilot card, switched on: a timeline of the day's runs, one every 30 minutes from 9:00 AM to 11:30 PM Eastern, with a marker at now and the next run at 6:30 PM."
      className="pgm-frame-bg"
    >
      <div className="p-6 text-ink">
        <div className="r-18 border border-line bg-card p-5">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <h3 className="pgm-d t-20 text-ink">Autopilot</h3>
                <span className="flex h-7 items-center gap-1.5 r-99 border border-accent/40 bg-accent/15 px-2.5 t-11.5 font-[650] leading-none text-accent">
                  <span className="h-1.5 w-1.5 r-99 bg-current" />
                  On
                </span>
              </div>
              <p className="mt-2 t-13.5 leading-tight text-secondary tnum">
                Next run <b className="font-[650] text-ink">6:30 PM</b>
              </p>
            </div>
            <Switch on lg />
          </div>

          <div className="mt-5">
            <div className="relative h-10 overflow-hidden r-12 border border-line bg-[#0b0d12]">
              {RUNS.map((r) => (
                <span key={r} className={cn("absolute bottom-2.5 top-2.5 w-[calc(var(--px)*3)] -translate-x-1/2 r-2 bg-accent", r < NOW ? "opacity-20" : "opacity-55")} style={{ left: at(r) }} />
              ))}
              <span className="pgm-now absolute bottom-1 top-1 w-0.5 -translate-x-1/2 r-2 bg-ink" style={{ left: at(NOW) }} />
            </div>
            <div className="mt-2 flex justify-between t-11 leading-none text-muted tnum">
              <span>9:00 AM</span>
              <span>4:30 PM</span>
              <span>11:30 PM</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center r-10 bg-accent/15 text-accent">
                  <Ico className="h-4 w-4">{f.icon}</Ico>
                </span>
                <span className="t-13.5 font-[650] leading-tight text-ink">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ── 3. Activity: what was saved to Fantrax (app/phantomgm/activity/page.tsx) ── */

type SaveLine = { verb: "In" | "Out"; name: string; rest: string };
type Save = { league: string; label: string; time: string; win?: number; lines: SaveLine[] };

const SAVES_TODAY: Save[] = [
  {
    league: "Harbour City Dynasty",
    label: "Wed, Nov 11",
    time: "6:01 PM",
    win: WIN_PLAN - WIN_NOW,
    lines: [
      { verb: "In", name: "Dyson Daniels", rest: "at G · 1 game" },
      { verb: "In", name: "Walker Kessler", rest: "at Flx2 · 1 game" },
      { verb: "Out", name: "Jordan Poole", rest: "· no game" },
      { verb: "Out", name: "Herbert Jones", rest: "· no game" },
    ],
  },
  {
    league: "Slow Break Keepers",
    label: "Wed, Nov 11",
    time: "4:08 PM",
    win: 3,
    lines: [
      { verb: "In", name: "Aaron Nesmith", rest: "at SF · 1 game" },
      { verb: "Out", name: "Max Strus", rest: "· no game" },
    ],
  },
];

function SaveItem({ s, first }: { s: Save; first: boolean }) {
  return (
    <div className={cn("grid grid-cols-[calc(var(--px)*22)_minmax(0,1fr)_auto] items-start gap-x-2.5 px-3 py-3", !first && "border-t border-line")}>
      <span className="flex h-5.5 w-5.5 items-center justify-center r-99 bg-accent text-accent-ink">
        <Ico className="h-3 w-3" sw={3.2}>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Ico>
      </span>
      <div className="min-w-0">
        <div className="whitespace-nowrap t-13 font-[650] leading-tight text-ink">{s.league}</div>
        <div className="mt-0.5 t-11 leading-tight text-muted tnum">{s.label}</div>
      </div>
      <div className="grid justify-items-end gap-1.5">
        <span className="font-mono t-10.5 leading-none text-muted tnum">{s.time}</span>
        {s.win ? <span className="flex h-5 items-center whitespace-nowrap r-5 bg-accent/15 px-1.5 font-mono t-10.5 font-bold leading-none text-accent">+{s.win}% win</span> : null}
      </div>
      {/* The moves take the card's full width under the header, so each one stays on its line. */}
      <div className="col-span-2 col-start-2 mt-2 grid gap-1">
        {s.lines.map((l) => (
          <div key={l.name} className="whitespace-nowrap t-11.5 leading-[1.3] text-ink">
            <span className={cn("font-bold", l.verb === "In" && "text-accent", l.verb === "Out" && "text-muted")}>{l.verb}</span> {l.name} <span className="text-muted">{l.rest}</span>
          </div>
        ))}
        <div className="t-10.5 leading-[1.3] text-muted">
          {s.lines.length} move{s.lines.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}

/** The foot of the Activity screen: the night's saves over the tab bar. */
export function PgmActivity() {
  return (
    <Surface
      w={400}
      brand="phantomgm"
      label="PhantomGM's Activity screen on a phone: 14 saves and 31 moves, and tonight's two saves with who went in, who came out and why, and what each did to the win chance."
      className="pgm-wall-up"
    >
      <div className="flex h-131 flex-col justify-end px-8 pb-8">
        <Phone className="pgm-frame-bg flex h-144.5 flex-col text-ink">
          <StatusBar />
          <TopBar />
          <div className="min-h-0 flex-1 overflow-hidden px-3.5 pt-3.5">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Saves">14</Stat>
              <Stat label="Moves" className="text-accent">
                31
              </Stat>
              <div className="min-w-0 r-13 border border-line bg-[rgba(8,9,13,0.55)] px-3 py-2.5">
                <div className="t-11 font-semibold leading-tight text-muted">Last run</div>
                <div className="pgm-n mt-2.5 whitespace-nowrap t-13 leading-[1.1] text-ink [word-spacing:0.14em]">9 min ago</div>
              </div>
            </div>
            <div className="mb-2 mt-4.5 t-11.5 font-semibold leading-none text-muted">Wednesday, Nov 11</div>
            <div className="r-18 border border-line bg-card">
              {SAVES_TODAY.map((s, i) => (
                <SaveItem key={s.league} s={s} first={i === 0} />
              ))}
            </div>
          </div>
          <TabBar active="Activity" />
        </Phone>
      </div>
    </Surface>
  );
}

/* ── 4. Leagues: autopilot per league (app/phantomgm/leagues/page.tsx) ────── */

const LEAGUES = [
  { name: "Harbour City Dynasty", meta: "Fantrax · saved 9 min ago", auto: true, show: true },
  { name: "Tuesday Night Pickup", meta: "Fantrax · saved 3h ago", auto: true, show: true },
  { name: "Slow Break Keepers", meta: "Fantrax · saved 2h ago", auto: false, show: true },
  { name: "Office Roto 2026-27", meta: "Fantrax · no saves yet", auto: false, show: false },
];

/** Every league on the account, with autopilot on or off for each and whether it shows on Tonight. */
export function PgmLeagues() {
  return (
    <Surface
      w={420}
      brand="phantomgm"
      label="PhantomGM's Leagues screen: four leagues, two with autopilot on, one set by hand and one hidden."
      className="pgm-frame-bg"
    >
      <div className="px-6 pb-6 pt-7 text-ink">
        <div className="t-11.5 font-semibold leading-none text-muted">{LEAGUES.length} leagues</div>
        <h3 className="pgm-d mt-2.5 t-27 text-ink">Leagues</h3>
        <div className="mt-4.5 r-18 border border-line bg-card">
          {LEAGUES.map((l, i) => (
            <div key={l.name} className={cn("grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-3.5 py-3", i > 0 && "border-t border-line", !l.show && "opacity-60")}>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="t-13.5 font-[650] leading-tight text-ink">{l.name}</span>
                  <Ico className="h-3.5 w-3.5 text-muted">{ICON.chevron}</Ico>
                </div>
                <div className="mt-0.5 t-11.5 leading-tight text-muted tnum">{l.meta}</div>
              </div>
              <span className="flex items-center gap-1.5 t-11 leading-none text-muted">
                Auto
                <Switch on={l.auto} />
              </span>
              <span className="flex items-center gap-1.5 t-11 leading-none text-muted">
                Show
                <Switch on={l.show} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/* ── 5. The wordmark and the mark, apart (brand-kit/phantomgm/README.md) ──── */

/** The T3 blackletter wordmark, gradient for dark grounds, with the app's own description under it. */
export function PgmWordmark() {
  return (
    <Surface w={400} brand="phantomgm" label="The PhantomGM wordmark: blackletter, in a violet gradient on ink." className="pgm-frame-bg">
      <div className="flex flex-col items-center px-8 pb-19 pt-21">
        <Wordmark className="h-16" />
        <p className="mt-5 t-13 leading-none text-muted">Your lineups, set for you.</p>
      </div>
    </Surface>
  );
}

/* brand-kit/phantomgm/README.md "Colours": the logo's six, darkest first. */
const PALETTE = [
  { name: "Deep", hex: "#3d2f9e" },
  { name: "Shade", hex: "#493ca7" },
  { name: "Cloak", hex: "#5b4eb3" },
  { name: "Drape", hex: "#7367c5" },
  { name: "Glow", hex: "#a298e7" },
  { name: "Ice", hex: "#cfe3f5" },
];

/** The phantom as the app icon: the ink tile, the logo filling it, and the logo's six colours. */
export function PgmMark() {
  return (
    <Surface w={400} brand="phantomgm" label="The PhantomGM logo as its app icon: a hooded violet phantom dribbling a basketball, on an ink tile, with the logo's six colours under it." className="pgm-icon-ground">
      <div className="flex flex-col items-center px-8 pb-8 pt-12">
        <div className="pgm-icon-tile flex h-56 w-56 items-center justify-center r-50">
          <Image src="/brand/phantomgm/logo.svg" alt="" width={512} height={512} unoptimized className="pgm-icon-logo h-50 w-50" />
        </div>
        <div className="mt-12 flex gap-4.5">
          {PALETTE.map((c) => (
            <span key={c.name} className="flex flex-col items-center gap-2">
              <span className="h-5 w-5 r-99" style={{ background: c.hex }} />
              <span className="t-10 leading-none text-muted">{c.name}</span>
            </span>
          ))}
        </div>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "phantomgm-tonight",
    title: "Tonight",
    caption:
      "The plan for one head-to-head matchup: the chance to win with the planned lineup against the one Fantrax holds now, each category's odds, and the moves that get there. The week is played out twice from projections and the per-category chances are combined into the matchup's; it is a work in progress.",
    tile: PgmTonight,
    full: PgmTonightFull,
  },
  {
    id: "phantomgm-autopilot",
    title: "Autopilot",
    caption: "The autopilot card from Settings. A scheduled job re-plans every league that has autopilot on, every 30 minutes through game time and leaves a starter alone once his game has tipped.",
    tile: PgmAutopilot,
  },
  {
    id: "phantomgm-activity",
    title: "Activity log",
    caption: "Every lineup saved to Fantrax: who went in, who came out and why, and what the save did to the chance of winning the matchup.",
    tile: PgmActivity,
  },
  {
    id: "phantomgm-leagues",
    title: "Leagues",
    caption: "Every Fantrax league on the account, with autopilot switched on or off for each one and a second switch to keep a league off the Tonight screen.",
    tile: PgmLeagues,
  },
  {
    id: "phantomgm-wordmark",
    title: "Wordmark",
    caption: "PhantomGM's blackletter wordmark, in the gradient cut for dark grounds. It is used apart from the logo.",
    tile: PgmWordmark,
  },
  {
    id: "phantomgm-mark",
    title: "App icon",
    caption: "The logo as the app icon: a hooded phantom dribbling a ball whose seams are cut out, drawn as a flat vector in six violets.",
    tile: PgmMark,
  },
];
