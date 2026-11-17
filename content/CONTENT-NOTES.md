# Content notes

## Order, and something to do under every project (2026-11-16)

Lucas: "all should have CTA or coming soon or link to free tool".

- **Order.** PhantomGM moved from sixth to eighth. It sat next to Playcaller,
  and both are lineup autopilots drawn as dark phones. It is also the only
  project that is unfinished and shared, so it now follows everything that is
  done and his alone. The full reasoning is above the list in `projects.ts`.
- **Which tools are public** was checked by loading each one signed out:
  GLUE Index, SHARPRFI, Fandex, Lineup Lab and Hitlist open with no account.
  Playcaller asks for his passcode, Blakey for the coach's login, TPDL is
  private to the league and PhantomGM is in testing with FBI's admins.
- **The baseball tools are empty in the off-season** (SHARPRFI showed "No
  games scheduled" on the day). Their notes say so, so nobody clicks through
  in November and thinks the tool is broken.
- **Playcaller and PhantomGM say "Coming soon"** with no link out, in Lucas's
  words. Their own pages on this site still open.
- **TPDL and Blakey ask for email**: a platform for your own league, and
  freelance work for a business or brand. Blakey's page keeps its link to the
  business beside it.
- **Copy pass on the home page, same day.** The hero ask now names sports
  analytics. The projects lede counts PhantomGM as the FBI team's and says
  five tools are free. The About list of projects gained GLUE Index and
  Fandex, which it predated. Two About paragraphs and the first FBI screen's
  line were reworded to say the same things in plainer words. No fact was
  added.
- The "No link out" line in the Fandex notes below is superseded by this.

## Every project page checked against its repo (2026-11-16)

Lucas: "all of the individual pages where you actually click in to see the
math need to ensure all the text is valuable and useful and truthful". Each
page's write-up, inventory and captions were read against a fresh clone of the
product repo, and about fifty lines were corrected. What changed, and what to
remember:

- **FBI.** ESPN is a fourth league host. The rankings board is paid: a free
  account gets the leaderboard preview, so nothing says "the board is free".
  The dynasty lists are editorial, so the engine is credited with the redraft
  boards, tiers and trade verdicts, never "every number". Migration and test
  counts are now "more than", because they move with every merge.
- **GLUE Index.** Salaries come from Basketball Reference, so pbpstats is the
  source of every count, not of every number. Stars, value and salaries are
  live now; the older note below that calls them uncommitted is out of date.
  The nightly job had failed every scheduled run from 2026-11-12 (setup-node
  v5 looking for pnpm). It was fixed in the product repo the same day and the
  missing nights were pulled.
- **Fandex.** Nineteen franchises "no longer play": the Coyotes are in that
  set and did not fold. The 1.6 on season scores is a fixed constant; the
  engine does not measure that ratio, so the page no longer says it does.
- **SHARPRFI.** The reference score on the backtest is a constant 50% guess
  (0.2500). It used to be "always 49%" at 0.2499, which assumed a run rate the
  repo does not record. The verdict has four bands, and the strikeout factor
  is clamped, not damped by an exponent.
- **Hitlist.** A started play leaves the Top 4 for the In progress table. The
  .320 is a fixed target, not a measured mean. The line calling batter versus
  pitcher "the most quoted number in the hit market" was removed.
- **TPDL.** Data is mostly ESPN, with Sleeper, the NBA injury report and NBA
  Draft Room. Rankings, lineups and odds each adjust the house projection, so
  they do not all read one figure.
- **Playcaller.** Fifteen simulated scenarios. The agreement rate covers
  weeks 3 to 8. Left as Lucas's own figures, because they come from his
  leagues and his README and no code can confirm them: twenty-six leagues,
  2,275 FAAB claims with 41% and 1 of 14, and about 3,000 claims and adds.
- **Lineup Lab.** Kickers are priced by the books and defenses come from
  Sleeper alone. Receivers still get a matchup adjustment from this season.
- **PhantomGM.** The job re-plans leagues that have autopilot on.
- **Blakey.** Completion is workouts done over workouts scheduled, not over a
  target of four. Two lines about time saved and about which members the
  coach heard of last were removed: nothing supports them.
- **Not checked line by line:** the interface-behaviour items in the feature
  inventories (roughly 90 for FBI, 145 across Lineup Lab, PhantomGM and
  Blakey, 40 across TPDL and Playcaller). Samples of them held.

## Fandex added (2026-11-16)

Lucas: "check fandex repo. new project. can add to portfolio." First written
from `lucasreydman/fandex` at 714226d, then redone the same day at ca5bdff
after Lucas pushed five more leagues, franchise history and city spells, and
brought up to 0210d41 (hollow pennant for a lost final, extra league slots as
cards, names in full) and to 646fd67 (folded clubs kept as inactive
franchises, the city scale as a row of marks, sigma replaced by plain words).

- **Where it sits.** Fifth, after TPDL. It is a light page between dark ones.
- **The screens use the product's real output.** The standings are public, so
  nothing is invented: `components/surfaces/fandex-data.ts` is what Fandex's
  own engine returns for its own data file of 2026-11-17, for a fan born in
  2005 with Denver's club in each big league and the Rapids in MLS. Denver was
  picked because its clubs run from a title winner to nearly last, so the
  tapes show the whole colour range, and the Rapids fill one of the new small
  slots. It says nothing about who Lucas roots for. To refresh: rerun the
  product's `compute`, `summarize` and `curve` over its `data.json` and
  rewrite `fandex-data.ts`; the counts in the copy (221 franchises, 19 of
  them folded, 63 cities, 126 big-four clubs, 209 playing since 2005) and the
  spreads in `FdxSpread` come from the same run.
- **No team logos.** Fandex shows each club's ESPN logo. This site does not
  show team or league logos, so a club is a chip in its own colour with its
  abbreviation and a league is its name alone. Highlights stay red: the
  product's "Use my team's colour" switch, on by default, is drawn off.
- **The map** is the product's own paths, thinned to whole pixels
  (`fandex-map.ts`), and only the wide Cities screen draws it.
- **No link out**, like every project but FBI, though it is live at
  thefandex.vercel.app.
- **Not on the résumé, on purpose.** Lucas, 2026-11-16: "the resume is bad
  anyways ... we will be redoing the whole thing". Do not patch projects into
  the current sheet. Fandex gets considered when the résumé is redone.
- The projects lede in `profile.ts` counts the projects ("Seven projects ...
  and one dashboard for a client"). Change it when one is added or removed.

## Single-scroll portfolio (2026-11-11)

The site was restarted twice on this date. The first restart was a masonry
wall of tiles with filter chips, copied from the layout of two galleries Lucas
had pointed to (inspora.design, motionvideo.xyz). He meant the craft of the
pieces on them, not their layout, and it is a portfolio: one scroll. The wall
was removed the same day. `AGENTS.md` has the lesson and how the page is built.

- **The screens are rebuilds.** Every product screen on the site is live markup
  drawn from the real product's code and styles, with sample data. Lucas asked
  for this: "you can seed fake data / generate fake surfaces that show how the
  data might look when nicely populated". The project pages say so in one line.
- **Real players, real headshots.** Lucas rejected initials in place of
  headshots. Headshots load from ESPN's public CDN by athlete id.
- **No invented injuries.** No sample shows a real, named player as hurt, out,
  or moved to an injured list with a made-up reason.
- **Private data stays out.** TPDL teams and managers are invented. Every
  Blakey member, group and figure is invented, and the coach is not named.
- **Credit.** SHARPRFI: built with Francisco Nevarez. PhantomGM: the FBI
  Basketball team is building it together, Lucas included, and it is still in
  development. Credit it to the team. An earlier draft attributed parts of it
  to a named colleague from code comments; Lucas corrected that: "its just not
  true. we build it together". No colleague is named anywhere on the site. FBI:
  the analysts write the rankings content.
- **Depth.** Lucas: "dont sell any of my projects short". Each project page
  carries a full feature and engineering inventory in `content/depth/`, written
  from the repo and then fact-checked against the code by a second reader.
- **Résumé.** `/resume` and a one-page PDF. FBI's lines were reworded so the
  model leads. The other roles keep their facts.
- **GLUE Index** was added on 2026-11-11 and sits second, after FBI. Its
  screens use real rows from its public JSON (the night of 2026-11-10 and the
  2025-26 season), because the product's data is public. Only what is live at
  glue-index.vercel.app is described: the repo had uncommitted work in
  progress that day (stars, value, salaries), and none of that is on the site.
  Its own branding was kept as it is.
- **Screen quality pass (2026-11-11).** Lucas: "ensure the actual photos you
  are displaying here are filled properly and doesnt wrap weird". Every screen
  was reviewed at the sizes it is shown. Lessons: a name, a stat line or a
  price never wraps; a headshot fills its frame; a screen that runs off its
  tile ends between rows; phone apps are drawn at their real 390 width, not a
  narrower frame; and the home page shows one screen per project at readable
  size, because a second small screen had type about 6 pixels tall.
- **No filler lines.** Lucas removed the "Basketball · Dynasty league platform
  · Designed and built it" line from the home shots and the four-item fact row
  from project pages, as filler. Do not add meta rows like these.
- **Hitlist** is the product that was called MLB BvP. Lucas renamed it on
  2026-11-11 ("its very literal but also doesnt convey anything") and chose
  Hitlist from a list. The repo is now `lucasreydman/hitlist` and the app is
  live at hitlist-mlb.vercel.app (`hitlist.vercel.app` belongs to someone
  else); the old repo URL and bvp-betting.vercel.app redirect. On this site
  its key is `hitlist` and `/work/bvp` redirects. Older notes below still say
  MLB BvP.
- **New marks, same day.** SHARPRFI's baseball icon became a green diamond with
  a 1 in it (the first inning). Hitlist's mark is a ball leading three ranked
  bars. Both were changed in their own repos first, then copied here.
- **Brand assets** in `public/brand/` are copied from each project's repo. The
  site's own identity (midnight, ice, signal yellow; Zalando Sans Expanded) was
  chosen for it and belongs to no project.

## Re-angled to sports analytics (2026-11-10)

Lucas is looking for work in sports analytics, so the site leads with it:
hero ("I build sports analytics software."), About, the four metadata strings
in `app/layout.tsx`, the availability line, a new FBI role on the résumé and a
Model skills group (which replaced Lead).

- **Work** is FBI Basketball and Blakey Breakthrough. Pride STEM Canada is off
  for now (capture kept in `public/work/psc.webp`). Blakey is framed around its
  training data. Its roster size and completion medians stay off: they are the
  client's members' numbers.
- **Box Score** is SHARPRFI, MLB BvP, TPDL, PhantomGM, Lineup Lab, Playcaller.
  War Room is off. No live links except FBI.
- **PhantomGM** is built by the FBI team, Lucas included. Superseded wording:
  see the 2026-11-11 credit note above. Not live; admins only.
- **Two weaknesses are published on purpose**, because showing them is the
  point for an analytics reader: SHARPRFI's backtest has look-ahead (season
  stats include games after each prediction) and only beats the base rate by
  about 2% in Brier; BvP's hit chance runs high because it assumes every
  expected at bat comes against the starter.
- Playcaller and Lineup Lab captures: Playcaller from its local read-only
  preview (`PC_DEV_USER`), Lineup Lab from its public demo league.

Source: the `cv` repo (`index.html`, `assets/resume.pdf`, git history) and the
`blakey-breakthrough-dashboard` repo. Everything in `content/` traces back to one
of those. Nothing here was invented.

## Resolved (2026-08-06)

- **Blakey Breakthrough can be named**, linked to `blakeybreakthrough.com`. Note
  the link points at the client's business, not the dashboard, which is private
  and gated. `hrefLabel` says "About the business" so nobody clicks it expecting
  to see the product.
- **FBI Basketball**: named and linked.
- **Screenshots now ship** (updated 2026-08-13). They run full measure at the top
  of each piece, under the headline. Lucas supplied fresh captures for FBI (the
  redraft rankings and categories board) and Pride STEM (the conference home) on
  2026-08-13; both show the actual product rather than a marketing splash, which
  is the whole reason to carry an image. Those two are roughly 2:1; the older
  sharprfi and bvp captures are 16:10, so `Screenshot` carries real pixel
  dimensions alongside the path and the component reserves the right box.
- **Email is `lucas@reydman.com`.** Not the Gmail or the Dalhousie address.
- **Phone number and home address stay off the site.**
- **RBC Global Functions Technology runs May 2026 to August 2026.** Dated rather
  than badged "Current", so the page does not go stale in September.
- **The Box Score ships with SHARPRFI and MLB BvP.** The Fantasy Draft Lottery
  Simulator needs work before it goes up and is tracked in `pending` rather than
  shipped as a half-working link.
- **Personal projects section cut entirely** (Lucas: "useless"). QuickCash,
  Tic Tec Toe, and wdinomf are off the site; the Work page is client work only.
  They remain a résumé-PDF decision, not a site one.
- **The headline is now his name**, not a slogan. See below.
- **Entering final year in September 2026, graduating 2027.** The status line says
  "final year ... graduating 2027" rather than a year count: it stays true all
  year, and it tells an employer he is about to be available full time. The
  résumé PDF still says "third-year" and needs updating before it is linked.

## Fields cut in the simplification pass (2026-08-13)

Three `Profile` fields went away with the components that consumed them. None of
the content was lost; each line is now said once, on the page that owns it.

- **`now[]`** drove a rolling status line on the home page. All three statements
  are still true and still on the site: availability is the closing strip and the
  Contact lede, the graduation year is in About and on the Résumé, and the Box
  Score is its own page. A loop that re-announced them was the only thing lost.
- **`headline`** was the split-flap string, always identical to `name`. The name
  is the nameplate, so the nameplate reads `profile.name` directly.
- **`availability`** (the `"open" | "limited" | "closed"` enum) was never
  rendered. `availabilityLine` is the one that says it in words.
- **`Project.status`** was set to `"live"` on all three and rendered nowhere.

## Terminology (2026-08-07)

**They are not "case studies."** Lucas built these products; he did not write
consulting reports about them. The word is agency jargon and it undersells
authorship, so it is gone from the copy, the component names (`ProjectArticle`),
the type (`Project`), and the filename (`project-article.tsx`). Say what it is:
the businesses, the work, what he built.

Other wording set in the same pass:

- Home list heading is **"What I've built"**, not "Selected work".
- The link out of that list reads **"How each one was built"**.
- Work lede is **"What I built for the businesses that hired me."** The old line
  ("what I have shipped for people who paid for it") read defensively.
- Box Score listing is **"What's running"**; its closing note is "More as I
  build them."
- **"Pitch to production" was load-bearing in four separate places** at once,
  which is how a description turns into a slogan. The hero now reads "Freelance
  developer. I build complete products on my own." and the other three vary.

## The folio line, settled (2026-08-13)

**"Freelance software developer. I design and build digital solutions end to
end."** Lucas's own wording. Every earlier draft leaned on solo ("on my own",
"mostly solo", "built and shipped solo"), which had to go once FBI Basketball
was corrected from sole developer to **product engineering lead**. "Solutions"
rather than "products" because a private coaching dashboard is not a product in
any sense a client would recognise, and internal tools are a real part of the
work.

The same sentence lives in three other places that are easy to forget, and all
of them were stale for a while: `metadata.description`, the OpenGraph and
Twitter descriptions, and `jobTitle` in the Person JSON-LD, all in
`app/layout.tsx`. Change one, change all four.

## Still open

1. **The `pride-stem-combined` repo is gone.** Not on disk, not on GitHub, not on
   Vercel (the client hosts the site). Only the graphify vault notes survive, in
   `SecondBrain/graphify-vault/pride-stem-combined/`. Worth recovering if a copy
   exists somewhere, both as a portfolio artifact and because the case study
   details above now rest on graph metadata rather than the source.

## The "250+ delegates" claim, and why it is gone

It appears on the live site four times, and every instance frames it as a
**target, not an outcome**: "250+ **Expected** Delegates" on the register page,
"**Expected Attendance**" on the schedule, and "we **will welcome** over 250
delegates" on the about page. The event has since closed registration and the
site was never updated with a real figure, so actual attendance was never
published anywhere.

"250+ delegates served" would therefore have been a false claim on a page whose
whole job is being checkable. Replaced with facts verifiable from the live site:
four paid registration tiers ($50 to $300 CAD), bilingual English and French, and
the conference being in its sixth year. If the organizers will confirm real
attendance, that number can go back in as an outcome.

## On the headline

The first draft was "The work, on the record." Lucas turned it down, correctly:
it is a copywriter's line *about* him rather than anything he would say.

The fix is structural, not another slogan. **The name is the headline.** It runs
as the split-flap on load, so the signature motion lands on the one element that
cannot read as marketing, and no invented tagline sits above the work. The sub
carries the plain facts. Slogans are where portfolio copy goes false, so the site
does not have one.

## What I changed and why

- **Killed résumé-speak.** "Utilized," "leveraged," "streamlined," and
  "spearheaded" are gone. Every bullet opens with a plain verb.
- **Cut three weak bullets:** "Networked with industry professionals" (Mirabella),
  "Streamlined team collaboration through Microsoft Teams and Excel" (Torinit),
  and a duplicate framing in the RBC invoice bullets.
- **Compacted the early roles.** Scale Hospitality, Over the Rainbow, and S&L
  Sports Camp are one line each under "Earlier". S&L keeps its revenue figure and
  the fact that Lucas built the site, because that is the entrepreneurial
  through-line.
- **Rewrote the profile paragraph.** The résumé PDF's opening ("I actively embrace
  AI-assisted development, leveraging modern tools to build faster and smarter")
  is the exact register that reads as filler.
- **Moved the AI framing out of the hero.** The old site led with "AI agents do
  the heavy lifting, I own the quality," which a client reads as *the agents built
  it*. It now sits in About, described as craft.
- **"Team of eight" stays in prose, never as a stat chip.** Per Lucas's own note
  in the `cv` repo's `tasks/lessons.md`.

## Deliberately not claimed

- **Blakey: no message has been verified as sent to a real member.** Sending was
  enabled in production but never confirmed against a live client, so the case
  study describes what the system does and stops there.
- **No business outcomes anywhere.** No time saved, no retention lift, no revenue
  impact for any client. None of it is verifiable from any repo.
- **Blakey's member and group counts are off the site entirely** (2026-08-13).
  They were never solid: the repo says 130+, ~140 and ~143 in different places,
  and the tilde was doing a lot of work. They also described the size of the
  client's business rather than what the work was for, and they sat directly
  above a screenshot running on seeded data that disagreed with them. The piece
  now says what the dashboard changes for the coach and folds the counts in as
  "the whole roster". Same for the facts row, which was those two numbers plus
  the refresh interval; Blakey now carries no facts row, like the other two.
- **The 94% calibration figure is gone with them.** "Would have flagged nearly
  everyone" makes the same point without a stat a reader cannot check.

## Assets

- `public/work/` holds real 1600x1000 webp captures for FBI, Pride STEM, SHARPRFI,
  and BvP. Unused for now.
- **Blakey now has a screenshot** (2026-08-13), and it is the one capture on the
  site that is not a straight photograph of production. The live dashboard shows
  a real client's members by name against renewal risk, so this shot comes from
  the app's seeded demo roster. The interface is the shipped one; every member,
  group and number in the frame is invented. Confirmed as seeded by Lucas twice,
  once for the original mock and again for the re-shoot off
  `blakey-breakthrough-dashboard.vercel.app/today`.

  **Anything readable in that frame is published.** The current one carries
  "Julie R, 94 days inactive, unlikely to renew", a 20% average completion, and
  144 members across 6 groups. Fine from seeded data, a privacy problem and a
  client problem from the real roster. **If it is ever re-shot, it has to come
  from seeded data again. Check the numbers on screen before shipping it.**
- **No portrait.** The `cv` repo has one if the new design wants it.
