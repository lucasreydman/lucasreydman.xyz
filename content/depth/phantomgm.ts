import type { ProjectDepth } from "../types";

/*
  Written from fbi-basketball and checked item by item against it:
  app/phantomgm, components/phantomgm, lib/phantomgm, app/api/phantomgm,
  app/api/cron/phantomgm-autopilot, tests/unit/phantomgm and
  docs/agents/phantomgm.md. PhantomGM is a work in progress, open to FBI
  admins only and not launched. It is being built by the FBI Basketball team,
  Lucas included, and the site credits it that way: to the team, with no
  individual named (Lucas, 2026-11-11: "we build it together"). Every number
  here is a constant or a count in that code.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "Connecting Fantrax",
      summary:
        "Fantrax has no write key, so the app works through two separate connections and never asks for a password. It is a work in progress that only FBI admins can open.",
      items: [
        {
          name: "Read-only league list",
          detail:
            "A Fantrax User Secret ID lists the manager's leagues and their team in each. It is the same connection the H2H Planner uses, so a manager who already connected there has nothing to do.",
        },
        {
          name: "Lineup access by pasted session",
          detail:
            "The app does not sign in to Fantrax for anyone. The manager signs in on fantrax.com and pastes the sign-in cookie, which is checked against Fantrax before it is kept.",
        },
        {
          name: "Guided wizard",
          detail:
            "One action per step, each with a drawing of the Fantrax screen it refers to, then a live check on what is pasted. On a phone the lineup-access step is a single screen that says to do it once on a laptop or desktop.",
        },
        {
          name: "Forgiving paste",
          detail:
            "The paste box accepts the bare cookie, a whole Cookie header, a copied cURL command or a cookie-export JSON. It refuses a paste that lacks Fantrax's remember-me cookie.",
        },
        {
          name: "Preview before connecting",
          detail:
            "Without a session every plan still shows, built from Fantrax's published data. Locks, injury tags and roster room are left out there, and every save is refused.",
        },
        {
          name: "Signed-out banner",
          detail:
            "When Fantrax ends the session, every screen carries a red banner saying autopilot is paused, with a Reconnect button. The top bar and sidebar stop saying autopilot is on.",
        },
        {
          name: "Disconnect",
          detail: "Lineup access can be removed from Settings at any time, separately from the read-only league list.",
        },
      ],
    },
    {
      title: "Tonight",
      summary: "The home screen: every league at a glance, and one button that sets them all.",
      items: [
        {
          name: "The night's figures",
          detail:
            "How many leagues are set, how many need moves, the moves planned, and the win chance the plans add across all matchups. While Fantrax is still being read the labels are already there and each figure says it is reading.",
        },
        {
          name: "A card per league",
          detail:
            "Status, the manager's team with its record and place, the format, the win chance with and without the plan, tonight's starters, the first three moves and the best pickup. Cards side by side share their rows, so the same section sits at the same height on each.",
        },
        {
          name: "Moves with reasons",
          detail:
            "Each move says who, where to, and why: how many games he has, no game, Fantrax lists him out, games saved under a cap. A start also names the categories it helps most in this matchup.",
        },
        {
          name: "Run autopilot",
          detail:
            "One press plans each league shown on Tonight fresh and saves it, three leagues at a time, each league's days in date order. Closing the sheet mid-run lets the leagues already started finish and starts no new one.",
        },
        {
          name: "Step log",
          detail:
            "Each league in the run shows a log of what the server answered: the plan, then every save with Fantrax's message if it refused. Lines read out of the single plan answer are tagged \"found\", so nothing is shown as progress that was not a real request.",
        },
        {
          name: "Run without a session",
          detail:
            "Until a session exists, the Run controls in the tab bar and sidebar keep their place, read as unavailable and say why. A run started while another is saving is told to try again.",
        },
        {
          name: "Install card",
          detail:
            "Steps to add the app to a home screen, written for the browser and phone in use, with a picker for the others. It can be put off for a week or dismissed for good.",
        },
      ],
    },
    {
      title: "The league screen",
      summary: "One league in full, for a manager who wants to see why.",
      items: [
        {
          name: "Win chance, now and planned",
          detail:
            "The same week is played twice, once with the lineups Fantrax holds and once with the plan. The screen shows both chances and the difference in percentage points.",
        },
        {
          name: "Category by category",
          detail:
            "In a categories league each category has its own chance to be won, now in grey and with the plan in colour. A category the plan leaves between 35% and 65% is flagged as a swing.",
        },
        {
          name: "Lineup for each day",
          detail:
            "A tab per day in the planning window, with a dot on the days that have moves. Each slot shows the planned starter, his opponent, his chance to play when it is in doubt, and who Fantrax has there now when that differs.",
        },
        {
          name: "The week as a grid",
          detail:
            "Each player with a game in the window or an active slot against every day: a planned start, a bench game, a new start ringed, a game he is not expected to play striped. The last column counts each player's starts.",
        },
        {
          name: "Games caps",
          detail:
            "In a league that caps games per slot, each slot shows games played, games the plan uses and the maximum.",
        },
        {
          name: "This period or the next",
          detail: "A switch plans the following scoring period instead, so next week can be set before it starts.",
        },
        {
          name: "Notes a manager can act on",
          detail:
            "A commissioner lock, a live draft or a slot nobody on the roster can fill is said in a line. Things the manager cannot change are left out.",
        },
        {
          name: "Per-league autopilot and re-read",
          detail: "The league's own autopilot switch sits at the top, next to a button that reads Fantrax again.",
        },
      ],
    },
    {
      title: "What the planner decides",
      summary:
        "The rules it follows. The lineup rules are the team's own, and the value of a start comes from FBI's projection engine.",
      items: [
        {
          name: "Valued in the league's own terms",
          detail:
            "A start is worth what it does in this league: categories weighted by this week's matchup in head-to-head categories, the league's point weights in points leagues, z-scores in roto.",
        },
        {
          name: "Out players do not start",
          detail:
            "A player Fantrax lists out or suspended is worth nothing on every planned day and is benched even with nobody to replace him, except in a weekly league that needs every slot filled. Once Fantrax shows him playing, the next run can start him again.",
        },
        {
          name: "Games banked under caps",
          detail:
            "Where a slot has a weekly games limit, the whole remaining period is planned at once, so tonight's sit can be what saves a game for a better night. Later days count 2.5% less per day, which leans the plan toward using games early.",
        },
        {
          name: "Injured reserve, filled",
          detail:
            "An open IR spot takes the longest absence among the players Fantrax allows into IR, which opens a roster spot. Only absences of a week or more go there.",
        },
        {
          name: "Injured reserve, rebalanced",
          detail:
            "When IR is full, an occupant due back within a week swaps with a bench player who is out at least a week longer. An IR player who is expected to play comes back, by swap or into an open roster spot, when starting him improves the lineup.",
        },
        {
          name: "Leagues that refuse saves over IR",
          detail:
            "Some leagues reject every lineup while an untagged player sits in IR. The planner records that per league from Fantrax's refusal and clears IR first there.",
        },
        {
          name: "Minors call-ups",
          detail: "A minor-league player is called up only when the roster has room, the lineup improves and Fantrax's own dry run accepts the move.",
        },
        {
          name: "Weekly and locked leagues",
          detail:
            "A weekly-lineup league gets one lineup for the week and is left alone once it tips. Each day is compared with that day's own lineup in Fantrax, since future days are saved separately.",
        },
      ],
    },
    {
      title: "Pickups, claims and bids",
      summary: "Suggested by the app, made only when the manager presses the button.",
      items: [
        {
          name: "Only real pickups",
          detail:
            "A player is suggested only when the league's pool lists him as a free agent or on waivers and no roster holds him this period or the next. The league is read live for this, not from a cache.",
        },
        {
          name: "Valued from the day he joins",
          detail:
            "A pickup counts only for the games after he would join, and the dropped player's games are lost from that day. With an open roster spot nobody is dropped, and under a games cap he counts only for the starts the cap has room for.",
        },
        {
          name: "Checked with Fantrax first",
          detail:
            "The top 3 suggestions are asked of Fantrax exactly as the button would send them, and the week is replayed on the answers if a date moved or one was refused. A pickup with no start left this week is not suggested.",
        },
        {
          name: "Add, Claim or Bid",
          detail:
            "The button says what will happen: a free agent is an add, a waiver player is a claim, and a league that takes bids gets a bid. The sheet says when it takes effect and how many of his games come after that day.",
        },
        {
          name: "Suggested bid",
          detail:
            "A free agent starts at the minimum. Where the league's budget rules are known, which is FBI's own leagues, a waiver player's bid is a share of the budget set by his rest-of-season rank and how much season is left, with step buttons to change it.",
        },
        {
          name: "Changing the drop, and warnings",
          detail:
            "The manager can pick a different player to drop, and a Fantrax warning needs a second, explicit press. In a league that looks like a dynasty or keeper league, the sheet warns that the suggested drop is only the player worth least this week.",
        },
        {
          name: "Pending claims",
          detail:
            "A placed claim shows in amber where the suggestion was, with the bid, the drop if it wins and when it runs. It can be re-bid or cancelled, and that player is not suggested again.",
        },
        {
          name: "What it will not do",
          detail: "Autopilot only sets lineups and IR. It never adds, drops or bids by itself, and nothing in the app trades.",
        },
      ],
    },
    {
      title: "Autopilot, Leagues, Activity",
      summary: "Leaving it running, choosing where, and reading back what it did.",
      items: [
        {
          name: "Autopilot switch and day timeline",
          detail:
            "Settings shows the day's runs as ticks, the ones already past dimmed, a marker at now and the next run in the viewer's own time zone. The times come from the UTC schedule, so they stay right when the clocks change.",
        },
        {
          name: "Every 30 minutes through game time",
          detail:
            "Each run re-reads Fantrax and the injury news and saves what changed, so a late scratch is benched on the next run before his tip. A starter whose game has tipped is left alone.",
        },
        {
          name: "Per-league switches",
          detail:
            "The Leagues screen lists every league with one switch for autopilot and another to keep the league off Tonight. A hidden league can still be on autopilot.",
        },
        {
          name: "Last save per league",
          detail: "Each league row says when it was last saved, or that Fantrax refused the last save.",
        },
        {
          name: "Activity feed",
          detail:
            "The last 120 saves, grouped by day: who went in and at which slot, who came out and why, IR moves, adds and claims, and what the save added to the win chance. A refused save is listed too, with Fantrax's message.",
        },
        {
          name: "Totals",
          detail: "Saves and moves across those entries, and how long ago the last run started.",
        },
      ],
    },
    {
      title: "The app itself",
      summary: "A separate app inside the FBI site, with its own brand. It has not launched.",
      items: [
        {
          name: "Installable phone app",
          detail:
            "It has its own manifest, icon set and start page, apart from the FBI app on the same domain. On a phone it has a bottom tab bar with Run raised in the middle; from 1024 pixels wide a sidebar replaces it.",
        },
        {
          name: "Offline notice",
          detail: "A one-line strip appears when the device is offline and says autopilot keeps running on the server.",
        },
        {
          name: "Your name",
          detail: "The name the app greets the manager by can be set in Settings. It changes nothing elsewhere on the site.",
        },
        {
          name: "Admins only for now",
          detail:
            "Anyone who is not an FBI admin gets the site's not-found page on every screen, and a 404 from every PhantomGM API route. The only link to it is a tile on the admin dashboard.",
        },
        {
          name: "Reduced motion",
          detail: "With reduced motion set, the run log shows every line at once and the working indicator stands still.",
        },
      ],
    },
  ],
  engineering: [
    {
      name: "Writing to a site with no write API",
      detail:
        "Lineups are saved by replaying the manager's own Fantrax session against the endpoints Fantrax's web app uses. The session is encrypted with AES-256-GCM before it is stored and refreshed in place when Fantrax re-issues a cookie.",
    },
    {
      name: "The save path",
      detail:
        "Every save reads the period fresh and refuses a stale plan, asks Fantrax for a dry run and refuses on any illegal-roster message, lock or later effective date, then executes, reads the period back and compares every requested spot. A lineup is saved for its own day only and an IR move is saved forward so it holds.",
    },
    {
      name: "Lineup assignment",
      detail:
        "Players are assigned to slots with the Hungarian algorithm over Fantrax's own eligibility, which finds the lineup with the highest total value. A small bonus keeps a player in the slot he already holds, so equal plans do not shuffle the lineup.",
    },
    {
      name: "Games caps as a network flow",
      detail:
        "A capped period is one min-cost flow (source to player-day, to slot-day, to the slot's remaining games, to sink) that returns the most valuable set of starts the caps allow across every remaining day.",
    },
    {
      name: "Value from the FBI projection engine",
      detail:
        "A player's worth on a date comes from the rest-of-season projection, the night's slate and his chance to play, scored through the same assembly the H2H Planner uses. When the roster has IR or minors players it is run a second time with them counted as bench, so those players have a value for IR moves and call-ups.",
    },
    {
      name: "Win probability model",
      detail:
        "Each side's expected totals are what has been scored plus every planned start's line times his chance to play, with the variance of a game that may not happen included; counting categories use a normal comparison and percentages use made and attempted, both widened by a per-category factor that shrinks as the week is played. The matchup chance is a Poisson-binomial over the category chances: more than half won, a tie split evenly.",
    },
    {
      name: "Caps inside the odds",
      detail:
        "When the week is played out, a capped slot stops counting once its games run out, in date order. The opponent's side is the engine's projection of his week.",
    },
    {
      name: "Scheduling and the hand-off at tip",
      detail:
        "A cron runs every 30 minutes from 14:00 to 04:30 UTC, the span NBA tips fall in, for every account with autopilot on and a working stored session. Fantrax marks a starter as locked when his game starts and the planner pins a locked player where he is, so the hand-off needs no clock of its own.",
    },
    {
      name: "One run at a time",
      detail:
        "A manual run and the cron cannot save for the same manager at once: each checks for an unfinished run started in the last 10 minutes. A signed-out session is marked, and the cron skips that manager until a new one is pasted.",
    },
    {
      name: "Unknown is not assumed",
      detail:
        "If Fantrax does not answer the caps view, or answers for a different week, that league is stopped for the run and tried again on the next one, 30 minutes later. A player whose pool status is unknown is not treated as free, and a failed IR save stops that league for the run.",
    },
    {
      name: "Commissioner locks",
      detail:
        "Whether a league is frozen is found with a dry run. The answer is remembered per league and re-checked after 6 hours when locked and 24 hours when not.",
    },
    {
      name: "Claims match their preview",
      detail:
        "A claim is sent only if Fantrax's answer still matches the preview the manager was shown; otherwise nothing is sent and the new answer is shown. Whether a pickup needs a bid is read from Fantrax's player-details call, and a claim refused for want of a bid comes back asking for one.",
    },
    {
      name: "Storage and audit",
      detail:
        "Six Postgres tables hold sessions, settings, per-league choices, learned league rules, runs and saves. Every save is a row, accepted or refused, and each autopilot run records the IR picture it saw for every league so a wrong call can be read back.",
    },
    {
      name: "Preview port",
      detail:
        "The planner talks to Fantrax through one interface. A second implementation answers the same reads from the published API and refuses every write, dry runs included, which is how plans show before lineup access is connected.",
    },
    {
      name: "Tests",
      detail:
        "76 unit tests in 7 files cover the planner, the Fantrax parsers, IR and pickups, claims, pending claims, bids and the run log. The planning modules are pure functions with no I/O, so they are tested without Fantrax.",
    },
    {
      name: "Two apps on one origin",
      detail:
        "The FBI site and PhantomGM both install as phone apps from the same domain, so crossing from one to the other forces a full page load and each keeps its own manifest. The installed app's start URL serves a real page that replaces itself with the app or the sign-in, in place of an HTTP redirect.",
    },
  ],
};
