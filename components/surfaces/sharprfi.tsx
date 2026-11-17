import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Surface } from "./kit";
import type { SurfaceDef } from "./types";
import { SharprfiCalculator } from "./sharprfi-live";
import "./sharprfi.css";

/*
  SHARPRFI, rebuilt from sharprfi's own screens.

  The look is its app/components: a white page, Tailwind slate text, the
  green-600 "SHARP" wordmark, pill toggles, a rounded bordered table with
  uppercase slate-400 heads, and result pills. The hex values below are
  Tailwind's slate, green, red, yellow, orange and blue steps, the ones those
  components name by class.

  The teams and starters are real. Every figure is a sample, and every
  probability, lambda and price is computed below with the Poisson engine in
  sharprfi's lib/poisson.ts. The live product averages that engine with a
  batter-level simulation (lib/sim.ts) that is not ported here.
*/

/* ─── the model: lib/poisson.ts ─────────────────────────────────────────── */

const LEAGUE_FIP = 3.8;
const LEAGUE_K = 0.23;
const LEAGUE_BARREL = 8.0;
const LEAGUE_OBP = 0.31;
const BASE_LAMBDA = 0.3371;
/* lib/mlb-api.ts: the chance each of the first five hitters bats in the first. */
const TOP_WEIGHTS = [1, 1, 1, 0.672, 0.366];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Starter = { name: string; fip: number; k: number; barrel: number };
type Batter = { name: string; obp: number; pa: number };
type WindDir = "in" | "out" | "cross";

type Game = {
  away: string;
  home: string;
  awaySp: Starter;
  homeSp: Starter;
  awayObp: number;
  homeObp: number;
  awayLineup?: Batter[];
  homeLineup?: Batter[];
  venue: string;
  pf: number;
  roof?: boolean;
  tempF: number;
  windMph: number;
  windDir: WindDir;
  time: string;
  status: "upcoming" | "inProgress" | "settled";
  result?: "run" | "no_run";
};

const tempFactor = (g: Game) => (g.roof ? 1 : g.tempF < 55 ? 0.92 : g.tempF > 80 ? 1.06 : 1);
const windFactor = (g: Game) =>
  g.roof || g.windMph < 10 ? 1 : g.windDir === "in" ? 0.93 : g.windDir === "out" ? 1.08 : 1;

const topOfOrder = (lineup?: Batter[]) =>
  lineup
    ? lineup.reduce((s, b, i) => s + b.obp * TOP_WEIGHTS[i], 0) / TOP_WEIGHTS.reduce((s, w) => s + w, 0)
    : null;

/** The multipliers behind one half inning, in the order computeLambda applies them. */
function halfFactors(sp: Starter, teamObp: number, lineup: Batter[] | undefined, g: Game) {
  const top = topOfOrder(lineup);
  return {
    fip: Math.pow(sp.fip / LEAGUE_FIP, 0.55),
    k: clamp(1 + (0.3 * (LEAGUE_K - sp.k)) / LEAGUE_K, 0.85, 1.15),
    barrel: Math.pow(sp.barrel / LEAGUE_BARREL, 0.35),
    obp: Math.pow(teamObp / LEAGUE_OBP, 0.7),
    top: top === null ? null : Math.pow(clamp(top / teamObp, 0.9, 1.12), 0.45),
    park: Math.pow(g.pf, 0.5),
    temp: Math.pow(tempFactor(g), 0.5),
    wind: Math.pow(windFactor(g), 0.5),
  };
}

function lambdaOf(f: ReturnType<typeof halfFactors>) {
  return BASE_LAMBDA * clamp(f.fip * f.k * f.barrel * f.obp * (f.top ?? 1) * f.park * f.temp * f.wind, 0.55, 1.55);
}

/** Both halves of the first: the away lineup against the home starter, then the reverse. */
function model(g: Game) {
  const awayBats = halfFactors(g.homeSp, g.awayObp, g.awayLineup, g);
  const homeBats = halfFactors(g.awaySp, g.homeObp, g.homeLineup, g);
  const lAway = lambdaOf(awayBats);
  const lHome = lambdaOf(homeBats);
  return { awayBats, homeBats, lAway, lHome, yrfi: 1 - Math.exp(-lAway) * Math.exp(-lHome) };
}

function breakEven(p: number) {
  const n = p >= 0.5 ? -Math.floor((100 * p) / (1 - p) + 1e-9) : Math.ceil((100 * (1 - p)) / p - 1e-9);
  return n === -100 ? "+100" : n > 0 ? `+${n}` : `${n}`;
}

const pct2 = (p: number) => `${(p * 100).toFixed(2)}%`;

/* lib/yrfi-color.ts: nine stops from red to green across the 44 to 60% range. */
const HUES = [0, 17, 35, 52, 70, 87, 105, 122, 140];
const LIGHTS = [42, 41, 40, 39, 38, 36, 34, 33, 32];
function yrfiColor(p: number) {
  const i = Math.round(clamp((p - 0.44) / (0.6 - 0.44), 0, 1) * 8);
  return `hsl(${HUES[i]} 82% ${LIGHTS[i]}%)`;
}

/* ─── sample slate ──────────────────────────────────────────────────────── */

const sp = (name: string, fip: number, k: number, barrel: number): Starter => ({ name, fip, k, barrel });

const GAMES: Game[] = [
  {
    away: "Dodgers", home: "Padres",
    awaySp: sp("Tyler Glasnow", 3.45, 0.295, 8.6), homeSp: sp("Nick Pivetta", 3.55, 0.265, 9.0),
    awayObp: 0.334, homeObp: 0.318,
    awayLineup: [
      { name: "Shohei Ohtani", obp: 0.384, pa: 612 },
      { name: "Mookie Betts", obp: 0.338, pa: 588 },
      { name: "Freddie Freeman", obp: 0.362, pa: 571 },
      { name: "Will Smith", obp: 0.371, pa: 455 },
      { name: "Teoscar Hernández", obp: 0.312, pa: 540 },
    ],
    homeLineup: [
      { name: "Fernando Tatis Jr.", obp: 0.366, pa: 601 },
      { name: "Jackson Merrill", obp: 0.322, pa: 498 },
      { name: "Manny Machado", obp: 0.336, pa: 590 },
      { name: "Xander Bogaerts", obp: 0.318, pa: 512 },
      { name: "Jake Cronenworth", obp: 0.34, pa: 487 },
    ],
    venue: "Petco Park", pf: 0.88, tempF: 66, windMph: 8, windDir: "cross", time: "21:40", status: "upcoming",
  },
  {
    away: "Rangers", home: "Angels",
    awaySp: sp("Jack Leiter", 4.2, 0.225, 8.8), homeSp: sp("Yusei Kikuchi", 3.95, 0.225, 9.3),
    awayObp: 0.312, homeObp: 0.308,
    venue: "Angel Stadium", pf: 0.97, tempF: 72, windMph: 5, windDir: "cross", time: "21:38", status: "upcoming",
  },
  {
    away: "Diamondbacks", home: "Rockies",
    awaySp: sp("Brandon Pfaadt", 4.25, 0.215, 9.6), homeSp: sp("Kyle Freeland", 4.75, 0.165, 9.4),
    awayObp: 0.326, homeObp: 0.296,
    venue: "Coors Field", pf: 1.28, tempF: 81, windMph: 9, windDir: "out", time: "20:40", status: "inProgress",
  },
  {
    away: "Pirates", home: "Cubs",
    awaySp: sp("Mitch Keller", 4.15, 0.2, 8.6), homeSp: sp("Shota Imanaga", 4.3, 0.215, 10.6),
    awayObp: 0.3, homeObp: 0.322,
    venue: "Wrigley Field", pf: 1.04, tempF: 71, windMph: 14, windDir: "out", time: "19:40", status: "settled", result: "run",
  },
  {
    away: "Phillies", home: "Braves",
    awaySp: sp("Taijuan Walker", 4.85, 0.17, 9.5), homeSp: sp("Spencer Strider", 4.1, 0.255, 9.8),
    awayObp: 0.325, homeObp: 0.318,
    venue: "Truist Park", pf: 1.0, tempF: 84, windMph: 4, windDir: "cross", time: "19:15", status: "settled", result: "run",
  },
  {
    away: "Yankees", home: "Red Sox",
    awaySp: sp("Max Fried", 3.05, 0.235, 5.8), homeSp: sp("Garrett Crochet", 2.8, 0.31, 7.4),
    awayObp: 0.332, homeObp: 0.322,
    venue: "Fenway Park", pf: 1.02, tempF: 64, windMph: 12, windDir: "out", time: "19:10", status: "settled", result: "no_run",
  },
  {
    away: "Mets", home: "Reds",
    awaySp: sp("David Peterson", 3.9, 0.21, 7.6), homeSp: sp("Nick Lodolo", 3.85, 0.24, 8.8),
    awayObp: 0.324, homeObp: 0.314,
    venue: "Great American Ball Park", pf: 1.0, tempF: 79, windMph: 6, windDir: "cross", time: "18:40", status: "settled", result: "no_run",
  },
  {
    away: "Blue Jays", home: "Orioles",
    awaySp: sp("Kevin Gausman", 3.6, 0.235, 8.8), homeSp: sp("Trevor Rogers", 3.4, 0.225, 6.4),
    awayObp: 0.328, homeObp: 0.31,
    venue: "Camden Yards", pf: 0.97, tempF: 74, windMph: 7, windDir: "cross", time: "18:35", status: "settled", result: "run",
  },
  {
    away: "Mariners", home: "Astros",
    awaySp: sp("Logan Gilbert", 3.3, 0.3, 8.2), homeSp: sp("Hunter Brown", 3.1, 0.285, 6.6),
    awayObp: 0.316, homeObp: 0.315,
    venue: "Daikin Park", pf: 1.01, roof: true, tempF: 72, windMph: 0, windDir: "cross", time: "20:10", status: "settled", result: "no_run",
  },
  {
    away: "Tigers", home: "Guardians",
    awaySp: sp("Tarik Skubal", 2.45, 0.32, 6.2), homeSp: sp("Tanner Bibee", 4.05, 0.215, 8.9),
    awayObp: 0.314, homeObp: 0.305,
    venue: "Progressive Field", pf: 0.97, tempF: 58, windMph: 11, windDir: "in", time: "18:40", status: "settled", result: "no_run",
  },
];

/* The table sorts each group by the active view's probability, highest first. */
const byYrfi = (a: Game, b: Game) => model(b).yrfi - model(a).yrfi;
const UPCOMING = GAMES.filter((g) => g.status === "upcoming").sort(byYrfi);
const IN_PROGRESS = GAMES.filter((g) => g.status === "inProgress").sort(byYrfi);
const SETTLED = GAMES.filter((g) => g.status === "settled").sort(byYrfi);
const FEATURED = GAMES[0];

const tempText = (g: Game) => (g.roof ? "Roof" : `${g.tempF}°F`);
const windText = (g: Game) => (g.roof ? "Roof" : g.windMph < 5 ? "Calm" : `${g.windMph} mph`);
const lastName = (name: string) => name.split(" ").slice(1).join(" ");

/* ─── shared pieces ─────────────────────────────────────────────────────── */

/** The wordmark as the header sets it: SHARP in green-600, RFI in slate-900, the host small beside it. */
function Wordmark({ size, host }: { size: string; host: string }) {
  return (
    <span className="flex items-baseline gap-1 whitespace-nowrap">
      <span className={cn("font-bold leading-none tracking-tight text-ink", size)}>
        <span className="text-accent">SHARP</span>RFI
      </span>
      <span className={cn("font-semibold tracking-tight text-[#94a3b8]", host)}>.vercel.app</span>
    </span>
  );
}

function ModeToggle({ className, button }: { className?: string; button: string }) {
  return (
    <span className={cn("flex w-fit shrink-0 r-99 bg-raised p-1", className)}>
      <span className={cn("r-99 font-semibold text-muted", button)}>NRFI</span>
      <span className={cn("r-99 bg-accent font-semibold text-accent-ink", button)}>YRFI</span>
    </span>
  );
}

function ResultBadge({ g, className }: { g: Game; className?: string }) {
  const pill = cn("inline-flex items-center justify-center whitespace-nowrap r-99 px-2 py-0.5 font-semibold", className);
  if (g.result === "run") return <span className={cn(pill, "bg-[#dcfce7] text-[#15803d]")}>RUN</span>;
  if (g.result === "no_run") return <span className={cn(pill, "bg-[#fee2e2] text-[#dc2626]")}>NO RUN</span>;
  if (g.status === "inProgress") return <span className={cn(pill, "bg-[#fef9c3] text-[#a16207]")}>IP</span>;
  return <span className="text-[#cbd5e1]">&ndash;</span>;
}

const Matchup = ({ g }: { g: Game }) => (
  <span className="flex min-w-0 items-center gap-1 whitespace-nowrap font-medium">
    <span className="truncate text-muted">{g.away}</span>
    <span className="shrink-0 text-[#cbd5e1]">@</span>
    <span className="truncate text-ink">{g.home}</span>
  </span>
);

/* ─── the desktop table: app/components/GameTable.tsx, GameRow.tsx ──────── */

function TableHead() {
  return (
    <div className="srfi-cols border-b border-line bg-card t-11 font-semibold uppercase tracking-wider text-[#94a3b8]">
      <span className="px-3.5 py-3">Matchup</span>
      <span className="px-3 py-3">Away SP</span>
      <span className="px-3 py-3">Home SP</span>
      <span className="px-3 py-3">YRFI %</span>
      <span className="px-3 py-3 text-center">Bet at</span>
      <span className="py-3 text-center">Temp</span>
      <span className="py-3 text-center">Wind</span>
      <span className="py-3 text-center">Time</span>
      <span className="py-3 pr-2 text-center">Result</span>
    </div>
  );
}

function TableRow({ g, last, open }: { g: Game; last?: boolean; open?: boolean }) {
  const p = model(g).yrfi;
  return (
    <div className={cn("srfi-cols t-13 tnum", !last && "border-b border-[#f1f5f9]", open && "bg-card")}>
      <span className="min-w-0 px-3.5 py-3">
        <Matchup g={g} />
      </span>
      <span className="truncate px-3 py-3 text-secondary">{g.awaySp.name}</span>
      <span className="truncate px-3 py-3 text-secondary">{g.homeSp.name}</span>
      <span className="px-3 py-3 font-semibold" style={{ color: yrfiColor(p) }}>
        {pct2(p)}
      </span>
      <span className="whitespace-nowrap px-1 py-3 text-center font-medium text-[#334155]">{breakEven(p)} or better</span>
      <span className="py-3 text-center text-muted">{tempText(g)}</span>
      <span className="py-3 text-center text-muted">{windText(g)}</span>
      <span className="py-3 text-center text-muted">{g.time}</span>
      <span className="py-3 pr-2 text-center t-11">
        <ResultBadge g={g} />
      </span>
    </div>
  );
}

function TableGroup({ label, games }: { label: string; games: Game[] }) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="mb-2 px-3.5 t-11 font-semibold uppercase tracking-wider text-[#94a3b8]">{label}</p>
      <div className="overflow-hidden r-12 border border-line bg-ground">
        <TableHead />
        {games.map((g, i) => (
          <TableRow key={g.home} g={g} last={i === games.length - 1} />
        ))}
      </div>
    </div>
  );
}

const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const BarsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

/** The whole games screen: header, date tabs, status bar and the three groups. */
export function SharprfiSlateFull() {
  return (
    <Surface
      w={960}
      brand="sharprfi"
      label="SHARPRFI games screen: tonight's MLB slate with each game's starters, first-inning run probability, break-even price, weather and result."
      className="bg-ground"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <Wordmark size="t-30" host="t-13" />
          <span className="truncate t-13 text-[#94a3b8]">
            Books shade extra vig into public NRFI prices, so why not hunt for EV on the other side?
          </span>
        </div>
        <ModeToggle button="px-4 py-1.5 t-13" />
      </div>

      <div className="flex h-13 items-center justify-between border-b border-[#f1f5f9] px-5 t-13 font-medium">
        <div className="flex gap-2">
          <span className="r-99 bg-accent px-4 py-1.5 text-accent-ink">Today</span>
          <span className="r-99 bg-raised px-4 py-1.5 text-secondary">Tomorrow</span>
        </div>
        <div className="flex gap-2 text-secondary">
          <span className="flex items-center gap-2 r-99 bg-raised px-4 py-1.5">
            <GearIcon />
            Preferences
          </span>
          <span className="flex items-center gap-2 r-99 bg-raised px-4 py-1.5">
            <BarsIcon />
            Methodology
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-line px-5 py-2.5 t-13 text-muted tnum">
        <span className="flex gap-3">
          <span>Updated 20:48</span>
          <span>·</span>
          <span>{GAMES.length} games</span>
        </span>
        <span>Refresh</span>
      </div>

      <div className="px-5 py-6">
        <div className="mb-5 flex items-center gap-3 r-16 border border-line bg-[linear-gradient(180deg,#f8fafc,#ffffff)] px-4 py-2.5">
          <span className="shrink-0 r-99 border border-line bg-ground px-2.5 py-1 t-10 font-semibold uppercase tracking-[0.14em] text-muted">
            Matchup details
          </span>
          <span className="t-13 leading-[1.4] text-[#334155] [text-wrap:balance]">
            Tap on any matchup row for the full breakdown, and check back 30 to 60 minutes before first pitch for the
            most accurate lineups and weather statistics.
          </span>
        </div>
        <TableGroup label="Upcoming" games={UPCOMING} />
        <TableGroup label="In Progress" games={IN_PROGRESS} />
        <TableGroup label="Settled" games={SETTLED} />
      </div>
    </Surface>
  );
}

/** The slate as a fragment: the settled group, with the starters folded under each matchup. */
export function SharprfiSlate() {
  const rows = SETTLED.slice(0, 6);
  const cols = "grid grid-cols-[1fr_calc(var(--px)*56)_calc(var(--px)*92)_calc(var(--px)*64)] items-center";
  return (
    <Surface
      w={400}
      brand="sharprfi"
      label="SHARPRFI slate: six settled games, each with its starters, first-inning run probability, break-even price and whether a run scored."
      className="bg-ground"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
        <Wordmark size="t-24" host="t-11" />
        <ModeToggle button="px-3 py-1 t-12" />
      </div>
      <div className="px-3 pb-3.5 pt-4">
        <p className="mb-2 px-3 t-11 font-semibold uppercase tracking-wider text-[#94a3b8]">Settled</p>
        <div className="overflow-hidden r-12 border border-line">
          <div className={cn(cols, "border-b border-line bg-card py-2.5 t-10 font-semibold uppercase tracking-wider text-[#94a3b8]")}>
            <span className="pl-3">Matchup</span>
            <span>YRFI %</span>
            <span className="text-center">Bet at</span>
            <span className="text-center">Result</span>
          </div>
          {rows.map((g, i) => {
            const p = model(g).yrfi;
            return (
              <div key={g.home} className={cn(cols, "py-2.5 tnum", i < rows.length - 1 && "border-b border-[#f1f5f9]")}>
                <span className="min-w-0 pl-3 pr-1.5">
                  <span className="block t-13 leading-tight">
                    <Matchup g={g} />
                  </span>
                  <span className="mt-0.5 block truncate t-11 leading-tight text-[#94a3b8]">
                    {lastName(g.awaySp.name)} · {lastName(g.homeSp.name)}
                  </span>
                </span>
                <span className="t-13 font-semibold" style={{ color: yrfiColor(p) }}>
                  {pct2(p)}
                </span>
                <span className="whitespace-nowrap text-center t-12 font-medium text-[#334155]">{breakEven(p)} or better</span>
                <span className="pr-1.5 text-center t-10.5">
                  <ResultBadge g={g} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Surface>
  );
}

/* ─── the expanded row: app/components/MatchupDetail.tsx, lib/model-breakdown.ts ─ */

type Chip = { label: string; m: number; text: string };

/* The five bands of impactDescription in lib/model-breakdown.ts. */
function band(m: number, words: [string, string, string, string, string]) {
  return m <= 0.94 ? words[0] : m < 0.975 ? words[1] : m <= 1.025 ? words[2] : m < 1.06 ? words[3] : words[4];
}

function pitcherChips(f: ReturnType<typeof halfFactors>): Chip[] {
  return [
    { label: "FIP", m: f.fip, text: band(f.fip, ["excellent run prevention", "better than league-average FIP", "near average", "worse than league-average FIP", "run-prone FIP"]) },
    { label: "K%", m: f.k, text: band(f.k, ["bat-missing strikeout rate", "above-average strikeout rate", "average K rate", "below-average strikeout rate", "contact-heavy strikeout rate"]) },
    { label: "Barrel%", m: f.barrel, text: band(f.barrel, ["limits hard contact", "keeps barrel damage down", "average barrel rate", "elevated barrel rate", "gives up loud contact"]) },
  ];
}

function lineupChips(f: ReturnType<typeof halfFactors>): Chip[] {
  const chips: Chip[] = [
    { label: "Team OBP", m: f.obp, text: band(f.obp, ["low-on-base lineup", "below-average on-base profile", "average OBP", "above-average on-base profile", "constant baserunner pressure"]) },
  ];
  if (f.top !== null) {
    chips.push({ label: "Top of order", m: f.top, text: band(f.top, ["soft top of order", "lighter top-of-order threat", "average top of order", "strong top-of-order threat", "dangerous top of order"]) });
  }
  return chips;
}

function envChips(g: Game, f: ReturnType<typeof halfFactors>): Chip[] {
  const park =
    g.pf > 1.05
      ? `${((g.pf - 1) * 100).toFixed(0)}% above avg, hitter-friendly`
      : g.pf < 0.95
        ? `${((1 - g.pf) * 100).toFixed(0)}% below avg, pitcher-friendly`
        : "neutral park";
  if (g.roof) return [{ label: "Park", m: f.park, text: park }, { label: "Weather", m: 1, text: "dome / roof, weather neutral" }];
  const tf = tempFactor(g);
  const temp = `${g.tempF}°F, ${tf < 1 ? "cold suppresses scoring" : tf > 1 ? "warm boosts scoring" : "neutral"}`;
  const wind =
    g.windMph >= 10
      ? `${g.windMph} mph ${g.windDir === "in" ? "blowing in" : g.windDir === "out" ? "blowing out" : "crosswind"}`
      : g.windMph > 0
        ? `${g.windMph} mph, light`
        : "calm, no effect";
  return [
    { label: "Park", m: f.park, text: park },
    { label: "Temp", m: f.temp, text: temp },
    { label: "Wind", m: f.wind, text: wind },
  ];
}

/** A factor chip: orange pushes scoring up, blue pulls it down, slate is neutral. */
function FactorChip({ chip }: { chip: Chip }) {
  const up = chip.m > 1.025;
  const down = chip.m < 0.975;
  return (
    <span className="flex items-center gap-2 t-11.5 leading-none">
      <span
        className={cn(
          "inline-flex w-[calc(var(--px)*58)] shrink-0 items-center justify-center gap-1 r-4 border py-1 font-mono t-10.5 font-semibold tnum",
          up ? "border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]" : down ? "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]" : "border-line bg-card text-muted"
        )}
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5 shrink-0">
          {up ? <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" /> : down ? <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" /> : <path d="M2 6h8M6.5 2.5 10 6 6.5 9.5" />}
        </svg>
        {chip.m.toFixed(2)}×
      </span>
      <span className="shrink-0 font-medium text-[#334155]">{chip.label}</span>
      <span className="truncate text-[#94a3b8]">{chip.text}</span>
    </span>
  );
}

const CardLabel = ({ children }: { children: ReactNode }) => (
  <span className="block t-10 font-semibold uppercase tracking-wider text-[#94a3b8]">{children}</span>
);

const SectionHeader = ({ children }: { children: ReactNode }) => (
  <p className="t-11 font-semibold uppercase tracking-widest text-[#94a3b8]">{children}</p>
);

const Confirmed = () => (
  <span className="shrink-0 r-99 bg-[#f0fdf4] px-2 py-0.5 t-10 font-semibold text-[#15803d]">Confirmed</span>
);

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <span className={cn("block r-8 bg-card px-2 py-1.5 text-center", className)}>
      <span className="block t-10 font-semibold uppercase tracking-wider text-[#94a3b8]">{label === "λ" ? <span className="normal-case">λ</span> : label}</span>
      <span className="mt-0.5 block t-12 font-semibold text-[#334155] tnum">{value}</span>
    </span>
  );
}

/** One half inning for the tile: the starter, his lambda, and the five multipliers behind it. */
function HalfCard({ spLabel, starter, f }: { spLabel: string; starter: Starter; f: ReturnType<typeof halfFactors> }) {
  return (
    <div className="r-12 border border-line bg-ground px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0">
          <CardLabel>{spLabel}</CardLabel>
          <span className="mt-0.5 block t-13 font-semibold leading-tight text-[#1e293b]">{starter.name}</span>
          <span className="mt-1 block t-11 leading-tight text-muted tnum">
            FIP {starter.fip.toFixed(2)} · K% {(starter.k * 100).toFixed(1)}% · Barrel% {starter.barrel.toFixed(1)}%
          </span>
        </span>
        <Stat label="λ" value={lambdaOf(f).toFixed(3)} className="w-16 shrink-0" />
      </div>
      <div className="mt-2.5 grid gap-1">
        {[...pitcherChips(f), ...lineupChips(f)].map((c) => (
          <FactorChip key={c.label} chip={c} />
        ))}
      </div>
    </div>
  );
}

/** The matchup breakdown as a tile: both halves of the first and the park, as the expanded row lists them. */
export function SharprfiBreakdown() {
  const g = FEATURED;
  const m = model(g);
  return (
    <Surface
      w={440}
      brand="sharprfi"
      label={`SHARPRFI matchup breakdown for ${g.away} at ${g.home}: each half inning's expected runs and the multiplier from each input.`}
      className="bg-ground"
    >
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-4 py-2.5 tnum">
        <span className="t-14">
          <Matchup g={g} />
        </span>
        <span className="flex items-baseline gap-3">
          <span className="t-14 font-semibold" style={{ color: yrfiColor(m.yrfi) }}>
            {pct2(m.yrfi)}
          </span>
          <span className="t-12 font-medium text-[#334155]">{breakEven(m.yrfi)} or better</span>
        </span>
      </div>
      <div className="grid gap-2.5 bg-[#f8fafcb3] px-4 py-3.5">
        <SectionHeader>{g.away} batting</SectionHeader>
        <HalfCard spLabel="Home SP" starter={g.homeSp} f={m.awayBats} />
        <SectionHeader>{g.home} batting</SectionHeader>
        <HalfCard spLabel="Away SP" starter={g.awaySp} f={m.homeBats} />
        <div className="r-12 border border-line bg-ground p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <CardLabel>Park &amp; Weather</CardLabel>
            <span className="t-12 font-medium text-secondary">{g.venue}</span>
          </div>
          <div className="grid gap-1.5">
            {envChips(g, m.homeBats).map((c) => (
              <FactorChip key={c.label} chip={c} />
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

function PitcherCard({ spLabel, starter, f }: { spLabel: string; starter: Starter; f: ReturnType<typeof halfFactors> }) {
  return (
    <div className="r-12 border border-line bg-ground p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span>
          <CardLabel>{spLabel}</CardLabel>
          <span className="mt-0.5 block t-14 font-semibold text-[#1e293b]">{starter.name}</span>
        </span>
        <Confirmed />
      </div>
      <div className="mb-3 grid grid-cols-4 gap-1">
        <Stat label="FIP" value={starter.fip.toFixed(2)} />
        <Stat label="K%" value={`${(starter.k * 100).toFixed(1)}%`} />
        <Stat label="Barrel%" value={`${starter.barrel.toFixed(1)}%`} />
        <Stat label="λ" value={lambdaOf(f).toFixed(3)} />
      </div>
      <div className="grid gap-1.5">
        {pitcherChips(f).map((c) => (
          <FactorChip key={c.label} chip={c} />
        ))}
      </div>
    </div>
  );
}

function LineupCard({ team, lineup, f }: { team: string; lineup: Batter[]; f: ReturnType<typeof halfFactors> }) {
  return (
    <div className="r-12 border border-line bg-ground p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <CardLabel>{team} lineup</CardLabel>
        <Confirmed />
      </div>
      <div className="mb-3 t-12 tnum">
        <div className="grid grid-cols-[calc(var(--px)*20)_1fr_calc(var(--px)*64)_calc(var(--px)*40)] pb-1 t-10 font-semibold uppercase tracking-wider text-[#94a3b8]">
          <span>#</span>
          <span>Batter</span>
          <span className="text-right">OBP (adj)</span>
          <span className="text-right">PA</span>
        </div>
        {lineup.map((b, i) => (
          <div key={b.name} className="grid grid-cols-[calc(var(--px)*20)_1fr_calc(var(--px)*64)_calc(var(--px)*40)] border-t border-[#f1f5f9] py-0.5">
            <span className="text-[#94a3b8]">{i + 1}</span>
            <span className="font-medium text-[#334155]">{b.name}</span>
            <span className="text-right text-secondary">{b.obp.toFixed(3)}</span>
            <span className="text-right text-[#94a3b8]">{b.pa}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-1.5">
        {lineupChips(f).map((c) => (
          <FactorChip key={c.label} chip={c} />
        ))}
      </div>
    </div>
  );
}

/** The expanded row at desktop width: the table row, then starter and lineup cards for each half. */
export function SharprfiBreakdownFull() {
  const g = FEATURED;
  const m = model(g);
  return (
    <Surface
      w={880}
      brand="sharprfi"
      label={`SHARPRFI expanded row for ${g.away} at ${g.home}: starter and lineup cards for each half inning, then park and weather.`}
      className="bg-ground"
    >
      <div className="p-4">
        <div className="overflow-hidden r-12 border border-line">
          <TableHead />
          <TableRow g={g} open />
          <div className="grid gap-3 bg-[#f8fafcb3] px-6 py-4">
            <SectionHeader>{g.away} batting</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              <PitcherCard spLabel="Home SP" starter={g.homeSp} f={m.awayBats} />
              <LineupCard team={g.away} lineup={g.awayLineup ?? []} f={m.awayBats} />
            </div>
            <SectionHeader>{g.home} batting</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              <PitcherCard spLabel="Away SP" starter={g.awaySp} f={m.homeBats} />
              <LineupCard team={g.home} lineup={g.homeLineup ?? []} f={m.homeBats} />
            </div>
            <div className="r-12 border border-line bg-ground p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <CardLabel>Park &amp; Weather</CardLabel>
                <span className="t-12 font-medium text-secondary">{g.venue}</span>
              </div>
              <div className="grid gap-1.5">
                {envChips(g, m.homeBats).map((c) => (
                  <FactorChip key={c.label} chip={c} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ─── methodology: app/components/MethodologyView.tsx ───────────────────── */

/** A named quantity: an italic letter with an upright subscript. */
const Q = ({ v, s }: { v: string; s?: string }) => (
  <span>
    <i>{v}</i>
    {s ? <sub>{s}</sub> : null}
  </span>
);

const FormulaBlock = ({ children }: { children: ReactNode }) => (
  <div className="srfi-math grid grid-cols-[auto_auto_1fr] items-baseline gap-x-1.5 gap-y-1 overflow-hidden r-8 border border-line bg-card px-4 py-3 t-16 text-[#1e293b]">
    {children}
  </div>
);

const Lhs = ({ children }: { children?: ReactNode }) => <span className="text-right">{children}</span>;

/** Two formulas from the methodology page, with the plain reading of each. */
export function SharprfiMethod() {
  return (
    <Surface
      w={400}
      brand="sharprfi"
      label="SHARPRFI methodology: the formula for expected first-inning runs in one half inning, and the formula that turns two of them into the chance a run scores."
      className="bg-ground"
    >
      <div className="px-5 py-5 text-[#334155]">
        <p className="t-17 font-bold leading-tight text-ink">How the model works</p>

        <p className="mt-4 border-b border-[#f1f5f9] pb-2 t-13 font-semibold leading-snug text-ink">
          Step 1: estimate λ for each half-inning
        </p>
        <div className="mt-3">
          <FormulaBlock>
            <Lhs>
              <i>λ</i>
            </Lhs>
            <span>=</span>
            <span>
              0.3371 × <Q v="A" s="bounded" />
            </span>
            <Lhs>
              <Q v="A" s="raw" />
            </Lhs>
            <span>=</span>
            <span>
              <Q v="F" s="FIP" /> × <Q v="F" s="K" /> × <Q v="F" s="barrel" /> × <Q v="F" s="OBP" />
            </span>
            <Lhs />
            <span />
            <span>
              × <Q v="F" s="top5" /> × <Q v="F" s="park" /> × <Q v="F" s="weather" />
            </span>
            <Lhs>
              <Q v="A" s="bounded" />
            </Lhs>
            <span>=</span>
            <span>
              clamp(
              <Q v="A" s="raw" />, 0.55, 1.55)
            </span>
          </FormulaBlock>
        </div>
        <p className="mt-2.5 t-12 leading-[1.5] text-muted [text-wrap:balance]">
          Expected runs for one team in the first: a league baseline of&nbsp;0.3371, scaled by seven damped factors and
          then&nbsp;bounded.
        </p>

        <p className="mt-5 border-b border-[#f1f5f9] pb-2 t-13 font-semibold leading-snug text-ink">
          Step 2: compute P(YRFI) from both λ values
        </p>
        <div className="mt-3">
          <FormulaBlock>
            <Lhs>
              <i>P</i>(YRFI)
            </Lhs>
            <span>=</span>
            <span>
              1 − <i>P</i>(<i>H</i> = 0) <i>P</i>(<i>A</i> = 0)
            </span>
            <Lhs />
            <span>=</span>
            <span>
              1 − <i>e</i>
              <sup>
                −<i>λ</i>
                <sub>H</sub>
              </sup>{" "}
              <i>e</i>
              <sup>
                −<i>λ</i>
                <sub>A</sub>
              </sup>
            </span>
            <Lhs />
            <span>=</span>
            <span>
              1 − <i>e</i>
              <sup>
                −(<i>λ</i>
                <sub>H</sub> + <i>λ</i>
                <sub>A</sub>)
              </sup>
            </span>
          </FormulaBlock>
        </div>
        <p className="mt-2.5 t-12 leading-[1.5] text-muted [text-wrap:balance]">
          A run scores unless both halves are scoreless. Average inputs give&nbsp;49.0%, the league rate from
          2023&nbsp;to&nbsp;2025.
        </p>
      </div>
    </Surface>
  );
}

/* ─── backtest: README.md "How the Model Works", lib/model-config.ts ────── */

/* 2026-03-26 to 2026-07-05, 1,344 games, from `npm run backtest -- ... --compare-sim`. */
const BACKTEST = [
  { label: "Blend Poisson + Sim", brier: 0.2447, gap: "+1.2%", headline: true },
  { label: "Sim alone", brier: 0.2463, gap: "+3.5%" },
  { label: "Poisson alone", brier: 0.2476, gap: "−1.1%" },
  { label: "Sim + streak factors", brier: 0.2538, gap: "+7.8%" },
  { label: "Original script", brier: 0.2577, gap: "−10.3%" },
];
/* A constant 50% guess, which scores 0.25 on any sample. Computed here, not a backtest row. It was 0.4905 × 0.5095, which assumed the backtest sample's own run rate was the long-run 49.05%. */
const BASE_RATE_BRIER = 0.5 * 0.5;
const AXIS_LO = 0.2375;
const AXIS_HI = 0.2625;
const axisAt = (v: number) => `${((v - AXIS_LO) / (AXIS_HI - AXIS_LO)) * 100}%`;
const brierText = (v: number) => v.toFixed(4).replace(/^0/, "");

/** The backtest as a dot plot: five variants against the score of a constant 50% guess. */
export function SharprfiBacktest() {
  const cols = "grid grid-cols-[calc(var(--px)*118)_1fr_calc(var(--px)*40)_calc(var(--px)*52)] items-center gap-x-2.5";
  return (
    <Surface
      w={400}
      brand="sharprfi"
      label="SHARPRFI backtest over 1,344 games: Brier scores of five model variants. The blend scores .2447, against the .2500 a constant 50% guess always scores."
      className="bg-ground"
    >
      <div className="px-4 py-4">
        <div className="r-12 border border-line p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span>
              <CardLabel>Backtest</CardLabel>
              <span className="mt-0.5 block t-13 font-semibold text-[#1e293b] tnum">2026-03-26 to 2026-07-05</span>
            </span>
            <span className="shrink-0 r-99 bg-[#1e293b] px-2 py-0.5 t-10 font-semibold text-white tnum">1,344 games</span>
          </div>

          <div className={cn(cols, "mt-4 t-10 font-semibold uppercase tracking-wider text-[#94a3b8]")}>
            <span>Variant</span>
            <span className="relative h-3.5 font-medium normal-case tracking-normal tnum">
              {[0.24, 0.25, 0.26].map((t) => (
                <span key={t} className="absolute top-0 -translate-x-1/2 leading-none" style={{ left: axisAt(t) }}>
                  {t.toFixed(2).replace(/^0/, "")}
                </span>
              ))}
            </span>
            <span className="text-right">Brier</span>
            <span className="text-right">Cal gap</span>
          </div>

          <div className="mt-1 border-t border-[#f1f5f9]">
            {BACKTEST.map((r) => (
              <div key={r.label} className={cn(cols, "t-12 tnum")}>
                <span className={cn("truncate", r.headline ? "font-semibold text-ink" : "text-secondary")}>{r.label}</span>
                <span className="relative block h-7">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
                  <span className="absolute inset-y-0 border-l border-dashed border-[#94a3b8]" style={{ left: axisAt(BASE_RATE_BRIER) }} />
                  <span
                    className={cn("absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 r-99", r.headline ? "bg-accent" : "bg-[#94a3b8]")}
                    style={{ left: axisAt(r.brier) }}
                  />
                </span>
                <span className={cn("text-right font-semibold", r.headline ? "text-[#15803d]" : "text-[#334155]")}>{brierText(r.brier)}</span>
                <span className="text-right text-muted">{r.gap}</span>
              </div>
            ))}
            <div className={cn(cols, "t-11 text-muted")}>
              <span />
              <span className="relative block h-4">
                <span className="absolute top-0.5 -translate-x-1/2 whitespace-nowrap leading-none" style={{ left: axisAt(BASE_RATE_BRIER) }}>
                  always 50%: {brierText(BASE_RATE_BRIER)}
                </span>
              </span>
              <span />
              <span />
            </div>
          </div>
        </div>
        <p className="mt-3 px-1 t-11.5 leading-[1.5] text-muted [text-wrap:balance]">
          Lower is better. A constant 50% guess always scores&nbsp;{brierText(BASE_RATE_BRIER)}, so the edge is
          small, and the script reads full-season stats that include later&nbsp;games.
        </p>
      </div>
    </Surface>
  );
}

/* ─── mark ──────────────────────────────────────────────────────────────── */

/** The first-inning mark, with the wordmark as the header sets it. */
export function SharprfiMark() {
  return (
    <Surface w={400} brand="sharprfi" label="The SHARPRFI mark, a green diamond with a 1 in it, above its wordmark." className="bg-ground">
      <div className="flex flex-col items-center px-8 pb-12 pt-13">
        <Image src="/brand/sharprfi/mark.svg" alt="" width={64} height={64} unoptimized className="h-28 w-28" />
        <div className="mt-7">
          <Wordmark size="t-40" host="t-14" />
        </div>
        <p className="mt-3 t-12 text-[#94a3b8]">One model, both sides of the first inning.</p>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "sharprfi-slate",
    title: "Tonight's slate",
    caption:
      "Every game on the day with the chance a run scores in the first inning and the worst price worth betting at. The percentages here come from the Poisson engine alone; the live site averages it with a batter-level simulation.",
    tile: SharprfiSlate,
    full: SharprfiSlateFull,
  },
  {
    id: "sharprfi-breakdown",
    title: "Matchup breakdown",
    caption:
      "The expanded row for one game. Each half inning gets its own expected runs, and every input shows the multiplier it applied: the starter's FIP, strikeout and barrel rates, the lineup's on-base rate, its top five hitters, the park and the weather.",
    tile: SharprfiBreakdown,
    full: SharprfiBreakdownFull,
  },
  {
    id: "sharprfi-calculator",
    title: "Run the model",
    caption:
      "The Poisson engine with its inputs on sliders. Move a starter or a lineup and the two expected-run figures, the probability and the break-even price recompute with the constants in the repo.",
    tile: SharprfiCalculator,
  },
  {
    id: "sharprfi-method",
    title: "Methodology",
    caption:
      "The two formulas at the centre of the methodology page: expected runs for a half inning, and the chance at least one run scores across both.",
    tile: SharprfiMethod,
  },
  {
    id: "sharprfi-backtest",
    title: "Backtest",
    caption:
      "Brier scores for five variants over 1,344 games in 2026. The blend won at 0.2447, a small edge over the 0.2500 that a constant 50% guess always scores, and the backtest reads season stats that include later games.",
    tile: SharprfiBacktest,
  },
  {
    id: "sharprfi-mark",
    title: "Mark",
    caption: "The mark is a diamond with a 1 in it, for the first inning, beside the wordmark as the site's header sets it.",
    tile: SharprfiMark,
  },
];
