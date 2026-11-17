import type { ProjectDepth } from "../types";

/*
  Written from the tpdl repo and checked item by item against it: every route
  under src/app, the shared rows in src/components, the rules and models in
  src/lib, the 68 migrations in supabase/migrations and the scripts folder.
  TPDL is a private league, so no team, manager or result appears here. Every
  number is a constant, a default setting or a count in that code.

  The repo's README names a "consistency" measure on the player page. It is
  left out because the code does not have it.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "Live matchup",
      summary: "The home tab: this week's head to head, scored while the games are on.",
      items: [
        {
          name: "Starters paired by slot",
          detail:
            "Both lineups run side by side, point guard against point guard down to the three flex spots. Each cell shows the player's fantasy points, his game with its clock and NBA score, and his box score line once it is final.",
        },
        {
          name: "Scores that keep themselves current",
          detail:
            "An open app refreshes every 20 seconds while a game is live and every 90 otherwise, and again when it returns to the foreground. New points flash green and a small plus figure rises beside the number.",
        },
        {
          name: "Win chance",
          detail:
            "A bar splits the matchup between the two teams from their current points and what each still expects to score. It uses a Student-t distribution with five degrees of freedom, so a large lead reads as very likely but short of certain until the games are played.",
        },
        {
          name: "Week projection",
          detail:
            "Each side's projected final is its points so far plus the expected points from every game its starters have left. A live game counts only its remaining share, and a blowout discounts starters who are likely done for the night.",
        },
        {
          name: "League median",
          detail:
            "Every week is two results: the opponent, and the league's middle score. The card shows both teams against the median line, current or projected, and the League matchups view ranks every team against it.",
        },
        {
          name: "Any day, any week, any game",
          detail:
            "A strip of the week's days shows both teams' points for each one and opens that day's lineups. A week picker lists every week with its dates and opponent, and any other matchup in the league opens the same way.",
        },
        {
          name: "League matchups",
          detail:
            "One card per game this week with live totals, projected finals, games played and each side's win chance, yours first and outlined in green.",
        },
        {
          name: "Numbers that pick up where you left off",
          detail:
            "Totals, bars and percentages start from the value this phone last showed and move to the current one. The last values are kept on the device for three days, so reopening the app does not count up from zero.",
        },
        {
          name: "The edge cases of a game night",
          detail:
            "A player who fouls out or is ejected is marked while his game goes on. A healthy scratch reads DNP-CD, a two-week matchup over the All-Star break is explained in place, and a week with NBA Cup games still unscheduled says more games are coming.",
        },
      ],
    },
    {
      title: "Lineups and roster",
      summary: "Lineups are set by the day, and the app does as much of the routine work as a manager wants it to.",
      items: [
        {
          name: "Daily lineups",
          detail:
            "Ten starting spots (five positions, a guard, a forward and three flex), a bench, two injured lists and a taxi squad. Tap a player's slot and every seat he can legally take lights up; tap one to move or swap.",
        },
        {
          name: "Locks at tip-off",
          detail:
            "A player locks when his game starts. The lock follows the live feed or the scheduled tip time, whichever comes first, so it holds even when nobody has the app open to refresh the feed.",
        },
        {
          name: "Auto-set",
          detail:
            "One button fills the lineup for a single day or the whole week from the projections. It seats the most restrictive positions first so a center never uses up a flex spot, then swaps in any benched player who beats a starter he can replace.",
        },
        {
          name: "Morning auto-set",
          detail:
            "The commissioner can turn on a league-wide auto-set that runs each morning, with a switch per team. Locked players are never moved, and a manager who sets a lineup by hand takes his team off it.",
        },
        {
          name: "Auto-sub",
          detail:
            "A manager can name a bench player as the backup for a starter who might sit. If the starter is ruled out before the backup's game tips, the backup takes the seat for that day and the manager is notified, whether or not the app is open.",
        },
        {
          name: "Injured lists",
          detail:
            "The long-term list takes players out for seven days or three games or more, and a second list takes short absences. A healthy player left on either one locks the roster until he is moved: no adds, trades or lineup changes, and the Team page names him and the reason.",
        },
        {
          name: "Taxi squad",
          detail:
            "Young players can sit on a taxi squad where they do not score. Eligibility is a league setting, by default fewer than three seasons of NBA experience, and a player past the limit has to come off.",
        },
        {
          name: "Moves carry through the week",
          detail:
            "A change made on one day is applied to the later days of the week that were already set the same way. Days arranged differently are left alone, and editing a future day never alters today.",
        },
        {
          name: "Averages on every row",
          detail:
            "The roster can show each player's day, or his averages for the season, the last 30 days, the last five games or last season, with the starters' total alongside.",
        },
      ],
    },
    {
      title: "Players and the wire",
      summary: "The free agent pool, and the rules around taking from it.",
      items: [
        {
          name: "The whole pool",
          detail:
            "The list holds the 700 most rostered players, anyone trending outside that, and everyone on an NBA roster however few leagues have him, so a deep bench player who suddenly starts can be found and added.",
        },
        {
          name: "Pick a day",
          detail:
            "Choosing today or one of the next six days narrows the list to players with a game that day and ranks them by that game's projection. Position filters and a free agents filter sit beside it.",
        },
        {
          name: "Trending",
          detail:
            "Two sorts show who is being added and dropped across fantasy leagues, from ESPN's change in rostered share and Sleeper's add and drop counts for the last 24 hours.",
        },
        {
          name: "One add flow",
          detail:
            "Add offers the first open spot the player can take: a lineup seat today, the bench, an injured list or the taxi squad. With no room it opens a drop sheet, and the add and drop go through together.",
        },
        {
          name: "Weekly add limit",
          detail:
            "Each team gets a set number of adds per week, four by default. The count shows on the matchup and team screens and resets with each new fantasy week.",
        },
        {
          name: "Rookie contracts",
          detail:
            "By default the first 20 picks of the latest rookie draft cannot be traded or dropped through week nine. Those players carry a lock tag wherever they appear, and the player page says when the contract ends.",
        },
        {
          name: "Compare",
          detail:
            "Two players side by side, each stat as a mirrored bar scaled to the larger of the two values. Each player keeps one colour the whole way down, and there is no overall verdict.",
        },
        {
          name: "Fantasy leaders",
          detail:
            "A podium and a ranked list of the top fantasy scorers by total or per game, for the season or the last 30 days. A ring chart splits one player's points by the league team that rostered him when he scored them, and what he scored unowned.",
        },
      ],
    },
    {
      title: "Player pages",
      items: [
        {
          name: "Who he is",
          detail:
            "Team, position, age, height, weight and experience, the injury tag with ESPN's estimated return date, who rosters him, and tiles for his college or club, birthplace and draft slot.",
        },
        {
          name: "Live card",
          detail:
            "While his game is on, a red-edged card carries the clock, the score, his fantasy points, his stat line and his shooting. It stays as a recap until the day turns over.",
        },
        {
          name: "Fantasy points",
          detail:
            "His league rank by season total and per game, and his points per game over five windows: season, last 30 days, last five games, the rest-of-season projection and last season. The per-game rank needs at least half the games of the most-played player.",
        },
        {
          name: "Per-game table",
          detail:
            "Fantasy points, minutes, seven counting stats and three shooting percentages for the season, the last 30 days and the last five games. Every finished season sits behind a toggle, with its totals coloured by percentile among that year's qualified players.",
        },
        {
          name: "Game log",
          detail:
            "Every game with the result, the full line, makes and attempts from the field, from three and at the line, and a double-double or triple-double badge. Games he sat are listed with the reason.",
        },
        {
          name: "Depth chart",
          detail: "His NBA team's projected starting five, which unfolds to the full chart with him marked.",
        },
        {
          name: "Contract",
          detail:
            "His real NBA contract by season, with options and two-way deals, where this year's salary ranks among every contract on file, and his share of the salary cap.",
        },
        {
          name: "History in the league",
          detail:
            "A dated timeline of every move he has made here: drafted, added, dropped, traded. A trade links to its trade tree.",
        },
        {
          name: "News and actions",
          detail:
            "RotoWire updates and ESPN stories that mention him. The action buttons show only what applies right now: add, drop, propose a trade, show interest, or put him on the trade block with a note.",
        },
      ],
    },
    {
      title: "Standings, schedule, playoffs",
      items: [
        {
          name: "Standings",
          detail:
            "Seed, record, games back and points for, with your row in green. A bye line and a playoff line are drawn into the table, and the desktop layout adds winning percentage, points against, differential and streak.",
        },
        {
          name: "How standings work",
          detail:
            "A one-screen sheet explains the two results a week, the tiebreak on points for, games back, the playoff format and when the table updates.",
        },
        {
          name: "Clinch marks",
          detail:
            "A letter after a team's name once it has locked the first seed, a bye or a playoff spot, or been eliminated. A possible tie on record always counts against clinched, because the tiebreak cannot be known ahead.",
        },
        {
          name: "Schedule",
          detail:
            "Any week's games with their scores, and the median game beside them: every team's points against the league median, marked as a win or a loss.",
        },
        {
          name: "Playoff bracket",
          detail:
            "One connected bracket: byes for the top two seeds, quarterfinals, reseeded semifinals, the final and a third-place game, with prizes shown where they are won. Before the playoffs it is drawn as a projection from today's standings and labelled that way.",
        },
        {
          name: "Payouts and dues",
          detail: "The prize pool, how it splits between the payouts the league has set, and who has paid.",
        },
        {
          name: "Key dates",
          detail: "The league's own dates and the NBA calendar on one timeline, from this season through the next tip-off.",
        },
      ],
    },
    {
      title: "Trades and picks",
      summary: "Dynasty trades carry more than players, so the builder handles picks, protections and swap rights.",
      items: [
        {
          name: "Two-team builder",
          detail:
            "Players and picks from both rosters go into a deal with an optional message. An offer can be countered or edited in place, and a deal in progress survives a trip to a player's page and back.",
        },
        {
          name: "Pick protections",
          detail:
            "The team a pick originally belongs to can protect it for the top one, three, four or six of its round. If it lands inside that range it stays home, and the picks list says ahead of time whether a protection would apply.",
        },
        {
          name: "Swap rights",
          detail:
            "A team can grant the right to swap two picks of the same year and round. At the draft the holder takes the better of the pair.",
        },
        {
          name: "Multi-team trades",
          detail:
            "Three or more teams, each asset with its own sender and receiver. Every team in the deal has to accept before anything moves.",
        },
        {
          name: "Trade details",
          detail:
            "An offer opens to show who gets what, with each player's averages and the answer buttons. The open trade lives in the address, so Back returns to the same deal.",
        },
        {
          name: "Trade block",
          detail:
            "Players and picks can be listed, players with a note. Other managers can make an offer from the listing or tap Show Interest, which notifies the owner.",
        },
        {
          name: "Stepien rule",
          detail:
            "No team can go two drafts in a row without a first-round pick. A first that would break the rule is locked unless the same deal sends a first back, and the builder explains the lock.",
        },
        {
          name: "Every pick, with where it is headed",
          detail:
            "A team's picks show their projected or official slot, the lottery chance for a first-rounder, any protection and whether it would apply, and who holds swap rights.",
        },
        {
          name: "Deadline, and what happens on accept",
          detail:
            "Trades close at the league's deadline. A trade goes through when the last team accepts, players who already tipped off keep that day's points where they scored them, and the commissioner can reverse a deal.",
        },
      ],
    },
    {
      title: "Rookie lottery and draft",
      items: [
        {
          name: "Draft hub",
          detail:
            "Before the lottery: every lottery team's chance at the first pick and at a top-four pick, and a table of its exact chance of landing each slot. A Simulate button runs one draw for fun and saves nothing.",
        },
        {
          name: "Projected order",
          detail:
            "Every pick in the draft with its projected number and the team that ends up holding it once trades, protections and swap rights are applied.",
        },
        {
          name: "The lottery",
          detail:
            "By default the six lowest finishers enter and four picks are drawn by weight; the rest of the round follows the standings in reverse. The commissioner runs it once, it cannot be re-rolled, and the order is revealed from the last pick up.",
        },
        {
          name: "Live draft room",
          detail:
            "A board for all four rounds, the team on the clock with a countdown, and a Draft button on each prospect when it is your turn. Every pick is posted to league chat and the next team is notified.",
        },
        {
          name: "Pick clock and auto-pick",
          detail:
            "The clock is two minutes by default. When it runs out the best available prospect by rank is taken automatically and marked as an auto pick.",
        },
        {
          name: "Prospects",
          detail:
            "The class comes from ESPN's draft board once ESPN publishes it, and from NBA Draft Room's public big board before that. The commissioner can paste a ranked list or add one by hand, and those rows are kept and enriched.",
        },
        {
          name: "From the draft to the roster",
          detail:
            "A drafted player goes to the taxi squad when there is room, and to the bench when there is not. A prospect who is not in the NBA player pool yet is linked when he appears, and his manager is told.",
        },
        {
          name: "Mock draft and past drafts",
          detail:
            "The next class's board laid over the NBA's order by record, and every earlier league draft pick by pick with the player each one became.",
        },
      ],
    },
    {
      title: "Chat, messages and the live feed",
      items: [
        {
          name: "League chat",
          detail:
            "Replies that quote what they answer, mentions with autocomplete on a team's handle or name, reactions on press and hold, GIF search, photos, and links that unfurl into cards.",
        },
        {
          name: "Chat on every screen",
          detail:
            "Everywhere except the chat and direct message screens, chat rests as a bar above the tab bar with the latest message as a preview. Pulling it up opens the conversation over the page.",
        },
        {
          name: "League events in the thread",
          detail:
            "Trades, adds, drops and trade block listings appear as compact cards between the messages, and draft picks and new members as one-line notes.",
        },
        {
          name: "Announcements and polls",
          detail:
            "The commissioner can post an announcement, which is marked in the thread and sent as a push, and a poll with up to eight options and a closing time for the league to vote on.",
        },
        {
          name: "Direct messages",
          detail:
            "One thread per pair of managers. Every two-team trade between them shows in that thread as a card, including when it is withdrawn, declined or accepted.",
        },
        {
          name: "Live feed",
          detail:
            "Plays worth fantasy points as they happen, filtered to your team, your matchup or the whole league: who, what the play was and what it was worth, under the night's scores.",
        },
        {
          name: "Down to the wire",
          detail:
            "At noon Eastern on a regular season week's last day, or an hour before an earlier tip, each matchup where the trailing team still has at least a 35% chance gets a card in chat with the score and win chance. The managers in those matchups get their own push, and the rest of the league is told which games are close.",
        },
        {
          name: "Weekly recap",
          detail:
            "At 10am Eastern the morning after a week closes, one card sums it up: top scores, every result, the best players and single games, who beat their projection by the most, and the starters who played real minutes and still came up short.",
        },
      ],
    },
    {
      title: "History and reference",
      summary: "A record of the league's moves, and NBA reference pages beside it.",
      items: [
        {
          name: "Transactions",
          detail:
            "Every move, newest first, filtered by kind and by team, and in League history by period. A pick that has been used shows the player it became.",
        },
        {
          name: "Record book",
          detail:
            "League records such as the highest and lowest week, the biggest blowout, the closest win and the longest win streak, plus each franchise's overall record and a head-to-head grid.",
        },
        {
          name: "League history",
          detail: "Nine tabs: a timeline, seasons, blockbuster trades, waiver gems, drafts, every trade, every move, teams and managers.",
        },
        {
          name: "Trade trees",
          detail:
            "For any trade, everything each team got is followed forward: through later trades of the same asset, and from a pick to the player taken with it, until it is dropped or still held.",
        },
        {
          name: "Manager stats",
          detail:
            "Leaderboards built from the raw transactions: who trades most, who works the wire, who holds on to the players they drafted, and which pairs of managers deal with each other most.",
        },
        {
          name: "Manager pages",
          detail:
            "Another team's roster with a trade one tap away, how the roster is built, and a chart of age against production with every player drawn as his own face.",
        },
        {
          name: "NBA standings and teams",
          detail:
            "NBA standings by league, conference and division, the playoff picture as it stands, and every team's depth chart.",
        },
        {
          name: "Draft classes and origins",
          detail:
            "Every NBA draft since 2001 pick by pick, with how much of each class the league rosters. A second page groups active players by country, state, city, college or club.",
        },
        {
          name: "News",
          detail: "A league-wide NBA news feed with the players in each story linked and tagged by who owns them.",
        },
      ],
    },
    {
      title: "Notifications",
      summary: "Push on the installed app, an inbox, and a switch for each of 18 kinds.",
      items: [
        {
          name: "Per-type switches",
          detail:
            "Eighteen notification types in three groups, each with a line saying what it covers. The switches control push only: everything except chat, direct messages, tip-off reminders and big-night alerts is also kept in the inbox.",
        },
        {
          name: "Inbox",
          detail:
            "Rows that arrived since the last visit are highlighted, and opening the inbox marks them read. On a desktop it is grouped by day with a filter by kind.",
        },
        {
          name: "Injury calls",
          detail:
            "A manager is notified when one of his players is ruled out, listed doubtful or day-to-day, cleared, or changes NBA teams. The alerts come from ESPN's injury status and from the NBA's official injury report, which gives a specific call where ESPN says day-to-day.",
        },
        {
          name: "Before first tip",
          detail:
            "Thirty minutes before the day's first game, every team gets a reminder to check its lineup, with a count of its players in action that day. It is sent once a day.",
        },
        {
          name: "Lineup fixes",
          detail:
            "A morning nudge, sent only when a healthy bench player with a game could fill an open seat, replace a starter who cannot play, or out-project a starter by more than a point. Teams on auto-set are skipped.",
        },
        {
          name: "Big nights",
          detail:
            "Live alerts for the players in your starting lineup, based on real stats rather than fantasy point thresholds, with something for scorers, big men, playmakers, defenders and role players. Each moment is sent once.",
        },
        {
          name: "Trades, the draft and the league",
          detail:
            "Offers and replies, interest in your players, completed deals, adds and drops, mentions, lottery results, being on the clock, playoff rounds and the Monday result of your week.",
        },
        {
          name: "Test and sound",
          detail: "A button sends a test notification to check the phone is set up, and in-app sounds can be turned off per device.",
        },
      ],
    },
    {
      title: "Commissioner office",
      summary: "Most of what the league can change about itself is changed in the app, by the commissioner.",
      items: [
        {
          name: "League settings",
          detail:
            "Scoring for 15 stats, roster sizes, the weekly add limit, taxi eligibility, the median game, playoff teams and reseeding, the trade deadline, pick protections and swaps, lottery weights, buy-in and payouts.",
        },
        {
          name: "Scoring that reaches back",
          detail:
            "Changing a scoring value re-scores every stored box score line and every past season's totals and ranks, and the save message reports how many lines were re-scored.",
        },
        {
          name: "Season calendar",
          detail: "The weeks of the season, with their labels and dates, are editable.",
        },
        {
          name: "Members and invites",
          detail:
            "Each team has its own invite link, with a share button, a QR code and a reset that makes a new link. A check-in list shows who has joined, installed the app and turned on notifications, with the people to chase at the top.",
        },
        {
          name: "Fixing rosters",
          detail:
            "Edit any team's lineup, add, drop or move a player between teams, set a player's positions, move a draft pick, or change a team's add count. The commissioner follows every rule on his own team; the powers apply only from this screen.",
        },
        {
          name: "Undoing things",
          detail:
            "Reverse a trade, which sends every asset back and tells the league, or undo an add or drop, which also stops it counting toward the week's adds. The commissioner can also reset a team's future lineups and override the score of a finalized matchup.",
        },
        {
          name: "Pause",
          detail: "One switch stops every add, drop and trade league-wide. Lineups keep working.",
        },
        {
          name: "Recap and notification previews",
          detail:
            "The weekly recap can be previewed and posted by hand. A second page lists every notification type, how many teams receive it and how each big-night alert reads on a lock screen.",
        },
        {
          name: "Error codes",
          detail:
            "When an action fails unexpectedly the manager sees a short code. The commissioner's screen lists the most recent codes with the action that failed and the error message.",
        },
      ],
    },
    {
      title: "The app itself",
      summary: "An installed phone app first, with a desktop layout behind it.",
      items: [
        {
          name: "Invite link sign-in",
          detail:
            "There are no passwords and no email. Opening a team's invite link signs that browser in and shows install steps written for the browser it opened in.",
        },
        {
          name: "Installed app on a phone",
          detail:
            "On a phone the league is only the installed app: a phone browser is sent to the install page. Android gets a one-tap install and iPhone gets the Add to Home Screen steps.",
        },
        {
          name: "Another device",
          detail:
            "The signed-in app can issue an eight-character code that signs in a computer or second phone. It works once, for ten minutes, and its alphabet leaves out the characters that are easy to misread.",
        },
        {
          name: "Your devices",
          detail: "A list of everywhere the team is signed in. Any device can be removed, and it is signed out from its next request.",
        },
        {
          name: "Updates with nothing to tap",
          detail:
            "A phone on an older version loads the new one when the app is opened, on the next page change, or after a few idle seconds. The idle reload waits while someone is typing or has a sheet open, and a toast says once that the app updated.",
        },
        {
          name: "Native feel",
          detail:
            "Five bottom tabs with a sliding highlight that follows a finger dragged along the bar, swipes between tabs, pull to refresh, sheets that slide up, and sticky section headers. Only the content area scrolls.",
        },
        {
          name: "Desktop layout",
          detail:
            "At 1024 pixels and wider the tabs become a sidebar, long pages split into two columns, sheets become centred dialogs, and Ctrl or Cmd K opens a search that jumps to any player or page.",
        },
        {
          name: "Team identity",
          detail:
            "Each team has a name, a handle, one of 30 colours that stay unique across the league, and a photo with a pinch-to-zoom crop. The last six photos are kept to switch back to.",
        },
        {
          name: "Share images",
          detail:
            "A link to the app unfurls into a league card. A team's invite link unfurls into its own card with the team's name and colour.",
        },
      ],
    },
  ],
  engineering: [
    {
      name: "Data from public endpoints",
      detail:
        "There is no paid feed: ESPN's site API supplies the scoreboard, box scores, play-by-play, rosters and news, and its fantasy API supplies position eligibility, projections, injury status and rostered share. Sleeper's public API adds injury notes and add and drop counts, and only regular season games are ingested.",
    },
    {
      name: "One pull per 15 seconds, league-wide",
      detail:
        "Every open app calls the same live route, so each job is claimed with a conditional update on a log row: the first caller moves the timestamp forward and the rest match nothing, which keeps ESPN to one fetch per 15 seconds however many phones are open. The same claim spaces out the schedule refresh (12 hours), the player pool (3 hours), news (2 hours) and week finalization (hourly).",
    },
    {
      name: "Scoring with the app closed",
      detail:
        "Scheduled jobs in Postgres (pg_cron with pg_net) call the app's routes over HTTP: the live route each minute while a game is in progress, the injury report every five minutes and a database health check every 15. Other jobs check a condition in SQL and call the app once it is met: the tip-off reminder, the noon close-call post, the 10am recap, and the minutes around a tip that has an auto-sub waiting.",
    },
    {
      name: "The morning job",
      detail:
        "One daily job refreshes the player pool and injury status, syncs draft prospects for this class and the next, links drafted prospects who have reached the NBA, pulls news, syncs the schedule five weeks ahead, finalizes finished weeks, advances the playoff bracket, archives a finished season, runs the league-wide auto-set and sends lineup nudges.",
    },
    {
      name: "Ingest that is safe to repeat",
      detail:
        "The ingest skips games that have not tipped and finals already stored, treats a game as done only once its final box score is saved, and records every change in a player's fantasy points as an event. Late games that run past midnight Eastern keep scoring on the day they started, and the morning job re-reads the last three days of finals before it closes a week, to pick up stat corrections.",
    },
    {
      name: "Re-scoring",
      detail:
        "Scoring weights live in the league's settings, and stored lines hold raw stats. A change to the weights recomputes fantasy points for every stored line, then past seasons' totals and ranks, so stored history matches the current rules.",
    },
    {
      name: "House projection",
      detail:
        "A player's expected points per game blend ESPN's projection with what he has done this season, with the projection counting as ten games, so real production carries half the weight after ten. Each game is capped to a band around the starting point that widens as games add up, recent games count more with a 20-game half-life, and a healthy scratch counts as three zero-point games.",
    },
    {
      name: "Week projection and win probability",
      detail:
        "For each team the model sums expected points from every remaining starter game and a variance for them: per-game noise at half the projection, a 7% chance a player sits a game that has not tipped (more when the NBA lists him probable, questionable or doubtful), and a shared 15% projection error. The win chance is the Student-t probability that one team's projected final beats the other's.",
    },
    {
      name: "Lottery odds and the draft clock",
      detail:
        "The draw is weighted sampling without replacement over the league's weights, and the hub's table of each team's chance at each pick is exact: a recursion walks every possible sequence of draws and sums the probabilities. The pick clock is a timestamp in the database, checked by the live route and the draft page, and once it has passed the server takes the best available prospect by rank and starts the next clock.",
    },
    {
      name: "Trades in one transaction",
      detail:
        "An offer is validated when proposed and again when accepted: ownership of every asset, the deadline, rookie contracts, roster locks, the Stepien rule, and the rules on protections and swaps. The move itself is a single Postgres function that locks the trade, re-checks each asset and each team's roster limit, and moves everything together or nothing at all.",
    },
    {
      name: "Protections and swaps resolved at the draft",
      detail:
        "Who makes a pick is computed from its number: a protected pick that lands inside its range stays with the original team, then the holder of swap rights takes the better pick of the pair. One function does this for the draft board, the hub and every team's pick list, so they agree.",
    },
    {
      name: "League rules live on the server",
      detail:
        "Lineup, roster, trade, draft and commissioner changes go through server actions (60 exported from one file), and each checks the rules itself: slot eligibility, locks, the add limit, injured list and taxi rules, the deadline, the pause switch. An unexpected failure is caught, logged with a short code and shown to the manager with that code.",
    },
    {
      name: "A lineup is a record of each day",
      detail:
        "Lineups are stored per day, and a past day is read back as it was saved, so it does not change when a roster does. A starter traded after his game tipped stays in that day's lineup for the team he scored for.",
    },
    {
      name: "Auth without passwords",
      detail:
        "The session is a cookie holding the team and a device session id, signed with HMAC-SHA256 and compared in constant time; each device has a row that can be revoked, and one-time device codes are stored only as a keyed hash. Row level security is on for every table, and all writes go through the server with the service key.",
    },
    {
      name: "The NBA injury report",
      detail:
        "The app checks the NBA's official injury report, a PDF, and reads it only when a new one is out. It parses the text, matches rows to its players by name, and stores each call with the game date it applies to, so the call lapses once that game is played.",
    },
    {
      name: "Live plays from play-by-play",
      detail:
        "The live feed turns ESPN's play-by-play into fantasy credits scored with the league's settings, with a made three and its assist as two credits on one play. Three nights of plays are kept, and the box scores stay the record.",
    },
    {
      name: "Push and the installed app",
      detail:
        "Web push uses VAPID keys, sends to every device a team has registered and drops subscriptions that come back gone. The service worker handles push and notification taps and has no fetch handler, so page loads go straight to the network, and a version check keeps an old client from pulling new server data into old code.",
    },
    {
      name: "Built for small plans",
      detail:
        "The app is set up for Vercel's Hobby plan and Supabase's smallest database: the big, slow-changing reads (every player row and the season views) are held in one copy per server and re-read only when a one-row stamp query says the data changed, or after 15 minutes. A health check times a small read and watches swap activity, and notifies the commissioner after two bad checks in a row.",
    },
    {
      name: "Checks instead of a test suite",
      detail:
        "There is no unit test framework in the repo. A Playwright script, run after a production deploy, signs in as a manager, opens 13 pages read-only with server actions blocked, retries once after 30 seconds, and can put the previous deploy back if a page is broken; other scripts exercise lineup writes against a team and restore its rows, drive the manager actions against a local copy of the database, and audit saved lineups for illegal seats.",
    },
    {
      name: "A read-only API for FBI Basketball",
      detail:
        "One versioned GET route exposes the league to FBI Basketball's tools, behind a bearer key compared in constant time. FBI never reads this database directly, so either side can change its internals.",
    },
  ],
};
