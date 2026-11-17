import type { ProjectDepth } from "../types";

/*
  Blakey Breakthrough, written from its repo: app/ (the dashboard routes, the
  sign-in action and the API routes), components/ (today, member, members,
  groups, messaging, settings, shell), lib/ (compute, thresholds, labels,
  dashboard, cohort, the Trainerize client and adapter, redis, session,
  health), the three GitHub workflows and vercel.json.

  This is a private product for a real coaching business. Nothing here
  describes the client's members, groups or results: every number is a
  constant in the code (a default threshold, an interval, a cap).
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "The morning read",
      summary: "Today is one screen that answers who is training, who is slipping and who to message first.",
      items: [
        {
          name: "A briefing written from the data",
          detail:
            "The greeting follows the coach's time of day, and the line under it is built from the day's counts: urgent check-ins, milestones to celebrate, and any group whose completion fell enough since last week to call out. It only says all quiet when the queue is empty.",
        },
        {
          name: "Five cohort figures",
          detail:
            "Active members, average completion with its change since last week, workouts this week against the weekly target as a percentage of pace, workouts to date, and returning against new members. The completion figure is coloured by the same cut-offs used on the other screens.",
        },
        {
          name: "Live and upcoming cohort cards",
          detail:
            "The live cohort shows its dates, week and headline counts. The next two cohorts on the schedule sit beside it with their start date and length.",
        },
        {
          name: "Average completion by week",
          detail:
            "A point for every week of the program with its value printed on it, against a dashed 80% reference line. Weeks not reached yet break the line instead of plotting as zero, and the live cohort is drawn dashed.",
        },
        {
          name: "Celebrate list",
          detail:
            "Milestones hit this week sit in their own list, apart from the problems, and each row sends a congratulation in one click or can be marked done when the coach said it in person. A sent congratulation stays marked after a reload, and a milestone leaves the list seven days after it was first seen.",
        },
        {
          name: "Cleared and not started look different",
          detail:
            "An emptied queue shows a finished state with the time it was cleared and how many members were reviewed today. A dashboard that has never synced shows a separate first-run state with a sync button.",
        },
        {
          name: "Sync status in the top bar",
          detail:
            "A dot and timestamp show when the data was last synced, next to a live clock, and clicking it opens the last sync time, member count and duration with a Sync now button. Data older than 18 hours is marked stale, and when the data is stale or the last sync failed the figures dim and a note says which day's data is on screen.",
        },
      ],
    },
    {
      title: "The action queue",
      summary: "Every member who needs a message, in the order they should be handled.",
      items: [
        {
          name: "Three sections by severity",
          detail:
            "Urgent holds members past the inactive threshold, seven days without a sign-in by default. At Risk holds low completion and steep declines, Watch holds shorter spells without a sign-in, and each section header carries its count.",
        },
        {
          name: "A priority score inside each section",
          detail:
            "Each member's most severe reason sets a base score: inactivity scores by days away, low completion by how far under the line it sits, a decline by the size of the drop. Two points are added for each further reason, and ties go to the lower completion, then to the surname.",
        },
        {
          name: "Every flag on the row",
          detail:
            "A row shows a chip for each reason, each pending milestone and the renewal outlook. The main reason is spelled out underneath: the days inactive and the last day seen, or the completion a member slid from and to over three weeks.",
        },
        {
          name: "Phase bars and completion",
          detail:
            "Three small bars show the member's weeks in the current three-week phase, with a stub for weeks not reached, beside their cohort completion.",
        },
        {
          name: "One click sends the lead message",
          detail:
            "The Send button sends the message for the row's most severe flag, and hovering it lists the message for each other flag on the row so the coach can pick a different one. The chips and the message options are built from one list.",
        },
        {
          name: "Done, and what happens after",
          detail:
            "Marking a row done removes it at once and saves in the background, and if the save fails the row comes back with a notice. A dismissed member stays dismissed across reloads, and a sync clears the dismissal once their flag has reset, so the same problem surfaces again if it returns.",
        },
        {
          name: "Keyboard triage",
          detail:
            "j and k move through the queue, Space peeks at the member, Enter opens the peek and d marks done. The keys are ignored while the coach is typing or an overlay is open, and focus moves to a remaining row after one is dismissed.",
        },
      ],
    },
    {
      title: "Flags and forecasts",
      summary: "Twelve labels in three families, each with one colour, one icon, one definition and one message.",
      items: [
        {
          name: "Inactive and Quiet",
          detail:
            "Days since the last sign-in: by default three days is Quiet and seven is Inactive. A member who has never signed in is counted from the cohort start and shown as never signed in.",
        },
        {
          name: "Declining",
          detail:
            "Fires when weekly completion falls by more than a set number of percentage points across the last three weeks, 25 by default.",
        },
        {
          name: "Low completion",
          detail:
            "Fires when a member's cohort completion, the mean of their weekly rates, is under the churn line.",
        },
        {
          name: "Renewal outlook",
          detail:
            "Every member gets one of four forecasts: likely to renew, on track, uncertain or unlikely. Unlikely is the union of Inactive and Low completion, and the top two also require that the member is not trending down.",
        },
        {
          name: "Four milestones",
          detail:
            "A first and a larger workout count within the cohort, an all-time workout count across programs, and a streak of fully completed weeks. The counts are settings, and the chip text and the congratulation both use the configured number.",
        },
        {
          name: "Trend arrows",
          detail:
            "An up or down arrow appears when weekly completion moves more than a set number of points over three weeks. The default is five.",
        },
        {
          name: "A glossary that tracks the settings",
          detail:
            "The Tuning page lists every label with its chip, its definition written with the current numbers, and the message it triggers. Hovering a chip elsewhere in the app shows the same definition.",
        },
      ],
    },
    {
      title: "Members and the peek",
      summary: "The full roster as a ranked table, and a side sheet for one member that keeps the list in place.",
      items: [
        {
          name: "Ranked roster",
          detail:
            "Members are ranked by cohort workouts, with medals for the top three. Equal counts share a rank, a member keeps their rank when the table is searched or filtered, and the table is virtualised.",
        },
        {
          name: "Eleven columns",
          detail:
            "Rank, name with a returning-member mark, group, cohort workouts, all-time workouts, completion, streak, phase bars, trend, last active and renewal outlook. All sort except group, phase bars, trend and renewal.",
        },
        {
          name: "Search and group filters",
          detail:
            "A name search and a chip per group. A group card on the Groups page links straight to the roster filtered to that group.",
        },
        {
          name: "Renewal outreach",
          detail:
            "A chip per renewal tier shows its count. Selecting one turns the table into an outreach list for that tier, with the renewal message leading on each row's Send button.",
        },
        {
          name: "Member peek",
          detail:
            "A side sheet opens from a row without covering the list, showing group, returning or new, flags, workouts, completion, streak, last active, the current phase as a bar chart, a strip of all cohort weeks on a five-step colour scale, and this week's milestones. j and k move the sheet to the next member while it is open.",
        },
        {
          name: "Messages in the peek",
          detail:
            "The peek lists the messages sent to that member from the dashboard and has a composer for a free-text message, where Enter sends and Shift+Enter adds a line. The panel states that replies live in Trainerize, because the API offers no way to read them.",
        },
        {
          name: "Hide from stats",
          detail:
            "A test account can be hidden from the figures, the queue and the rankings. Hidden members stay on the roster in grey, a chip filters the table to just them, and each row has a button to bring it back.",
        },
        {
          name: "Deactivate and reactivate",
          detail:
            "The peek can switch a member's Trainerize account off and on, and deactivating asks for confirmation with the consequences spelled out. A deactivated member leaves the figures but keeps a row on the roster, so they can be reactivated from the dashboard.",
        },
      ],
    },
    {
      title: "Groups and broadcasts",
      summary: "Performance by training group, and the tools to manage groups without opening Trainerize.",
      items: [
        {
          name: "Group cards",
          detail:
            "Each card shows the group's completion this week as a ring, workouts this week, the change since last week and a bar for every cohort week. A group with no members shows an empty state in place of a red zero.",
        },
        {
          name: "A colour per group",
          detail:
            "Group colours are assigned by stepping the hue by the golden angle from the brand orange, with separate light and dark values, so no palette has to be picked by hand as groups are added.",
        },
        {
          name: "Create, rename and delete",
          detail:
            "Group changes are written to Trainerize and the dashboard refreshes just the group data afterwards. Dialogs cannot be closed mid-request, and a second Enter while saving is ignored so one submit cannot create two groups.",
        },
        {
          name: "Move members between groups",
          detail:
            "A picker lists every client by group, including those in no group, with a name and email filter. Several people can be selected and moved or removed in one action.",
        },
        {
          name: "Broadcast to groups",
          detail:
            "Pick one, several or all groups, write a message, and choose between individual direct messages and a post in each group's chat thread. Sending asks for confirmation first.",
        },
        {
          name: "Reporting the fan-out",
          detail:
            "After a broadcast the dashboard reports the number of members or threads taken from the server's response. Selecting only empty groups for direct messages is blocked up front.",
        },
        {
          name: "Partial failures stay visible",
          detail:
            "If a write lands in Trainerize but the refresh after it fails, the coach is told the view may be out of date instead of being shown an error for a change that did happen.",
        },
      ],
    },
    {
      title: "Messaging and tuning",
      summary: "The coach edits the wording and the numbers without a code change.",
      items: [
        {
          name: "Twelve editable messages",
          detail:
            "One message per label: four check-ins, four congratulations and four renewal notes. Each is edited as plain text with placeholders such as the member's first name or the milestone count.",
        },
        {
          name: "Preview and reset per message",
          detail:
            "Under each field a preview shows the message with its placeholders filled, using the same rendering function as the real send. Each message has its own reset to the default, and an empty message cannot be saved.",
        },
        {
          name: "Tunable thresholds",
          detail:
            "Seventeen settings in six groups: inactivity, churn and renewal, trajectory and trend, targets, completion colours and milestones. Each has a range, and related settings must stay in order, so the churn line cannot be set above the on-track line.",
        },
        {
          name: "Live impact preview",
          detail:
            "While the coach edits a threshold, a panel shows how many members would land in each queue section and each renewal tier, with the change against the saved settings. It runs the same functions the server runs on save.",
        },
        {
          name: "Changes apply without a re-sync",
          detail:
            "Saving thresholds reclassifies the stored data in place, so the new tiers are on screen on the next page load without calling Trainerize again.",
        },
        {
          name: "Cohort schedule editor",
          detail:
            "Cohorts are created, renamed, re-dated and removed on the Tuning page, with program length derived from the dates and the active cohort picked by today's date. Saving starts a full sync because the weekly data has to be re-sliced.",
        },
        {
          name: "Guard rails on the forms",
          detail:
            "The threshold and message editors warn before the tab closes with unsaved changes. A threshold field left empty restores its saved value instead of snapping to the minimum, and Reset to defaults is one button.",
        },
      ],
    },
    {
      title: "Getting around",
      summary: "Built for one coach, on desktop or a phone.",
      items: [
        {
          name: "Command palette",
          detail:
            "Cmd or Ctrl+K opens a palette that searches members by name and opens their peek, and jumps to each view including the renewal outreach list. It also runs Sync now, the theme switch and the shortcuts list.",
        },
        {
          name: "Shortcuts overlay",
          detail: "The ? key lists the keyboard shortcuts, and Esc closes overlays.",
        },
        {
          name: "Light and dark",
          detail:
            "Dark mode is a warm near-black with its own set of status colours, desaturated for a dark ground. The toggle is in the top bar and the palette.",
        },
        {
          name: "Collapsible sidebar",
          detail:
            "The sidebar collapses to an icon rail. The choice is stored in a cookie and read on the server, so the page renders in the saved layout from the first paint.",
        },
        {
          name: "Sign-in",
          detail:
            "A single username and password, with the error shaking on a wrong entry and more than ten attempts in 15 minutes from one address refused. A session lasts seven days and is re-issued once it is a day old, so regular use keeps it alive.",
        },
        {
          name: "Activity bar",
          detail:
            "A thin bar across the top of the window runs while a change is being saved or synced, and the sync indicator names the action in progress.",
        },
        {
          name: "Phone and reduced motion",
          detail:
            "Controls grow to a 44 pixel touch target on touch screens while the desktop stays compact. With reduced motion set, queue rows keep their fade and lose their slide.",
        },
        {
          name: "Old links still land",
          detail:
            "The former Analytics and Renewals pages were folded into Today and Members. Their addresses redirect there, so old bookmarks keep working.",
        },
      ],
    },
  ],
  engineering: [
    {
      name: "Working around the Trainerize API",
      detail:
        "The partner API is POST-only RPC under one base URL with Basic auth, and it has no message-read endpoint and no per-user read. Group membership comes from each group's own member list because the group compliance call is refused on this plan, and the cohort schedule is stored in the dashboard.",
    },
    {
      name: "A throttled client",
      detail:
        "A sync fires one compliance call per member plus the group calls at once, so the client caps concurrency at 6 and spaces request starts 60 ms apart to stay under the API's 1,000 requests a minute. It retries 429, 502, 503 and 504 up to four times, honouring Retry-After and otherwise backing off exponentially to 8 seconds, and one client is shared across warm invocations so two routes cannot each spend a full budget.",
    },
    {
      name: "One wide call per member",
      detail:
        "The roster fetch asks for each member's compliance across a 730-day window and caches the cohort slice, so the per-member compliance step that follows reuses it instead of doubling the traffic. The same window gives all-time workouts, and a member with more all-time workouts than cohort workouts is inferred to be returning.",
    },
    {
      name: "Completion that does not punish empty weeks",
      detail:
        "A member's completion is the mean of their weekly rates, and weeks with nothing scheduled are dropped before that mean because counting them as zero would flag low completion and invent declines. Weeks that were scheduled and missed stay in as zero.",
    },
    {
      name: "Pure classification functions",
      detail:
        "Trend, renewal tier, alert reasons, priority, milestones, group stats and the briefing are pure functions in one file, run in a fixed order: trend, then tier, then reasons and the queue. The classifiers take the threshold config as an argument, which is what lets the Tuning preview run them in the browser on unsaved values.",
    },
    {
      name: "A label registry",
      detail:
        "Each label's name, colour, icon, definition, the threshold that tunes it and the message it triggers live in one registry that the screens render labels through. A test pins the registry's threshold and message references, so changing one side without the other fails the suite.",
    },
    {
      name: "A snapshot, with dismissals applied at render",
      detail:
        "A sync builds the whole dashboard once and stores it unfiltered in Upstash Redis, and pages render from that snapshot, read once per request and shared between the layout and the page. Dismissals, congratulation stamps and the seven-day milestone expiry are applied on each render, so a row marked done stays done on reload without waiting for the next sync.",
    },
    {
      name: "Milestones that keep their date",
      detail:
        "Milestone detection is by week, so each sync would otherwise re-stamp the achievement time and the seven-day expiry would never fire. The first detection is stored per member and milestone and reused by later syncs, and when detection ends the congratulation stamp is cleared with it so a repeat achievement does not arrive already congratulated.",
    },
    {
      name: "Serialised writers",
      detail:
        "A full sync takes a Redis lock with a 120 second expiry and a second sync gets a 409. The cheaper refreshes after a group change or a threshold save wait up to 5 seconds for a running sync before their read-modify-write, then proceed either way.",
    },
    {
      name: "Scheduling and the alarm, kept apart",
      detail:
        "A GitHub Actions workflow triggers the sync every 30 minutes with three attempts and always exits green, and a daily Vercel cron is the fallback. A separate workflow reads a health endpoint eight times a day and fails when the last successful sync is more than three hours old, when there is no snapshot, or when the endpoint cannot be reached.",
    },
    {
      name: "Failure handling",
      detail:
        "A failed sync keeps the previous snapshot and marks it errored, a failed read shows an error card whose retry starts a sync, and optimistic dismissals roll back with a notice. Stored thresholds, messages and schedules are sanitised on read, so a record saved before a field existed falls back per field to the default.",
    },
    {
      name: "Writes that are verified",
      detail:
        "Trainerize's status endpoint answers success for several request shapes that change nothing, so the adapter sends the one shape that works and then confirms the result against the client list. Creating a group re-reads the list to find the new id, and renaming resends the icon so it is not wiped.",
    },
    {
      name: "Auth and gating",
      detail:
        "The password is checked against a bcrypt hash and the username with a timing-safe compare, both checks always run, and sessions are HS256 JWTs in an httpOnly cookie signed with a secret of at least 32 characters. Every API route checks the session or a shared timing-safe bearer secret itself, and sending messages and writing to Trainerize are gated by server-side flags.",
    },
    {
      name: "Privacy and input boundaries",
      detail:
        "Ids are limited to a 64-character pattern of letters, digits, hyphens and underscores because they become parts of Redis keys, and message bodies and id lists are capped. Captured API responses are git-ignored because they contain member data, and local development defaults to the mock source.",
    },
    {
      name: "A mock source and the test suite",
      detail:
        "The data source is an interface with two adapters, and the mock one generates a seeded, deterministic roster with a fixed quota of each member archetype and an injectable date. Vitest covers the classification maths against a frozen baseline config, the Trainerize client and adapter with injected fetch and sleep, the write routes, sessions, the lock and the health verdict, across 29 test files.",
    },
    {
      name: "Dates in the coach's timezone",
      detail:
        "The server runs in UTC, where an evening in the coach's timezone is already tomorrow, so the greeting, the reviewed-today count and the last-seen dates are computed through one module pinned to that timezone. Cohort week maths is done at UTC noon so daylight saving cannot shift a week.",
    },
    {
      name: "Delivery",
      detail:
        "TypeScript runs in strict mode with unchecked index access turned on, and a pre-commit hook runs lint-staged (ESLint with zero warnings and the related Vitest tests on staged TypeScript files) and then a full type check. CI runs lint with zero warnings allowed, the type check, a production build and the tests on pushes to main and on pull requests.",
    },
  ],
};
