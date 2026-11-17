"use client";

import { useId, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Surface } from "./kit";
import "./sharprfi.css";

/*
  SHARPRFI's Poisson engine with its inputs on real controls.

  The math is lib/poisson.ts in the sharprfi repo, constant for constant:
  computeLambda, computeYrfiProbability and breakEvenOdds. It is repeated here
  (and in sharprfi.tsx) because a client file cannot share plain functions with
  a server one. The top-of-order factor is left at neutral, as the product
  leaves it before a lineup is posted.
*/

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Half = { fip: number; k: number; barrel: number; obp: number };
const AVERAGE: Half = { fip: 3.8, k: 0.23, barrel: 8.0, obp: 0.31 };

function lambda(h: Half, parkFactor: number, weather: number) {
  const fip = Math.pow(h.fip / 3.8, 0.55);
  const k = clamp(1 + (0.3 * (0.23 - h.k)) / 0.23, 0.85, 1.15);
  const barrel = Math.pow(h.barrel / 8.0, 0.35);
  const obp = Math.pow(h.obp / 0.31, 0.7);
  return 0.3371 * clamp(fip * k * barrel * obp * Math.sqrt(parkFactor) * Math.sqrt(weather), 0.55, 1.55);
}

function breakEven(p: number) {
  const n = p >= 0.5 ? -Math.floor((100 * p) / (1 - p) + 1e-9) : Math.ceil((100 * (1 - p)) / p - 1e-9);
  return n === -100 ? "+100" : n > 0 ? `+${n}` : `${n}`;
}

/* lib/yrfi-color.ts and lib/nrfi-color.ts: the same nine stops over each view's range. */
const HUES = [0, 17, 35, 52, 70, 87, 105, 122, 140];
const LIGHTS = [42, 41, 40, 39, 38, 36, 34, 33, 32];
function viewColor(p: number, lo: number, hi: number) {
  const i = Math.round(clamp((p - lo) / (hi - lo), 0, 1) * 8);
  return `hsl(${HUES[i]} 82% ${LIGHTS[i]}%)`;
}

/* lib/park-factors.ts (Petco 0.88, Coors 1.28) and tempFactor, windFactor in lib/poisson.ts. */
const PARKS = [
  { name: "Petco", f: 0.88 },
  { name: "Neutral", f: 1.0 },
  { name: "Coors", f: 1.28 },
];
const TEMPS = [
  { name: "<55°F", f: 0.92 },
  { name: "55 to 80", f: 1.0 },
  { name: ">80°F", f: 1.06 },
];
const WINDS = [
  { name: "In", f: 0.93 },
  { name: "Calm", f: 1.0 },
  { name: "Out", f: 1.08 },
];

type Mode = "nrfi" | "yrfi";
/* lib/mode.ts: green-600 for YRFI, red-600 for NRFI. */
const ACCENT: Record<Mode, string> = { yrfi: "#16a34a", nrfi: "#dc2626" };

function Slider({
  label,
  value,
  min,
  max,
  step,
  text,
  fill,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  text: string;
  fill: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="grid grid-cols-[calc(var(--px)*92)_1fr_calc(var(--px)*46)] items-center gap-x-3">
      <label htmlFor={id} className="t-12 text-secondary">
        {label}
      </label>
      <input
        id={id}
        type="range"
        className="srfi-range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--srfi-fill": fill, "--srfi-at": `${(((value - min) / (max - min)) * 100).toFixed(2)}%` } as CSSProperties}
      />
      <span className="text-right t-12 font-semibold text-[#334155] tnum">{text}</span>
    </div>
  );
}

function Segments({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { name: string }[];
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-[calc(var(--px)*92)_1fr] items-center gap-x-3">
      <span className="t-12 text-secondary">{label}</span>
      <div className="grid grid-cols-3 gap-1 r-99 bg-raised p-0.5">
        {options.map((o, i) => (
          <button
            key={o.name}
            type="button"
            aria-pressed={i === value}
            onClick={() => onChange(i)}
            className={cn(
              "h-8 cursor-pointer r-99 t-12 font-medium leading-none",
              i === value ? "bg-[#1e293b] text-white" : "text-muted hover:text-[#334155]"
            )}
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="block r-8 bg-card px-2 py-1.5 text-center">
      <span className="block t-10 font-semibold uppercase tracking-wider text-[#94a3b8]">
        <span className="normal-case">λ</span> {label}
      </span>
      <span className="mt-0.5 block t-13 font-semibold text-[#334155] tnum">{value}</span>
    </span>
  );
}

/** The Poisson engine as a calculator: both halves, the park and the weather in, probability and price out. */
export function SharprfiCalculator() {
  const [mode, setMode] = useState<Mode>("yrfi");
  const [side, setSide] = useState<"top" | "bottom">("top");
  const [top, setTop] = useState<Half>({ fip: 4.25, k: 0.215, barrel: 9.6, obp: 0.326 });
  const [bottom, setBottom] = useState<Half>({ fip: 3.05, k: 0.28, barrel: 7.2, obp: 0.312 });
  const [park, setPark] = useState(1);
  const [temp, setTemp] = useState(1);
  const [wind, setWind] = useState(1);

  const weather = TEMPS[temp].f * WINDS[wind].f;
  const lTop = lambda(top, PARKS[park].f, weather);
  const lBottom = lambda(bottom, PARKS[park].f, weather);
  const yrfi = 1 - Math.exp(-lTop) * Math.exp(-lBottom);
  const p = mode === "yrfi" ? yrfi : 1 - yrfi;
  const color = mode === "yrfi" ? viewColor(p, 0.44, 0.6) : viewColor(p, 0.45, 0.62);
  const accent = ACCENT[mode];

  const half = side === "top" ? top : bottom;
  const setHalf = side === "top" ? setTop : setBottom;
  const reset = () => {
    setTop(AVERAGE);
    setBottom(AVERAGE);
    setPark(1);
    setTemp(1);
    setWind(1);
  };

  return (
    <Surface
      w={420}
      brand="sharprfi"
      label="SHARPRFI calculator: set each starter, each lineup, the park and the weather, and read the first-inning run probability and break-even odds."
      className="bg-ground"
      interactive
    >
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="t-11 font-semibold uppercase tracking-wider text-[#94a3b8]">Poisson model</span>
          <div role="group" aria-label="Bet type" className="flex r-99 bg-raised p-0.5">
            {(["nrfi", "yrfi"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={cn("h-8 cursor-pointer r-99 px-3.5 t-12 font-semibold leading-none", mode === m ? "text-white" : "text-muted hover:text-[#334155]")}
                style={mode === m ? { background: ACCENT[m] } : undefined}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <output aria-live="polite" className="mt-3 block">
          <span className="flex items-end justify-between">
            <span>
              <span className="block t-11 font-semibold uppercase tracking-wider text-[#94a3b8]">{mode.toUpperCase()} %</span>
              <span className="mt-1 block t-40 font-bold leading-none tracking-tight tnum" style={{ color }}>
                {(p * 100).toFixed(2)}%
              </span>
            </span>
            <span className="text-right">
              <span className="block t-11 font-semibold uppercase tracking-wider text-[#94a3b8]">Bet at</span>
              <span className="mt-1 block t-17 font-semibold leading-tight text-[#334155] tnum">{breakEven(p)} or better</span>
            </span>
          </span>
          <span className="mt-3 grid grid-cols-2 gap-1">
            <Stat label="top 1st" value={lTop.toFixed(3)} />
            <Stat label="bottom 1st" value={lBottom.toFixed(3)} />
          </span>
        </output>

        <div role="group" aria-label="Half inning to edit" className="mt-4 grid grid-cols-2 gap-1 r-99 bg-raised p-0.5">
          {(
            [
              ["top", "Top 1st"],
              ["bottom", "Bottom 1st"],
            ] as const
          ).map(([key, name]) => (
            <button
              key={key}
              type="button"
              aria-pressed={side === key}
              onClick={() => setSide(key)}
              className={cn("h-8 cursor-pointer r-99 t-12 font-medium leading-none", side === key ? "bg-ground text-ink shadow-[0_0_0_1px_#e2e8f0]" : "text-muted hover:text-[#334155]")}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mt-2">
          <Slider label="Starter FIP" value={half.fip} min={2} max={6} step={0.05} text={half.fip.toFixed(2)} fill={accent} onChange={(v) => setHalf({ ...half, fip: v })} />
          <Slider label="Starter K%" value={half.k} min={0.14} max={0.34} step={0.005} text={`${(half.k * 100).toFixed(1)}%`} fill={accent} onChange={(v) => setHalf({ ...half, k: v })} />
          <Slider label="Starter Barrel%" value={half.barrel} min={4} max={13} step={0.1} text={`${half.barrel.toFixed(1)}%`} fill={accent} onChange={(v) => setHalf({ ...half, barrel: v })} />
          <Slider label="Lineup OBP" value={half.obp} min={0.27} max={0.36} step={0.001} text={half.obp.toFixed(3)} fill={accent} onChange={(v) => setHalf({ ...half, obp: v })} />
        </div>

        <div className="mt-2 grid gap-1.5 border-t border-[#f1f5f9] pt-3">
          <Segments label="Park" options={PARKS} value={park} onChange={setPark} />
          <Segments label="Temp" options={TEMPS} value={temp} onChange={setTemp} />
          <Segments label="Wind" options={WINDS} value={wind} onChange={setWind} />
        </div>

        <div className="mt-2 flex justify-end">
          <button type="button" onClick={reset} className="-mr-3 h-8 cursor-pointer r-99 px-3 t-12 text-muted hover:bg-raised hover:text-[#334155]">
            Reset to league average
          </button>
        </div>
      </div>
    </Surface>
  );
}
