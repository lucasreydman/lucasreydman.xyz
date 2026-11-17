import type { ProjectDepth } from "../types";

/*
  Written from fbi-basketball: the routes under app/, lib/ros (the projection
  engine), lib/trade, lib/data, lib/platforms, lib/polar, lib/discord, lib/ops,
  vercel.json, supabase/migrations, tests/ and the write-ups in docs/agents.
  Every item was re-checked against the code on 2026-11-11.

  Authorship, so nothing here is misread: I lead product engineering and wrote
  the projection engine and the tools on it. The posts are the work of FBI's
  analysts, and the dynasty order is an editorial house list, not engine
  output. The FBI team set the Season Ticket card names and tiers, and the
  league-history pipeline the leaderboards read is a separate team workstream.
  Every number below is a constant or a count in the code, or a figure the
  public homepage states.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "Redraft rankings",
      summary: "Two boards, categories and points, ordered by the projection engine all year and re-priced on each member's own league settings.",
      items: [
        {
          name: "Categories and points boards",
          detail:
            "Three hundred players a board, each with a projected stat line. The categories board shows DURANT, Minus-1 and Z-Score beside the nine category chips, and the points board shows fantasy points a game and the season total.",
        },
        {
          name: "Tier shading and medals",
          detail:
            "Every chip is shaded on seven tiers by where the stat sits in the player pool, turnovers inverted, and the top three in each column wear gold, silver and bronze. Turnover medals go to ball security, judged against what a player's shots, free throws and assists predict.",
        },
        {
          name: "Custom categories with weights",
          detail:
            "A member picks 3 to 12 categories from eighteen and can weight each from 0.5 to 2 in quarter steps. The order, the value columns, the tiers and the trade calculator all recompute on that format.",
        },
        {
          name: "Custom points scoring",
          detail:
            "Weights for the six counting stats, double-double and triple-double bonuses, and five shooting stats. The bonus rates are modelled from the projected line, so a rookie with no recorded double-doubles still gets a number.",
        },
        {
          name: "Saved formats and league context",
          detail:
            "Settings save per member, separately for redraft and dynasty, with up to three named presets. Choosing a connected league applies its scoring and roster shape, draws a waiver line above the first unrostered player, and can narrow the board to free agents or the member's team.",
        },
        {
          name: "Value tiers",
          detail:
            "Tier breaks are placed by natural breaks on the season value under a fair-pick rule: the last player in a tier keeps at least a 30% chance to out-produce the first. Each break's reason is in its tooltip.",
        },
        {
          name: "Search and sort",
          detail:
            "One search box reads player names, teams, team nicknames and position words, and filters the rows already on the page with no server round trip. Sorting goes through the URL, so a sorted board is a link someone can send, and DURANT, Minus-1 and Z-Score sort on season value.",
        },
        {
          name: "CSV export",
          detail:
            "Download CSV writes from the same row builder the board renders from, so the spreadsheet is the board on screen with value, games and injury cost columns added.",
        },
      ],
    },
    {
      title: "Dynasty and contracts",
      summary: "The dynasty order is an editorial house list. My work is the tooling around it: stat profiles, format fit, team direction and contract value.",
      items: [
        {
          name: "Dynasty boards",
          detail:
            "One house list of 400 players for each scoring type. Each row carries the same stat strip as the redraft board, shaded against the engine's pool, so a player's strengths read the same on every surface.",
        },
        {
          name: "Format fit",
          detail:
            "A member's categories or scoring nudges the dynasty order. Each player's career shape per 36 minutes is compared with the pool on that format and his value moves by at most 15% either way, so nobody is added or dropped.",
        },
        {
          name: "Team direction",
          detail:
            "Rebuilding or Contending tilts every dynasty value away from or toward what the player is worth this season, and the board re-ranks on it. Retooling leaves the house order as it is.",
        },
        {
          name: "Contract Value",
          detail:
            "For salary-cap leagues. A player ranked Nth on the dynasty board is worth the Nth-largest NBA salary this season, and each row shows his salary, that value, the surplus, and the surplus summed over the rest of the deal.",
        },
        {
          name: "Contracts on the row",
          detail: "Each dynasty row shows up to six seasons of the player's contract under his chips, with option years marked. Salaries sync daily.",
        },
        {
          name: "Dynasty baseline fallback",
          detail:
            "When no list is published, a default order is built as a discounted sum of projected production over a career curve. It is labelled a heuristic in the code and is replaced entirely by a published list.",
        },
      ],
    },
    {
      title: "Trade calculators",
      summary: "Redraft and dynasty calculators that judge a trade by what it does to a team's week, in the units a manager already plays for.",
      items: [
        {
          name: "A verdict in wins",
          detail:
            "The redraft calculator plays both rosters out before and after the deal and reports the change in the chance to win a week, banded at 1, 3 and 6 points. It also gives the change in categories or fantasy points a week and in matchup wins over the rest of the season.",
        },
        {
          name: "Win-chance dial and category table",
          detail: "A semicircle dial shows the weekly win chance before and after. Each category lists its weekly change and its win chance before and after, biggest change in chance first.",
        },
        {
          name: "Uneven trades priced by the roster",
          detail:
            "A two for one has no bolted-on roster-spot charge. The model works out who is cut to make room, how many spots are filled from waivers and how often each player would start, and the notes under the verdict report it.",
        },
        {
          name: "Your real league",
          detail:
            "With a connected league the trade is played between the member's actual team and a real partner on the league's own scoring, with their power rank before and after. Roto and total-points leagues are judged on standings instead of weeks.",
        },
        {
          name: "Radar and points breakdown",
          detail: "A categories trade gets a radar of what each side gives your week. A points trade gets a table showing where each side's fantasy points come from, stat by stat.",
        },
        {
          name: "Dynasty value and picks",
          detail:
            "The dynasty verdict is the gap as a share of the bigger side, fair inside 5%, and it names a real player or pick worth about that gap. Rookie picks are tradeable as early, mid or late in a round, because nobody trading a future pick knows its slot.",
        },
        {
          name: "Read by team direction",
          detail: "The same dynasty trade is shown as a rebuilding, retooling and contending team would see it, with the member's chosen direction marked.",
        },
        {
          name: "Salary-cap mode and Discord polls",
          detail: "Dynasty trades can be checked against real salaries for cap leagues. A card holder can post a trade to the FBI Discord as a poll in one press.",
        },
      ],
    },
    {
      title: "Player pages",
      summary: "One page per player, read from the engine's projection and from box scores, shots and play-by-play.",
      items: [
        {
          name: "Hero and bio",
          detail:
            "The header is tinted in the club's colour and carries age, height, weight and season number. Tiles for team, college or pre-NBA club, birthplace and draft pick each lead with their own mark.",
        },
        {
          name: "Ranks and projected line",
          detail:
            "His rank on the redraft and dynasty boards, with podium metals for the top three, and a twelve-cell projected line shaded on the same seven tiers as the boards. The line is a projection all year, the engine's wherever it projects the player, and never last season's averages.",
        },
        {
          name: "Latest news",
          detail:
            "Up to six items from two provider feeds plus the engine's own injury and depth-chart evidence, with an event two providers reported shown as one item naming both. Provider text is licensed and never shown: headlines and summaries are written from the facts.",
        },
        {
          name: "Injury tags",
          detail:
            "Eight tags, from out for the season to probable, built from ESPN's structured fields and the NBA's official game-day report, which is read every 15 minutes. Every surface that tags an injury words it through one function, so they read identically.",
        },
        {
          name: "Shooting",
          detail: "A hexbin shot chart against league averages by zone, a zone table and a shot-distance profile, drawn from play-by-play shots.",
        },
        {
          name: "Advanced numbers",
          detail:
            "An advanced dashboard with league percentiles, DARKO standing and history, and a scoring profile. The season used is chosen per player, and a pool too small to rank against shows no percentile.",
        },
        {
          name: "Charts",
          detail: "A nine-category radar in z-scores and a game-by-game chart with season, last 30 days and last 10 games windows. Every chart is hand-built, with no chart library.",
        },
        {
          name: "In your leagues",
          detail: "A line under the name says who rosters the player in each of the member's connected leagues, or that he is a free agent there.",
        },
      ],
    },
    {
      title: "League Intel",
      summary: "Tools that read a member's own Fantrax, Yahoo, Sleeper and ESPN leagues and judge everything on that league's scoring.",
      items: [
        {
          name: "Connections",
          detail:
            "Fantrax connects with a Secret ID, Yahoo with OAuth, Sleeper with a username, and ESPN with a league link or, for a private league, two browser cookies. The account's leagues appear with the member's team linked, and a health dot shows each connection's state.",
        },
        {
          name: "H2H Planner",
          detail:
            "One head-to-head week against your opponent, where the grid of who plays when fills itself from the schedule and the injury model. Each category is priced as a chance to win it, and free agents are ranked by how much they move the chance of winning the week.",
        },
        {
          name: "Power Rankings",
          detail:
            "Every team in the league ranked by how often its roster wins a week, with record, weekly output, a bar split by position and its rank in each category. A daily snapshot gives each team's movement.",
        },
        {
          name: "Your team",
          detail:
            "The member's team against the whole league: category ranks and win chances, strengths and needs, each player's worth, the pickups that help, and a punt setting. Dynasty leagues add a dynasty panel.",
        },
        {
          name: "Trade Finder",
          detail:
            "Trades in the member's league that help them and leave the partner even or better, with filters to shop a player or target one. Every suggestion is re-judged by the trade calculator's own code before it is shown.",
        },
        {
          name: "Buy Low and Sell High",
          detail: "Players whose season so far and rest-of-season rank disagree on the member's scoring: buy lows on other teams and waivers, sell highs on theirs. Rostered players link straight into the Trade Finder.",
        },
        {
          name: "Dynasty or redraft, per league",
          detail: "Power Rankings, the Trade Finder, Buy Low and Sell High and the trade calculator read whether a league is dynasty or redraft from the member's own switch, the platform or the league's shape, and judge in that mode.",
        },
        {
          name: "Pasted league links",
          detail: "The planner also opens from a pasted Fantrax or Sleeper league link, with lineup slots and scoring read from the league itself.",
        },
      ],
    },
    {
      title: "Draft and schedule tools",
      items: [
        {
          name: "Schedule Analyzer, by day",
          detail:
            "Every team's week with opponents, back-to-backs and quality games, which are games on nights with few games league-wide. The cutoff is a slider from 5 to 11 games, and a day filter keeps only teams that play on every chosen day.",
        },
        {
          name: "Schedule Analyzer, by week",
          detail:
            "All 25 weeks in one table with heavy and light weeks coloured, league breaks marked, and three scores out of 100: regular season, playoff weeks, and the blend. The playoff window is the member's own setting.",
        },
        {
          name: "Custom date range",
          detail: "Any date range counts games, quality games and back-to-backs for every team, with presets for common windows.",
        },
        {
          name: "Team Rotations",
          detail:
            "Each team's projected starting five, rotation with minutes bars, fringe players and injury report, plus a flow chart of where an absent player's minutes go. Minutes are tonight's figure, kept separate from the rest-of-season figure the rankings use.",
        },
        {
          name: "ADP",
          detail: "Average draft position from FBI's own league drafts, by scoring type, with high and low picks. An auction price column appears only when a season has auction drafts.",
        },
        {
          name: "Draft Lottery",
          detail:
            "A weighted lottery for a rookie draft or a random order for any other, with NBA odds presets from six eras, custom ball counts, traded picks and protections. Odds are enumerated exactly up to 300,000 draw sequences, picks are revealed one at a time, and the result is a link the league can check, with nothing stored on the server.",
        },
        {
          name: "Draft room guide",
          detail: "A public page explaining the Fantrax draft queue, auto-draft and pre-rankings, written after slow drafts stalled on managers who did not know them.",
        },
      ],
    },
    {
      title: "Analyst content",
      summary: "FBI's analysts write the posts. I built what they write in and what members read on.",
      items: [
        {
          name: "Redraft and dynasty feeds",
          detail: "Posts are listed by mode with pagination. Each post is gated by the audience its author picks: every member, Black Card for redraft, Gold Card for dynasty, or Diamond only.",
        },
        {
          name: "Post composer",
          detail:
            "A markdown editor with a toolbar, image upload, paste-to-link, list continuation and an audience picker. An analyst can drop in a PDF, text or Markdown file and its text goes into the draft.",
        },
        {
          name: "Sharing a post",
          detail:
            "Every post has a share bar. A visitor with no account who opens a shared link gets a public preview with the title, byline and opening paragraphs, plus its own Open Graph card, then a sign-up panel that returns them to the post.",
        },
        {
          name: "Rankings editor",
          detail: "A drag-to-order list editor with drafts kept in the browser. Publishing rankings is restricted to admins, and analysts publish posts only.",
        },
        {
          name: "Live refresh on publish",
          detail: "Boards that read a published list subscribe to publishes over Supabase Realtime, so a new list reaches an open page without a reload.",
        },
      ],
    },
    {
      title: "Leagues and leaderboards",
      summary: "FBI runs its own leagues. The history behind these pages comes from the FBI team's league database, which a separate pipeline maintains and the site mirrors daily.",
      items: [
        {
          name: "Team Directory",
          detail:
            "Who plays where across FBI's leagues, built by joining the league archive, the hosted leagues, the World Cup draw and manual links, with no form for anyone to fill in.",
        },
        {
          name: "Open Leagues",
          detail: "Leagues with seats left, each with a fill bar and stakes, sortable by stakes, seats left, closeness to full or entry fee.",
        },
        {
          name: "World Cup",
          detail:
            "The 2026-27 field is 576 managers in 48 divisions of 12 across 4 conferences. Registration ran on the site with a one-click join link from Discord, each entry was confirmed against the payment provider's export, and the registration pages were archived once it closed.",
        },
        {
          name: "Leaderboards",
          detail: "Three boards: the FBI World Ranking, Podium Points with filters by league type and scoring format, and the World Cup. Free accounts see the top ten and a card reveals every rank.",
        },
        {
          name: "Manager career pages",
          detail: "Each manager has a page with their seasons, finishes and hardware. A member's own page is free, and other managers' pages need a card.",
        },
        {
          name: "Trophy Case",
          detail: "A member's own titles, podiums and banners, with the full case a Diamond Card feature. A member with no linked history can claim it by Fantrax username or account email.",
        },
        {
          name: "My Leagues",
          detail: "The leagues connected from Fantrax, Yahoo, Sleeper and ESPN, then the member's past leagues from the archive with their career milestones, on one page.",
        },
      ],
    },
    {
      title: "Season Ticket and accounts",
      summary: "Access is sold as four cards. The FBI team set the card names and what each covers, and I built the catalogue, checkout and fulfilment.",
      items: [
        {
          name: "Four cards",
          detail: "White is free, Black covers redraft, Gold covers dynasty and Diamond covers everything. A card is a one-time purchase for the season, with no subscription.",
        },
        {
          name: "One catalogue",
          detail:
            "The same picker renders as the upgrade modal on any locked page and as the public cards page, and a separate screen sells a Black or Gold holder the upgrade to Diamond. Prices are read from the payment provider in minor units and a named currency, with a coded fallback only for when checkout is closed or the read fails.",
        },
        {
          name: "Previews in place of walls",
          detail:
            "Where a locked page has a preview, the cut is made in the data on the server, so locked rows never reach the browser. Without a Diamond Card, the Schedule Analyzer is sent one week and Team Rotations a team's starting five.",
        },
        {
          name: "Discord sign-in",
          detail:
            "Members sign in with Discord. Signing in tries to add them to the FBI server, and a banner with a re-check button appears on every member page for as long as the site knows they are not in it.",
        },
        {
          name: "Card roles in Discord",
          detail: "A member's card becomes a Discord role, granted at sign-in and reconciled daily. Their card badge shows beside their name on the leaderboards, manager pages and Team Directory.",
        },
        {
          name: "Settings",
          detail: "Name and picture, connections, card, FBI league history, saved formats and account, each in one place.",
        },
        {
          name: "Front doors",
          detail: "A visitor with no session who lands on a tool URL sees a page describing that tool instead of a login redirect. A door never shows board data or a price.",
        },
      ],
    },
    {
      title: "Around the app",
      items: [
        {
          name: "Command menu",
          detail: "Ctrl or Cmd K searches pages and players. Pages come from the viewer's own navigation, so locks and staff rows match the sidebar.",
        },
        {
          name: "Notification bell",
          detail:
            "Injury changes, role news and big rank moves for the players on a member's own teams, new posts their card opens, and card notices. The feed is computed on read from tables that already exist, with one seen-at timestamp per member and no notifications table.",
        },
        {
          name: "Installable app",
          detail:
            "The site installs as a standalone app with a hand-written service worker. It never caches page HTML or API responses, so a deploy cannot be masked by a stale cache, and it shows an offline screen when the network is gone.",
        },
        {
          name: "Phone layouts",
          detail: "The rankings boards reflow to a two-line row with all nine category chips visible at 375 pixels. A floating menu button opens the nav drawer, which dismisses by swipe like the format panel and the command menu.",
        },
        {
          name: "Interaction details",
          detail:
            "Board resets and format saves offer an Undo toast in place of a confirm dialog, and checkout buttons disable on the first press. Player links on the rankings board prefetch on hover, and the player page arrives with a view transition.",
        },
        {
          name: "Merch shop",
          detail:
            "Tees, hoodies and caps with guest checkout through PayPal and fulfilment by Printful. There is no orders table: the PayPal order is the record.",
        },
      ],
    },
    {
      title: "Staff tools",
      summary: "What admins and analysts see that members do not.",
      items: [
        {
          name: "View As",
          detail: "An admin previews the site as any card. Pages holding private data gate on the effective role, so previewing as a lower card removes them from the screen too.",
        },
        {
          name: "Show gating",
          detail: "A switch that marks every nav row with the cards that open it, derived from the same entitlement function the pages gate on.",
        },
        {
          name: "Admin dashboard",
          detail: "KPI cards, each with its change since the previous day and a two-week sparkline, and a signup funnel.",
        },
        {
          name: "Access management",
          detail: "Give and revoke cards by hand. A Green Card makes an analyst.",
        },
        {
          name: "How the engine works",
          detail:
            "A page that walks the projection engine stage by stage with live constants, row counts, the nightly timeline, the last run's stage timings and Claude spend against budget. One chosen player is traced through the arithmetic and checked against the stored row.",
        },
        {
          name: "Data Ops and history",
          detail: "Run roster sync, baseline recompute and the league-history mirror from the browser, and watch the NBA history backfill season by season.",
        },
        {
          name: "League provisioning",
          detail: "Every hosted league with its counts, the ledger of entries and a review queue for anything the automation will not guess about.",
        },
        {
          name: "Registrations and roles",
          detail: "World Cup registrations with claimed and confirmed payment states and CSV export, and a view of each division's Discord role and channel.",
        },
      ],
    },
  ],
  engineering: [
    {
      name: "Preseason baseline",
      detail:
        "Each veteran's prior blends his last three seasons weighted 9, 3 and 1, regressed toward the league mean by a games-equivalent constant set per stat (20 for points, 160 for steals), with an age curve that pivots at 26. Those weights, constants and the curve were chosen on one backtest fold and validated on a held-out season.",
    },
    {
      name: "Rookies",
      detail:
        "A rookie has no NBA history, so the size of his role comes from his draft slot through a decay curve and the shape of his line from his college production. The code labels the rookie model a heuristic.",
    },
    {
      name: "The engine run",
      detail:
        "Eight isolated, timed stages: ingest box scores, injuries and depth charts, self-heal team assignments, load inputs, project, apply the news layer, persist. A failed ingest leaves yesterday's data in place, and the run is recorded as ok, partial or error.",
    },
    {
      name: "Two runs a day",
      detail:
        "The engine runs at 08:00 UTC and again at 21:30 UTC, after teams file injury reports. The second run writes no snapshot, so day-over-day movement stays morning to morning.",
    },
    {
      name: "Per-minute rates",
      detail:
        "Game logs are decayed by 0.985 per day, then shrunk toward the player's own preseason line with padding constants denominated in minutes and attempts. The prior's weight fades with team games played.",
    },
    {
      name: "Minutes",
      detail:
        "Projected minutes blend the season with recent games, counting only recent games whose lineup context matches today's, so a fill-in's big week stops counting when the starter returns. An absent player's minutes go to teammates by position overlap, depth and headroom, and the engine keeps two horizons: rest-of-season minutes for the rankings and tonight's for Team Rotations.",
    },
    {
      name: "Games and injuries",
      detail:
        "Games missed come from ESPN's structured return dates counted against the team's schedule, with placeholder dates dropped and a short absence of three games or fewer costing nothing. A leading rotation player's share of games is his own history blended with a league curve, and a table of past absences by cause forgives one-off injuries and counts recurring lower-body ones in full.",
    },
    {
      name: "Team budgets",
      detail:
        "A team's projections have to add up to one NBA team: expected minutes are capped and filled to the team total across its 15 biggest roles, and shots, assists and rebounds are capped. A player's points always equal his shooting line.",
    },
    {
      name: "The news layer",
      detail:
        "Claude reads injury reports, depth moves and recent news for up to 40 players a batch and returns bounded adjustments with citations. It may only change what the news is about: a games tier moves games, an out-for-season call can only lower a player, and a role call that cites only what the projection already prices is recorded inert.",
    },
    {
      name: "Carried verdicts",
      detail:
        "Verdicts carry forward while a report is unchanged and are re-read every three days. Without the model the engine still runs, and the cron deliberately reports a partial run.",
    },
    {
      name: "Category valuation",
      detail:
        "Each category is a z-score against the engine's pool. Minus-1 drops a player's worst category, DURANT drops turnovers and his next-worst, and for valuation only, half of steals and blocks are read at the pool's per-minute rate.",
    },
    {
      name: "The categories order",
      detail:
        "The engine's order uses plain Z, with Minus-1 phased in for the best profiles through a logistic curve on Minus-1 rank. Plain Z with forgiveness for the best profiles was chosen over DURANT and Minus-1 by simulated twelve-team drafts over eight seasons.",
    },
    {
      name: "Season score",
      detail:
        "A player's score is his value per game above the replacement player (rank 169, the first one a 12-team, 14-man league leaves unrostered) times expected games, minus a stash cost for each game missed through injury, priced at the rank-90 player's surplus. Below the replacement line the shortfall is priced over the full season, so the two sides meet at the line.",
    },
    {
      name: "Judging a change",
      detail:
        "An in-season sweep reruns the board at four points across six past seasons and compares any constant, paired, against the current one. A second harness drafts from the engine's board against an ADP room and plays every real week, so a change is judged on matchups won as well as rank correlation.",
    },
    {
      name: "The trade model",
      detail:
        "The server ships every projected player's line and games on the member's format and the browser replays the trade. Who starts each night is a Poisson-binomial over the players above him, averaged over the real spread of NBA slate sizes.",
    },
    {
      name: "Weekly win chance",
      detail:
        "Each category's chance is a normal probability against how much a week swings in that category, measured on three seasons of box scores by league shape. A matchup is an exact convolution over the categories, which are treated as independent.",
    },
    {
      name: "Schedule scoring",
      detail:
        "Four measures per team (heavy weeks, light weeks, quality games, back-to-backs) are standardised across the league, clamped at 2.5 standard deviations and weighted 35, 25, 25 and 15, on a scale where 50 is average. The playoff score uses games, quality games and back-to-backs in the member's playoff weeks.",
    },
    {
      name: "Four league hosts, one vocabulary",
      detail:
        "Every tool reasons in one set of parsed shapes, and each platform is translated into them at the edge, with league keys that carry the platform and one loader behind every surface. Fantrax reads through a Secret ID stored under AES-256-GCM, Yahoo is OAuth with GET-only calls and an XML parser built so a collection of one still comes back as an array, Sleeper needs only a username, and ESPN reads private leagues with the member's two cookies under the same encryption.",
    },
    {
      name: "Roles and entitlements",
      detail:
        "Supabase Auth with Discord OAuth and row-level security, where role and card resolve to one entitlements object that pages, the nav and API routes all gate on. Per-viewer reads are deduped per request and never cached across requests, and View As is a cookie only an admin can set.",
    },
    {
      name: "Payments and fulfilment",
      detail:
        "Cards are sold through Polar as merchant of record, one product per card plus a Diamond upgrade. The signature-checked order webhook joins on the Supabase user id carried as the customer's external id, never on email, then grants the tier and the Discord role, and a refund ends the access.",
    },
    {
      name: "Payment edge cases",
      detail:
        "Staff purchases deliberately write nothing, since writing a subscriber role onto an admin would demote them. The Polar API version is pinned in code, and the setup script pins the webhook endpoint to the same version.",
    },
    {
      name: "Entry fees and hosted leagues",
      detail:
        "Competition entry fees run through a separate provider. A cron every 30 minutes pulls each open league's entrant export, matches paid entrants to FBI accounts, queues their Fantrax team for a provisioning worker and updates the league's capacity post in Discord.",
    },
    {
      name: "Entry ledger",
      detail:
        "The ledger is keyed on the league and the provider's entry id, so a re-run cannot add anyone twice. Anything ambiguous goes to a review queue.",
    },
    {
      name: "Discord bot",
      detail:
        "A daily job reconciles card and World Cup roles, counter channels update every 15 minutes, and slash commands arrive at a signature-checked endpoint. The World Cup role sync has two brakes: an empty read revokes nothing, and more than 50 revocations in one run revokes none.",
    },
    {
      name: "Impersonation guard",
      detail:
        "Every 10 minutes a guard checks the server's member list for accounts imitating one staff member, on handle, display name and avatar by perceptual hash. A full match is banned automatically unless a brake applies, such as a staff role, a membership older than 30 days or too many matches in one run.",
    },
    {
      name: "Data without stats.nba.com",
      detail:
        "The NBA's stats site does not answer from cloud IPs, so the nightly jobs read sources that answer from Vercel, with ESPN as the fallback for the one job that still tries it. Player analytics are computed from ESPN box scores and play-by-play, and on-court ratings, pace and usage come from lineups rebuilt from play-by-play.",
    },
    {
      name: "Self-maintaining rosters",
      detail:
        "Rosters, experience, positions and bios keep themselves current nightly. Roster changes over a per-night cap are held for review.",
    },
    {
      name: "Board performance",
      detail:
        "A 300-row board renders about 2,700 stat chips, so repeated row markup carries no inline styles, one markup tree reflows between phone and desktop, and column tracks are custom properties set once on the wrapper. A unit test pins these invariants.",
    },
    {
      name: "Caching",
      detail:
        "Cross-request caches hold viewer-independent data only, each with a tag from one file, and each engine run clears the pool tag. The board pool also keys on the newest publish time, so a publish is a cache miss even if a tag call is forgotten.",
    },
    {
      name: "Cron jobs and the daily briefing",
      detail:
        "24 cron schedules in vercel.json across 23 routes, each wrapped to record its name, timing, status and the start of its response. A daily briefing posts to a private Discord channel, green or red, checking each job's last successful run and a freshness bound on the table it writes.",
    },
    {
      name: "Spend and movers",
      detail:
        "Claude spend is metered per call against a monthly budget. Each morning run's biggest risers and fallers are posted with reasons.",
    },
    {
      name: "Database",
      detail:
        "more than 170 SQL migrations, applied to a fresh database in CI and by a pre-push hook whenever a push touches them. A test fails any new table that carries no service-role grant.",
    },
    {
      name: "Preview sandbox",
      detail:
        "Preview deployments are set up to authenticate as a Postgres role with select on every table and write on none, so a branch pushed to look at cannot change production data.",
    },
    {
      name: "Tests",
      detail:
        "more than 330 unit test files run hermetically in Vitest, with typecheck, lint and a docs audit beside them in the pre-push gate. 27 Playwright specs cover gating, row-level security, the editors, the upgrade flow and a responsive matrix.",
    },
    {
      name: "Deployment",
      detail: "A secret scan runs on every pull request, and production deploys from master on Vercel.",
    },
  ],
};
