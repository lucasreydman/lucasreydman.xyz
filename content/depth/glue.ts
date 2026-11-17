import type { ProjectDepth } from "../types";

/*
  GLUE Index, written from its committed code (through 4ff07e5) and the live
  site on 2026-11-11: app/ (the night, season, stars, value, careers, player
  and method pages), components/ (Lead, Ledger, Strip, BoardTable, ValueTable,
  CareerTable, SeasonHead, Pickers, NavProgress, Page, CountUp, useLazyRows),
  lib/formula.ts, scripts/fetch.ts, scripts/build-data.ts, scripts/lib/pbp.ts,
  scripts/lib/salaries.ts and .github/workflows/nightly.yml. Every number below
  is a constant in that code or a figure printed on the live site.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "Glue guys of the night",
      summary: "The home page is the most recent night of NBA games, ranked.",
      items: [
        {
          name: "The latest night as the front page",
          detail:
            "The home page shows the most recent scored night, and every other scored night has its own page at /night/<date>. Each one counts the games, the players who qualified and the pool they were scored against.",
        },
        {
          name: "The leader's card",
          detail:
            "The top player of the night gets a card with his name under a highlighter stroke, his team and opponent, minutes and box score line, his GLUE in large figures and his full ledger. The figure counts up from zero when the page is reached through a link.",
        },
        {
          name: "Next nine and bottom three",
          detail:
            "Ranks two to ten are listed beside the card, and the last three of the night under them when the night has more than thirteen qualified players. Each row carries a small bar of what hurt and what helped, all on one scale.",
        },
        {
          name: "Final scores",
          detail: "A strip of the night's results sits under the date, with the winner of each game in ink and the loser greyed.",
        },
        {
          name: "Full slate table",
          detail:
            "Every player who reached 15 minutes, with minutes, GLUE and all fourteen raw counts. Any column sorts, the search box matches a name or a team abbreviation, and zero counts are dimmed so the events stand out. Rows are added 40 at a time as the reader nears the end of them.",
        },
        {
          name: "Date picker",
          detail: "Arrows step one night back or forward, and a menu grouped by month jumps to any scored night.",
        },
      ],
    },
    {
      title: "The ledger",
      summary: "The product's signature component: a score itemised like a column of figures.",
      items: [
        {
          name: "Fourteen rows",
          detail:
            "Seven credits and seven debits. Each row shows the raw count and the weighted z-score that count produced, signed, in green when it helped and red when it hurt.",
        },
        {
          name: "Hurt and helped bars",
          detail:
            "Every row has a bar drawn right or left of a centre axis. The bars in one ledger share a scale set by its largest contribution, so the row that decided the score is visible at a glance.",
        },
        {
          name: "Subtotals and a total",
          detail:
            "The credits and debits headings carry the sum of their rows, and a double rule closes the column with the GLUE total. The fourteen contributions add up to the score.",
        },
        {
          name: "Debits can help",
          detail:
            "A debit row is a z-score like any other, so a player with fewer turnovers or lower usage than the pool's average gets a positive figure there. The ledger shows that as a green bar in the debits group.",
        },
      ],
    },
    {
      title: "Season leaderboards",
      summary: "One board per season from 2005-06 to the season in progress.",
      items: [
        {
          name: "Every qualified player",
          detail:
            "A season board ranks every player with at least 1,000 minutes, with games, minutes, GLUE and the fourteen counts. It opens with the leader's ledger, the next nine and the bottom three, laid out like a night.",
        },
        {
          name: "A season in progress",
          detail:
            "The current season is labelled in progress with the number of games played of 82 and the date it runs through. Its minutes bar scales with games played, so a board exists from the first weeks.",
        },
        {
          name: "Shortened seasons",
          detail: "A finished season with fewer than 82 games is labelled with its length and uses the same scaled minutes bar.",
        },
        {
          name: "Season picker",
          detail: "Arrows step a season back or forward and a menu lists every scored season, staying on the view that is open. The Seasons link goes straight to the newest one.",
        },
        {
          name: "Sort and search",
          detail:
            "The table sorts by GLUE, name, games, minutes or any of the fourteen components, and searches by player name or team abbreviation.",
        },
      ],
    },
    {
      title: "Stars and value",
      summary: "Two more views of a season board. Neither changes a score, only who is on the list.",
      items: [
        {
          name: "A switch on every season",
          detail:
            "Each season page has an Everyone and Stars switch under its title. A season with contract data also offers Value, which today is the current season.",
        },
        {
          name: "Gluiest stars",
          detail:
            "The qualified players at 27% usage or more, ranked among themselves by GLUE. They are still scored against the whole league, and the line under the title counts how many of them score above zero.",
        },
        {
          name: "The same board for stars",
          detail: "The stars view reuses the season layout: the top star's ledger, the next nine, the bottom three and a sortable table of every star.",
        },
        {
          name: "Most GLUE per dollar",
          detail:
            "The value view lists players with a positive score and a listed contract, ranked by GLUE per $1M of this season's salary. Players below zero are left out, because a negative score over a salary does not rank anything sensibly.",
        },
        {
          name: "Value table",
          detail:
            "Each row shows minutes, GLUE with its hurt and helped strip, the player's rank on the full board, this season's salary, the deal's average annual value and the ratio. It sorts by any of those and searches by name or team.",
        },
        {
          name: "What the value view leaves out",
          detail:
            "The page says how many qualified players have no listed contract, mostly two-way deals, and gives the date the contracts were pulled. The source lists current deals only, so past seasons have no value view.",
        },
      ],
    },
    {
      title: "Careers",
      summary: "A running balance across every completed season a player qualified in.",
      items: [
        {
          name: "Career GLUE",
          detail:
            "The sum of a player's completed, qualified season scores. Zero is an average season, so years above average add to the balance and years below draw it down.",
        },
        {
          name: "Career table",
          detail:
            "Each row has the career total drawn to scale, the number of seasons, the span, the per-season average, the best season with a link to that board, and the teams played for.",
        },
        {
          name: "Highest or lowest",
          detail: "A toggle flips the table to read from the lowest career total up.",
        },
        {
          name: "Search and paging",
          detail: "Search filters by name. The table renders 40 rows at first and adds more as the reader scrolls toward the end, with a line that says how many are showing.",
        },
      ],
    },
    {
      title: "Player pages",
      summary: "One page for every player who appears in any scored season or night.",
      items: [
        {
          name: "Four headline figures",
          detail:
            "Career GLUE with its rank among all careers, the per-season average, the best season, and the current season with its rank and an in-progress note. Negative figures are set in red, and the line under the name gives this season's salary and the deal's average annual value when a contract is listed.",
        },
        {
          name: "GLUE by season",
          detail:
            "A bar per qualified season, up for above average and down for below, each linked to that season's board. The season in progress is hatched.",
        },
        {
          name: "A season's ledger",
          detail: "The current season's ledger sits beside the chart, or the most recent season's when the player is not active.",
        },
        {
          name: "Season by season",
          detail: "A table of every qualified season with team, games, minutes, GLUE, rank among qualified players and all fourteen counts.",
        },
        {
          name: "Best and latest nights",
          detail:
            "Two lists of eight single games, the highest scores and the most recent, each with the opponent, minutes, rank on the night and a link to that night.",
        },
        {
          name: "Players without a qualified season",
          detail: "A player who has only single games still gets a page. It says no season qualifies yet and lists his nights.",
        },
      ],
    },
    {
      title: "Method page",
      summary: "The whole formula, published on the site.",
      items: [
        {
          name: "The name is the formula",
          detail:
            "The page opens by spelling out Gritty, Low-Usage, Errorless and saying the three words are the three parts of the calculation: seven kinds of event that win a possession or points, a penalty on the share of possessions a player finishes, and six kinds of event that hand possessions or points back, each one a deduction.",
        },
        {
          name: "The equations",
          detail: "The z-score, the sample standard deviation and the weighted sum are set as MathML.",
        },
        {
          name: "Components and weights",
          detail:
            "A table of all fourteen components with the weight, the reason it counts, the pbpstats field it is read from, and what one event was worth in the latest finished season: the weight divided by that season's standard deviation.",
        },
        {
          name: "A worked example",
          detail: "The leader of the latest finished season is shown as a full ledger, so a reader can follow one score from counts to total.",
        },
        {
          name: "Who is compared with whom",
          detail: "Separate sections state the pool for seasons, single games and careers, including the minutes bars and why careers start in 2005-06.",
        },
        {
          name: "Stars and value explained",
          detail: "A section states what the two extra season views show, that neither changes a score, and where the contract figures come from.",
        },
        {
          name: "Calibration notes",
          detail:
            "The page reports the free throw percentage at which a trip to the line is worth nothing, computed from the season's deviations, and explains why loose ball fouls drawn was trimmed.",
        },
        {
          name: "Left out on purpose",
          detail:
            "A list of seven things the index does not count, each with its reason, including raw blocks, dead-ball turnovers, second chance points and minutes as a penalty.",
        },
      ],
    },
    {
      title: "Open data",
      items: [
        {
          name: "The latest night as JSON",
          detail: "/data/latest.json is the most recent night: its games, the baseline it was scored against, and every qualified player's counts and contributions.",
        },
        {
          name: "Any night or season",
          detail: "/data/glue-YYYY-MM-DD.json returns any scored night and /data/season-YYYY-YY.json any season board, in the same shape the pages are built from.",
        },
        {
          name: "Source and scope stated",
          detail: "The footer of every page credits pbpstats.com, says the index covers the regular season only, and states that the site is not affiliated with the NBA.",
        },
      ],
    },
  ],

  engineering: [
    {
      name: "A nightly GitHub Actions pipeline",
      detail:
        "A workflow is scheduled for 09:15 UTC, after the West Coast games end, and can also be started by hand. It pulls the new nights, refreshes the current season's totals and the contracts table, scores everything as a check, and commits the raw data. The push triggers a Vercel build.",
    },
    {
      name: "pbpstats for every count",
      detail:
        "Every count and score comes from the pbpstats.com API, which derives it from NBA play-by-play: one endpoint for player totals, by season or by a single date, and one for completed games. Only the regular season is requested.",
    },
    {
      name: "Raw data committed, scores recomputed",
      detail:
        "The repo stores only what pbpstats returned, one file per night and one per season. Scores are computed from those files on every build, so a change to the formula needs no re-fetch.",
    },
    {
      name: "Stat corrections",
      detail: "Each nightly run pulls the two most recent game dates whether or not they are stored, so a correction made after the first pull replaces the stored file.",
    },
    {
      name: "Resumable backfill with retries",
      detail:
        "A backfill command walks a season's game dates and skips any date already on disk, so it can be stopped and restarted. Flags start it from the last date or from the middle, so several workers can run at once. It waits 1.5 seconds between dates, and each request gets up to six attempts with a wait that starts at two seconds and doubles.",
    },
    {
      name: "One formula file",
      detail:
        "The fourteen components, their weights and the thresholds live in lib/formula.ts, which has no dependencies and is imported by both the pipeline and the site. The method page's table is rendered from the same list the scores are computed with.",
    },
    {
      name: "What each component is and why",
      detail:
        "Credits are steals and recovered blocks at 1.0, offensive fouls drawn at 0.9, offensive rebounds at 0.8, threes made at 0.7, and free throws made and loose ball fouls drawn at 0.4. Debits are live-ball turnovers and usage rate at 1.1, bad fouls at 0.8, offensive fouls committed at 0.5, and missed free throws, shots blocked and loose ball fouls committed at 0.3. Weights descend by how directly the event flips a possession or gives away points.",
    },
    {
      name: "Choices inside the components",
      detail:
        "Only blocks the defence recovers count, only live-ball turnovers are penalised, and bad fouls are shooting fouls plus non-shooting penalty fouls that are not take fouls. Loose ball fouls drawn is held to 0.4 because it tracks offensive rebounding at r = 0.78. Every count is a raw total, and usage rate is the one rate, weighted 1.1 against so high-minute stars cannot win on volume.",
    },
    {
      name: "Z-scores with a sample deviation",
      detail:
        "Each component is standardised against its pool with the sample standard deviation, multiplied by its weight and summed. A component with no spread in the pool contributes zero, contributions are stored to three decimals and the score to two.",
    },
    {
      name: "Scoring a single game against the season to date",
      detail:
        "A player needs 15 minutes in a game to be scored. His pool is every qualified player-game of the season up to and including that night, so the size of the slate does not change what a line is worth. Early in a season the pool is extended to 3,000 player-games, first with the most recent games before the season and then with games after the night, and its size and dates are stored with the night.",
    },
    {
      name: "Prefix sums over every player-game",
      detail:
        "All qualified player-games are laid out in date order with running sums of each component and its square. The mean and deviation of any window come from two lookups, so every night's baseline is computed without rescanning the pool.",
    },
    {
      name: "Season qualification and untracked seasons",
      detail:
        "The minutes bar is 1,000 times team games over 82, rounded, so it scales during a season and in shortened ones. A season is skipped when fewer than half its qualified players have an offensive foul drawn or fewer than 30% have a loose ball foul drawn, which is how seasons before the play-by-play tracked those fouls are excluded.",
    },
    {
      name: "Contracts from Basketball Reference",
      detail:
        "Salaries come from one page, Basketball Reference's contracts table, parsed for each player's salary this season and the average over the listed years of his deal. The pull is best-effort: a failed request, a missing season column or fewer than 300 parsed contracts leaves the last good file in place and never fails the nightly run. Contracts are joined to pbpstats players by a normalised name: accents, punctuation, hyphens and suffixes such as Jr. are removed and case is ignored. The build logs how many qualified players matched, and a player with no match is left without a salary.",
    },
    {
      name: "Stars and value without rescoring",
      detail:
        "Both views are filters over the scored season board. Stars keeps the players at or above a usage constant of 27 and renumbers them, and value divides GLUE by salary in millions for positive scores and sorts by it. Value pages are generated only for seasons that have a contract file.",
    },
    {
      name: "Navigation that answers the click",
      detail:
        "A line along the bottom of the header starts when a navigation is requested and completes when the new path commits. Pages crossfade with React view transitions and slide in the direction of the arrow when stepping a night or a season, sections arrive in a short stagger, a skeleton in the shape of a board shows for slow loads, and long tables render 40 rows at a time behind an intersection observer. All of it is switched off under reduced motion.",
    },
    {
      name: "Static generation and public JSON",
      detail:
        "The build step writes scored JSON for every night, season, player and the career table, and every page is generated from those files at build time with no runtime data layer. The same step writes the night and season boards to the public folder, which is the JSON the site serves. The pipeline scripts are TypeScript run directly by Node 24.",
    },
  ],
};
