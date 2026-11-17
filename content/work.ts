import type { Study } from "./types";

/**
 * Client work, in the order it should appear.
 *
 * Pride STEM Canada came off on 2026-11-10 (Lucas: "remove pride stem canada for
 * now"). Its capture is still in `public/work/psc.webp` so it can come back. It
 * stays on the résumé side of things.
 *
 * FBI was rewritten the same day from the repo (fbi-firestorm/fbi-basketball),
 * because the August copy had drifted three ways: access is a one-time card
 * sold through Polar, not a subscription; the redraft
 * board comes from FBI's own engine, not a consensus of expert lists; and
 * leagues connect from Fantrax and Yahoo as well as Sleeper. Every constant in
 * the steps below is from `lib/ros/`, `lib/data/` and `lib/trade/` in that repo.
 * The Discord figure is the one on the public homepage.
 */
export const work: Study[] = [
  {
    slug: "fbi-basketball",
    name: "FBI Basketball",
    meta: ["NBA fantasy", "Product engineering lead", "2026 to now"],
    deck: "A paid fantasy basketball platform, and the projection engine behind its redraft boards and trade calculator.",
    href: "https://fbi-basketball.com/",
    hrefLabel: "See it live",
    intro: [
      "FBI Basketball is a fantasy basketball brand with a Discord community of more than six thousand managers. I lead product engineering: the site, the projection engine under it, the paid cards, the league integrations, and the Discord bot that ties membership to the community. It opened to the public on September 18, 2026.",
      "Members get redraft and dynasty rankings, a trade calculator that judges a deal by what it does to each team's week, a head-to-head planner, power rankings for their own leagues, and player pages with shot charts and percentiles. They connect Fantrax, Yahoo, Sleeper or ESPN leagues and every tool runs on their real rosters and scoring. Access is a one-time card for the season, sold through Polar, with Supabase gating each page by role.",
      "The redraft side ranks off one engine. It reruns twice a day from box scores, injury reports, depth charts and team minutes, and an admin page traces any player through every stage of the arithmetic, so any number on the board can be explained.",
    ],
    steps: [
      {
        title: "Start from a prior",
        body: "Before a game is played, a player's line is his last three seasons, weighted 9, 3 and 1 toward the newest and by games played, then pulled toward league average by a fixed number of games. That pull is set per stat by how noisy the stat is. Points settle quickly. Steals barely settle at all. An age curve then pivots at 26.",
        math: ["stat = (K · league + Σ wᵢ · gpᵢ · xᵢ) / (K + Σ wᵢ · gpᵢ)"],
        figure: "fbi-prior-k",
        caption: "K, the games of league average blended into each stat's prior. The lower it is, the sooner a player's own history is trusted.",
      },
      {
        title: "Update on this season",
        body: "Per-minute rates move game by game. Each game is weighted 0.985 to the power of its age in days, a half-life of about 46 days, and the rate is shrunk back toward the prior by a weight measured in minutes. That weight fades as the season goes on and is gone by game 82.",
        math: [
          "rate = (n · observed + k · prior) / (n + k)",
          "k = k₀ · max(0, 1 − team games / 82)",
        ],
        figure: "fbi-shrink",
        caption: "Share of the estimate still coming from the prior at the start of a season, by minutes played, for three of the engine's k values.",
      },
      {
        title: "Project minutes and games",
        body: "Minutes blend a player's own recent role with a curve by rotation rank, and each team's fifteen biggest roles must add up to 241.5 minutes a night. Expected games take what is left on the schedule, subtract the games an injury report implies he will miss, and scale by how often players at his spot in a rotation actually suit up. A news layer reads the latest reports with Claude and can move a player by at most six minutes or 15% of his value, or change the games he is expected to miss within a cap per injury tier.",
        math: ["games = (remaining − missed) × appearance rate"],
      },
      {
        title: "Value each category",
        body: "Category value is a z-score against the top 168 players, the pool a twelve-team league actually rosters. Percentages are weighted by volume, so 60% shooting on two attempts a night counts for less than on fifteen, and turnovers count against. The order then forgives an elite player his one weak category: fully near the top of the board, not at all past rank 31.",
        math: [
          "z = (x − pool mean) / pool sd",
          "FG% value = (pct − pool pct) × attempts",
          "value = Z − α · (Z − Minus-1)",
        ],
        figure: "fbi-forgiveness",
        caption: "α, the share of a player's worst category that is forgiven, by his rank with that category left out.",
      },
      {
        title: "Cut the tiers",
        body: "Tiers are cut with Jenks natural breaks, solved exactly by dynamic programming over each player's value and its own projection error. A tier is not allowed to run so long that its last player has less than a 30% chance of beating its first.",
        math: ["gap z = Δ / √(σ₁² + σ₂²)", "σ = 1.45 + 0.1 · u   (categories)"],
      },
      {
        title: "Judge a trade",
        body: "The trade calculator works out each category's win chance from the edge a trade creates against the weekly swing in that category, measured from three seasons of box scores rather than assumed. Categories combine into an exact distribution of how many you win, and the verdict changes at 1, 3 and 6 points of weekly win chance.",
        math: ["P(win category) = Φ(edge / σ)"],
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Supabase",
      "Polar",
      "Claude API",
      "Discord",
      "Vercel",
    ],
  },
  {
    slug: "blakey-breakthrough",
    name: "Blakey Breakthrough",
    meta: ["Training data", "Sole developer", "2026"],
    deck: "Which of a coach's athletes are falling off their training, before they quit?",
    // The dashboard itself is private. This points at the client's business.
    href: "https://blakeybreakthrough.com/",
    hrefLabel: "About the business",
    // Capture of the real Today view running on the app's seeded demo dataset.
    // The interface is the shipped one; every member, group and number in it is
    // invented, because the live roster is a real client list. Confirmed as
    // seeded by Lucas, 2026-08-13. Re-shoot from seeded data or not at all.
    /*
      Re-angled 2026-11-10 toward the training data (Lucas: it is "about
      exercise and workouts", so it folds into the sports data theme). The
      method is from lib/compute.ts and lib/thresholds.ts in
      blakey-breakthrough-dashboard. Roster size and completion medians are left
      out on purpose: they describe the client's business, and the live
      calibration figures are his members' numbers, not mine to publish.
    */
    intro: [
      "Blakey Breakthrough runs twelve week group training programs on Trainerize. Every member's workouts are logged there, but the platform showed the coach one athlete at a time, so knowing who was slipping meant clicking through the whole roster every day.",
      "I built him a private dashboard that reads the training data for him. Every half hour it pulls each member's workout log and sign-ins and turns them into a ranked queue: who has gone dark, whose adherence is falling, who just hit a milestone worth a message, and whose renewal is at risk. The morning review runs from the keyboard: j and k move through the queue, Space peeks at a member and d marks one done.",
    ],
    steps: [
      {
        title: "Measure adherence",
        body: "Each week's completion is workouts done against the workouts scheduled for that week in Trainerize, and a member's completion is the mean of those weekly rates, leaving out weeks with nothing scheduled. The other signal is days since the last sign-in, counted from the start of the cohort for anyone who never signed in.",
        math: ["completion = mean(weekly done / weekly scheduled)"],
      },
      {
        title: "Read the trend",
        body: "Trend reads the last three weeks. A swing of more than 5 points either way shows as up or down. A drop of more than 25 points over those three weeks flags a member as declining, which is far enough past the whole cohort's normal drift to pick out individuals rather than the season.",
        math: ["declining = week₋₂ − week₀ > 25 pts"],
        figure: "bb-trend",
        caption: "How a member's last three weeks classify, from completion three weeks ago to completion now.",
      },
      {
        title: "Rank who needs a message",
        body: "Every flag scores into a band so the queue sorts itself. A full week without signing in is urgent and scores above 100, climbing a point a day. Low completion and a steep decline sit in the at-risk band, and a short absence is a watch. Each extra flag on the same member adds 2.",
        math: ["priority = band score + 2 × (flags − 1)"],
        figure: "bb-priority",
        caption: "Score bands for each kind of flag. The queue is sorted on this number.",
      },
      {
        title: "Calibrate on the real roster",
        body: "The thresholds behind every tier are editable by the coach at runtime, not hardcoded by me. The textbook numbers I started from flagged nearly the whole roster red, which is the same as flagging nobody, so each threshold was re-cut against the live data until its tier isolated a slice he could act on. Changing one re-tiers the dashboard on the next load without a resync.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Upstash Redis",
      "Trainerize API",
      "Vercel",
    ],
  },
];

export const workIntro = {
  title: "Work",
  lede: "What I build for the businesses that hire me. FBI Basketball is my job now. Blakey Breakthrough was a build for a training business.",
};
