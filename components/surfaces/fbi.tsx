import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Headshot, Surface } from "./kit";
import type { SurfaceDef } from "./types";
import "./fbi.css";

/*
  FBI Basketball, rebuilt from fbi-basketball's own screens.

  Colours and type come from its `app/globals.css`: obsidian, bone and gold,
  Norwester for titles and numerals, Geist for text, Geist Mono for figures.
  The seven tier fills are its `chip-strip--cats` rules, index for index.
  Radius is 2 to 4 pixels everywhere, as it is in the app.

  The players are real and the figures are sample projections. The league,
  its teams and the schedule are samples too.
*/

export const FBI_TIERS = [
  { label: "Elite", bg: "#0d6e3a", fg: "#ffffff" },
  { label: "Strong", bg: "#3fa063", fg: "#0b0b0d" },
  { label: "Above", bg: "#9cd1b1", fg: "#000000" },
  { label: "Average", bg: "#f5f1e8", fg: "#000000" },
  { label: "Below", bg: "#f3a8a8", fg: "#000000" },
  { label: "Weak", bg: "#d63a3a", fg: "#ffffff" },
  { label: "Punt", bg: "#7a0d0d", fg: "#ffffff" },
] as const;

const CATS = ["FG%", "FT%", "3PT", "PTS", "REB", "AST", "STL", "BLK", "TO"] as const;

type Row = {
  /** ESPN athlete id, for the headshot. */
  id: number;
  name: string;
  team: string;
  pos: string;
  age: string;
  durant: string;
  /** Nine [value, tier] pairs, in CATS order. */
  cats: [string, number][];
};

const BOARD: Row[] = [
  { id: 5104157, name: "Victor Wembanyama", team: "SAS", pos: "C", age: "22.6", durant: "12.92", cats: [["50.0", 2], ["82.4", 2], ["2.2", 2], ["25.7", 1], ["11.3", 0], ["3.4", 3], ["1.1", 3], ["3.2", 0], ["2.7", 5]] },
  { id: 3112335, name: "Nikola Jokic", team: "DEN", pos: "C", age: "31.5", durant: "12.66", cats: [["56.8", 0], ["82.2", 2], ["1.6", 3], ["26.0", 1], ["11.4", 0], ["9.5", 0], ["1.3", 1], ["0.7", 3], ["3.2", 6]] },
  { id: 4278073, name: "Shai Gilgeous-Alexander", team: "OKC", pos: "PG", age: "28.1", durant: "11.17", cats: [["54.0", 1], ["88.0", 0], ["1.7", 3], ["30.4", 0], ["4.4", 4], ["6.2", 1], ["1.4", 1], ["0.8", 3], ["2.1", 3]] },
  { id: 3945274, name: "Luka Dončić", team: "LAL", pos: "SF", age: "27.5", durant: "10.24", cats: [["47.2", 3], ["78.1", 4], ["3.8", 0], ["31.6", 0], ["7.5", 2], ["8.0", 0], ["1.5", 1], ["0.5", 4], ["3.6", 6]] },
  { id: 4431678, name: "Tyrese Maxey", team: "PHI", pos: "SG", age: "25.8", durant: "9.44", cats: [["45.7", 4], ["88.3", 1], ["3.1", 0], ["27.7", 0], ["4.0", 4], ["6.4", 1], ["1.7", 0], ["0.7", 3], ["2.3", 4]] },
  { id: 4432166, name: "Cade Cunningham", team: "DET", pos: "SG", age: "24.9", durant: "7.14", cats: [["46.3", 4], ["82.1", 2], ["2.1", 2], ["24.7", 1], ["5.6", 3], ["9.5", 0], ["1.2", 2], ["0.8", 3], ["3.7", 6]] },
  { id: 4594268, name: "Anthony Edwards", team: "MIN", pos: "SG", age: "25.3", durant: "7.02", cats: [["44.9", 4], ["83.6", 2], ["3.9", 0], ["27.2", 0], ["5.7", 3], ["4.6", 3], ["1.2", 2], ["0.6", 3], ["3.0", 5]] },
  { id: 4396993, name: "Tyrese Haliburton", team: "IND", pos: "PG", age: "26.7", durant: "6.88", cats: [["47.5", 3], ["85.1", 1], ["3.0", 0], ["19.4", 2], ["3.7", 4], ["9.8", 0], ["1.4", 1], ["0.7", 3], ["2.2", 3]] },
];

/** One category chip: the label over the value, filled by tier. */
export function CatChip({ label, value, tier, className }: { label: string; value: string; tier: number; className?: string }) {
  const t = FBI_TIERS[tier];
  return (
    <span
      className={cn("flex flex-col items-center justify-center r-2 leading-none", className)}
      style={{ background: t.bg, color: t.fg }}
    >
      <span className="t-7 font-medium opacity-80">{label}</span>
      <span className="mt-0.5 font-mono t-11 font-semibold">{value}</span>
    </span>
  );
}

/** The redraft categories board: every player ranked, every category shaded by tier. */
export function FbiRankings() {
  return (
    <Surface w={760} brand="fbi" label="FBI Basketball categories rankings board: players ranked by projection, each of nine categories shaded by tier." className="bg-ground">
      <div className="px-8 pb-2 pt-8">
        <p className="t-11 font-medium text-accent">Redraft</p>
        <h3 className="mt-1 font-display t-38 leading-none tracking-[0.02em] text-ink">
          RANKINGS <span className="text-muted">·</span> <span className="text-accent">CATEGORIES</span>
        </h3>
        <div className="mt-3 h-px w-12 bg-accent" />
        <div className="mt-4 flex items-center gap-3 t-10 text-muted">
          <span>Tiers</span>
          {FBI_TIERS.map((t) => (
            <span key={t.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 r-1" style={{ background: t.bg }} />
              {t.label}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center border-b border-line pb-2 t-10 font-medium text-secondary">
          <span className="w-10 text-center">Rank</span>
          <span className="flex-1 pl-14">Player</span>
          <span className="w-16 text-center text-accent">DURANT ▾</span>
          <span className="w-[calc(var(--px)*342)] pl-1">Categories</span>
        </div>

        {BOARD.map((row, i) => (
          <div key={row.name} className="flex items-center border-b border-line/60 py-2.5">
            <span className="w-10 text-center font-display t-22 leading-none text-accent">{i + 1}</span>
            <span className="flex flex-1 items-center gap-3">
              <Face id={row.id} className="h-11 w-11" />
              <span className="min-w-0">
                <span className="block truncate t-14 font-medium leading-tight text-ink">{row.name}</span>
                <span className="mt-0.5 block font-mono t-10 text-muted">
                  {row.team} · {row.pos} · {row.age}
                </span>
              </span>
            </span>
            <span className="w-16 text-center font-display t-17 text-accent">{row.durant}</span>
            <span className="flex w-[calc(var(--px)*342)] gap-0.5">
              {row.cats.map(([value, tier], c) => (
                <CatChip key={CATS[c]} label={CATS[c]} value={value} tier={tier} className="h-8 w-9" />
              ))}
            </span>
          </div>
        ))}
      </div>
    </Surface>
  );
}

/* ─── shared pieces ───────────────────────────────────────────────────────── */

/* app/globals.css: --positive, --negative, gold-bright, ash-dim and the data mark. */
const POSITIVE = "#22c55e";
const NEGATIVE = "#c8312b";
const NEG_SOFT = "#d1675f"; /* negative lifted toward bone, as the reports mix it */
const GOLD_BRIGHT = "#e8c77e";
const ASH_DIM = "#5c5852";
const BONE = "#f5f1e8";
const DATA_MARK = "rgba(245,241,232,0.78)";

const MINUS = "−";

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** A signed number with a real minus sign, as components/subscriber/trade-report.tsx writes it. */
function signed(n: number, digits: number, suffix = "") {
  const r = Number(Math.abs(n).toFixed(digits));
  if (r === 0) return `${(0).toFixed(digits)}${suffix}`;
  return `${n > 0 ? "+" : MINUS}${r.toFixed(digits)}${suffix}`;
}

/*
  The photo frame the boards put a player in: a 2 pixel corner and a hairline.
  ESPN's picture is a wide plate with the head in its middle third and the
  shoulders running to its bottom corners. A square frame crops the empty
  sides, and a small enlargement from the bottom edge closes the gap above the
  head, so the shoulders reach both edges and the face sits in the middle.
*/
function Face({ id, className }: { id: number; className?: string }) {
  return (
    <Headshot
      league="nba"
      id={id}
      className={cn("r-2 border border-line bg-card [&>img]:origin-bottom [&>img]:scale-[1.06]", className)}
    />
  );
}

/** The page header every tool wears: eyebrow, Norwester title, short gold rule. */
function PageHead({ eyebrow, children, className }: { eyebrow: string; children: ReactNode; className?: string }) {
  return (
    <div>
      <p className="t-11 font-medium text-accent">{eyebrow}</p>
      <h3 className={cn("mt-1 font-display leading-none tracking-[0.02em] text-ink", className)}>{children}</h3>
      <div className="mt-3 h-px w-12 bg-accent" />
    </div>
  );
}

/** The site's one segmented switch (app/styles/controls.css `.switch`). */
function Switch({ options, on, className }: { options: string[]; on: number; className?: string }) {
  return (
    <span className={cn("inline-flex r-2 border border-accent/40 bg-card p-0.75", className)}>
      {options.map((o, i) => (
        <span
          key={o}
          className={cn("flex items-center justify-center r-2 font-semibold leading-none", i === on ? "bg-accent text-accent-ink" : "text-muted")}
        >
          {o}
        </span>
      ))}
    </span>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ─── rankings, one column ────────────────────────────────────────────────── */

/** The board as a phone shows it: rank, player and DURANT on one line, the nine chips under it. */
export function FbiRankingsTile() {
  return (
    <Surface w={420} brand="fbi" label="FBI Basketball categories rankings: the top five players, each with nine category chips shaded by tier." className="bg-ground">
      <div className="px-5 pb-2 pt-6">
        <PageHead eyebrow="Redraft" className="t-27">
          RANKINGS <span className="text-muted">·</span> <span className="text-accent">CATEGORIES</span>
        </PageHead>
        <div className="mt-3.5 flex items-center justify-between t-10 text-muted">
          {FBI_TIERS.map((t) => (
            <span key={t.label} className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 r-1" style={{ background: t.bg }} />
              {t.label}
            </span>
          ))}
        </div>

        <div className="mt-3.5 border-t border-line">
          {BOARD.slice(0, 5).map((row, i) => (
            <div key={row.name} className="border-b border-line/60 py-2.5 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-display t-24 leading-none text-ink">{i + 1}</span>
                <Face id={row.id} className="h-9 w-9" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate t-14 font-medium leading-tight text-ink">{row.name}</span>
                  <span className="mt-0.5 block font-mono t-10.5 text-muted">
                    {row.team} · {row.pos} · {row.age}
                  </span>
                </span>
                <span className="text-right leading-none">
                  <span className="block font-display t-19 text-accent">{row.durant}</span>
                  <span className="mt-1 block t-10 font-medium text-accent">DURANT</span>
                </span>
              </div>
              <div className="mt-2 grid grid-cols-9 gap-0.5">
                {row.cats.map(([value, tier], c) => {
                  const t = FBI_TIERS[tier];
                  return (
                    <span key={CATS[c]} className="flex h-8.5 flex-col items-center justify-center r-2 leading-none" style={{ background: t.bg, color: t.fg }}>
                      <span className="t-10 font-medium opacity-90">{CATS[c]}</span>
                      <span className="mt-0.75 font-mono t-12 font-semibold">{value}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/* ─── trade calculator ────────────────────────────────────────────────────── */

/*
  The verdict is computed the way lib/trade/judge.ts and lib/trade/verdict.ts
  compute it: each category has a chance to win it before and after, a week
  goes to whoever wins most categories (ties split), and the band is taken on
  the change in the weekly win chance (1, 3 and 6 points).
*/

/** lib/trade/judge.ts matchupWinChance, for unweighted categories. */
function matchupWinChance(ps: number[]) {
  let dist = [1];
  for (const p of ps) {
    const next = new Array<number>(dist.length + 1).fill(0);
    dist.forEach((v, w) => {
      next[w] += v * (1 - p);
      next[w + 1] += v * p;
    });
    dist = next;
  }
  const total = ps.length;
  return dist.reduce((win, v, w) => win + (w > total - w ? v : w === total - w ? v / 2 : 0), 0);
}

type TradeAsset = { id: number; name: string; team: string; rank: number; games: number };
type TradeCat = { label: string; week: number; ratio: boolean; before: number; after: number };

const TRADE: { send: TradeAsset[]; get: TradeAsset[]; weeks: number; cats: TradeCat[]; themAfter: number[] } = {
  send: [
    { id: 4594268, name: "Anthony Edwards", team: "MIN", rank: 7, games: 61 },
    { id: 4396993, name: "Tyrese Haliburton", team: "IND", rank: 8, games: 59 },
  ],
  get: [{ id: 3112335, name: "Nikola Jokic", team: "DEN", rank: 2, games: 62 }],
  /* Weeks left in the season, for the matchup-wins line. */
  weeks: 21,
  /* Your team: the weekly change, and the chance to win the category before and after. */
  cats: [
    { label: "FG%", week: 0.016, ratio: true, before: 0.5, after: 0.64 },
    { label: "FT%", week: -0.003, ratio: true, before: 0.5, after: 0.49 },
    { label: "3PT", week: -7.9, ratio: false, before: 0.5, after: 0.41 },
    { label: "PTS", week: -18.6, ratio: false, before: 0.5, after: 0.44 },
    { label: "REB", week: 14.8, ratio: false, before: 0.5, after: 0.62 },
    { label: "AST", week: -1.2, ratio: false, before: 0.5, after: 0.49 },
    { label: "STL", week: -0.8, ratio: false, before: 0.5, after: 0.47 },
    { label: "BLK", week: 1.1, ratio: false, before: 0.5, after: 0.53 },
    { label: "TO", week: -3.4, ratio: false, before: 0.5, after: 0.55 },
  ],
  /* The other team's chances after the trade, in the same category order. */
  themAfter: [0.37, 0.51, 0.58, 0.55, 0.39, 0.51, 0.53, 0.47, 0.46],
};

const VERDICT = (() => {
  const before = matchupWinChance(TRADE.cats.map((c) => c.before));
  const after = matchupWinChance(TRADE.cats.map((c) => c.after));
  const winYou = after - before;
  const winThem = matchupWinChance(TRADE.themAfter) - before;
  const catsYou = sum(TRADE.cats.map((c) => c.after - c.before));
  const catsThem = sum(TRADE.themAfter) - sum(TRADE.cats.map((c) => c.before));
  const a = Math.abs(winYou);
  const band = a < 0.01 ? "even" : a < 0.03 ? "slight" : a < 0.06 ? "clear" : "big";
  const won = { slight: "Slight edge to you", clear: "You win this trade", big: "You win this trade big" };
  const lost = { slight: "Slight edge to them", clear: "You lose this trade", big: "You lose this trade big" };
  const headline = band === "even" ? "Too close to call" : winYou > 0 ? won[band] : lost[band];
  const rows = [...TRADE.cats].sort((x, y) => Math.abs(y.after - y.before) - Math.abs(x.after - x.before));
  const pb = Math.round(before * 1000) / 10;
  const pa = Math.round((pb + Number((winYou * 100).toFixed(1))) * 10) / 10;
  return { before, after, winYou, winThem, catsYou, catsThem, headline, rows, pb, pa, seasonWins: winYou * TRADE.weeks };
})();

/** One player on a side of the trade (trade-calculator.tsx AssetCard). */
function AssetCard({ asset, index, narrow }: { asset: TradeAsset; index: number; narrow?: boolean }) {
  const remove = (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center r-2 border border-line text-muted">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </span>
  );
  const chip = <span className="inline-flex h-5.5 items-center r-2 border border-line bg-ground/60 px-2 t-11 font-semibold text-muted">{asset.team}</span>;
  if (narrow) {
    return (
      <div className="r-2 border border-line bg-card px-2.5 pb-2.5 pt-2">
        <div className="flex items-center justify-between">
          <Face id={asset.id} className="h-8.5 w-8.5" />
          <span className="text-right leading-none">
            <span className="block font-display t-19 text-accent">#{asset.rank}</span>
            <span className="mt-1 block whitespace-nowrap t-10 font-medium text-muted">FBI rank</span>
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-1.5 leading-none">
          <span className="whitespace-nowrap t-12 font-semibold text-ink">{asset.name}</span>
          <span className="t-10 font-semibold text-muted">{asset.team}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 r-2 border border-line bg-card px-3 py-2.5">
      <span className="font-mono t-11 text-[#5c5852]">{String(index + 1).padStart(2, "0")}</span>
      <Face id={asset.id} className="h-11 w-11" />
      <span className="min-w-0 flex-1">
        <span className="block t-15 font-semibold leading-tight text-ink">{asset.name}</span>
        <span className="mt-1.5 flex">{chip}</span>
      </span>
      <span className="text-right leading-none">
        <span className="block font-display t-24 text-accent">#{asset.rank}</span>
        <span className="mt-1 block t-11 font-medium text-muted">FBI rank</span>
      </span>
      {remove}
    </div>
  );
}

function TradeSide({ title, assets, narrow }: { title: string; assets: TradeAsset[]; narrow?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col r-2 border border-line bg-card/55", narrow ? "gap-2.5 p-2" : "gap-4 p-4.5")}>
      <div className="flex items-center justify-between gap-2">
        <span className="t-13 font-semibold text-accent">{title}</span>
        <span className="flex items-center gap-3">
          <span className={cn("text-muted", narrow ? "t-11" : "t-12")}>
            {assets.length} {assets.length === 1 ? "player" : "players"}
          </span>
          {!narrow && <span className="flex h-8 items-center r-2 border border-line px-3 t-12 font-medium text-muted">Clear</span>}
        </span>
      </div>
      {!narrow && (
        <div className="flex h-10 items-center gap-2.5 r-2 border border-line bg-ground px-3">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="flex-1 t-14 text-muted">Add player</span>
          <span className="r-2 border border-line px-1.5 font-mono t-10 leading-[1.6] text-[#5c5852]">Enter</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2">
        {assets.map((a, i) => (
          <AssetCard key={a.name} asset={a} index={i} narrow={narrow} />
        ))}
      </div>
      <div className={cn("flex items-baseline justify-between border-t border-line", narrow ? "pt-2.5" : "pt-4")}>
        <span className={cn("font-medium text-muted", narrow ? "t-11" : "t-12")}>Games left</span>
        <span className={cn("font-mono leading-none text-ink", narrow ? "t-17" : "t-22")}>{sum(assets.map((a) => a.games))}</span>
      </div>
    </div>
  );
}

function VsRule({ className, badge }: { className?: string; badge: string }) {
  return (
    <span className={cn("relative flex justify-center", className)}>
      <span className="h-full w-px bg-accent/40" />
      <span className={cn("absolute top-1/2 -translate-y-1/2 r-2 border border-line bg-card font-display italic text-accent", badge)}>VS</span>
    </span>
  );
}

/* lib/charts/gauge.ts: 0% points left, 50% up, 100% right. */
const gaugePoint = (p: number, r: number) => {
  const rad = ((p * 180 - 180) * Math.PI) / 180;
  return { x: Math.round((100 + r * Math.cos(rad)) * 100) / 100, y: Math.round((100 + r * Math.sin(rad)) * 100) / 100 };
};
const gaugeArc = (a: number, b: number, r: number) => {
  const p0 = gaugePoint(a, r);
  const p1 = gaugePoint(b, r);
  return `M${p0.x} ${p0.y}A${r} ${r} 0 0 1 ${p1.x} ${p1.y}`;
};

/** The weekly win chance before and after (components/subscriber/win-chance-gauge.tsx). */
function WinGauge({ className }: { className?: string }) {
  const { before, after } = VERDICT;
  return (
    <div className={className}>
      <svg viewBox="0 0 200 106" className="block w-full overflow-visible">
        <path d={gaugeArc(0, 1, 82)} fill="none" stroke="#2a2a30" strokeWidth="10" />
        <path d={gaugeArc(before, after, 82)} fill="none" stroke={POSITIVE} strokeWidth="10" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const a = gaugePoint(t, 72);
          const b = gaugePoint(t, t === 0.5 ? 64 : 68);
          return <line key={t} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ASH_DIM} strokeWidth="1" />;
        })}
        <g transform={`rotate(${Math.round((before * 180 - 90) * 100) / 100} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="34" stroke="#8a8680" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${Math.round((after * 180 - 90) * 100) / 100} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="24" stroke="#c9a961" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="4" fill="#c9a961" />
      </svg>
      <div className="flex justify-between px-[4%] font-mono t-10 text-[#5c5852]">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function GaugeNums({ big }: { big?: boolean }) {
  return (
    <>
      <span className="flex flex-col items-center gap-1 leading-none">
        <span className={cn("font-medium text-muted", big ? "t-12" : "t-11")}>Before</span>
        <span className={cn("font-mono text-muted", big ? "t-16" : "t-14")}>{VERDICT.pb.toFixed(1)}%</span>
      </span>
      <span className="flex flex-col items-center gap-1 leading-none">
        <span className={cn("font-medium text-muted", big ? "t-12" : "t-11")}>After</span>
        <span className={cn("font-mono text-[#22c55e]", big ? "t-28" : "t-22")}>{VERDICT.pa.toFixed(1)}%</span>
      </span>
    </>
  );
}

function VerdictLead({ className }: { className?: string }) {
  return (
    <p className={cn("text-muted", className)}>
      <span className="whitespace-nowrap">
        <span className="font-mono text-ink">{signed(VERDICT.catsYou, 2)}</span> categories a week
      </span>
      <span className="text-[#5c5852]"> · </span>
      <span className="whitespace-nowrap">
        <span className="font-mono text-ink">{signed(VERDICT.winYou * 100, 1, "%")}</span> to win each week
      </span>
    </p>
  );
}

const VERDICT_FRAME = "r-2 border border-accent/30 bg-[radial-gradient(ellipse_at_top,rgba(201,169,97,0.08),transparent_70%)]";

/** Two sides and the verdict, as a phone lays them out. */
export function FbiTradeTile() {
  return (
    <Surface w={400} brand="fbi" label="FBI Basketball trade calculator: Anthony Edwards and Tyrese Haliburton for Nikola Jokic, with the verdict You win this trade." className="bg-ground">
      <div className="px-5 pb-5 pt-6">
        <PageHead eyebrow="Redraft" className="t-25">
          TRADE CALCULATOR <span className="text-muted">·</span> <span className="text-accent">CATEGORIES</span>
        </PageHead>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2">
          <TradeSide title="You send" assets={TRADE.send} narrow />
          <VsRule className="w-3" badge="px-1 py-0.5 t-10" />
          <TradeSide title="You get" assets={TRADE.get} narrow />
        </div>

        <div className={cn("mt-4 p-4 text-center", VERDICT_FRAME)}>
          <p className="t-11 font-medium text-accent">Verdict</p>
          <p className="mt-2 font-display t-29 uppercase leading-[0.95] tracking-[0.015em] text-[#22c55e]">{VERDICT.headline}</p>
          <VerdictLead className="mt-2.5 t-12" />
          <div className="mt-3 flex items-end justify-center gap-5">
            <WinGauge className="w-39" />
            <span className="flex items-end gap-4 pb-4">
              <GaugeNums />
            </span>
          </div>
        </div>
      </div>
    </Surface>
  );
}

const TRADE_CAT_GRID = "grid grid-cols-[calc(var(--px)*40)_calc(var(--px)*58)_minmax(0,1fr)_calc(var(--px)*72)] items-center gap-x-3";

/** One category's row in the verdict (trade-report.tsx CategoryTable). */
function TradeCatRow({ c }: { c: TradeCat }) {
  const dp = c.after - c.before;
  const tone = Math.abs(dp) < 0.005 ? BONE : dp > 0 ? POSITIVE : NEGATIVE;
  return (
    <div className={cn(TRADE_CAT_GRID, "border-b border-line/60 py-2.5 t-13 last:border-b-0")}>
      <span className="font-bold text-ink">{c.label}</span>
      <span className="text-right font-mono" style={{ color: tone }}>
        {c.ratio ? signed(c.week * 100, 1, "%") : signed(c.week, 1)}
      </span>
      <span className="relative block h-2 r-2 bg-line/80">
        <span className="absolute inset-y-0 left-0 r-2" style={{ width: `${Math.round(c.after * 100)}%`, background: tone }} />
        <span className="absolute -bottom-0.75 -top-0.75 w-0.5 -translate-x-1/2 bg-ink" style={{ left: `${Math.round(c.before * 100)}%` }} />
      </span>
      <span className="text-right font-mono text-ink">
        <span className="text-muted">{Math.round(c.before * 100)}</span>
        <span className="mx-1 font-sans text-muted">→</span>
        {Math.round(c.after * 100)}%
      </span>
    </div>
  );
}

function Stepper({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex flex-col gap-2">
      <span className="t-12 font-medium text-accent">{label}</span>
      <span className="flex h-10 items-stretch r-2 border border-line">
        <span className="flex w-10 items-center justify-center text-muted">{MINUS}</span>
        <span className="flex w-11 items-center justify-center border-x border-line font-display t-20 text-ink">{value}</span>
        <span className="flex w-10 items-center justify-center text-muted">+</span>
      </span>
    </span>
  );
}

/** One side's change in the verdict (trade-report.tsx SideTile). */
function SideTile({ who, cats, win }: { who: string; cats: number; win: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 r-2 border border-line px-4 py-3.5 leading-none">
      <span className="t-12 font-medium text-muted">{who}</span>
      <span className="mt-1 font-mono t-26" style={{ color: cats > 0 ? POSITIVE : NEGATIVE }}>
        {signed(cats, 2)}
      </span>
      <span className="mt-1 t-12 text-muted">categories a week</span>
      <span className="mt-1.5 t-12 text-muted">
        <span className="font-mono text-ink">{signed(win * 100, 1, "%")}</span> to win a week
      </span>
    </div>
  );
}

/** The whole calculator: league shape, both sides, and the full verdict. */
export function FbiTrade() {
  return (
    <Surface w={920} brand="fbi" label="FBI Basketball trade calculator: a two for one trade judged by what it does to a team's week, with the chance to win each category before and after." className="bg-ground">
      <div className="px-9 pb-9 pt-8">
        <PageHead eyebrow="Redraft" className="t-40">
          TRADE CALCULATOR <span className="text-muted">·</span> <span className="text-accent">CATEGORIES</span>
        </PageHead>

        <div className="mt-6 flex items-end gap-5 r-2 border border-line px-5 py-4">
          <span className="flex flex-col gap-2">
            <span className="t-12 font-medium text-accent">Scoring</span>
            <Switch options={["Categories", "Points"]} on={0} className="h-10 t-13 [&>span]:w-24" />
          </span>
          <Stepper label="Teams" value={12} />
          <Stepper label="Starters" value={10} />
          <Stepper label="Bench" value={4} />
          <span className="ml-auto flex h-10 items-center gap-2 whitespace-nowrap r-2 border border-line px-3.5 t-12 font-medium text-secondary">
            Why it matters
            <Chevron className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6">
          <TradeSide title="You send" assets={TRADE.send} />
          <VsRule className="w-8" badge="px-2 py-1 t-11" />
          <TradeSide title="You get" assets={TRADE.get} />
        </div>

        <div className={cn("mt-6 p-7", VERDICT_FRAME)}>
          <div className="grid grid-cols-2 gap-9">
            <div className="flex flex-col justify-between gap-5 text-center">
              <div>
                <p className="t-12 font-medium text-accent">Verdict</p>
                <p className="mt-3 whitespace-nowrap font-display t-40 uppercase leading-[0.95] tracking-[0.015em] text-[#22c55e]">{VERDICT.headline}</p>
                <VerdictLead className="mt-4 whitespace-nowrap t-14" />
                <p className="mt-1.5 whitespace-nowrap t-12.5 text-muted">
                  About {Math.abs(VERDICT.seasonWins).toFixed(1)} more matchup wins over the rest of the season
                </p>
              </div>
              <div className="mx-auto w-60">
                <p className="mb-2 t-12 font-medium text-muted">Chance to win a week</p>
                <WinGauge />
                <div className="mt-2 flex items-end justify-center gap-8">
                  <GaugeNums big />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className={cn(TRADE_CAT_GRID, "border-b border-line/60 pb-1.5 t-11 font-bold text-muted")}>
                <span>Cat</span>
                <span className="text-right">A week</span>
                <span className="col-span-2">Chance to win it</span>
              </div>
              {VERDICT.rows.map((c) => (
                <TradeCatRow key={c.label} c={c} />
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.6fr)] items-center gap-3 border-t border-line pt-6">
            <SideTile who="You" cats={VERDICT.catsYou} win={VERDICT.winYou} />
            <SideTile who="Them" cats={VERDICT.catsThem} win={VERDICT.winThem} />
            <p className="flex items-center gap-2.5 pl-5 t-13 text-muted">
              <span className="h-1.25 w-1.25 shrink-0 bg-accent" />
              You fill an open spot from waivers
            </p>
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ─── player page ─────────────────────────────────────────────────────────── */

/* app/styles/player-bio.css: the seven tiers as a cell tint and a top rule. */
const CELL_TIERS: ({ fill: string; rule: string } | null)[] = [
  { fill: "rgba(13,110,58,0.62)", rule: "#1f9d55" },
  { fill: "rgba(63,160,99,0.26)", rule: "#3fa063" },
  { fill: "rgba(156,209,177,0.12)", rule: "#9cd1b1" },
  null,
  { fill: "rgba(243,168,168,0.10)", rule: "#f3a8a8" },
  { fill: "rgba(214,58,58,0.24)", rule: "#d63a3a" },
  { fill: "rgba(122,13,13,0.62)", rule: "#b51f1f" },
];
/* Ranks 1 to 3 wear the podium metals (the --metal-* tokens in app/globals.css). */
const PODIUM = [
  { fill: "rgba(242,196,64,0.10)", rule: "linear-gradient(135deg,#fff6c2,#f2c440 30%,#c48f17 55%,#f5d265 80%,#fff1b0)", ink: "#f2c440" },
  { fill: "rgba(198,208,220,0.08)", rule: "linear-gradient(135deg,#ffffff,#c6d0dc 30%,#8e9aab 55%,#d9e1eb 80%,#ffffff)", ink: "#c6d0dc" },
  { fill: "rgba(220,141,76,0.09)", rule: "linear-gradient(135deg,#ffd3a8,#dc8d4c 30%,#ad642f 55%,#e3a46e 80%,#ffd7b0)", ink: "#dc8d4c" },
];

/** lib/data/player-bio.ts rankTier: metals for 1 to 3, then greens by draft round. */
function rankDress(rank: number) {
  if (rank <= 3) return PODIUM[rank - 1];
  const t = rank <= 12 ? CELL_TIERS[0] : rank <= 36 ? CELL_TIERS[1] : rank <= 84 ? CELL_TIERS[2] : null;
  return t ? { ...t, ink: BONE } : { fill: "transparent", rule: "transparent", ink: BONE };
}

const PLAYER = (() => {
  const row = BOARD[2];
  const [fg, ft, tpm, pts, reb, ast, stl, blk, to] = row.cats;
  /* lib/data/points-scoring.ts default weights: PTS 1, REB 1.2, AST 1.5, STL 3, BLK 3, TO -1. */
  const fppg = Number(pts[0]) + Number(reb[0]) * 1.2 + Number(ast[0]) * 1.5 + Number(stl[0]) * 3 + Number(blk[0]) * 3 - Number(to[0]);
  const vitals: [string, string, string][] = [
    ["Age", row.age, ""],
    ["Height", "6'6\"", ""],
    ["Weight", "195", "lbs"],
    ["Season", "9th", ""],
  ];
  const ranks: [string, number][] = [
    ["Points", 2],
    ["Categories", 3],
    ["Dynasty Points", 4],
    ["Dynasty Categories", 5],
  ];
  const stats: [string, string, number][] = [
    ["PPG", pts[0], pts[1]],
    ["RPG", reb[0], reb[1]],
    ["APG", ast[0], ast[1]],
    ["SPG", stl[0], stl[1]],
    ["BPG", blk[0], blk[1]],
    ["TOV", to[0], to[1]],
    ["FG%", `${fg[0]}%`, fg[1]],
    ["FT%", `${ft[0]}%`, ft[1]],
    ["3PM", tpm[0], tpm[1]],
    ["MIN", "34.1", 1],
    ["DD / TD", "9% / 0%", 3],
    ["FPPG", fppg.toFixed(1), 0],
  ];
  /* lib/data/nba-teams.ts NBA_TEAM_COLOR.OKC */
  return { id: row.id, name: row.name, team: row.team, pos: row.pos, jersey: 2, color: "#007ac1", vitals, ranks, stats };
})();

/** The top of a player's page: the hero in his club's colour, his ranks, his projected line. */
export function FbiPlayer() {
  const p = PLAYER;
  return (
    <Surface w={400} brand="fbi" label="FBI Basketball player page for Shai Gilgeous-Alexander: his rank on four boards and his projected per game line shaded by tier." className="bg-ground">
      <div className="p-5">
        <div className="relative overflow-hidden r-2 border border-line bg-card">
          <span
            className="absolute inset-0"
            style={{
              background: `radial-gradient(55% 130% at 8% 100%, color-mix(in srgb, ${p.color} 34%, transparent) 0%, transparent 70%), linear-gradient(100deg, color-mix(in srgb, ${p.color} 16%, transparent) 0%, color-mix(in srgb, ${p.color} 5%, transparent) 45%, transparent 72%)`,
            }}
          />
          <span
            className="absolute inset-x-0 top-0 h-0.75"
            style={{ background: `linear-gradient(90deg, ${p.color} 0%, color-mix(in srgb, ${p.color} 45%, transparent) 55%, transparent 100%)` }}
          />
          <div className="relative flex items-end gap-2 pl-1 pr-4 pt-4">
            <Headshot league="nba" id={p.id} className="h-25 w-34 bg-transparent" />
            <div className="min-w-0 flex-1 pb-5">
              <p className="flex items-center gap-2 t-12 font-semibold text-muted">
                <span>{p.team}</span>
                <span className="text-[#5c5852]">·</span>
                <span>{p.pos}</span>
                <span className="text-[#5c5852]">·</span>
                <span className="font-display t-13 tracking-[0.02em] text-ink">#{p.jersey}</span>
              </p>
              <p className="mt-2 whitespace-nowrap font-display t-29 uppercase leading-[0.92] tracking-[0.015em] text-ink">
                Shai Gilgeous-
                <br />
                Alexander
              </p>
            </div>
          </div>
          <div className="relative grid grid-cols-4 gap-px border-t border-line bg-line">
            {p.vitals.map(([label, value, unit]) => (
              <div key={label} className="flex flex-col items-center gap-1.5 bg-[#101012] px-1 pb-3 pt-3.5 leading-none">
                <span className="font-display t-21 text-ink">
                  {value}
                  {unit && <span className="ml-1 font-sans t-10 font-medium text-muted">{unit}</span>}
                </span>
                <span className="t-11 font-medium text-[#5c5852]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden r-2 border border-line bg-line">
          {p.ranks.map(([label, rank]) => {
            const d = rankDress(rank);
            return (
              <div key={label} className="relative flex flex-col gap-2 px-4 pb-3 pt-3.5" style={{ background: `linear-gradient(${d.fill}, ${d.fill}), #141416` }}>
                <span className="absolute inset-x-0 top-0 h-0.75" style={{ background: d.rule }} />
                <span className="whitespace-nowrap t-12 font-medium leading-none text-muted">{label}</span>
                <span className="font-display t-28 leading-none" style={{ color: d.ink }}>
                  #{rank}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-5 t-12 font-medium text-muted">Projected per game</p>
        <div className="mt-2.5 grid grid-cols-4 gap-px overflow-hidden r-2 border border-line bg-line">
          {p.stats.map(([label, value, tier]) => {
            const t = CELL_TIERS[tier];
            return (
              <div
                key={label}
                className="relative flex h-13.5 flex-col items-center justify-center gap-1.5 pt-0.75 leading-none"
                style={{ background: t ? `linear-gradient(${t.fill}, ${t.fill}), #141416` : "#141416" }}
              >
                {t && <span className="absolute inset-x-0 top-0 h-0.75" style={{ background: t.rule }} />}
                <span className="whitespace-nowrap font-display t-19 text-ink">{value}</span>
                <span className={cn("t-10.5 font-medium", tier === 0 || tier === 6 ? "text-ink/80" : "text-muted")}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Surface>
  );
}

/* ─── Season Ticket cards ─────────────────────────────────────────────────── */

/* lib/auth/tiers.ts for names, contracts and prices; components/paywall/card-theme.ts for the dress. */
const CARDS = [
  { id: "white", name: "White Card", contract: "Two-Way Deal", covers: "The board", price: "Free", ink: BONE, chip: "rgba(245,241,232,0.10)", face: "#101012", edge: "#2a2a30", move: "group-hover/tile:-translate-y-4 group-hover/tile:-rotate-2" },
  { id: "black", name: "Black Card", contract: "Free Agent", covers: "Redraft", price: "$15", ink: BONE, chip: "rgba(245,241,232,0.10)", face: "#0a0a0b", edge: "rgba(245,241,232,0.30)", move: "group-hover/tile:-translate-y-2.5 group-hover/tile:rotate-1" },
  { id: "gold", name: "Gold Card", contract: "Bird Rights", covers: "Dynasty", price: "$15", ink: "#c9a961", chip: "rgba(201,169,97,0.15)", face: "#141416", edge: "rgba(201,169,97,0.55)", move: "group-hover/tile:-translate-y-1 group-hover/tile:-rotate-1" },
  { id: "diamond", name: "Diamond Card", contract: "Supermax Contract", covers: "Everything", price: "$25", ink: "#a9ddf0", chip: "rgba(169,221,240,0.15)", face: "linear-gradient(135deg, rgba(215,240,250,0.14) 0%, rgba(20,20,22,1) 42%, rgba(95,168,199,0.22) 100%), #141416", edge: "#a9ddf0", move: "" },
];

function CardFace({ card, front }: { card: (typeof CARDS)[number]; front?: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="flex items-center gap-2">
            <Image src={`/brand/fbi/card-${card.id}.png`} alt="" width={128} height={128} className="h-8 w-8 shrink-0" />
            <span className="font-display t-19 uppercase leading-none tracking-[0.03em]" style={{ color: card.ink }}>
              {card.name}
            </span>
          </span>
          <span className="mt-0.5 flex items-center gap-2">
            <span className="r-2 px-1.5 py-0.5 t-11 font-medium leading-[1.3]" style={{ background: card.chip, color: card.ink }}>
              {card.contract}
            </span>
            <span className="t-11 font-medium text-muted">{card.covers}</span>
          </span>
        </div>
        <span className="pt-0.5 text-right leading-none">
          <span className="block font-display t-24 uppercase" style={{ color: card.ink }}>
            {card.price}
          </span>
          {!front && <span className="mt-1.5 block t-10 text-muted">{card.id === "white" ? "Always" : "One-time"}</span>}
        </span>
      </div>
      {front && (
        <>
          <p className="mt-3 t-11 text-muted">
            <span className="font-semibold text-ink">One-time</span> · access through April 30, 2027
          </p>
          <span className="mt-3 flex h-10 items-center justify-center r-2 t-13 font-semibold text-[#0a0a0b]" style={{ background: card.ink }}>
            Get the Diamond Card
          </span>
          <ul className="mt-3.5 flex flex-col gap-2 border-t border-line pt-3 t-12 font-medium text-ink">
            {["Redraft rankings, 9-cat and points", "Dynasty rankings", "Schedule Analyzer"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke={card.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

/** The four cards, stacked like a hand. They spread a little when the tile is hovered. */
export function FbiCards() {
  return (
    <Surface w={400} brand="fbi" label="The four FBI Season Ticket cards: White, free; Black, 15 dollars; Gold, 15 dollars; Diamond, 25 dollars." className="bg-ground">
      <div className="px-5 pb-6 pt-6">
        <p className="t-11 font-medium text-accent">FBI Season Ticket</p>
        <h3 className="mt-1.5 font-display t-25 leading-none tracking-[0.02em] text-ink">PICK YOUR CARD</h3>

        <div className="relative mt-8 h-110">
          {CARDS.map((card, i) => {
            const front = i === CARDS.length - 1;
            return (
              <div
                key={card.id}
                className={cn(
                  "absolute inset-x-0 r-4 border px-4 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  front
                    ? "pb-4 shadow-[0_0_calc(var(--px)*30)_rgba(169,221,240,0.22),inset_0_1px_0_rgba(215,240,250,0.28)]"
                    : "h-40 shadow-[0_calc(var(--px)*-6)_calc(var(--px)*16)_rgba(0,0,0,0.5)]",
                  card.move,
                )}
                style={{ top: `calc(var(--px) * ${i * 66})`, background: card.face, borderColor: card.edge }}
              >
                <CardFace card={card} front={front} />
              </div>
            );
          })}
        </div>
      </div>
    </Surface>
  );
}

/* ─── projection engine run ───────────────────────────────────────────────── */

/*
  The stages are lib/ros/run.ts's, in the order it runs them, and the notes are
  the counts each stage records in its detail. Bar widths follow
  lib/ops/admin-insights.ts buildStageBars: each stage's share of the summed
  stage time, placed where it ran.
*/
const ENGINE_RUN = {
  date: "2026-11-11",
  wallMs: 101_300,
  stages: [
    { stage: "ingest-gamelogs", ms: 21_400, note: "11 games · 236 rows" },
    { stage: "ingest-injuries", ms: 3_200, note: "94 updated · 7 changes" },
    { stage: "ingest-depthcharts", ms: 6_800, note: "30 teams · 517 rows" },
    { stage: "team-self-heal", ms: 420, note: "541 checked · 1 updated" },
    { stage: "load-inputs", ms: 9_600, note: "538 players · 3,612 log rows" },
    { stage: "project", ms: 2_900, note: "538 rows · ros-v48" },
    { stage: "adjust", ms: 48_300, note: "40 players read · 40 valid" },
    { stage: "persist", ms: 5_100, note: "538 rows · snapshot written" },
  ],
};

/** lib/ops/admin-insights.ts formatMs. */
function formatMs(ms: number) {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`;
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
}

const ENGINE_BARS = (() => {
  const total = sum(ENGINE_RUN.stages.map((s) => s.ms));
  const floored = ENGINE_RUN.stages.map((s) => Math.max((s.ms / total) * 100, 0.8));
  const scale = 100 / sum(floored);
  const widths = floored.map((w) => Math.round(w * scale * 100) / 100);
  return ENGINE_RUN.stages.map((s, i) => ({ ...s, offset: Math.round(sum(widths.slice(0, i)) * 100) / 100, width: widths[i] }));
})();

const ENGINE_SLOTS = [
  ["08:00 UTC", "ROS engine", "Ingest ESPN, project, news layer, rank, snapshot; then the movers card"],
  ["21:30 UTC", "Pre-tip re-run", "Same engine after official injury reports; no snapshot, no movers card"],
];

/** The engine page's last run panel, with the two daily slots from its timeline. */
export function FbiEngine() {
  return (
    <Surface w={420} brand="fbi" label="FBI Basketball projection engine run log: eight stages from ingesting box scores to writing the board, each with its duration." className="bg-ground">
      <div className="p-5">
        <div className="r-2 border border-line border-t-[#786a48] bg-[#101012] p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="t-11 font-medium text-muted">Newest run</p>
              <p className="mt-1 flex items-center gap-2 font-display t-23 leading-none tracking-[0.02em] text-ink">
                {ENGINE_RUN.date}
                <span className="r-2 border border-accent/60 px-1.5 py-0.5 font-sans t-11 font-semibold leading-[1.2] tracking-normal text-accent">ok</span>
              </p>
            </div>
            <div className="flex gap-4">
              {[
                ["Wall time", formatMs(ENGINE_RUN.wallMs)],
                ["Stages", `${ENGINE_BARS.length} of ${ENGINE_BARS.length} ok`],
              ].map(([k, v]) => (
                <span key={k} className="leading-none">
                  <span className="block t-10.5 font-medium text-muted">{k}</span>
                  <span className="mt-1.5 block font-mono t-12 font-medium text-ink">{v}</span>
                </span>
              ))}
            </div>
          </div>

          <ol className="mt-4 flex flex-col gap-2">
            {ENGINE_BARS.map((b, i) => (
              <li key={b.stage} className="grid grid-cols-[calc(var(--px)*122)_minmax(0,1fr)_calc(var(--px)*74)] items-center gap-x-2.5 gap-y-0.5">
                <span className="truncate font-mono t-11 font-medium text-secondary">{b.stage}</span>
                <span className="relative h-3.5 overflow-hidden r-2 bg-card bg-[linear-gradient(90deg,transparent_24.6%,#1f1f23_25%,transparent_25.4%,transparent_49.6%,#1f1f23_50%,transparent_50.4%,transparent_74.6%,#1f1f23_75%,transparent_75.4%)]">
                  <span
                    className="fbi-stage-bar absolute bottom-0.5 top-0.5 min-w-0.75 r-1 bg-accent"
                    style={{ left: `${b.offset}%`, width: `${b.width}%`, animationDelay: `${i * 70}ms` }}
                  />
                </span>
                <span className="flex justify-end gap-1.5 whitespace-nowrap font-mono t-11 font-medium text-ink">
                  {formatMs(b.ms)}
                  <span className="text-accent">ok</span>
                </span>
                <span className="col-span-2 col-start-2 font-mono t-10 text-muted">{b.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-l border-line pl-4">
          {ENGINE_SLOTS.map(([time, name, what]) => (
            <div key={time} className="relative">
              <span className="absolute left-[calc(var(--px)*-19.5)] top-1 h-1.75 w-1.75 bg-accent" />
              <p className="flex items-baseline gap-2.5 leading-none">
                <span className="font-mono t-11 font-semibold text-ink">{time}</span>
                <span className="t-12 font-medium text-accent">{name}</span>
              </p>
              <p className="mt-1.5 t-11 leading-[1.4] text-muted">{what}</p>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/* ─── schedule analyzer ───────────────────────────────────────────────────── */

/*
  A sample 1,230 game season: every team plays 82, each week's team games are
  an even number, and the All-Star break empties parts of weeks 17 and 18.
  Each row is [team, games in each of the 25 weeks, quality games,
  back-to-backs, R, O, P]. Quality games are those on nights with 8 games or
  fewer; the scores are lib/data/schedule-score.ts run over this sample with
  playoff weeks 21 to 23.
*/
const SCHEDULE: [string, string, number, number, number, number, number][] = [
  ["ATL", "3433443433433434224333334", 47, 11, 50, 44, 37],
  ["BOS", "2344434433443344224314334", 52, 17, 54, 33, 13],
  ["BKN", "4434334333333444124424442", 49, 17, 51, 42, 33],
  ["CHA", "3443244433432434223443343", 46, 13, 46, 47, 47],
  ["CHI", "3443433444433433123434342", 38, 10, 48, 47, 47],
  ["CLE", "3414434343333443223434443", 47, 12, 56, 59, 62],
  ["DAL", "3344344434424443123333433", 44, 14, 49, 46, 42],
  ["DEN", "4333433444333443223433433", 57, 13, 59, 51, 42],
  ["DET", "3334343333444443232423344", 50, 16, 47, 34, 22],
  ["GSW", "3333333434424343223443444", 53, 15, 52, 57, 62],
  ["HOU", "3434333442433434124344334", 48, 13, 55, 52, 48],
  ["IND", "3434232443433443224343434", 43, 15, 40, 48, 57],
  ["LAC", "3433334444344333223334433", 43, 11, 46, 54, 62],
  ["LAL", "3343343343443343224344333", 42, 12, 43, 50, 57],
  ["MEM", "3343344442434433133333443", 46, 16, 49, 45, 42],
  ["MIA", "2434344334243344124434433", 48, 14, 54, 58, 62],
  ["MIL", "3343434433443333223344433", 51, 12, 54, 63, 72],
  ["MIN", "3333344343434433223433434", 56, 14, 57, 54, 52],
  ["NOP", "3433433434243433223443434", 45, 12, 47, 52, 57],
  ["NYK", "2434334433343334232444433", 51, 16, 48, 55, 62],
  ["OKC", "4343434334343334224333343", 43, 11, 46, 44, 42],
  ["ORL", "3344433443343444214232434", 45, 11, 55, 51, 46],
  ["PHI", "3334334423443443223334443", 50, 11, 54, 53, 52],
  ["PHX", "3343434433443333224334343", 52, 13, 53, 55, 56],
  ["POR", "3343333433244434223434434", 47, 12, 49, 55, 62],
  ["SAC", "3333433433444343223334443", 42, 10, 46, 49, 52],
  ["SAS", "3443333434433334223334443", 45, 14, 44, 55, 66],
  ["TOR", "3443433343343342224344343", 50, 15, 48, 53, 57],
  ["UTA", "3432334443334343123434444", 44, 16, 46, 45, 43],
  ["WAS", "3343333444343343124343434", 48, 12, 57, 52, 48],
];

/* 0-based week positions: the playoff rounds, and the weeks a league break falls in. */
const PLAYOFF_WEEKS = [20, 21, 22];
const BREAK_WEEKS = [16, 17];

/** Monday of each fantasy week as month/day. Week 1 starts 19 October 2026. */
const weekStart = (i: number) => {
  const d = new Date(Date.UTC(2026, 9, 19 + i * 7));
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
};

/* components/boards/schedule-grid.tsx gamesTone: 4 or more green, 2 or fewer red. */
const gamesTone = (n: number) => (n >= 4 ? POSITIVE : n <= 2 ? NEGATIVE : BONE);
const scoreTone = (v: number, strong: boolean) => (v >= 55 ? POSITIVE : v <= 45 ? NEGATIVE : strong ? BONE : "#8a8680");

const scheduleRow = (r: (typeof SCHEDULE)[number]) => {
  const weeks = [...r[1]].map(Number);
  return {
    team: r[0],
    weeks,
    pg: sum(PLAYOFF_WEEKS.map((i) => weeks[i])),
    heavy: weeks.filter((n) => n >= 4).length,
    light: weeks.filter((n) => n <= 2).length,
    qg: r[2],
    b2b: r[3],
    r: r[4],
    o: r[5],
    p: r[6],
  };
};

const CELL = "flex items-center justify-center border-l border-line/40 font-mono";

/** A week column's header: the week, its Monday, and the playoff round or break it carries. */
function WeekHead({ i, className, small }: { i: number; className?: string; small?: boolean }) {
  const round = PLAYOFF_WEEKS.indexOf(i);
  const brk = BREAK_WEEKS.includes(i);
  return (
    <span
      className={cn("flex flex-col items-center justify-center gap-0.5 border-l py-2 leading-none", className)}
      style={{ background: round >= 0 ? "rgba(245,241,232,0.12)" : brk ? "#141416" : undefined }}
    >
      <span className={cn("font-medium text-muted", small && "t-9.5")}>W{i + 1}</span>
      <span className={cn("text-[#5c5852]", small && "t-7.5 tracking-[-0.02em]")}>{weekStart(i)}</span>
      <span className={cn("flex items-center", small ? "h-3 t-7.5 tracking-[-0.02em]" : "h-3.5")}>
        {round >= 0 ? (
          <span className="r-2 px-1 font-semibold leading-[1.35] text-[#0a0a0b]" style={{ background: DATA_MARK }}>
            R{round + 1}
          </span>
        ) : brk ? (
          <span className="text-accent">break</span>
        ) : null}
      </span>
    </span>
  );
}

function WeekCell({ n, i, first }: { n: number; i: number; first: boolean }) {
  return (
    <span
      className={cn("flex items-center justify-center border-l font-mono", first ? "border-accent/25" : "border-line/40")}
      style={{
        color: gamesTone(n),
        background: PLAYOFF_WEEKS.includes(i) ? "rgba(245,241,232,0.08)" : BREAK_WEEKS.includes(i) ? "rgba(20,20,22,0.7)" : undefined,
      }}
    >
      {n}
    </span>
  );
}

const TILE_WEEKS = [16, 17, 18, 19, 20, 21, 22];
const TILE_GRID = "grid grid-cols-[calc(var(--px)*56)_calc(var(--px)*34)_calc(var(--px)*34)_repeat(7,minmax(0,1fr))]";

/** The season view, cut to the run-in: the best schedules by overall score, break weeks to playoff weeks. */
export function FbiScheduleTile() {
  const rows = SCHEDULE.map(scheduleRow)
    .sort((a, b) => b.o - a.o || a.team.localeCompare(b.team))
    .slice(0, 9);
  return (
    <Surface w={400} brand="fbi" label="FBI Basketball Schedule Analyzer: games per week for nine NBA teams from the All-Star break through the fantasy playoff weeks." className="bg-ground">
      <div className="px-5 pb-5 pt-6">
        <PageHead eyebrow="Front Office" className="t-27">
          SCHEDULE ANALYZER
        </PageHead>
        <Switch options={["By day", "By week"]} on={1} className="mt-4 h-9 t-12 [&>span]:w-21" />

        <div className="mt-4 border border-line">
          <div className={cn(TILE_GRID, "t-10")}>
            <span className="flex items-center pl-3 font-medium text-[#5c5852]">Team</span>
            <span className={cn(CELL, "font-sans font-medium")} style={{ color: DATA_MARK }}>
              PG
            </span>
            <span className={cn(CELL, "font-sans font-medium text-accent")}>O</span>
            {TILE_WEEKS.map((i, k) => (
              <WeekHead key={i} i={i} className={k === 0 ? "border-accent/25" : "border-line/40"} />
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.team} className={cn(TILE_GRID, "h-7 border-t border-line/60 t-12")}>
              <span className="flex items-center pl-3 font-medium text-ink">{r.team}</span>
              <span className={CELL} style={{ color: DATA_MARK }}>
                {r.pg}
              </span>
              <span className={cn(CELL, "font-semibold")} style={{ color: scoreTone(r.o, true) }}>
                {r.o}
              </span>
              {TILE_WEEKS.map((i, k) => (
                <WeekCell key={i} n={r.weeks[i]} i={i} first={k === 0} />
              ))}
            </div>
          ))}
        </div>

        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 t-10.5 text-muted">
          <span>
            <span className="text-[#22c55e]">4+</span> game weeks win matchups
          </span>
          <span>
            <span className="text-[#c8312b]">≤2</span> lose them
          </span>
          <span>
            <span className="text-accent">break</span>: All-Star
          </span>
        </p>
      </div>
    </Surface>
  );
}

const FULL_GRID = "grid grid-cols-[calc(var(--px)*58)_repeat(8,calc(var(--px)*30))_repeat(25,minmax(0,1fr))]";

function Select({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 items-center gap-2 r-2 border border-line bg-ground px-3 t-12 font-medium text-muted">
      {children}
      <Chevron className="h-3 w-3" />
    </span>
  );
}

/** The whole season view: thirty teams, the summary block, and all twenty-five weeks. */
export function FbiSchedule() {
  const rows = SCHEDULE.map(scheduleRow);
  return (
    <Surface w={960} brand="fbi" label="FBI Basketball Schedule Analyzer season view: games per week for all thirty NBA teams across twenty-five weeks, with schedule scores." className="bg-ground">
      <div className="px-8 pb-7 pt-8">
        <PageHead eyebrow="Front Office" className="t-40">
          SCHEDULE ANALYZER
        </PageHead>

        <div className="mt-6 flex items-center gap-3">
          <Switch options={["By day", "By week"]} on={1} className="h-9 t-12 [&>span]:w-24" />
          <span className="ml-3 t-12 font-medium text-[#5c5852]">Playoffs</span>
          <Select>3 rounds</Select>
          <Select>Starts W21 · Mar 8</Select>
          <span className="ml-auto t-12 font-medium text-[#5c5852]">Quality game</span>
          <span className="relative h-1 w-24 r-2 bg-line">
            <span className="absolute inset-y-0 left-0 w-1/2 r-2 bg-accent" />
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </span>
          <span className="t-12 text-muted">
            <span className="font-mono font-semibold text-[#e8c77e]">8</span> games or fewer
          </span>
        </div>

        <div className="mt-4 border border-line">
          <div className={cn(FULL_GRID, "t-10")}>
            <span className="flex items-center pl-3 font-medium text-accent">Team</span>
            {["PG", "4+", "≤2", "QG", "B2B", "R", "O", "P"].map((h) => (
              <span key={h} className={cn(CELL, "font-sans font-medium text-[#5c5852]")}>
                {h}
              </span>
            ))}
            {rows[0].weeks.map((_, i) => (
              <WeekHead key={i} i={i} small className={i === 0 ? "border-accent/25" : "border-line/40"} />
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.team} className={cn(FULL_GRID, "h-6.5 border-t border-line/60 t-11.5")}>
              <span className="flex items-center pl-3 font-medium text-ink">{r.team}</span>
              <span className={CELL} style={{ color: DATA_MARK }}>
                {r.pg}
              </span>
              <span className={CELL} style={{ color: POSITIVE }}>
                {r.heavy}
              </span>
              <span className={CELL} style={{ color: NEGATIVE }}>
                {r.light}
              </span>
              <span className={CELL} style={{ color: GOLD_BRIGHT }}>
                {r.qg}
              </span>
              <span className={cn(CELL, "text-ink")}>{r.b2b}</span>
              <span className={CELL} style={{ color: scoreTone(r.r, false) }}>
                {r.r}
              </span>
              <span className={cn(CELL, "font-semibold")} style={{ color: scoreTone(r.o, true) }}>
                {r.o}
              </span>
              <span className={CELL} style={{ color: scoreTone(r.p, false) }}>
                {r.p}
              </span>
              {r.weeks.map((n, i) => (
                <WeekCell key={i} n={n} i={i} first={i === 0} />
              ))}
            </div>
          ))}
        </div>

        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-3 t-12 text-muted">
          <span>
            <span className="text-[#22c55e]">4+</span> game weeks win matchups; <span className="text-[#c8312b]">≤2</span> lose them
          </span>
          <span>
            <span className="font-semibold text-[#e8c77e]">QG</span>: quality games, on nights with 8 games or fewer
          </span>
          <span>
            <span className="font-semibold" style={{ color: DATA_MARK }}>
              PG
            </span>
            : games in your playoff weeks
          </span>
          <span>
            <span className="text-accent">break</span>: the league stops playing
          </span>
          <span>
            <span className="font-semibold text-ink">R / O / P</span>: regular season, overall and playoff score; 50 is the league average
          </span>
        </p>
      </div>
    </Surface>
  );
}

/* ─── power rankings ──────────────────────────────────────────────────────── */

/*
  A sample twelve-team categories league, three weeks in. Every column is
  consistent across the league: each category's ranks run 1 to 12 once, the
  categories won a week add up to 54 (nine categories, six matchups), and the
  win chances average 50%. The team names are invented.
*/
type PowerTeam = {
  name: string;
  record: string;
  cats: number;
  win: number;
  /** What each position puts into the team's week: PG, SG, SF, PF, C. */
  pos: number[];
  posRanks: number[];
  /** Rank in each of the nine categories, in CATS order. */
  catRanks: number[];
  mine?: boolean;
  moved?: number;
};

const LEAGUE: PowerTeam[] = [
  { name: "Corner Threes", record: "16-9-2", cats: 5.6, win: 76, pos: [0.99, 0.89, 1.42, 1.07, 1.19], posRanks: [3, 5, 1, 2, 2], catRanks: [2, 3, 2, 2, 4, 1, 8, 3, 2] },
  { name: "Roll Models", record: "16-9-2", cats: 5.3, win: 70, pos: [0.96, 1.1, 0.8, 1.36, 1.06], posRanks: [4, 3, 8, 1, 4], catRanks: [1, 1, 3, 7, 1, 11, 2, 10, 6], mine: true, moved: 1 },
  { name: "Full Court Press", record: "15-10-2", cats: 5.3, win: 70, pos: [0.89, 1.2, 1.22, 0.73, 1.24], posRanks: [6, 1, 2, 10, 1], catRanks: [5, 8, 1, 4, 5, 2, 4, 2, 4], moved: -1 },
  { name: "Box Out Bandits", record: "19-8-0", cats: 5.0, win: 63, pos: [1.03, 0.95, 1.07, 0.97, 0.96], posRanks: [2, 4, 5, 4, 5], catRanks: [3, 9, 4, 8, 8, 3, 7, 7, 1] },
  { name: "Sixth Man Society", record: "14-13-0", cats: 4.7, win: 57, pos: [0.75, 1.11, 0.87, 0.87, 1.15], posRanks: [11, 2, 6, 7, 3], catRanks: [7, 10, 11, 3, 6, 5, 1, 4, 3] },
  { name: "Baseline Drifters", record: "10-16-1", cats: 4.6, win: 52, pos: [0.85, 0.84, 1.08, 0.91, 0.89], posRanks: [8, 8, 4, 6, 8], catRanks: [6, 7, 7, 5, 2, 9, 9, 9, 5] },
  { name: "Midrange Revival", record: "14-11-2", cats: 4.5, win: 50, pos: [1.04, 0.86, 1.12, 0.86, 0.63], posRanks: [1, 7, 3, 8, 11], catRanks: [9, 4, 5, 6, 9, 8, 6, 6, 8] },
  { name: "Second Unit", record: "14-13-0", cats: 4.2, win: 42, pos: [0.78, 0.69, 0.8, 1.03, 0.91], posRanks: [10, 10, 7, 3, 7], catRanks: [12, 2, 10, 1, 7, 12, 12, 1, 7] },
  { name: "Dribble Handoff", record: "9-17-1", cats: 3.9, win: 35, pos: [0.9, 0.58, 0.56, 0.95, 0.92], posRanks: [5, 12, 12, 5, 6], catRanks: [11, 5, 9, 9, 11, 7, 5, 5, 10] },
  { name: "Heat Check", record: "12-14-1", cats: 3.7, win: 29, pos: [0.88, 0.83, 0.58, 0.63, 0.78], posRanks: [7, 9, 11, 11, 10], catRanks: [10, 12, 6, 11, 3, 6, 11, 11, 11] },
  { name: "Empty the Bench", record: "11-15-1", cats: 3.6, win: 28, pos: [0.72, 0.63, 0.73, 0.74, 0.8], posRanks: [12, 11, 10, 9, 9], catRanks: [8, 6, 12, 10, 12, 4, 10, 12, 9] },
  { name: "Glass Cleaners", record: "5-20-2", cats: 3.6, win: 27, pos: [0.83, 0.86, 0.77, 0.63, 0.5], posRanks: [9, 6, 9, 12, 12], catRanks: [4, 11, 8, 12, 10, 10, 3, 8, 12] },
];

/* app/styles/league-report.css: position hues and the five heat steps. */
const POSITIONS = [
  { label: "PG", color: "#c9a961" },
  { label: "SG", color: "#5fa8c7" },
  { label: "SF", color: "#4a9d72" },
  { label: "PF", color: "#c0673f" },
  { label: "C", color: "#9a86e0" },
];
const HEAT: Record<number, { bg: string; fg: string; ring?: string }> = {
  5: { bg: "rgba(34,197,94,0.30)", fg: POSITIVE, ring: "inset 0 0 0 1px rgba(34,197,94,0.55)" },
  4: { bg: "rgba(34,197,94,0.18)", fg: BONE },
  3: { bg: "rgba(138,134,128,0.14)", fg: BONE },
  2: { bg: "rgba(200,49,43,0.22)", fg: BONE },
  1: { bg: "rgba(200,49,43,0.48)", fg: BONE },
};
/** components/league-report/league-report.tsx heat: a rank of n as five steps, best is 5. */
function heat(rank: number, n: number) {
  const f = (rank - 1) / (n - 1);
  return f <= 0.15 ? 5 : f <= 0.4 ? 4 : f < 0.6 ? 3 : f < 0.85 ? 2 : 1;
}
const POWER_MAX = Math.max(...LEAGUE.map((t) => sum(t.pos)));

function Move({ n }: { n?: number }) {
  if (!n) return null;
  return (
    <span className="flex items-center gap-0.5 font-mono t-11 font-bold" style={{ color: n > 0 ? POSITIVE : NEGATIVE }}>
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {n > 0 ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
      </svg>
      {Math.abs(n)}
    </span>
  );
}

/** One team's card: rank, record, categories a week, win chance, the position bar and the category ranks. */
function PowerCard({ team, rank, wide }: { team: PowerTeam; rank: number; wide?: boolean }) {
  const n = LEAGUE.length;
  const winHeat = heat(rank, n);
  const stat = "flex items-center justify-center border-l border-line font-display leading-none";
  return (
    <div className={cn("r-2 border bg-card", wide ? "px-4.5 pb-4.5 pt-4" : "px-3.5 pb-3.5 pt-3", team.mine ? "border-[#22c55e]/45" : "border-line")}>
      <div className="flex items-center">
        <span className={cn("flex shrink-0 items-center gap-1.5", wide ? "w-19" : "w-11")}>
          <span className={cn("font-display leading-[0.9]", wide ? "t-42" : "t-30")} style={{ color: team.mine ? POSITIVE : undefined }}>
            {String(rank).padStart(2, "0")}
          </span>
          {wide && <Move n={team.moved} />}
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 pr-2">
          <span className={cn("whitespace-nowrap font-bold leading-[1.2]", wide ? "t-16.5" : "t-13")} style={{ color: team.mine ? POSITIVE : undefined }}>
            {team.name}
          </span>
          {team.mine && <span className="shrink-0 r-2 bg-[#22c55e]/15 px-1.5 py-px t-11 font-semibold text-[#22c55e]">You</span>}
        </span>
        <span className="flex shrink-0 items-stretch">
          <span className={cn(stat, "border-l-0 text-ink", wide ? "w-32 t-24" : "w-16 t-15")}>{team.record}</span>
          <span className={cn(stat, "text-ink", wide ? "w-32 t-24" : "w-12 t-15")}>{team.cats.toFixed(1)}</span>
          <span className={cn(stat, wide ? "w-38 t-36" : "w-15 t-24")} style={{ color: winHeat >= 4 ? POSITIVE : winHeat <= 2 ? NEG_SOFT : BONE }}>
            {team.win}
            <span className="ml-px" style={{ fontSize: "0.55em" }}>
              %
            </span>
          </span>
        </span>
      </div>

      <div className={cn("overflow-hidden r-2 bg-muted/10", wide ? "mt-3.5 h-6.5" : "mt-2.5 h-5")}>
        <div className="flex h-full gap-0.5" style={{ width: `${Math.round((sum(team.pos) / POWER_MAX) * 1000) / 10}%` }}>
          {POSITIONS.map((p, i) => (
            <span
              key={p.label}
              className={cn("flex min-w-0 basis-0 items-center justify-center font-display leading-none text-[#0a0a0b]", wide ? "t-15" : "t-12")}
              style={{ flexGrow: team.pos[i], background: p.color }}
            >
              {team.posRanks[i]}
            </span>
          ))}
        </div>
      </div>

      <div className={cn("grid grid-cols-9 gap-0.75", wide ? "mt-3.5" : "mt-2")}>
        {team.catRanks.map((r, c) => {
          const h = HEAT[heat(r, n)];
          return (
            <span
              key={CATS[c]}
              className={cn("flex r-2 leading-none", wide ? "h-7 items-center justify-between px-2" : "h-8.5 flex-col items-center justify-center gap-1")}
              style={{ background: h.bg, color: h.fg, boxShadow: h.ring }}
            >
              <span className="t-10 font-bold opacity-90">{CATS[c]}</span>
              <span className={cn("font-mono font-bold", wide ? "t-12" : "t-11")}>{r}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function PositionLegend({ className }: { className?: string }) {
  return (
    <span className={cn("flex font-semibold text-muted", className)}>
      {POSITIONS.map((p) => (
        <span key={p.label} className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 r-2" style={{ background: p.color }} />
          {p.label}
        </span>
      ))}
    </span>
  );
}

/** The top of a league's power rankings. */
export function FbiPowerTile() {
  return (
    <Surface w={420} brand="fbi" label="FBI Basketball power rankings: the top three teams of a twelve-team league with record, categories won a week, win chance and rank in each category." className="bg-ground">
      <div className="px-5 pb-5 pt-6">
        <PageHead eyebrow="League Intel" className="t-27">
          POWER RANKINGS
        </PageHead>
        <div className="mt-4 flex items-center justify-between pr-3.5 t-10.5 font-semibold text-muted">
          <PositionLegend className="gap-2.5 t-10.5" />
          <span className="flex">
            <span className="w-16 text-center">Record</span>
            <span className="w-12 text-center">Cats/Wk</span>
            <span className="w-15 text-center">Win %</span>
          </span>
        </div>
        <div className="mt-1.5 flex flex-col gap-2">
          {LEAGUE.slice(0, 3).map((t, i) => (
            <PowerCard key={t.name} team={t} rank={i + 1} />
          ))}
        </div>
      </div>
    </Surface>
  );
}

function SplitCell({ label, children, color }: { label: string; children: ReactNode; color?: string }) {
  return (
    <span className="flex w-28 flex-col gap-1.5 bg-card px-3.5 py-2">
      <span className="t-11 font-semibold text-muted">{label}</span>
      <span className={cn("flex items-baseline gap-1.5 leading-none", color ? "t-14 font-bold" : "font-display t-22 text-ink")} style={{ color }}>
        {children}
      </span>
    </span>
  );
}

const ORDINALS = ["1st", "2nd", "3rd"];

/** Your team's summary, then the league from the top. */
export function FbiPower() {
  const n = LEAGUE.length;
  const mineIndex = LEAGUE.findIndex((t) => t.mine);
  const mine = LEAGUE[mineIndex];
  const byCat = mine.catRanks.map((rank, c) => ({ label: CATS[c], rank })).sort((a, b) => a.rank - b.rank);
  /* 1 + how many are strictly better, as the report ranks output. */
  const outputRank = 1 + LEAGUE.filter((t) => t.cats > mine.cats).length;
  const points = (t: PowerTeam) => {
    const [w, , ties] = t.record.split("-").map(Number);
    return w + ties / 2;
  };
  const standing = 1 + LEAGUE.filter((t) => points(t) > points(mine)).length;
  return (
    <Surface w={920} brand="fbi" label="FBI Basketball power rankings for a twelve-team categories league: your team's summary and each team's record, categories won a week, win chance, strength by position and rank in each category." className="bg-ground">
      <div className="px-9 pb-9 pt-8">
        <PageHead eyebrow="League Intel" className="t-40">
          POWER RANKINGS
        </PageHead>

        <div className="relative mt-6 flex items-center gap-5 overflow-hidden r-2 border border-[#22c55e]/45 bg-card px-5 py-4">
          <span className="absolute inset-x-0 top-0 h-0.5 bg-[#22c55e]" />
          <span className="flex items-baseline gap-1.5">
            <span className="font-display t-64 leading-[0.85] text-[#22c55e]">{mineIndex + 1}</span>
            <span className="t-13 font-semibold text-muted">of {n}</span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block t-12 font-semibold text-[#22c55e]">Your team</span>
            <span className="mt-1 block t-18 font-bold leading-[1.2] text-ink">{mine.name}</span>
            <span className="mt-1.5 flex items-center gap-2 t-13.5 text-muted">
              <span>
                Wins <b className="font-bold text-ink">{mine.win}%</b> of weeks
              </span>
              <Move n={mine.moved} />
            </span>
          </span>
          <span className="flex gap-px overflow-hidden r-2 border border-line bg-line">
            <SplitCell label="Cats/Week">
              {mine.cats.toFixed(1)}
              <small className="font-mono t-11 font-bold text-muted">{ORDINALS[outputRank - 1]}</small>
            </SplitCell>
            <SplitCell label="Standings">
              {ORDINALS[standing - 1]}
              <small className="font-mono t-11 font-bold text-muted">{mine.record}</small>
            </SplitCell>
            <SplitCell label="Best at" color={POSITIVE}>
              {byCat
                .slice(0, 2)
                .map((c) => c.label)
                .join(" · ")}
            </SplitCell>
            <SplitCell label="Weakest at" color={NEG_SOFT}>
              {byCat
                .slice(-2)
                .reverse()
                .map((c) => c.label)
                .join(" · ")}
            </SplitCell>
          </span>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <span className="font-display t-20 tracking-[0.02em] text-ink">ALL {n} TEAMS</span>
          <PositionLegend className="gap-3.5 t-12" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-y border-line py-2.5 t-12 text-muted">
          <span className="mr-1 font-semibold text-ink">Scoring</span>
          {CATS.map((c) => (
            <span key={c} className="r-2 border border-line px-1.5 py-0.5 font-semibold leading-[1.3] text-secondary">
              {c}
            </span>
          ))}
          {["10 starters", "4 bench", "2 IR", "6 make the playoffs", "19 weeks left"].map((s) => (
            <span key={s} className="ml-2">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex justify-end pr-4.5 t-11.5 font-semibold text-muted">
          <span className="w-32 text-center">Record</span>
          <span className="w-32 text-center">Cats/Week</span>
          <span className="w-38 text-center">Win %</span>
        </div>
        <div className="mt-2 flex flex-col gap-2.5">
          {LEAGUE.slice(0, 5).map((t, i) => (
            <PowerCard key={t.name} team={t} rank={i + 1} wide />
          ))}
        </div>
      </div>
    </Surface>
  );
}

/* ─── draft lottery ───────────────────────────────────────────────────────── */

/*
  The six-team lottery the tool opens with: its own sample league and the NBA
  curve's ball counts, three picks drawn. The odds are the tool's exact
  figures for that setup.
*/
const LOTTERY: [string, number, string, string, string][] = [
  ["Tank Commander", 140, "32.6%", "83.4%", "2.2"],
  ["Process Trusters", 131, "30.5%", "81.6%", "2.3"],
  ["Lottery Luck", 87, "20.3%", "68.2%", "2.7"],
  ["Ping Pong Kings", 48, "11.2%", "43.8%", "3.4"],
  ["Fresh Legs", 18, "4.2%", "17.9%", "4.5"],
  ["Two-Way Contracts", 5, "1.2%", "5.1%", "5.8"],
];
const LOTTERY_GRID = "grid grid-cols-[minmax(0,1fr)_calc(var(--px)*50)_calc(var(--px)*52)_calc(var(--px)*56)] items-center gap-x-2";

/** The Draft Lottery's odds preview: every team's chance at each outcome before a ball is drawn. */
export function FbiLottery() {
  const balls = sum(LOTTERY.map((t) => t[1]));
  return (
    <Surface w={400} brand="fbi" label="FBI Basketball Draft Lottery odds preview: six teams with their chance at the first pick, a top three pick and their average pick." className="bg-ground">
      <div className="p-5">
        <div className="r-2 border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
            <span className="font-display t-17 leading-none tracking-[0.02em] text-ink">ODDS PREVIEW</span>
            <span className="t-11 text-[#5c5852]">Exact</span>
          </div>
          <div className="px-4 pt-3.5">
            <div className="grid grid-cols-2 gap-1.5 t-12 font-semibold">
              <span className="flex h-8 items-center justify-center r-2 bg-accent text-accent-ink">Summary</span>
              <span className="flex h-8 items-center justify-center r-2 border border-line bg-ground text-ink">Every pick</span>
            </div>
            <div className={cn(LOTTERY_GRID, "mt-3.5 pb-2 t-11 text-muted")}>
              <span>Team</span>
              <span className="text-right">#1</span>
              <span className="text-right">Top 3</span>
              <span className="text-right">Avg pick</span>
            </div>
            {LOTTERY.map(([team, , first, top3, avg], i) => (
              <div key={team} className={cn(LOTTERY_GRID, "border-t border-line/60 py-2.25 font-mono t-12")}>
                <span className="flex min-w-0 items-center gap-1.5 font-sans">
                  <span className="font-mono t-11 text-[#5c5852]">{i + 1}</span>
                  <span className="whitespace-nowrap font-medium text-ink">{team}</span>
                </span>
                <span className="text-right font-semibold text-accent">{first}</span>
                <span className="text-right text-ink">{top3}</span>
                <span className="text-right text-ink">{avg}</span>
              </div>
            ))}
            <p className="border-t border-line/60 py-2.5 text-right font-mono t-11 text-accent">{balls} balls in the draw</p>
          </div>
        </div>

        <div className="mt-3 r-2 border border-accent/30 bg-card p-3">
          <span className="flex h-10 items-center justify-center gap-2 r-2 bg-accent t-13 font-semibold text-accent-ink">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="m6 3 14 9-14 9V3z" />
            </svg>
            Run the lottery
          </span>
          <p className="mt-2.5 text-balance t-11 leading-[1.4] text-muted">You reveal the picks one at a time, then share a link the league can check.</p>
        </div>
      </div>
    </Surface>
  );
}

/* ─── the crest ───────────────────────────────────────────────────────────── */

/** The crest on obsidian, with the wordmark set the way the site sets it. */
export function FbiMark() {
  return (
    <Surface w={400} brand="fbi" label="The Fantasy Basketball International crest in gold." className="bg-ground">
      <div className="flex flex-col items-center px-8 py-12">
        <Image src="/brand/fbi/emblem-gold.png" alt="" width={540} height={540} className="h-40 w-40" />
        <p className="mt-7 text-center font-display t-30 leading-[0.95] tracking-[0.02em] text-ink">
          FANTASY BASKETBALL
          <br />
          <span className="text-accent">INTERNATIONAL</span>
        </p>
        <p className="mt-3 font-display t-11 tracking-[0.08em] text-muted">FBI-BASKETBALL.COM</p>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "fbi-rankings",
    title: "Rankings board",
    caption:
      "Every player ranked for nine-category leagues, with each category shaded by tier against the player pool. The order comes from the rest-of-season projection engine.",
    tile: FbiRankingsTile,
    full: FbiRankings,
  },
  {
    id: "fbi-trade",
    title: "Trade calculator",
    caption:
      "Put players on each side and the calculator plays both rosters out before and after the deal. The verdict is the change in the chance to win a week, with each category's chance before and after.",
    tile: FbiTradeTile,
    full: FbiTrade,
  },
  {
    id: "fbi-player",
    title: "Player page",
    caption: "One player's page: his rank on each board and his projected line, each stat shaded on the same seven tiers as the rankings board.",
    tile: FbiPlayer,
  },
  {
    id: "fbi-engine",
    title: "Engine run",
    caption:
      "The projection engine's run log, from the admin page. Twice a day it ingests box scores, injuries and depth charts, projects every player, applies a bounded news layer and writes the board.",
    tile: FbiEngine,
  },
  {
    id: "fbi-schedule",
    title: "Schedule Analyzer",
    caption:
      "Every NBA team's games in each fantasy week, with heavy and light weeks marked. Each schedule gets a score out of 100, and the playoff weeks are scored on their own.",
    tile: FbiScheduleTile,
    full: FbiSchedule,
  },
  {
    id: "fbi-cards",
    title: "Season Ticket",
    caption: "The four Season Ticket cards. A card is a one-time purchase that runs to the end of the season.",
    tile: FbiCards,
  },
  {
    id: "fbi-power",
    title: "Power rankings",
    caption:
      "Every team in a member's own league, ranked by how often its roster wins a week on that league's scoring. Each card shows where the team's production comes from by position and its rank in every category.",
    tile: FbiPowerTile,
    full: FbiPower,
  },
  {
    id: "fbi-lottery",
    title: "Draft Lottery",
    caption: "A weighted lottery for a league's rookie draft. The odds for every team are worked out exactly from the ball counts before a pick is drawn.",
    tile: FbiLottery,
  },
  {
    id: "fbi-mark",
    title: "The crest",
    caption: "The Fantasy Basketball International crest in gold on obsidian.",
    tile: FbiMark,
  },
];
