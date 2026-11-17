import type { ProjectDepth } from "../types";

/*
  Hitlist, written from lucasreydman/hitlist: app/page.tsx,
  app/components/*, app/api/*, lib/*, __tests__/* and
  .github/workflows/discord-notifier.yml. Every number below is a constant in
  that code.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "The daily board",
      summary: "One page for one slate, refreshed in the background while it stays open.",
      items: [
        {
          name: "Built for one prop",
          detail:
            "Everything on the page serves the Player to Record a Hit market (1+ hits, over 0.5). Ranking and hit chance use batting average, so a walk or a hit by pitch does not raise a play's rank.",
        },
        {
          name: "How to use this system",
          detail:
            "A panel at the top says what to bet and in what order: the recommended double first, a Smash Double if one exists, the second double as an option, or singles from the Top 4 for lower risk. It ends with the reminder that career history is one input and no guarantee.",
        },
        {
          name: "Today and tomorrow",
          detail:
            "The date control moves between today's slate and tomorrow's and nowhere else. The slate day is the Pacific calendar day.",
        },
        {
          name: "Status bar",
          detail:
            "A clock that ticks every second and the time of the last data update, with the number of games scanned added on desktop. Game times and timestamps are shown in the viewer's own time zone.",
        },
        {
          name: "Skipped games explained",
          detail:
            "A game with no probable pitcher announced for one or both teams cannot be scored, so it is counted as skipped and an info tip says why. Postponed, cancelled and suspended games are removed before counting.",
        },
        {
          name: "Loading that says what it is doing",
          detail:
            "The skeleton shows an elapsed timer and changes its message at 5, 15 and 30 seconds, from fetching matchups through to a note that the slate is large.",
        },
        {
          name: "Manual refresh and error state",
          detail:
            "A Refresh button forces a reload. If the MLB data cannot be loaded the page says so in one line and keeps the controls usable.",
        },
      ],
    },
    {
      title: "Top 4 plays",
      summary: "The four strongest career matchups on the slate, capped at four on purpose.",
      items: [
        {
          name: "A floor before ranking",
          detail:
            "A hitter only qualifies with at least 15 career at bats and a .300 average against today's starter. These two minimums are enforced on the server and shown as fixed chips, so they cannot be loosened from the page.",
        },
        {
          name: "Ranked by average, discounted for sample",
          detail:
            "Plays are ordered by career average times at bats over 30, capped at 1. Ties go to the higher raw average, then to more at bats.",
        },
        {
          name: "Confidence colour",
          detail:
            "The average is printed green at 21 or more at bats, yellow at 18 to 20 and red at 15 to 17. The same colour marks the row in the tables and the edge of the card on a phone.",
        },
        {
          name: "Lineup badge",
          detail:
            "Each play carries a badge reading Confirmed with the batting slot, or Estimated with a projected slot in amber when the lineup has not been posted.",
        },
        {
          name: "Expected at bats and hit chance",
          detail:
            "Beside each play is the number of at bats his slot is expected to get and the chance of at least one hit, to two decimals. Both can change when the batting order is confirmed.",
        },
        {
          name: "Candidates, then a soft lock",
          detail:
            "Before the slate's first scheduled pitch the list is a live candidate board and can include estimated lineup plays. At first pitch the official Top 4 is taken from the confirmed qualifying plays available at that moment and stored.",
        },
        {
          name: "Started plays stay, open slots refill",
          detail:
            "Once a tracked play's game starts it is kept in the stored set, leaves this list and moves to the In progress table. On each refresh the slots not held by a started play are refilled from the best upcoming qualifying plays, so the upcoming part of the board can still change after the lock.",
        },
        {
          name: "Phone layout",
          detail:
            "On a narrow screen each play becomes a three line card instead of one long row, and the formula panel is replaced by a Show Me the Math button that opens the scoring page.",
        },
      ],
    },
    {
      title: "Recommended doubles",
      summary: "The Top 4 turned into two leg parlays, with the pairing chosen by the app.",
      items: [
        {
          name: "Daily Double",
          detail:
            "The main recommendation. With four plays there are three ways to split them into two pairs, and the app compares all three and leads with the pair whose two hit chances multiply highest.",
        },
        {
          name: "Secondary Double",
          detail:
            "The other two plays from the chosen split, shown as a second card in a more muted colour and described on the page as optional.",
        },
        {
          name: "Smash Double",
          detail:
            "If both legs of a pair have a career OPS above .950 and at least 7 hits against their pitcher, that pair becomes a Smash Double, turns orange and takes the lead slot. The hit minimum is there so a high OPS over a handful of at bats does not qualify.",
        },
        {
          name: "Two or three plays",
          detail:
            "When fewer than four plays qualify the app shows only the single best pair. With fewer than two it says there are not enough qualified plays and names the 15 at bat and .300 requirement.",
        },
        {
          name: "Each leg and the combined chance",
          detail:
            "Every leg shows the hitter, the pitcher, average, OPS, at bats and its own hit chance. The card ends with the two chances multiplied together.",
        },
        {
          name: "Unconfirmed lineup warning",
          detail:
            "If one or both legs are still on an estimated lineup, the card says the hit chance may shift once the batting order is set.",
        },
        {
          name: "Cards after first pitch",
          detail:
            "When a leg's game starts the card stays on the page, with the started leg dimmed and marked In Progress.",
        },
        {
          name: "Labels from server tags",
          detail:
            "After the lock the Smash, Daily and Secondary cards are built from tags the server assigns across the whole tracked set, started plays included. A card therefore does not disappear when one of its legs leaves the upcoming list.",
        },
      ],
    },
    {
      title: "Following the plays",
      summary: "The tables under the Top 4 follow each tracked play from before the game to its result.",
      items: [
        {
          name: "Upcoming, In progress, Settled",
          detail:
            "Three tables, and a play moves through them as its game does. The split follows the game state MLB reports, so a game that starts late does not move a play early.",
        },
        {
          name: "HIT and NO HIT",
          detail:
            "A play turns to HIT as soon as the live box score credits the batter with a hit. NO HIT is only shown once the game is final, and until then a hitless batter shows a dash.",
        },
        {
          name: "Recommendation tags",
          detail:
            "SMASH, DD, SD and T4 badges sit beside the batter's name, so a hitter who was part of the Daily Double is still identifiable two tables later.",
        },
        {
          name: "Full career line",
          detail:
            "Each desktop row shows batter and team, pitcher and team, average, hits, at bats, OPS, game time and lineup status.",
        },
        {
          name: "Sorting",
          detail:
            "Any column header sorts the Upcoming and In progress tables, and a second click reverses it. The default is game time, earliest first, and the Settled table is not sortable.",
        },
        {
          name: "Game time cell",
          detail:
            "Shows the start time for an upcoming game, Live for one in progress and Final for one that is over. On a phone an upcoming game also shows a countdown to first pitch.",
        },
        {
          name: "Card list on a phone",
          detail:
            "On a narrow screen the table becomes a list of cards with a coloured confidence edge, and the column headers are replaced by three sort chips for average, at bats and time.",
        },
      ],
    },
    {
      title: "Filters and export",
      items: [
        {
          name: "Optional OPS filter",
          detail:
            "Adds a minimum career OPS against the pitcher, prefilled at .950. It applies to all three tables.",
        },
        {
          name: "Optional hits filter",
          detail:
            "Adds a minimum number of career hits against the pitcher, prefilled at 7, the same floor the Smash Double uses.",
        },
        {
          name: "Apply and Reset",
          detail:
            "Filters take effect on Apply, and Reset returns to the two fixed minimums. If a filter empties the Upcoming table, the empty state offers a reset button in place.",
        },
        {
          name: "CSV export",
          detail:
            "On desktop, an Export menu downloads the recommended doubles with every leg, the Top 4, or the full filtered list. The files are named with the slate date.",
        },
      ],
    },
    {
      title: "Lineups and refresh",
      summary: "Hit chance depends on batting slot, so the page is explicit about what it knows and when.",
      items: [
        {
          name: "Confirmed lineups",
          detail:
            "When MLB has posted a batting order the play uses the exact slot and is badged Confirmed.",
        },
        {
          name: "Estimated lineups",
          detail:
            "Before the order is posted the app projects the likely nine from the team's recent starts, so the board can show candidates before lineups are out.",
        },
        {
          name: "Projected slot",
          detail:
            "An estimated hitter is given the median of the batting slots he has occupied in the team's recent games, and that slot feeds his expected at bats.",
        },
        {
          name: "Background refresh",
          detail:
            "The page refetches without a spinner every 5 minutes, and every 30 seconds while any upcoming play is on an estimated lineup or a locked slot is still open.",
        },
        {
          name: "Minute tick",
          detail:
            "The page also re-renders every 60 seconds, so a double's leg is marked as started at its scheduled time between fetches.",
        },
      ],
    },
    {
      title: "Explaining the method",
      summary: "The math is shown on the page.",
      items: [
        {
          name: "Scoring and selection logic",
          detail:
            "A panel inside the Top 4 section sets out six formulas: ranking, regression, expected at bats, hit chance, double selection and Smash priority. Each has a one line reason under it.",
        },
        {
          name: "Key symbols",
          detail:
            "Four cards define AVG, AB, P and E[AB] before any formula uses them.",
        },
        {
          name: "Collapse that is remembered",
          detail:
            "The panel can be collapsed, and the choice is kept in the browser so it stays that way on the next visit.",
        },
        {
          name: "Scoring page",
          detail:
            "The same content has its own page at /scoring-logic, which is what phones link to.",
        },
        {
          name: "Info tips",
          detail:
            "Small i buttons beside the double labels and the skipped count open a short explanation on hover or tap.",
        },
        {
          name: "Footer methodology",
          detail:
            "Four short columns cover why average is the stat used for this prop, the minimum requirements, how ranking and confidence work, and what lineups and filters change.",
        },
        {
          name: "Disclaimer",
          detail:
            "A separate page states that the site is informational and that history does not account for form, injuries, weather or lineup changes. It lists problem gambling helplines for the USA and Canada along with an age restriction.",
        },
      ],
    },
    {
      title: "Discord alerts",
      summary: "A separate alert board, posted to a Discord channel by webhook. Its schedule is switched off for now.",
      items: [
        {
          name: "Board lock post",
          detail:
            "The alert board locks 60 minutes before the slate's first pitch by default, from confirmed lineup plays only, and posts the numbered Top 4.",
        },
        {
          name: "Doubles post",
          detail:
            "Each recommended double is posted with its label and both legs.",
        },
        {
          name: "Late additions",
          detail:
            "If a slot was open at the lock and fills when a later lineup confirms, the added play gets its own message.",
        },
        {
          name: "Hit alerts",
          detail:
            "A message goes out when a tracked hitter records a hit, and another when both legs of a double have hit.",
        },
        {
          name: "Day summary",
          detail:
            "Once every tracked game is final, one message reports how many plays hit and how many doubles hit.",
        },
        {
          name: "No pings",
          detail:
            "Messages are sent with mentions disabled and any leading @everyone or @here is stripped.",
        },
      ],
    },
  ],
  engineering: [
    {
      name: "One data source, six endpoints",
      detail:
        "Everything comes from the public MLB Stats API: the schedule hydrated with probable pitchers and lineups, the game box score, the active roster, career hitting totals, the batter versus pitcher split (vsPlayerTotal) and player names. The day's schedule and the box score are always fetched fresh because lineups change up to first pitch.",
    },
    {
      name: "Lineups resolved in three steps",
      detail:
        "A lineup is taken from the schedule if it lists at least 8 players, then from the box score's batter list, then from an estimate. Once a game's scheduled start has passed the estimate is never used, and a team with no real batters available returns nothing.",
    },
    {
      name: "Lineup estimation",
      detail:
        "The estimate reads the team's last 14 days and uses up to 6 games that had a posted lineup, ranking roster players by number of recent starts, then median batting slot, then career plate appearances as a last tiebreak. Any partially posted lineup IDs are kept at the front.",
    },
    {
      name: "Batched lookups",
      detail:
        "Every lineup spot against the opposing starter is its own request, so they run in batches of 20 with a 200 millisecond pause between batches. Each batch uses Promise.allSettled, so one failed lookup drops one hitter and leaves the rest of the slate intact.",
    },
    {
      name: "Stats from the raw split",
      detail:
        "Average, slugging, on base, OPS and extra base hits are computed from the counting stats in one function used by every route, without reading the API's own rate fields. Rows under 15 at bats or .300 are discarded on the server before anything is ranked.",
    },
    {
      name: "Duplicate line guard",
      detail:
        "If three or more hitters on one team show the identical counting line against the same pitcher, the server drops all of those rows before ranking.",
    },
    {
      name: "Ranking score",
      detail:
        "score = AVG × min(AB / 30, 1), a straight ramp that gives half credit at the 15 at bat floor and full credit from 30. Below 30 at bats the score reduces to hits divided by 30, which is why the tiebreak on raw average matters.",
    },
    {
      name: "Hit chance",
      detail:
        "The career average is first shrunk toward .320 with a weight of AB / (AB + 50), the same as adding 50 at bats of a .320 hitter; the target is .320 because the pool has already been filtered to .300 and above. The chance of at least one hit is then 1 − (1 − adjusted AVG)^E[AB], which treats at bats as independent.",
    },
    {
      name: "Expected at bats by slot",
      detail:
        "A fixed table: 4.45 for slots 1 to 3, 4.25 for slot 4, 4.05 for slots 5 and 6, 3.85 for 7 to 9, and 4.1 when the slot is unknown.",
    },
    {
      name: "Choosing the doubles",
      detail:
        "Four plays give three possible splits into two pairs, compared by number of Smash pairs first, then pair by pair on combined chance, then on a confidence score from each leg's sample tier. With two or three plays every pair is scored and the best one is kept.",
    },
    {
      name: "Storing the lock",
      detail:
        "On the first request after the first scheduled pitch the Top 4 is written to Vercel KV for 36 hours, built only from confirmed lineup plays, and later requests keep its started plays and refill the other slots. Each game's confirmed qualifying rows are also snapshotted before it starts, so an in progress row keeps its pre-game numbers, and tags are assigned on the server from the stored set.",
    },
    {
      name: "Layered caching",
      detail:
        "The compiled response is cached in KV for 5 minutes, or 30 seconds while the board can still change, and never past the lock moment. Under that, batter versus pitcher splits and rosters are held in memory for 60 minutes and names for 24 hours, and the client polls on the same two intervals.",
    },
    {
      name: "Storage with a local fallback",
      detail:
        "A thin wrapper sends reads and writes to Vercel KV when its credentials are present and to an in-memory map with the same expiry behaviour when they are not, so the app runs locally without KV credentials.",
    },
    {
      name: "Scheduled Discord notifier",
      detail:
        "A GitHub Actions workflow, switched off for now, calls the notifier route every 5 minutes with a bearer secret, which the route checks whenever a secret is configured; with none set the route accepts any request. The route keeps its own snapshot of the board, gives every event a deterministic ID and stores sent IDs in KV for 72 hours so nothing is posted twice, and a dry run returns the pending messages without sending them.",
    },
    {
      name: "Manual lineup exclusions",
      detail:
        "An admin route that refuses every request unless its secret is configured and supplied can remove a player from estimated lineups for a date, optionally scoped to a team or a single game, and clears the cached response when it changes. Exclusions expire after 7 days and never affect a confirmed lineup.",
    },
    {
      name: "Tests",
      detail:
        "Eight Jest files cover the scoring and double selection, stat parsing, game status, both caches, lineup estimation, exclusions and the Discord event builders. There are no component or route tests.",
    },
    {
      name: "Failure handling and limits",
      detail:
        "A failed slate fetch returns a 502 and the page shows one line, and a failed box score fetch is read as zero hits for that game. The site states that the method uses career history only, with no account of current form, injuries or weather, and the hit chance applies the average against the starter to every expected at bat, including the ones a reliever will throw.",
    },
  ],
};
