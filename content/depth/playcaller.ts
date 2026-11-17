import type { ProjectDepth } from "../types";

/*
  Written from the playcaller repo: README.md, src/app/(app), src/components,
  src/engine, src/feeds, src/server and scripts. Every number here is a
  constant in that code or a figure its README records from a check script.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "Moves, the home screen",
      summary: "One screen for every league: what will run by itself, what is waiting on me, and what is already filed.",
      items: [
        {
          name: "Three counters",
          detail:
            "Automatic, suggested and pending claims, counted across every league in season. When an IR fix has to happen before a game, the middle counter turns into a red Do now count.",
        },
        {
          name: "Where things stand",
          detail:
            "How many leagues were read and how long ago, and the next two waiver runs with a countdown, since my leagues do not all process on the same night.",
        },
        {
          name: "Automatic list",
          detail:
            "One row per league with the lineup change and any free IR move, and the points the change gains in volt. A row opens to show each slot swap, who comes out and why, and Run sends all of them at once.",
        },
        {
          name: "Suggested moves",
          detail:
            "Every add, drop and claim worth making, sorted with this week's urgent ones first and then by score. A filter splits free agents from waiver claims, and nothing here runs until I tick it.",
        },
        {
          name: "Selection bar",
          detail:
            "Ticked moves collect in a bar above the tab bar that shows how many leagues they touch, how many are claims and the total in bids. It expands into the list so one can be removed before running.",
        },
        {
          name: "Pending claims",
          detail:
            "Claims already filed are re-checked against today's rosters and marked good or bad, with the bid, the drop and when they process. One button cancels them all.",
        },
        {
          name: "Run screen",
          detail:
            "Running moves opens a full screen that streams what the server is doing: each queued move goes from waiting to working to done, claimed, skipped or failed, with Sleeper's answer beside it.",
        },
        {
          name: "Refresh without a blank screen",
          detail:
            "The app paints the last plan saved on the phone, then refreshes behind it. Pull down or tap refresh for a new one, and a minute after each scheduled run it refreshes itself so finished moves are not offered again.",
        },
      ],
    },
    {
      title: "An opened move",
      summary: "Each suggestion is a card that explains itself and can be edited before it runs.",
      items: [
        {
          name: "What kind of move it is",
          detail:
            "A chip says free agent, waiver claim with its bid or priority, IR in or out, drop, or cancel claim. A second chip gives the reason for the pickup: starts now, long-term upgrade, K/DEF swap, bench upside or dead weight out.",
        },
        {
          name: "Gain in lineup points",
          detail:
            "The headline number is how many points my best lineup gains over this week and up to five more, with this week counted in full and later weeks counted less. This week's gain and the later weekly average are shown separately.",
        },
        {
          name: "Reasons in plain words",
          detail:
            "The card lists who he starts over and by how much, how many of the coming weeks he starts, where both players rank on the trade market, and how many managers across Sleeper added him in the last day.",
        },
        {
          name: "Week by week table",
          detail:
            "Both players' projections for each week of the horizon, and a third row for what the swap does to the best lineup in each week. A footnote says which weeks use the blend and which use Sleeper's projections.",
        },
        {
          name: "Change the bid",
          detail:
            "A stepper and a slider between the league minimum and the FAAB I have left, with steps of 1, 5 or 10 dollars depending on how much is left. The recommended amount comes with a sentence saying how it was sized, and one tap returns to it.",
        },
        {
          name: "Change the drop",
          detail:
            "The other players I could cut are listed with what each one costs in lineup points, how many weeks he starts and his market rank. The cheapest is preselected.",
        },
        {
          name: "Pick someone else, or add backups",
          detail:
            "One roster spot gets one move, so the other players who would fill it are on the same card to choose from. On a FAAB claim they can also be filed as backups at the minimum bid, which only land if the main claim loses.",
        },
        {
          name: "Skip with a reason",
          detail:
            "Not now hides the move for up to a week, or until its score rises by the larger of 3 points or 40 percent. I don't want him and Keep him hold per league until undone, and Wait till he clears drops the claim and offers him as a free pickup after the waiver run.",
        },
      ],
    },
    {
      title: "Auto lineups and IR",
      summary: "The part that runs without me: the best lineup in every league, and injured reserve moves that cost nobody.",
      items: [
        {
          name: "Best lineup in every league",
          detail:
            "A scheduled run sets the highest projected lineup for each league's own slots, flex and superflex included. A player whose game has started is never moved.",
        },
        {
          name: "Game day schedule",
          detail:
            "It runs every 15 minutes on any date with an NFL game on Sleeper's schedule, which covers Thanksgiving, Christmas and December Saturdays, and once an hour on other days. A ring on Moves and Settings counts down to the next run.",
        },
        {
          name: "Kickoff ordering",
          detail:
            "When the points are equal the lineup is still rearranged: a questionable player or the latest kickoff goes into flex, so a late scratch can be swapped for anyone on the bench. Same-named slots are ordered Thursday to Monday.",
        },
        {
          name: "Byes and injuries",
          detail:
            "Players on bye, out, doubtful, on IR or inactive are flagged and benched for a healthy option, and an empty slot is filled. Questionable players keep their practice status on the flag.",
        },
        {
          name: "Onto IR for free",
          detail:
            "A player with a long-term designation the league's IR accepts, such as IR or PUP, is moved into an open IR slot, which frees a roster spot. A player on IR who is no longer eligible is activated into an open spot or swapped with another IR-eligible player, so nobody is cut.",
        },
        {
          name: "IR fixes that need a cut",
          detail:
            "While an IR slot holds a player who is no longer eligible, Sleeper refuses every change in that league. When the fix needs a drop it waits for me, with the cheapest cut preselected, and the rest of that league's moves wait behind it.",
        },
        {
          name: "Fixes ranked by deadline",
          detail:
            "For each kickoff left in the week the planner compares fixing now against fixing after that game starts. The first kickoff where waiting costs a point is the deadline, and fixes are grouped as Do now, Later this week or Can wait.",
        },
        {
          name: "Three modes per league",
          detail:
            "Lineups is the default and runs lineups and free IR moves only, and Off runs nothing. Full auto asks for confirmation before it is turned on and also runs adds, drops and claims, except a move that cuts a player the trade market ranks inside ten per team or one who starts in three or more of the coming weeks.",
        },
      ],
    },
    {
      title: "Pickups, claims and drops",
      summary: "Every unrostered player is tried against every way to make room, in each league's own scoring.",
      items: [
        {
          name: "Free agent or claim, per league",
          detail:
            "The card says whether a player can be added now or has to be claimed, and when that claim processes. The rules follow each league's waiver day, clear period and daily waivers setting, and whether his game has kicked off.",
        },
        {
          name: "Room without a cut",
          detail:
            "An injured free agent can go straight into an open IR slot. A rostered player who is out can step onto IR to lend his spot, valued only for the weeks he is expected to miss.",
        },
        {
          name: "Guards on who gets cut",
          detail:
            "The engine never cuts a player the trade market values well above the add (more than 1.2 times the add's value plus 50), a player on my keep list, or anyone whose game has started. Cutting someone who starts in two or more of the coming weeks needs at least 4 more lineup points.",
        },
        {
          name: "Bars a move has to clear",
          detail:
            "A move must be worth 1.5 points for an open or dead roster spot, 2.5 for a kicker or defense swap and 5 to cut a real player. A claim pays a cost of 1.5 for FAAB or 2.5 for priority, so a free agent wins a close call.",
        },
        {
          name: "Kicker and defense streams",
          detail:
            "Kickers and defenses are only swapped for their own position, and the roster holds no more of them than the lineup starts. Their claims always bid the minimum.",
        },
        {
          name: "Recommended bids",
          detail:
            "The bid stays at the minimum unless the chance of a rival claim times what losing the player would cost reaches a point. Each league can be set to thrifty, balanced or aggressive, which moves that threshold to 1.5, 1 or 0.5 and scales the bid.",
        },
        {
          name: "One spot, one move",
          detail:
            "Pending claims that use an open spot are counted, so the engine never stacks two pickups on the same spot. A pending claim that would make the roster worse gets a Cancel claim card, which I can overrule for that one claim.",
        },
        {
          name: "Wait till he clears",
          detail:
            "When a claimed player would become a free agent before his game, I can skip the claim and wait. After the run the app suggests him as a free pickup if nobody took him, and sends one push either way.",
        },
      ],
    },
    {
      title: "Leagues",
      summary: "Each league on its own page, read with its own rules.",
      items: [
        {
          name: "League list",
          detail:
            "Every league with its format, record and rank, chips for what is waiting there, and this week's matchup as two projected totals with a win chance bar. A filter shows only leagues with moves, or only the ones that are set.",
        },
        {
          name: "Matchup",
          detail:
            "The league page opens with my projected total, my opponent's and the chance of winning, and adds the live score once games have started.",
        },
        {
          name: "How adds work here",
          detail:
            "A short card spells out that league's waiver rules: when waivers process, how long a dropped player sits, and either the FAAB left with the minimum bid or my place in the priority order.",
        },
        {
          name: "Lineup, bench and IR",
          detail:
            "Every starter by slot with this week's blended projection, then the bench and IR with the average for the weeks after as well. From any move, a Roster sheet shows the roster as Sleeper has it, with the incoming and outgoing player marked.",
        },
        {
          name: "Run one league",
          detail: "The automatic moves for a single league can be run from its page without touching the others.",
        },
        {
          name: "Hidden by you",
          detail:
            "Players I marked keep or do not add, snoozed moves, claims I chose to keep and players I am waiting on are listed with an Undo, so a skip is never permanent by accident.",
        },
        {
          name: "Formats handled",
          detail:
            "Scoring comes from each league's settings, so PPR, half PPR, standard and TE premium are all scored as the league scores them. Superflex, dynasty and keeper leagues are labelled, and best ball leagues are left out because Sleeper sets those lineups itself.",
        },
      ],
    },
    {
      title: "Activity and notifications",
      summary: "A record of what ran, and a ping only when something happened or needs me.",
      items: [
        {
          name: "Seven day summary",
          detail: "Points added, moves made and how many of them were automatic over the last seven days.",
        },
        {
          name: "The log",
          detail:
            "Every move that ran, grouped by day, with the league, whether the app or I ran it, and the points it added. Claims placed, moves that failed and moves that need me each get their own colour, and a failure shows the reason.",
        },
        {
          name: "Run summary push",
          detail:
            "After a scheduled run that changed something, one notification gives the count of moves, the points gained and the first few changes by league. A run that changed nothing sends nothing.",
        },
        {
          name: "IR fix alerts",
          detail:
            "A push goes out when a fix reaches Do now and again as a last call three hours before the kickoff it has to beat. Nothing is sent between 11 PM and 8 AM Eastern unless it is that close.",
        },
        {
          name: "Token and waiver alerts",
          detail:
            "If Sleeper rejects my login the app says so by push and in a banner, and keeps showing the last saved plan. A player I waited on triggers one push when he clears or goes to another team.",
        },
        {
          name: "Notifications land in the open app",
          detail: "Tapping a notification focuses the app that is already open and navigates inside it, so a run in progress is never cut off by a reload.",
        },
      ],
    },
    {
      title: "Settings and the installed app",
      summary: "It is a web app that installs to the home screen and behaves like a native one.",
      items: [
        {
          name: "Auto lineups switch",
          detail: "One switch turns the scheduled runs on or off, with the same countdown ring and the time of the last run beside it.",
        },
        {
          name: "Notifications per device",
          detail:
            "Push is turned on for each device, with a count of devices and a button that sends a test. On launch the app re-sends its subscription, so a subscription the server dropped does not go silent with the switch still on.",
        },
        {
          name: "Install card",
          detail:
            "In a browser the app shows one card for getting onto the home screen: the real install prompt on Android and desktop Chrome, and the two taps Safari needs on an iPhone.",
        },
        {
          name: "Passcode sign in",
          detail:
            "A private passcode opens the app on a device. Signing out clears only that device, and the scheduled runs keep going.",
        },
        {
          name: "Stays on the newest version",
          detail:
            "An open app checks for a newer deploy when it is reopened or the page changes, and reloads into it by itself. It never reloads while a run is writing to Sleeper, and on reopening it waits if I am typing.",
        },
        {
          name: "Native feel",
          detail:
            "Each tab remembers its scroll position, pinch zoom is off, taps give a short vibration where the phone supports it, and the floating tab bar carries a badge with the number of moves worth a look.",
        },
        {
          name: "iPhone view on a desktop",
          detail:
            "For checking layouts, the owner's desktop session can open the app inside a frame the size of a chosen iPhone, with touch input and the installed app's layout simulated.",
        },
      ],
    },
  ],
  engineering: [
    {
      name: "The projection blend",
      detail:
        "This week's number starts from a 50/50 average of Sleeper's and ESPN's projected stat lines, and sportsbook props then anchor the stats they price, at a weight of 0.85 when two books quote the line and 0.7 for one. Each line and its over price become an expected value by taking the vig out and shifting the line by the inverse normal of the over probability, capped at 15 percent of the line.",
    },
    {
      name: "Scored per league",
      detail:
        "The blend works on stat lines, never on points, so every league scores the same projection with its own settings. Reception bonuses by position are kept in step with the blended receptions, so a TE premium league pays the premium on the number actually projected.",
    },
    {
      name: "Game environment and matchup",
      detail:
        "Stats the books did not price are scaled by the team's implied total against the slate average, with touchdowns moving more than volume, and by game script for favourites and underdogs of 6.5 or more. A defense versus position multiplier, capped at 10 percent, is applied last.",
    },
    {
      name: "Small samples, shrunk",
      detail:
        "Points allowed to each position are summed from Sleeper's weekly actuals and scored per league, with last season as a prior worth 10 to 14 games, regressed by a per-position year-over-year correlation that is a constant in the code and ignored for wide receivers, whose constant is negative. Kickers get the same treatment: make rate shrunk toward 85 percent with 25 phantom attempts, team field goal volume blended with last season as 6 games of evidence, and a venue factor for domes, cold and wind.",
    },
    {
      name: "Feeds and caching",
      detail:
        "Props come from Pinnacle and Underdog and game lines from Pinnacle, with ESPN's scoreboard filling any game Pinnacle lacks, and trade values from FantasyCalc in the league's format. Lines and props refresh every 10 minutes and ESPN projections every 3 hours, each source fails on its own, and a source that is down reuses its last good result for up to 24 hours.",
    },
    {
      name: "Lineup optimiser",
      detail:
        "Starting slots are filled by a maximum-weight assignment solved with the Hungarian algorithm, with eligibility read from each league's roster positions. A locked starter is pinned to his slot and counts what he actually scores.",
    },
    {
      name: "Roster value over six weeks",
      detail:
        "A player is worth what he adds to my best lineup, week by week, over this week and up to the next five at weights from 1 down to 0.45. Future weeks include a replacement player per position, set at 95 percent of the second-best free agent projected that week, so holding a body for a distant bye is not overvalued.",
    },
    {
      name: "Move scoring",
      detail:
        "A move's score is the change in that roster value, plus the trade value coming in minus going out at 150 per point and capped at 5, plus a small log-scaled bonus for players trending across Sleeper, minus the claim cost. Cutting a player picked up in the last 7 days costs one more point.",
    },
    {
      name: "Bid sizing",
      detail:
        "The chance of a rival claim starts from a prior of 40 percent for skill players, a constant in the code weighted as 10 claimed players, and is updated with the league's waiver claims from this week and last. Money goes in only when that chance times the gap to my next-best option reaches a point, and the percentage grows with the gap, the player's market value and, after week 9, the week of the season.",
    },
    {
      name: "Waiver rules, checked against history",
      detail:
        "Whether a player is a free agent or on waivers is decided by rules read from each league's waiver settings and the kickoff schedule. A script replays the season's real claims and free-agent adds through those rules and prints how often they agree; the README records the rules as fitted to about 3,000 of those transactions and the script's result as 97.9 percent.",
    },
    {
      name: "Win probability",
      detail:
        "The chance of winning a matchup is a normal curve on the gap between the two projected totals, where each side's score gets a standard deviation of 17 percent of the average total and the spread of the gap has a floor of 12 points. The curve is the Abramowitz and Stegun approximation.",
    },
    {
      name: "Which week it is",
      detail:
        "Sleeper's week counters can still point at a finished week on a Tuesday, which leaves every projection at zero. The app reads the schedule instead: once every game of a week is complete, projections, matchups, lineups and waivers all move to the next one.",
    },
    {
      name: "Writing to Sleeper safely",
      detail:
        "Moves go through Sleeper's own GraphQL calls with my token, which stays on the server. Before each write the executor re-reads the league and checks injury designations, game locks with a three minute margin, roster and IR room, FAAB, position caps and duplicate claims, then confirms the change from what Sleeper returns.",
    },
    {
      name: "Failure handling",
      detail:
        "Sleeper reads retry twice on a 404, 429 or server error. A move that cannot go through comes back as not sent or needs you with the reason in plain words, a failed add undoes the IR move made for it, and a free pickup I approved is never turned into a paid claim.",
    },
    {
      name: "Scheduling, storage and push",
      detail:
        "One Vercel cron fires every 15 minutes and the handler decides whether the run goes ahead, because cron fields are UTC and game days are Eastern dates. State is private JSON in Vercel Blob (settings, activity and the last plan) at paths keyed by an HMAC of the user id, the session is a signed httpOnly cookie, and push uses VAPID keys with dead subscriptions pruned as they bounce.",
    },
    {
      name: "Check scripts",
      detail:
        "A run simulator drives the real executor against a stand-in for Sleeper that enforces its roster and IR rules, starting from my real rosters, and exits non-zero on any failed move. A rule check builds the plan from live data and tests every suggestion against the engine's hard rules, and a smoke test covers sign in without sending a write.",
    },
  ],
};
