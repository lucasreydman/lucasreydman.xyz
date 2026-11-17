import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BOARD, CITY, CURVE, FAN, GRID, GRID_LEAGUE, HOVER, METROS, MINE, SPAN, TEAMS } from "./fandex-data";
import type { Spell } from "./fandex-data";
import type { Cell, Chip } from "./fandex-data";
import { MAP } from "./fandex-map";
import { Surface } from "./kit";
import type { SurfaceDef } from "./types";

/*
  Fandex, rebuilt from its own components (fandex src/components/*).

  The look is its src/app/globals.css in the light theme: warm paper, near-black
  ink, one red. Archivo for everything, with the condensed cut (68% width,
  semibold) for figures and headlines, and IBM Plex Mono for small numbers.
  Seasons are filled cold blue to hot red by how far they sat from the league.

  Nothing on these screens is invented. Every figure is what the product's own
  engine returns for its own data; see fandex-data.ts for how it was produced.
  The fan is someone born in 2005 who follows the Denver clubs: one in each of
  the four big leagues, and the Rapids in MLS.

  One thing differs from the product on purpose. Fandex shows each club's logo,
  loaded from ESPN. This site shows no team logos, so a club is a chip in its
  own colour with its abbreviation, and a plain dot of that colour where the
  product's logo is too small to carry letters. Highlights stay in the
  product's red: the "Use my team's colour for highlights" switch is drawn off.
  The same goes for league marks: the product puts each league's logo beside
  its name in tabs, filters and empty team slots, and here the name stands alone.
*/

/* ─── src/app/globals.css, light theme ──────────────────────────────────── */

const HOT = "#c8361d";
const COLD = "#2c5f8d";
const HEAT_0 = "#e6e3dc";
/* --line-2, the stronger rule. */
const STRONG = "border-[rgb(27_26_23/0.18)]";
const STRONG_BG = "bg-[rgb(27_26_23/0.18)]";
/* .display: the condensed cut of the interface family. */
const DISPLAY = "font-display font-semibold leading-none tnum [font-stretch:68%]";
/* .num */
const NUM = "font-mono tnum";

const px = (n: number) => `calc(var(--px) * ${n})`;
const cols = (...tracks: (number | string)[]) => tracks.map((t) => (typeof t === "number" ? px(t) : t)).join(" ");

/* ─── src/lib/color.ts ──────────────────────────────────────────────────── */

/** Cold to hot fill for a season, from its z-score. */
function heat(z: number) {
  const p = Math.round(Math.min(1, Math.abs(z) / 2.2) ** 0.8 * 100);
  if (p < 4) return HEAT_0;
  return `color-mix(in oklab, ${z >= 0 ? HOT : COLD} ${p}%, ${HEAT_0})`;
}

/** The same scale for a 0 to 100 index, centred on 50. */
const heatIndex = (index: number) => heat(((index - 50) / 50) * 2.2);

/* ─── src/components/ui.tsx, src/lib/engine.ts ──────────────────────────── */

/** Batting-average style: .575 */
function pct(v: number) {
  const s = v.toFixed(3);
  return v >= 1 ? s : s.replace(/^0/, "");
}

function signed(v: number, digits = 2) {
  return `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(digits)}`;
}

const record = (w: number, l: number, t = 0) => (t ? `${w}-${l}-${t}` : `${w}-${l}`);
const seasonLabel = (league: string, y: number) =>
  league === "NBA" || league === "NHL" ? `${y}-${String((y + 1) % 100).padStart(2, "0")}` : String(y);
const eraLabel = `since ${FAN.from}`;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The title mark: a small pennant, filled for a championship and hollow for a final that was lost. */
function Pennant({ className, hollow }: { className?: string; hollow?: boolean }) {
  return (
    <svg viewBox="0 0 10 10" className={cn("shrink-0", className)}>
      <path d="M1 0.5v9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {hollow ? (
        <path d="M2 1.7 8.2 3.6 2 5.5z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      ) : (
        <path d="M1.6 1.2 9.4 3.6 1.6 6z" fill="currentColor" />
      )}
    </svg>
  );
}

/* Icons from lucide, the set the product uses, at its 1.5 stroke. */
const Icon = ({ d, className }: { d: string[]; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)}>
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
);
const SLIDERS = ["M21 4h-7", "M10 4H3", "M21 12h-9", "M8 12H3", "M21 20h-5", "M12 20H3", "M14 2v4", "M8 10v4", "M16 18v4"];
const MOON = ["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"];
const LINK = ["M9 17H7A5 5 0 0 1 7 7h2", "M15 7h2a5 5 0 1 1 0 10h-2", "M8 12h8"];
const SEARCH = ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "m21 21-4.34-4.34"];
const CHEVRON_DOWN = ["m6 9 6 6 6-6"];
const ARROW_DOWN = ["M12 5v14", "m19 12-7 7-7-7"];
const MINUS = ["M5 12h14"];
const PLUS = ["M5 12h14", "M12 5v14"];
const MAP_PIN = ["M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"];
const DICES = [
  "M4 10h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z",
  "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",
  "M6 18h.01",
  "M10 14h.01",
  "M15 6h.01",
  "M18 9h.01",
];
const X = ["M18 6 6 18", "m6 6 12 12"];
const ROTATE = ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"];

/** A club where the product shows its logo: its own colour and its abbreviation. */
function TeamChip({ t, className }: { t: Chip; className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center font-display font-semibold leading-none [font-stretch:68%]", className)}
      style={{ background: t.color, color: t.ink }}
    >
      {t.abbr}
    </span>
  );
}

/** The same club where the logo is too small for letters. */
const TeamDot = ({ t, className }: { t: Chip; className?: string }) => (
  <span className={cn("block shrink-0 rounded-full", className)} style={{ background: t.color }} />
);

/** The page header: wordmark, the Scoring button and the theme switch. */
function SiteHeader() {
  return (
    <div className="flex h-14 items-center justify-between border-b px-8">
      <span className="flex items-center gap-2">
        <Pennant className="h-4 w-4 text-accent" />
        <span className={cn(DISPLAY, "t-20 tracking-[0.01em]")}>Fandex</span>
      </span>
      <span className="flex items-center gap-1 text-secondary">
        <span className="flex h-9 items-center gap-2 px-3 t-14">
          <Icon d={SLIDERS} className="h-4 w-4" /> Scoring
        </span>
        <span className="grid h-9 w-9 place-items-center">
          <Icon d={MOON} className="h-4.5 w-4.5" />
        </span>
      </span>
    </div>
  );
}

/** Segmented control from ui.tsx: a raised track with the chosen option on a card. */
function Segmented({ options, value, small }: { options: ReactNode[]; value: number; small?: boolean }) {
  return (
    <span className="inline-flex shrink-0 r-10 bg-raised p-1">
      {options.map((o, i) => (
        <span
          key={i}
          className={cn(
            "flex items-center whitespace-nowrap r-6 px-3 font-medium",
            small ? "h-7 t-13" : "h-8 t-14",
            i === value ? "bg-card text-ink shadow-[0_0_0_1px_var(--line),0_1px_2px_rgb(0_0_0/0.08)]" : "text-secondary"
          )}
        >
          {o}
        </span>
      ))}
    </span>
  );
}

/** The three views under the scorecard, with the pool and era on the right. */
function Tabs({ current }: { current: "Rankings" | "Every season" | "Cities" }) {
  return (
    <div className="flex gap-6 border-b">
      {(["Rankings", "Every season", "Cities"] as const).map((l) => (
        <span
          key={l}
          className={cn("flex h-11 items-center t-15", l === current ? "font-medium text-ink shadow-[inset_0_calc(var(--px)*-2)_0_var(--ink)]" : "text-secondary")}
        >
          {l}
        </span>
      ))}
      <span className={cn(NUM, "ml-auto self-center t-12 text-muted")}>
        {TEAMS} teams · {eraLabel}
      </span>
    </div>
  );
}

const SearchBox = ({ className }: { className?: string }) => (
  <span className={cn("flex h-9 items-center gap-2 r-10 bg-raised px-3 t-14 text-muted", className)}>
    <Icon d={SEARCH} className="h-4 w-4" /> Search
  </span>
);

/* ─── the season tape: src/components/Tape.tsx ──────────────────────────── */

/**
 * One cell per season, cold blue for bad years through hot red for great ones,
 * a pennant over every title and a hollow one over every lost final. A year the club
 * did not play, or has not finished, is a dashed cell, so columns line up
 * across clubs.
 */
function Tape({ series, first, last, cell, gap = "gap-0.5" }: { series: Cell[]; first: number; last: number; cell: string; gap?: string }) {
  const byYear = new Map(series.map((c) => [c[0], c]));
  const years: number[] = [];
  for (let y = first; y <= last; y++) years.push(y);
  return (
    <div className={cn("flex items-end pt-3", gap)}>
      {years.map((y) => {
        const c = byYear.get(y);
        if (!c) return <span key={y} className={cn("min-w-0 flex-1 r-2 border border-dashed", cell)} />;
        return (
          <span key={y} className={cn("relative min-w-0 flex-1 r-2", cell)} style={{ background: heat(c[1]) }}>
            {c[2] === 1 && <Pennant className="absolute left-1/2 top-[calc(var(--px)*-11)] h-2.25 w-2.25 -translate-x-1/2 text-ink" />}
            {c[2] === 2 && <Pennant hollow className="absolute left-1/2 top-[calc(var(--px)*-11)] h-2.25 w-2.25 -translate-x-1/2 text-secondary" />}
          </span>
        );
      })}
    </div>
  );
}

/** The first and last season under a tape, named the way that league names them. */
function TapeEnds({ league, series, first, last }: { league: string; series: Cell[]; first: number; last: number }) {
  return (
    <div className={cn(NUM, "mt-1 flex justify-between t-12 leading-[1.33] text-muted")}>
      <span>{seasonLabel(league, Math.max(first, series[0][0]))}</span>
      <span>{seasonLabel(league, Math.min(last, series[series.length - 1][0]))}</span>
    </div>
  );
}

function HeatLegend({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-x-4 whitespace-nowrap leading-[1.33] text-muted", className)}>
      <span className="flex items-center gap-2">
        <span>Awful</span>
        <span className="flex gap-0.5">
          {[-2.2, -1.4, -0.7, 0, 0.7, 1.4, 2.2].map((z) => (
            <span key={z} className="h-3 w-4 r-2" style={{ background: heat(z) }} />
          ))}
        </span>
        <span>Great</span>
      </span>
      <span className="flex items-center gap-1 text-secondary">
        <Pennant className="h-2.25 w-2.25" /> title
      </span>
      <span className="flex items-center gap-1 text-secondary">
        <Pennant hollow className="h-2.25 w-2.25" /> lost the final
      </span>
    </span>
  );
}

/* ─── the scorecard: src/components/Scorecard.tsx ───────────────────────── */

/**
 * Where the fan lands among the cities, on one 0 to 100 line. Each city is a
 * thin mark at its score, and marks sit side by side where scores are close.
 * In the product, moving the pointer anywhere along the line reads out the
 * nearest city.
 */
function CityScale({ text }: { text: string }) {
  return (
    <div>
      <div className="relative h-15">
        <span className={cn("absolute inset-x-0 bottom-0 h-px", STRONG_BG)} />
        {METROS.map((m) => (
          <span key={m.name} className="absolute bottom-0 h-3.5 w-0.5 -translate-x-1/2 rounded-t-[calc(var(--px)*1)] bg-muted" style={{ left: `${m.index}%` }} />
        ))}
        <span className="absolute inset-y-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${FAN.index}%` }}>
          <span className={cn(NUM, "r-4 bg-accent px-1.5 t-12 leading-[1.67] text-accent-ink")}>You</span>
          <span className="w-0.5 flex-1 rounded-t-[calc(var(--px)*1)] bg-accent" />
        </span>
      </div>
      <div className={cn(NUM, "mt-1 flex justify-between t-12 leading-[1.33] text-muted")}>
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
      <p className={cn("mt-3 leading-[1.5] text-secondary", text)}>
        Each mark is a city. {FAN.sadder} had it worse than you, {FAN.happier} had it better, and you’ve lived like{" "}
        <span className="text-ink">{FAN.twin}</span>
      </p>
    </div>
  );
}

const perTitle = FAN.seasons / FAN.titles;
const STATS: { label: string; value: string; note: string; pennant?: boolean }[] = [
  { label: "Titles", value: String(FAN.titles), note: `One every ${perTitle.toFixed(perTitle >= 10 ? 0 : 1)} team seasons`, pennant: true },
  { label: "Finals lost", value: String(FAN.finalsLost), note: "Reached the final and lost it" },
  { label: "Great seasons", value: String(FAN.elite), note: "About the top sixth of the league" },
  { label: "Awful seasons", value: String(FAN.dud), note: "About the bottom sixth" },
  { label: "Win rate", value: pct(FAN.pct), note: `${FAN.wins.toLocaleString("en-US")} wins` },
];

const BestWorst = ({ className }: { className?: string }) => (
  <p className={cn("leading-[1.5] text-secondary", className)}>
    Best year to be you: <span className={cn(NUM, "text-ink")}>{FAN.bestYear.y}</span>. Worst: <span className={cn(NUM, "text-ink")}>{FAN.worstYear.y}</span>
  </p>
);

const scorecardLabel = `Fandex scorecard for a fan born in ${FAN.from} who follows the ${MINE.slice(0, -1).map((m) => m.nick).join(", ")} and ${MINE[MINE.length - 1].nick}: fan luck ${Math.round(FAN.index)} out of 100, ${FAN.verdict}. ${FAN.titles} titles, ${FAN.finalsLost} finals lost, ${FAN.elite} great seasons and ${FAN.dud} awful ones, with each club's seasons drawn as a strip from cold blue to hot red.`;

/** The page as a visitor with four teams sees it: the header and their scorecard. */
export function FandexScorecardFull() {
  return (
    <Surface w={960} brand="fandex" label={scorecardLabel} className="bg-ground">
      <SiteHeader />
      <div className="px-8 pb-10 pt-8">
        <div className="r-16 border bg-card">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <span className="t-13 leading-[1.54] text-secondary">Fan luck, {eraLabel}</span>
              <span className="flex h-8 items-center gap-2 t-13 text-secondary">
                <Icon d={LINK} className="h-4 w-4" /> Copy link
              </span>
            </div>
            <div className="mt-6 grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-end gap-12">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={cn(DISPLAY, "t-136 text-ink")}>{Math.round(FAN.index)}</span>
                  <span className={cn(DISPLAY, "t-28 text-muted")}>/ 100</span>
                </div>
                <p className="mt-4 t-28 font-medium leading-[1.15]">{FAN.verdict}</p>
                <p className="mt-1 t-15 leading-[1.47] text-secondary">{FAN.line}</p>
              </div>
              <CityScale text="t-13" />
            </div>
          </div>

          <div className="grid grid-cols-[1.3fr_1fr_1.15fr_1fr_1fr] gap-x-6 border-t px-8">
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0 py-4">
                <div className="t-13 leading-[1.54] text-secondary">{s.label}</div>
                <div className={cn(DISPLAY, "mt-2 flex h-10 items-center gap-2 t-36 text-ink")}>
                  {s.value}
                  {s.pennant && <Pennant className="h-4.5 w-4.5 text-accent" />}
                </div>
                <div className="mt-2 t-12 leading-[1.33] text-muted">{s.note}</div>
              </div>
            ))}
          </div>

          <div className="border-t p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="t-15 font-medium">Season by season</span>
              <HeatLegend className="t-12" />
            </div>
            <div className="mt-4 grid gap-4">
              {MINE.map((s) => (
                <div key={s.name} className="grid grid-cols-[calc(var(--px)*240)_minmax(0,1fr)] items-center gap-x-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <TeamChip t={s} className="h-9 w-9 r-8 t-13" />
                    <div className="min-w-0">
                      <div className="truncate t-15 leading-[1.33]">{s.name}</div>
                      <div className={cn(NUM, "t-12 leading-[1.33] text-muted")}>
                        #{s.rank} · {record(s.w, s.l, s.t)} · {pct(s.pct)}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <Tape series={s.series} first={FAN.first} last={FAN.last} cell="h-7" />
                    <TapeEnds league={s.league} series={s.series} first={FAN.first} last={FAN.last} />
                  </div>
                </div>
              ))}
            </div>
            <BestWorst className="mt-4 t-13" />
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** The scorecard on a phone: the number, where it sits among the cities, the counts and the four tapes. */
export function FandexScorecard() {
  return (
    <Surface w={420} brand="fandex" label={scorecardLabel} className="bg-ground p-3">
      <div className="r-16 border bg-card">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="t-13 text-secondary">Fan luck, {eraLabel}</span>
            <span className="flex items-center gap-1.5 t-12 text-secondary">
              <Icon d={LINK} className="h-3.5 w-3.5" /> Copy link
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={cn(DISPLAY, "t-104 text-ink")}>{Math.round(FAN.index)}</span>
            <span className={cn(DISPLAY, "t-24 text-muted")}>/ 100</span>
          </div>
          <p className="mt-3 t-24 font-medium leading-[1.15]">{FAN.verdict}</p>
          <p className="mt-1 t-13 leading-[1.45] text-secondary">{FAN.line}</p>
          <div className="mt-4">
            <CityScale text="t-12" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-3 border-t px-5">
          {STATS.slice(0, 4).map((s) => (
            <div key={s.label} className="min-w-0 py-3">
              <div className="whitespace-nowrap t-11 text-secondary">{s.label}</div>
              <div className={cn(DISPLAY, "mt-1.5 flex items-center gap-1.5 t-28 text-ink")}>
                {s.value}
                {s.pennant && <Pennant className="h-3.5 w-3.5 text-accent" />}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-5">
          <p className="t-14 font-medium leading-none">Season by season</p>
          <HeatLegend className="mt-2.5 t-11" />
          <div className="mt-2.5 grid gap-2.5">
            {MINE.map((s) => (
              <div key={s.name} className="grid grid-cols-[calc(var(--px)*122)_minmax(0,1fr)] items-end gap-x-3">
                <div className="flex min-w-0 items-center gap-2">
                  <TeamChip t={s} className="h-7 w-7 r-6 t-10.5" />
                  <div className="min-w-0">
                    <div className="truncate t-13 leading-[1.3]">{s.nick}</div>
                    <div className={cn(NUM, "whitespace-nowrap t-10.5 leading-[1.3] text-muted")}>
                      #{s.rank} · {pct(s.pct)}
                    </div>
                  </div>
                </div>
                <Tape series={s.series} first={FAN.first} last={FAN.last} cell="h-6" />
              </div>
            ))}
          </div>
          <BestWorst className="mt-3.5 t-12" />
        </div>
      </div>
    </Surface>
  );
}

/* ─── rankings: src/components/Rankings.tsx ─────────────────────────────── */

/* src/lib/types.ts: the big four, which every view leads with, then the other five. */
const LEAGUES = ["All", "NFL", "NBA", "MLB", "NHL", "MLS", "WNBA", "NWSL", "PWHL", "CFL"];
const isMine = (name: string) => MINE.some((m) => m.name === name);
const rankingsLabel = `Fandex rankings ${eraLabel}: all ${TEAMS} franchises of nine leagues on one 0 to 100 scale. ${BOARD[0].name} are first, then ${BOARD[1].name} and ${BOARD[2].name}.`;

/** The luck column: a bar on the cold to hot scale, then the number. */
function Luck({ index, bar }: { index: number; bar: boolean }) {
  return (
    <span className="flex items-center justify-end gap-2">
      {bar && (
        <span className="h-2 flex-1 overflow-hidden r-2 bg-raised">
          <span className="block h-full r-2" style={{ width: `${Math.max(2, index)}%`, background: heatIndex(index) }} />
        </span>
      )}
      <span className={cn(NUM, "w-7 text-right t-13 text-ink")}>{Math.round(index)}</span>
      {bar && <Icon d={CHEVRON_DOWN} className="h-3.5 w-3.5 text-muted" />}
    </span>
  );
}

const Titles = ({ n }: { n: number }) => (
  <span className={cn(NUM, "flex items-center justify-end gap-1 t-13", n ? "text-ink" : "text-muted")}>
    {n > 0 && <Pennant className="h-2.5 w-2.5 text-accent" />}
    {n}
  </span>
);

const MineBar = () => <span className="absolute inset-y-2 left-0 w-0.75 r-0.5 bg-accent" />;

/** The Rankings tab at desk width: every column, sorted by luck. */
export function FandexRankingsFull() {
  const grid: CSSProperties = { gridTemplateColumns: cols(40, "minmax(0,1fr)", 48, 72, 64, 80, 56, 56, 56, 112) };
  const head = ["Yrs", "Win rate", "Vs league", "Avg season", "Great", "Awful", "Titles"];
  return (
    <Surface w={960} brand="fandex" label={rankingsLabel} className="bg-ground">
      <div className="px-8 pb-8 pt-4">
        <Tabs current="Rankings" />
        <div className="mt-6 flex items-center gap-3">
          <Segmented options={LEAGUES} value={0} small />
          <SearchBox className="min-w-0 flex-1" />
        </div>

        <div className="mt-4">
          <div className={cn("grid h-10 items-center gap-x-3 border-b px-2 t-12 text-muted", STRONG)} style={grid}>
            <span className="text-right">#</span>
            <span>Team</span>
            {head.map((h) => (
              <span key={h} className="whitespace-nowrap text-right">
                {h}
              </span>
            ))}
            {/* The luck figure sits left of the row chevron, so its header stops there too. */}
            <span className="flex items-center justify-end gap-1 pr-5.5 text-ink">
              <Icon d={ARROW_DOWN} className="h-3 w-3" /> Luck
            </span>
          </div>
          {BOARD.map((s) => (
            <div key={s.name} className="border-b">
              <div className={cn("relative grid h-12 items-center gap-x-3 r-8 px-2", isMine(s.name) && "bg-raised")} style={grid}>
                {isMine(s.name) && <MineBar />}
                <span className={cn(NUM, "text-right t-13 text-muted")}>{s.rank}</span>
                <span className="flex min-w-0 items-center gap-3">
                  <TeamChip t={s} className="h-7 w-7 r-6 t-10.5" />
                  <span className="min-w-0">
                    <span className="block truncate t-14 leading-[1.43]">{s.name}</span>
                    <span className={cn(NUM, "block truncate t-12 leading-[1.33] text-muted")}>
                      {s.league} · {s.metro}
                    </span>
                  </span>
                </span>
                <span className={cn(NUM, "text-right t-13 text-secondary")}>{s.seasons}</span>
                <span className={cn(NUM, "text-right t-13 text-ink")}>{pct(s.pct)}</span>
                <span className={cn(NUM, "text-right t-13 text-secondary")}>{signed(s.z)}</span>
                <span className={cn(NUM, "text-right t-13 text-secondary")}>{signed(s.avgZ)}</span>
                <span className={cn(NUM, "text-right t-13 text-secondary")}>{s.elite}</span>
                <span className={cn(NUM, "text-right t-13 text-secondary")}>{s.dud}</span>
                <Titles n={s.titles} />
                <Luck index={s.index} bar />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/** The top of the board on a phone: rank, club, win rate, titles and luck. */
export function FandexRankings() {
  const grid: CSSProperties = { gridTemplateColumns: cols(20, "minmax(0,1fr)", 52, 44, 48) };
  return (
    <Surface w={420} brand="fandex" label={rankingsLabel} className="bg-ground px-4 pb-0 pt-4">
      {/* Ten options do not fit a phone, so the control scrolls sideways and runs off the edge. */}
      <div className="-mr-4 overflow-hidden">
        <Segmented options={LEAGUES} value={0} small />
      </div>
      <div className="mt-3">
        <div className={cn("grid h-9 items-center gap-x-2 border-b px-2 t-12 text-muted", STRONG)} style={grid}>
          <span className="text-right">#</span>
          <span>Team</span>
          <span className="whitespace-nowrap text-right">Win rate</span>
          <span className="text-right">Titles</span>
          <span className="flex items-center justify-end gap-0.5 text-ink">
            <Icon d={ARROW_DOWN} className="h-3 w-3" /> Luck
          </span>
        </div>
        {BOARD.slice(0, 10).map((s) => (
          <div key={s.name} className="grid h-12 items-center gap-x-2 border-b px-2" style={grid}>
            <span className={cn(NUM, "text-right t-13 text-muted")}>{s.rank}</span>
            <span className="flex min-w-0 items-center gap-2">
              <TeamChip t={s} className="h-7 w-7 r-6 t-10.5" />
              <span className="min-w-0">
                <span className="block truncate t-14 leading-[1.43]">{s.nick}</span>
                {/* A phone row has no room for the city, so the product shows the league alone. */}
                <span className={cn(NUM, "block t-11 leading-[1.33] text-muted")}>{s.league}</span>
              </span>
            </span>
            <span className={cn(NUM, "text-right t-13 text-ink")}>{pct(s.pct)}</span>
            <Titles n={s.titles} />
            <Luck index={s.index} bar={false} />
          </div>
        ))}
      </div>
    </Surface>
  );
}

/* ─── every season: src/components/Seasons.tsx ──────────────────────────── */

const GRID_SPAN = SPAN[GRID_LEAGUE as keyof typeof SPAN];
const GRID_YEARS: number[] = [];
for (let y = GRID_SPAN.first; y <= GRID_SPAN.last; y++) GRID_YEARS.push(y);
const seasonsLabel = `Fandex, every ${GRID_LEAGUE} season ${eraLabel}: one row per club, best to worst over the span, one cell per season filled cold blue to hot red, with a pennant on each title. The ${HOVER.name}' ${HOVER.y} season is picked out: ${record(HOVER.w, HOVER.l, HOVER.t)} and champions.`;

/** ui.tsx rating: the plain word for a season a full standard deviation clear of the league either way. */
const rating = (z: number) => (z >= 1 ? " · great season" : z <= -1 ? " · awful season" : "");

/** The line above the grid, reading the season under the pointer. */
const HOVER_TAIL = `${rating(HOVER.z)}${HOVER.champ ? " · champions" : HOVER.runnerUp ? " · lost the final" : ""}`;

/** On a phone the line is too long for one row, so it breaks before the words about the season. */
const HoverLine = ({ className, stack }: { className?: string; stack?: boolean }) => (
  <p className={cn(NUM, "whitespace-nowrap leading-[1.54] text-secondary", className)}>
    <span className="text-ink">{HOVER.name}</span> · {seasonLabel(GRID_LEAGUE, HOVER.y)} · {record(HOVER.w, HOVER.l, HOVER.t)} · {pct(HOVER.pct)}
    {stack ? <span className="block">{HOVER_TAIL.replace(/^ · /, "")}</span> : HOVER_TAIL}
  </p>
);

function SeasonGrid({ rows, label, row, cell, text, pennant, dot, every }: { rows: typeof GRID; label: string; row: string; cell: string; text: string; pennant: string; dot: string; every: number }) {
  return (
    <div>
      <div className="flex h-6 items-end">
        <span className={cn("shrink-0", label)} />
        <div className="flex flex-1 gap-0.5">
          {GRID_YEARS.map((y) => (
            <span key={y} className={cn(NUM, "relative h-4 min-w-0 flex-1 t-11 leading-[1.45] text-muted")}>
              {y % every === 0 && y <= GRID_SPAN.last - 2 && <span className="absolute left-0">{y}</span>}
            </span>
          ))}
        </div>
      </div>
      {rows.map((s) => {
        const byYear = new Map(s.series.map((c) => [c[0], c]));
        const mine = isMine(s.name);
        return (
          <div key={s.name} className={cn("flex items-center", row)}>
            <span className={cn("flex shrink-0 items-center gap-2 pr-3", label)}>
              <span className={cn(NUM, "w-5 shrink-0 text-right t-12 text-muted")}>{s.leagueRank}</span>
              <TeamDot t={s} className={dot} />
              <span className={cn("truncate", text, mine ? "font-medium text-ink" : "text-secondary")}>{s.nick}</span>
              {mine && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
            </span>
            <div className="flex flex-1 gap-0.5">
              {GRID_YEARS.map((y) => {
                const c = byYear.get(y);
                if (!c) return <span key={y} className={cn("min-w-0 flex-1", cell)} />;
                const picked = mine && y === HOVER.y;
                return (
                  <span
                    key={y}
                    className={cn("grid min-w-0 flex-1 place-items-center r-2", cell, picked && "shadow-[0_0_0_calc(var(--px)*1.5)_var(--ink)]")}
                    style={{ background: heat(c[1]) }}
                  >
                    {c[2] > 0 && <Pennant hollow={c[2] === 2} className={cn(pennant, Math.abs(c[1]) > 1.2 ? "text-white" : "text-ink")} />}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** The Every season tab: all 32 clubs of one league against every season in the span. */
export function FandexSeasonsFull() {
  return (
    <Surface w={960} brand="fandex" label={seasonsLabel} className="bg-ground">
      <div className="px-8 pb-8 pt-4">
        <Tabs current="Every season" />
        <div className="mt-6 flex items-center justify-between gap-3">
          <Segmented options={LEAGUES.slice(1)} value={0} small />
          <HeatLegend className="t-12" />
        </div>
        <HoverLine className="mt-4 whitespace-nowrap t-13" />
        <div className="mt-2">
          <SeasonGrid rows={GRID} label="w-47" row="h-7" cell="h-6" text="t-13" pennant="h-2.5 w-2.5" dot="h-5 w-5" every={2} />
        </div>
      </div>
    </Surface>
  );
}

/** The top half of the same grid on a phone. */
export function FandexSeasons() {
  return (
    <Surface w={420} brand="fandex" label={seasonsLabel} className="bg-ground px-4 pb-0 pt-4">
      <Segmented options={LEAGUES.slice(1)} value={0} small />
      <HoverLine className="mt-3 t-11" stack />
      <div className="mt-1">
        <SeasonGrid rows={GRID.slice(0, 16)} label="w-33" row="h-6.5" cell="h-5.5" text="t-12" pennant="h-2 w-2" dot="h-3.5 w-3.5" every={4} />
      </div>
    </Surface>
  );
}

/* ─── cities: src/components/Cities.tsx ─────────────────────────────────── */

const radius = (n: number) => 5 + Math.sqrt(n) * 4.5;
const ACTIVE = METROS.find((m) => m.name === CITY.name)!;
/* Big circles first, so a small city is drawn on top of a large neighbour. */
const DRAW_ORDER = [...METROS].sort((a, b) => b.teams.length - a.teams.length);
const citiesLabel = `Fandex cities ${eraLabel}: ${METROS.length} metro areas ranked by the seasons their teams played there. ${METROS[0].name} is first at ${Math.round(METROS[0].index)}, ${METROS[1].name} second. ${ACTIVE.name} is number ${ACTIVE.rank} at ${Math.round(ACTIVE.index)}, with ${plural(ACTIVE.titles, "title", "titles")}.`;

/** The line under a club on a city card: its record there, then where the franchise stands or where it went. */
function spellLine(s: Spell) {
  if (s.current) return `${pct(s.pct)} · #${s.rank} of ${TEAMS}${s.seasons < s.franchiseSeasons ? ` · since ${s.first}` : ""}`;
  return `${pct(s.pct)} · ${s.first === s.last ? s.first : `${s.first} to ${s.last}`} · now ${s.now}`;
}

function CityRow({ m }: { m: (typeof METROS)[number] }) {
  const on = m.name === ACTIVE.name;
  return (
    <div className={cn("relative grid h-10 grid-cols-[calc(var(--px)*28)_minmax(0,1fr)_auto_calc(var(--px)*32)] items-center gap-3 r-8 px-2", on && "bg-raised")}>
      {on && <MineBar />}
      <span className={cn(NUM, "text-right t-12 text-muted")}>{m.rank}</span>
      <span className="truncate t-14">{m.name}</span>
      <span className="flex -space-x-1">
        {m.teams.slice(0, 5).map((t, i) => (
          <TeamDot key={i} t={t} className="h-4.5 w-4.5 shadow-[0_0_0_calc(var(--px)*1.5)_var(--ground)]" />
        ))}
      </span>
      <span className={cn(NUM, "text-right t-13 text-ink")}>{Math.round(m.index)}</span>
    </div>
  );
}

/** The chosen city: its rank and totals, then each of its clubs with its place on the full board. */
function CityCard({ columns, className, short }: { columns: string; className?: string; short?: boolean }) {
  return (
    <div className={cn("r-16 border bg-card", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="t-20 font-medium leading-[1.4]">{ACTIVE.name}</span>
        <span className={cn(NUM, "t-13 text-secondary")}>
          #{ACTIVE.rank} of cities · luck {Math.round(ACTIVE.index)} · {pct(ACTIVE.pct)} · {plural(ACTIVE.titles, "title", "titles")}
          {!short && ` · ${ACTIVE.finalsLost} finals lost`}
        </span>
      </div>
      <div className={cn("mt-4 grid gap-x-6 gap-y-2", columns)}>
        {CITY.teams.map((s) => (
          <div key={s.name} className="flex h-10 items-center gap-3">
            <TeamChip t={s} className={cn("h-7 w-7 r-6 t-10.5", !s.current && "opacity-60")} />
            <span className="min-w-0 flex-1">
              <span className="block truncate t-14 leading-[1.43]">{s.name}</span>
              <span className={cn(NUM, "block truncate t-12 leading-[1.33] text-muted")}>{spellLine(s)}</span>
            </span>
            {s.titles > 0 && (
              <span className={cn(NUM, "flex items-center gap-1 t-13")}>
                <Pennant className="h-2.5 w-2.5 text-accent" /> {s.titles}
              </span>
            )}
            <span className={cn(NUM, "w-7 text-right t-13 text-secondary")}>{Math.round(s.index)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The Cities tab: the map, the chosen city's card, and the ranked list beside them. */
export function FandexCitiesFull() {
  return (
    <Surface w={960} brand="fandex" label={citiesLabel} className="bg-ground">
      <div className="px-8 pb-8 pt-4">
        <Tabs current="Cities" />
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_calc(var(--px)*340)] gap-6">
          <div className="min-w-0">
            <div className="overflow-hidden r-16 border bg-card">
              <svg viewBox={`0 0 ${MAP.w} ${MAP.h}`} className="block w-full">
                <path d={MAP.other} fill="var(--raised)" opacity="0.5" />
                <path d={MAP.land} fill="var(--raised)" />
                <path d={MAP.lakes} fill="var(--card)" />
                <path d={MAP.states} fill="none" stroke="rgb(27 26 23 / 0.18)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                {DRAW_ORDER.map((m) => {
                  const on = m.name === ACTIVE.name;
                  const r = radius(m.teams.length);
                  return (
                    <g key={m.name} transform={`translate(${m.x} ${m.y})`}>
                      {on && <circle r={r + 4} fill="none" stroke="var(--accent)" strokeWidth="1.5" />}
                      <circle r={r} style={{ fill: heatIndex(m.index) }} stroke={on ? "var(--ink)" : "var(--card)"} strokeWidth={on ? 1.75 : 1} />
                    </g>
                  );
                })}
                {/* The product sets this label at 13 map units. The map is drawn smaller here, so it is set larger to read the same size. */}
                <text
                  transform={`translate(${ACTIVE.x} ${ACTIVE.y - radius(ACTIVE.teams.length) - 12})`}
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="500"
                  fill="var(--ink)"
                  stroke="var(--card)"
                  strokeWidth="6"
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  {ACTIVE.name} · {Math.round(ACTIVE.index)}
                </text>
              </svg>
            </div>
            <div className="mt-3 flex items-center gap-x-4 t-12 leading-[1.33] text-muted">
              <span className="flex items-center gap-2">
                Cursed
                <span className="flex gap-0.5">
                  {[2, 18, 34, 50, 66, 82, 98].map((v) => (
                    <span key={v} className="h-3 w-3 rounded-full" style={{ background: heatIndex(v) }} />
                  ))}
                </span>
                Charmed
              </span>
              <span>Bigger circle, more teams</span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-accent bw-1.5" /> Your cities
              </span>
            </div>
            {/* One column: at this width two would cut the club names short. */}
            <CityCard columns="grid-cols-1" className="mt-4 p-8" />
          </div>

          {/* The list scrolls in the product. It is drawn scrolled to where the chosen city sits. */}
          <div>
            {METROS.slice(ACTIVE.rank - 18, ACTIVE.rank + 3).map((m) => (
              <CityRow key={m.name} m={m} />
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** Cities on a phone: the chosen city's card over the top of the ranked list. */
export function FandexCities() {
  return (
    <Surface w={420} brand="fandex" label={citiesLabel} className="bg-ground px-4 pb-0 pt-4">
      <CityCard columns="grid-cols-1" className="p-5" short />
      <div className="mt-3">
        {METROS.slice(0, 7).map((m) => (
          <CityRow key={m.name} m={m} />
        ))}
      </div>
    </Surface>
  );
}

/* ─── the birth-year curve: src/components/Curve.tsx ────────────────────── */

const BEST = CURVE.reduce((a, p) => (p[1] > a[1] ? p : a));
const WORST = CURVE.reduce((a, p) => (p[1] < a[1] ? p : a));

/** The same four clubs scored for every possible birth year, with this fan's year marked. */
export function FandexCurve() {
  const W = 392;
  const H = 216;
  const pad = { l: 28, r: 4, t: 12, b: 24 };
  const min = CURVE[0][0];
  const max = CURVE[CURVE.length - 1][0];
  const x = (y: number) => pad.l + ((y - min) / (max - min)) * (W - pad.l - pad.r);
  const yy = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
  const d = CURVE.map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)} ${yy(p[1]).toFixed(1)}`).join(" ");
  const cur = CURVE.find((p) => p[0] === FAN.from)!;
  const decades: number[] = [];
  for (let y = Math.ceil(min / 20) * 20; y <= max; y += 20) decades.push(y);
  return (
    <Surface
      w={440}
      brand="fandex"
      label={`Fandex, luck by birth year for the same Denver clubs, ${min} to ${max}. Luckiest for someone born in ${BEST[0]} at ${Math.round(BEST[1])}, unluckiest for ${WORST[0]} at ${Math.round(WORST[1])}. ${FAN.from} is marked at ${Math.round(cur[1])}.`}
      className="bg-ground p-3"
    >
      <div className="r-16 border bg-card p-5">
        <p className="t-15 font-medium leading-[1.33]">If you had been born another year</p>
        <p className={cn(NUM, "mt-1 whitespace-nowrap t-12 leading-[1.5] text-secondary")}>
          Luckiest {BEST[0]} ({Math.round(BEST[1])}) · unluckiest {WORST[0]} ({Math.round(WORST[1])})
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block w-full">
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={yy(v)} y2={yy(v)} stroke="var(--line)" strokeDasharray={v === 50 ? undefined : "2 4"} />
              <text x={0} y={yy(v) + 4} textAnchor="start" fontSize="11" fill="var(--muted)" style={{ fontFamily: "var(--mono)" }}>
                {v}
              </text>
            </g>
          ))}
          {decades.map((y) => (
            <text key={y} x={x(y)} y={H - 5} textAnchor="middle" fontSize="11" fill="var(--muted)" style={{ fontFamily: "var(--mono)" }}>
              {y}
            </text>
          ))}
          <path d={d} fill="none" stroke="var(--ink)" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={x(cur[0])} cy={yy(cur[1])} r="6" fill="var(--accent)" stroke="var(--card)" strokeWidth="2" />
        </svg>
        <p className="mt-2 t-12 leading-[1.5] text-muted">Same teams, different birthday. Click a year to move there</p>
      </div>
    </Surface>
  );
}

/* ─── years and teams: src/components/YearDial.tsx, TeamPicker.tsx ──────── */

const MORE = ["MLS", "WNBA", "NWSL", "PWHL", "CFL"];
const MIN_YEAR = CURVE[0][0];
const MAX_YEAR = FAN.last;

/** The top of the page: the birth year as the control, and one team per league. */
export function FandexSetup() {
  const pos = (y: number) => `${((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`;
  const decades: number[] = [];
  for (let y = Math.ceil(MIN_YEAR / 10) * 10; y <= MAX_YEAR; y += 10) decades.push(y);
  const step = cn("grid h-9 w-9 place-items-center r-10 border bg-card text-secondary", STRONG);
  return (
    <Surface
      w={420}
      brand="fandex"
      label={`Fandex setup: the era set to since I was born, the birth year ${FAN.from} on a ruler running from ${MIN_YEAR} to ${MAX_YEAR}, one team picked in each of the NFL, NBA, MLB and NHL, and smaller slots for MLS, the WNBA, NWSL, PWHL and CFL with the ${MINE[4].nick} in the first.`}
      className="bg-ground p-5"
    >
      <p className="t-15 font-medium leading-[1.33]">Your years</p>
      <div className="mt-3">
        <Segmented options={["Since I was born", "All time", "Custom years"]} value={0} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className={cn(DISPLAY, "border-b-[calc(var(--px)*2)] border-dashed pb-1 t-72", STRONG)}>{FAN.from}</span>
        <span className="flex gap-2">
          <span className={step}>
            <Icon d={MINUS} className="h-4 w-4" />
          </span>
          <span className={step}>
            <Icon d={PLUS} className="h-4 w-4" />
          </span>
        </span>
      </div>

      {/* The ruler: a tick every decade, a longer one every fifty years, and the year as a bar. Ticks sit 6 in from each end, where the handle stops. */}
      <div className="relative mt-4 h-8">
        <span className={cn("absolute inset-x-0 bottom-2 h-px", STRONG_BG)} />
        <div className="absolute inset-x-1.5 inset-y-0">
          {decades.map((y) => (
            <span key={y} className={cn("absolute bottom-2 w-px", STRONG_BG, y % 50 === 0 ? "h-4" : "h-2")} style={{ left: pos(y) }} />
          ))}
          <span className="absolute top-0 h-8 w-1 -translate-x-1/2 bg-accent" style={{ left: pos(FAN.from) }} />
        </div>
      </div>
      <div className={cn(NUM, "relative mx-1.5 h-4 t-12 leading-[1.33] text-muted")}>
        {decades
          .filter((y) => y % 20 === 0)
          .map((y) => (
            <span key={y} className="absolute -translate-x-1/2" style={{ left: pos(y) }}>
              {y}
            </span>
          ))}
      </div>

      <div className="mt-7 flex items-baseline justify-between">
        <span className="t-15 font-medium leading-[1.33]">Your teams</span>
        <span className="t-12 text-muted">One per league</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {MINE.slice(0, 4).map((s) => (
          <div key={s.name} className="flex h-27 flex-col items-center justify-center gap-2 r-12 border bg-card text-center">
            <TeamChip t={s} className="h-12 w-12 r-10 t-17" />
            <span className="leading-[1.25]">
              <span className={cn(NUM, "block t-11 text-muted")}>{s.league}</span>
              <span className="block t-13">{s.nick}</span>
            </span>
          </div>
        ))}
      </div>
      {/* The other five leagues: smaller cards, filled the same way. */}
      <div className="mt-2 grid grid-cols-5 gap-2">
        {MORE.map((l) => {
          const s = MINE.find((m) => m.league === l);
          return (
            <div key={l} className={cn("flex h-26 min-w-0 flex-col items-center justify-center gap-2 r-12 border px-1 text-center", s ? "bg-card" : cn("border-dashed", STRONG))}>
              {s ? (
                <TeamChip t={s} className="h-9 w-9 r-8 t-13" />
              ) : (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-muted">
                  <Icon d={PLUS} className="h-4 w-4" />
                </span>
              )}
              <span className="leading-[1.25]">
                <span className={cn(NUM, "block t-11 text-muted")}>{l}</span>
                <span className={cn("block t-13", !s && "text-secondary")}>{s ? s.nick : "Add"}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-x-4 whitespace-nowrap t-13 text-secondary">
        <span className="flex h-8 items-center gap-1.5">
          <Icon d={MAP_PIN} className="h-4 w-4" /> Pick a whole city
        </span>
        <span className="flex h-8 items-center gap-1.5">
          <Icon d={DICES} className="h-4 w-4" /> Random fan
        </span>
        <span className="flex h-8 items-center gap-1.5">
          <Icon d={X} className="h-4 w-4" /> Clear
        </span>
      </div>
    </Surface>
  );
}

/* ─── scoring: src/components/Tune.tsx ──────────────────────────────────── */

/* src/lib/engine.ts DEFAULT_WEIGHTS, with the notes the panel prints under each. */
const PARTS = [
  { label: "Overall record", weight: 50, note: "Total wins and losses across the whole span" },
  { label: "Typical season", weight: 30, note: "How good an ordinary year was, so ten great years and ten terrible ones don’t cancel out" },
  { label: "Championships", weight: 20, note: "Titles won against what an average club would have won" },
];
const WEIGHT_SUM = PARTS.reduce((a, p) => a + p.weight, 0);

/** The Scoring panel: the three weights, the leagues counted, recency, and the buttons that close it. */
export function FandexScoring() {
  return (
    <Surface
      w={420}
      brand="fandex"
      label="The Fandex scoring panel: overall record at 50%, typical season at 30% and championships at 20%, each on a slider, all nine leagues counted, and recency set to all seasons counting equally."
      className="bg-card"
    >
      <div className="flex h-14 items-center justify-between border-b px-6">
        <span className="t-15 font-medium">Scoring</span>
        <Icon d={X} className="h-4.5 w-4.5 text-secondary" />
      </div>
      <div className="px-6 py-6">
        <p className="t-13 text-secondary">What counts as a good life as a fan</p>
        <div className="mt-4 grid gap-5">
          {PARTS.map((p) => (
            <div key={p.label}>
              <div className="flex items-baseline justify-between">
                <span className="t-14">{p.label}</span>
                <span className={cn(NUM, "t-13 text-secondary")}>{Math.round((p.weight / WEIGHT_SUM) * 100)}%</span>
              </div>
              <div className="relative mt-2 h-5">
                <span className={cn("absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 r-2", STRONG_BG)} />
                <span className="absolute left-0 top-1/2 h-1 -translate-y-1/2 r-2 bg-ink" style={{ width: `${p.weight}%` }} />
                <span
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-ink bg-card bw-1.5"
                  style={{ left: `${p.weight}%` }}
                />
              </div>
              <p className="mt-1 t-12 leading-[1.33] text-muted">{p.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-7 t-13 text-secondary">Leagues counted</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEAGUES.slice(1).map((l) => (
            <span key={l} className={cn(NUM, "flex h-8 items-center r-8 bg-ink px-3 t-13 text-ground")}>
              {l}
            </span>
          ))}
        </div>
        <p className="mt-2 t-12 leading-[1.33] text-muted">Switch a league off to leave it out of the rankings, the cities and your number</p>

        <p className="mt-7 t-13 text-secondary">Recency</p>
        <div className="mt-3">
          <Segmented options={["All equal", "Lean recent", "Only lately"]} value={0} small />
        </div>
        <p className="mt-2 t-12 leading-[1.33] text-muted">A season from decades ago weighs the same as last year</p>
      </div>
      <div className="flex h-16 items-center justify-between border-t px-6">
        <span className="flex h-9 items-center gap-2 px-3 t-14 text-secondary opacity-40">
          <Icon d={ROTATE} className="h-4 w-4" /> Reset
        </span>
        <span className="flex h-9 items-center r-10 bg-ink px-4 t-14 font-medium text-ground">Done</span>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "fandex-scorecard",
    title: "The scorecard",
    caption:
      "One fan's number: born in 2005, following Denver's club in each of the four big leagues and the Rapids in MLS. The number is the average of those clubs on the same 0 to 100 line every franchise is ranked on, each mark on the scale is a city, and each strip is a club's seasons from cold blue to hot red, with a pennant over every title and a hollow one over every lost final. Every figure is what the product's engine returns for its own data.",
    tile: FandexScorecard,
    full: FandexScorecardFull,
  },
  {
    id: "fandex-rankings",
    title: "Rankings",
    caption:
      "Every franchise of the nine leagues that played in the years set, in one list: 209 of them since 2005. Vs league is the win rate over those years measured against the league's own spread, Avg season is the typical season against that year's league, and Luck is the blend of those and titles, with the best club in the span at 100. The fan's own clubs are marked.",
    tile: FandexRankings,
    full: FandexRankingsFull,
  },
  {
    id: "fandex-seasons",
    title: "Every season",
    caption:
      "One league on one sheet: every club against every season in the span, sorted best to worst, with titles and lost finals marked in their cells. Pointing at a cell reads out that season's record, and says when it was a great or an awful one.",
    tile: FandexSeasons,
    full: FandexSeasonsFull,
  },
  {
    id: "fandex-cities",
    title: "Cities",
    caption:
      "A city is scored on the seasons actually played there, so a club that has since moved still counts for the city it left. On the map a circle grows with the number of teams and takes its colour from the score, and the fan's own city is ringed. The base map is drawn once by a script and stored as plain paths.",
    tile: FandexCities,
    full: FandexCitiesFull,
  },
  {
    id: "fandex-curve",
    title: "Another birthday",
    caption: "The same clubs scored for every possible birth year. Each point reruns the whole ranking from that year on, so the line shows how much of a fan's luck is timing.",
    tile: FandexCurve,
  },
  {
    id: "fandex-setup",
    title: "Years and teams",
    caption: "The two inputs. The year can be typed, nudged or dragged along the ruler, and the era can be a lifetime, all time or any span. Teams are one per league: the four big leagues lead, and MLS, the WNBA, NWSL, PWHL and CFL each have a smaller slot.",
    tile: FandexSetup,
  },
  {
    id: "fandex-scoring",
    title: "Scoring",
    caption: "What counts as a good life as a fan is adjustable: the three weights, which leagues are counted, and how much recent seasons count. Every change rescores every franchise in the browser.",
    tile: FandexScoring,
  },
];
