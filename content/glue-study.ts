import type { Study } from "./types";

/**
 * GLUE Index, written from its committed code (through 4ff07e5) and the live
 * site on 2026-11-11.
 *
 * Every formula and constant below was read out of the code: `lib/formula.ts`
 * (the fourteen components, their weights and the thresholds),
 * `scripts/build-data.ts` (pools, z-scores, careers), `scripts/fetch.ts`,
 * `scripts/lib/pbp.ts`, `scripts/lib/salaries.ts` and
 * `.github/workflows/nightly.yml` (the pipeline), `app/method/page.tsx` (the
 * free throw break-even) and the stars and value pages under `app/season/`. The 74.5% figure is what
 * the live method page prints for 2025-26.
 */
export const glue: Study = {
  slug: "glue",
  name: "GLUE Index",
  meta: ["NBA", "Player index", "2026"],
  deck: "Who wins possessions and avoids mistakes without needing the ball?",
  href: "https://glue-index.vercel.app/",
  hrefLabel: "See it live",
  intro: [
    "GLUE stands for Gritty, Low-Usage, Errorless, and the three words are the three parts of the calculation. Gritty is seven kinds of event that win a possession or points without a play being called for you. Low-usage is a penalty on the share of possessions a player finishes while he is on the floor. Errorless is six kinds of event that hand possessions or points back, each one a deduction. A high score means a player was all three at once.",
    "Zero is the average qualified player. A positive score means a player gave his team more than he cost it in these fourteen columns, which is a different claim from being the better player: most franchise players land below zero, because carrying an offense costs usage and turnovers by definition.",
    "It scores every night of the season and every season since 2005-06, the first one where play-by-play recorded who drew offensive and loose ball fouls. A job scheduled for 09:15 UTC pulls every night not yet stored from pbpstats, pulls the two most recent game dates again to catch stat corrections, refreshes the current contracts, and commits the data, which rebuilds the site.",
  ],
  steps: [
    {
      title: "Count fourteen things",
      body: "Seven credits and seven debits are read from play-by-play totals for each player. Every count is a raw total and usage is the one rate, so a player earns GLUE by being on the floor and doing these things. Three columns are defined narrowly: only blocks the defense recovers, only turnovers that are live, and only the fouls that put an opponent on the line.",
      math: [
        "credits: steals, recovered blocks, offensive fouls drawn, offensive rebounds, threes made, free throws made, loose ball fouls drawn",
        "debits: live-ball turnovers, usage rate, bad fouls, offensive fouls committed, missed free throws, shots blocked, loose ball fouls committed",
        "bad fouls = shooting fouls + non-shooting penalty fouls that are not take fouls",
        "missed free throws = FTA − FT made",
      ],
    },
    {
      title: "Choose the pool",
      body: "A score only means something against a comparison group. For a season it is every player over a minutes bar that scales with games played, so the board works in November and in shortened seasons. For a single game it is every player-game of at least 15 minutes in the season to date, that night included, so a two-game slate cannot make an ordinary line look historic. Early in a season the pool is topped up with the nearest games outside it until it holds 3,000 player-games.",
      math: [
        "season: minutes ≥ round(1000 × team games / 82)",
        "game: seconds ≥ 15 × 60",
        "night pool = season to date, extended to 3000 player-games when short",
      ],
    },
    {
      title: "Standardize each component",
      body: "Counts come in very different sizes: a season leader might have 150 steals and 12 offensive fouls drawn. Each component is turned into a z-score, the number of standard deviations a player sits above or below the pool's mean, using the sample standard deviation. A component with no spread in the pool contributes nothing.",
      math: ["z = (x − mean) / s", "s = sqrt(Σ (x − mean)^2 / (n − 1))"],
    },
    {
      title: "Weight and sum",
      body: "Each z-score is multiplied by its weight and the fourteen results are added. Weights descend by possession impact: events that flip a possession sit at 1.0 to 1.1, events that gift points at 0.8 to 0.9, and skill signals and carelessness taxes at 0.3 to 0.7. Usage carries the joint heaviest weight against, which keeps this a glue metric and stops high-minute stars from winning on volume. Each product is kept, so every score can be shown as a ledger of what helped and what hurt.",
      math: [
        "GLUE = Σ w × z   over the 14 components",
        "w credits = +1.0, +1.0, +0.9, +0.8, +0.7, +0.4, +0.4",
        "w debits = −1.1, −1.1, −0.8, −0.5, −0.3, −0.3, −0.3",
      ],
    },
    {
      title: "Check what one event is worth",
      body: "Dividing a weight by a season's standard deviation gives the GLUE one event was worth that year, which makes the weights auditable. The free throw pair is the clearest case: a make earns a little and a miss costs more, so there is a percentage where a trip to the line is worth nothing. In 2025-26 it was 74.5%, a little under the league average, so drawing contact pays for an average shooter. Loose ball fouls drawn is held to 0.4 because it correlates with offensive rebounds at r = 0.78, and at full weight it paid rim-running bigs twice.",
      math: [
        "GLUE per event = w / s",
        "break-even FT% = (0.3 / s missed) / (0.4 / s made + 0.3 / s missed)",
      ],
    },
    {
      title: "Careers, stars and value",
      body: "The season scores feed three more lists, and none of them changes a score. Career GLUE is the sum of a player's completed, qualified seasons, so with zero as an average season it works like a running balance. Gluiest stars keeps the players at 27% usage or more and ranks them among themselves. Usage is the heaviest debit in the formula, so they start a long way behind. Value divides GLUE by this season's salary in millions, for players with a positive score and a listed contract. Salaries come from Basketball Reference's contracts table, which lists current deals only, so the value view exists for the current season.",
      math: [
        "career = Σ GLUE over completed, qualified seasons",
        "star: usage ≥ 27",
        "value = GLUE / (salary / 1,000,000)   for GLUE > 0",
      ],
    },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Node 24", "GitHub Actions", "pbpstats API", "Basketball Reference", "Vercel"],
};
