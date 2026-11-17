import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Surface } from "./kit";
import type { SurfaceDef } from "./types";
import "./glue.css";

/*
  GLUE Index, rebuilt from glue-index's own screens.

  The look is its app/globals.css: ledger paper, bottle-green ink for what a
  player added, red ink for what he gave back, one highlighter. Sofia Sans
  Extra Condensed for names and figures, Sofia Sans for text, Sometype Mono for
  numbers. The pages are text and bars, with no headshots, so none are added.

  Nothing here is invented. Every row is copied from the site's public JSON as
  it stood on 2026-11-11:
    - the night of 2026-11-10, from /data/latest.json
    - the 2025-26 season, from /data/season-2025-26.json
    - the 2026-27 value view, from /data/season-2026-27.json (salaries pulled 2026-11-11)
    - Toumani Camara's page, from /player/1641739
  `v` is the raw count per component and `c` the weighted z-score it produced,
  both in the order of COMPONENTS, exactly as scripts/build-data.ts writes them.
  Sums, bar widths and strip scales are computed below the way the site's
  components compute them.
*/

/* ─── lib/formula.ts ────────────────────────────────────────────────────── */

type Component = { label: string; short: string; weight: number; side: "credit" | "debit" };

const COMPONENTS: Component[] = [
  { label: "Steals", short: "STL", weight: 1.0, side: "credit" },
  { label: "Recovered blocks", short: "RBK", weight: 1.0, side: "credit" },
  { label: "Offensive fouls drawn", short: "OFD", weight: 0.9, side: "credit" },
  { label: "Offensive rebounds", short: "ORB", weight: 0.8, side: "credit" },
  { label: "Threes made", short: "3PM", weight: 0.7, side: "credit" },
  { label: "Free throws made", short: "FTM", weight: 0.4, side: "credit" },
  { label: "Loose ball fouls drawn", short: "LBD", weight: 0.4, side: "credit" },
  { label: "Live-ball turnovers", short: "LTO", weight: -1.1, side: "debit" },
  { label: "Usage rate", short: "USG", weight: -1.1, side: "debit" },
  { label: "Bad fouls", short: "BDF", weight: -0.8, side: "debit" },
  { label: "Offensive fouls committed", short: "OFC", weight: -0.5, side: "debit" },
  { label: "Missed free throws", short: "MFT", weight: -0.3, side: "debit" },
  { label: "Shots blocked", short: "BKD", weight: -0.3, side: "debit" },
  { label: "Loose ball fouls committed", short: "LBC", weight: -0.3, side: "debit" },
];
const USAGE_INDEX = 8;
const ACRONYM = "Gritty, Low-Usage, Errorless";
const CREDIT_INDEXES = COMPONENTS.flatMap((c, i) => (c.side === "credit" ? [i] : []));
const DEBIT_INDEXES = COMPONENTS.flatMap((c, i) => (c.side === "debit" ? [i] : []));
const ORDER = [...CREDIT_INDEXES, ...DEBIT_INDEXES];

/* ─── lib/format.ts ─────────────────────────────────────────────────────── */

function signed(x: number, places = 2) {
  const fixed = Math.abs(x).toFixed(places);
  if (Number(fixed) === 0) return fixed;
  return (x < 0 ? "−" : "+") + fixed;
}

const count = (x: number) => Math.round(x).toLocaleString("en-US");
const componentValue = (i: number, value: number) => (i === USAGE_INDEX ? value.toFixed(1) : String(value));

/** Sum of the contributions that helped and the ones that hurt. */
function split(c: number[]) {
  let up = 0;
  let down = 0;
  for (const x of c) {
    if (x > 0) up += x;
    else down += x;
  }
  return { up, down };
}

/** components/Strip.tsx: one shared scale for a list of strips, so rows compare by eye. */
function stripScale(lines: { c: number[] }[]) {
  let max = 1;
  for (const l of lines) {
    const { up, down } = split(l.c);
    max = Math.max(max, up, -down);
  }
  return max;
}

/* ─── the night of 2026-11-10: /data/latest.json ────────────────────────── */

type Line = {
  rank: number;
  name: string;
  team: string;
  opp?: string;
  home?: boolean;
  pts?: number;
  reb?: number;
  ast?: number;
  min: number;
  gp: number;
  glue: number;
  v: number[];
  c: number[];
};

const NIGHT = {
  title: "Tuesday, November 10",
  year: "2026",
  short: "Tue, Nov 10",
  players: 106,
  /* lib/format.ts dateRange: one year when both ends share it. */
  baseline: { games: 3000, range: "Apr 10 to Nov 10, 2026" },
  /* Away side first, as the scores strip prints them. */
  games: [
    { away: "MIL", awayPts: 85, home: "NYK", homePts: 117 },
    { away: "BOS", awayPts: 123, home: "PHI", homePts: 101 },
    { away: "LAC", awayPts: 110, home: "PHX", homePts: 133 },
    { away: "MIA", awayPts: 115, home: "UTA", homePts: 109 },
    { away: "ORL", awayPts: 107, home: "SAC", homePts: 100 },
    { away: "OKC", awayPts: 103, home: "POR", homePts: 123 },
  ],
};

/* Ranks 1 to 10 of 106, then the last three. */
const NIGHT_LINES: Line[] = [
  { rank: 1, name: "Davion Mitchell", team: "MIA", opp: "UTA", home: false, pts: 19, reb: 5, ast: 8, min: 37.7, gp: 1, glue: 6.11,
    v: [2, 0, 2, 1, 3, 6, 1, 1, 20.65, 1, 0, 2, 0, 0],
    c: [1.033, -0.503, 3.599, -0.151, 0.686, 0.601, 0.759, -0.067, -0.165, 0.238, 0.209, -0.437, 0.195, 0.116] },
  { rank: 2, name: "Wendell Carter Jr.", team: "ORL", opp: "SAC", home: false, pts: 8, reb: 11, ast: 1, min: 32.5, gp: 1, glue: 5.19,
    v: [1, 2, 1, 3, 0, 0, 0, 0, 12.5, 2, 0, 0, 1, 1],
    c: [0.074, 2.648, 1.617, 0.936, -0.681, -0.342, -0.151, 0.928, 1.031, -0.478, 0.209, 0.188, -0.196, -0.591] },
  { rank: 3, name: "Miles McBride", team: "NYK", opp: "MIL", home: true, pts: 8, reb: 0, ast: 3, min: 25.4, gp: 1, glue: 4.14,
    v: [1, 0, 1, 0, 2, 0, 0, 0, 10.53, 0, 0, 0, 0, 0],
    c: [0.074, -0.503, 1.617, -0.694, 0.23, -0.342, -0.151, 0.928, 1.32, 0.954, 0.209, 0.188, 0.195, 0.116] },
  { rank: 4, name: "Bam Adebayo", team: "MIA", opp: "UTA", home: false, pts: 11, reb: 8, ast: 4, min: 37.1, gp: 1, glue: 3.77,
    v: [3, 1, 0, 0, 0, 9, 2, 0, 15.56, 2, 0, 3, 1, 1],
    c: [1.991, 1.072, -0.365, -0.694, -0.681, 1.073, 1.669, 0.928, 0.582, -0.478, 0.209, -0.749, -0.196, -0.591] },
  { rank: 5, name: "Hugo González", team: "BOS", opp: "PHI", home: false, pts: 10, reb: 2, ast: 2, min: 19.1, gp: 1, glue: 3.76,
    v: [3, 1, 0, 0, 2, 0, 0, 1, 16.67, 0, 0, 0, 0, 0],
    c: [1.991, 1.072, -0.365, -0.694, 0.23, -0.342, -0.151, -0.067, 0.419, 0.954, 0.209, 0.188, 0.195, 0.116] },
  { rank: 6, name: "Mikal Bridges", team: "NYK", opp: "MIL", home: true, pts: 4, reb: 5, ast: 1, min: 17.3, gp: 1, glue: 3.75,
    v: [3, 0, 0, 2, 0, 0, 0, 0, 13.95, 0, 0, 0, 0, 0],
    c: [1.991, -0.503, -0.365, 0.393, -0.681, -0.342, -0.151, 0.928, 0.818, 0.954, 0.209, 0.188, 0.195, 0.116] },
  { rank: 7, name: "Dylan Cardwell", team: "SAC", opp: "ORL", home: true, pts: 1, reb: 11, ast: 1, min: 29.3, gp: 1, glue: 3.73,
    v: [2, 2, 0, 2, 0, 1, 1, 1, 10.77, 0, 2, 0, 1, 0],
    c: [1.033, 2.648, -0.365, 0.393, -0.681, -0.185, 0.759, -0.067, 1.285, 0.954, -2.156, 0.188, -0.196, 0.116] },
  { rank: 8, name: "Toumani Camara", team: "POR", opp: "OKC", home: true, pts: 12, reb: 3, ast: 3, min: 30.2, gp: 1, glue: 3.67,
    v: [0, 0, 1, 3, 2, 4, 0, 0, 15.07, 1, 0, 0, 1, 0],
    c: [-0.884, -0.503, 1.617, 0.936, 0.23, 0.287, -0.151, 0.928, 0.654, 0.238, 0.209, 0.188, -0.196, 0.116] },
  { rank: 9, name: "Gradey Dick", team: "LAC", opp: "PHX", home: false, pts: 10, reb: 3, ast: 2, min: 19.2, gp: 1, glue: 3.6,
    v: [1, 0, 1, 2, 1, 1, 0, 0, 19.57, 0, 0, 0, 0, 0],
    c: [0.074, -0.503, 1.617, 0.393, -0.225, -0.185, -0.151, 0.928, -0.006, 0.954, 0.209, 0.188, 0.195, 0.116] },
  { rank: 10, name: "Dean Wade", team: "PHI", opp: "BOS", home: true, pts: 8, reb: 9, ast: 0, min: 22.5, gp: 1, glue: 3.18,
    v: [0, 0, 0, 2, 2, 0, 1, 0, 10.64, 0, 0, 0, 0, 0],
    c: [-0.884, -0.503, -0.365, 0.393, 0.23, -0.342, 0.759, 0.928, 1.304, 0.954, 0.209, 0.188, 0.195, 0.116] },
  { rank: 104, name: "Giannis Antetokounmpo", team: "MIA", opp: "UTA", home: false, pts: 30, reb: 11, ast: 4, min: 30.6, gp: 1, glue: -5.05,
    v: [0, 0, 0, 2, 1, 5, 0, 0, 33.33, 1, 1, 4, 3, 0],
    c: [-0.884, -0.503, -0.365, 0.393, -0.225, 0.444, -0.151, 0.928, -2.025, 0.238, -0.973, -1.061, -0.98, 0.116] },
  { rank: 105, name: "Jaime Jaquez Jr.", team: "MIL", opp: "NYK", home: false, pts: 16, reb: 5, ast: 3, min: 24.9, gp: 1, glue: -5.31,
    v: [1, 0, 0, 2, 2, 2, 0, 3, 33.33, 3, 0, 0, 1, 0],
    c: [0.074, -0.503, -0.365, 0.393, 0.23, -0.028, -0.151, -2.057, -2.025, -1.194, 0.209, 0.188, -0.196, 0.116] },
  { rank: 106, name: "Darryn Peterson", team: "UTA", opp: "MIA", home: true, pts: 25, reb: 4, ast: 4, min: 31, gp: 1, glue: -5.85,
    v: [1, 0, 0, 1, 4, 1, 0, 1, 33.78, 3, 2, 1, 1, 0],
    c: [0.074, -0.503, -0.365, -0.151, 1.142, -0.185, -0.151, -0.067, -2.091, -1.194, -2.156, -0.124, -0.196, 0.116] },
];

const NIGHT_LEADER = NIGHT_LINES[0];
const NIGHT_RUNNERS = NIGHT_LINES.slice(1, 10);
const NIGHT_LAST = NIGHT_LINES.slice(10);

/* ─── the 2025-26 season: /data/season-2025-26.json ─────────────────────── */

const SEASON = { season: "2025-26", players: 279, minMinutes: 1000 };

/* Ranks 1 to 14 of 279. */
const SEASON_LINES: Line[] = [
  { rank: 1, name: "Toumani Camara", team: "POR", min: 2731.2, gp: 82, glue: 8.45,
    v: [93, 22, 87, 129, 219, 97, 19, 100, 16.27, 134, 7, 40, 44, 15],
    c: [1.344, 0.126, 7.048, 0.737, 1.404, -0.158, 0.413, -1.187, 0.718, -1.59, 0.067, -0.035, -0.198, -0.24] },
  { rank: 2, name: "Derrick White", team: "BOS", min: 2625, gp: 77, glue: 6.5,
    v: [88, 58, 29, 86, 209, 184, 9, 90, 21.97, 79, 2, 20, 28, 5],
    c: [1.142, 2.232, 1.859, 0.116, 1.289, 0.177, -0.023, -0.883, -0.419, 0.103, 0.444, 0.19, 0.074, 0.201] },
  { rank: 3, name: "Mikal Bridges", team: "NYK", min: 2691.9, gp: 82, glue: 5.66,
    v: [107, 38, 20, 79, 156, 81, 6, 51, 17.44, 92, 2, 17, 17, 12],
    c: [1.909, 1.062, 1.054, 0.015, 0.679, -0.22, -0.154, 0.303, 0.485, -0.297, 0.444, 0.224, 0.261, -0.108] },
  { rank: 4, name: "Nickeil Alexander-Walker", team: "ATL", min: 2603.2, gp: 78, glue: 5.63,
    v: [102, 25, 60, 52, 251, 277, 14, 103, 23.42, 116, 5, 30, 53, 11],
    c: [1.707, 0.301, 4.633, -0.375, 1.772, 0.535, 0.195, -1.278, -0.709, -1.036, 0.218, 0.078, -0.351, -0.064] },
  { rank: 5, name: "Donovan Clingan", team: "POR", min: 2093.6, gp: 77, glue: 5.27,
    v: [44, 78, 4, 347, 84, 138, 37, 47, 16.64, 137, 10, 65, 41, 28],
    c: [-0.635, 3.402, -0.377, 3.886, -0.15, 0, 1.198, 0.424, 0.644, -1.683, -0.159, -0.317, -0.147, -0.813] },
  { rank: 6, name: "Keon Ellis", team: "CLE", min: 1478.6, gp: 72, glue: 5.23,
    v: [83, 26, 26, 38, 91, 51, 8, 26, 13.16, 91, 2, 19, 3, 7],
    c: [0.94, 0.36, 1.591, -0.578, -0.069, -0.336, -0.067, 1.063, 1.339, -0.266, 0.444, 0.201, 0.5, 0.113] },
  { rank: 7, name: "Luguentz Dort", team: "OKC", min: 1848.7, gp: 69, glue: 5.08,
    v: [63, 20, 43, 56, 128, 44, 12, 25, 14.17, 102, 7, 14, 13, 15],
    c: [0.132, 0.009, 3.112, -0.318, 0.357, -0.362, 0.108, 1.093, 1.137, -0.605, 0.067, 0.258, 0.33, -0.24] },
  { rank: 8, name: "Moussa Diabaté", team: "CHA", min: 1899, gp: 73, glue: 4.98,
    v: [56, 40, 4, 273, 1, 116, 61, 29, 11.46, 89, 10, 60, 38, 43],
    c: [-0.151, 1.179, -0.377, 2.817, -1.105, -0.085, 2.244, 0.972, 1.678, -0.205, -0.159, -0.26, -0.096, -1.474] },
  { rank: 9, name: "Mitchell Robinson", team: "NYK", min: 1174.5, gp: 60, glue: 4.91,
    v: [56, 43, 2, 252, 0, 42, 16, 19, 10.46, 91, 10, 61, 10, 7],
    c: [-0.151, 1.354, -0.556, 2.513, -1.117, -0.37, 0.282, 1.276, 1.877, -0.266, -0.159, -0.272, 0.381, 0.113] },
  { rank: 10, name: "Jordan Goodwin", team: "PHX", min: 1571.8, gp: 70, glue: 4.89,
    v: [106, 7, 17, 138, 112, 39, 11, 39, 17.08, 74, 3, 17, 30, 6],
    c: [1.868, -0.752, 0.786, 0.867, 0.172, -0.382, 0.064, 0.668, 0.556, 0.257, 0.368, 0.224, 0.04, 0.157] },
  { rank: 11, name: "Victor Wembanyama", team: "SAS", min: 1865.6, gp: 64, glue: 4.84,
    v: [66, 123, 9, 130, 122, 372, 40, 88, 32.37, 86, 17, 78, 33, 14],
    c: [0.253, 6.034, 0.07, 0.751, 0.287, 0.901, 1.328, -0.822, -2.494, -0.112, -0.687, -0.463, -0.011, -0.196] },
  { rank: 12, name: "Collin Gillespie", team: "PHX", min: 2281.8, gp: 80, glue: 4.82,
    v: [99, 9, 26, 89, 232, 76, 8, 81, 18.61, 76, 3, 11, 25, 4],
    c: [1.586, -0.635, 1.591, 0.159, 1.554, -0.239, -0.067, -0.609, 0.251, 0.196, 0.368, 0.292, 0.125, 0.245] },
  { rank: 13, name: "Ausar Thompson", team: "DET", min: 1895.6, gp: 73, glue: 4.82,
    v: [145, 42, 13, 150, 6, 109, 16, 64, 17.14, 94, 5, 82, 42, 13],
    c: [3.443, 1.296, 0.428, 1.04, -1.048, -0.112, 0.282, -0.092, 0.544, -0.359, 0.218, -0.508, -0.164, -0.152] },
  { rank: 14, name: "Donte DiVincenzo", team: "MIN", min: 2494, gp: 82, glue: 4.74,
    v: [104, 18, 28, 67, 244, 78, 10, 79, 16.73, 103, 7, 27, 11, 10],
    c: [1.788, -0.108, 1.77, -0.159, 1.692, -0.232, 0.021, -0.548, 0.626, -0.636, 0.067, 0.111, 0.364, -0.02] },
];

/*
  components/BoardTable.tsx scales its strips to the widest row on the whole
  board. Over all 279 rows of the 2025-26 file that is 11.857.
*/
const SEASON_TABLE_SCALE = 11.857;
const SEASON_LEADER = SEASON_LINES[0];

/* ─── the 2026-27 value view: /data/season-2026-27.json ─────────────────── */

/*
  app/season/[season]/value/page.tsx keeps players with a positive score and a
  listed contract, and ranks them by GLUE per $1M of this season's salary. Over
  the 2026-27 file that is 124 players, with 3 qualified players unlisted.
  `overall` is the rank on the full board. `up` and `down` are the sums of the
  contributions that helped and hurt, and the strips share the widest of the
  124 rows, 12.782, as components/ValueTable.tsx scales them.
*/
type ValueLine = { rank: number; overall: number; name: string; team: string; min: number; glue: number; up: number; down: number; salary: number; aav: number };

const VALUE = { season: "2026-27", players: 124, unlisted: 3, asOf: "Nov 11, 2026", scale: 12.782 };

const VALUE_LINES: ValueLine[] = [
  { rank: 1, overall: 2, name: "Matisse Thybulle", team: "LAL", min: 294.4, glue: 6.59, up: 7.872, down: -1.282, salary: 2449421, aav: 2449421 },
  { rank: 2, overall: 6, name: "Jaylen Wells", team: "MEM", min: 269.6, glue: 5.03, up: 6.443, down: -1.415, salary: 2296271, aav: 2391633 },
  { rank: 3, overall: 7, name: "Ryan Kalkbrenner", team: "CHA", min: 206.5, glue: 5.01, up: 8.518, down: -3.504, salary: 2411090, aav: 2557563 },
  { rank: 4, overall: 10, name: "Moussa Diabaté", team: "CHA", min: 258.6, glue: 4.76, up: 7.992, down: -3.233, salary: 2461462, aav: 2461462 },
  { rank: 5, overall: 13, name: "Jamal Shead", team: "TOR", min: 242.5, glue: 4.26, up: 7.287, down: -3.031, salary: 2296271, aav: 6574068 },
  { rank: 6, overall: 16, name: "Baylor Scheierman", team: "BOS", min: 219.7, glue: 3.83, up: 5.736, down: -1.909, salary: 2744040, aav: 3848517 },
  { rank: 7, overall: 20, name: "Trey Lyles", team: "MIN", min: 203.1, glue: 3.39, up: 4.874, down: -1.481, salary: 2449421, aav: 2449421 },
  { rank: 8, overall: 27, name: "Ziaire Williams", team: "LAL", min: 221.3, glue: 3.06, up: 4.924, down: -1.862, salary: 2449421, aav: 2449421 },
  { rank: 9, overall: 12, name: "Ja'Kobe Walter", team: "TOR", min: 295.8, glue: 4.48, up: 6.043, down: -1.556, salary: 3811800, aav: 4840986 },
  { rank: 10, overall: 29, name: "Sidy Cissoko", team: "POR", min: 225, glue: 2.88, up: 5.404, down: -2.523, salary: 2497812, aav: 2497812 },
  { rank: 11, overall: 35, name: "Ryan Dunn", team: "PHX", min: 176, glue: 2.75, up: 4.747, down: -2.0, salary: 2784240, aav: 3904897 },
  { rank: 12, overall: 55, name: "Sion James", team: "CHA", min: 280.8, glue: 2.07, up: 4.158, down: -2.087, salary: 2411090, aav: 2557563 },
  { rank: 13, overall: 26, name: "Miles McBride", team: "NYK", min: 180.7, glue: 3.12, up: 4.78, down: -1.665, salary: 3956523, aav: 3956523 },
  { rank: 14, overall: 65, name: "Tyrese Proctor", team: "CLE", min: 164.7, glue: 1.61, up: 4.806, down: -3.195, salary: 2150917, aav: 2470839 },
];

/* lib/format.ts money, and the ratio the value page sorts by. */
const money = (x: number) => `$${(x / 1e6).toFixed(1)}M`;
const perMillion = (l: ValueLine) => l.glue / (l.salary / 1e6);

/* ─── Toumani Camara: /player/1641739 ───────────────────────────────────── */

const PLAYER = {
  name: "Toumani Camara",
  sub: "POR · 4 qualified seasons, 2023-24 to 2026-27",
  deal: "$18.1M this season, $20.3M a year on his deal",
  figures: [
    { label: "Career GLUE", value: 22.31, note: "rank 44 of 1,146" },
    { label: "Per season", value: 7.44, note: "over 3 completed seasons" },
    { label: "Best season", value: 10.54, note: "2024-25" },
    { label: "This season", value: 2.89, note: "rank 28 of 253, in progress" },
  ],
  seasons: [
    { season: "2023-24", glue: 3.32, inProgress: false },
    { season: "2024-25", glue: 10.54, inProgress: false },
    { season: "2025-26", glue: 8.45, inProgress: false },
    { season: "2026-27", glue: 2.89, inProgress: true },
  ],
};

/* ─── shared pieces ─────────────────────────────────────────────────────── */

/* --line-strong and --debit in app/globals.css. Credit green is the accent token. */
const STRONG = "border-[rgb(20_32_27/0.24)]";
const STRONG_BG = "bg-[rgb(20_32_27/0.24)]";
const DEBIT = "text-[#b3261e]";
const DEBIT_BG = "bg-[#b3261e]";
/* The site underlines every link to a player, a night or a season with the strong rule colour. */
const LINK =
  "underline decoration-[rgb(20_32_27/0.24)] underline-offset-[calc(var(--px)*3)] [text-decoration-thickness:max(1px,calc(var(--px)*1))]";

const px = (n: number) => `calc(var(--px) * ${n})`;

/** The mark as app/layout.tsx draws it: two credits right of the axis, one debit left. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("shrink-0", className)}>
      <rect x="10" y="2" width="9" height="4" fill="#1b5e4b" />
      <rect x="10" y="8" width="5" height="4" fill="#1b5e4b" />
      <rect x="3" y="14" width="7" height="4" fill="#b3261e" />
    </svg>
  );
}

const Meta = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("font-mono t-12 leading-[1.35] text-muted", className)}>{children}</p>
);

/** The site header: mark, wordmark, the acronym, and the four sections. */
function SiteHeader({ current }: { current: "Nights" | "Seasons" | "Careers" | "Method" }) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-line px-6">
      <span className="flex items-center gap-2">
        <Mark className="h-5 w-5" />
        <span className="font-display t-28 font-semibold leading-none tracking-[0.02em]">GLUE</span>
        <span className="ml-1 whitespace-nowrap t-13 text-muted">{ACRONYM}</span>
      </span>
      <span className="flex gap-1 t-15">
        {(["Nights", "Seasons", "Careers", "Method"] as const).map((l) => (
          <span
            key={l}
            className={cn(
              "flex h-8 items-center px-3",
              l === current ? "font-medium text-ink shadow-[inset_0_calc(var(--px)*-2)_0_var(--ink)]" : "text-secondary"
            )}
          >
            {l}
          </span>
        ))}
      </span>
    </div>
  );
}

/* Icons from lucide, the set the product uses, at its 1.5 stroke. */
const Icon = ({ d, className }: { d: string[]; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
  >
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
);
const CHEVRON_LEFT = ["m15 18-6-6 6-6"];
const CHEVRON_RIGHT = ["m9 18 6-6-6-6"];
const CHEVRON_DOWN = ["m6 9 6 6 6-6"];
const ARROW_DOWN = ["M12 5v14", "m19 12-7 7-7-7"];
const SEARCH = ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "m21 21-4.34-4.34"];

/** components/Pickers.tsx: step back, jump, step forward. An arrow with nowhere to go is dimmed. */
function Picker({ value, prevDisabled, nextDisabled }: { value: string; prevDisabled?: boolean; nextDisabled?: boolean }) {
  const step = cn("grid h-9 w-9 place-items-center r-8 border bg-card text-secondary", STRONG);
  return (
    <span className="flex shrink-0 items-center gap-1">
      <span className={cn(step, prevDisabled && "opacity-35")}>
        <Icon d={CHEVRON_LEFT} className="h-4 w-4" />
      </span>
      <span className={cn("flex h-9 items-center gap-6 r-8 border bg-card pl-3 pr-2 font-mono t-13", STRONG)}>
        {value}
        <Icon d={CHEVRON_DOWN} className="h-4 w-4 text-secondary" />
      </span>
      <span className={cn(step, nextDisabled && "opacity-35")}>
        <Icon d={CHEVRON_RIGHT} className="h-4 w-4" />
      </span>
    </span>
  );
}

/* ─── the ledger: components/Ledger.tsx ─────────────────────────────────── */

type LedgerSize = {
  /** Grid columns: label, count, the hurt and helped track, the signed contribution. */
  cols: string;
  row: string;
  head: string;
  text: string;
  num: string;
  small: string;
  gap: string;
  total: string;
};

const LEDGER_FULL: LedgerSize = {
  cols: "grid-cols-[calc(var(--px)*178)_calc(var(--px)*40)_minmax(0,1fr)_calc(var(--px)*56)] gap-x-4",
  row: "h-8",
  head: "h-8",
  text: "t-14",
  num: "t-13",
  small: "t-12",
  gap: "mt-4",
  total: "mt-4 h-11 t-15",
};

const LEDGER_TILE: LedgerSize = {
  cols: "grid-cols-[minmax(0,1fr)_calc(var(--px)*34)_calc(var(--px)*104)_calc(var(--px)*50)] gap-x-2.5",
  row: "h-6.5",
  head: "h-7",
  text: "t-12.5",
  num: "t-12",
  small: "t-10.5",
  gap: "mt-3",
  total: "mt-3 h-10 t-14",
};

const LEDGER_LARGE: LedgerSize = {
  cols: "grid-cols-[minmax(0,1fr)_calc(var(--px)*36)_calc(var(--px)*84)_calc(var(--px)*54)] gap-x-2.5",
  row: "h-7",
  head: "h-7.5",
  text: "t-13.5",
  num: "t-12.5",
  small: "t-10.5",
  gap: "mt-3.5",
  total: "mt-3.5 h-11 t-15",
};

/**
 * A score written out as a two-ink ledger: seven credits, seven debits, each
 * row with its raw count and what it moved the score by. Bars share one scale,
 * the largest contribution in the ledger, and fill half the track at most.
 */
function Ledger({ v, c, glue, size }: { v: number[]; c: number[]; glue: number; size: LedgerSize }) {
  const scale = Math.max(1, ...c.map(Math.abs));
  const sum = (indexes: number[]) => indexes.reduce((a, i) => a + c[i], 0);

  const group = (title: string, indexes: number[], first: boolean) => (
    <div className={cn(!first && size.gap)}>
      <div className={cn("grid items-center border-b font-medium", STRONG, size.cols, size.head, size.num)}>
        <span>{title}</span>
        <span className={cn("text-right font-mono font-normal text-muted", size.small)}>Count</span>
        <span className={cn("whitespace-nowrap text-center font-mono font-normal text-muted", size.small)}>
          Hurt · Helped
        </span>
        <span className="text-right font-mono font-normal tnum">{signed(sum(indexes))}</span>
      </div>
      {indexes.map((i) => {
        const value = c[i];
        const width = `${(Math.abs(value) / scale) * 50}%`;
        return (
          <div key={COMPONENTS[i].short} className={cn("grid items-center border-b border-line text-secondary", size.cols, size.row, size.text)}>
            <span className="truncate">{COMPONENTS[i].label}</span>
            <span className={cn("text-right font-mono text-ink tnum", size.num)}>{componentValue(i, v[i])}</span>
            <span className="relative self-stretch">
              <span className={cn("absolute inset-y-0 left-1/2 w-px", STRONG_BG)} />
              <span
                className={cn("absolute top-1/2 h-2 -translate-y-1/2", value < 0 ? cn("right-1/2", DEBIT_BG) : "left-1/2 bg-accent")}
                style={{ width }}
              />
            </span>
            <span className={cn("text-right font-mono tnum", size.num, value < 0 ? DEBIT : "text-accent")}>{signed(value)}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="leading-none">
      {group("Credits", CREDIT_INDEXES, true)}
      {group("Debits", DEBIT_INDEXES, false)}
      <div className={cn("glue-total flex items-center justify-between font-medium", size.total)}>
        <span>GLUE</span>
        <span className="font-mono tnum">{signed(glue)}</span>
      </div>
    </div>
  );
}

/** components/Strip.tsx: what hurt drawn left in red, what helped drawn right in green. */
function Strip({ c, sums, scale, className }: { c?: number[]; sums?: { up: number; down: number }; scale: number; className?: string }) {
  const { up, down } = sums ?? split(c ?? []);
  const pct = (x: number) => `${Math.min(100, (Math.abs(x) / scale) * 100)}%`;
  return (
    <span className={cn("relative grid h-4 shrink-0 grid-cols-2 items-center", className)}>
      <span className={cn("h-2 justify-self-end", DEBIT_BG)} style={{ width: pct(down) }} />
      <span className="h-2 bg-accent" style={{ width: pct(up) }} />
      <span className={cn("absolute inset-y-0 left-1/2 w-px", STRONG_BG)} />
    </span>
  );
}

const where = (l: Line) => (l.opp ? `${l.team} ${l.home ? "vs" : "at"} ${l.opp}` : l.team);

/** The leader's card head from components/Lead.tsx: rank, the highlighted name, the line, the score. */
function LeadHead({ line, context, name, figure, className }: { line: Line; context: string; name: string; figure: string; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <Meta>Rank {line.rank}</Meta>
        <p className={cn("mt-1 whitespace-nowrap font-display font-medium leading-none", name)}>
          <span className="glue-hl glue-hl-pad">{line.name}</span>
        </p>
        <p className="mt-2 t-14 leading-[1.4] text-secondary">{context}</p>
      </div>
      <div className="grid shrink-0 justify-items-end gap-1">
        <Meta>GLUE</Meta>
        <span className={cn("font-display font-medium leading-[0.9] text-accent tnum", figure)}>{signed(line.glue)}</span>
      </div>
    </div>
  );
}

const nightContext = (l: Line) => `${where(l)} · ${Math.round(l.min)} min · ${l.pts} pts, ${l.reb} reb, ${l.ast} ast`;

/* ─── nights: components/NightView.tsx, Lead.tsx ────────────────────────── */

function Runners({ title, lines, scale }: { title: string; lines: Line[]; scale: number }) {
  return (
    <div>
      <p className="t-15 font-medium leading-[1.6]">{title}</p>
      <div className={cn("mt-2 border-t", STRONG)}>
        {lines.map((l) => (
          <div
            key={l.rank}
            className="grid h-13 grid-cols-[calc(var(--px)*24)_minmax(0,1fr)_calc(var(--px)*88)_calc(var(--px)*56)] items-center gap-x-3 border-b border-line"
          >
            <span className="text-right font-mono t-13 text-muted tnum">{l.rank}</span>
            <span className="grid min-w-0 leading-[1.35]">
              <span className={cn("w-fit max-w-full truncate t-15 font-medium", LINK)}>
                {l.name}
              </span>
              <span className="t-13 text-muted">{where(l)}</span>
            </span>
            <Strip c={l.c} scale={scale} />
            <span className={cn("text-right font-mono t-14 tnum", l.glue < 0 && DEBIT)}>{signed(l.glue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The home page: the latest night with its scores, the leader's ledger, the next nine and the bottom three. */
export function GlueNightFull() {
  const scale = stripScale(NIGHT_LINES);
  return (
    <Surface
      w={960}
      brand="glue"
      label={`GLUE Index, ${NIGHT.title}, ${NIGHT.year}: ${NIGHT_LEADER.name} leads the night at ${signed(NIGHT_LEADER.glue)}, with his ledger of seven credits and seven debits, the next nine players and the bottom three.`}
      className="bg-ground"
    >
      <SiteHeader current="Nights" />
      <div className="px-6 pb-9 pt-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Meta>Glue guys of the night</Meta>
            <p className="mt-1 font-display t-64 font-medium leading-none tracking-[-0.01em]">
              {NIGHT.title} <span className="font-normal text-muted">{NIGHT.year}</span>
            </p>
            <p className="mt-2 t-15 leading-[1.6] text-secondary">
              {NIGHT.games.length} games · {NIGHT.players} players at 15+ minutes ·{" "}
              <span className="whitespace-nowrap">
                scored against {count(NIGHT.baseline.games)} player-games, {NIGHT.baseline.range}
              </span>
            </p>
          </div>
          <Picker value={NIGHT.short} nextDisabled />
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-y border-line py-3 font-mono t-12 leading-[1.65] text-muted tnum">
          {NIGHT.games.map((g) => (
            <span key={g.home} className="flex gap-2">
              <span className={cn(g.awayPts > g.homePts && "text-ink")}>
                {g.away} {g.awayPts}
              </span>
              <span className={cn(g.homePts > g.awayPts && "text-ink")}>
                {g.home} {g.homePts}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-start gap-7">
          <div className="r-12 border border-line bg-card p-6">
            <LeadHead line={NIGHT_LEADER} context={nightContext(NIGHT_LEADER)} name="t-48" figure="t-72" className="mb-6" />
            <Ledger v={NIGHT_LEADER.v} c={NIGHT_LEADER.c} glue={NIGHT_LEADER.glue} size={LEDGER_FULL} />
          </div>
          <div className="grid gap-8 pt-6">
            <Runners title="Next nine" lines={NIGHT_RUNNERS} scale={scale} />
            <Runners title="Bottom three" lines={NIGHT_LAST} scale={scale} />
          </div>
        </div>
      </div>
    </Surface>
  );
}

/** The night's lead as a fragment: the leader's card, with the whole ledger under his name. */
export function GlueNight() {
  return (
    <Surface
      w={440}
      brand="glue"
      label={`GLUE Index, ${NIGHT.short}: ${NIGHT_LEADER.name} ranks first at ${signed(NIGHT_LEADER.glue)}. His ledger lists seven credits and seven debits with each count and what it moved his score by.`}
      className="bg-ground"
    >
      <div className="px-3.5 pb-4 pt-3.5">
        <div className="flex items-baseline justify-between px-1 pb-2.5">
          <Meta className="t-11">Glue guys of the night</Meta>
          <Meta className="t-11">{NIGHT.short}</Meta>
        </div>
        <div className="r-12 border border-line bg-card px-4 pb-2 pt-4">
          <LeadHead line={NIGHT_LEADER} context={nightContext(NIGHT_LEADER)} name="t-38" figure="t-52" className="mb-3.5" />
          <Ledger v={NIGHT_LEADER.v} c={NIGHT_LEADER.c} glue={NIGHT_LEADER.glue} size={LEDGER_TILE} />
        </div>
      </div>
    </Surface>
  );
}

/* ─── one ledger: the worked example on app/method/page.tsx ─────────────── */

/** A season's ledger alone: the 2025-26 leader, the one the method page works through. */
export function GlueLedger() {
  const l = SEASON_LEADER;
  return (
    <Surface
      w={400}
      brand="glue"
      label={`${l.name}'s ${SEASON.season} ledger: fourteen rows, each with a raw count and a weighted z-score, adding up to ${signed(l.glue)}.`}
      className="bg-card"
    >
      <div className="px-5 pb-3 pt-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-display t-30 font-medium leading-none">{l.name}</p>
            <Meta className="mt-1.5 t-11">
              {l.team} · {SEASON.season} · rank {l.rank} of {SEASON.players}
            </Meta>
          </div>
          <Meta className="t-11">{count(l.min)} min</Meta>
        </div>
        <Ledger v={l.v} c={l.c} glue={l.glue} size={LEDGER_LARGE} />
      </div>
    </Surface>
  );
}

/* ─── seasons: app/season/[season]/page.tsx, components/BoardTable.tsx ──── */

/** components/SeasonHead.tsx: the label, the season as the title, and the line under it. */
function SeasonHead({ label, season, inProgress, title, sub, children }: { label: string; season: string; inProgress?: boolean; title: string; sub: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <Meta>{label}</Meta>
      <p className={cn("mt-1 whitespace-nowrap font-display font-medium leading-none tracking-[-0.01em]", title)}>
        {season}
        {inProgress && <span className="font-normal text-muted"> in progress</span>}
      </p>
      <p className={cn("mt-2 leading-[1.6] text-secondary", sub)}>{children}</p>
    </div>
  );
}

const SEASON_SUB = `${SEASON.players} players at ${count(SEASON.minMinutes)}+ minutes`;

/** The Everyone, Stars and Value switch. Value is offered only for a season that has contract data. */
function Views({ current, value, size, className }: { current: "Everyone" | "Stars" | "Value"; value?: boolean; size: string; className?: string }) {
  const views = value ? ["Everyone", "Stars", "Value"] : ["Everyone", "Stars"];
  return (
    <div className={cn("flex", className)}>
      {views.map((v, i) => (
        <span
          key={v}
          className={cn(
            "flex items-center border leading-none",
            size,
            i === 0 && "rounded-l-[calc(var(--px)*8)]",
            i === views.length - 1 && "rounded-r-[calc(var(--px)*8)]",
            i > 0 && "border-l-0",
            v === current ? "border-ink bg-ink text-ground" : cn("bg-card text-secondary", STRONG)
          )}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

const SearchBox = ({ className }: { className?: string }) => (
  <span className={cn("flex h-9 items-center gap-2 r-8 border bg-card px-3 t-15 text-muted", STRONG, className)}>
    <Icon d={SEARCH} className="h-4 w-4" />
    Search
  </span>
);

/** The season page's table: every counted column for each qualified player, sorted by GLUE. */
export function GlueSeasonFull() {
  const cell = "pr-1.5 text-right font-mono tnum";
  const start = cn("border-l border-line");
  const isStart = (n: number) => n === 0 || n === CREDIT_INDEXES.length;
  return (
    <Surface
      w={960}
      brand="glue"
      label={`GLUE Index ${SEASON.season} season leaderboard: the top fourteen of ${SEASON.players} qualified players with games, minutes, GLUE and all fourteen component counts. ${SEASON_LEADER.name} leads at ${signed(SEASON_LEADER.glue)}.`}
      className="bg-ground"
    >
      <SiteHeader current="Seasons" />
      <div className="px-5 pb-8 pt-8">
        <div className="flex items-end justify-between gap-6 px-1">
          <SeasonHead label="Season leaderboard" season={SEASON.season} title="t-64" sub="t-15">
            {SEASON_SUB}
          </SeasonHead>
          <Picker value={SEASON.season} />
        </div>
        <Views current="Everyone" size="h-9 px-3 t-15" className="mt-4 px-1" />

        <div className="mt-7 flex items-center justify-between px-1">
          <p className="t-15 font-medium">Every qualified player</p>
          <SearchBox className="w-60" />
        </div>

        <div className="mt-3 overflow-hidden r-12 border border-line bg-card t-13 leading-none">
          <div className="glue-board h-8 font-sans t-13 font-medium">
            <span className="col-span-7" />
            <span className={cn("col-span-7 flex h-full items-center pl-3 text-accent", start)}>Credits</span>
            <span className={cn("col-span-7 flex h-full items-center pl-3", DEBIT, start)}>Debits</span>
          </div>
          <div className={cn("glue-board h-8 border-b font-mono t-12 text-muted", STRONG)}>
            <span className="pr-2 text-right">#</span>
            <span className="font-sans t-14">Player</span>
            <span className="font-sans t-13">Team</span>
            <span className="pr-1.5 text-right">GP</span>
            <span className="pr-1.5 text-right">Min</span>
            <span className="flex items-center justify-end gap-1 pr-1.5 text-ink">
              GLUE
              <Icon d={ARROW_DOWN} className="h-3 w-3" />
            </span>
            <span />
            {ORDER.map((i, n) => (
              <span key={i} className={cn("flex h-full items-center justify-end pr-1.5 t-11.5", isStart(n) && start)}>
                {COMPONENTS[i].short}
              </span>
            ))}
          </div>
          {SEASON_LINES.map((l, r) => (
            <div key={l.rank} className={cn("glue-board h-9", r < SEASON_LINES.length - 1 && "border-b border-line")}>
              <span className="pr-2 text-right font-mono text-muted tnum">{l.rank}</span>
              <span className="truncate pr-2 t-14 font-medium leading-[1.6]">
                <span className={LINK}>{l.name}</span>
              </span>
              <span className="text-secondary">{l.team}</span>
              <span className={cell}>{l.gp}</span>
              <span className={cell}>{count(l.min)}</span>
              <span className={cn(cell, "font-medium")}>{signed(l.glue)}</span>
              <span className="flex justify-center">
                <Strip c={l.c} scale={SEASON_TABLE_SCALE} className="w-20" />
              </span>
              {ORDER.map((i, n) => (
                <span
                  key={i}
                  className={cn("flex h-full items-center justify-end pr-1.5 font-mono t-12 tnum", isStart(n) && start, l.v[i] === 0 && "text-muted opacity-60")}
                >
                  {componentValue(i, l.v[i])}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/** The season board as a fragment: the top eight with the hurt and helped strip beside each score. */
export function GlueSeason() {
  const rows = SEASON_LINES.slice(0, 8);
  const cols = "grid grid-cols-[calc(var(--px)*30)_minmax(0,1fr)_calc(var(--px)*40)_calc(var(--px)*76)_calc(var(--px)*56)] items-center";
  return (
    <Surface
      w={400}
      brand="glue"
      label={`GLUE Index ${SEASON.season} season leaderboard: the top eight of ${SEASON.players} qualified players, led by ${SEASON_LEADER.name} at ${signed(SEASON_LEADER.glue)}.`}
      className="bg-ground"
    >
      <div className="px-4 pb-4 pt-5">
        <div className="px-1">
          <SeasonHead label="Season leaderboard" season={SEASON.season} title="t-52" sub="t-13.5">
            {SEASON_SUB}
          </SeasonHead>
          <Views current="Everyone" size="h-7.5 px-2.5 t-12.5" className="mt-3" />
        </div>
        <div className="mt-4 overflow-hidden r-12 border border-line bg-card leading-none">
          <div className={cn(cols, "h-8 border-b font-mono t-11 text-muted", STRONG)}>
            <span className="pr-2 text-right">#</span>
            <span className="font-sans t-13">Player</span>
            <span className="font-sans t-12">Team</span>
            <span />
            <span className="flex items-center justify-end gap-1 pr-3.5 text-ink">
              GLUE
              <Icon d={ARROW_DOWN} className="h-2.5 w-2.5" />
            </span>
          </div>
          {rows.map((l, r) => (
            <div key={l.rank} className={cn(cols, "h-9", r < rows.length - 1 && "border-b border-line")}>
              <span className="pr-2 text-right font-mono t-12 text-muted tnum">{l.rank}</span>
              <span className="truncate pr-2 t-13.5 font-medium">{l.name}</span>
              <span className="t-12.5 text-secondary">{l.team}</span>
              <Strip c={l.c} scale={SEASON_TABLE_SCALE} className="w-17" />
              <span className="pr-3.5 text-right font-mono t-12.5 font-medium tnum">{signed(l.glue)}</span>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/* ─── value: app/season/[season]/value/page.tsx, components/ValueTable.tsx ─ */

/** The value view: positive scores with a listed contract, ranked by GLUE per $1M of salary. */
export function GlueValueFull() {
  const num = "pr-3 text-right font-mono tnum";
  return (
    <Surface
      w={960}
      brand="glue"
      label={`GLUE Index ${VALUE.season} value view: ${VALUE.players} players with a positive score and a listed contract, ranked by GLUE per one million dollars of salary. ${VALUE_LINES[0].name} leads at ${signed(perMillion(VALUE_LINES[0]))}.`}
      className="bg-ground"
    >
      <SiteHeader current="Seasons" />
      <div className="px-5 pb-8 pt-8">
        <div className="flex items-end justify-between gap-6 px-1">
          <SeasonHead label="Most GLUE per dollar" season={VALUE.season} inProgress title="t-64" sub="t-15">
            <span className="whitespace-nowrap">{VALUE.players} players with a positive score and a listed contract</span> ·{" "}
            <span className="whitespace-nowrap">ranked by GLUE per $1M of this season&rsquo;s salary</span> ·{" "}
            <span className="whitespace-nowrap">contracts from Basketball Reference, {VALUE.asOf}</span> ·{" "}
            <span className="whitespace-nowrap">{VALUE.unlisted} qualified players have no listed contract, mostly two-way deals</span>
          </SeasonHead>
          <Picker value={VALUE.season} prevDisabled nextDisabled />
        </div>
        <Views current="Value" value size="h-9 px-3 t-15" className="mt-4 px-1" />

        <div className="mt-7 flex items-center justify-between px-1">
          <p className="t-15 font-medium">Best value</p>
          <SearchBox className="w-60" />
        </div>

        <div className="mt-3 overflow-hidden r-12 border border-line bg-card t-13 leading-none">
          <div className={cn("glue-value h-8 border-b font-mono t-12 text-muted", STRONG)}>
            <span className={num}>#</span>
            <span className="font-sans t-14">Player</span>
            <span className="font-sans t-13">Team</span>
            <span className={num}>Min</span>
            <span className={num}>GLUE</span>
            <span />
            <span className={num}>Overall</span>
            <span className={num}>Salary</span>
            <span className={num}>AAV</span>
            <span className="flex items-center justify-end gap-1 whitespace-nowrap pr-4 text-ink">
              GLUE per $1M
              <Icon d={ARROW_DOWN} className="h-3 w-3" />
            </span>
          </div>
          {VALUE_LINES.map((l, r) => (
            <div key={l.rank} className={cn("glue-value h-9", r < VALUE_LINES.length - 1 && "border-b border-line")}>
              <span className={cn(num, "text-muted")}>{l.rank}</span>
              <span className="truncate pr-2 t-14 font-medium leading-[1.6]">
                <span className={LINK}>{l.name}</span>
              </span>
              <span className="text-secondary">{l.team}</span>
              <span className={num}>{count(l.min)}</span>
              <span className={num}>{signed(l.glue)}</span>
              <span className="flex justify-center">
                <Strip sums={l} scale={VALUE.scale} className="w-24" />
              </span>
              <span className={num}>{l.overall}</span>
              <span className={num}>{money(l.salary)}</span>
              <span className={num}>{money(l.aav)}</span>
              <span className="pr-4 text-right font-mono font-medium tnum">{signed(perMillion(l))}</span>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/** The value view as a fragment: the top eight, with the score, the salary and the ratio between them. */
export function GlueValue() {
  const rows = VALUE_LINES.slice(0, 8);
  const cols = "grid grid-cols-[calc(var(--px)*30)_minmax(0,1fr)_calc(var(--px)*50)_calc(var(--px)*58)_calc(var(--px)*128)] items-center";
  const num = "text-right font-mono tnum";
  return (
    <Surface
      w={420}
      brand="glue"
      label={`GLUE Index ${VALUE.season} value view: the top eight of ${VALUE.players} players by GLUE per one million dollars of salary, led by ${VALUE_LINES[0].name} at ${signed(perMillion(VALUE_LINES[0]))}.`}
      className="bg-ground"
    >
      <div className="px-4 pb-4 pt-5">
        <div className="px-1">
          <SeasonHead label="Most GLUE per dollar" season={VALUE.season} inProgress title="t-48" sub="t-13">
            <span className="block whitespace-nowrap">{VALUE.players} players with a positive score and a listed contract</span>
            <span className="block whitespace-nowrap">ranked by GLUE per $1M of this season&rsquo;s salary</span>
          </SeasonHead>
          <Views current="Value" value size="h-7.5 px-2.5 t-12.5" className="mt-3" />
        </div>
        <div className="mt-4 overflow-hidden r-12 border border-line bg-card leading-none">
          <div className={cn(cols, "h-8 border-b font-mono t-11 text-muted", STRONG)}>
            <span className="pr-2 text-right">#</span>
            <span className="font-sans t-13">Player</span>
            <span className="text-right">GLUE</span>
            <span className="text-right">Salary</span>
            <span className="flex items-center justify-end gap-1 whitespace-nowrap pr-3.5 text-ink">
              GLUE per $1M
              <Icon d={ARROW_DOWN} className="h-2.5 w-2.5" />
            </span>
          </div>
          {rows.map((l, r) => (
            <div key={l.rank} className={cn(cols, "h-9", r < rows.length - 1 && "border-b border-line")}>
              <span className="pr-2 text-right font-mono t-12 text-muted tnum">{l.rank}</span>
              <span className="truncate pr-2 t-13.5 font-medium">{l.name}</span>
              <span className={cn(num, "t-12")}>{signed(l.glue)}</span>
              <span className={cn(num, "t-12")}>{money(l.salary)}</span>
              <span className={cn(num, "pr-3.5 t-12.5 font-medium")}>{signed(perMillion(l))}</span>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

/* ─── player: app/player/[id]/page.tsx ──────────────────────────────────── */

const CHART_HEIGHT = 112;

/** SeasonChart from the player page: one bar per qualified season, the season in progress hatched. */
function SeasonChart() {
  const seasons = PLAYER.seasons;
  const top = Math.max(0, ...seasons.map((s) => s.glue));
  const bottom = Math.max(0, ...seasons.map((s) => -s.glue));
  const span = top + bottom || 1;
  const upHeight = Math.round((top / span) * CHART_HEIGHT);
  return (
    <div className="grid justify-start gap-2" style={{ gridTemplateColumns: `repeat(${seasons.length}, ${px(64)})` }}>
      {seasons.map((s) => {
        const size = Math.max(2, Math.round((Math.abs(s.glue) / span) * CHART_HEIGHT));
        return (
          <div key={s.season} className="grid">
            <span className={cn("flex flex-col justify-end border-b", STRONG)} style={{ height: px(upHeight + 20) }}>
              <span className="text-center font-mono t-11.5 leading-[1.7] text-accent tnum">{signed(s.glue, 1)}</span>
              <span className={cn("block w-full", s.inProgress ? "glue-bar-open" : "bg-accent")} style={{ height: px(size) }} />
            </span>
            <span className="mt-2 text-center font-mono t-11.5 leading-[1.35] text-muted tnum">{s.season.slice(2)}</span>
          </div>
        );
      })}
    </div>
  );
}

/** A player page as a fragment: the four headline figures, then GLUE by season. */
export function GluePlayer() {
  return (
    <Surface
      w={420}
      brand="glue"
      label={`GLUE Index player page for ${PLAYER.name}: career GLUE ${signed(PLAYER.figures[0].value)}, ${PLAYER.figures[0].note}, with a bar for each of his four qualified seasons.`}
      className="bg-ground"
    >
      <div className="px-5 pb-5 pt-5">
        <Meta className="t-11">Player</Meta>
        <p className="mt-1 font-display t-48 font-medium leading-none tracking-[-0.01em]">{PLAYER.name}</p>
        <p className="mt-2 t-13.5 leading-[1.45] text-secondary">
          {PLAYER.sub}
          <span className="block whitespace-nowrap">{PLAYER.deal}</span>
        </p>

        <div className={cn("mt-4 grid grid-cols-2 border-t", STRONG)}>
          {PLAYER.figures.map((f, i) => (
            <div key={f.label} className={cn("border-b border-line py-3", i % 2 === 1 && "border-l pl-4")}>
              <p className="t-12.5 leading-[1.5] text-secondary">{f.label}</p>
              <p className={cn("font-display t-40 font-medium leading-none tnum", f.value < 0 && DEBIT)}>{signed(f.value)}</p>
              <p className="mt-1 font-mono t-10.5 leading-[1.35] text-muted">{f.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 r-12 border border-line bg-card px-4 pb-4 pt-3.5">
          <p className="t-13.5 font-medium">GLUE by season</p>
          <div className="mt-1">
            <SeasonChart />
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ─── method: app/method/page.tsx ───────────────────────────────────────── */

/* The page's own MathML for the z-score and the weighted sum, set the same way. */
const Z_SCORE = `<math display="block"><mrow>
  <msub><mi>z</mi><mrow><mi>p</mi><mo>,</mo><mi>i</mi></mrow></msub><mo>=</mo>
  <mfrac>
    <mrow><msub><mi>x</mi><mrow><mi>p</mi><mo>,</mo><mi>i</mi></mrow></msub><mo>−</mo><msub><mover><mi>x</mi><mo>¯</mo></mover><mi>i</mi></msub></mrow>
    <msub><mi>s</mi><mi>i</mi></msub>
  </mfrac>
</mrow></math>`;

const GLUE_SUM = `<math display="block"><mrow>
  <msub><mi>GLUE</mi><mi>p</mi></msub><mo>=</mo>
  <munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>14</mn></munderover>
  <msub><mi>w</mi><mi>i</mi></msub><mo>&#x2062;</mo><msub><mi>z</mi><mrow><mi>p</mi><mo>,</mo><mi>i</mi></mrow></msub>
</mrow></math>`;

const Equation = ({ mathml }: { mathml: string }) => (
  <div
    className="glue-math flex items-center justify-center r-12 border border-line bg-card px-2 py-3 t-16 text-ink"
    dangerouslySetInnerHTML={{ __html: mathml }}
  />
);

function WeightList({ title, indexes, tone }: { title: string; indexes: number[]; tone: string }) {
  return (
    <div>
      <p className={cn("flex h-7 items-center border-b t-13 font-medium", STRONG, tone)}>{title}</p>
      {indexes.map((i) => (
        <p key={i} className="flex h-7 items-center justify-between gap-2 border-b border-line t-12.5 leading-none text-secondary">
          <span className="truncate">{COMPONENTS[i].label}</span>
          <span className={cn("font-mono t-12 tnum", tone)}>{signed(COMPONENTS[i].weight, 1)}</span>
        </p>
      ))}
    </div>
  );
}

/** The formula as the method page states it: standardize each component, weight it, add the fourteen. */
export function GlueMethod() {
  const hl = (b: string) => <b className="glue-hl font-semibold">{b}</b>;
  return (
    <Surface
      w={420}
      brand="glue"
      label="How GLUE is calculated: each of fourteen components is turned into a z-score, multiplied by its weight and summed. Seven credits carry weights from +1.0 to +0.4 and seven debits from −1.1 to −0.3."
      className="bg-ground"
    >
      <div className="px-5 pb-5 pt-5">
        <Meta className="t-11">Method, version 1.0</Meta>
        <p className="mt-1 font-display t-40 font-medium leading-none tracking-[-0.01em]">How GLUE is calculated</p>
        <p className="mt-3.5 flex gap-x-5 whitespace-nowrap font-display t-34 font-medium leading-none text-secondary">
          <span>{hl("G")}ritty</span>
          <span>
            {hl("L")}ow-{hl("U")}sage
          </span>
          <span>{hl("E")}rrorless</span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Equation mathml={Z_SCORE} />
          <Equation mathml={GLUE_SUM} />
        </div>
        <p className="mt-2.5 t-12 leading-[1.5] text-secondary">
          Each raw count becomes a z-score against its comparison pool. Multiply each z-score by its weight and add the
          fourteen results. Credits carry positive weights, debits negative.
        </p>

        <div className="mt-3.5 grid grid-cols-[minmax(0,10fr)_minmax(0,13fr)] gap-x-5">
          <WeightList title="Credits" indexes={CREDIT_INDEXES} tone="text-accent" />
          <WeightList title="Debits" indexes={DEBIT_INDEXES} tone={DEBIT} />
        </div>
      </div>
    </Surface>
  );
}

/* ─── mark ──────────────────────────────────────────────────────────────── */

/** The ledger mark large, with the wordmark and the acronym as the header sets them. */
export function GlueMark() {
  return (
    <Surface
      w={400}
      brand="glue"
      label="The GLUE Index mark: two green credit bars to the right of an axis and one red debit bar to the left, beside the GLUE wordmark and the line Gritty, Low-Usage, Errorless."
      className="bg-ground"
    >
      <div className="flex flex-col items-center px-8 pb-13 pt-14">
        <div className="flex items-center gap-5">
          <Mark className="h-22 w-22" />
          <span className="font-display t-124 font-semibold leading-[0.8] tracking-[0.02em]">GLUE</span>
        </div>
        <p className="mt-7 whitespace-nowrap t-16 text-muted">{ACRONYM}</p>
      </div>
    </Surface>
  );
}

export const SURFACES: SurfaceDef[] = [
  {
    id: "glue-night",
    title: "Glue guys of the night",
    caption:
      "The home page for the latest night: the top player's score written out as a ledger, with the next nine, the bottom three and the final scores. Each game is scored against every qualified player-game of the season to date, so the pool is printed under the date.",
    tile: GlueNight,
    full: GlueNightFull,
  },
  {
    id: "glue-ledger",
    title: "The ledger",
    caption:
      "One score, itemised. Each of the fourteen rows shows the raw count and the weighted z-score it produced, drawn right in green when it helped and left in red when it hurt, and the rows add up to the total.",
    tile: GlueLedger,
  },
  {
    id: "glue-season",
    title: "Season leaderboard",
    caption:
      "Every player with at least 1,000 minutes in a season, ranked by GLUE, with all fourteen counts beside the score. The strip in each row is the sum of what hurt and what helped, on one scale for the whole board.",
    tile: GlueSeason,
    full: GlueSeasonFull,
  },
  {
    id: "glue-value",
    title: "Best value",
    caption:
      "The value view of the current season: players with a positive score and a listed contract, ranked by GLUE per $1M of this season's salary. Salaries and average annual value come from Basketball Reference's contracts table, pulled by the nightly job.",
    tile: GlueValue,
    full: GlueValueFull,
  },
  {
    id: "glue-player",
    title: "Player page",
    caption:
      "One page per player: career GLUE as the sum of his completed seasons, and a bar for each qualified season, with the one in progress hatched.",
    tile: GluePlayer,
  },
  {
    id: "glue-method",
    title: "The formula",
    caption:
      "Two of the method page's equations and the fourteen weights. Each component is z-scored against its pool, multiplied by its weight and summed, with credits positive and debits negative.",
    tile: GlueMethod,
  },
  {
    id: "glue-mark",
    title: "Ledger mark",
    caption: "The mark is a small ledger: two credits to the right of an axis and one debit to the left, set beside the wordmark as the site's header sets it.",
    tile: GlueMark,
  },
];
