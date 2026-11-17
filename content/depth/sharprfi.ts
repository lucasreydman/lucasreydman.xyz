import type { ProjectDepth } from "../types";

/*
  SHARPRFI, written from its repo: app/ (ClientShell, GameTable, GameRow,
  MatchupDetail, EvCalculator, ConfigPanel, MethodologyView), app/api/games,
  lib/ and scripts/backtest.mjs. Every number below is a constant in that code
  or a figure from the backtest the README documents.

  Credit: the product's footer reads "Built by Lucas Reydman & Francisco
  Nevarez". The simulation engine and the bet value layer are adapted from
  Francisco's model, and the copy says so.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "The daily slate",
      summary: "One table of every MLB game on the day, ranked by the side you are betting.",
      items: [
        {
          name: "A probability and a price for every game",
          detail:
            "Each game shows the model's chance of a first-inning run to two decimals, and beside it the break-even odds for that bet. There is no sportsbook feed, so you compare the threshold with your own book.",
        },
        {
          name: "NRFI and YRFI from one model",
          detail:
            "A toggle in the header switches every view between the two sides of the bet: probabilities, odds, sort order, result colours, the accent (green for YRFI, red for NRFI) and the methodology copy. The API returns the YRFI probability and the NRFI view takes its complement, so the two sides always sum to 100%.",
        },
        {
          name: "Today and tomorrow",
          detail:
            "Two date tabs, anchored to the Pacific calendar day so the slate does not change over while west coast games are still to be played.",
        },
        {
          name: "Upcoming, in progress, settled",
          detail:
            "Games are grouped by status and sorted within each group by the active side's probability. A game that is still being played moves to Settled as soon as its first inning is decided.",
        },
        {
          name: "Probability colour scale",
          detail:
            "Percentages are coloured on a nine-step red to green scale fitted to the range the model produces (44 to 60% for YRFI, 45 to 62% for NRFI), so greener always means a stronger case for the active side.",
        },
        {
          name: "Weather and first pitch in the row",
          detail:
            "Each row shows temperature, wind and start time. Wind under 5 mph reads Calm, the seven parks flagged as roofed read Roof, and a failed weather lookup shows a dash.",
        },
        {
          name: "Desktop table and mobile cards",
          detail:
            "The desktop view is a fixed-width nine-column table. On a phone each game becomes a card with the same fields, and the controls collapse to matched pills.",
        },
      ],
    },
    {
      title: "Matchup breakdown",
      summary: "Tap any row or card and it opens in place to show how the number was built.",
      items: [
        {
          name: "Both engines side by side",
          detail:
            "A Models section shows the Poisson probability with each team's expected runs, and the simulation's probability with its expected runs and hits for the inning. A badge marks that each contributes half of the headline.",
        },
        {
          name: "A starter card per half inning",
          detail:
            "Each half shows the opposing starter's FIP, strikeout rate, barrel rate and the expected runs they lead to. A badge says whether he is confirmed, estimated from fallback inputs, or still TBD.",
        },
        {
          name: "The posted lineup",
          detail:
            "When a batting order is posted, the card lists the first five hitters with their adjusted on-base rate and plate appearances. When it is not, the card says the team's season on-base rate is being used and shows that figure.",
        },
        {
          name: "Factor chips",
          detail:
            "Each factor shows the multiplier it applied, an arrow for its direction and a short description. Pitcher and lineup descriptions change with the size of the effect in five bands, for FIP from \"excellent run prevention\" to \"run-prone FIP\", and orange marks a push toward scoring while blue marks a pull away from it.",
        },
        {
          name: "Park and weather card",
          detail:
            "The venue with its park multiplier, the temperature and the wind. A park more than 5% from average is labelled with the percentage, and wind of 10 mph or more is described as blowing in, blowing out or a crosswind for that park.",
        },
        {
          name: "Units follow your preferences",
          detail:
            "The breakdown describes temperature and wind in Celsius and km/h when those are selected, without changing the model's inputs.",
        },
      ],
    },
    {
      title: "Pricing a bet",
      summary: "The model gives a threshold. This part answers whether the price you are being offered clears it.",
      items: [
        {
          name: "Break-even odds",
          detail:
            "The Bet at price is rounded toward the bettor on both sides, so a price shown as \"or better\" never loses at the stated probability: 61% reads -156, where -157 would need 61.09%. Even money displays as +100.",
        },
        {
          name: "Bet value calculator",
          detail:
            "Inside each matchup you can enter your book's odds and get the implied probability, the model's probability and the expected value per unit staked. This layer is adapted from Francisco Nevarez's model.",
        },
        {
          name: "A banded verdict",
          detail:
            "The calculator labels the price in four bands by expected value per unit: bet at +0.05 or better, slight +EV above zero, pass down to -0.05, and no bet below that.",
        },
        {
          name: "Built for a phone keypad",
          detail:
            "American odds are split into a plus or minus toggle and a number field, because numeric keypads on phones have no sign key. A number under 100 is rejected with a hint, and the empty field shows the fair value.",
        },
        {
          name: "American or decimal",
          detail: "A preference switches every Bet at price between American and decimal odds.",
        },
      ],
    },
    {
      title: "Marking uncertainty",
      summary: "The table says when a number rests on missing or provisional inputs.",
      items: [
        {
          name: "Estimate marker",
          detail:
            "A tilde in front of the percentage means a probable starter is still TBD, or a named starter is running on league-average fallback stats because a feed had nothing for him.",
        },
        {
          name: "No price without a starter",
          detail:
            "Break-even odds are hidden only when a probable starter is unannounced. A named starter with partial data still gets a price, with the estimate marker.",
        },
        {
          name: "Lineups picked up when they post",
          detail:
            "Before a batting order exists the model uses the team's season on-base rate, and a league-average hitter in the simulation. Once the order is posted it is read on the next refresh, and the screen tells you to check back 30 to 60 minutes before first pitch.",
        },
        {
          name: "Roofs treated as neutral",
          detail:
            "Seven parks flagged as roofed or retractable have weather switched off, because the roof state is not known in advance.",
        },
        {
          name: "Postponed games drop out",
          detail:
            "Postponed, cancelled and suspended games are removed from the slate. A delayed game stays in progress, and an unrecognised status is treated as upcoming so nothing is settled by mistake.",
        },
        {
          name: "A list of what the model misses",
          detail:
            "The methodology page ends with seven stated gaps, including bullpen usage and opener strategies, umpires, day and night splits, in-game weather changes, and the simulation not seeing weather at all.",
        },
      ],
    },
    {
      title: "Results and refresh",
      items: [
        {
          name: "First-inning result pills",
          detail:
            "Each game shows RUN, NO RUN, IP while the first is being played, or a dash before it starts. The pill is green when the active side won and red when it lost, so the same RUN is green in YRFI mode and red in NRFI mode.",
        },
        {
          name: "Settled the moment it is decided",
          detail:
            "A run in the top of the first marks the game RUN straight away, without waiting for the bottom half. NO RUN needs both halves on the line score.",
        },
        {
          name: "Automatic refresh",
          detail:
            "The slate is fetched again every five minutes in the background, and the screen re-renders every minute so clocks stay current without another request.",
        },
        {
          name: "Manual refresh that skips the cache",
          detail:
            "The Refresh button asks the server to recompute the slate, bypassing the five-minute cached response. The status bar shows when the numbers were generated and how many games are on.",
        },
        {
          name: "Loading and failure states",
          detail:
            "A skeleton with an elapsed-seconds counter shows while a slate loads. A failed request shows the error with a Retry button, and a day with no games says so.",
        },
      ],
    },
    {
      title: "Preferences",
      summary: "Saved in the browser and applied everywhere.",
      items: [
        {
          name: "Temperature and wind units",
          detail: "Fahrenheit or Celsius, mph or km/h, applied to the table, the cards and the breakdown text.",
        },
        {
          name: "Time zone",
          detail:
            "First pitch times follow the device by default, with ten named zones to choose from, from Hawaii to Sydney.",
        },
        {
          name: "Remembered between visits",
          detail:
            "Units, odds format, time zone and the NRFI or YRFI choice are kept in local storage. A first-time visitor lands on YRFI.",
        },
        {
          name: "A panel that fits the screen",
          detail:
            "On desktop the preferences open as a popover under the button. On a phone they open as a centred dialog with a Close button, and Escape or a click outside closes either.",
        },
      ],
    },
    {
      title: "Methodology page",
      summary: "A second tab that explains the model in full, with the formulas typeset.",
      items: [
        {
          name: "Why this bet",
          detail:
            "The page opens with the reasoning for the active side: for YRFI, that books can shade the popular NRFI price, and for NRFI, that starter quality drives the first inning.",
        },
        {
          name: "Every factor, with its formula",
          detail:
            "A table lists the eight inputs to expected runs, each with its formula and a sentence on why it is damped the way it is. The phone layout also names each factor's data source.",
        },
        {
          name: "Both engines and the blend explained",
          detail:
            "The Poisson steps, the simulation's rules, and the conversion to break-even odds are each written out, with the backtest figures that decided the blend.",
        },
        {
          name: "Formulas that fit a phone",
          detail:
            "The equations are set with KaTeX, with shorter mobile versions of the long ones so they stay on screen without sideways scrolling.",
        },
        {
          name: "Sources linked",
          detail: "MLB Stats API, Baseball Savant, FanGraphs and Open-Meteo are each credited with what they supply.",
        },
      ],
    },
  ],

  engineering: [
    {
      name: "Two engines, averaged",
      detail:
        "The headline probability is the simple average of a Poisson model and a batter-level Monte Carlo simulation, and one constant in lib/model-config.ts sets which engine ships. The Poisson model sees weather and contact quality but reduces a lineup to on-base rates, while the simulation plays through the posted batting order and ignores weather.",
    },
    {
      name: "The Poisson engine",
      detail:
        "Expected first-inning runs for each half start at 0.3371 and are multiplied by factors for FIP, strikeout rate, barrel rate, team on-base rate, the top of the order, park and weather. Most carry an exponent below one (0.55 for FIP, 0.35 for barrels, 0.70 for on-base, 0.45 for the top of the order, 0.50 for park and weather), the strikeout factor is clamped to between 0.85 and 1.15, and the product is clamped to between 0.55 and 1.55.",
    },
    {
      name: "A baseline checked against outcomes",
      detail:
        "The chance of a run is one minus the chance that both halves score zero, and 0.3371 is the per-half rate that makes a neutral game come out at 49.05%: 3,575 of the 7,290 completed regular-season games from 2023 to 2025, the pitch clock years, had a first-inning run. The repo's lessons file records the rule behind it: in a multiplicative model, check the neutral baseline against outcomes before tuning weights.",
    },
    {
      name: "Shrinkage that eases through the season",
      detail:
        "Each Poisson input rate is pulled toward league average by n / (n + k), with k set per stat: 45 innings for FIP, 150 batters faced for strikeout rate, 50 innings for Statcast rates, 600 plate appearances for team on-base rate and 180 for top-of-order hitters. Those k values are multiplied by 1.75 on March 15 and fall linearly to 1.00 by July 1, so April samples are trusted less.",
    },
    {
      name: "Weighting the top of the order",
      detail:
        "The first five hitters are weighted by the chance each one bats in the first inning: 1 for the first three, 0.672 for the fourth and 0.366 for the fifth, from a binomial on a 0.69 out rate. Their weighted on-base rate is compared with the team's, the ratio is capped between 0.90 and 1.12, and fewer than three usable hitters leaves the factor neutral.",
    },
    {
      name: "The simulation engine",
      detail:
        "Contributed by Francisco Nevarez and adapted for the site. Each batter's reach probability comes from season wOBA shrunk by plate appearances, a platoon adjustment against the starter's hand, the starter's on-base rate allowed and the square root of the park factor, and each half inning is played 10,000 times with a random generator seeded by the game's id, so the same inputs always return the same number.",
    },
    {
      name: "Changes to the contributed model",
      detail:
        "The adaptation made the opposing pitcher affect reach probability, simulated all nine hitters where the original stopped at four, and advanced runners on walks only when forced.",
    },
    {
      name: "Calibrating the simulation",
      detail:
        "Runners advance station to station, with no steals, errors or wild pitches, which undercounts scoring: uncalibrated, the simulation gave about 40% league-wide. One constant, 1.2333, found by binary search, scales reach probability so league-average inputs reproduce the observed base rate, and the methodology page states that this compensates in aggregate and does so for no individual matchup.",
    },
    {
      name: "Park and weather",
      detail:
        "Park factors for all 30 stadiums are a hand-maintained table of FanGraphs run factors, and each stadium also has coordinates and the compass bearing its outfield faces, so a wind direction can be resolved as in, out or across for that park. The forecast is read for the hour nearest first pitch, in UTC on both sides; wind counts only at 10 mph or more and temperature only below 55 or above 80 degrees.",
    },
    {
      name: "Three free data feeds, reconciled per game",
      detail:
        "The MLB Stats API supplies the schedule, probable starters, pitcher and team season lines, the live game feed, line scores and handedness. Baseball Savant supplies barrel and hard-hit rates as a CSV and Open-Meteo supplies hourly weather, from its forecast endpoint or from its archive for past dates, and none of the three needs a key.",
    },
    {
      name: "FIP from components",
      detail: "FIP is computed in the app from home runs, walks, hit batters, strikeouts and innings, with a 3.10 constant.",
    },
    {
      name: "Lineups from the live feed",
      detail:
        "The schedule endpoint's lineup data was not reliable before games, so batting orders come from each game's live feed. For the simulation only starters are taken, by batting-order codes that are whole hundreds, so a substitute listed in the same slot is left out.",
    },
    {
      name: "Building the slate",
      detail:
        "One API route builds the whole slate on request: weather per venue, stats per pitcher and team, and lineups per game are fetched in parallel, and handedness is looked up in batches of up to 100 players. The finished response is cached in Vercel KV for five minutes under a versioned key, and there is no scheduled job.",
    },
    {
      name: "Cache lifetimes per source",
      detail:
        "Season stat lines revalidate every five minutes, weather every thirty and handedness daily. The schedule, lineups and line scores are never cached.",
    },
    {
      name: "Guarding the Statcast cache",
      detail:
        "The Savant CSV is parsed with two sets of column names, and is cached for twelve hours only if it has at least 300 rows and 100 valid ones. A short or malformed download is discarded, so a bad file cannot sit in the cache giving every pitcher league-average values.",
    },
    {
      name: "Failing toward neutral",
      detail:
        "A missing starter, stat line or Statcast row becomes league average and is flagged as estimated, a failed weather call becomes 72 degrees with no wind, an unknown venue gets a park factor of 1.00, and an empty lineup becomes a league-average hitter. A failure of the route itself returns an error that the screen shows with a Retry button.",
    },
    {
      name: "The backtest",
      detail:
        "A script replays a date range through both engines and reports the Brier score, the gap between average prediction and actual rate, and five calibration bins. Over 1,344 games from 2026-03-26 to 2026-07-05 the blend scored 0.2447 with a calibration gap of +1.2%, the simulation alone 0.2463 (+3.5%) and the Poisson model alone 0.2476 (-1.1%).",
    },
    {
      name: "A backtest that can be interrupted",
      detail:
        "The script checkpoints each date to disk so an interrupted run resumes, and it backs off and retries when an API answers 429. It keeps regular-season games only, which leaves out the All-Star Game and the postseason.",
    },
    {
      name: "What the backtest rejected",
      detail:
        "The contributed model's win-streak multipliers were tested in the same run and scored 0.2538 with a calibration gap of +7.8%, so they are switched off by a constant, and the contributed script reproduced as coded scored 0.2577 with a gap of -10.3%. The script can also compare alternative early-season shrinkage schedules against the current one.",
    },
    {
      name: "The backtest's weaknesses",
      detail:
        "The script requests each pitcher's and team's season line, and the Savant season file, as they stand when the script runs, so a prediction for an April game uses stats that include later games. Its Poisson lineup factor is also a plain average of the first three hitters where the live model weights five, and since a constant 50% guess always scores 0.2500, the blend's 0.2447 is a small edge.",
    },
    {
      name: "Tests and deployment",
      detail:
        "Jest covers the library code in nine test files: the Poisson math, the simulation, game status and result logic, mode switching, the breakdown multipliers, the Savant parser, the KV wrapper, weather and the MLB client. The app is Next.js on Vercel, and the KV wrapper falls back to an in-memory store for local work and strips wrapping quotes from its environment values, which can otherwise break the KV client at runtime.",
    },
  ],
};
