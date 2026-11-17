import type { ProjectDepth } from "../types";

/*
  Written from the fantasy-lineup-lab repo: src/components (every panel),
  src/lib (lineup, trade, waivers, blend, flags, season, sleeper, touchDrag),
  api/ and shared/ (the market and defense feeds), vite.config.ts and the tests.
  Every number here is a constant or a count in that code.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "Opening a league",
      summary: "There is no account to make. A Sleeper username or a league ID is enough.",
      items: [
        {
          name: "Find leagues by username",
          detail:
            "Type a Sleeper username and the app lists that account's NFL leagues for the season, each with its team count, scoring format and a Superflex note. The username is remembered, so the list loads by itself on the next visit.",
        },
        {
          name: "Open by league ID",
          detail: "Any league can be opened by pasting its ID, which is how you look at a league you are not in.",
        },
        {
          name: "Demo league",
          detail:
            "A 10-team PPR league built on the spot from one Sleeper projections call: a 14-round snake draft by current ADP, at most two quarterbacks and two tight ends per team, then a kicker and a defense each. It lets someone try the tool without a Sleeper account.",
        },
        {
          name: "Your team picked for you",
          detail:
            "The app matches your Sleeper user ID against each roster's owner and co-owners and opens on your team. Either side can be changed to any other team in the league, and a team cannot be chosen against itself.",
        },
        {
          name: "League header",
          detail:
            "The header shows the league name, team count, the current week and a scoring label read from the league's settings: PPR, Half PPR, Standard or a custom reception value, plus any tight end premium.",
        },
        {
          name: "Plain errors",
          detail:
            "An unknown username, an account with no leagues this season and a league with fewer than two rosters each get their own message. A league ID that Sleeper does not recognise shows the failed request's status code and returns to the start screen.",
        },
      ],
    },
    {
      title: "Building a trade",
      summary: "Four ways to put a player in the trade, so it works with a mouse and with a thumb.",
      items: [
        {
          name: "Trade bar",
          detail:
            "You send and You receive each have an Add player picker that searches that team's roster by name, NFL team or position and lists it in position order. Players in the trade show as chips, with a dot when their worst flag is a warning or worse.",
        },
        {
          name: "Drag between rosters",
          detail:
            "Drag a row from one team's panel to the other. While anything is being dragged, both panels outline themselves as drop zones and say what a drop there will do.",
        },
        {
          name: "Press and hold on a phone",
          detail:
            "Most touch browsers do not fire drag events, so a 260 millisecond press lifts the row into a chip that follows the finger. A swipe that moves more than 10 pixels before the hold finishes is left alone as a scroll.",
        },
        {
          name: "Drop dock",
          detail:
            "When the two rosters are stacked, the other team can be a long way down. While a drag is in progress both teams are pinned to the bottom of the screen as large drop targets, and the page scrolls when the finger nears the top edge or the dock.",
        },
        {
          name: "Row actions",
          detail:
            "Every row has its own actions: trade to the other team, drop, move to IR, activate, add, or undo. On a desktop they are buttons on the row, and on a phone they sit behind one button that opens the player card, except a single main action such as Add.",
        },
        {
          name: "Reset with undo",
          detail:
            "Reset sends every player back and clears every drop, IR move and pickup on both teams. For 6 seconds a bar offers to undo it, and the offer is withdrawn if you start a new change, so an undo can never overwrite newer work.",
        },
        {
          name: "The trade lives in the link",
          detail:
            "League, both teams, the players each way, the week range and the projection source are written to the URL as you work, so copying the address shares the trade, though not any drops or pickups you chose by hand. If a shared link is stale and a player is no longer on the team sending him, he is removed instead of landing on a roster twice.",
        },
      ],
    },
    {
      title: "Projected impact",
      summary: "The answer to the trade: what it does to both starting lineups, over the weeks you care about.",
      items: [
        {
          name: "Week ranges",
          detail:
            "Presets for this week, the next 3 weeks, the rest of the regular season, the rest of the season and the playoffs, plus two selectors for any start and end week. The playoff weeks come from the league's own settings (start week, bracket size, one or two week rounds), and presets that would cover the same weeks are shown once.",
        },
        {
          name: "Before and after for both teams",
          detail:
            "Each team gets a card with its projected starting lineup total before the trade, after it, the difference and the difference per week.",
        },
        {
          name: "Verdict",
          detail:
            "One line reads the two differences: win-win, helps you and hurts them, helps them more than you, hurts both lineups, or roughly neutral. A change smaller than 0.05 points counts as no change.",
        },
        {
          name: "Change by week",
          detail:
            "When more than one week is selected, a bar chart shows one pair of bars per week, your change beside your partner's, on an axis that picks its own round gridlines. The two series colours identify the teams and the side of the zero line says whether the week got better or worse.",
        },
        {
          name: "Pick a week from the chart",
          detail:
            "Click or tap a week, or use the two arrows, and the lineups below switch to it. Hovering shows the figures in a tooltip, and the selected week's figures are always written out under the chart because touch screens have no hover.",
        },
      ],
    },
    {
      title: "Lineups after the trade",
      summary: "Both rosters, re-optimized for the week on screen, with every change marked.",
      items: [
        {
          name: "Best legal lineup",
          detail:
            "Each team's starters are the highest scoring legal lineup for that week, including leagues with overlapping flex slots (W/R, W/T, Superflex) and IDP slots. A player projected for zero still starts ahead of an empty slot.",
        },
        {
          name: "What changed",
          detail:
            "A player who arrived in the trade is tagged NEW, a bench player who now starts is tagged START and a starter who lost his spot is tagged BENCH. Each new starter names who he replaces and that player's projection.",
        },
        {
          name: "Projections coloured by tier",
          detail:
            "Each projection is coloured by a per-position scale (strong, solid, thin), so it is clear which starters are carrying the week. With Sleeper projections and more than one week selected, the total over the range sits under the weekly number.",
        },
        {
          name: "Byes and empty slots",
          detail:
            "A player on bye scores zero for that week and his row says BYE. When nobody on the roster can fill a slot, the slot is shown as empty instead of being hidden.",
        },
        {
          name: "Slot pills in position colours",
          detail:
            "Each slot has a pill in its position's colour, and a flex pill is split into the colours of the positions it accepts.",
        },
        {
          name: "Bench, traded away, IR and taxi",
          detail:
            "The bench is ordered the way Sleeper orders it, QB to DEF, best projection first. Players traded away are listed struck through with an Undo, and IR and taxi squad sections appear only for leagues that use them.",
        },
      ],
    },
    {
      title: "Roster moves",
      summary: "A trade that is not one for one leaves a roster too big or too small. The app makes both rosters legal and shows its work.",
      items: [
        {
          name: "Too many players",
          detail:
            "The app first moves IR-eligible players to open IR slots, which costs nothing, then cuts whoever costs the team's best lineups the fewest points. It never cuts a player you just traded for, picked up or chose to keep.",
        },
        {
          name: "Too few players",
          detail:
            "Each open spot is filled with the best available pickup, and the list is ranked again after each one so the second pickup accounts for the first.",
        },
        {
          name: "Judged on the rest of the season",
          detail:
            "Cuts, IR moves and pickups are decided over every week through the league's last playoff week, whatever range is on screen. A player who only matters in week 15 is not cut because you happen to be looking at this week.",
        },
        {
          name: "Waiver wire, best fits",
          detail:
            "When a roster has room, a section lists the top free agents with the reason for each: the weeks he would start and the points he adds, or the position he gives depth at. A third quarterback in a one-quarterback league is never suggested, however well he projects.",
        },
        {
          name: "Players coming back from IR",
          detail:
            "An injured player is activated the first week he is projected to score, and if the roster is full the cheapest player from that week on is cut for him. A healthy player sitting on IR comes off it now, because Sleeper blocks moves until he does.",
        },
        {
          name: "Every automatic move can be reversed",
          detail:
            "Automatic moves are tagged (AUTO-DROP, AUTO-ADD, AUTO-IR, AUTO OFF IR, BACK FROM IR) and each has a button to refuse it: Keep, Remove pickup, Keep active, Keep on IR. Refusing one makes the app choose the next best option.",
        },
        {
          name: "Your own moves",
          detail:
            "You can drop a bench player, stash an eligible one on IR, activate one or add a free agent yourself. IR eligibility follows the league's commissioner settings for Out, Doubtful, suspended and the other designations.",
        },
        {
          name: "Roster count and one shared wire",
          detail:
            "A strip on each panel shows the roster count against the limit, any open spots and a summary of the moves made. Your team picks from the waiver wire first and your partner picks from what is left, so both teams never add the same player.",
        },
      ],
    },
    {
      title: "Lineup Lab projections",
      summary: "A switch between Sleeper's projections and the app's own, which start from the betting market.",
      items: [
        {
          name: "Sleeper or Lineup Lab",
          detail:
            "One toggle changes the projection source for every number on the screen. The choice is remembered and travels in a shared link.",
        },
        {
          name: "Sportsbooks lead",
          detail:
            "Where Pinnacle or Underdog has a player prop (passing, rushing and receiving yards, receptions, attempts, touchdowns, kicking points), the market's expected value carries 85% of the weight on that stat when two books quote it and 70% when one does.",
        },
        {
          name: "Sleeper and ESPN fill the gaps",
          detail:
            "Books price only some stats for some players. Every other stat ESPN also projects is the average of Sleeper's and ESPN's projections. Defenses stay on Sleeper's numbers, because the ESPN feed carries no defensive stats.",
        },
        {
          name: "Game script, matchup and health",
          detail:
            "Team implied totals and the spread adjust the stats the books did not price, the opposing defense's record against the position adjusts them by at most 10%, and practice reports discount Questionable players (did not practice 0.6, limited 0.85). Out and IR players go to zero.",
        },
        {
          name: "See how a number was built",
          detail:
            "Tap a player's points for the breakdown: Sleeper's number, what each step added or removed, and the result. Sleeper's number stays under each projection with an arrow showing which way the app moved it.",
        },
        {
          name: "Later weeks",
          detail:
            "Books only price the current week, so later weeks use Sleeper's projection with the matchup adjustment. Every projection, from either source, is scored with the league's own scoring settings.",
        },
        {
          name: "Explainer on first use",
          detail:
            "The first switch to Lineup Lab projections opens a five-step explanation with live counts of the player props, game lines and ESPN projections loaded for the week. It can be dismissed for the session or for good, and a question mark button brings it back.",
        },
        {
          name: "When the market feed is down",
          detail:
            "The app retries once on its own, then says it could not reach market data, shows Sleeper's numbers and offers a Retry button.",
        },
      ],
    },
    {
      title: "News and trade alerts",
      summary: "What you should know about a player before he joins your roster.",
      items: [
        {
          name: "Player card",
          detail:
            "Tap a player for his status flags, the projection breakdown for the week on screen, his latest news from Sleeper's feed and the actions available for him.",
        },
        {
          name: "Flags",
          detail:
            "Injury designation with body part, notes and start date, practice report, roster status, not being on an NFL team, a bye this week or in the next 3 weeks, a rest-of-season projection of zero, and news in the last 3 days. They are sorted worst first, and an IR tag is not repeated as a second flag about the zero.",
        },
        {
          name: "Heads up before you trade",
          detail:
            "Once a trade has a player coming to you, every player joining your roster by trade, pickup or IR activation who has a warning-level flag or news in the last 3 days is listed under the trade bar with all his flags and his latest headline. When nobody is flagged, a one-line note says so.",
        },
        {
          name: "News against the injury tag",
          detail:
            "Sleeper's injury tag can lag the news. When the newest headline says a tagged player is good to go, or an untagged one is ruled out, the card and the alert point out that the tag has not caught up.",
        },
        {
          name: "Reading the news",
          detail:
            "The five newest items show their source and age. Long blurbs fold to four lines, the analysis opens on request and each item links to the full story.",
        },
      ],
    },
    {
      title: "Phone and install",
      summary: "It is built to be used on a couch as much as at a desk.",
      items: [
        {
          name: "Installable app",
          detail:
            "Lineup Lab installs from the browser on iPhone, Android and desktop with its own icon and a full-screen window. Get the app shows the steps for the device it detects, with tabs for the other two, and uses the browser's install prompt where one exists.",
        },
        {
          name: "Offline fallback",
          detail:
            "The app shell is cached, and league data, projections and the market feed fall back to the last copy fetched, kept for up to a day, when the network is slow or gone.",
        },
        {
          name: "Phone layout",
          detail:
            "On a narrow screen the rosters stack, rows tighten, the whole row opens the player card and panels open as bottom sheets. Content stays clear of the notch and the home indicator in the installed app.",
        },
        {
          name: "Touch details",
          detail:
            "A long press on a row does not open the browser's context menu or select text. The phone gives a short vibration when a drag starts where it supports one, and the row being dragged dims so it is clear what is in hand.",
        },
      ],
    },
  ],

  engineering: [
    {
      name: "Lineups by exact assignment",
      detail:
        "Setting a lineup is a matching problem between slots and players with projected points as the weight, and I solve it exactly with the Hungarian algorithm because a greedy fill gets overlapping flex slots wrong. Each slot also has a dummy column so it can stay empty, and a large bonus per filled slot makes the solver fill every slot it can before it maximizes points.",
    },
    {
      name: "Scoring from the league's own settings",
      detail:
        "Sleeper's projected stat keys share names with a league's scoring settings, so a player's points are the dot product of the two. That one function covers PPR, tight end premium and custom bonuses without a case for each.",
    },
    {
      name: "A fair before and after",
      detail:
        "The roster is settled twice with the same rules, once without the trade and once with it, and the lineups are solved for every week in both. Because IR returns are played out in the baseline too, a player you would get back anyway is not credited to the trade, and trading away a player on IR costs every week he would have started.",
    },
    {
      name: "Choosing who to cut",
      detail:
        "For each cut the app removes every candidate in turn, re-solves the lineups over the rest of the season and drops the one whose absence costs the fewest points, with ties going to the lowest raw projection. Stashing on IR uses the same search, except the player still counts from the week he is back.",
    },
    {
      name: "Scheduling IR returns",
      detail:
        "IR players are sorted by the first week they are projected to score and activated in that order. Each activation that overfills the roster triggers a cut judged only on the weeks from that point on, and the roster used for any week is the one after all returns due by then.",
    },
    {
      name: "Ranking pickups by lineup gain",
      detail:
        "A free agent's value is how much he adds to the solved lineups over the horizon, which makes the ranking positional by construction. Hard caps stop dead-weight adds (quarterbacks and tight ends at starting slots plus one, kickers and defenses at the number of slots), and pure depth adds go to the position furthest below its share of the starting lineup.",
    },
    {
      name: "Keeping the waiver scan cheap",
      detail:
        "The wire is only scanned once a roster has room. One bulk projections call shortlists the best 8 unrostered, healthy players at each position the league can start, and only those get per-player projections for the full season.",
    },
    {
      name: "Turning a prop line into an expected stat",
      detail:
        "A prop is a line with a price on each side, so I remove the vig to get the probability of the over, convert it to a shift in the mean with the inverse normal CDF and a per-market standard deviation, and cap the shift at 15% of the line. Anytime-touchdown prices become expected touchdowns through a Poisson model, and a priced stat pulls its related volume stats along within a 0.8 to 1.25 band.",
    },
    {
      name: "Defense against position, regressed",
      detail:
        "Points allowed to a position come from Sleeper's weekly actuals and are noisy, so last season's ratio is regressed by a year-over-year correlation held as a constant in the code: 0.24 for quarterbacks, 0.20 for running backs, 0.25 for tight ends, and nothing for wide receivers, whose constant is negative. The prior counts as 14 games of evidence against this season's sample (10 for receivers) and the result is capped at 10% either way.",
    },
    {
      name: "Game script from the lines",
      detail:
        "Each team's implied total, taken from the book's own team total or derived from the spread and total, is compared with the slate average and clamped to 0.8 to 1.25. On stats no book priced, touchdowns move 60% of that ratio and volume 30%, favourites of 6.5 or more get 4% more rushing and 4% less passing with the reverse for underdogs, and a defense is scaled by its opponent's implied total.",
    },
    {
      name: "One market endpoint, four sources",
      detail:
        "A Vercel function fetches Pinnacle's lines and props, Underdog's props, ESPN's scoreboard lines and ESPN's fantasy projections in parallel and reports each source's state, so one failing never blanks the others. Quotes for the same player and market are merged to a median line, ESPN fills any game Pinnacle lacks, and Underdog has a second URL to fall back to when the first is gated.",
    },
    {
      name: "Which week is being priced",
      detail:
        "Sleeper's week number lags early in the week and books post next week's games days ahead. The server reads the schedule, takes the first week whose games are not all complete, and keeps only lines for that week's pairings.",
    },
    {
      name: "Matching players across sources",
      detail:
        "Books publish props by name, so names are normalized (punctuation and suffixes removed), narrowed by the two teams in the game and by the positions the market implies, with a last name and first initial fallback and Sleeper's search rank to break ties. ESPN projections join on ESPN's player ID when Sleeper has it, and team names and old abbreviations from every source map to Sleeper's.",
    },
    {
      name: "Caching and rate limits",
      detail:
        "The functions keep an in-memory cache that shares in-flight requests and serves the last good value when an upstream fails, behind CDN caching of 5 minutes for the market and an hour for defense tables. In the browser Sleeper's full player database is trimmed and kept for a day, and per-player projections run 6 at a time with up to 3 retries on exponential backoff and are never cached on failure, because that would score a healthy player at zero for the session.",
    },
    {
      name: "No backend to run",
      detail:
        "There is no database and no login: league data comes straight from Sleeper's public API in the browser, the trade is stored in the URL, preferences are in local storage and the only server code is two functions that need no API key of mine. The app is a static Vite build with a service worker that serves network-first with an 8 second timeout for data and cache-first for images.",
    },
    {
      name: "Tests on the logic that decides things",
      detail:
        "37 Vitest cases cover the lineup solver against a greedy fill, two-for-one and one-for-two trades, rest-of-season cut decisions, IR stashes and returns, declined pickups, playoff weeks from settings, prop anchoring, health discounts, pickup caps and the flag and news rules. The build type-checks the app and the functions separately, and a small Vite plugin serves the functions in development so one command runs everything.",
    },
  ],
};
