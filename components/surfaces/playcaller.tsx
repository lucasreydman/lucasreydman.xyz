import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Headshot, Surface } from "./kit";
import type { SurfaceDef } from "./types";
import "./playcaller.css";

/*
  Playcaller, rebuilt from playcaller's own screens (src/app/(app) and
  src/components/cards.tsx, bits.tsx, AutoClock.tsx, Shell.tsx).

  Colours and type come from its src/app/globals.css: an ink-black field,
  chalk type, signal orange for the one call that matters, volt for points won.
  Big Shoulders at 800 in caps for titles and numerals, Instrument Sans for the
  rest. Cards take the radius the app gives them at each width (22 on a 320
  screen, 27 at 390), and everything nested is that radius less the padding.

  The colours below that are not shared tokens are the app's own:
    volt #c8f531, amber #ffb224, violet #a98bff, red #ff4d5e, blue #52c2ff,
    signal-2 #ff8a3d, surface-3 #242830, line-2 #323840, muted-2 #66635d.

  The players are real and the figures are sample projections. The leagues and
  the teams in them are invented. It is Tuesday 9:41 AM of week 10, so every
  unrostered player is on waivers until the Wednesday 3:00 AM run.
*/

const px = (n: number) => `calc(var(--px) * ${n})`;
const box = (n: number): CSSProperties => ({ width: px(n), height: px(n) });

/** src/lib/client.ts */
const fmt1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
const round1 = (n: number) => Math.round(n * 10) / 10;

/* ─── the app's icon set (src/components/Icon.tsx), path for path ─────────── */

const PATHS: Record<string, ReactNode> = {
  call: (
    <>
      <circle cx="7" cy="17" r="2.6" />
      <path d="M7 14.4V9.6C7 7.6 8.6 6 10.6 6H16" />
      <path d="M15 3.5 19 6l-4 2.5z" fill="currentColor" />
      <path d="m14.5 14.5 4 4m0-4-4 4" />
    </>
  ),
  leagues: (
    <>
      <path d="M4 6.5h16M4 12h16M4 17.5h10" />
      <circle cx="18.5" cy="17.5" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  activity: <path d="M3 12h4l2.5-6 5 12 2.5-6H21" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />,
  swap: (
    <>
      <path d="M7 4 4 7l3 3" />
      <path d="M4 7h12" />
      <path d="m17 14 3 3-3 3" />
      <path d="M20 17H8" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  ir: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 4v7h-7" />
    </>
  ),
};

function Icon({ name, size = 22, stroke = 1.9, className }: { name: string; size?: number; stroke?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("flex-none", className)}
      style={box(size)}
    >
      {PATHS[name]}
    </svg>
  );
}

/** The brand mark as the header draws it (Icon.tsx, `Mark`). */
function Mark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 512 512" className="flex-none" style={box(size)}>
      <defs>
        <linearGradient id="pc-mark-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="0.55" stopColor="#ff5b14" />
          <stop offset="1" stopColor="#e2450a" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="128" fill="url(#pc-mark-g)" />
      <g fill="none" stroke="#170800" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="146" cy="372" r="36" strokeWidth="30" />
        <path d="M146 324V244q0-76 76-76h96" strokeWidth="32" />
        <path d="M318 122l70 46-70 46z" fill="#170800" strokeWidth="14" />
        <path d="M330 330l68 68m0-68-68 68" strokeWidth="30" />
      </g>
    </svg>
  );
}

/** The installed app icon (public/brand/playcaller/icon.svg), inline so it scales with the surface. */
function AppIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={cn("flex-none", className)} style={box(size)}>
      <defs>
        <linearGradient id="pc-icon-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="0.55" stopColor="#ff5b14" />
          <stop offset="1" stopColor="#e2450a" />
        </linearGradient>
        <radialGradient id="pc-icon-h" cx="0.3" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#pc-icon-g)" />
      <rect width="512" height="512" rx="112" fill="url(#pc-icon-h)" />
      <path d="M0 128.5 H512 M0 256.5 H512 M0 384.5 H512" stroke="#170800" strokeOpacity="0.07" strokeWidth="3" />
      <g fill="none" stroke="#170800" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="146" cy="372" r="36" strokeWidth="28" />
        <path d="M146 324 V244 Q146 168 222 168 H318" strokeWidth="30" />
        <path d="M318 122 L388 168 L318 214 Z" fill="#170800" strokeWidth="14" />
        <path d="M330 330 L398 398 M398 330 L330 398" strokeWidth="28" />
      </g>
    </svg>
  );
}

/* ─── small parts, each one a class from the app's globals.css ────────────── */

const DISPLAY = "font-display font-extrabold uppercase leading-[0.92] tracking-[-0.01em]";
const NUM = "font-display font-extrabold tabular-nums tracking-[0.01em]";
const LABEL = "t-10.5 font-bold uppercase tracking-[0.12em] text-muted";

const CHIP_TONE = {
  plain: "bg-[#242830] text-secondary",
  signal: "bg-[rgba(255,91,20,0.14)] text-[#ff8a3d]",
  volt: "bg-[rgba(200,245,49,0.13)] text-[#c8f531]",
  red: "bg-[rgba(255,77,94,0.14)] text-[#ff4d5e]",
  amber: "bg-[rgba(255,178,36,0.14)] text-[#ffb224]",
  blue: "bg-[rgba(82,194,255,0.13)] text-[#52c2ff]",
  violet: "bg-[rgba(169,139,255,0.15)] text-[#a98bff]",
} as const;

function Chip({ tone = "plain", children, className }: { tone?: keyof typeof CHIP_TONE; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 flex-none items-center gap-1 whitespace-nowrap r-10 px-2 t-10.5 font-extrabold uppercase leading-none tracking-[0.05em]",
        CHIP_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* .pos-QB and friends */
const POS_TONE: Record<string, string> = {
  QB: "bg-[rgba(255,99,132,0.16)] text-[#ff8fa6]",
  RB: "bg-[rgba(82,214,160,0.15)] text-[#6fe2b4]",
  WR: "bg-[rgba(82,194,255,0.15)] text-[#7fd0ff]",
  TE: "bg-[rgba(255,178,36,0.15)] text-[#ffc65c]",
};

function Pos({ pos }: { pos: string }) {
  return (
    <span className={cn("inline-flex h-5 w-7.5 flex-none items-center justify-center r-10 t-10 font-extrabold uppercase leading-none tracking-[0.05em]", POS_TONE[pos])}>
      {pos}
    </span>
  );
}

type League = {
  name: string;
  /** Two characters on a tint from the app's position palette. The app shows the league's Sleeper avatar here. */
  mark: string;
  tint: string;
  format: string;
  record: string;
  rank: string;
  autos: number;
  picks: number;
  me: number;
  opp: number;
  oppName: string;
};

const LEAGUES: Record<string, League> = {
  scaries: { name: "Sunday Scaries", mark: "SS", tint: "bg-[rgba(255,99,132,0.16)] text-[#ff8fa6]", format: "12-team · 0.5 PPR", record: "6-3", rank: "3rd", autos: 1, picks: 2, me: 121.6, opp: 112.3, oppName: "Kittle Big Town" },
  basement: { name: "Basement Bowl", mark: "BB", tint: "bg-[rgba(82,194,255,0.15)] text-[#7fd0ff]", format: "12-team · PPR · Dynasty · SF", record: "7-2", rank: "1st", autos: 1, picks: 1, me: 148.2, opp: 135.9, oppName: "Hurts So Good" },
  fourth: { name: "Fourth & Long", mark: "4L", tint: "bg-[rgba(255,178,36,0.15)] text-[#ffc65c]", format: "10-team · PPR", record: "4-5", rank: "6th", autos: 1, picks: 0, me: 126.4, opp: 131.0, oppName: "Bijan Mustard" },
  onside: { name: "The Onside Kick", mark: "OK", tint: "bg-[rgba(82,214,160,0.15)] text-[#6fe2b4]", format: "12-team · 0.5 PPR · Keeper", record: "5-4", rank: "5th", autos: 0, picks: 2, me: 109.7, opp: 104.1, oppName: "Nacua Matata" },
  pylon: { name: "Pylon Cam", mark: "PC", tint: "bg-[rgba(169,139,255,0.16)] text-[#c0a9ff]", format: "12-team · Standard", record: "8-1", rank: "1st", autos: 0, picks: 0, me: 96.4, opp: 101.8, oppName: "Lamb Chops" },
  redzone: { name: "Red Zone Regulars", mark: "RZ", tint: "bg-[rgba(255,77,94,0.14)] text-[#ff8f9a]", format: "14-team · PPR", record: "3-6", rank: "11th", autos: 0, picks: 2, me: 117.3, opp: 124.8, oppName: "Chase the Bag" },
  drill: { name: "Two-Minute Drill", mark: "2M", tint: "bg-[rgba(244,241,234,0.1)] text-secondary", format: "10-team · 0.5 PPR · SF", record: "5-4", rank: "4th", autos: 0, picks: 0, me: 133.5, opp: 127.2, oppName: "Stroud Boys" },
};

function Avatar({ l, size }: { l: League; size: number }) {
  return (
    <span className={cn("flex flex-none items-center justify-center r-99 font-extrabold leading-none", l.tint)} style={{ ...box(size), fontSize: px(size * 0.36) }}>
      {l.mark}
    </span>
  );
}

/* ─── the phone ───────────────────────────────────────────────────────────── */

/*
  The app is laid out for a 390 point iPhone, and at the kit's 320 its rows wrap
  where they never do on the real device. So these screens are drawn at 390 in
  a frame built like the kit's: a 406 body, so a phone surface is 446 wide.
*/
function PcPhone({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-101.5 r-58 bg-[#0c0c0d] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_24px_48px_rgba(0,0,0,0.35)]">
      <div className="pc-field relative overflow-hidden r-50 text-ink">
        <div className="absolute left-1/2 top-3 z-20 h-7.5 w-27 -translate-x-1/2 r-15 bg-black" />
        {children}
      </div>
    </div>
  );
}

function PcStatusBar() {
  return (
    <div className="flex h-13 items-center justify-between px-9 t-15 font-semibold">
      <span>9:41</span>
      <span className="h-3 w-5.5 r-3 border border-current opacity-80" />
    </div>
  );
}

/* ─── the floating tab bar (Shell.tsx, glass-tab-bar.tsx) ─────────────────── */

const TABS = [
  { label: "Moves", icon: "call" },
  { label: "Leagues", icon: "leagues" },
  { label: "Activity", icon: "activity" },
  { label: "Settings", icon: "settings" },
] as const;

function Dock({ active, badge }: { active: (typeof TABS)[number]["label"]; badge: number }) {
  return (
    <>
      <div className="pc-edge pointer-events-none absolute inset-x-0 bottom-0 h-24" />
      <div className="pc-glass absolute inset-x-2.5 bottom-2.5 z-10 flex r-30 p-1">
        {TABS.map((t) => (
          <span
            key={t.label}
            className={cn(
              "flex h-13 flex-1 flex-col items-center justify-center gap-1 r-26",
              t.label === active ? "bg-[rgb(244_241_234/0.12)] text-accent" : "text-ink",
            )}
          >
            <span className="relative flex">
              <Icon name={t.icon} size={24} />
              {t.label === "Moves" && badge ? (
                <span className="pc-badge absolute -top-1.25 left-[calc(100%-var(--px)*6)] flex h-4.25 min-w-4.25 items-center justify-center r-9 bg-accent px-1.25 t-10 font-extrabold leading-none text-accent-ink">
                  {badge}
                </span>
              ) : null}
            </span>
            <span className="t-10 font-bold uppercase leading-none tracking-[0.08em]">{t.label}</span>
          </span>
        ))}
      </div>
    </>
  );
}

/* ─── Moves ───────────────────────────────────────────────────────────────── */

type AutoRow = { league: League; what: string; gain?: number };

/* One row per league, as AutoRow writes them. A lineup with the same players in a better order reads "Reorder by kickoff". */
const AUTO: AutoRow[] = [
  { league: LEAGUES.scaries, what: "Start Jaylen Warren", gain: 2.3 },
  { league: LEAGUES.basement, what: "Start Jake Ferguson", gain: 1.8 },
  { league: LEAGUES.fourth, what: "Reorder by kickoff" },
];

const ALL = Object.values(LEAGUES);
const AUTO_COUNT = ALL.reduce((t, l) => t + l.autos, 0);
const PICK_COUNT = ALL.reduce((t, l) => t + l.picks, 0);
/** Claims already filed and waiting for the run. */
const PENDING = 2;

/** AutoClock's ring: it fills toward the next run. 9:41:36 on an hourly day is 41.6 of 60 minutes. */
function Ring({ frac }: { frac: number }) {
  const r = 7;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 18 18" className="flex-none -rotate-90" style={box(18)}>
      <circle cx={9} cy={9} r={r} fill="none" stroke="#323840" strokeWidth={2.25} />
      <circle cx={9} cy={9} r={r} fill="none" stroke="#c8f531" strokeWidth={2.25} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} />
    </svg>
  );
}

function Counter({ n, label, tone }: { n: number; label: string; tone: string }) {
  return (
    <div>
      <div className={cn(NUM, "t-36 leading-none", tone)}>{n}</div>
      <div className="mt-1 t-10 font-bold uppercase tracking-[0.1em] text-muted">{label}</div>
    </div>
  );
}

/** The home screen: what will run by itself, what is waiting on a choice, and when auto lineups runs next. */
export function PlaycallerMoves() {
  return (
    <Surface
      w={446}
      brand="playcaller"
      label={`Playcaller Moves screen for week 10: ${AUTO_COUNT} automatic moves, ${PICK_COUNT} suggested, ${PENDING} claims pending, auto lineups on, and the automatic list with the points each lineup change gains.`}
      className="pc-ground"
    >
      <div className="h-164 px-5 pt-6">
        <PcPhone>
          <PcStatusBar />
          <div className="flex items-center justify-between px-4 pb-1 pt-3">
            <span className="flex items-center gap-2">
              <Mark size={30} />
              <span className={cn(DISPLAY, "t-22 tracking-[0.025em]")}>Playcaller</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Chip>Week 10</Chip>
              <span className="pc-glass flex h-8.5 w-8.5 items-center justify-center r-17">
                <Icon name="refresh" size={18} />
              </span>
              <span className="flex h-8 w-8 items-center justify-center r-16 bg-[#242830] t-13 font-extrabold leading-none text-muted">L</span>
            </span>
          </div>

          {/* where things stand */}
          <div className="pc-card mx-4 mt-3 r-27 p-4">
            <div className="grid grid-cols-3 gap-2">
              <Counter n={AUTO_COUNT} label="Automatic" tone="text-accent" />
              <Counter n={PICK_COUNT} label="Suggested" tone="text-[#ffb224]" />
              <Counter n={PENDING} label="Claims" tone="text-[#a98bff]" />
            </div>
            <div className="my-3 h-px bg-line" />
            <div className="t-12.5 leading-relaxed text-muted">
              <div>{ALL.length} leagues, updated just now</div>
              <div>Next waivers Wed 3:00 AM (in 17h)</div>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="flex min-w-0 items-start gap-2 t-12.5">
                <Ring frac={41.6 / 60} />
                <span className="min-w-0 leading-snug">
                  <span className="block">
                    <span className="whitespace-nowrap font-semibold text-secondary">Auto lineups on</span>
                    <span className="text-muted">,</span> <span className="whitespace-nowrap tabular-nums text-muted">next run in 18:24</span>
                  </span>
                  <span className="mt-0.5 block t-12 text-muted">Hourly today, every 15 min from Thu</span>
                </span>
              </span>
              <Icon name="chevron" size={14} className="ml-auto text-muted" />
            </div>
          </div>

          {/* what runs by itself */}
          <div className="mt-6 pb-24">
            <div className="mb-3 flex items-end gap-3 px-4">
              <div className="min-w-0 flex-1">
                <h3 className={cn(DISPLAY, "t-24")}>Automatic</h3>
                <p className="mt-1 text-balance t-12 leading-snug text-muted">Lineups and IR moves that cost nobody. Auto lineups runs these on its own; you can run them now.</p>
              </div>
              <span className="pc-signal flex h-8.5 flex-none items-center gap-2 whitespace-nowrap r-17 px-3.5 t-13.5 font-bold tracking-[0.01em]">
                <Icon name="bolt" size={15} />
                Run {AUTO_COUNT}
              </span>
            </div>
            <div className="pc-card mx-4 r-27">
              {AUTO.map((row, i) => (
                <div key={row.league.name} className={cn("flex items-center gap-3 px-4 py-3", i > 0 && "border-t border-line")}>
                  <Avatar l={row.league} size={30} />
                  <span className="min-w-0 flex-1">
                    <span className="block t-14.5 font-semibold leading-snug">{row.league.name}</span>
                    <span className="block t-12 leading-snug text-muted">{row.what}</span>
                  </span>
                  {row.gain ? <span className={cn(NUM, "flex-none t-18 leading-none text-[#c8f531]")}>+{fmt1(row.gain)}</span> : null}
                  <Icon name="chevron" size={16} className="text-muted" />
                </div>
              ))}
            </div>
          </div>
        </PcPhone>
      </div>
    </Surface>
  );
}

/* ─── a suggested move, opened (cards.tsx, `MoveCard`) ────────────────────── */

/** src/engine/value.ts: this week counts in full, later weeks less. */
const WEEK_WEIGHTS = [1, 0.85, 0.75, 0.65, 0.55, 0.45];
const HORIZON = [10, 11, 12, 13, 14, 15];
const futureAvg = (p: number[]) => p.slice(1).reduce((t, v) => t + v, 0) / (p.length - 1);

/*
  One waiver claim in Sunday Scaries, worked the way src/engine/moves.ts and
  the bid sizing in src/engine/planner.ts (`bidFor`) work it.
*/
const CLAIM = (() => {
  const add = { name: "Bhayshul Tuten", espn: 4882093, pos: "RB", team: "JAX", opp: "vs HOU", kick: "Sun 1pm", weeks: [11.2, 10.6, 10.1, 9.8, 10.3, 9.9], mv: 1480, mvRank: 94 };
  const drop = { name: "Roschon Johnson", espn: 4426386, pos: "RB", team: "CHI", opp: "@ MIN", kick: "Sun 1pm", weeks: [3.4, 3.1, 2.9, 3.3, 3.0, 3.2], mv: 0 };
  /** What the best lineup gains each week with him on the roster. This week he starts over Rico Dowdle (8.4). */
  const delta = [2.8, 2.6, 2.2, 1.8, 2.4, 1.5];
  const total = delta.reduce((t, v, w) => t + v * WEEK_WEIGHTS[w], 0);
  const later = futureAvg(delta);

  /* score = lineup points + market value in and out (150 a point, capped at 5) + a little for trending, less the cost of a FAAB claim */
  const trend = 2400;
  const mvTerm = Math.max(-5, Math.min(5, (add.mv - drop.mv) / 150));
  const score = total + mvTerm + Math.min(1.5, Math.log10(1 + trend / 2000)) - 1.5;

  /* bidFor: this league's last two runs (2 contested of 6 won) leaned on the 40% prior, worth 10 claims */
  const faabLeft = 87;
  const rivalRate = (2 + 0.4 * 10) / (6 + 10);
  const pRival = Math.min(0.8, rivalRate);
  const edge = score; // no other option for the spot, so the fallback is zero
  const late = 1 + Math.max(0, HORIZON[0] - 9) / 8;
  const pct = Math.min(0.35, (0.01 + 0.006 * edge + Math.min(0.06, add.mv / 15000)) * late);
  const bid = Math.max(1, Math.min(faabLeft, Math.round(faabLeft * pct)));
  const odds = pRival >= 0.45 ? "about half of" : pRival >= 0.3 ? "about 1 in 3" : pRival >= 0.15 ? "about 1 in 5" : "few";
  const bidWhy = `${Math.round((bid / faabLeft) * 100)}% of your $${faabLeft}: ${odds} claims here draw a rival, and he’s worth about ${round1(edge)} more than your next\u2011best\u00a0option`;

  /* Each reason is one sentence in the app. A pair is a sentence held as the two lines it wraps into, and a middle dot that would fall at that break is left out. */
  const why: (string | [string, string])[] = [
    `Starts this week over Rico Dowdle: +${fmt1(delta[0])} pts`,
    `Starts in 5 of the next 5 weeks (+${fmt1(later)} pts a week for your lineup)`,
    [`Trade market: ${add.name} #${add.mvRank} overall,`, `${drop.name} unranked`],
    "Waiver claim, processed Wed 3:00 AM ET: the week’s last game has kicked off, so every unrostered player is on waivers until the run",
    [`${drop.name}: Starts 0 of 6 weeks`, `${fmt1(futureAvg(drop.weeks))} pts/wk · unranked by the market`],
  ];

  return { add, drop, delta, total, later, faabLeft, bid, bidWhy, why };
})();

type Player = typeof CLAIM.add | typeof CLAIM.drop;

/** bits.tsx `PlayerLine` with cards.tsx `InOut` on the right. */
function PlayerLine({ p, tone }: { p: Player; tone: "in" | "out" }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", tone === "out" && "opacity-60")}>
      {/* .shot: 38 square, at the radius the card leaves it (27 less 16). ESPN's picture is wider than it is tall, so it is drawn larger than the frame and hung from the top: the face fills the box. */}
      <span className="pc-shot relative block h-9.5 w-9.5 flex-none overflow-hidden r-11">
        <Headshot league="nfl" id={p.espn} className="absolute left-1/2 top-0 h-[132%] w-[132%] -translate-x-1/2 bg-transparent" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate t-15 font-semibold leading-snug">{p.name}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 t-12 text-muted">
          <Pos pos={p.pos} />
          <span>{p.team}</span>
          <span>· {p.opp}</span>
          <span className="whitespace-nowrap">· {p.kick}</span>
        </div>
      </div>
      <div className="flex-none text-right">
        <Chip tone={tone === "in" ? "volt" : "red"}>
          <Icon name={tone === "in" ? "plus" : "minus"} size={11} stroke={3} />
          {tone === "in" ? "Add" : "Drop"}
        </Chip>
        <div className="mt-1 t-10.5 text-muted">
          {fmt1(p.weeks[0])} this wk · {fmt1(futureAvg(p.weeks))}/wk
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, volt, r }: { label: string; value: string; volt?: boolean; r: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-line bg-raised px-2 py-1" style={{ borderRadius: px(r) }}>
      <span className="text-muted">{label}</span>
      <span className={cn("font-bold", volt ? "text-[#c8f531]" : "text-secondary")}>{value}</span>
    </span>
  );
}

/** The card as it sits in the list, selected: what the move is, who comes in and who goes out. */
function MoveHead({ r }: { r: number }) {
  const { add, drop, total, later, bid, faabLeft, delta } = CLAIM;
  return (
    <>
      <div className="flex items-start gap-2.5">
        <span className="flex h-6.5 w-6.5 flex-none items-center justify-center border-2 border-accent bg-accent text-accent-ink" style={{ borderRadius: px(r), borderWidth: px(2) }}>
          <Icon name="check" size={15} stroke={3.4} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <Chip tone="violet">
              <Icon name="clock" size={12} stroke={2.6} />
              Waiver claim · ${bid}
            </Chip>
            <Chip>Starts now</Chip>
          </div>
          <div className="mt-1.5 t-12 leading-snug text-muted">{LEAGUES.scaries.name}</div>
          {/* The app runs these as one title and one line. Both wrap in this column on a phone, so they break at the comma and at the separator. */}
          <div className="mt-1 t-16 font-semibold leading-snug">
            <span className="block whitespace-nowrap">Claim {add.name},</span>
            <span className="block whitespace-nowrap">drop {drop.name}</span>
          </div>
          <div className="mt-0.5 t-12.5 leading-snug text-muted">
            <span className="block whitespace-nowrap">Processes Wed 3:00 AM (in 17h)</span>
            <span className="block whitespace-nowrap">
              bid ${bid} of ${faabLeft}
            </span>
          </div>
        </div>
        <div className="flex-none text-right">
          <div className={cn(NUM, "t-22 leading-none text-[#c8f531]")}>+{fmt1(total)}</div>
          <div className="mt-1 t-10 leading-tight text-muted">
            lineup pts
            <br />
            {HORIZON.length} wks
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        <PlayerLine p={add} tone="in" />
        <PlayerLine p={drop} tone="out" />
      </div>

      <div className="mt-3 flex max-w-70 flex-wrap gap-1.5 t-11.5">
        <Stat label="This week" value={`+${fmt1(delta[0])}`} volt r={r} />
        <Stat label={`Wks ${HORIZON[1]}–${HORIZON[HORIZON.length - 1]}`} value={`+${fmt1(later)}/wk`} volt r={r} />
        <Stat label="Market" value={`#${add.mvRank}`} r={r} />
        <Stat label="Drop's market" value="unranked" r={r} />
      </div>
    </>
  );
}

function MoveWhy() {
  return (
    <ul className="flex flex-col gap-1.5 t-13.5 leading-[1.4] text-secondary">
      {CLAIM.why.map((w) => (
        <li key={typeof w === "string" ? w : w[0]} className="flex gap-2">
          <Icon name="chevron" size={12} stroke={3} className="mt-0.75 text-accent" />
          {typeof w === "string" ? (
            <span className="text-balance">{w}</span>
          ) : (
            <span>
              <span className="block whitespace-nowrap">{w[0]}</span>
              <span className="block whitespace-nowrap">{w[1]}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** bits.tsx `WeekTable`: both players week by week, and what the move does to the best lineup. */
function WeekTable() {
  const { add, drop, delta } = CLAIM;
  const cell = "border-t border-line px-1 py-1 text-right tabular-nums";
  const rows: [string, number[]][] = [
    [add.name.split(" ").slice(-1)[0], add.weeks],
    [drop.name.split(" ").slice(-1)[0], drop.weeks],
  ];
  return (
    <div>
      <div className={cn(LABEL, "mb-1.5")}>Week by week</div>
      <table className="w-full border-collapse t-12">
        <thead>
          <tr className="t-10.5 font-bold tracking-[0.06em] text-muted">
            <th className="px-1 py-0.75 text-left font-bold">Week</th>
            {HORIZON.map((w, i) => (
              <th key={w} className="px-1 py-0.75 text-right font-bold">
                {i === 0 ? `${w}*` : w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, weeks]) => (
            <tr key={name} className="text-secondary">
              <td className="border-t border-line px-1 py-1 text-left">{name}</td>
              {weeks.map((v, i) => (
                <td key={i} className={cell}>
                  {fmt1(v)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="font-bold text-ink">
            <td className="border-t border-line px-1 py-1 text-left">Lineup</td>
            {delta.map((v, i) => (
              <td key={i} className={cn(cell, "text-[#c8f531]")}>
                +{fmt1(v)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mt-1.5 t-11 leading-snug text-muted">
        *This week uses the Blend (props, lines, ESPN, Sleeper, matchup); later weeks are Sleeper’s projections. “Lineup” is how many points your best possible lineup gains each week.
      </p>
    </div>
  );
}

/** The bid: the stepper, Glisse's slider at its recommended value, and the sentence `bidFor` writes. */
function MoveBid() {
  const { bid, faabLeft, bidWhy } = CLAIM;
  const progress = bid / faabLeft;
  const stepper = "flex h-8.5 w-11 flex-none items-center justify-center r-17 border border-[#323840] bg-raised";
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className={LABEL}>Your bid</div>
        <div className="t-12 text-muted">recommended</div>
      </div>
      <div className="flex items-center gap-3">
        <span className={stepper}>
          <Icon name="minus" size={16} stroke={2.6} />
        </span>
        <div className={cn(NUM, "flex-1 text-center t-34 leading-none")}>${bid}</div>
        <span className={stepper}>
          <Icon name="plus" size={16} stroke={2.6} />
        </span>
      </div>
      <div className="relative mt-2 h-10">
        <div className="absolute inset-x-4 top-4.25 h-1.5 r-3 bg-[#242830]">
          <div className="h-full r-3 bg-accent" style={{ width: `calc((100% - ${px(36)}) * ${progress} + ${px(18)})` }} />
        </div>
        <div className="pc-thumb absolute top-2 h-6 w-9 r-12" style={{ left: `calc((100% - ${px(36)}) * ${progress})` }} />
      </div>
      <p className="mt-1 t-11.5 leading-snug text-muted">
        Recommended ${bid}: {bidWhy}.
      </p>
    </div>
  );
}

function MoveFoot() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8.5 items-center gap-2 whitespace-nowrap t-12.5 font-bold text-muted">
        Hide details
        <Icon name="chevron" size={13} stroke={2.6} className="-rotate-90" />
      </span>
      <span className="flex h-8.5 items-center px-2 t-12.5 font-bold text-muted">Roster</span>
      <span className="ml-auto flex items-center gap-2">
        <span className="flex h-8.5 items-center px-2.5 t-13.5 font-bold text-muted">Skip</span>
        <span className="pc-signal flex h-8.5 items-center gap-2 whitespace-nowrap r-17 px-3.5 t-13.5 font-bold tracking-[0.01em]">
          <Icon name="check" size={15} stroke={3} />
          Selected
        </span>
      </span>
    </div>
  );
}

/* On a 390 point phone the card's radius is 27 and its padding 16, so what sits inside takes 11. */
const CARD_R = 27;
const INNER_R = CARD_R - 16;

/** A waiver claim, opened: who comes in, who is cut, and each reason the planner gives for it. */
export function PlaycallerMove() {
  const { add, drop, bid } = CLAIM;
  return (
    <Surface
      w={400}
      brand="playcaller"
      label={`A suggested waiver claim, opened: claim ${add.name} and drop ${drop.name} for a $${bid} bid, worth ${fmt1(CLAIM.total)} lineup points over six weeks, with the reasons listed.`}
      className="pc-field"
    >
      <div className="relative px-4 pt-5">
        <div className="pc-card pc-picked border-b-0 px-4 pb-11 pt-3.5" style={{ borderRadius: `${px(CARD_R)} ${px(CARD_R)} 0 0` }}>
          <MoveHead r={INNER_R} />
          <div className="mt-4">
            <MoveWhy />
          </div>
        </div>
        <div className="pc-fade-down absolute inset-x-0 bottom-0 h-9" />
      </div>
    </Surface>
  );
}

/** The lower half of the same open card: the week by week table behind the gain, and how the bid was sized. */
export function PlaycallerBid() {
  const { add, bid, faabLeft } = CLAIM;
  return (
    <Surface
      w={400}
      brand="playcaller"
      label={`The same claim, further down: ${add.name} and the player he replaces projected week by week, and a recommended bid of $${bid} out of $${faabLeft} with the reason for that size.`}
      className="pc-field"
    >
      <div className="relative px-4 pb-5">
        <div className="pc-card pc-picked border-t-0 px-4 pb-3.5 pt-9" style={{ borderRadius: `0 0 ${px(CARD_R)} ${px(CARD_R)}` }}>
          <div className="flex flex-col gap-4">
            <WeekTable />
            <MoveBid />
          </div>
          <div className="mt-4">
            <MoveFoot />
          </div>
        </div>
        <div className="pc-fade-up absolute inset-x-0 top-0 h-8" />
      </div>
    </Surface>
  );
}

/* ─── Leagues (cards.tsx, `LeagueCard`) ───────────────────────────────────── */

/** src/engine/planner.ts `winProbability`: a normal curve on the gap between the two projections. */
function winProbability(my: number, opp: number) {
  const sd = Math.max(12, 0.17 * ((my + opp) / 2) * Math.SQRT2);
  const z = (my - opp) / sd;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return Math.round((z > 0 ? 1 - p : p) * 100) / 100;
}

function LeagueCard({ l }: { l: League }) {
  const p = winProbability(l.me, l.opp);
  const bar = p >= 0.6 ? "#c8f531" : p >= 0.4 ? "#ffb224" : "#ff4d5e";
  return (
    <div className="pc-card r-27 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <Avatar l={l} size={40} />
        <div className="min-w-0 flex-1">
          <div className="t-15.5 font-semibold leading-snug">{l.name}</div>
          <div className="mt-0.5 t-12 text-muted">
            {l.format} · {l.record} · {l.rank}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {l.picks ? (
              <Chip tone="amber">
                {l.picks} suggestion{l.picks > 1 ? "s" : ""}
              </Chip>
            ) : null}
            {l.autos ? <Chip tone="signal">{l.autos} automatic</Chip> : null}
            {!l.picks && !l.autos ? (
              <Chip tone="volt">
                <Icon name="check" size={12} stroke={3} />
                Set
              </Chip>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex items-baseline gap-3 t-12.5 text-secondary">
          <span className="flex-none whitespace-nowrap">
            <span className={cn(NUM, "t-17 text-ink")}>{fmt1(l.me)}</span> you
          </span>
          <span className="flex min-w-0 flex-1 items-baseline justify-end gap-1.5 text-right">
            <span className="min-w-0 leading-snug">{l.oppName}</span>
            <span className={cn(NUM, "flex-none t-17 text-ink")}>{fmt1(l.opp)}</span>
          </span>
        </div>
        <div className="relative h-1.5 overflow-hidden r-3 bg-[#242830]">
          <span className="absolute inset-y-0 left-0 r-3" style={{ width: `${Math.round(p * 100)}%`, background: bar }} />
        </div>
        <div className="mt-1 t-11.5 text-muted">{Math.round(p * 100)}% to win</div>
      </div>
    </div>
  );
}

/** The league list, part way down: each league's record, what is waiting there and this week's matchup. */
export function PlaycallerLeagues() {
  const list = [LEAGUES.basement, LEAGUES.scaries, LEAGUES.pylon];
  return (
    <Surface
      w={446}
      brand="playcaller"
      label="Playcaller Leagues screen: each league with its format, record and rank, how many suggestions and automatic moves are waiting, and the chance of winning this week's matchup. The floating tab bar is below."
      className="pc-ground-low"
    >
      {/* The phone hangs from above the tile, so the screen starts in the gap over the first card and ends with the list. */}
      <div className="px-5 pb-7">
        <div className="-mt-17">
          <PcPhone>
            <div className="relative px-4 pb-24 pt-18">
              <div className="flex flex-col gap-2.5">
                {list.map((l) => (
                  <LeagueCard key={l.name} l={l} />
                ))}
              </div>
              <Dock active="Leagues" badge={PICK_COUNT} />
            </div>
          </PcPhone>
        </div>
      </div>
    </Surface>
  );
}

/* ─── Activity (src/app/(app)/activity/page.tsx) ──────────────────────────── */

/* `text` is one sentence in the app. It is held as the two phrases it wraps into on a phone, so the break falls between them. */
type Entry = { icon: string; text: [string, string]; league: League; by: "Auto" | "You"; ago: string; gain?: number };

/* The wording is what src/server/execute.ts writes for each result. Auto lineups last ran at 9:00. */
const TODAY: Entry[] = [
  { icon: "swap", text: ["Lineup set: +1.4 pts", "(Jake Ferguson in)"], league: LEAGUES.pylon, by: "Auto", ago: "42m ago", gain: 1.4 },
  { icon: "swap", text: ["Lineup reordered by kickoff", "(same players)"], league: LEAGUES.redzone, by: "Auto", ago: "2h ago" },
  { icon: "plus", text: ["Added Kareem Hunt,", "dropped Justice Hill"], league: LEAGUES.onside, by: "You", ago: "3h ago", gain: 2.6 },
];

function ActivityStat({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <div className="pc-card min-w-0 r-27 px-3.5 py-3">
      <div className={cn(NUM, "whitespace-nowrap t-24 leading-none", tone)}>{value}</div>
      <div className="mt-1.5 whitespace-nowrap t-10 font-bold uppercase tracking-[0.1em] text-muted">{label}</div>
    </div>
  );
}

/** The log: every lineup auto lineups set and every move run by hand, with the points each one added. */
export function PlaycallerActivity() {
  return (
    <Surface
      w={446}
      brand="playcaller"
      label="Playcaller Activity screen: 38.6 points added over the last seven days from 23 moves, 17 of them automatic, then today's log of lineups set and players moved."
      className="pc-ground"
    >
      <div className="h-160 px-5 pt-6">
        <PcPhone>
          <PcStatusBar />
          <div className="px-4 pb-3 pt-3">
            <div className={cn(LABEL, "mb-1")}>Every move, yours and automatic</div>
            <h3 className={cn(DISPLAY, "t-34")}>Activity</h3>
          </div>
          <div className={cn(LABEL, "mx-4 mt-4")}>Last 7 days</div>
          <div className="mx-4 mt-2 grid grid-cols-3 gap-2.5">
            <ActivityStat value="+38.6" label="pts added" tone="text-[#c8f531]" />
            <ActivityStat value="23" label="moves" />
            <ActivityStat value="17" label="automatic" tone="text-accent" />
          </div>
          <div className="mt-6 pb-24">
            <div className={cn(LABEL, "mb-2.5 px-4")}>Today</div>
            <div className="pc-card mx-4 r-27">
              {TODAY.map((x, i) => (
                <div key={x.text[0]} className={cn("flex items-start gap-3 px-4 py-3", i > 0 && "border-t border-line")}>
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center r-11 bg-[rgba(200,245,49,0.13)] text-[#c8f531]">
                    <Icon name={x.icon} size={16} stroke={2.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block t-14.5 font-semibold leading-snug">
                      <span className="whitespace-nowrap">{x.text[0]}</span> <span className="whitespace-nowrap">{x.text[1]}</span>
                    </span>
                    <span className="mt-0.5 block t-12 leading-snug text-muted">
                      {x.league.name}
                      <span className="block whitespace-nowrap">
                        {x.by} · {x.ago}
                      </span>
                    </span>
                  </span>
                  {x.gain ? <span className={cn(NUM, "flex-none t-18 text-[#c8f531]")}>+{fmt1(x.gain)}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </PcPhone>
      </div>
    </Surface>
  );
}

/* ─── Mark ────────────────────────────────────────────────────────────────── */

/** The app icon on the app's field, with the wordmark set the way the header sets it. */
export function PlaycallerMark() {
  return (
    <Surface w={400} brand="playcaller" label="The Playcaller app icon in signal orange, with the Playcaller wordmark." className="pc-field">
      <div className="flex flex-col items-center px-8 pb-13 pt-14">
        <AppIcon size={132} className="pc-icon-glow" />
        <p className={cn(DISPLAY, "mt-8 t-46 tracking-[0.025em] text-ink")}>Playcaller</p>
        <p className="mt-3 t-13 text-muted">Your Sleeper leagues, run for you</p>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "playcaller-moves",
    title: "Moves",
    caption:
      "The home screen. Lineup and IR changes that cost nobody are listed with the points each one gains and run on a timer, every 15 minutes on a game day and hourly otherwise.",
    tile: PlaycallerMoves,
  },
  {
    id: "playcaller-move",
    title: "Waiver claim",
    caption:
      "One suggested claim, opened. Every free agent is tried against every way to make room, and the reasons come from the same numbers: lineup points gained over six weeks, trade market value and who gets cut.",
    tile: PlaycallerMove,
  },
  {
    id: "playcaller-bid",
    title: "Bid sizing",
    caption:
      "Further down the same card. This week is projected from a blend of sportsbook props, game lines, ESPN and Sleeper, and the bid goes above the minimum only when a rival claim is likely and losing the player would cost enough.",
    tile: PlaycallerBid,
  },
  {
    id: "playcaller-leagues",
    title: "Leagues",
    caption:
      "Every league in one list, each scored with its own settings: record, what is waiting there, and the chance of winning the week from the two projected totals.",
    tile: PlaycallerLeagues,
  },
  {
    id: "playcaller-activity",
    title: "Activity",
    caption: "The log of what ran: each lineup auto lineups set, each IR move and each pickup, with the points it added and whether the app or Lucas ran it.",
    tile: PlaycallerActivity,
  },
  {
    id: "playcaller-mark",
    title: "Mark",
    caption: "The app icon: a play diagram in signal orange, with the wordmark in Big Shoulders.",
    tile: PlaycallerMark,
  },
];
