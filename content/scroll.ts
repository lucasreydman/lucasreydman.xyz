import type { Brand } from "./types";

/**
 * What the home page shows of each thing, in the order of the scroll.
 *
 * FBI Basketball, the current job, is a chapter: an opening that says what it
 * is and what he does there, then one row per screen (named by its id in
 * `components/surfaces`), each with what it is for. Every other project is a
 * single shot with one screen.
 *
 * The full account of every project is on its own page; this file only picks
 * what earns a place in the scroll.
 */
export const fbiChapter: { surface: string; title: string; body: string; points: string[] }[] = [
  {
    surface: "fbi-rankings",
    title: "Rankings that rerun twice a day",
    body: "Every player on the redraft board is ranked by one projection engine I wrote, which reruns each morning and before tip-off from box scores, injury reports, depth charts and team minutes.",
    points: [
      "Redraft and dynasty boards, for categories leagues and points leagues",
      "Each of nine categories shaded by tier against the player pool",
      "Three ways to read a player's value: DURANT, Minus-1 and Z-Score",
    ],
  },
  {
    surface: "fbi-trade",
    title: "A trade judged by what it does to your week",
    body: "Most calculators add up player values. This one plays both rosters out before and after the deal, and tells you how much more often you win a week.",
    points: [
      "The chance of winning each category, before and after",
      "A verdict in plain words that changes at 1, 3 and 6 points of weekly win chance",
      "Uneven trades count the waiver pickup the open spot allows",
    ],
  },
  {
    surface: "fbi-power",
    title: "Tools that run on your own league",
    body: "Members connect a Fantrax, Yahoo, Sleeper or ESPN league. From then on every tool reads their real rosters and their league's own scoring.",
    points: [
      "Power rankings for every team in the league",
      "A head-to-head planner for the week's matchup",
      "A trade finder that only suggests deals the calculator approves",
    ],
  },
  {
    surface: "fbi-schedule",
    title: "The whole season on one grid",
    body: "Games per week decide weekly leagues. The schedule analyzer lays out all 25 weeks for all 30 teams, so streaming and playoff planning start from the calendar.",
    points: [
      "Heavy and light weeks marked, league breaks included",
      "Playoff weeks scored on their own, for the window a league actually uses",
    ],
  },
];

/** The two smaller screens that close the FBI chapter: how the numbers are made, and how access is sold. */
export const fbiClose = {
  engine: {
    surface: "fbi-engine",
    title: "One engine under the redraft boards",
    body: "Every redraft ranking, tier and trade verdict comes from the same run. An admin page traces any player through every stage of the arithmetic, so any number on the board can be explained.",
  },
  cards: {
    surface: "fbi-cards",
    title: "Sold as a card for the season",
    body: "Access is a one-time card for the season. An account is free, one card opens redraft, one opens dynasty and one opens everything. Checkout runs through Polar, and each page is gated by role.",
  },
};

/** The one screen each project shows on the home page. */
export const shots: Record<Exclude<Brand, "fbi">, string> = {
  glue: "glue-night",
  sharprfi: "sharprfi-calculator",
  tpdl: "tpdl-matchup",
  fandex: "fandex-scorecard",
  playcaller: "playcaller-moves",
  phantomgm: "phantomgm-tonight",
  "lineup-lab": "lineup-lab-impact",
  hitlist: "hitlist-top-plays",
  blakey: "blakey-today",
};

/** Screens on the home page that have real controls, so they are not wrapped in a link. */
export const LIVE = new Set(["sharprfi-calculator"]);

/** Screens that are drawn as a phone. On the home page a phone stands on the panel with no frame around it. */
export const PHONES = new Set(["tpdl-matchup", "tpdl-lottery", "playcaller-moves", "phantomgm-tonight"]);
