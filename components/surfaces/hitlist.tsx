import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Surface } from "./kit";
import type { SurfaceDef } from "./types";
import "./hitlist.css";

/*
  Hitlist, rebuilt from the hitlist repo's own screens.

  The page is Tailwind's gray-950 with gray-900 panels, Inter for text, the
  default mono stack for figures and a serif math stack for formulas. Every
  colour class below is the one the real component uses, so the values match
  its build: app/page.tsx, app/components/TopPlays.tsx, MatchupTable.tsx,
  MatchupRow.tsx, ScoringLogicContent.tsx, Formula.tsx, StatusBar.tsx,
  Filters.tsx and app/opengraph-image.tsx.

  The hitters and pitchers are real. The career lines are sample data. Every
  derived figure (average, OPS, score, expected at bats, hit chance, the
  pairing of the doubles) is computed below with the formulas in lib/utils.ts
  and lib/stats.ts.
*/

/* ─── the repo's formulas ─────────────────────────────────────────────────── */

/** lib/utils.ts, expectedAtBats(): at bats by lineup slot. */
const expectedAtBats = (slot: number) => (slot <= 3 ? 4.45 : slot === 4 ? 4.25 : slot <= 6 ? 4.05 : 3.85);

/** lib/utils.ts, regressedAvg(): pulled toward .320 as if 50 more at bats came with it. */
const regressedAvg = (avg: number, ab: number) => {
  const weight = ab / (ab + 50);
  return weight * avg + (1 - weight) * 0.32;
};

/** lib/utils.ts, hitProbability(): at least one hit in that many at bats. */
const hitProbability = (avg: number, atBats: number) => 1 - Math.pow(1 - avg, atBats);

/** lib/utils.ts, topPlayScore(): average, discounted until 30 at bats. */
const topPlayScore = (avg: number, ab: number) => avg * Math.min(ab / 30, 1);

/** lib/stats.ts, assignConfidence(). */
const assignConfidence = (ab: number) => (ab >= 21 ? "high" : ab >= 18 ? "medium" : "low");

type Line = {
  batter: string;
  team: string;
  pitcher: string;
  opp: string;
  time: string;
  slot: number;
  ab: number;
  h: number;
  doubles: number;
  triples: number;
  hr: number;
  bb: number;
  hbp: number;
  sf: number;
};

/* Sample career lines against the day's probable starter. */
const LINES: Line[] = [
  { batter: "Freddie Freeman", team: "LAD", pitcher: "Aaron Nola", opp: "PHI", time: "6:40 PM EDT", slot: 3, ab: 70, h: 27, doubles: 7, triples: 0, hr: 4, bb: 9, hbp: 1, sf: 1 },
  { batter: "Jose Altuve", team: "HOU", pitcher: "Kevin Gausman", opp: "TOR", time: "7:07 PM EDT", slot: 2, ab: 38, h: 14, doubles: 2, triples: 0, hr: 1, bb: 2, hbp: 0, sf: 0 },
  { batter: "Yandy Díaz", team: "TB", pitcher: "Nathan Eovaldi", opp: "TEX", time: "8:05 PM EDT", slot: 1, ab: 33, h: 12, doubles: 3, triples: 0, hr: 0, bb: 3, hbp: 0, sf: 0 },
  { batter: "Salvador Perez", team: "KC", pitcher: "Tanner Bibee", opp: "CLE", time: "8:40 PM EDT", slot: 4, ab: 32, h: 11, doubles: 3, triples: 0, hr: 1, bb: 1, hbp: 0, sf: 0 },
];

/** lib/stats.ts, calcStats(), then the Top 4 figures from TopPlays.tsx. */
function enrich(l: Line) {
  const singles = l.h - l.doubles - l.triples - l.hr;
  const avg = l.h / l.ab;
  const slg = (singles + l.doubles * 2 + l.triples * 3 + l.hr * 4) / l.ab;
  const obp = (l.h + l.bb + l.hbp) / (l.ab + l.bb + l.hbp + l.sf);
  const expectedAB = expectedAtBats(l.slot);
  return {
    ...l,
    avg,
    ops: obp + slg,
    confidence: assignConfidence(l.ab),
    score: topPlayScore(avg, l.ab),
    expectedAB,
    hitPct: hitProbability(regressedAvg(avg, l.ab), expectedAB),
  } as const;
}

type Play = ReturnType<typeof enrich>;

/** lib/utils.ts, sortTopPlays(): score, then average, then at bats. */
const TOP: Play[] = LINES.map(enrich).sort((a, b) => b.score - a.score || b.avg - a.avg || b.ab - a.ab);

/** lib/utils.ts, isSmashDouble(). */
const isSmash = (a: Play, b: Play) => a.ops > 0.95 && b.ops > 0.95 && a.h >= 7 && b.h >= 7;

type Double = { legs: [Play, Play]; combined: number; smash: boolean };

const pair = (a: Play, b: Play): Double => ({
  legs: a.hitPct >= b.hitPct ? [a, b] : [b, a],
  combined: a.hitPct * b.hitPct,
  smash: isSmash(a, b),
});

/**
 * lib/utils.ts, suggestRecommendedDoubles(): with four plays, the three ways
 * to split them into two pairs are compared. A split with a Smash Double
 * wins, then the split whose lead pair has the higher combined chance.
 */
const DOUBLES: Double[] = (
  [
    [pair(TOP[0], TOP[1]), pair(TOP[2], TOP[3])],
    [pair(TOP[0], TOP[2]), pair(TOP[1], TOP[3])],
    [pair(TOP[0], TOP[3]), pair(TOP[1], TOP[2])],
  ] as Double[][]
)
  .map((split) => [...split].sort((a, b) => Number(b.smash) - Number(a.smash) || b.combined - a.combined))
  .sort(
    (a, b) =>
      b.filter((d) => d.smash).length - a.filter((d) => d.smash).length ||
      b[0].combined - a[0].combined ||
      b[1].combined - a[1].combined,
  )[0];

/** TopPlays.tsx, getDoubleLabel(). */
const doubleLabel = (d: Double, i: number) => (d.smash ? "Smash Double" : i === 0 ? "Daily Double" : "Secondary Double");

/** lib/utils.ts, buildRecommendationTags(): the double's tag first, then T4. */
const tagsFor = (p: Play): Tag[] => {
  const i = DOUBLES.findIndex((d) => d.legs.includes(p));
  const d = DOUBLES[i];
  return [d.smash ? "SMASH" : i === 0 ? "DD" : "SD", "T4"];
};

const f3 = (n: number) => n.toFixed(3);
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

/* ─── shared pieces ───────────────────────────────────────────────────────── */

/* TopPlays.tsx, CONFIDENCE_COLORS. */
const CONF_TEXT = { high: "text-green-400", medium: "text-yellow-400", low: "text-red-400" } as const;

/** app/components/lineupBadge.ts, in the Top 4 style: small caps on gray-800. */
function LineupBadge({ slot }: { slot: number }) {
  return (
    <span className="inline-flex shrink-0 whitespace-nowrap r-4 bg-gray-800 px-1.5 py-0.5 t-10 font-semibold uppercase leading-[1.5] tracking-wide text-gray-300">
      Confirmed #{slot}
    </span>
  );
}

/** app/components/InfoTooltip.tsx, the closed state. */
function Info() {
  return (
    <span className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center r-7 border border-gray-600 t-10 font-bold leading-none tracking-normal text-gray-500">
      i
    </span>
  );
}

type Tag = "SMASH" | "DD" | "SD" | "T4";

/* app/components/RecommendationTagBadge.tsx, TAG_STYLES. */
const TAG_STYLES: Record<Tag, string> = {
  SMASH: "border-orange-500/30 bg-orange-950/60 text-orange-300",
  DD: "border-emerald-500/30 bg-emerald-950/60 text-emerald-300",
  SD: "border-sky-500/30 bg-sky-950/60 text-sky-300",
  T4: "border-slate-600/60 bg-slate-900/80 text-slate-300",
};

function Tags({ tags, compact }: { tags: Tag[]; compact?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex shrink-0 items-center whitespace-nowrap r-4 border font-semibold uppercase leading-[1.5]",
            compact ? "px-1 py-0.5 t-8 tracking-[0.12em]" : "px-1.5 py-0.5 t-10 tracking-[0.18em]",
            TAG_STYLES[tag],
          )}
        >
          {tag}
        </span>
      ))}
    </span>
  );
}

/** MatchupRow.tsx, ResultBadge. A play that has not hit yet shows a dash. */
function Result({ hit, className }: { hit: boolean; className?: string }) {
  return hit ? (
    <span className={cn("inline-flex r-4 bg-green-900/40 px-1.5 py-0.5 font-medium leading-[1.4] text-green-400", className)}>HIT</span>
  ) : (
    <span className={cn("inline-flex r-4 bg-gray-800 px-1.5 py-0.5 font-medium leading-[1.4] text-gray-500", className)}>–</span>
  );
}

/* ─── Top 4 plays ─────────────────────────────────────────────────────────── */

const LOCKED_COPY = "Started plays stay tracked after first pitch while the upcoming board keeps preferring the best available options.";

/* The same sentence broken at its phrases for the narrow panel, so it never wraps mid-phrase. */
const LOCKED_LINES = ["Started plays stay tracked after first pitch", "while the upcoming board keeps preferring", "the best available options."];

/** Text set on fixed lines. A surface scales as one piece, so the breaks hold at every size. */
function Lines({ lines, className }: { lines: readonly string[]; className?: string }) {
  return (
    <p className={cn("whitespace-nowrap", className)}>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

/** TopPlays.tsx, the layout the app uses below its `sm` breakpoint. */
function TopPlayCard({ p, i }: { p: Play; i: number }) {
  return (
    <li className="px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="bvp-mono w-4 shrink-0 t-12 text-sky-400">{i + 1}.</span>
        <span className="min-w-0 flex-1 truncate t-14 font-medium text-white">{p.batter}</span>
        <span className={cn("bvp-mono shrink-0 t-14 font-bold", CONF_TEXT[p.confidence])}>{f3(p.avg)}</span>
      </div>
      <div className="mt-0.5 flex min-w-0 items-center gap-2 pl-6">
        <span className="min-w-0 flex-1 truncate t-12 text-gray-400">vs {p.pitcher}</span>
        <LineupBadge slot={p.slot} />
      </div>
      <div className="mt-1 flex items-center gap-2 whitespace-nowrap pl-6 t-11">
        <span className="bvp-mono shrink-0 text-gray-400">Est. {p.expectedAB.toFixed(1)} AB</span>
        <span className="shrink-0 t-12 font-semibold text-green-300">{pct(p.hitPct)}</span>
        <span className="ml-auto shrink-0 t-12 text-gray-600">{p.time}</span>
      </div>
    </li>
  );
}

/** The Top 4 panel as the app draws it on a phone. */
export function BvpTopPlays() {
  return (
    <Surface
      w={380}
      brand="hitlist"
      label="Hitlist Top 4 plays: four hitters ranked by career average against today's starter, each with lineup slot, expected at bats and hit chance."
      className="bg-ground"
    >
      <div className="p-3">
        <div className="r-8 bg-gray-900 pt-4">
          <div className="px-4">
            <h3 className="t-14 font-semibold uppercase tracking-wider text-gray-400">Top 4 Plays</h3>
            <Lines lines={LOCKED_LINES} className="mt-1 t-12 leading-[1.667] text-gray-500" />
            <div className="mt-3 flex items-center justify-center gap-2 whitespace-nowrap r-24 border border-slate-700 bg-slate-950/90 px-4 py-2.5 t-14 font-semibold text-slate-200">
              <span>Show Me the Math</span>
              <span>→</span>
            </div>
          </div>
          <ol className="mt-3 divide-y divide-gray-800/40 pb-1.5">
            {TOP.map((p, i) => (
              <TopPlayCard key={p.batter} p={p} i={i} />
            ))}
          </ol>
        </div>
      </div>
    </Surface>
  );
}

/** TopPlays.tsx, one play on the single row the app uses on a desk. */
function TopPlayRow({ p, i }: { p: Play; i: number }) {
  return (
    <li className="flex items-baseline gap-3 whitespace-nowrap t-14">
      <span className="bvp-mono w-4 text-sky-400">{i + 1}.</span>
      <span className="font-medium text-white">{p.batter}</span>
      <LineupBadge slot={p.slot} />
      <span className="text-gray-400">vs {p.pitcher}</span>
      <span className={cn("bvp-mono font-bold", CONF_TEXT[p.confidence])}>{f3(p.avg)} AVG</span>
      <span className="bvp-mono text-gray-500">{p.ab} AB</span>
      <span className="text-gray-700">·</span>
      <span className="bvp-mono text-gray-400">Est. {p.expectedAB.toFixed(1)} AB</span>
      <span className="font-semibold text-green-300">{pct(p.hitPct)}</span>
      <span className="ml-auto t-12 text-gray-600">{p.time}</span>
    </li>
  );
}

/** TopPlays.tsx, a doubles card. `wide` is the one row per leg layout. */
function DoubleCard({ d, i, wide }: { d: Double; i: number; wide?: boolean }) {
  const tone = d.smash ? "border-orange-500/50 bg-orange-950/20" : i === 0 ? "border-gray-800 bg-gray-950" : "border-slate-800 bg-slate-950/80";
  const accent = d.smash ? "text-orange-400" : i === 0 ? "text-yellow-400" : "text-slate-300";
  return (
    <div className={cn("r-8 border p-3", tone)}>
      {/* The app lets the note drop under the label when it runs out of room. On a phone it always sits under. */}
      <div className={cn("flex gap-x-2 gap-y-1", wide ? "items-center" : "flex-col")}>
        <div className={cn("flex items-center whitespace-nowrap t-10 font-semibold uppercase tracking-wider", accent)}>
          {doubleLabel(d, i)}
          <Info />
        </div>
        <div className="whitespace-nowrap t-10 text-gray-500">Locked from the official Top 4 at first pitch.</div>
      </div>

      <div className="mt-3 space-y-2">
        {d.legs.map((leg, n) =>
          wide ? (
            <div key={leg.batter} className="flex items-baseline gap-3 whitespace-nowrap t-14">
              <span className="bvp-mono w-4 shrink-0 t-12 text-gray-500">#{n + 1}</span>
              <span className="font-medium text-white">{leg.batter}</span>
              <span className="t-12 text-gray-500">vs {leg.pitcher}</span>
              <span className={cn("bvp-mono font-bold", CONF_TEXT[leg.confidence])}>{f3(leg.avg)} AVG</span>
              <span className={cn("bvp-mono t-12", d.smash ? "text-orange-300" : "text-gray-500")}>{f3(leg.ops)} OPS</span>
              <span className="bvp-mono t-12 text-gray-600">{leg.ab} AB</span>
              <span className="t-12 font-semibold text-green-300">{pct(leg.hitPct)} hit chance</span>
            </div>
          ) : (
            <div key={leg.batter}>
              <div className="flex items-center gap-2">
                <span className="bvp-mono w-4 shrink-0 t-12 text-gray-500">#{n + 1}</span>
                <span className="min-w-0 flex-1 truncate t-14 font-medium text-white">{leg.batter}</span>
                <span className={cn("bvp-mono shrink-0 t-14 font-bold", CONF_TEXT[leg.confidence])}>{f3(leg.avg)} AVG</span>
              </div>
              <div className="mt-0.5 truncate pl-6 t-12 text-gray-500">vs {leg.pitcher}</div>
              <div className="mt-0.5 flex items-center justify-between gap-3 whitespace-nowrap pl-6">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cn("bvp-mono shrink-0 t-12", d.smash ? "text-orange-300" : "text-gray-400")}>{f3(leg.ops)} OPS</span>
                  <span className="bvp-mono shrink-0 t-12 text-gray-500">
                    {leg.h}/{leg.ab}
                  </span>
                </div>
                <span className="shrink-0 t-12 font-semibold text-green-300">{pct(leg.hitPct)} hit chance</span>
              </div>
            </div>
          ),
        )}
      </div>

      <div className={cn("mt-3 border-t pt-2 whitespace-nowrap t-14 font-semibold text-green-300", d.smash ? "border-orange-500/20" : "border-gray-800")}>
        Combined: {pct(d.combined)}
      </div>
    </div>
  );
}

/** The page from its title down to the doubles, as it reads on a desk. */
export function BvpTopPlaysFull() {
  return (
    <Surface
      w={960}
      brand="hitlist"
      label="Hitlist page: title, date bar with refresh, the Top 4 plays and the Daily Double and Secondary Double built from them."
      className="bg-ground"
    >
      <div className="px-8 pb-8 pt-7">
        <h3 className="flex items-center gap-2.5 t-24 font-bold leading-[1.33] tracking-tight text-white">
          <Image src="/brand/hitlist/mark.svg" alt="" width={64} height={64} unoptimized className="h-7 w-7" />
          Hitlist
        </h3>
        <p className="mt-1 text-pretty t-14 leading-[1.45] text-gray-400">
          Daily <span className="font-semibold text-white">batter versus pitcher stats</span> for the{" "}
          <span className="font-semibold text-white">Player to Record a Hit</span> prop (1+ hits / over 0.5 hits). Matchups are ranked by
          career BvP batting average weighted by sample size so the board stays focused on the strongest historical hit matchups.
        </p>

        <div className="mt-6 flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span className="t-14 font-medium text-white">Monday, Jul 6</span>
            <span className="t-20 leading-none text-gray-300">›</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-baseline gap-1.5">
              <span className="t-10 font-semibold uppercase tracking-wider text-gray-600">Now</span>
              <span className="bvp-mono t-12 text-gray-400">6:02:17 PM EDT</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="t-10 font-semibold uppercase tracking-wider text-gray-600">Updated</span>
              <span className="bvp-mono t-12 text-gray-400">6:02 PM EDT</span>
            </div>
            <span className="t-12 text-gray-600">8 games scanned</span>
            <span className="flex items-center gap-1.5 r-4 bg-blue-600 px-4 py-1.5 t-12 font-semibold text-white">
              <span>↻</span>
              <span>Refresh</span>
            </span>
          </div>
        </div>

        <div className="mt-4 r-8 bg-gray-900 p-4">
          <h4 className="t-14 font-semibold uppercase tracking-wider text-gray-400">Top 4 Plays</h4>
          <p className="mt-1 t-12 leading-[1.667] text-gray-500">{LOCKED_COPY}</p>

          <div className="bvp-panel mt-3 grid grid-cols-[1fr_auto_1fr] items-center r-28 border border-slate-700/90 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
            <div />
            <div className="whitespace-nowrap t-11 font-semibold uppercase tracking-[0.32em] text-slate-200">Scoring and Selection Logic</div>
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-2 r-20 border border-slate-600/70 bg-slate-950/75 px-3 py-2 text-slate-300">
                <span className="t-10 font-semibold uppercase tracking-[0.24em]">Expand</span>
                <Chevron />
              </span>
            </div>
          </div>

          <ol className="mt-4 space-y-2">
            {TOP.map((p, i) => (
              <TopPlayRow key={p.batter} p={p} i={i} />
            ))}
          </ol>

          <div className="mt-4 space-y-3">
            {DOUBLES.map((d, i) => (
              <DoubleCard key={d.legs[0].batter} d={d} i={i} wide />
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** TopPlays.tsx, the chevron on the collapse control. */
function Chevron({ up }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn("h-4 w-4 shrink-0", up && "rotate-180")}>
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Daily Double ────────────────────────────────────────────────────────── */

/** The two parlay cards under the Top 4, inside the same gray-900 panel. */
export function BvpDoubles() {
  return (
    <Surface
      w={380}
      brand="hitlist"
      label="Hitlist Daily Double and Secondary Double: two parlays of two hitters each, with each leg's hit chance and the combined chance."
      className="bg-gray-900"
    >
      <div className="space-y-3 p-4">
        {DOUBLES.map((d, i) => (
          <DoubleCard key={d.legs[0].batter} d={d} i={i} />
        ))}
      </div>
    </Surface>
  );
}

/* ─── Scoring logic ───────────────────────────────────────────────────────── */

/* Formula.tsx: Formula, Fraction and Sup. */
function Formula({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("bvp-math flex flex-wrap items-center gap-x-1.5 gap-y-1 whitespace-nowrap t-15 leading-[1.6]", className)}>{children}</span>;
}

function Fraction({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 flex-col items-center justify-center leading-none">
      <span className="border-b border-current px-1">{top}</span>
      <span className="px-1 pt-0.5">{bottom}</span>
    </span>
  );
}

/* ScoringLogicContent.tsx, the four SymbolCard texts, broken at their phrases. */
const SYMBOLS = [
  { label: "AVG", title: "Career BvP batting", accent: "text-sky-300", lines: ["The batter's historical", "batting average against", "today's pitcher.", "Higher is better."] },
  { label: "AB", title: "Career sample size", accent: "text-cyan-300", lines: ["Official at-bats against", "this pitcher. More AB means", "the matchup history is", "more trustworthy."] },
  { label: "P", title: "Hit probability", accent: "text-lime-300", lines: ["Estimated chance the batter", "records at least one hit", "after regression and", "batting order adjustments."] },
  { label: "E[AB]", title: "Expected at-bats", accent: "text-amber-300", lines: ["Projected chances based on", "confirmed lineup slot, or an", "estimated slot when lineup", "is not official."] },
] as const;

function SymbolCard({ s }: { s: (typeof SYMBOLS)[number] }) {
  return (
    <div className="r-18 border border-slate-700/70 bg-slate-950/80 px-3 py-3 shadow-[inset_0_1px_0_rgba(148,163,184,0.06)]">
      <div className={cn("bvp-math t-15 font-semibold leading-[1.4]", s.accent)}>{s.label}</div>
      <div className="mt-1 whitespace-nowrap t-13 font-semibold leading-[1.5] text-slate-100">{s.title}</div>
      <Lines lines={s.lines} className="mt-1.5 t-12 leading-[1.55] text-slate-400" />
    </div>
  );
}

function FormulaBlock({ title, accent, children, className }: { title: ReactNode; accent: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("bvp-block flex flex-col r-20 border border-slate-700/60 p-4", className)}>
      <div className={cn("mb-3 t-10 font-semibold uppercase tracking-[0.28em]", accent)}>{title}</div>
      <div className="flex flex-1 flex-col gap-2.5 text-slate-100">{children}</div>
    </div>
  );
}

const NOTE = "text-pretty t-13 leading-[1.55] text-slate-400";
const SMALL = "t-13 text-slate-400";

function RankingBlock() {
  return (
    <FormulaBlock title="Ranking" accent="text-sky-300">
      <Formula className="text-slate-50">
        <span>score</span>
        <span>=</span>
        <span>AVG</span>
        <span>×</span>
        <span>confidence</span>
      </Formula>
      <Formula className="text-slate-200">
        <span>confidence</span>
        <span>=</span>
        <span>min(</span>
        <Fraction top="AB" bottom="30" />
        <span>, 1)</span>
      </Formula>
      <Formula className={SMALL}>
        <span>sort</span>
        <span>=</span>
        <span>score ↓, AVG ↓, AB ↓</span>
      </Formula>
      <p className={NOTE}>The ranking score rewards both a strong AVG and enough AB to trust the matchup.</p>
    </FormulaBlock>
  );
}

function RegressionBlock() {
  return (
    <FormulaBlock title="Regression" accent="text-emerald-300">
      <Formula className="text-slate-50">
        <span>adjusted AVG</span>
        <span>=</span>
        <Fraction top="AB" bottom="AB + 50" />
        <span>×</span>
        <span>AVG</span>
        <span>+</span>
        <Fraction top="50" bottom="AB + 50" />
        <span>×</span>
        <span>0.320</span>
      </Formula>
      <Formula className={SMALL}>
        <span>w</span>
        <span>=</span>
        <Fraction top="AB" bottom="AB + 50" />
      </Formula>
      <Formula className={SMALL}>
        <span>adjusted AVG</span>
        <span>=</span>
        <span>w × AVG + (1 − w) × 0.320</span>
      </Formula>
      <p className={NOTE}>Small samples get pulled toward .320 so a hot but tiny BvP line does not overpower the board.</p>
    </FormulaBlock>
  );
}

function ExpectedBlock() {
  return (
    <FormulaBlock title="Expected At-Bats" accent="text-amber-300">
      <div className="bvp-math t-15 leading-[1.6] text-slate-50">
        <div>slot = confirmed slot</div>
        <div>or estimated slot</div>
      </div>
      <div className="bvp-math grid grid-cols-2 gap-x-4 gap-y-1.5 t-14 leading-[1.45] text-slate-200">
        <div className="whitespace-nowrap">E[AB] = 4.45, slot ≤ 3</div>
        <div className="whitespace-nowrap">E[AB] = 4.25, slot = 4</div>
        <div className="whitespace-nowrap">E[AB] = 4.05, slot 5-6</div>
        <div className="whitespace-nowrap">E[AB] = 3.85, slot ≥ 7</div>
      </div>
      <p className={NOTE}>Batters near the top of the order are projected for more trips to the plate, which lifts hit probability.</p>
    </FormulaBlock>
  );
}

function HitChanceBlock() {
  return (
    <FormulaBlock title="Hit Chance" accent="text-lime-300">
      <Formula className="text-slate-50">
        <span>P(≥1 hit)</span>
        <span>=</span>
        <span>
          1 − (1 − adjusted AVG)<sup className="ml-0.5 t-10.5 leading-none">E[AB]</sup>
        </span>
      </Formula>
      <Formula className={SMALL}>
        <span>Top 4 hit %</span>
        <span>=</span>
        <span>100 × P(≥1 hit)</span>
      </Formula>
      <p className={NOTE}>This is the probability-style view of the matchup, which is why it is useful for building doubles.</p>
    </FormulaBlock>
  );
}

function DoubleBlock() {
  return (
    <FormulaBlock title="Double Selection" accent="text-yellow-300">
      <Formula className="text-slate-50">
        <span>P(double)</span>
        <span>=</span>
        <span>P₁ × P₂</span>
      </Formula>
      <Formula className="text-slate-200">
        <span>with 4 plays</span>
        <span>=</span>
        <span>best Top 4 split</span>
      </Formula>
      <Formula className={SMALL}>
        <span>with 2-3 plays</span>
        <span>=</span>
        <span>best single pair only</span>
      </Formula>
      <p className={NOTE}>When four locked plays qualify by first pitch, the board compares the possible pairings and promotes the strongest lead double.</p>
    </FormulaBlock>
  );
}

function SmashBlock() {
  return (
    <FormulaBlock title="Smash Priority" accent="text-orange-300">
      <div className="bvp-math space-y-0.5 t-15 leading-[1.6] text-slate-50">
        <div>smash = (OPS₁ &gt; .950 ∧ H₁ ≥ 7)</div>
        <div className="pl-16 text-slate-300">and</div>
        <div className="pl-14">(OPS₂ &gt; .950 ∧ H₂ ≥ 7)</div>
      </div>
      <Formula className={SMALL}>
        <span>if smash exists</span>
        <span>=</span>
        <span>smash first, leftovers second</span>
      </Formula>
      <p className={NOTE}>A Smash Double overrides the normal ordering because both legs clear the stronger OPS and hit-history thresholds.</p>
    </FormulaBlock>
  );
}

/** The scoring panel: the four symbol cards and the ranking formula. */
export function BvpScoring() {
  return (
    <Surface
      w={420}
      brand="hitlist"
      label="Hitlist scoring and selection logic: the four inputs (AVG, AB, P, expected at bats) and the ranking formula, score equals AVG times the smaller of AB over 30 and 1."
      className="bvp-panel"
    >
      <div className="p-4 pt-5">
        <div className="whitespace-nowrap text-center t-11 font-semibold uppercase tracking-[0.32em] text-slate-200">Scoring and Selection Logic</div>
        <div className="mt-5 t-11 font-semibold uppercase tracking-[0.22em] text-slate-500">Key Symbols</div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {SYMBOLS.map((s) => (
            <SymbolCard key={s.label} s={s} />
          ))}
        </div>
        <div className="mt-3">
          <RankingBlock />
        </div>
      </div>
    </Surface>
  );
}

/** The whole panel as it opens inside the Top 4 section on a desk. */
export function BvpScoringFull() {
  return (
    <Surface
      w={960}
      brand="hitlist"
      label="Hitlist scoring and selection logic in full: the four inputs and six formula panels for ranking, regression, expected at bats, hit chance, double selection and Smash priority."
      className="bg-gray-900"
    >
      <div className="p-4">
        <div className="bvp-panel r-28 border border-slate-700/90 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div />
            <div className="whitespace-nowrap t-11 font-semibold uppercase tracking-[0.32em] text-slate-200">Scoring and Selection Logic</div>
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-2 r-20 border border-slate-600/70 bg-slate-950/75 px-3 py-2 text-slate-300">
                <span className="t-10 font-semibold uppercase tracking-[0.24em]">Collapse</span>
                <Chevron up />
              </span>
            </div>
          </div>

          <div className="mt-4 t-11 font-semibold uppercase tracking-[0.22em] text-slate-500">Key Symbols</div>
          <p className="mt-1 t-14 leading-[1.7] text-slate-400">These are the inputs that appear throughout the formulas below.</p>

          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {SYMBOLS.map((s) => (
              <SymbolCard key={s.label} s={s} />
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <RankingBlock />
            <RegressionBlock />
            <ExpectedBlock />
            <HitChanceBlock />
            <DoubleBlock />
            <SmashBlock />
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ─── Board ───────────────────────────────────────────────────────────────── */

/*
  The same slate at 8:20 PM. The app only keeps the tracked Top 4 in its
  tables and moves each play from Upcoming to In progress to Settled, so by
  now three of the four have started. Hits so far are sample results.
*/
const LIVE = TOP.slice(0, 3);
const UPCOMING = TOP.slice(3);
const HAS_HIT: Record<string, boolean> = { "Freddie Freeman": true, "Jose Altuve": true, "Yandy Díaz": false };

/** MatchupTable.tsx, the card list the app uses below its `sm` breakpoint. */
export function BvpBoard() {
  return (
    <Surface
      w={380}
      brand="hitlist"
      label="Hitlist in progress table: three tracked Top 4 plays whose games have started, with career average, hits per at bats, lineup slot and whether the hit has landed."
      className="bg-gray-900"
    >
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <h3 className="t-14 font-semibold uppercase tracking-wider text-gray-400">In progress</h3>
        <span className="whitespace-nowrap t-12 text-gray-600">3 of 3 matchups</span>
      </div>
      <div className="border-b border-gray-800 px-4 py-3">
        <span className="block t-11 font-semibold uppercase tracking-wider text-gray-600">Sort</span>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {["AVG", "AB", "Time ↑"].map((label) => (
            <span
              key={label}
              className={cn(
                "whitespace-nowrap r-8 border px-2.5 py-2 text-center t-12",
                label.startsWith("Time") ? "border-blue-500/50 bg-blue-600/20 text-blue-400" : "border-gray-700 text-gray-500",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-800/60">
        {LIVE.map((p) => (
          <div key={p.batter} className="border-l-green-500 px-4 py-3 [border-left-width:calc(var(--px)*4)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="truncate t-14 font-medium text-white">{p.batter}</div>
                  <Tags tags={tagsFor(p)} />
                </div>
                <div className="bvp-mono mt-0.5 t-12 text-gray-500">{p.team}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2 whitespace-nowrap pt-0.5">
                <div className="flex items-center gap-1">
                  <span className="t-10 font-semibold uppercase tracking-wide text-gray-600">Result</span>
                  <Result hit={HAS_HIT[p.batter]} className="t-12" />
                </div>
                <span className={cn("bvp-mono t-14 font-bold", CONF_TEXT[p.confidence])}>{f3(p.avg)}</span>
              </div>
            </div>
            <div className="mt-1.5 flex items-start justify-between gap-3 t-12">
              <div className="min-w-0 flex-1">
                <div className="truncate text-gray-400">{p.pitcher}</div>
                <div className="bvp-mono mt-0.5 text-gray-600">{p.opp}</div>
              </div>
              <div className="shrink-0 whitespace-nowrap text-right leading-snug">
                <span className="font-medium text-amber-400">Live</span>
                <span className="mt-0.5 block text-gray-500">Started {p.time}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 whitespace-nowrap t-12 text-gray-500">
              <span className="bvp-mono">
                {p.h}/{p.ab} AB
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="t-10 font-semibold uppercase tracking-wide text-gray-600">Lineup</span>
                <span className="r-4 bg-gray-800 px-1.5 py-0.5 font-medium text-gray-400">Confirmed #{p.slot}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

/* MatchupTable.tsx, COLUMNS, narrowed in proportion to fit this width. */
const COLS = "grid grid-cols-[calc(var(--px)*228)_calc(var(--px)*170)_calc(var(--px)*60)_calc(var(--px)*38)_calc(var(--px)*38)_calc(var(--px)*64)_calc(var(--px)*142)_1fr_calc(var(--px)*68)] items-center";

function DeskTable({ title, rows, kind }: { title: string; rows: Play[]; kind: "upcoming" | "inProgress" }) {
  const head = "py-2 t-12 font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap";
  const icon = (active?: boolean) =>
    active ? <span className="ml-1 text-blue-400">↑</span> : <span className="ml-1 text-gray-700">↕</span>;
  return (
    <div className="overflow-hidden r-8 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <h4 className="t-14 font-semibold uppercase tracking-wider text-gray-400">{title}</h4>
        <span className="whitespace-nowrap t-12 text-gray-600">
          {rows.length} of {rows.length} matchups
        </span>
      </div>
      <div className={cn(COLS, "bg-gray-800/60")}>
        <span className={cn(head, "px-3")}>Batter{icon()}</span>
        <span className={cn(head, "px-3")}>Pitcher{icon()}</span>
        <span className={cn(head, "text-center")}>AVG{icon()}</span>
        <span className={cn(head, "text-center")}>H{icon()}</span>
        <span className={cn(head, "text-center")}>AB{icon()}</span>
        <span className={cn(head, "text-center")}>OPS{icon()}</span>
        <span className={cn(head, "px-4")}>Game{icon(true)}</span>
        <span className={cn(head, "text-center")}>Lineup{icon()}</span>
        <span className={cn(head, "text-center")}>{kind === "inProgress" ? "Result" : ""}</span>
      </div>
      {rows.map((p) => (
        <div key={p.batter} className={cn(COLS, "border-t border-green-900/40 bg-green-950/20 t-14")}>
          <span className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap px-3 py-2 font-medium text-white">
            <span className="truncate">{p.batter}</span>
            <span className="shrink-0 t-11 font-normal text-gray-600">[{p.team}]</span>
            <Tags tags={tagsFor(p)} compact />
          </span>
          <span className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap px-3 py-2 text-gray-400">
            <span className="truncate">{p.pitcher}</span>
            <span className="shrink-0 t-11 text-gray-600">[{p.opp}]</span>
          </span>
          <span className={cn("bvp-mono text-center font-bold", CONF_TEXT[p.confidence])}>{f3(p.avg)}</span>
          <span className="bvp-mono text-center text-gray-300">{p.h}</span>
          <span className="bvp-mono text-center text-gray-400">{p.ab}</span>
          <span className="bvp-mono text-center text-gray-500">{f3(p.ops)}</span>
          <span className="whitespace-nowrap px-4 t-11 leading-none text-gray-500">
            {kind === "inProgress" ? (
              <>
                <span className="font-medium text-amber-400">Live</span>
                <span className="mx-1 text-gray-700">•</span>
                <span>{p.time}</span>
              </>
            ) : (
              <span className="text-sky-300/90">{p.time}</span>
            )}
          </span>
          <span className="flex justify-center">
            <span className="inline-flex whitespace-nowrap r-4 bg-gray-800 px-2 py-0.5 t-11 font-medium leading-[1.5] text-gray-400">
              Confirmed #{p.slot}
            </span>
          </span>
          <span className="flex justify-center">{kind === "inProgress" && <Result hit={HAS_HIT[p.batter]} className="t-11" />}</span>
        </div>
      ))}
    </div>
  );
}

/** Filters.tsx and both live tables, as they read on a desk. */
export function BvpBoardFull() {
  const chip = "inline-flex items-center r-6 border border-gray-700 bg-gray-800 px-2.5 py-1 t-12 text-gray-300";
  const add = "inline-flex items-center gap-1 r-6 border border-dashed border-gray-700 px-2.5 py-1.5 t-12 text-gray-500";
  const button = "inline-flex w-26 items-center justify-center gap-1.5 r-8 px-4 py-2 t-14 font-medium";
  return (
    <Surface
      w={960}
      brand="hitlist"
      label="Hitlist matchup tables: the filter bar, one upcoming tracked play and three in progress, each row with batter, pitcher, average, hits, at bats, OPS, game time, lineup slot and result."
      className="bg-ground"
    >
      <div className="p-5">
        <div className="flex items-center gap-2 whitespace-nowrap r-12 border border-gray-800 bg-gray-900 px-4 py-3">
          <span className="mr-0.5 t-12 font-semibold uppercase tracking-wider text-gray-600">Filters</span>
          <span className={cn(chip, "bvp-mono")}>15 AB</span>
          <span className={cn(chip, "bvp-mono")}>.300 AVG</span>
          <span className="mx-0.5 h-5 w-px bg-gray-800" />
          <span className={add}>
            <span className="text-gray-600">+</span>OPS filter
          </span>
          <span className={add}>
            <span className="text-gray-600">+</span>Hits filter
          </span>
          <span className="flex-1" />
          <span className={cn(button, "bg-blue-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]")}>Apply</span>
          <span className={cn(button, "border border-gray-700 bg-gray-900 text-gray-300")}>Reset</span>
          <span className={cn(button, "border border-gray-700 bg-gray-900 text-gray-300")}>
            Export
            <svg className="h-3 w-3 text-gray-500" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8 2 4h8L6 8Z" />
            </svg>
          </span>
        </div>

        <div className="mt-4">
          <DeskTable title="Upcoming" rows={UPCOMING} kind="upcoming" />
        </div>
        <div className="mt-6">
          <DeskTable title="In progress" rows={LIVE} kind="inProgress" />
        </div>
      </div>
    </Surface>
  );
}

/* ─── Sample size ─────────────────────────────────────────────────────────── */

/*
  Two example lines run through topPlayScore(). The first is a hot average on
  the fewest at bats that still read as a real sample. The second is the
  fourth play on the board above.
*/
const HOT = { h: 8, ab: 17 };
const STEADY = { h: TOP[3].h, ab: TOP[3].ab };

const CHART = { w: 320, h: 200, left: 36, right: 314, top: 12, bottom: 166, ab0: 15, ab1: 45, s0: 0.15, s1: 0.5 };
const cx = (ab: number) => CHART.left + ((ab - CHART.ab0) / (CHART.ab1 - CHART.ab0)) * (CHART.right - CHART.left);
const cy = (s: number) => CHART.bottom - ((s - CHART.s0) / (CHART.s1 - CHART.s0)) * (CHART.bottom - CHART.top);

/** The score an average earns at every sample from 15 to 45 at bats. */
const curve = (avg: number) =>
  [CHART.ab0, 30, CHART.ab1].map((ab) => `${cx(ab).toFixed(1)},${cy(topPlayScore(avg, ab)).toFixed(1)}`).join(" ");

/* MatchupTable.tsx confidence colours: red-400 under 18 at bats, green-400 from 21. */
const RED = "#f87171";
const GREEN = "#4ade80";

export function BvpSampleSize() {
  const hotAvg = HOT.h / HOT.ab;
  const steadyAvg = STEADY.h / STEADY.ab;
  const hotScore = topPlayScore(hotAvg, HOT.ab);
  const steadyScore = topPlayScore(steadyAvg, STEADY.ab);
  return (
    <Surface
      w={360}
      brand="hitlist"
      label={`Example chart of the Hitlist ranking score by at bats. A ${f3(hotAvg)} average over ${HOT.ab} at bats scores ${f3(hotScore)}; a ${f3(steadyAvg)} average over ${STEADY.ab} at bats scores ${f3(steadyScore)}.`}
      className="bvp-panel"
    >
      <div className="p-5">
        <div className="flex items-baseline justify-between">
          <span className="t-11 font-semibold uppercase tracking-[0.28em] text-sky-300">Ranking</span>
          <span className="t-11 font-semibold uppercase tracking-[0.22em] text-slate-500">Example</span>
        </div>
        <Formula className="mt-3 text-slate-50">
          <span>score</span>
          <span>=</span>
          <span>AVG</span>
          <span>×</span>
          <span>min(</span>
          <Fraction top="AB" bottom="30" />
          <span>, 1)</span>
        </Formula>

        <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className="mt-4 block w-full overflow-visible">
          {[0.2, 0.3, 0.4, 0.5].map((s) => (
            <g key={s}>
              <line x1={CHART.left} x2={CHART.right} y1={cy(s)} y2={cy(s)} stroke="#1e293b" strokeWidth="1" />
              <text x={CHART.left - 6} y={cy(s) + 3.5} textAnchor="end" fontSize="10" fill="#64748b" className="bvp-mono">
                {s.toFixed(3)}
              </text>
            </g>
          ))}
          {[15, 20, 30, 40].map((ab) => (
            <text key={ab} x={cx(ab)} y={CHART.bottom + 15} textAnchor="middle" fontSize="10" fill="#64748b" className="bvp-mono">
              {ab}
            </text>
          ))}
          <text x={CHART.right} y={CHART.bottom + 31} textAnchor="end" fontSize="10" fill="#64748b">
            career at bats against the pitcher
          </text>
          <line x1={CHART.left} x2={CHART.right} y1={CHART.bottom} y2={CHART.bottom} stroke="#334155" strokeWidth="1" />

          <line x1={cx(30)} x2={cx(30)} y1={CHART.top} y2={CHART.bottom} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <text x={cx(30) + 6} y={CHART.bottom - 8} fontSize="10" fill="#94a3b8">
            full credit from 30 AB
          </text>

          <polyline points={curve(hotAvg)} fill="none" stroke={RED} strokeWidth="1.5" strokeOpacity="0.45" strokeLinejoin="round" />
          <polyline points={curve(steadyAvg)} fill="none" stroke={GREEN} strokeWidth="1.5" strokeOpacity="0.45" strokeLinejoin="round" />

          <line x1={cx(HOT.ab)} x2={cx(HOT.ab)} y1={52} y2={cy(hotScore) - 7} stroke={RED} strokeWidth="1" strokeOpacity="0.6" />
          <circle cx={cx(HOT.ab)} cy={cy(hotScore)} r="4.5" fill={RED} stroke="#030712" strokeWidth="2" />
          <text x={cx(HOT.ab) - 4} y={30} fontSize="11" fontWeight="600" fill={RED}>
            {f3(hotAvg)} over {HOT.ab} AB
          </text>
          <text x={cx(HOT.ab) - 4} y={44} fontSize="11" fill="#cbd5e1" className="bvp-mono">
            score {f3(hotScore)}
          </text>

          <circle cx={cx(STEADY.ab)} cy={cy(steadyScore)} r="4.5" fill={GREEN} stroke="#030712" strokeWidth="2" />
          <text x={cx(STEADY.ab) + 8} y={cy(steadyScore) - 22} fontSize="11" fontWeight="600" fill={GREEN}>
            {f3(steadyAvg)} over {STEADY.ab} AB
          </text>
          <text x={cx(STEADY.ab) + 8} y={cy(steadyScore) - 8} fontSize="11" fill="#cbd5e1" className="bvp-mono">
            score {f3(steadyScore)}
          </text>
        </svg>

        <p className="mt-3 whitespace-nowrap t-13 leading-[1.55] text-slate-400">
          The hotter line has not earned full credit yet,
          <br />
          so the steadier one ranks above it.
        </p>
      </div>
    </Surface>
  );
}

/* ─── Mark ────────────────────────────────────────────────────────────────── */

/** The logo on the app's ground, with the title and bar from app/opengraph-image.tsx. */
export function BvpMark() {
  return (
    <Surface w={400} brand="hitlist" label="The Hitlist logo above the title Hitlist." className="bg-ground">
      <div className="h-1.5 bg-[linear-gradient(90deg,#0ea5e9,#22c55e)]" />
      <div className="flex flex-col items-center px-8 pb-12 pt-8">
        <Image src="/brand/hitlist/mark.svg" alt="" width={64} height={64} unoptimized className="h-40 w-40" />
        <p className="mt-2 whitespace-nowrap t-36 font-bold leading-none tracking-tight text-white">Hitlist</p>
        <p className="mt-3.5 whitespace-nowrap t-11 font-semibold uppercase tracking-[0.15em] text-gray-500">MLB Batter vs Pitcher</p>
      </div>
    </Surface>
  );
}

/* ─── the list ────────────────────────────────────────────────────────────── */

export const SURFACES: SurfaceDef[] = [
  {
    id: "hitlist-top-plays",
    title: "Top 4 plays",
    caption:
      "The four best hit props on the slate. Once a play's game starts it leaves this list and is tracked in the In progress table. Each hitter's career average against today's starter is discounted until he has 30 at bats against him, and the hit chance beside it compounds a regressed average over the at bats his lineup slot usually gets. That chance runs high, because it treats every one of those at bats as coming against the starter.",
    tile: BvpTopPlays,
    full: BvpTopPlaysFull,
  },
  {
    id: "hitlist-daily-double",
    title: "Daily Double",
    caption:
      "The Top 4 split into two parlays of two. The app compares the three possible splits and leads with the pair whose hit chances multiply highest, unless both legs of a pair clear a .950 OPS and 7 hits against their pitcher, which makes it a Smash Double and puts it first.",
    tile: BvpDoubles,
  },
  {
    id: "hitlist-scoring",
    title: "Scoring logic",
    caption:
      "The explainer the app shows above its picks: the four inputs and the formulas for ranking, regression, expected at bats, hit chance and the doubles. These are the same formulas the code runs.",
    tile: BvpScoring,
    full: BvpScoringFull,
  },
  {
    id: "hitlist-board",
    title: "Board",
    caption:
      "The tracked plays after their games start. Each one moves from Upcoming to In progress to Settled, and the result column turns to HIT from the live box score.",
    tile: BvpBoard,
    full: BvpBoardFull,
  },
  {
    id: "hitlist-sample-size",
    title: "Sample size",
    caption:
      "An example of the ranking score, drawn from the app's formula. Average is multiplied by at bats over 30, capped at 1, so a hot line over 17 at bats ranks below a good one over 32.",
    tile: BvpSampleSize,
  },
  {
    id: "hitlist-mark",
    title: "Mark",
    caption: "The app's logo and title on its near-black ground, under the sky to green bar from its share image.",
    tile: BvpMark,
  },
];
