import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Surface } from "./kit";
import type { SurfaceDef } from "./types";
import "./blakey.css";

/*
  Blakey Breakthrough, rebuilt from blakey-breakthrough-dashboard's own screens.

  Colours and type come from its `app/globals.css`: warm off-white, brand
  orange, DM Sans for text, Geist Mono for figures and dates. The status and
  label hues are in `blakey.css`. Cards are 14 pixels round, controls 8,
  buttons and chips are full pills, as in the app.

  The rules below (trend, renewal tier, alert reasons, priority, milestones,
  group stats) are the ones in its `lib/compute.ts`, run on the defaults in
  `lib/thresholds.ts`, so every flag and every order on these screens is
  computed, never typed in.

  Everyone here is invented: the coach, the members, the groups, the cohort
  dates and every figure.
*/

/* ─── icons: lucide, the set the app uses ─────────────────────────────────── */

type IconNode = { p?: string[]; c?: [number, number, number][] };

const ICONS = {
  sun: {
    c: [[12, 12, 4]],
    p: ["M12 2v2", "M12 20v2", "m4.93 4.93 1.41 1.41", "m17.66 17.66 1.41 1.41", "M2 12h2", "M20 12h2", "m6.34 17.66-1.41 1.41", "m19.07 4.93-1.41 1.41"],
  },
  users: {
    c: [[9, 7, 4]],
    p: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M16 3.128a4 4 0 0 1 0 7.744", "M22 21v-2a4 4 0 0 0-3-3.87"],
  },
  circleDot: { c: [[12, 12, 10], [12, 12, 1]] },
  messageSquare: {
    p: ["M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"],
  },
  slidersHorizontal: {
    p: ["M10 5H3", "M12 19H3", "M14 3v4", "M16 17v4", "M21 12h-9", "M21 19h-5", "M21 5h-7", "M8 10v4", "M8 12H3"],
  },
  chevronsLeft: { p: ["m11 17-5-5 5-5", "m18 17-5-5 5-5"] },
  chevronsRight: { p: ["m6 17 5-5-5-5", "m13 17 5-5-5-5"] },
  gauge: { p: ["m12 14 4-4", "M3.34 19a10 10 0 1 1 17.32 0"] },
  dumbbell: {
    p: [
      "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",
      "m2.5 21.5 1.4-1.4",
      "m20.1 3.9 1.4-1.4",
      "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",
      "m9.6 14.4 4.8-4.8",
    ],
  },
  repeat: { p: ["m17 2 4 4-4 4", "M3 11v-1a4 4 0 0 1 4-4h14", "m7 22-4-4 4-4", "M21 13v1a4 4 0 0 1-4 4H3"] },
  moonStar: {
    p: ["M18 5h4", "M20 3v4", "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"],
  },
  moon: { p: ["M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"] },
  clock: { c: [[12, 12, 10]], p: ["M12 6v6l4 2"] },
  trendingDown: { p: ["M16 17h6v-6", "m22 17-8.5-8.5-5 5L2 7"] },
  trendingUp: { p: ["M16 7h6v6", "m22 7-8.5 8.5-5-5L2 17"] },
  siren: {
    p: [
      "M7 18v-6a5 5 0 1 1 10 0v6",
      "M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z",
      "M21 12h1",
      "M18.5 4.5 18 5",
      "M2 12h1",
      "M12 2v1",
      "m4.929 4.929.707.707",
      "M12 12v6",
    ],
  },
  circleHelp: { c: [[12, 12, 10]], p: ["M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"] },
  circleCheck: { c: [[12, 12, 10]], p: ["m9 12 2 2 4-4"] },
  target: { c: [[12, 12, 10], [12, 12, 6], [12, 12, 2]] },
  flame: { p: ["M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"] },
  trophy: {
    p: [
      "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",
      "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",
      "M18 9h1.5a1 1 0 0 0 0-5H18",
      "M4 22h16",
      "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
      "M6 9H4.5a1 1 0 0 1 0-5H6",
    ],
  },
  zap: {
    p: ["M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"],
  },
  send: {
    p: [
      "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      "m21.854 2.147-10.94 10.939",
    ],
  },
  check: { p: ["M20 6 9 17l-5-5"] },
  x: { p: ["M18 6 6 18", "m6 6 12 12"] },
  partyPopper: {
    p: [
      "M5.8 11.3 2 22l10.7-3.79",
      "M4 3h.01",
      "M22 8h.01",
      "M15 2h.01",
      "M22 20h.01",
      "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
      "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",
      "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7",
      "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
    ],
  },
  arrowUp: { p: ["m5 12 7-7 7 7", "M12 19V5"] },
  arrowDown: { p: ["M12 5v14", "m19 12-7 7-7-7"] },
  arrowRight: { p: ["M5 12h14", "m12 5 7 7-7 7"] },
  arrowUpRight: { p: ["M7 7h10v10", "M7 17 17 7"] },
  arrowDownRight: { p: ["m7 7 10 10", "M17 7v10H7"] },
} satisfies Record<string, IconNode>;

type IconName = keyof typeof ICONS;

function Icon({ name, className, sw = 2, style }: { name: IconName; className?: string; sw?: number; style?: CSSProperties }) {
  const node: IconNode = ICONS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      style={style}
    >
      {node.c?.map(([cx, cy, r]) => <circle key={`${cx}-${cy}-${r}`} cx={cx} cy={cy} r={r} />)}
      {node.p?.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

/* ─── the rules: lib/thresholds.ts defaults and lib/compute.ts ────────────── */

const CFG = {
  inactiveYellowDays: 3,
  inactiveRedDays: 7,
  churnCompletionPct: 20,
  onTrackCompletionPct: 30,
  likelyCompletionPct: 40,
  trajectoryDropPts: 25,
  trendDeltaPts: 5,
  expectedWorkoutsPerWeek: 4,
  completionGoodPct: 50,
  completionWarnPct: 25,
  gaugeGoodPct: 40,
  gaugeWarnPct: 15,
  milestoneWorkoutsSmall: 10,
  milestoneWorkoutsLarge: 25,
  milestoneWorkoutsAllTime: 50,
  milestoneStreakWeeks: 3,
} as const;

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "orange" | "violet" | "rose" | "info" | "teal";
type ReasonKind = "inactive_red" | "inactive_yellow" | "trajectory" | "churn_risk";
type Tier = "likely" | "on_track" | "at_risk" | "high_risk";
type Milestone = "workout_10" | "workout_25" | "workout_50_alltime" | "streak_4week";
type LabelId = ReasonKind | Tier | Milestone;
type QueueGroup = "urgent" | "at_risk" | "watch";

/* lib/labels.ts: name, hue and icon per label. The definitions are its tooltip text at the default thresholds. */
const LABELS: Record<LabelId, { name: string; tone: Tone; icon: IconName; definition: string }> = {
  inactive_red: { name: "Inactive", tone: "danger", icon: "moonStar", definition: `No sign-in for ${CFG.inactiveRedDays}+ days, urgent check-in` },
  inactive_yellow: {
    name: "Quiet",
    tone: "warning",
    icon: "clock",
    definition: `No sign-in for ${CFG.inactiveYellowDays} to ${CFG.inactiveRedDays - 1} days, early warning`,
  },
  trajectory: {
    name: "Declining",
    tone: "orange",
    icon: "trendingDown",
    definition: `Weekly completion fell more than ${CFG.trajectoryDropPts} percentage points over the last 3 weeks`,
  },
  churn_risk: { name: "Low completion", tone: "violet", icon: "gauge", definition: `Completion below ${CFG.churnCompletionPct}%, under the churn line` },
  high_risk: { name: "Unlikely to renew", tone: "rose", icon: "siren", definition: "Anyone flagged Inactive or Low completion" },
  at_risk: {
    name: "Renewal uncertain",
    tone: "info",
    icon: "circleHelp",
    definition: `Completion under ${CFG.onTrackCompletionPct}% but clear of the flags, or trending down`,
  },
  on_track: {
    name: "On track to renew",
    tone: "teal",
    icon: "trendingUp",
    definition: `Completion ${CFG.onTrackCompletionPct} to ${CFG.likelyCompletionPct - 1}% and not trending down`,
  },
  likely: { name: "Likely to renew", tone: "success", icon: "circleCheck", definition: `Completion at ${CFG.likelyCompletionPct}%+ and not trending down` },
  workout_10: {
    name: `${CFG.milestoneWorkoutsSmall}th workout of cohort`,
    tone: "warning",
    icon: "target",
    definition: `Hit their ${CFG.milestoneWorkoutsSmall}-workout cohort milestone this week`,
  },
  workout_25: {
    name: `${CFG.milestoneWorkoutsLarge}th workout of cohort`,
    tone: "warning",
    icon: "flame",
    definition: `Hit their ${CFG.milestoneWorkoutsLarge}-workout cohort milestone this week`,
  },
  workout_50_alltime: {
    name: `${CFG.milestoneWorkoutsAllTime}th all-time workout`,
    tone: "warning",
    icon: "trophy",
    definition: `Hit ${CFG.milestoneWorkoutsAllTime} all-time workouts across programs this week`,
  },
  streak_4week: {
    name: `${CFG.milestoneStreakWeeks}-week streak`,
    tone: "warning",
    icon: "zap",
    definition: `${CFG.milestoneStreakWeeks} consecutive on-track weeks`,
  },
};

type Member = {
  first: string;
  last: string;
  group: number;
  returning: boolean;
  /** Completion per cohort week so far, 0 to 100. */
  rates: number[];
  daysInactive: number;
  lastSeen?: string;
  /** Trailing weeks with every scheduled workout done. */
  streak: number;
  allTime?: number;
};

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const completionOf = (m: Member) => Math.round(mean(m.rates));
const weekWorkouts = (rate: number) => Math.round((rate / 100) * CFG.expectedWorkoutsPerWeek);
const workoutsOf = (m: Member) => m.rates.reduce((sum, r) => sum + weekWorkouts(r), 0);

function trendOf(m: Member): "up" | "down" | "neutral" {
  const w = m.rates.slice(-3);
  if (w.length < 2) return "neutral";
  const first = w[0];
  const last = w[w.length - 1];
  if (last > first + CFG.trendDeltaPts) return "up";
  if (last < first - CFG.trendDeltaPts) return "down";
  return "neutral";
}

function tierOf(m: Member): Tier {
  const c = completionOf(m);
  const t = trendOf(m);
  if (c < CFG.churnCompletionPct || m.daysInactive >= CFG.inactiveRedDays) return "high_risk";
  if (c >= CFG.likelyCompletionPct && t !== "down") return "likely";
  if (c >= CFG.onTrackCompletionPct && t !== "down") return "on_track";
  return "at_risk";
}

const SEVERITY: Record<ReasonKind, number> = { inactive_red: 3, churn_risk: 2, trajectory: 1, inactive_yellow: 0 };

function dropOf(m: Member): number | null {
  const w = m.rates.slice(-3);
  if (w.length < 3) return null;
  const drop = w[0] - w[2];
  return drop > CFG.trajectoryDropPts ? drop : null;
}

/** Every reason that applies, most severe first. */
function reasonsOf(m: Member): ReasonKind[] {
  const out: ReasonKind[] = [];
  if (m.daysInactive >= CFG.inactiveRedDays) out.push("inactive_red");
  else if (m.daysInactive >= CFG.inactiveYellowDays) out.push("inactive_yellow");
  if (completionOf(m) < CFG.churnCompletionPct) out.push("churn_risk");
  if (dropOf(m) !== null) out.push("trajectory");
  return out.sort((a, b) => SEVERITY[b] - SEVERITY[a]);
}

/** The dominant reason's base score, plus two for each further reason. */
function priorityOf(m: Member): number {
  const reasons = reasonsOf(m);
  const top = reasons[0];
  if (!top) return 0;
  const base =
    top === "inactive_red"
      ? 100 + m.daysInactive
      : top === "churn_risk"
        ? Math.min(99, 80 + Math.floor((CFG.churnCompletionPct - completionOf(m)) / 2))
        : top === "trajectory"
          ? 60 + Math.min(dropOf(m) ?? 0, 39)
          : Math.min(59, 40 + 3 * m.daysInactive);
  return base + 2 * (reasons.length - 1);
}

function queueGroupOf(m: Member): QueueGroup {
  const top = reasonsOf(m)[0];
  return top === "inactive_red" ? "urgent" : top === "churn_risk" || top === "trajectory" ? "at_risk" : "watch";
}

function milestonesOf(m: Member): Milestone[] {
  const out: Milestone[] = [];
  const total = workoutsOf(m);
  const thisWeek = weekWorkouts(m.rates[m.rates.length - 1] ?? 0);
  const before = total - thisWeek;
  if (total >= CFG.milestoneWorkoutsLarge && before < CFG.milestoneWorkoutsLarge) out.push("workout_25");
  else if (total >= CFG.milestoneWorkoutsSmall && before < CFG.milestoneWorkoutsSmall) out.push("workout_10");
  if (m.allTime !== undefined && m.allTime >= CFG.milestoneWorkoutsAllTime && m.allTime - thisWeek < CFG.milestoneWorkoutsAllTime) {
    out.push("workout_50_alltime");
  }
  if (m.streak === CFG.milestoneStreakWeeks) out.push("streak_4week");
  return out;
}

/** The chips a row shows: reasons, then pending milestones, then the renewal tier (components/shared/message-tags.ts). */
const tagsOf = (m: Member): LabelId[] => [...reasonsOf(m), ...milestonesOf(m), tierOf(m)];

/* components/today/QueueRow.tsx reasonText */
function reasonText(kind: ReasonKind, m: Member): string {
  if (kind === "inactive_red") return `${m.daysInactive} days inactive, last seen ${m.lastSeen}`;
  if (kind === "inactive_yellow") return `${m.daysInactive} days inactive`;
  if (kind === "trajectory") {
    const w = m.rates.slice(-3);
    return `Completion slid ${w[0]}% → ${w[w.length - 1]}% over 3 weeks`;
  }
  return `Completion at ${completionOf(m)}%, below the churn line`;
}

/* lib/thresholds.ts rateColorVar and gaugeColorVar */
const rateVar = (rate: number) =>
  rate >= CFG.completionGoodPct ? "var(--bb-success)" : rate >= CFG.completionWarnPct ? "var(--bb-warning)" : "var(--bb-danger)";
const gaugeVar = (rate: number) =>
  rate >= CFG.gaugeGoodPct ? "var(--bb-success)" : rate >= CFG.gaugeWarnPct ? "var(--bb-warning)" : "var(--bb-danger)";

/* ─── the sample cohort ───────────────────────────────────────────────────── */

const COACH = "Nolan";
const TODAY_LONG = "Friday, November 13";
const TODAY_SHORT = "Nov 13";
const COHORT = { name: "Fall 2026", range: "Sep 21 – Dec 11", week: 8, totalWeeks: 12 };
const PHASE_WEEKS = 3;
const PHASE = Math.ceil(COHORT.week / PHASE_WEEKS);
const TOTAL_PHASES = Math.ceil(COHORT.totalWeeks / PHASE_WEEKS);
const PHASE_START = (PHASE - 1) * PHASE_WEEKS + 1;
const COHORT_BADGE = `${COHORT.name} · Phase ${PHASE} of ${TOTAL_PHASES} · Week ${COHORT.week} of ${COHORT.totalWeeks}`;
const RETURNING = 41;

/* lib/group-colors.ts: golden-angle hues from the brand anchor. */
const hueAt = (i: number) => (62 + i * 137.508) % 360;

/** A group, with the workouts its members logged in each cohort week. Everything shown about it is derived from these. */
type Group = { name: string; size: number; workouts: number[] };

const GROUPS: Group[] = [
  { name: "Atlas", size: 16, workouts: [56, 54, 52, 50, 51, 51, 52, 54] },
  { name: "Cedar", size: 15, workouts: [50, 47, 45, 42, 43, 44, 45, 44] },
  { name: "Ember", size: 17, workouts: [58, 56, 53, 51, 50, 52, 53, 54] },
  { name: "Harbour", size: 16, workouts: [54, 51, 48, 45, 45, 45, 46, 45] },
  { name: "Summit", size: 16, workouts: [55, 53, 50, 47, 47, 48, 50, 52] },
  { name: "Tempo", size: 16, workouts: [53, 50, 48, 45, 45, 44, 46, 47] },
];

const ACTIVE = GROUPS.reduce((s, g) => s + g.size, 0);
const NEW_MEMBERS = ACTIVE - RETURNING;
const WEEKLY_TARGET = ACTIVE * CFG.expectedWorkoutsPerWeek;
const WEEK_TOTALS = Array.from({ length: COHORT.week }, (_, w) => GROUPS.reduce((s, g) => s + g.workouts[w], 0));
const WEEK_RATES = WEEK_TOTALS.map((t) => (100 * t) / WEEKLY_TARGET);
/** The chart's series: mean completion per week. */
const COHORT_WEEKLY = WEEK_RATES.map(Math.round);
const WORKOUTS_TO_DATE = WEEK_TOTALS.reduce((a, b) => a + b, 0);
const WORKOUTS_THIS_WEEK = WEEK_TOTALS[COHORT.week - 1];
const AVG_COMPLETION = Math.round(mean(WEEK_RATES));
const COMPLETION_DELTA = Math.round(WEEK_RATES[COHORT.week - 1] - WEEK_RATES[COHORT.week - 2]);
const PACE = Math.round((WORKOUTS_THIS_WEEK / WEEKLY_TARGET) * 100);

const groupRate = (g: Group, w: number) => (100 * g.workouts[w]) / (g.size * CFG.expectedWorkoutsPerWeek);

/* The members who appear by name. The other members of each group are only counted. */
const DEVON: Member = { first: "Devon", last: "K", group: 5, returning: false, rates: [75, 50, 50, 25, 25, 0, 0, 0], daysInactive: 18, lastSeen: "Oct 26", streak: 0 };
const MARISOL: Member = { first: "Marisol", last: "T", group: 1, returning: false, rates: [50, 25, 25, 25, 0, 25, 0, 0], daysInactive: 11, lastSeen: "Nov 2", streak: 0 };
const CALLUM: Member = { first: "Callum", last: "B", group: 3, returning: true, rates: [100, 75, 75, 75, 50, 50, 25, 0], daysInactive: 8, lastSeen: "Nov 5", streak: 0 };
const INGRID: Member = { first: "Ingrid", last: "V", group: 0, returning: true, rates: [100, 100, 75, 100, 100, 100, 50, 25], daysInactive: 1, streak: 0, allTime: 50 };
const TOBIAS: Member = { first: "Tobias", last: "R", group: 4, returning: true, rates: [100, 100, 100, 100, 100, 100, 75, 50], daysInactive: 1, streak: 0 };
const NAOMI: Member = { first: "Naomi", last: "F", group: 2, returning: false, rates: [75, 75, 50, 75, 75, 75, 75, 50], daysInactive: 5, streak: 0 };
const RAFAEL: Member = { first: "Rafael", last: "C", group: 5, returning: true, rates: [100, 100, 100, 100, 75, 75, 75, 75], daysInactive: 3, streak: 0 };
const JONAH: Member = { first: "Jonah", last: "P", group: 1, returning: true, rates: [100, 100, 75, 75, 75, 100, 100, 100], daysInactive: 0, streak: 3 };
const KEIKO: Member = { first: "Keiko", last: "A", group: 4, returning: false, rates: [75, 75, 75, 75, 75, 75, 100, 100], daysInactive: 0, streak: 2 };
const BIANCA: Member = { first: "Bianca", last: "L", group: 3, returning: false, rates: [25, 25, 25, 25, 25, 25, 50, 75], daysInactive: 0, streak: 0 };

const NAMED: Member[] = [JONAH, KEIKO, INGRID, BIANCA, NAOMI, RAFAEL, TOBIAS, CALLUM, MARISOL, DEVON];

/* computeActionQueue: priority, then lowest completion, then name. */
const QUEUE = NAMED.filter((m) => reasonsOf(m).length > 0).sort(
  (a, b) => priorityOf(b) - priorityOf(a) || completionOf(a) - completionOf(b) || a.last.localeCompare(b.last),
);
const QUEUE_GROUPS: { id: QueueGroup; title: string; dot: string }[] = [
  { id: "urgent", title: "Urgent", dot: "var(--bb-danger)" },
  { id: "at_risk", title: "At Risk", dot: "var(--bb-warning)" },
  { id: "watch", title: "Watch", dot: "color-mix(in oklab, var(--bb-warning) 60%, transparent)" },
];
const queueIn = (g: QueueGroup) => QUEUE.filter((m) => queueGroupOf(m) === g);

const CELEBRATE = NAMED.flatMap((m) => milestonesOf(m).map((milestone) => ({ m, milestone })));

/* computeBriefing: urgent check-ins, then milestones. No group is down enough this week for the third clause. */
const URGENT = queueIn("urgent").length;
const HEADLINE = `${URGENT} urgent check-in${URGENT === 1 ? "" : "s"}, ${CELEBRATE.length} milestone${CELEBRATE.length === 1 ? "" : "s"} to celebrate.`;

const fmt = (n: number) => n.toLocaleString("en-US");

/* ─── small parts ─────────────────────────────────────────────────────────── */

const SHADOW = "shadow-[var(--bb-shadow-sm)]";
const UPPER = "font-semibold uppercase tracking-[0.06em] text-muted";

/** components/ui/pill.tsx */
function Pill({ tone = "neutral", className, style, children }: { tone?: Tone; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <span
      data-tone={tone}
      style={style}
      className={cn(
        "bb-pill inline-flex shrink-0 items-center gap-1 whitespace-nowrap r-99 border px-2 py-0.5 t-10.5 font-semibold leading-[1.45] [&>svg]:size-3",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** components/shared/LabelChip.tsx: the icon and name of a label, in its own hue. */
function LabelChip({ id, className }: { id: LabelId; className?: string }) {
  const def = LABELS[id];
  return (
    <Pill tone={def.tone} className={className}>
      <Icon name={def.icon} />
      {def.name}
    </Pill>
  );
}

const groupInk = (hue: number) => `oklch(0.5 0.2 ${hue})`;

/** components/shared/GroupPill.tsx: the group's hue drives text, fill and border. */
function GroupPill({ group, className }: { group: number; className?: string }) {
  const hue = hueAt(group);
  return (
    <Pill
      className={className}
      style={{ color: groupInk(hue), background: `oklch(0.94 0.04 ${hue})`, borderColor: `oklch(0.89 0.07 ${hue})` }}
    >
      {GROUPS[group].name}
    </Pill>
  );
}

/** components/shared/Sparkline.tsx: one bar per week of the current phase, a stub for weeks not reached. */
function Sparkline({ m, className }: { m: Member; className?: string }) {
  const bars = m.rates.slice(PHASE_START - 1, PHASE_START - 1 + PHASE_WEEKS);
  const W = 44;
  const H = 22;
  const gap = 3;
  const bw = (W - gap * (PHASE_WEEKS - 1)) / PHASE_WEEKS;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("block h-5.5 w-11", className)}>
      {Array.from({ length: PHASE_WEEKS }, (_, i) => {
        const rate = bars[i];
        const x = i * (bw + gap);
        if (rate === undefined) return <rect key={i} x={x} y={H - 2} width={bw} height={2} rx={1} fill="var(--line)" />;
        const h = Math.max((Math.min(rate, 100) / 100) * H, 2);
        return <rect key={i} x={x} y={H - h} width={bw} height={h} rx={2} fill={rateVar(rate)} />;
      })}
    </svg>
  );
}

function SendButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-6.5 shrink-0 items-center gap-1 whitespace-nowrap r-99 bg-accent px-2.5 t-11 font-semibold text-accent-ink", className)}>
      <Icon name="send" className="size-3" />
      {children}
    </span>
  );
}

function DoneButton({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-6.5 shrink-0 items-center gap-1 whitespace-nowrap px-1.5 t-11 font-semibold text-muted", className)}>
      <Icon name="check" className="size-3" />
      Done
    </span>
  );
}

function Completion({ m, className }: { m: Member; className?: string }) {
  const c = completionOf(m);
  return (
    <span className={cn("font-mono font-semibold tabular-nums", className)} style={{ color: rateVar(c) }}>
      {c}%
    </span>
  );
}

/** The mark in its white plate, as components/shell/Sidebar.tsx sets it. */
function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden border border-line bg-white", SHADOW, className)}>
      <Image src="/brand/blakey/mark.svg" alt="" width={64} height={64} unoptimized className="h-full w-full" />
    </span>
  );
}

/* ─── shell ───────────────────────────────────────────────────────────────── */

const NAV: { label: string; icon: IconName }[] = [
  { label: "Today", icon: "sun" },
  { label: "Members", icon: "users" },
  { label: "Groups", icon: "circleDot" },
  { label: "Messaging", icon: "messageSquare" },
  { label: "Tuning", icon: "slidersHorizontal" },
];

/** components/shell/Sidebar.tsx, expanded or as the icon rail. */
function Sidebar({ active, collapsed }: { active: string; collapsed?: boolean }) {
  return (
    <nav className={cn("flex shrink-0 flex-col gap-1 border-r border-line bg-card py-2.5", collapsed ? "w-11 items-center" : "w-48 px-2.5")}>
      <div className={cn("mb-2.5 flex items-center gap-2", !collapsed && "px-1")}>
        <Mark className="size-7 r-7" />
        {!collapsed && <span className="whitespace-nowrap t-12 font-extrabold tracking-tight">Blakey Breakthrough</span>}
      </div>
      {NAV.map((item) => {
        const on = item.label === active;
        return (
          <div
            key={item.label}
            className={cn("relative flex h-8 items-center r-7 text-muted", collapsed ? "w-8 justify-center" : "gap-2.5 px-2.5")}
            style={on ? { background: "var(--bb-primary-subtle)", color: "var(--bb-accent-fg)" } : undefined}
          >
            {on && <span className={cn("absolute top-1/2 h-5 w-0.75 -translate-y-1/2 bg-accent", collapsed ? "-left-1.5" : "left-0")} />}
            <Icon name={item.icon} className="size-4" sw={on ? 2.2 : 1.8} />
            {!collapsed && <span className="t-11.5 font-medium">{item.label}</span>}
          </div>
        );
      })}
      <div className={cn("mt-auto flex h-7.5 items-center text-muted", collapsed ? "justify-center" : "gap-2.5 px-2.5")}>
        <Icon name={collapsed ? "chevronsRight" : "chevronsLeft"} className="size-4" />
        {!collapsed && <span className="t-11 font-medium">Collapse</span>}
      </div>
    </nav>
  );
}

/** components/shell/TopBar.tsx: title, cohort badge, sync stamp, command key, theme. */
function TopBar({ title }: { title: string }) {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-line px-4.5">
      <div className="flex items-center gap-2.5">
        <span className="t-13.5 font-bold tracking-tight">{title}</span>
        <Pill tone="primary" className="font-mono t-9.5">
          {COHORT_BADGE}
        </Pill>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 font-mono t-10 text-muted">
          <span className="size-1.5 r-99" style={{ background: "var(--bb-success)" }} />
          Synced 7:42:10 a.m.
          <span className="text-muted/60">· 8:14:36 a.m.</span>
        </span>
        <span className="r-6 border border-line bg-raised px-1.5 py-0.5 font-mono t-9.5 text-muted">⌘K</span>
        <Icon name="moon" className="size-3.5 text-ink" />
      </div>
    </header>
  );
}

/* ─── today: briefing ─────────────────────────────────────────────────────── */

type Kpi = { label: string; value: string; suffix?: string; sub: string; icon: IconName; color?: string };

const KPIS: Kpi[] = [
  { label: "Active Members", value: fmt(ACTIVE), sub: `Across ${GROUPS.length} groups · ${COHORT.name}`, icon: "users" },
  {
    label: "Avg Completion",
    value: String(AVG_COMPLETION),
    suffix: "%",
    sub: COMPLETION_DELTA === 0 ? "Flat vs last week" : `${COMPLETION_DELTA > 0 ? "↑" : "↓"} ${Math.abs(COMPLETION_DELTA)}% vs last week`,
    icon: "gauge",
    color: rateVar(AVG_COMPLETION),
  },
  { label: "Workouts This Week", value: fmt(WORKOUTS_THIS_WEEK), sub: `Target ${WEEKLY_TARGET} · ${PACE}% of pace`, icon: "dumbbell" },
  { label: "Workouts to Date", value: fmt(WORKOUTS_TO_DATE), sub: "This cohort", icon: "dumbbell" },
  { label: "Returning Members", value: fmt(RETURNING), sub: `${NEW_MEMBERS} new this cohort`, icon: "repeat" },
];

/** components/today/KpiChip.tsx */
function KpiCard({ kpi, tile }: { kpi: Kpi; tile?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden border border-line bg-card", SHADOW, tile ? "r-12 p-3" : "r-12 px-3 py-3.5")}>
      <Icon name={kpi.icon} className={cn("absolute text-muted/25", tile ? "right-3 top-8 size-5" : "right-3 top-8.5 size-5")} />
      <div className={cn("whitespace-nowrap", UPPER, tile ? "t-10" : "t-9")}>{kpi.label}</div>
      <div className={cn("font-extrabold leading-none tracking-[-0.04em]", tile ? "mt-2 t-27" : "mt-2 t-27")} style={kpi.color ? { color: kpi.color } : undefined}>
        {kpi.value}
        {kpi.suffix && <span className={cn("font-bold", tile ? "t-17" : "t-17")}>{kpi.suffix}</span>}
      </div>
      <div className={cn("whitespace-nowrap text-muted", tile ? "mt-1.5 t-10.5" : "mt-1.5 t-9.75")}>{kpi.sub}</div>
    </div>
  );
}

/* ─── today: completion by week ───────────────────────────────────────────── */

/**
 * components/analytics/CompletionChart.tsx: a point for every week reached,
 * its value beside it in the completion colour, the live cohort dashed, and
 * the dashed 80% reference. The app sets every value above its point; here a
 * value under the target sits below its point, so it stays clear of the
 * reference line. Drawn in design pixels: `w` should be close to the width it
 * is laid out at.
 */
function CompletionChart({ w, h, every = 1, className }: { w: number; h: number; every?: number; className?: string }) {
  const m = { l: 36, r: 20, t: 26, b: 22 };
  const pw = w - m.l - m.r;
  const ph = h - m.t - m.b;
  const x = (i: number) => m.l + (i * pw) / (COHORT.totalWeeks - 1);
  const y = (v: number) => m.t + (1 - v / 100) * ph;
  const pts = COHORT_WEEKLY.map((v, i) => [x(i), y(v)] as const);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("block", className)}>
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={m.l} x2={w - m.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray="3 3" />
          <text x={m.l - 7} y={y(v) + 3.5} textAnchor="end" fontSize={10.5} fill="#666">
            {v}%
          </text>
        </g>
      ))}
      {Array.from({ length: COHORT.totalWeeks }, (_, i) =>
        (i + 1) % every === 0 ? (
          <text key={i} x={x(i)} y={h - 6} textAnchor="middle" fontSize={10} fill="#666">
            Wk {i + 1}
          </text>
        ) : null,
      )}
      <line x1={m.l} x2={w - m.r} y1={y(80)} y2={y(80)} stroke="var(--bb-warning)" strokeDasharray="4 4" />
      <text x={w - m.r - 2} y={y(80) + 13} textAnchor="end" fontSize={10.5} fill="var(--bb-warning)">
        80% target
      </text>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="7 5" strokeLinejoin="round" />
      {pts.map(([px, py], i) => (
        <g key={i}>
          <circle cx={px} cy={py} r={4} fill="var(--accent)" stroke="var(--card)" strokeWidth={2} />
          <text
            x={px}
            y={COHORT_WEEKLY[i] < 80 ? py + 17 : py - 9}
            textAnchor="middle"
            fontSize={10.5}
            fontWeight={600}
            fill={rateVar(COHORT_WEEKLY[i])}
            stroke="var(--card)"
            strokeWidth={3}
            paintOrder="stroke"
            style={{ fontFamily: "var(--mono)" }}
          >
            {COHORT_WEEKLY[i]}%
          </text>
        </g>
      ))}
    </svg>
  );
}

function ChartHeader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-line", className)}>
      <span className="font-bold tracking-tight">Avg Completion by Week</span>
      <span className="flex items-center gap-1.5 t-10.5 font-bold text-muted">
        <span className="size-2 r-99 bg-accent" />
        {COHORT.name}
        <span className="size-1.5 r-99" style={{ background: "var(--bb-success)" }} />
      </span>
    </div>
  );
}

/* ─── today: cohort cards ─────────────────────────────────────────────────── */

type CohortCard = { title: string; dates: string; color: string; live?: boolean; rows: [string, string][] };

/* components/today/CohortAnalytics.tsx: the live cohort, then the next two on the schedule. */
const COHORT_CARDS: CohortCard[] = [
  {
    title: COHORT.name,
    dates: `${COHORT.range} · Wk ${COHORT.week}/${COHORT.totalWeeks}`,
    color: "var(--accent)",
    live: true,
    rows: [
      ["Active now", fmt(ACTIVE)],
      ["Returning", fmt(RETURNING)],
      ["New", fmt(NEW_MEMBERS)],
      ["Avg completion", `${AVG_COMPLETION}%`],
      ["Workouts to date", fmt(WORKOUTS_TO_DATE)],
    ],
  },
  {
    title: "Winter 2027",
    dates: "Jan 18 – Apr 9 · Upcoming",
    color: "var(--bb-chart-1)",
    rows: [
      ["Starts", "January 18, 2027"],
      ["Length", "12 weeks"],
      ["Status", "Not started"],
    ],
  },
  {
    title: "Summer 2027",
    dates: "May 24 – Aug 13 · Upcoming",
    color: "var(--bb-success)",
    rows: [
      ["Starts", "May 24, 2027"],
      ["Length", "12 weeks"],
      ["Status", "Not started"],
    ],
  },
];

/** components/analytics/ProgramComparison.tsx */
function ProgramCard({ card, className }: { card: CohortCard; className?: string }) {
  return (
    <div className={cn("overflow-hidden r-12 border border-line bg-card", SHADOW, className)}>
      <div className="h-0.75" style={{ background: card.color }} />
      <div className="border-b border-line px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="t-11.5 font-bold" style={{ color: card.color }}>
            {card.title}
          </span>
          {card.live && (
            <Pill tone="success" className="px-1.5 t-8.5">
              LIVE
            </Pill>
          )}
        </div>
        <p className="mt-0.5 whitespace-nowrap t-10 text-muted">{card.dates}</p>
      </div>
      {card.rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.75 last:border-b-0">
          <span className="t-10.5 text-muted">{label}</span>
          <span className="whitespace-nowrap font-mono t-10.5 font-bold tabular-nums">{value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── action queue ────────────────────────────────────────────────────────── */

const QUEUE_HINT = "j/k navigate · space peek · d done · ? help";

function QueueSection({ group, className }: { group: (typeof QUEUE_GROUPS)[number]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 border-b border-line bg-raised py-1.5", className)}>
      <span className="size-1.75 r-99" style={{ background: group.dot }} />
      <span className={cn("t-10", UPPER)}>
        {group.title} · {queueIn(group.id).length}
      </span>
    </div>
  );
}

/* The focused row: primary-subtle fill and an inset ring, as the first row is on load. */
const FOCUSED: CSSProperties = {
  background: "color-mix(in oklab, var(--bb-primary-subtle) 60%, transparent)",
  boxShadow: "inset 0 0 0 calc(var(--px) * 2) var(--accent)",
};

/** One queue row at tile width: the app's narrow layout (name and actions, then chips and the reason), with the group, phase bars and completion kept. */
function QueueRowTile({ m, focused }: { m: Member; focused?: boolean }) {
  const reasons = reasonsOf(m);
  return (
    <div className="border-b border-line px-3.5 py-2.5" style={focused ? FOCUSED : undefined}>
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap t-14 font-semibold leading-tight">
          {m.first} {m.last}
        </span>
        <GroupPill group={m.group} className="t-10.5" />
        <span className="flex-1" />
        <SendButton>Send DM</SendButton>
        <DoneButton className="-mr-1.5" />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-0.75">
        {tagsOf(m).map((id) => (
          <LabelChip key={id} id={id} className="gap-0.75 px-1.5 t-10.5" />
        ))}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="min-w-0 flex-1 whitespace-nowrap t-11.5 text-muted">{reasonText(reasons[0], m)}</span>
        <Sparkline m={m} className="h-4.5 w-9" />
        <Completion m={m} className="w-9 text-right t-12.5" />
      </div>
    </div>
  );
}

/* components/today/QueueRow.tsx QUEUE_GRID_MD, scaled: member, group, why flagged, phase, completion, actions. */
const QUEUE_GRID =
  "grid grid-cols-[calc(var(--px)*92)_calc(var(--px)*68)_minmax(0,1fr)_calc(var(--px)*40)_calc(var(--px)*66)_calc(var(--px)*142)] items-center gap-x-2.5";

function QueueRowFull({ m, focused }: { m: Member; focused?: boolean }) {
  const reasons = reasonsOf(m);
  return (
    <div className={cn(QUEUE_GRID, "border-b border-line px-4 py-2.5")} style={focused ? FOCUSED : undefined}>
      <span className="truncate t-12.5 font-semibold">
        {m.first} {m.last}
      </span>
      <span className="flex min-w-0">
        <GroupPill group={m.group} className="t-10" />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1">
          {tagsOf(m).map((id) => (
            <LabelChip key={id} id={id} className="t-10 px-1.75" />
          ))}
        </div>
        <span className="mt-1 block truncate t-10.5 text-muted">{reasonText(reasons[0], m)}</span>
      </div>
      <Sparkline m={m} className="h-4.5 w-9" />
      <Completion m={m} className="text-right t-11.5" />
      <div className="flex items-center justify-end gap-1">
        <SendButton className="h-6 t-10.5">Send DM</SendButton>
        <DoneButton className="h-6 t-10.5" />
      </div>
    </div>
  );
}

/** components/today/ActionQueue.tsx at full width: header, column labels, then Urgent, At Risk and Watch. */
function ActionQueueFull({ className, limit }: { className?: string; limit?: number }) {
  /* With a limit the card is the top of the queue running off the bottom of the screen: it stops after a whole row. */
  const shown = limit === undefined ? QUEUE : QUEUE.slice(0, limit);
  return (
    <section
      className={cn(
        "overflow-hidden border border-line bg-card",
        limit === undefined ? "r-12" : "rounded-t-[calc(var(--px)*12)] border-b-0",
        SHADOW,
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="t-12.5 font-bold tracking-tight">Action Queue</span>
        <span className="font-mono t-9.5 text-muted">{QUEUE_HINT}</span>
      </header>
      <div className={cn(QUEUE_GRID, "border-b border-line bg-raised/60 px-4 py-1.5")}>
        {["Member", "Group", "Why flagged", "Phase", "Completion", ""].map((label, i) => (
          <span key={label || "actions"} className={cn("t-8.5", UPPER, i === 4 && "text-right")}>
            {label}
          </span>
        ))}
      </div>
      {QUEUE_GROUPS.filter((group) => queueIn(group.id).some((m) => shown.includes(m))).map((group) => (
        <div key={group.id}>
          <QueueSection group={group} className="px-4 [&>span:last-child]:t-8.5" />
          {queueIn(group.id)
            .filter((m) => shown.includes(m))
            .map((m) => (
              <QueueRowFull key={m.first} m={m} focused={m === QUEUE[0]} />
            ))}
        </div>
      ))}
    </section>
  );
}

/* components/today/CelebrateQueue.tsx grid, scaled: member, group, tags, achieved, actions. */
const CELEBRATE_GRID =
  "grid grid-cols-[calc(var(--px)*92)_calc(var(--px)*68)_minmax(0,1fr)_calc(var(--px)*56)_calc(var(--px)*176)] items-center gap-x-2.5";

/** components/today/CelebrateQueue.tsx: this week's milestones, kept apart from the problems, in gold. */
function CelebrateFull() {
  return (
    <section className={cn("overflow-hidden r-12 border border-line bg-card", SHADOW)}>
      <header className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="flex items-center gap-1.5 t-12.5 font-bold tracking-tight">
          <Icon name="partyPopper" className="size-3.5 text-[var(--bb-warning)]" />
          Celebrate
        </span>
        <span className="t-10.5 text-muted">Milestones hit this week, send a personal congrats</span>
      </header>
      <div className={cn(CELEBRATE_GRID, "border-b border-line bg-raised/60 px-4 py-1.5")}>
        {["Member", "Group", "Tags", "Achieved", ""].map((label) => (
          <span key={label || "actions"} className={cn("t-8.5", UPPER)}>
            {label}
          </span>
        ))}
      </div>
      {CELEBRATE.map(({ m, milestone }) => {
        const tags = tagsOf(m);
        const ordered = [milestone, ...tags.filter((t) => t !== milestone)];
        return (
          <div
            key={`${m.first}-${milestone}`}
            className={cn(CELEBRATE_GRID, "relative border-b border-line px-4 py-2.5 last:border-b-0")}
            style={{ background: "color-mix(in oklab, var(--bb-warning-bg) 50%, transparent)" }}
          >
            <span className="absolute inset-y-0 left-0 w-0.75" style={{ background: "var(--bb-warning)" }} />
            <span className="truncate t-12.5 font-semibold">
              {m.first} {m.last}
            </span>
            <span className="flex min-w-0">
              <GroupPill group={m.group} className="t-10" />
            </span>
            <span className="flex min-w-0 flex-wrap items-center gap-1">
              {ordered.map((id) => (
                <LabelChip key={id} id={id} className="t-10 px-1.75" />
              ))}
            </span>
            <span className="font-mono t-10.5 text-muted">{TODAY_SHORT}</span>
            <div className="flex items-center justify-end gap-1">
              <SendButton className="h-6 t-10.5">Send Congrats</SendButton>
              <DoneButton className="h-6 t-10.5" />
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ─── groups ──────────────────────────────────────────────────────────────── */

/** components/groups/GroupCard.tsx gauge: this week's completion as a ring from twelve o'clock. */
function Gauge({ rate, className, textClass }: { rate: number; className?: string; textClass?: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative shrink-0", className)}>
      <svg viewBox="0 0 86 86" className="block h-full w-full">
        <circle cx={43} cy={43} r={r} fill="none" stroke="var(--raised)" strokeWidth={12} />
        <circle
          cx={43}
          cy={43}
          r={r}
          fill="none"
          stroke={gaugeVar(rate)}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${(c * rate) / 100} ${c}`}
          transform="rotate(-90 43 43)"
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center font-mono font-bold tabular-nums", textClass)}>{rate}%</span>
    </div>
  );
}

function GroupDelta({ delta, className }: { delta: number; className?: string }) {
  const color = delta > 0 ? "var(--bb-success)" : delta < 0 ? "var(--bb-danger)" : "var(--muted)";
  return (
    <span className={cn("inline-flex items-center gap-0.5 whitespace-nowrap font-semibold", className)} style={{ color }}>
      <Icon name={delta > 0 ? "arrowUp" : delta < 0 ? "arrowDown" : "arrowRight"} className="size-3" />
      {Math.abs(delta)}% vs last wk
    </span>
  );
}

/** components/groups/GroupCard.tsx: name in the group's hue, the gauge, workouts this week, the change, and a bar per week. */
function GroupCard({ index, tile }: { index: number; tile?: boolean }) {
  const g = GROUPS[index];
  const last = COHORT.week - 1;
  const rate = Math.round(groupRate(g, last));
  const delta = Math.round(groupRate(g, last) - groupRate(g, last - 1));
  const bars = (
    <div className={cn("flex items-end gap-0.75", tile ? "mt-2 h-6" : "mt-2.5 h-7.5")}>
      {g.workouts.map((_, w) => {
        const wr = groupRate(g, w);
        return <div key={w} className="flex-1 rounded-t-[calc(var(--px)*3)]" style={{ height: `${Math.max(8, wr)}%`, background: gaugeVar(wr) }} />;
      })}
    </div>
  );
  return (
    <div className={cn("border border-line bg-card", SHADOW, tile ? "r-12 p-3" : "r-12 p-4")}>
      <div className="flex items-start justify-between">
        <div>
          <div className={cn("font-extrabold leading-tight tracking-tight", tile ? "t-15" : "t-15.5")} style={{ color: groupInk(hueAt(index)) }}>
            {g.name}
          </div>
          <div className={cn("text-muted", tile ? "mt-0.5 t-10.5" : "mt-0.5 t-11")}>{g.size} members</div>
        </div>
        <Gauge rate={rate} className={tile ? "size-13.5" : "size-17"} textClass={tile ? "t-10.5" : "t-11.5"} />
      </div>
      {tile ? (
        <div className="mt-1.5 t-10.5 text-muted">
          <div>
            Workouts this week <span className="font-mono font-bold tabular-nums text-ink">{g.workouts[last]}</span>
          </div>
          <GroupDelta delta={delta} className="mt-0.5" />
        </div>
      ) : (
        <div className="mt-2 flex items-end justify-between gap-2 t-11 text-muted">
          <span>
            Workouts this week <span className="font-mono font-bold tabular-nums text-ink">{g.workouts[last]}</span>
          </span>
          <GroupDelta delta={delta} />
        </div>
      )}
      {bars}
    </div>
  );
}

/* ─── member ──────────────────────────────────────────────────────────────── */

/* components/shared/pulse.ts: the five-step completion scale of the cohort strip. */
function pulseColor(rate: number | undefined): string {
  if (rate === undefined) return "color-mix(in oklab, var(--raised) 70%, transparent)";
  if (rate >= 85) return "var(--bb-success)";
  if (rate >= 70) return "color-mix(in oklab, var(--bb-success) 55%, transparent)";
  if (rate >= 55) return "color-mix(in oklab, var(--bb-warning) 80%, transparent)";
  if (rate >= 40) return "color-mix(in oklab, var(--bb-warning) 50%, transparent)";
  return "color-mix(in oklab, var(--bb-danger) 85%, transparent)";
}

/* ─── the screens ─────────────────────────────────────────────────────────── */

/** Today, as a fragment: the greeting, two of the stat cards and the completion chart. */
export function BlakeyToday() {
  return (
    <Surface
      w={400}
      brand="blakey"
      label={`Blakey Breakthrough Today screen: average completion ${AVG_COMPLETION}%, ${WORKOUTS_THIS_WEEK} workouts this week, and a chart of average completion by week against an 80% target.`}
      className="bg-ground"
    >
      <div className="flex flex-col gap-3 p-3.5">
        <section className={cn("bb-hero r-14 border border-line p-3.5", SHADOW)}>
          <p className="t-15 font-extrabold leading-tight tracking-tight">
            Good morning, {COACH} <span className="ml-1 font-bold text-ink/60">{TODAY_LONG}</span>
          </p>
          <p className="mt-1 t-11.5 font-medium text-ink/90">{HEADLINE}</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <KpiCard kpi={KPIS[1]} tile />
            <KpiCard kpi={KPIS[2]} tile />
          </div>
        </section>
        <section className={cn("overflow-hidden r-14 border border-line bg-card", SHADOW)}>
          <ChartHeader className="px-3.5 py-2.5 t-12.5" />
          <div className="px-1.5 pb-1.5 pt-1">
            <CompletionChart w={366} h={214} every={2} className="h-auto w-full" />
          </div>
        </section>
      </div>
    </Surface>
  );
}

/** Today, whole: the sidebar as its icon rail, top bar, briefing, cohort cards, the chart, and the Urgent section of the queue. */
export function BlakeyTodayFull() {
  return (
    <Surface
      w={960}
      brand="blakey"
      label={`Blakey Breakthrough Today screen for a ${ACTIVE} member cohort in week ${COHORT.week} of ${COHORT.totalWeeks}: five stat cards, the live cohort card, average completion by week against an 80% target, and the action queue.`}
      className="bg-ground"
    >
      <div className="flex">
        <Sidebar active="Today" collapsed />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar title="Today" />
          <div className="flex flex-col gap-4 px-4 pt-4">
            <section className={cn("bb-hero r-14 border border-line p-4", SHADOW)}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="whitespace-nowrap t-16 font-extrabold tracking-tight">
                  Good morning, {COACH} <span className="ml-1.5 font-bold text-ink/60">{TODAY_LONG}</span>
                </p>
                <span className="whitespace-nowrap font-mono t-10 text-muted">
                  {COHORT_BADGE} · {COHORT.range}
                </span>
              </div>
              <p className="mt-1 t-12 font-medium text-ink/90">{HEADLINE}</p>
              <div className="mt-3.5 grid grid-cols-5 gap-3">
                {KPIS.map((kpi) => (
                  <KpiCard key={kpi.label} kpi={kpi} />
                ))}
              </div>
            </section>

            <div className="grid grid-cols-[minmax(0,10fr)_minmax(0,12fr)] gap-4">
              <div className="grid grid-cols-2 gap-4">
                <ProgramCard card={COHORT_CARDS[0]} className="col-span-2" />
                <ProgramCard card={COHORT_CARDS[1]} />
                <ProgramCard card={COHORT_CARDS[2]} />
              </div>
              <section className={cn("flex flex-col overflow-hidden r-12 border border-line bg-card", SHADOW)}>
                <ChartHeader className="px-4 py-2.5 t-12.5" />
                <div className="relative min-h-0 flex-1">
                  <CompletionChart w={396} h={300} className="absolute inset-0 h-full w-full" />
                </div>
              </section>
            </div>

            <ActionQueueFull limit={queueIn("urgent").length} />
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** The action queue as a tile: Urgent and At Risk, every row whole. */
export function BlakeyQueue() {
  const urgent = queueIn("urgent");
  const atRisk = queueIn("at_risk");
  return (
    <Surface
      w={440}
      brand="blakey"
      label="Blakey Breakthrough action queue: members who need a check-in, most urgent first, each with the flags that put them there, completion, and Send DM and Done."
      className="bg-card"
    >
      <div className="[&>div:last-child]:border-b-0">
        <header className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
          <span className="t-14 font-bold tracking-tight">Action Queue</span>
          <span className="whitespace-nowrap font-mono t-10.5 text-muted">j/k navigate · d done</span>
        </header>
        <QueueSection group={QUEUE_GROUPS[0]} className="px-3.5" />
        {urgent.map((m) => (
          <QueueRowTile key={m.first} m={m} focused={m === QUEUE[0]} />
        ))}
        <QueueSection group={QUEUE_GROUPS[1]} className="px-3.5" />
        {atRisk.map((m) => (
          <QueueRowTile key={m.first} m={m} />
        ))}
      </div>
    </Surface>
  );
}

/** The queue whole, with the Celebrate list under it, as they sit on Today. */
export function BlakeyQueueFull() {
  return (
    <Surface
      w={960}
      brand="blakey"
      label={`Blakey Breakthrough action queue with ${QUEUE.length} members in Urgent, At Risk and Watch, and the Celebrate list of ${CELEBRATE.length} milestones hit this week.`}
      className="bg-ground"
    >
      <div className="flex flex-col gap-4 p-5">
        <ActionQueueFull />
        <CelebrateFull />
      </div>
    </Surface>
  );
}

/** One member, as the peek sheet shows her: the stats, the current phase, the cohort strip, and each flag with its rule. */
export function BlakeyMember() {
  const m = INGRID;
  const reasons = reasonsOf(m);
  const tier = tierOf(m);
  const trend = trendOf(m);
  const phase = m.rates.slice(PHASE_START - 1, PHASE_START - 1 + PHASE_WEEKS);
  const why: { id: LabelId; text: string }[] = [
    ...reasons.map((r) => ({ id: r as LabelId, text: reasonText(r, m) })),
    ...milestonesOf(m).map((id) => ({ id: id as LabelId, text: LABELS[id].definition })),
    { id: tier, text: LABELS[tier].definition },
  ];
  const stats: [string, ReactNode][] = [
    ["Workouts", workoutsOf(m)],
    ["Completion", `${completionOf(m)}%`],
    ["Streak", m.streak > 0 ? `${m.streak}w` : <span className="inline-block h-0.5 w-3 bg-current align-middle" />],
    ["Last active", m.daysInactive === 0 ? "Today" : `${m.daysInactive}d ago`],
  ];
  return (
    <Surface
      w={400}
      brand="blakey"
      label={`Blakey Breakthrough member view for an invented member: ${completionOf(m)}% completion over ${COHORT.week} weeks, flagged Declining after weekly completion fell from ${phase.length ? m.rates[m.rates.length - 3] : 0}% to ${m.rates[m.rates.length - 1]}% in three weeks.`}
      className="bg-card"
    >
      <div className="flex flex-col gap-4 p-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="t-18 font-extrabold tracking-tight">
              {m.first} {m.last}
            </span>
            <span className="flex size-6 items-center justify-center r-99 bg-raised text-ink">
              <Icon name="x" className="size-3.5" />
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <GroupPill group={m.group} className="px-1.75" />
            <Pill tone={m.returning ? "success" : "neutral"} className="px-1.75">
              {m.returning ? "Returning" : "New"}
            </Pill>
            <LabelChip id={tier} className="px-1.75" />
            {reasons.map((r) => (
              <LabelChip key={r} id={r} className="px-1.75" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 overflow-hidden r-12 border border-line">
          {stats.map(([label, value], i) => (
            <div key={label} className={cn("flex flex-col items-center gap-0.5 bg-raised/30 px-1 py-2.5 text-center", i < 3 && "border-r border-line")}>
              <span className="whitespace-nowrap font-mono t-15 font-bold leading-[1.3] tabular-nums">{value}</span>
              <span className={cn("whitespace-nowrap t-10", UPPER)}>{label}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className={cn("t-10", UPPER)}>Phase {PHASE}</span>
            <Icon
              name={trend === "up" ? "arrowUpRight" : trend === "down" ? "arrowDownRight" : "arrowRight"}
              className="size-3.5"
              sw={2.2}
              style={{ color: trend === "up" ? "var(--bb-success)" : trend === "down" ? "var(--bb-danger)" : "var(--muted)" }}
            />
          </div>
          <div className="flex h-16 items-end">
            {phase.map((rate, i) => (
              <div key={i} className="flex h-full flex-1 items-end justify-center">
                <div className="w-4/5 rounded-t-[calc(var(--px)*3)]" style={{ height: `${(rate / 60) * 100}%`, background: rateVar(rate) }} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex">
            {phase.map((_, i) => (
              <span key={i} className="flex-1 text-center t-10 text-[#666]">
                Wk {PHASE_START + i}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className={cn("mb-2 t-10", UPPER)}>Cohort weeks</div>
          <div className="flex gap-1">
            {Array.from({ length: COHORT.totalWeeks }, (_, w) => (
              <div key={w} className="h-4.5 flex-1 r-3" style={{ background: pulseColor(m.rates[w]) }} />
            ))}
          </div>
        </div>

        <div>
          <div className={cn("mb-2 t-10", UPPER)}>Why flagged</div>
          <div className="flex flex-col gap-2">
            {why.map(({ id, text }) => (
              <div key={id}>
                <LabelChip id={id} />
                <p className="mt-1 whitespace-nowrap t-10.5 leading-[1.35] text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** Groups as a tile: all six cards, two across. */
export function BlakeyGroups() {
  return (
    <Surface
      w={420}
      brand="blakey"
      label="Blakey Breakthrough groups: six training groups, each with this week's completion gauge, workouts this week, the change from last week and a bar per cohort week."
      className="bg-ground"
    >
      <div className="grid grid-cols-2 gap-2.5 p-3.5">
        {GROUPS.map((g, i) => (
          <GroupCard key={g.name} index={i} tile />
        ))}
      </div>
    </Surface>
  );
}

/** The Groups screen, with the sidebar collapsed to its rail. */
export function BlakeyGroupsFull() {
  return (
    <Surface
      w={900}
      brand="blakey"
      label="Blakey Breakthrough Groups screen: six group cards with completion gauges, workouts this week, week over week change and weekly bars."
      className="bg-ground"
    >
      <div className="flex">
        <Sidebar active="Groups" collapsed />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar title="Groups" />
          <div className="grid grid-cols-3 gap-4 p-5">
            {GROUPS.map((g, i) => (
              <GroupCard key={g.name} index={i} />
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** The BB mark in its white plate, with the name as the sidebar sets it and the label from the sign-in card. */
export function BlakeyMark() {
  return (
    <Surface w={400} brand="blakey" label="The Blakey Breakthrough BB mark above the product name." className="bg-ground">
      <div className="flex flex-col items-center px-8 py-13">
        <Mark className="size-28 r-24" />
        <p className="mt-6 t-28 font-extrabold leading-none tracking-tight">Blakey Breakthrough</p>
        <p className="mt-3 t-11 font-semibold uppercase tracking-[0.12em] text-muted">Coach Dashboard</p>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "blakey-today",
    title: "Today",
    caption:
      "The coach's morning read: how much of the scheduled training got done this week, and where the cohort's weekly completion sits against the 80% target. The completion figures are means of each member's weekly completion rate, synced from Trainerize.",
    tile: BlakeyToday,
    full: BlakeyTodayFull,
  },
  {
    id: "blakey-queue",
    title: "Action queue",
    caption:
      "Members who need a message, ordered by a priority score: a week without a sign-in scores highest, then low completion and three-week slides, then shorter quiet spells. Each row shows the flags that put it there and sends the matching message.",
    tile: BlakeyQueue,
    full: BlakeyQueueFull,
  },
  {
    id: "blakey-member",
    title: "Member peek",
    caption:
      "One member's cohort so far: workouts, completion week by week, the current three-week phase, and each flag beside the rule that raised it. This member averages 81% and is still flagged, because her weekly completion fell from 100% to 25% in three weeks.",
    tile: BlakeyMember,
  },
  {
    id: "blakey-groups",
    title: "Groups",
    caption:
      "Each training group's completion this week, the change from last week and its history by week. A group's figure is the mean of its members' weekly rates.",
    tile: BlakeyGroups,
    full: BlakeyGroupsFull,
  },
  {
    id: "blakey-mark",
    title: "Mark",
    caption: "The BB mark and the name as the sidebar sets them, in DM Sans on the dashboard's warm white.",
    tile: BlakeyMark,
  },
];
