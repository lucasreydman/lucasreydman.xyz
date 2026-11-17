"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { FigureId } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The charts in the project write-ups.
 *
 * Every one is computed in the browser from the formula and constants the
 * project's own code runs, cited beside each figure below. None of them plots a
 * made-up dataset: where a chart needs an example (a .350 hitter in 20 at bats,
 * a six-team lottery) the example is labelled as one in its caption, and the
 * numbers on screen are what the model would output for it.
 *
 * Colours come from the tokens (`--accent`, `--ink`, `--muted`), so a chart
 * drawn on a project's page takes that project's brand. A chart with a single
 * series draws it in the accent; with several, the one the caption is about takes the accent
 * and the others step down in ink, and every series is named by a legend and,
 * where there is room, labelled at its end. Identity never rests on colour.
 *
 * Sized in pixels, not by scaling a viewBox. A viewBox scaled down to a phone
 * shrinks the axis labels with it, to about six pixels at 340 wide. Measuring
 * the column and drawing to it keeps type at its real size on every screen.
 */

const ACCENT = "var(--accent)";
const INK = "var(--ink)";
const INK_2 = "color-mix(in srgb, var(--ink) 62%, transparent)";
const INK_3 = "color-mix(in srgb, var(--ink) 34%, transparent)";
const GRID = "color-mix(in srgb, var(--ink) 8%, transparent)";
const AXIS = "var(--muted)";

const pct0 = (v: number) => `${Math.round(v * 100)}%`;
const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;
const range = (a: number, b: number, step = 1) => {
  const out: number[] = [];
  for (let v = a; v <= b + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
};

/* ─── measuring ─────────────────────────────────────────────────────────── */

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/* ─── shared pieces ─────────────────────────────────────────────────────── */

function Legend({ items }: { items: { name: string; color: string; dash?: boolean }[] }) {
  return (
    <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 font-sans text-[12px] text-secondary">
      {items.map((it) => (
        <span key={it.name} className="inline-flex items-center gap-2">
          <svg width="18" height="8" aria-hidden="true">
            <line
              x1="1"
              x2="17"
              y1="4"
              y2="4"
              stroke={it.color}
              strokeWidth="2"
              strokeDasharray={it.dash ? "4 3" : undefined}
              strokeLinecap="round"
            />
          </svg>
          {it.name}
        </span>
      ))}
    </div>
  );
}

function Tip({ left, top, children }: { left: number; top: number; children: ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute z-10 min-w-[8.5rem] rounded-lg bg-card px-3 py-2 font-sans text-[12px] leading-[1.5] text-ink shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-line"
      style={{ left, top, transform: "translate(-50%, -100%)" }}
    >
      {children}
    </div>
  );
}

/* ─── line chart ────────────────────────────────────────────────────────── */

type Series = {
  name: string;
  color: string;
  dash?: boolean;
  points: [number, number][];
};

type Axis = {
  min: number;
  max: number;
  ticks: number[];
  fmt: (v: number) => string;
  label: string;
};

function LineChart({
  series,
  x,
  y,
  height = 250,
  hoverX,
  hoverY,
  refs = [],
}: {
  series: Series[];
  x: Axis;
  y: Axis;
  height?: number;
  hoverX: (v: number) => string;
  hoverY: (v: number) => string;
  refs?: { x?: number; y?: number; label: string }[];
}) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState<number | null>(null);

  const labelled = width >= 520 && series.length > 1;
  const longest = Math.max(...series.map((s) => s.name.length));
  const m = { l: 58, r: labelled ? Math.min(170, longest * 6.4 + 16) : 14, t: 10, b: 40 };
  const iw = Math.max(0, width - m.l - m.r);
  const ih = height - m.t - m.b;
  const sx = (v: number) => m.l + ((v - x.min) / (x.max - x.min)) * iw;
  const sy = (v: number) => m.t + ih - ((v - y.min) / (y.max - y.min)) * ih;

  /* End labels, nudged apart so two lines that finish close together do not
     print on top of each other. */
  const ends = useMemo(() => {
    const raw = series.map((s) => ({ s, y: sy(s.points[s.points.length - 1][1]) }));
    raw.sort((a, b) => a.y - b.y);
    for (let i = 1; i < raw.length; i++) {
      if (raw[i].y - raw[i - 1].y < 15) raw[i].y = raw[i - 1].y + 15;
    }
    return raw;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, width, height]);

  const xs = series[0].points.map((p) => p[0]);
  const hx = hover === null ? null : xs[hover];

  return (
    <div>
      {series.length > 1 && <Legend items={series} />}
      <div ref={ref} className="relative" style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} className="block overflow-visible font-sans">
            {y.ticks.map((t) => (
              <g key={`y${t}`}>
                <line x1={m.l} x2={m.l + iw} y1={sy(t)} y2={sy(t)} stroke={GRID} />
                <text x={m.l - 8} y={sy(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={AXIS}>
                  {y.fmt(t)}
                </text>
              </g>
            ))}
            {x.ticks.map((t) => (
              <text key={`x${t}`} x={sx(t)} y={m.t + ih + 18} textAnchor="middle" fontSize="11" fill={AXIS}>
                {x.fmt(t)}
              </text>
            ))}
            <text x={m.l + iw / 2} y={height - 4} textAnchor="middle" fontSize="11" fill={AXIS}>
              {x.label}
            </text>
            <text
              transform={`translate(11 ${m.t + ih / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize="11"
              fill={AXIS}
            >
              {y.label}
            </text>

            {refs.map((r) =>
              r.y !== undefined ? (
                <g key={r.label}>
                  <line x1={m.l} x2={m.l + iw} y1={sy(r.y)} y2={sy(r.y)} stroke={INK_3} strokeDasharray="3 4" />
                  <text x={m.l + 6} y={sy(r.y) - 6} fontSize="11" fill={AXIS}>
                    {r.label}
                  </text>
                </g>
              ) : (
                <g key={r.label}>
                  <line x1={sx(r.x!)} x2={sx(r.x!)} y1={m.t} y2={m.t + ih} stroke={INK_3} strokeDasharray="3 4" />
                  <text x={sx(r.x!) + 6} y={m.t + 12} fontSize="11" fill={AXIS}>
                    {r.label}
                  </text>
                </g>
              )
            )}

            {series.map((s) => (
              <path
                key={s.name}
                d={s.points.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join("")}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeDasharray={s.dash ? "5 4" : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {labelled &&
              ends.map(({ s, y: ly }) => (
                <text key={s.name} x={m.l + iw + 8} y={ly} dy="0.32em" fontSize="11.5" fill={INK_2}>
                  {s.name}
                </text>
              ))}

            {hx !== null && (
              <g>
                <line x1={sx(hx)} x2={sx(hx)} y1={m.t} y2={m.t + ih} stroke="color-mix(in srgb, var(--ink) 30%, transparent)" />
                {series.map((s) => (
                  <circle
                    key={s.name}
                    cx={sx(hx)}
                    cy={sy(s.points[hover!][1])}
                    r="4"
                    fill={s.color}
                    stroke="var(--ground)"
                    strokeWidth="2"
                  />
                ))}
              </g>
            )}

            <rect
              x={m.l}
              y={m.t}
              width={iw}
              height={ih}
              fill="transparent"
              onPointerMove={(e) => {
                const box = (e.currentTarget as SVGRectElement).getBoundingClientRect();
                const v = x.min + ((e.clientX - box.left) / box.width) * (x.max - x.min);
                let best = 0;
                for (let i = 1; i < xs.length; i++) if (Math.abs(xs[i] - v) < Math.abs(xs[best] - v)) best = i;
                setHover(best);
              }}
              onPointerLeave={() => setHover(null)}
            />
          </svg>
        )}
        {hx !== null && width > 0 && (
          <Tip
            left={Math.min(Math.max(sx(hx), 80), width - 80)}
            top={Math.min(...series.map((s) => sy(s.points[hover!][1]))) - 12}
          >
            <div className="text-muted">{hoverX(hx)}</div>
            {series.map((s) => (
              <div key={s.name} className="flex justify-between gap-4">
                <span>{s.name}</span>
                <span className="tabular-nums text-ink">{hoverY(s.points[hover!][1])}</span>
              </div>
            ))}
          </Tip>
        )}
      </div>
    </div>
  );
}

/* ─── horizontal bars ───────────────────────────────────────────────────── */

type Bar = { label: string; value: number; display?: string; hot?: boolean };

/**
 * Bars on a shared scale, value printed at the end of each. `min` below zero
 * gives a diverging scale with the zero line drawn in, for correlations.
 */
function Bars({ rows, min = 0, max, fmt }: { rows: Bar[]; min?: number; max: number; fmt: (v: number) => string }) {
  const at = (v: number) => ((v - min) / (max - min)) * 100;
  const zero = at(0);
  return (
    <div role="list" className="space-y-2.5">
      {rows.map((r) => {
        const a = Math.min(at(r.value), zero);
        const w = Math.abs(at(r.value) - zero);
        return (
          <div
            role="listitem"
            key={r.label}
            className="group grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_3.6rem] items-center gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_4rem]"
          >
            <span className="truncate font-sans text-[12.5px] text-secondary group-hover:text-ink">{r.label}</span>
            <span className="relative h-[14px]">
              {min < 0 && <span className="absolute inset-y-[-4px] w-px bg-line" style={{ left: `${zero}%` }} />}
              <span
                className="absolute inset-y-0 rounded-[4px] transition-opacity group-hover:opacity-100"
                style={{
                  left: `${a}%`,
                  width: `${Math.max(w, r.value === 0 ? 0 : 0.6)}%`,
                  background: r.hot ? ACCENT : "color-mix(in srgb, var(--ink) 34%, transparent)",
                  opacity: 0.92,
                }}
              />
            </span>
            <span className="text-right font-sans text-[12.5px] tabular-nums text-ink">
              {r.display ?? fmt(r.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── columns ───────────────────────────────────────────────────────────── */

function Columns({ cols, max, fmt }: { cols: Bar[]; max: number; fmt: (v: number) => string }) {
  return (
    <div className="grid h-[200px] items-end gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0,1fr))` }}>
      {cols.map((c) => (
        <div key={c.label} className="flex h-full flex-col justify-end">
          <span className="mb-1.5 text-center font-sans text-[12.5px] tabular-nums text-ink">{c.display ?? fmt(c.value)}</span>
          <span
            className="rounded-t-[2px]"
            style={{ height: `${(c.value / max) * 150}px`, background: c.hot ? ACCENT : "color-mix(in srgb, var(--ink) 34%, transparent)" }}
          />
          <span className="mt-2 text-center font-sans text-[11.5px] leading-tight text-muted">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── the figures ───────────────────────────────────────────────────────── */

/* FBI: lib/data/baseline-compute.ts:16-43. Games of league average in each prior. */
function FbiPriorK() {
  const k: [string, number][] = [
    ["Points", 20],
    ["Threes made", 20],
    ["Assists", 40],
    ["Rebounds", 80],
    ["Blocks", 80],
    ["Turnovers", 80],
    ["Field goal attempts", 80],
    ["Free throw attempts", 120],
    ["Steals", 160],
  ];
  return (
    <Bars
      rows={k.map(([label, value]) => ({ label, value, hot: label === "Steals" || label === "Points" }))}
      max={160}
      fmt={(v) => `${v} gm`}
    />
  );
}

/* FBI: lib/ros/rates.ts:108, config.ts:44-96. Prior share k/(n+k), start of season. */
function FbiShrink() {
  const ns = range(0, 3000, 50);
  const mk = (name: string, k: number, color: string, dash?: boolean): Series => ({
    name,
    color,
    dash,
    points: ns.map((n) => [n, k / (n + k)]),
  });
  return (
    <LineChart
      series={[
        mk("Counting stats, k 350", 350, ACCENT),
        mk("Steals, k 1,000", 1000, INK_2),
        mk("Threes, k 3,000", 3000, INK_3, true),
      ]}
      x={{ min: 0, max: 3000, ticks: [0, 1000, 2000, 3000], fmt: (v) => v.toLocaleString(), label: "Minutes played" }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], fmt: pct0, label: "From prior" }}
      hoverX={(v) => `${v.toLocaleString()} minutes`}
      hoverY={pct0}
    />
  );
}

/* FBI: config.ts:581-628. α = 1 / (1 + exp((rank − 20) / 3.5)). */
function FbiForgiveness() {
  const pts = range(1, 40).map((r) => [r, 1 / (1 + Math.exp((r - 20) / 3.5))] as [number, number]);
  return (
    <LineChart
      series={[{ name: "α", color: ACCENT, points: pts }]}
      x={{ min: 1, max: 40, ticks: [1, 10, 20, 30, 40], fmt: String, label: "Rank without his worst category" }}
      y={{ min: 0, max: 1, ticks: [0, 0.5, 1], fmt: pct0, label: "Forgiven" }}
      refs={[{ x: 20, label: "half at rank 20" }]}
      hoverX={(v) => `Rank ${v}`}
      hoverY={pct0}
    />
  );
}

/* SHARPRFI: lib/poisson.ts:27-59. Weight n/(n + k·m), FIP k = 45 IP, m 1.75 in March. */
function SharpShrink() {
  const ns = range(0, 150, 2);
  return (
    <LineChart
      series={[
        { name: "From July 1", color: ACCENT, points: ns.map((n) => [n, n / (n + 45)]) },
        { name: "Mid March", color: INK_2, dash: true, points: ns.map((n) => [n, n / (n + 45 * 1.75)]) },
      ]}
      x={{ min: 0, max: 150, ticks: [0, 30, 60, 90, 120, 150], fmt: String, label: "Innings pitched" }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], fmt: pct0, label: "Own FIP" }}
      hoverX={(v) => `${v} innings`}
      hoverY={pct0}
    />
  );
}

/* SHARPRFI: the Poisson engine, lib/poisson.ts:61-149. */
const PARKS = [
  { name: "Petco", pf: 0.88 },
  { name: "Neutral", pf: 1.0 },
  { name: "Coors", pf: 1.28 },
];
const TEMPS = [
  { name: "<55°F", f: 0.92 },
  { name: "55–80", f: 1.0 },
  { name: ">80°F", f: 1.06 },
];
const WINDS = [
  { name: "In", f: 0.93 },
  { name: "Calm", f: 1.0 },
  { name: "Out", f: 1.08 },
];

function halfLambda(fip: number, kPct: number, obp: number, pf: number, weather: number) {
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const f = Math.pow(fip / 3.8, 0.55);
  const k = clamp(1 + (0.3 * (0.23 - kPct)) / 0.23, 0.85, 1.15);
  const o = Math.pow(obp / 0.31, 0.7);
  const park = Math.sqrt(pf);
  const w = Math.sqrt(weather);
  return 0.3371 * clamp(f * k * o * park * w, 0.55, 1.55);
}

function fairOdds(p: number) {
  return p >= 0.5 ? `−${Math.floor((100 * p) / (1 - p) + 1e-9)}` : `+${Math.ceil((100 * (1 - p)) / p - 1e-9)}`;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between font-sans text-[12.5px] text-secondary">
        {label}
        <span className="tabular-nums text-ink">{fmt(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-6 w-full cursor-pointer accent-[var(--accent)]"
      />
    </label>
  );
}

function Choice<T extends { name: string }>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <fieldset>
      <legend className="font-sans text-[12.5px] text-secondary">{label}</legend>
      <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-raised p-1 ring-1 ring-line">
        {options.map((o, i) => (
          <button
            key={o.name}
            type="button"
            aria-pressed={i === value}
            onClick={() => onChange(i)}
            className={cn(
              "rounded-[4px] px-1.5 py-2 font-sans text-[12px] leading-tight transition-colors",
              i === value ? "bg-card text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "text-muted hover:text-ink"
            )}
          >
            {o.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type Half = { fip: number; k: number; obp: number };
const AVERAGE: Half = { fip: 3.8, k: 0.23, obp: 0.31 };

function NrfiCalculator() {
  /* Each half is one matchup: the top of the first is the away lineup against
     the home pitcher, the bottom is the reverse. */
  const [top, setTop] = useState<Half>(AVERAGE);
  const [bot, setBot] = useState<Half>(AVERAGE);
  const [park, setPark] = useState(1);
  const [temp, setTemp] = useState(1);
  const [wind, setWind] = useState(1);

  const weather = TEMPS[temp].f * WINDS[wind].f;
  const lTop = halfLambda(top.fip, top.k, top.obp, PARKS[park].pf, weather);
  const lBot = halfLambda(bot.fip, bot.k, bot.obp, PARKS[park].pf, weather);
  const nrfi = Math.exp(-lTop) * Math.exp(-lBot);
  const yrfi = 1 - nrfi;

  const half = (title: string, s: Half, set: (v: Half) => void, lambda: number) => (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h5 className="font-sans text-[13px] font-medium text-ink">{title}</h5>
        <span className="font-sans text-[12px] tabular-nums text-muted">
          λ {lambda.toFixed(3)} · scoreless {pct1(Math.exp(-lambda))}
        </span>
      </div>
      <Slider label="Pitcher FIP" value={s.fip} min={2} max={6} step={0.05} fmt={(v) => v.toFixed(2)} onChange={(v) => set({ ...s, fip: v })} />
      <Slider label="Pitcher strikeout rate" value={s.k} min={0.14} max={0.34} step={0.005} fmt={pct1} onChange={(v) => set({ ...s, k: v })} />
      <Slider label="Lineup on-base rate" value={s.obp} min={0.27} max={0.36} step={0.001} fmt={(v) => v.toFixed(3).replace(/^0/, "")} onChange={(v) => set({ ...s, obp: v })} />
    </div>
  );

  return (
    <div className="rounded-lg bg-raised p-5 ring-1 ring-line sm:p-6">
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {half("Top of the 1st", top, setTop, lTop)}
        {half("Bottom of the 1st", bot, setBot, lBot)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Choice label="Park factor" options={PARKS} value={park} onChange={setPark} />
        <Choice label="Temperature" options={TEMPS} value={temp} onChange={setTemp} />
        <Choice label="Wind" options={WINDS} value={wind} onChange={setWind} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line" aria-live="polite">
        {[
          { name: "NRFI", p: nrfi },
          { name: "YRFI", p: yrfi },
        ].map((o) => (
          <div key={o.name} className="bg-card px-4 py-4">
            <div className="font-sans text-[12px] text-muted">{o.name}</div>
            <div className="mt-1 font-mono text-[28px] tabular-nums leading-none text-ink">
              {pct1(o.p)}
            </div>
            <div className="mt-2 font-sans text-[12px] tabular-nums text-muted">
              Break-even <span className="text-ink">{fairOdds(o.p)}</span>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setTop(AVERAGE);
          setBot(AVERAGE);
          setPark(1);
          setTemp(1);
          setWind(1);
        }}
        className="mt-4 py-1 font-sans text-[12.5px] text-muted underline decoration-line underline-offset-4 hover:text-ink"
      >
        Reset to league average
      </button>
    </div>
  );
}

/* SHARPRFI: README.md:55-63, lib/model-config.ts:162-167. The reference row is a
   constant 50% guess, which scores 0.25 on any sample. It used to be "Always 49%"
   at 0.2499, which assumed the backtest sample's run rate; the repo does not
   record that rate. A dot plot, because the differences are thousandths and
   bars from zero would draw six identical bars. */
function SharpBrier() {
  const rows = [
    { label: "Blend", v: 0.2447, hot: true },
    { label: "Simulation", v: 0.2463 },
    { label: "Poisson", v: 0.2476 },
    { label: "Always 50%", v: 0.25, ref: true },
    { label: "Sim with streaks", v: 0.2538 },
    { label: "Original script", v: 0.2577 },
  ];
  const lo = 0.24;
  const hi = 0.26;
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_3.6rem] gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_4rem]">
        <span />
        <span className="relative h-4 font-sans text-[11px] tabular-nums text-muted">
          {[0.24, 0.245, 0.25, 0.255, 0.26].map((t) => (
            <span key={t} className="absolute top-0 -translate-x-1/2" style={{ left: `${at(t)}%` }}>
              {t.toFixed(3).replace(/^0/, "")}
            </span>
          ))}
        </span>
        <span />
      </div>
      <div className="mt-2 space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_3.6rem] items-center gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_4rem]"
          >
            <span className={cn("font-sans text-[12.5px]", r.ref ? "text-muted italic" : "text-secondary")}>{r.label}</span>
            <span className="relative h-[14px]">
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
              <span
                className="absolute top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${at(r.v)}%`,
                  background: r.hot ? ACCENT : r.ref ? "transparent" : "color-mix(in srgb, var(--ink) 60%, transparent)",
                  border: r.ref ? "2px solid color-mix(in srgb, var(--ink) 60%, transparent)" : "2px solid var(--ground)",
                }}
              />
            </span>
            <span className="text-right font-sans text-[12.5px] tabular-nums text-ink">
              {r.v.toFixed(4).replace(/^0/, "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* BvP: lib/utils.ts:3, 246-251. score = AVG × min(AB/30, 1), from the 15 AB floor. */
function BvpScore() {
  const abs = range(15, 60, 1);
  const mk = (avg: number, color: string, dash?: boolean): Series => ({
    name: `${avg.toFixed(3).replace(/^0/, "")} hitter`,
    color,
    dash,
    points: abs.map((ab) => [ab, avg * Math.min(ab / 30, 1)]),
  });
  return (
    <LineChart
      series={[mk(0.4, ACCENT), mk(0.35, INK_2), mk(0.3, INK_3, true)]}
      x={{ min: 15, max: 60, ticks: [15, 30, 45, 60], fmt: String, label: "Career at bats against the pitcher" }}
      y={{ min: 0.1, max: 0.4, ticks: [0.1, 0.2, 0.3, 0.4], fmt: (v) => v.toFixed(2).replace(/^0/, ""), label: "Score" }}
      refs={[{ x: 30, label: "full credit" }]}
      hoverX={(v) => `${v} at bats`}
      hoverY={(v) => v.toFixed(3).replace(/^0/, "")}
    />
  );
}

/* BvP: app/api/matchups/route.ts:214-244. A .350 hitter in 20 AB, by spot. */
function BvpSpot() {
  const reg = (20 * 0.35 + 50 * 0.32) / 70;
  const spots: [string, number][] = [
    ["Spots 1 to 3", 4.45],
    ["Spot 4", 4.25],
    ["Spots 5 and 6", 4.05],
    ["Spots 7 to 9", 3.85],
  ];
  return (
    <div>
      <p className="mb-4 font-sans text-[12.5px] text-muted">
        Regressed average <span className="tabular-nums text-ink">{reg.toFixed(3).replace(/^0/, "")}</span>
      </p>
      <Bars
        rows={spots.map(([label, e], i) => ({
          label: `${label}, ${e} AB`,
          value: 1 - Math.pow(1 - reg, e),
          hot: i === 0,
        }))}
        max={1}
        fmt={pct1}
      />
    </div>
  );
}

/* TPDL: src/lib/proj.ts:9-14. w = n / (n + 10). */
function TpdlWeight() {
  const pts = range(0, 82).map((n) => [n, n / (n + 10)] as [number, number]);
  return (
    <LineChart
      series={[{ name: "This season", color: ACCENT, points: pts }]}
      x={{ min: 0, max: 82, ticks: [0, 10, 20, 40, 60, 82], fmt: String, label: "Games played" }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], fmt: pct0, label: "From form" }}
      refs={[{ y: 0.5, label: "even at 10 games" }]}
      hoverX={(v) => `${v} games`}
      hoverY={pct0}
    />
  );
}

/* TPDL: src/lib/winprob.ts. Student-t with 5 df, in closed form, against the normal. */
function normalCdf(z: number) {
  /* Abramowitz and Stegun 7.1.26, the same approximation FBI's trade judge uses. */
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-(z * z) / 2);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}
function t5Cdf(z: number) {
  const th = Math.atan(z / Math.sqrt(5));
  const c = Math.cos(th);
  return 0.5 + (th + Math.sin(th) * c * (1 + (2 / 3) * c * c)) / Math.PI;
}
function TpdlT() {
  const zs = range(0, 3, 0.05);
  return (
    <LineChart
      series={[
        { name: "Student-t, 5 df", color: ACCENT, points: zs.map((z) => [z, t5Cdf(z)]) },
        { name: "Normal", color: INK_2, dash: true, points: zs.map((z) => [z, normalCdf(z)]) },
      ]}
      x={{ min: 0, max: 3, ticks: [0, 1, 2, 3], fmt: (v) => `${v}σ`, label: "Lead, in standard deviations of what is left" }}
      y={{ min: 0.5, max: 1, ticks: [0.5, 0.75, 1], fmt: pct0, label: "Win chance" }}
      hoverX={(v) => `${v.toFixed(2)}σ ahead`}
      hoverY={pct1}
    />
  );
}

/* TPDL: src/lib/draft.ts:267-280, pickChances, ported line for line. */
function pickChances(weights: number[], draws: number) {
  const n = weights.length;
  const probs = Array.from({ length: n }, () => Array(n).fill(0) as number[]);
  const walk = (left: number[], pick: number, p: number) => {
    if (pick >= Math.min(draws, n)) {
      left.forEach((t, i) => (probs[t][pick + i] += p));
      return;
    }
    const total = left.reduce((a, t) => a + weights[t], 0);
    for (const t of left) {
      const w = weights[t] / total;
      if (w > 0) {
        probs[t][pick] += p * w;
        walk(left.filter((x) => x !== t), pick + 1, p * w);
      }
    }
  };
  walk(weights.map((_, i) => i), 0, 1);
  return probs;
}
function TpdlLottery() {
  const probs = useMemo(() => pickChances([24, 24, 24, 18, 6, 4], 4), []);
  const teams = ["Worst", "2nd", "3rd", "4th", "5th", "6th"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[340px] border-separate border-spacing-[3px] font-sans text-[12px] tabular-nums">
        <thead>
          <tr>
            <th className="w-[4.5rem] text-left font-normal text-muted">Record</th>
            {teams.map((_, i) => (
              <th key={i} scope="col" className="pb-1 text-center font-normal text-muted">
                Pick {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {probs.map((row, t) => (
            <tr key={t}>
              <th scope="row" className="text-left font-normal text-secondary">
                {teams[t]}
              </th>
              {row.map((p, k) => (
                <td
                  key={k}
                  className="h-10 rounded-[4px] text-center"
                  style={{
                    background: p > 0 ? `color-mix(in srgb, var(--accent) ${Math.round((0.08 + p * 0.9) * 100)}%, transparent)` : "rgba(255,255,255,0.03)",
                    color: p >= 0.45 ? "var(--accent-ink)" : "var(--ink)",
                  }}
                  title={`${teams[t]} record: ${pct1(p)} at pick ${k + 1}`}
                >
                  {p === 0 ? "" : p < 0.005 ? "<1" : Math.round(p * 100)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-sans text-[11.5px] text-muted">Percent. Blank means it cannot happen.</p>
    </div>
  );
}

/* Fandex: src/lib/engine.ts, leagueSd. RMS distance of franchise win rates from .500 over the seasons from 2005, from its data file of 2026-11-17 at 646fd67, folded clubs included. The write-up compares the NFL and MLB, so those two take the accent. */
function FdxSpread() {
  const leagues: [string, number][] = [
    ["PWHL", 0.1048],
    ["WNBA", 0.1012],
    ["NFL", 0.0812],
    ["CFL", 0.08],
    ["NWSL", 0.079],
    ["NBA", 0.0598],
    ["MLS", 0.0422],
    ["NHL", 0.0348],
    ["MLB", 0.0326],
  ];
  return (
    <Bars
      rows={leagues.map(([label, value]) => ({ label, value, hot: label === "NFL" || label === "MLB" }))}
      max={0.12}
      fmt={(v) => v.toFixed(3).replace(/^0/, "")}
    />
  );
}

/* Fandex: src/lib/engine.ts:10-13, 97. score = blend × n / (n + 4). */
function FdxPrior() {
  const pts = range(1, 60).map((n) => [n, n / (n + 4)] as [number, number]);
  return (
    <LineChart
      series={[{ name: "Score kept", color: ACCENT, points: pts }]}
      x={{ min: 1, max: 60, ticks: [1, 10, 20, 30, 40, 50, 60], fmt: String, label: "Seasons played in the span" }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], fmt: pct0, label: "Score kept" }}
      hoverX={(v) => `${v} ${v === 1 ? "season" : "seasons"}`}
      hoverY={pct0}
    />
  );
}

/* Fandex: src/lib/engine.ts:53, with the two half-lives the Scoring panel offers (components/Tune.tsx). */
function FdxRecency() {
  const ago = range(0, 40);
  const mk = (name: string, halfLife: number, color: string): Series => ({
    name,
    color,
    points: ago.map((a) => [a, Math.pow(0.5, a / halfLife)]),
  });
  return (
    <LineChart
      series={[mk("Lean recent, 15", 15, ACCENT), mk("Only lately, 6", 6, INK_2)]}
      x={{ min: 0, max: 40, ticks: [0, 10, 20, 30, 40], fmt: String, label: "Seasons ago" }}
      y={{ min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], fmt: pct0, label: "Weight on the season" }}
      hoverX={(v) => (v === 0 ? "The latest season" : `${v} ${v === 1 ? "season" : "seasons"} ago`)}
      hoverY={pct0}
    />
  );
}

/* PhantomGM: lib/daily/model.ts:242-262. */
function PgmPlay() {
  const rows: [string, number][] = [
    ["Healthy", 0.985],
    ["Probable", 0.97],
    ["Questionable, 28+ min", 0.64],
    ["Questionable", 0.58],
    ["Doubtful", 0.02],
    ["Out or suspended", 0],
  ];
  return <Bars rows={rows.map(([label, value]) => ({ label, value, hot: label.startsWith("Questionable") }))} max={1} fmt={pct1} />;
}

/* PhantomGM: lib/phantomgm/cap-plan.ts:52-145. The network, drawn small: two
   players, two nights, one capped slot. A schematic, so the labels are roles,
   not players. */
function PgmFlow() {
  const [ref, width] = useWidth();
  const h = 250;
  const cols = [
    { title: "Source", nodes: ["s"] },
    { title: "Player-days", nodes: ["A · Mon", "A · Tue", "B · Mon", "B · Tue"] },
    { title: "Slot-days", nodes: ["G · Mon", "G · Tue"] },
    { title: "Slot", nodes: ["G"] },
    { title: "Sink", nodes: ["t"] },
  ];
  const edgesNote = ["cap 1, cost −value", "cap open G slots", "cap games left", "cap ∞"];
  const top = 40;
  const bottom = h - 36;
  const pos = (c: number, i: number, n: number) => ({
    x: 30 + (c * (width - 60)) / (cols.length - 1),
    y: top + ((i + 1) * (bottom - top)) / (n + 1),
  });
  const node = (c: number, i: number) => pos(c, i, cols[c].nodes.length);
  const links: [number, number, number, number][] = [
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 1, 3],
    [1, 0, 2, 0],
    [1, 2, 2, 0],
    [1, 1, 2, 1],
    [1, 3, 2, 1],
    [2, 0, 3, 0],
    [2, 1, 3, 0],
    [3, 0, 4, 0],
  ];
  const narrow = width < 520;
  return (
    <div ref={ref} className="relative" style={{ height: h }}>
      {width > 0 && (
        <svg width={width} height={h} className="block font-sans" role="img" aria-label="Flow network from source through player-days, slot-days and slots to sink">
          {cols.map((c, ci) => (
            <text key={c.title} x={node(ci, 0).x} y={14} textAnchor="middle" fontSize="11" fill={AXIS}>
              {narrow && ci % 2 === 1 ? "" : c.title}
            </text>
          ))}
          {links.map(([c1, i1, c2, i2], k) => {
            const a = node(c1, i1);
            const b = node(c2, i2);
            const mx = (a.x + b.x) / 2;
            return (
              <path
                key={k}
                d={`M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`}
                fill="none"
                stroke={c1 === 1 ? ACCENT : "color-mix(in srgb, var(--ink) 30%, transparent)"}
                strokeWidth="1.5"
              />
            );
          })}
          {cols.map((c, ci) =>
            c.nodes.map((label, i) => {
              const p = node(ci, i);
              const w = ci === 0 || ci === 4 ? 22 : narrow ? 46 : 64;
              return (
                <g key={`${ci}${i}`}>
                  <rect x={p.x - w / 2} y={p.y - 11} width={w} height={22} rx="3" fill="var(--card)" stroke="color-mix(in srgb, var(--ink) 35%, transparent)" />
                  <text x={p.x} y={p.y} dy="0.33em" textAnchor="middle" fontSize={narrow ? 10 : 11} fill={INK}>
                    {label}
                  </text>
                </g>
              );
            })
          )}
          {!narrow &&
            edgesNote.map((n, i) => (
              <text
                key={n}
                x={(node(i, 0).x + node(i + 1, 0).x) / 2}
                y={h - 10}
                textAnchor="middle"
                fontSize="11"
                fill={AXIS}
              >
                {n}
              </text>
            ))}
        </svg>
      )}
      {narrow && (
        <ol className="mt-1 space-y-0.5 font-sans text-[11.5px] text-muted">
          {edgesNote.map((n, i) => (
            <li key={n}>
              {cols[i].title} to {cols[i + 1].title.toLowerCase()}: {n}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* PhantomGM: lib/phantomgm/faab.ts:54-64. */
function PgmFaab() {
  const pts = range(1, 300, 1).map((r) => [r, r <= 50 ? 0.12 : 0.12 * Math.exp(-(r - 50) / 55)] as [number, number]);
  return (
    <LineChart
      series={[{ name: "Bid share", color: ACCENT, points: pts }]}
      x={{ min: 1, max: 300, ticks: [1, 50, 100, 150, 200, 250, 300], fmt: String, label: "Player rank" }}
      y={{ min: 0, max: 0.12, ticks: [0, 0.04, 0.08, 0.12], fmt: pct0, label: "Of budget" }}
      hoverX={(v) => `Rank ${v}`}
      hoverY={pct1}
    />
  );
}

/* Lineup Lab: src/lib/blend.ts:248-249. */
function LlBlend() {
  const rows = [
    { label: "Two or more books", parts: [85, 7.5, 7.5] },
    { label: "One book", parts: [70, 15, 15] },
    { label: "No book prices it", parts: [0, 50, 50] },
  ];
  const keys = [
    { name: "Sportsbooks", color: ACCENT },
    { name: "Sleeper", color: "color-mix(in srgb, var(--ink) 55%, transparent)" },
    { name: "ESPN", color: "color-mix(in srgb, var(--ink) 28%, transparent)" },
  ];
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 font-sans text-[12px] text-secondary">
        {keys.map((k) => (
          <span key={k.name} className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: k.color }} />
            {k.name}
          </span>
        ))}
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
            <span className="font-sans text-[12.5px] text-secondary">{r.label}</span>
            <span className="flex h-7 gap-[2px]">
              {r.parts.map((v, i) =>
                v > 0 ? (
                  <span
                    key={i}
                    className="flex items-center justify-center rounded-[4px] font-sans text-[11.5px] tabular-nums"
                    style={{ width: `${v}%`, background: keys[i].color, color: i === 0 ? "var(--ground)" : INK }}
                    title={`${keys[i].name}: ${v}%`}
                  >
                    {v >= 12 ? `${v}%` : ""}
                  </span>
                ) : null
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Lineup Lab: src/lib/blend.ts:142. */
function LlDvp() {
  const rows: [string, number][] = [
    ["Tight ends", 0.25],
    ["Quarterbacks", 0.24],
    ["Running backs", 0.2],
    ["Kickers", 0.12],
    ["Wide receivers", -0.09],
  ];
  return (
    <Bars
      rows={rows.map(([label, value]) => ({ label, value, hot: value < 0, display: value.toFixed(2).replace(/^(-?)0/, "$1").replace("-", "−") }))}
      min={-0.1}
      max={0.3}
      fmt={String}
    />
  );
}

/* Playcaller: src/engine/value.ts:27. */
function PcWeeks() {
  const w = [1, 0.85, 0.75, 0.65, 0.55, 0.45];
  return (
    <Columns
      cols={w.map((value, i) => ({ label: i === 0 ? "This week" : `+${i}`, value, hot: i === 0, display: `×${value}` }))}
      max={1}
      fmt={String}
    />
  );
}

/* Playcaller: src/engine/planner.ts:89-94, 640-660. Bid when P(rival) × edge ≥ 1. */
function PcBid() {
  const [ref, width] = useWidth();
  const [pt, setPt] = useState<{ e: number; p: number } | null>(null);
  const h = 260;
  const m = { l: 58, r: 14, t: 10, b: 40 };
  const iw = Math.max(0, width - m.l - m.r);
  const ih = h - m.t - m.b;
  const E = 10;
  const P = 0.8;
  const sx = (v: number) => m.l + (v / E) * iw;
  const sy = (v: number) => m.t + ih - (v / P) * ih;
  const curve = range(1 / P, E, 0.05).map((e) => [e, 1 / e] as [number, number]);
  const region =
    `M${sx(1 / P)},${sy(P)} ` + curve.map(([e, p]) => `L${sx(e).toFixed(1)},${sy(p).toFixed(1)}`).join(" ") + ` L${sx(E)},${sy(P)} Z`;
  return (
    <div ref={ref} className="relative" style={{ height: h }}>
      {width > 0 && (
        <svg width={width} height={h} className="block font-sans">
          <path d={region} fill="color-mix(in srgb, var(--accent) 18%, transparent)" />
          {[0, 0.2, 0.4, 0.6, 0.8].map((t) => (
            <g key={t}>
              <line x1={m.l} x2={m.l + iw} y1={sy(t)} y2={sy(t)} stroke={GRID} />
              <text x={m.l - 8} y={sy(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={AXIS}>
                {pct0(t)}
              </text>
            </g>
          ))}
          {[0, 2, 4, 6, 8, 10].map((t) => (
            <text key={t} x={sx(t)} y={m.t + ih + 18} textAnchor="middle" fontSize="11" fill={AXIS}>
              {t}
            </text>
          ))}
          <text x={m.l + iw / 2} y={h - 4} textAnchor="middle" fontSize="11" fill={AXIS}>
            Edge over the next best option, points
          </text>
          <text transform={`translate(11 ${m.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill={AXIS}>
            Chance of a rival claim
          </text>
          <path
            d={curve.map(([e, p], i) => `${i ? "L" : "M"}${sx(e).toFixed(1)},${sy(p).toFixed(1)}`).join("")}
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
          />
          {[
            { p: 0.41, label: "skill players, 41%", end: true },
            { p: 0.07, label: "kickers and defenses, 7%", end: false },
          ].map((r) => (
            <g key={r.label}>
              <line x1={m.l} x2={m.l + iw} y1={sy(r.p)} y2={sy(r.p)} stroke={INK_3} strokeDasharray="3 4" />
              <text
                x={r.end ? m.l + iw - 4 : m.l + 6}
                y={sy(r.p) - 6}
                textAnchor={r.end ? "end" : "start"}
                fontSize="11"
                fill={AXIS}
              >
                {r.label}
              </text>
            </g>
          ))}
          <text x={sx(6.2)} y={sy(0.66)} fontSize="12" fill={INK}>
            Bid
          </text>
          <text x={sx(0.5)} y={sy(0.24)} fontSize="12" fill={INK_2}>
            Minimum
          </text>
          {pt && <circle cx={sx(pt.e)} cy={sy(pt.p)} r="4" fill={INK} stroke="var(--ground)" strokeWidth="2" />}
          <rect
            x={m.l}
            y={m.t}
            width={iw}
            height={ih}
            fill="transparent"
            onPointerMove={(ev) => {
              const b = (ev.currentTarget as SVGRectElement).getBoundingClientRect();
              setPt({
                e: Math.max(0, Math.min(E, ((ev.clientX - b.left) / b.width) * E)),
                p: Math.max(0, Math.min(P, (1 - (ev.clientY - b.top) / b.height) * P)),
              });
            }}
            onPointerLeave={() => setPt(null)}
          />
        </svg>
      )}
      {pt && width > 0 && (
        <Tip left={Math.min(Math.max(sx(pt.e), 80), width - 80)} top={sy(pt.p) - 10}>
          <div className="tabular-nums">
            {pt.e.toFixed(1)} pts × {pct0(pt.p)} = {(pt.e * pt.p).toFixed(2)}
          </div>
          <div className="text-ink">{pt.e * pt.p >= 1 ? "Bid above the minimum" : "Minimum bid"}</div>
        </Tip>
      )}
    </div>
  );
}

/* Playcaller: README "Free agent or claim", checked by scripts/waiver-check.mts. */
function PcAgree() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line">
      {[
        { v: "97.9%", l: "of real claims and adds, weeks 3 to 8" },
        { v: "99.3%", l: "leaving out Sunday adds" },
      ].map((s, i) => (
        <div key={s.v} className="bg-card px-5 py-5">
          <div
            className={cn(
              "font-mono text-[28px] tabular-nums leading-none",
              i === 0 ? "text-ink" : "text-ink"
            )}
          >
            {s.v}
          </div>
          <div className="mt-2 font-sans text-[12.5px] text-muted">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

/* Blakey: lib/compute.ts:26-63, thresholds.ts defaults (trend ±5, decline 25). */
function BbTrend() {
  const [ref, width] = useWidth();
  const [pt, setPt] = useState<{ a: number; b: number } | null>(null);
  const size = Math.min(width, 380);
  const h = size;
  const m = { l: 58, r: 22, t: 10, b: 40 };
  const iw = Math.max(0, size - m.l - m.r);
  const ih = h - m.t - m.b;
  const sx = (v: number) => m.l + (v / 100) * iw;
  const sy = (v: number) => m.t + ih - (v / 100) * ih;
  const poly = (pts: [number, number][]) => pts.map(([a, b], i) => `${i ? "L" : "M"}${sx(a).toFixed(1)},${sy(b).toFixed(1)}`).join("") + "Z";
  const classify = (a: number, b: number) =>
    a - b > 25 ? "Declining, flagged" : b < a - 5 ? "Trending down" : b > a + 5 ? "Trending up" : "Steady";
  return (
    <div ref={ref} className="relative" style={{ height: h || 300 }}>
      {size > 0 && (
        <svg width={size} height={h} className="block font-sans">
          <path d={poly([[0, 5], [0, 100], [95, 100]])} fill="color-mix(in srgb, var(--ink) 10%, transparent)" />
          <path d={poly([[0, 0], [0, 5], [95, 100], [100, 100], [100, 95], [5, 0]])} fill="color-mix(in srgb, var(--ink) 4%, transparent)" />
          <path d={poly([[5, 0], [100, 95], [100, 75], [25, 0]])} fill="color-mix(in srgb, var(--ink) 16%, transparent)" />
          <path d={poly([[25, 0], [100, 75], [100, 0]])} fill="color-mix(in srgb, var(--accent) 55%, transparent)" />
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={t}>
              <text x={m.l - 8} y={sy(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={AXIS}>
                {t}%
              </text>
              <text x={sx(t)} y={m.t + ih + 18} textAnchor="middle" fontSize="11" fill={AXIS}>
                {t}%
              </text>
            </g>
          ))}
          <text x={m.l + iw / 2} y={h - 4} textAnchor="middle" fontSize="11" fill={AXIS}>
            Completion three weeks ago
          </text>
          <text transform={`translate(11 ${m.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill={AXIS}>
            Completion now
          </text>
          <text x={sx(16)} y={sy(72)} fontSize="12" fill={INK_2}>Up</text>
          {/* Set along the band, which is only ten points wide. */}
          <text
            x={sx(62)}
            y={sy(62)}
            dy="0.34em"
            textAnchor="middle"
            fontSize="11"
            fill={INK_2}
            transform={`rotate(${(-Math.atan2(ih, iw) * 180) / Math.PI} ${sx(62)} ${sy(62)})`}
          >
            Steady
          </text>
          <text x={sx(70)} y={sy(52)} fontSize="12" fill={INK_2}>Down</text>
          <text x={sx(62)} y={sy(14)} fontSize="12" fill={INK}>Declining</text>
          {pt && <circle cx={sx(pt.a)} cy={sy(pt.b)} r="4" fill={INK} stroke="var(--ground)" strokeWidth="2" />}
          <rect
            x={m.l}
            y={m.t}
            width={iw}
            height={ih}
            fill="transparent"
            onPointerMove={(ev) => {
              const b = (ev.currentTarget as SVGRectElement).getBoundingClientRect();
              setPt({
                a: Math.round(Math.max(0, Math.min(100, ((ev.clientX - b.left) / b.width) * 100))),
                b: Math.round(Math.max(0, Math.min(100, (1 - (ev.clientY - b.top) / b.height) * 100))),
              });
            }}
            onPointerLeave={() => setPt(null)}
          />
        </svg>
      )}
      {pt && size > 0 && (
        <Tip left={Math.min(Math.max(sx(pt.a), 80), size - 40)} top={sy(pt.b) - 10}>
          <div className="tabular-nums">
            {pt.a}% to {pt.b}%
          </div>
          <div className="text-ink">{classify(pt.a, pt.b)}</div>
        </Tip>
      )}
    </div>
  );
}

/* Blakey: lib/compute.ts:79-110, Appendix A bands. */
function BbPriority() {
  const rows = [
    { label: "7+ days without a sign-in", lo: 100, hi: 130, open: true, hot: true, note: "100 + days" },
    { label: "Completion in the churn band", lo: 80, hi: 99, note: "80 to 99" },
    { label: "Steep three week decline", lo: 60, hi: 99, note: "60 to 99" },
    { label: "3+ days without a sign-in", lo: 40, hi: 59, note: "40 to 59" },
  ];
  const lo = 40;
  const hi = 130;
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_4.4rem] items-center gap-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_4.6rem]"
          >
            <span className="font-sans text-[12.5px] leading-tight text-secondary">{r.label}</span>
            <span className="relative h-[14px]">
              <span
                className="absolute inset-y-0 rounded-[4px]"
                style={{
                  left: `${at(r.lo)}%`,
                  width: `${at(r.hi) - at(r.lo)}%`,
                  background: r.hot
                    ? `linear-gradient(to right, ${ACCENT} 70%, transparent)`
                    : "color-mix(in srgb, var(--ink) 34%, transparent)",
                }}
              />
            </span>
            <span className="text-right font-sans text-[12px] tabular-nums text-ink">{r.note}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_4.4rem] gap-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_4.6rem]">
        <span />
        <span className="relative h-4 font-sans text-[11px] text-muted">
          {[
            { v: 40, l: "Watch" },
            { v: 60, l: "At risk" },
            { v: 100, l: "Urgent" },
          ].map((b) => (
            <span key={b.l} className="absolute top-0" style={{ left: `${at(b.v)}%` }}>
              {b.l}
            </span>
          ))}
        </span>
        <span />
      </div>
    </div>
  );
}

const FIGURES: Record<FigureId, () => ReactNode> = {
  "fbi-prior-k": FbiPriorK,
  "fbi-shrink": FbiShrink,
  "fbi-forgiveness": FbiForgiveness,
  "sharp-shrink": SharpShrink,
  "nrfi-calculator": NrfiCalculator,
  "sharp-brier": SharpBrier,
  "bvp-score": BvpScore,
  "bvp-spot": BvpSpot,
  "tpdl-weight": TpdlWeight,
  "tpdl-t": TpdlT,
  "tpdl-lottery": TpdlLottery,
  "fdx-spread": FdxSpread,
  "fdx-prior": FdxPrior,
  "fdx-recency": FdxRecency,
  "pgm-play": PgmPlay,
  "pgm-flow": PgmFlow,
  "pgm-faab": PgmFaab,
  "ll-blend": LlBlend,
  "ll-dvp": LlDvp,
  "pc-weeks": PcWeeks,
  "pc-bid": PcBid,
  "pc-agree": PcAgree,
  "bb-trend": BbTrend,
  "bb-priority": BbPriority,
};

export function Figure({ id }: { id: FigureId }) {
  const Component = FIGURES[id];
  return <Component />;
}
