import type { Study } from "./types";

/**
 * The Box Score: the sports analytics wing, opened up.
 *
 * Rebuilt 2026-11-10 when the site was re-angled toward sports analytics roles.
 * Lucas: no live links except FBI, and "really dig deep into displaying them in
 * visually nice ways and explaining the math and analytics". War Room came off
 * (Playcaller replaces it for his own leagues); Playcaller, Lineup Lab,
 * PhantomGM and TPDL went on.
 *
 * Every formula and constant below was read out of the code, not the READMEs:
 *
 * - SHARPRFI: lucasreydman/sharprfi, `lib/poisson.ts`, `lib/sim.ts`,
 *   `lib/model-config.ts`, `app/api/games/route.ts`. The Brier table is the
 *   README's backtest (1,344 games, 2026-03-26 to 07-05). It reads end of
 *   season stats, so it has look-ahead in it, and the copy says so.
 * - Hitlist (named MLB BvP until 2026-11-11):
 *   lucasreydman/hitlist, `lib/utils.ts`, `app/api/matchups/route.ts`.
 * - TPDL: lucasreydman/tpdl, `src/lib/proj.ts`, `winprob.ts`, `leagueweek.ts`,
 *   `draft.ts`. Lottery weights are the code default in `settings.ts`.
 * - Fandex (added 2026-11-16): lucasreydman/fandex, `src/lib/engine.ts`,
 *   `engine.test.ts`, `history.test.ts`, `components/Tune.tsx`, read again at
 *   ca5bdff after the five extra leagues and the franchise history went in,
 *   and at 646fd67 after folded clubs were kept as inactive franchises.
 *   The league spreads are what the engine returns for its data file of
 *   2026-11-17.
 * - PhantomGM: fbi-basketball `lib/phantomgm/` and `lib/daily/`. Built by the
 *   FBI Basketball team, Lucas included. Credit it to the team and name no
 *   individual (Lucas, 2026-11-11). Admin-only, not live.
 * - Lineup Lab: lucasreydman/fantasy-lineup-lab, `src/lib/blend.ts`.
 * - Playcaller: lucasreydman/playcaller, `src/engine/`. "26 leagues" is what its
 *   own Moves screen read on 2026-11-10.
 */
export const lab: Study[] = [
  {
    slug: "sharprfi",
    name: "SHARPRFI",
    meta: ["MLB", "First inning model", "2026"],
    deck: "Will anybody score in the first inning, and is the posted price worth taking?",
    intro: [
      "The first inning is its own betting market: NRFI if neither team scores, YRFI if someone does. SHARPRFI prices every game on the slate both ways. Two engines estimate the chance of a run, a Poisson model and a batter by batter simulation, and the headline is their average. I built it with Francisco Nevarez, whose simulation is the second engine.",
      "Both engines were calibrated so that league-average inputs give 49.05%, the share of games from 2023 to 2025 with a first inning run. Everything a matchup does is measured as distance from that.",
    ],
    steps: [
      {
        title: "Stabilize the inputs",
        body: "Early season numbers are mostly noise, so every input is pulled toward league average by a sample-size prior before it is used. A pitcher's FIP is read as if he had thrown 45 more innings of league-average ball. On March 15 that prior counts 1.75 times as much, easing in a straight line to normal by July 1.",
        math: [
          "stat = avg + (raw − avg) × n / (n + k)",
          "FIP 3.80, k = 45 IP · K% .230, k = 150 BF · OBP .310, k = 600 PA",
        ],
        figure: "sharp-shrink",
        caption: "Weight on a pitcher's own FIP by innings pitched, in March and from July on.",
      },
      {
        title: "Build a run rate",
        body: "Expected first inning runs for each half starts from a league base rate and scales by the matchup: the opposing pitcher's FIP and strikeout rate, the lineup's on-base rate and its top of the order, the park and the weather. Most factors are damped by an exponent, and the strikeout factor is clamped to 0.85 to 1.15, so no one input runs away with it. The top five hitters are weighted 1, 1, 1, 0.672 and 0.366, the chance each one bats in the first.",
        math: [
          "λ = 0.3371 × clamp(fip · k · barrel · obp · top · park · weather, 0.55, 1.55)",
          "fip = (FIP / 3.80)^0.55   obp = (OBP / .310)^0.70   park = PF^0.5",
          "0.3371 = −ln(0.5095) / 2",
        ],
      },
      {
        title: "Price the inning",
        body: "With a run rate for each half, a scoreless half is the Poisson chance of zero, and NRFI needs both halves to stay scoreless. The calculator runs the model's own formulas. Barrel rate and top of the order are held at league average.",
        math: ["P(0 runs) = e^−λ", "P(NRFI) = e^(−λ home) × e^(−λ away)"],
        figure: "nrfi-calculator",
        caption: "The Poisson engine on its own. On the site its answer is averaged with the simulation's.",
      },
      {
        title: "Simulate it",
        body: "The second engine plays each half inning out ten thousand times. A hitter's chance of reaching comes from his wOBA, regressed toward .310 by plate appearances, adjusted for platoon and park, and scaled by what the pitcher allows. Hits split 65% singles, 20% doubles, 3% triples and 12% home runs, and runners move by fixed rules. Each game is seeded with its own ID, so the same inputs always give the same answer.",
        math: ["P(reach) = clamp(wOBA × 1.2333 × OBP allowed / .313 × √PF, 0.05, 0.95)"],
      },
      {
        title: "Check it",
        body: "Backtested over 1,344 games of the 2026 season, the blend scored a Brier of 0.2447, better than either engine alone. There are two catches. A constant 50% guess always scores 0.2500, so the edge is small. And the backtest reads season stats that include games played after each prediction, so these scores are flattering.",
        figure: "sharp-brier",
        caption: "Brier score by variant. Lower is better.",
      },
      {
        title: "Read the price",
        body: "Break-even odds come straight from the model, and a posted line becomes expected value per unit staked. Expected value of +0.05 per unit or more reads as a bet and anything else above zero as slight +EV. Zero down to -0.05 is a pass, and below that is no bet.",
        math: [
          "break-even = −100p / (1 − p)   if p ≥ .5,   else +100(1 − p) / p",
          "EV = p × profit − (1 − p)",
        ],
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Vercel KV",
      "MLB Stats API",
      "Baseball Savant",
      "Open-Meteo",
    ],
  },
  {
    slug: "mlb-hitlist",
    name: "Hitlist",
    meta: ["MLB", "Hit props", "2026"],
    deck: "Who has actually hit today's starting pitcher, and how much is that history worth?",
    intro: [
      "Batter versus pitcher history is hard to trust: a career line against one pitcher is usually a handful of at bats. Hitlist pulls that history for every lineup against the probable starter, keeps only the lines with enough at bats to mean something, and ranks them so the strongest surface first.",
    ],
    steps: [
      {
        title: "Filter",
        body: "A line needs at least 15 at bats and a .300 average to qualify. Three or more hitters from one team sharing the identical line against the same pitcher is treated as a data glitch and dropped. Confidence is labelled by sample: 21 at bats or more is high, 15 to 17 is low.",
        math: ["AB ≥ 15 and AVG ≥ .300"],
      },
      {
        title: "Rank",
        body: "The ranking discounts average by sample with a straight ramp: full credit at 30 at bats, two thirds at 20, half at 15. A .400 hitter in 15 at bats ranks below a .310 hitter in 30.",
        math: ["score = AVG × min(AB / 30, 1)"],
        figure: "bvp-score",
        caption: "Ranking score by at bats, for three career averages. Each line starts at the 15 at bat floor.",
      },
      {
        title: "Turn it into a chance",
        body: "The hit chance on each card regresses the average toward .320, a fixed target for a pool already filtered to .300 and above, as if it came with 50 extra at bats, then compounds it over the at bats his lineup spot usually gets. It has a known lean: it treats every one of those at bats as coming against this pitcher, and a starter rarely sees a hitter four times, so the number runs high.",
        math: [
          "regressed = (AB × AVG + 50 × .320) / (AB + 50)",
          "P(hit) = 1 − (1 − regressed)^E[AB]",
        ],
        figure: "bvp-spot",
        caption: "A .350 hitter in 20 career at bats against the starter, by lineup spot.",
      },
      {
        title: "Serve it before first pitch",
        body: "Lineups come from the posted order when there is one, then the box score, then an estimate from recent starts. The response is cached for thirty seconds until the Top 4 locks at first pitch, never past it, and for five minutes after, unless a slot is still open and an estimated play could fill it. Once a play's game has started it stays on the day's list, and open spots refill from the hitters still to play.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Vercel KV",
      "MLB Stats API",
    ],
  },
  {
    slug: "tpdl",
    name: "TPDL",
    meta: ["NBA", "Dynasty league platform", "2026"],
    deck: "A whole fantasy platform for one ten-team dynasty league, with its own projections and odds.",
    intro: [
      "TPDL, The People's Dynasty League, is a ten-team dynasty points league that runs on an app I built instead of a host site. It has live scoring, daily lineups, trades with pick protections and swap rights, a rookie lottery and live draft room, league chat and a commissioner's office. It is private to the league, installs as an app, and runs on free public data, most of it from ESPN.",
      "Every projection in it starts from one house number. Rankings scale it for the time a player is expected to miss, and auto-set lineups and the matchup odds move it for the teammates missing that day.",
    ],
    steps: [
      {
        title: "Project each player",
        body: "The house projection starts from ESPN's preseason number and hands weight to what the player has actually done. Recent games count more, with a half-life of 20 games. Each game is capped to a band around the projection that widens as games add up, so one 90-point night can't swing it but a real breakout comes through. A healthy scratch counts as three zero-point games.",
        math: [
          "proj = w × form + (1 − w) × prior",
          "w = games / (games + 10)",
          "game weight = 0.5^(games ago / 20)",
        ],
        figure: "tpdl-weight",
        caption: "Share of the projection that comes from this season's games, by games played. Ten games is an even split.",
      },
      {
        title: "Price the week",
        body: "The matchup screen gives each side a live win chance from the points already scored plus the spread of what is left. That spread stacks three kinds of uncertainty: per-game noise of half a player's projection, the chance he sits a game (7% on any night, more with an injury tag), and a 15% error in the projections themselves, shared across the team.",
        math: [
          "σ² = Σ (0.5 · proj)² · left + Σ exp² · q(1 − q) + (0.15 · remaining)²",
          "P(win) = T₅(lead / σ)",
        ],
      },
      {
        title: "Allow for blowups",
        body: "Fantasy weeks blow up and collapse more often than a bell curve allows, so the win chance uses a Student-t with five degrees of freedom instead of a normal. A team two standard deviations ahead reads as about 95% to win, not 98%: likely, not finished.",
        figure: "tpdl-t",
        caption: "Win chance by lead, in standard deviations of the points still to play.",
      },
      {
        title: "Draw the lottery",
        body: "The rookie lottery draws four picks from six teams by weight, and the odds screen shows each team's exact chance at every pick. It works them out by walking every order the draws can fall in, not by simulating.",
        figure: "tpdl-lottery",
        caption: "Exact pick chances with the default weights of 24, 24, 24, 18, 6 and 4, worst record first.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Supabase",
      "ESPN API",
      "Web Push",
      "Vercel",
    ],
  },
  {
    slug: "fandex",
    name: "Fandex",
    meta: ["Nine leagues", "Franchise index", "2026"],
    deck: "How good have your teams been since the year you were born?",
    intro: [
      "Pick the year you were born and one team in each of the NFL, NBA, MLB and NHL. Fandex scores every season those teams have played since on one scale, ranks every franchise and every city over the same years, and gives you a number from 0 to 100 for how lucky a fan you have been. MLS, the WNBA, NWSL, the PWHL and the CFL sit alongside the big four, which makes 221 franchises in all, counting 19 that no longer play. It works the same way for all time, back to 1903, or for any span of years.",
      "It started as a spreadsheet of win rates in the four big leagues since 2005. The engine reproduces that sheet's numbers and a test keeps it that way. There is no database and no API key: the page is static and all the scoring runs in the browser, so every control answers at once and any view can be shared as a link.",
    ],
    steps: [
      {
        title: "Put nine leagues on one scale",
        body: "Win rate is wins over wins plus losses, regular season only. Ties are left out and overtime losses in hockey count as losses. In soccer, where draws are part of the game, a draw counts as half a win. Baseball records bunch up near .500 and football records spread wide, so a franchise's record is measured from .500 in units of how spread out its own league is over the span. Since 2005 that spread is .033 in MLB and .081 in the NFL, so a .533 baseball club and a .581 football club sit the same distance above even.",
        math: [
          "win rate = W / (W + L)",
          "win rate = (W + D / 2) / (W + L + D)   in MLS and NWSL",
          "spread = √ mean((win rate − .500)^2)   across the league",
          "record = (win rate − .500) / spread",
        ],
        figure: "fdx-spread",
        caption: "League spread over the seasons from 2005: the typical distance of a franchise's win rate from .500. The PWHL has played three seasons.",
      },
      {
        title: "Score the typical season",
        body: "One record for the whole span lets ten great years and ten terrible ones cancel out. So each season is also scored against that year's league, using the spread of every club that played that season, and those scores are averaged. An average of season scores comes out narrower than a span record, so it is multiplied by a fixed 1.6 before it is weighted. A season a full unit above its league counts as great, and one a full unit below as awful.",
        math: [
          "season z = (season win rate − .500) / that season's spread",
          "typical = mean(season z) × 1.6",
        ],
      },
      {
        title: "Count titles against an even share",
        body: "In any decided season an average club would expect one title in n, where n is the number of clubs that year. A franchise is credited its titles minus that share, per season played, and the result is standardized within its league. A championship in a six-team league is worth 0.83 above expectation and one in a 32-team league 0.97. From 1960 to 1965 the AFL and the NFL each crowned a champion, so two titles were on offer and the even share is two in n. A season still in progress has no champion and adds nothing either way.",
        math: [
          "surplus = Σ (title − titles on offer / n) / seasons",
          "titles = (surplus − league mean) / league sd",
        ],
      },
      {
        title: "Blend, then shrink short histories",
        body: "The three parts are blended 50, 30 and 20, and the weights can be changed in the Scoring panel. A short history is weaker evidence than a long one, so the blend is pulled toward average by n over n plus 4: nine seasons keep 69% of their score and thirty keep 88%. The best franchise in the span is then set to 100 and the worst to 0.",
        math: [
          "blend = 0.5 × record + 0.3 × typical + 0.2 × titles",
          "score = blend × n / (n + 4)",
          "index = 100 × (score − worst) / (best − worst)",
        ],
        figure: "fdx-prior",
        caption: "Share of its blended score a franchise keeps, by seasons played in the span.",
      },
      {
        title: "Score a fan and a city",
        body: "A fan's number is the average of their teams' scores, placed on the same 0 to 100 line as the franchises. A city is scored on the seasons actually played there: each franchise's stay is scored the same way as a whole franchise, and the city's number is the average of its stays weighted by their length. So Seattle keeps the Sonics' years, and a two-year stopover does not count like a sixty-year one. The scorecard says how many cities had it worse and which city's history the fan has lived. The birth-year curve reruns the whole ranking for every starting year from 1903 and plots the same teams' number for each.",
      },
      {
        title: "Follow the record books",
        body: "A relocated or renamed franchise keeps its seasons, and lineage follows each league's official record. The 1988 to 2002 Hornets belong to today's Hornets and the Pelicans begin in 2002. The Coyotes stay their own inactive franchise while Utah starts new in 2024. The wartime merged teams count for both clubs, and the AFL's 1960 to 1965 title games count as championships. Clubs that folded in the modern era, such as the Houston Comets and Chivas USA, stay as inactive franchises that can still be picked and ranked, and their cities keep those seasons. A test pins the first season, every season since and the known gaps for all 126 franchises of the big four.",
      },
      {
        title: "Lean recent, if asked",
        body: "By default a season from decades ago weighs the same as last year. Two settings change that: a season counts half as much every 15 seasons back, or every 6. The weight is applied to wins and losses, to season scores and to titles alike.",
        math: ["season weight = 0.5^(seasons ago / half-life)"],
        figure: "fdx-recency",
        caption: "Weight on a season by how long ago it was, for the two recency settings. With recency off every season counts 1.",
      },
      {
        title: "Hold it to the spreadsheet",
        body: "The engine is tested against the original sheet, with the data frozen where the sheet stopped and only the four leagues it covered counted. For the NFL, NBA and MLB it has to match every franchise's wins, losses and season count exactly, and both scores to within 0.01. Hockey is held more loosely, to within .012 of win rate: the sheet read ESPN, two of ESPN's hockey seasons are wrong, and the site reads the NHL's own records instead. Utah is left out of that comparison, because the sheet gave it the Coyotes' seasons and the site does not.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Motion",
      "NumberFlow",
      "Vitest",
      "GitHub Actions",
      "ESPN API",
      "NHL API",
      "PWHL feed",
    ],
  },
  {
    slug: "phantomgm",
    name: "PhantomGM",
    meta: ["NBA", "Fantrax lineup engine", "In development"],
    deck: "The best lineup in every Fantrax league at once, including the leagues that cap your games.",
    intro: [
      "PhantomGM is a manager's command deck for Fantrax basketball leagues, and we are building it at FBI Basketball as a team. It plans every lineup in every league, moves players on and off injured reserve, suggests pickups and bids, and can set lineups by itself every half hour during game hours. Adds and drops always wait for the manager.",
      "It is in testing with FBI's admins before it opens to members.",
    ],
    steps: [
      {
        title: "Price a start",
        body: "A start is worth the player's value per game times his chance of playing. In head-to-head category leagues the value reads the matchup: each category is weighted by how much one more unit moves its win chance this week, so a team already winning rebounds by a mile stops chasing rebounds.",
        math: [
          "value = max(base × p(play), 0.25 × replacement × p(play))",
          "category weight = φ(z) / σ",
        ],
        figure: "pgm-play",
        caption: "Chance of playing tonight by injury status. Questionable is 0.64 for a player averaging 28 minutes or more, 0.58 below that.",
      },
      {
        title: "Solve the lineup",
        body: "Filling slots is an assignment problem: players on one side, slots on the other, every pairing scored. The Hungarian algorithm solves it exactly. Players whose games have started stay locked, a slot a player isn't eligible for costs a billion, and a tiny bonus for his current slot means ties never reshuffle a lineup for nothing.",
        math: ["cost = −(score + keep bonus)", "ineligible slot = 10⁹"],
      },
      {
        title: "Plan around games caps",
        body: "Some leagues cap how many games each slot can use in a week, which turns tonight's lineup into a question about the whole week. PhantomGM plans the period at once as a min-cost flow and will bench a player who is playing tonight to save a slot's last game for a better night. Each later day is discounted 2.5%.",
        figure: "pgm-flow",
        caption: "The flow network. Each player-day carries its value as a negative cost, and each slot's capacity is the games it has left.",
      },
      {
        title: "Bid",
        body: "FAAB bids scale with the player's rank and how much season is left: 12% of the budget for a top 50 player, falling off exponentially to about 2% by rank 150.",
        math: [
          "bid = budget × share × clamp(season left, 0.25, 1)",
          "share = 0.12 × e^(−(rank − 50) / 55)   past rank 50",
        ],
        figure: "pgm-faab",
        caption: "Share of the FAAB budget bid, by player rank, with the full season left.",
      },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Fantrax", "Vercel Cron"],
  },
  {
    slug: "lineup-lab",
    name: "Lineup Lab",
    meta: ["NFL", "Trade analyzer", "2026"],
    deck: "What does a trade do to both starting lineups, week by week?",
    intro: [
      "Trade calculators compare players. Lineup Lab compares lineups. Pick a Sleeper league and a trade partner, drag players between the rosters, and both teams re-optimize for every week in the window: who moves up off the bench, who gets cut or stashed on IR to stay legal, and who gets picked up to fill the spot. The answer is the change in projected starting points, for this week or the rest of the season.",
    ],
    steps: [
      {
        title: "Lean on the market",
        body: "Lineup Lab's own projection starts with the betting market. Where Pinnacle and Underdog price a player's stat, the de-vigged line sets it, at 85% weight with two books or 70% with one. Every stat the books don't price is Sleeper's and ESPN's projections averaged evenly, which is most stats for most players. Defenses come from Sleeper alone.",
        math: ["mean = line + probit(P(over)) × sd × line,   within ±15% of the line"],
        figure: "ll-blend",
        caption: "Where a projected stat comes from, by how many sportsbooks price it.",
      },
      {
        title: "Tilt for the game",
        body: "Team totals and spreads move whatever the books left unpriced. Touchdowns scale with 60% of a team's implied total against the league average and volume with 30%, and favorites of 6.5 or more run 4% more and throw 4% less.",
        math: [
          "r = clamp(implied total / average, 0.8, 1.25)",
          "TDs × (1 + 0.6(r − 1))   volume × (1 + 0.3(r − 1))",
        ],
      },
      {
        title: "Adjust for the matchup",
        body: "Defense versus position is measured from Sleeper's actual scoring, then regressed by how well it held from one season to the next, which was barely at all. Last season's receiver matchups didn't hold, so receivers are judged on this season's games alone, and no matchup moves a projection more than 10%. Injury tags scale what is left: doubtful to 20%, questionable after a missed practice to 60%.",
        figure: "ll-dvp",
        caption: "Year-over-year correlation of points allowed, by position, 2024 to 2025.",
      },
      {
        title: "Solve both lineups",
        body: "Each week's best lineup is a max-weight assignment of players to slots, solved exactly with the Hungarian algorithm so overlapping flex spots are handled. After a trade both rosters are made legal automatically, and before and after are played out the same way, so a player returning from IR is never credited to the trade.",
      },
    ],
    stack: [
      "Vite",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "PWA",
      "Vercel Functions",
      "Sleeper API",
    ],
  },
  {
    slug: "playcaller",
    name: "Playcaller",
    meta: ["NFL", "Lineup and waiver autopilot", "2026"],
    deck: "Twenty-six Sleeper leagues from one screen, with the safe moves running themselves.",
    intro: [
      "Playcaller is my own app for the Sleeper leagues I play in. Each league is scored with its own settings on a blend of sportsbook props, game lines and consensus projections, and the app turns that into explained moves: lineups, IR in and out, free agent adds, waiver claims with bids, and drops. Lineups and IR moves that cost nobody run by themselves, every 15 minutes on game days. Every add, drop and claim waits for me.",
    ],
    steps: [
      {
        title: "Value a roster",
        body: "A roster is worth the best lineup it can field this week and each of the next five, in the league's own scoring, with later weeks counting less. Future weeks assume a replacement-level free agent at each position, so a thin roster isn't flattered.",
        figure: "pc-weeks",
        caption: "Weight on each week of the six week horizon.",
      },
      {
        title: "Score a move",
        body: "Every candidate add is tried against every way of making room. A move scores its change in best-lineup points over the horizon, plus market value in against value out, minus a small cost for a claim so a free agent wins a close call. It has to clear a bar: 1.5 points for an open spot, 5 to cut a real player. A player the market values well above the add is never cut.",
        math: ["score = Δ lineup + clamp((value in − value out) / 150, −5, 5) + trend − claim cost"],
      },
      {
        title: "Bid only when it matters",
        body: "A bid only has to beat a rival claim, and most claims never draw one. Across 2,275 FAAB claims in these leagues, 41% of skill player claims had a rival and 1 of 14 kicker claims did. So the bid is the minimum unless the chance of a rival times what losing the player would cost is worth at least a point.",
        math: ["bid above the minimum only if P(rival) × edge ≥ 1 point"],
        figure: "pc-bid",
        caption: "Where Playcaller puts money in. Edge is the points lost to the next best option.",
      },
      {
        title: "Know when he's free",
        body: "Whether a player can be picked up now or needs a claim depends on each league's settings and the clock: waivers run at 3 AM Eastern after the waiver day, players lock at kickoff, and a dropped player sits on waivers for a set number of days. Those rules were fitted to about 3,000 real claims and adds in these leagues.",
        figure: "pc-agree",
        caption: "Share of real claims and adds from weeks 3 to 8 the rules call correctly. Most of the misses are Sunday adds, where kickoff times are approximate.",
      },
      {
        title: "Check before sending",
        body: "Before anything goes to Sleeper, each move is rechecked against the league as it is at that moment: injury designations, game locks, roster and IR room, FAAB left. A test harness runs the real executor against a simulated Sleeper through fifteen scenarios and fails if any move goes wrong.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Vercel Blob",
      "Vercel Cron",
      "Web Push",
      "Sleeper API",
    ],
  },
];

/**
 * Framed plainly on purpose (Lucas, 2026-11-10): these are things he built for
 * his own leagues and questions. They are not businesses and not income, and
 * the copy must not dress them up as either.
 */
export const labIntro = {
  title: "The Box Score",
  lede: "Projects I built for my own leagues and my own questions, in baseball, basketball and football. None of them is a business. Each is written up with its method open.",
};
