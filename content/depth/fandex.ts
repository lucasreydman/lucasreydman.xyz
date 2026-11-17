import type { ProjectDepth } from "../types";

/*
  Fandex, written from lucasreydman/fandex at 646fd67: src/components/*,
  src/lib/* and its tests, src/app/*, scripts/build-data.mjs,
  scripts/extra-leagues.mjs, scripts/build-map.mjs, scripts/source/* and
  .github/workflows/*. Every number below is a constant in that code or a
  count of its data file.
*/
export const depth: ProjectDepth = {
  features: [
    {
      title: "Years and teams",
      summary: "The two things a visitor sets. Everything else on the page follows from them.",
      items: [
        {
          name: "First-visit setup",
          detail:
            "A first visit with no shared link opens a two-step setup: birth year, then teams, then straight to the scorecard. Either step can be skipped, with Just browse or Use all time, and Escape counts as browsing.",
        },
        {
          name: "Three eras",
          detail:
            "Since I was born, All time, or Custom years. All time runs from 1903, the first MLB season on record, and each league joins in its own first year. Custom years puts two handles on one ruler, labelled From and To, with the span between them shaded.",
        },
        {
          name: "The year is the control",
          detail:
            "The big year can be clicked and typed, nudged with minus and plus or the arrow keys, or dragged along a ruler with a tick for every decade. A typed year only applies once it has four digits, and it is clamped to the seasons on record.",
        },
        {
          name: "One team per league",
          detail:
            "Four large slots for the NFL, NBA, MLB and NHL, and five smaller ones for MLS, the WNBA, NWSL, PWHL and CFL. Any can stay empty. An empty slot carries its league's mark, so it says what goes there.",
        },
        {
          name: "The picker",
          detail:
            "A tab per league and a search box. Choosing a team moves on to the next league in the same group that still needs one, so the big four come first and the other five are only walked once a visitor is in them. The sheet closes itself when the group is full.",
        },
        {
          name: "Pick a whole city",
          detail: "A By city tab lists every metro area with a current club. One click fills every league that city plays in.",
        },
        {
          name: "Random fan and Clear",
          detail: "Random fan draws one active club in every league. Clear empties every slot.",
        },
      ],
    },
    {
      title: "The scorecard",
      summary: "One fan's history, as a number and as the seasons behind it.",
      items: [
        {
          name: "A number out of 100",
          detail:
            "The average of the fan's teams, placed on the same line every franchise is ranked on, so 100 is the best franchise of the span and 0 the worst. The figure rolls to its new value whenever a year, a team or a weight changes.",
        },
        {
          name: "A verdict in words",
          detail:
            "Seven verdicts, from Spoiled rotten at 85 and up to Condolences below 15, each with a one-line gloss. The cut points are 85, 70, 55, 45, 30 and 15.",
        },
        {
          name: "Where you sit among the cities",
          detail:
            "A scale with a thin mark for each city and a marker for the fan. Under it: how many cities had it worse, how many had it better, and the city whose number is closest to the fan's. Moving the pointer or a finger anywhere along the line picks up the nearest city, so there is nothing small to aim at, and names it with its rank, team count, titles and win rate.",
        },
        {
          name: "Five counts",
          detail:
            "Titles, with how many team seasons each one took. Finals lost. Great seasons and awful seasons, a full standard deviation above or below that year's league, which the card puts as about the top and bottom sixth. Win rate, with total wins.",
        },
        {
          name: "Season tape",
          detail:
            "One cell per season for each team, filled from cold blue to hot red by how far that season sat from the league. A pennant marks a title and a hollow pennant marks a lost final. Columns line up across teams, a year a team did not play is a dashed cell, and pointing at a cell reads out the record, under the name the club carried that season.",
        },
        {
          name: "Best and worst year to be you",
          detail:
            "The year the fan's teams were collectively at their best and at their worst. Only years in which every one of the teams played are considered, so one hot team in a lone season cannot win it.",
        },
        {
          name: "Copy link",
          detail: "Copies the address, which already holds the whole view.",
        },
        {
          name: "Before a team is picked",
          detail: "The card's place is taken by a prompt that names the luckiest and unluckiest fan bases for the era chosen.",
        },
      ],
    },
    {
      title: "Another birthday",
      items: [
        {
          name: "Luck by birth year",
          detail:
            "A curve of the fan's number for every possible birth year with the same teams, with the luckiest and unluckiest years named. It is shown when the era is a birth year.",
        },
        {
          name: "Click to move there",
          detail: "Pointing reads a year off the curve. Clicking sets the birth year to it, and the whole page follows.",
        },
      ],
    },
    {
      title: "Rankings",
      summary: "All 221 franchises of nine leagues in one list.",
      items: [
        {
          name: "Nine sortable columns",
          detail:
            "Seasons, win rate, standing against the league, average season, great and awful seasons, titles, lost finals and luck. Each header explains itself in plain words on hover and sorts either way. Rows slide to their new places on a sort instead of jumping.",
        },
        {
          name: "Filter and search",
          detail: "A filter for any league that is being counted, and a search box that matches a team name or its city. When either narrows the list, a count says how many of the total are showing.",
        },
        {
          name: "Open a row",
          detail:
            "A row opens to that club's season tape and a line with its record, its rank inside its own league, its great and awful seasons and its lost finals. If the franchise carried other names inside the span, the line lists them.",
        },
        {
          name: "Your teams marked",
          detail: "The fan's own clubs are marked in the accent colour, here and on the other two views.",
        },
        {
          name: "Columns by screen width",
          detail: "A phone shows rank, team, win rate, titles and luck. The other columns come in as the screen widens.",
        },
      ],
    },
    {
      title: "Every season",
      items: [
        {
          name: "One league on one sheet",
          detail:
            "Every club of a league against every season in the span, sorted best to worst, with a pennant in each title season and a hollow one in each lost final. It opens on the league of the fan's first team, and falls back to the first counted league if that one is switched off.",
        },
        {
          name: "Readout",
          detail: "Pointing at or tapping a cell prints the club as it was called that season, the record and the win rate, and says so when it was a great or an awful season.",
        },
        {
          name: "Fits any span",
          detail:
            "Cells are 20 pixels wide for a short span, 14 past 40 seasons and 10 past 70, and year labels thin out to match. The team column stays pinned while the seasons scroll sideways.",
        },
      ],
    },
    {
      title: "Cities",
      summary: "A city is scored on the seasons actually played there.",
      items: [
        {
          name: "The map",
          detail:
            "The United States and Canada with a circle on each metro area. A circle grows with the number of teams and is coloured by the city's score. The fan's own cities are ringed.",
        },
        {
          name: "Former homes",
          detail:
            "A franchise's seasons count toward the city it was playing in at the time. Seattle keeps the Sonics' years and Montreal the Expos', and cities with no club today, such as Hartford and Quebec City, appear on the map when the span reaches back to them. The data holds 63 metro areas in all.",
        },
        {
          name: "Ranked list",
          detail: "Every city in order with its teams and its score. The list and the map highlight together.",
        },
        {
          name: "City card",
          detail:
            "The chosen city's rank, score, combined win rate, titles and lost finals, then each club that played there. A current club shows its place on the full board, and since when if it arrived mid-span. A club that left is dimmed and shows its years there and what it is called now.",
        },
        {
          name: "Keyboard",
          detail: "Each circle on the map can be reached with Tab and chosen with Enter or Space, and announces its score and rank.",
        },
      ],
    },
    {
      title: "Nine leagues",
      summary: "The NFL, NBA, MLB and NHL lead. Five more sit alongside them on the same scale.",
      items: [
        {
          name: "The other five",
          detail: "MLS from 1996, the WNBA from 1997, NWSL from 2013, the PWHL from 2023-24 and the CFL from 1958.",
        },
        {
          name: "One scale for all nine",
          detail: "Each league is scored against its own spread, so a WNBA dynasty and a baseball dynasty land on the same line.",
        },
        {
          name: "Draws",
          detail: "In MLS and NWSL, where draws are part of the game, a draw counts as half a win. Elsewhere the rare tie is left out.",
        },
        {
          name: "Switch a league off",
          detail: "Any league can be left out of the rankings, the cities and the fan's number from the Scoring panel. The last one counted cannot be switched off.",
        },
        {
          name: "Artwork for every league",
          detail: "ESPN carries no CFL club logos and no CFL or PWHL league mark, so those come from TheSportsDB. A club with no artwork at all falls back to a monogram in its own colour.",
        },
        {
          name: "Names in full",
          detail: "Team and city names wrap instead of being cut off with an ellipsis, in the slots, the picker and the city card. A phone row in the rankings drops the city to keep the name whole.",
        },
      ],
    },
    {
      title: "Franchise history",
      summary: "Lineage follows each league's official record.",
      items: [
        {
          name: "Names and homes by season",
          detail:
            "A relocated or renamed franchise keeps its seasons, and each season remembers what the club was called and where it played. The Thunder's 1979 title shows as the Seattle SuperSonics and the Dodgers' 1955 as Brooklyn.",
        },
        {
          name: "Hornets, Pelicans and Browns",
          detail:
            "The 1988 to 2002 Charlotte Hornets belong to today's Hornets, as the NBA reassigned them, and the Pelicans begin in 2002. The Browns keep their history before 1996 and sit out 1996 to 1998, and the Ravens begin in 1996.",
        },
        {
          name: "Coyotes, Utah and the two Jets",
          detail:
            "The Arizona Coyotes are kept as an inactive franchise ending in 2024, and Utah starts as a new club that year. The first Winnipeg Jets are part of the Coyotes' history and today's Jets begin as the 1999 Atlanta Thrashers. The city of Winnipeg is credited with both.",
        },
        {
          name: "Wartime mergers",
          detail: "The merged teams of 1943 and 1944, Phil-Pitt and Card-Pitt, count for both clubs.",
        },
        {
          name: "The AFL",
          detail:
            "The AFL's seasons from 1960 to 1969 count for its clubs, and its title games of 1960 to 1965 count as championships. From 1966 the Super Bowl is the title.",
        },
        {
          name: "Folded clubs",
          detail:
            "Nineteen clubs that no longer play keep their history as inactive franchises, among them the Houston Comets, the Sacramento Monarchs, FC Kansas City, Chivas USA, the CFL's American teams and the NHL's Seals and Barons. They can be picked and ranked, they are listed after the active clubs in the picker, and their cities are credited for those seasons.",
        },
        {
          name: "What is left out",
          detail: "The ABA, the WHA, the AAFC and the Federal League of 1914 and 1915 are not counted, nor is anything before a league's first season in the data.",
        },
      ],
    },
    {
      title: "Scoring panel",
      summary: "What counts as a good life as a fan is the visitor's call.",
      items: [
        {
          name: "Three weights",
          detail:
            "Sliders for overall record, typical season and championships, 50, 30 and 20 by default. They are shown as shares of their total, so they never have to be made to add up.",
        },
        {
          name: "Leagues counted",
          detail: "A chip per league, filled when it counts and struck through when it does not.",
        },
        {
          name: "Recency",
          detail: "All equal, Lean recent or Only lately. The last two halve a season's weight every 15 or every 6 seasons back.",
        },
        {
          name: "Seasons in progress",
          detail: "Unfinished seasons are left out unless switched on. The note under the switch names the seasons under way that day.",
        },
        {
          name: "Team colour",
          detail:
            "Highlights can take the colour of the fan's first team. Of the club's two colours it uses whichever has a contrast of at least 3.2 against the page, and sets text on it in white or dark ink by a 4.5 contrast test.",
        },
        {
          name: "How the number is made",
          detail: "The method is written out in the panel in seven short paragraphs, in plain words with no notation, including how cities are scored, how franchise history is followed and where the standings come from.",
        },
        {
          name: "Reset",
          detail: "One button puts the weights, the leagues, recency and the in-progress switch back.",
        },
      ],
    },
    {
      title: "Look and sharing",
      items: [
        {
          name: "Light and dark",
          detail: "The theme follows the system until it is switched, and the choice is saved. A script in the head sets it before first paint, so the wrong theme never flashes.",
        },
        {
          name: "Every view is a link",
          detail: "Years, teams, weights, switched-off leagues, recency and the open tab all live in the address, so any view can be sent as it stands.",
        },
        {
          name: "Share image",
          detail: "The preview image is drawn in code: the wordmark, the headline and a strip of seasons in the tape's colours.",
        },
        {
          name: "Copy that follows the data",
          detail: "The intro's count of leagues and the all-time note listing when each league begins are built from the data file, so they stay true as leagues are added or switched off.",
        },
        {
          name: "Reduced motion",
          detail: "With the system's reduced motion setting on, layout animation and the dialog transitions are off.",
        },
      ],
    },
  ],
  engineering: [
    {
      name: "No server at run time",
      detail:
        "The page is static. Every season of nine leagues since 1903 ships as one JSON file and all scoring runs in the browser, so there is no database, no API key and nothing to wait for when a control moves.",
    },
    {
      name: "Staying responsive while dragging",
      detail:
        "The ranking for all 221 franchises is recomputed on every change, behind a deferred value so the year ruler keeps up with the pointer. The birth-year curve is about 120 full rankings, and it is keyed on the teams and the scoring settings alone, so dragging the year never recomputes it.",
    },
    {
      name: "State in the address",
      detail:
        "Settings are written to the query string only when they differ from the defaults, and the year is always written unless the era is all time. Reading it back clamps every year to the seasons on record, drops team keys and league names that do not exist and rejects malformed weights. The last view is also kept in local storage, and a shared link wins over it.",
    },
    {
      name: "Feeds for the big four",
      detail:
        "NFL, NBA and MLB standings come from ESPN's public standings feed. Hockey comes from the NHL's own stats API, because ESPN's hockey history has seasons with playoff games mixed in. NBA and NHL seasons are stored by the year they started.",
    },
    {
      name: "Reference standings over the feed",
      detail:
        "ESPN's history leaves clubs out of older seasons, among them most Baltimore Colts seasons and the 1974 Steelers, and has a few wrong records. So the older NFL and NBA seasons have reference standings compiled from Wikipedia. Where the reference covers a season it is the record, and the build prints every place the feed disagrees with it.",
    },
    {
      name: "Five leagues from reference files",
      detail:
        "MLS, the WNBA, NWSL, the PWHL and the CFL each have one file holding teams, standings, champions and lineage. A live feed only adds seasons newer than the file, and those count as in progress until the file records how they ended. The CFL has no public feed, so it moves only when its file does.",
    },
    {
      name: "Lineage as data",
      detail:
        "One file lists what each franchise was called and where it played, by first season. The build refuses an era that names an unknown city, or a history that does not end in the club's current name. The engine reads it to name each season and to credit it to the right city.",
    },
    {
      name: "City spells",
      detail:
        "For the Cities view the engine splits each franchise's seasons by where they were played and scores each stay with the same formula as a whole franchise. A city's number is the average of its stays weighted by their length, so a two-year stopover does not count like a sixty-year one. A short stay can score outside the range set by whole franchises, so it is clamped to the scale.",
    },
    {
      name: "A refresh that cannot break the site",
      detail:
        "Finished seasons are kept as they are and only missing seasons and the last two years are refetched. Every request has a 25 second timeout and up to five tries with exponential backoff, longer after a 429. A season that fails or does not validate keeps its last good copy, and the file is only rewritten when something changed.",
    },
    {
      name: "Checks before anything is written",
      detail:
        "A season's wins must equal its losses, within one game for recent years and a small allowance for early records. No club may have more games than the schedule plus eight, and no franchise may appear twice. The run stops if a league would lose seasons or if its latest finished season does not have every current club.",
    },
    {
      name: "Champions",
      detail:
        "Champions and losing finalists come from a reference file compiled from Wikipedia. A season newer than that file is read off the postseason scoreboard by looking for the final's own headline, walking back up to 28 days from the end of the postseason, and is remembered once decided. The AFL's title games ride along as a second championship in their seasons.",
    },
    {
      name: "Runs every morning",
      detail:
        "A GitHub Action is scheduled to fetch the standings at 10:17 UTC, run the tests, and commit the data file only when it changed and the tests pass. The commit redeploys the site. A manual run can refetch every season.",
    },
    {
      name: "History pinned by tests",
      detail:
        "A test lists the first season of all 126 franchises of the big four, the Coyotes and the Seals/Barons included, and fails if any club starts in the wrong year, misses a season it should have played, or has a gap that is not one of the known ones. It also checks title counts against the record books, 27 for the Yankees and 18 for the Celtics among them, and that Seattle still holds the Sonics' 1967 to 2007 seasons.",
    },
    {
      name: "Tested against the spreadsheet",
      detail:
        "Another test freezes the data where the original spreadsheet stopped, counts only the four leagues it covered, and compares every club with it. Titles must match everywhere, allowing for one World Series played after the sheet was pulled. Outside hockey, wins, losses, season counts and the great and awful counts must match exactly, and both scores within 0.01. Hockey win rates are held to within .012, since its source changed. CI also runs lint, a type check and a production build on every pull request.",
    },
    {
      name: "A map with no map library",
      detail:
        "A build script projects Natural Earth's 1:50m shapes with a conic equal-area projection fitted to every city in the data, and saves the land, lakes, borders and city positions as plain SVG paths. The browser only draws them.",
    },
    {
      name: "One colour scale",
      detail:
        "A season's fill is mixed in OKLab between a neutral and the hot or cold colour by its distance from the league, saturating at 2.2 standard deviations. The 0 to 100 scores use the same function, centred on 50, and it reads its colours from the theme.",
    },
    {
      name: "Native controls",
      detail:
        "The setup, the team picker and the scoring panel are native dialog elements, and the ruler and the sliders are native range inputs restyled, so focus, Escape and the keyboard work the way the browser already does them. The two-handle ruler is two range inputs stacked, with only the handles taking the pointer so both stay reachable.",
    },
  ],
};
