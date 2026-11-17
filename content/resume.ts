import type { Brand, EarlierRole, Honor, Role, SkillGroup } from "./types";

export const experience: Role[] = [
  /*
    Added 2026-11-10. FBI was on the site as client work but missing from the
    record, which is the first place a sports analytics hiring manager looks.
    Start month from the repo's first commit (2026-05-22).
  */
  {
    org: "FBI Basketball",
    title: "Product Engineering Lead",
    period: "May 2026 to present",
    current: true,
    logo: "/brand/fbi/emblem.png",
    project: "fbi",
    href: "https://fbi-basketball.com/",
    /*
      Rewritten 2026-11-17 with the one-page sheet: what was built and how it is
      kept safe to change, each figure from the fbi-basketball repo.
    */
    detail: [
      "Lead engineering and product for a paid fantasy basketball platform with a community of 6,000+ managers, on a team of two: I design the features and build them end to end, from first commit in May 2026 to public launch that September. Authored 880+ of the repo's 1,000 merged pull requests in a 240,000-line TypeScript codebase.",
      "Built checkout and fulfilment for paid access. A signature-checked order webhook joins on the user id, never on email, grants the tier and the Discord role, and ends access on a refund.",
      "Wrote the entry-fee reconciliation job. Every 30 minutes it matches paid entrants to accounts on a ledger keyed by league and provider entry id, so a re-run cannot add anyone twice, and it sends ambiguous cases to a review queue.",
      "Keep production safe to change: 170+ SQL migrations applied to a fresh database in CI, 330+ unit test files, 27 Playwright specs, a secret scan on every pull request, and preview deployments on a read-only database role.",
      "Wrote the projection engine behind every ranking and trade verdict, run twice a day in eight isolated stages, with an admin page that traces any player through each stage, so any number on the board can be explained.",
      "Use AI agents (Claude Code, Codex) at every stage, from spec to code, tests and review, and hold their changes to the same gate as my own. In the product, the Claude API reads injury news, limited to bounded, cited adjustments.",
    ],
  },
  {
    org: "RBC",
    title: "Co-op, Global Functions Technology",
    logo: "/resume/rbc.webp",
    // Both RBC terms were co-ops, and the title says so (LinkedIn, 2026-11-17).
    period: "May 2026 to August 2026",
    href: "https://jobs.rbc.com/ca/en/rbctech",
    detail: [
      "Built automated reporting tools in Python on REST APIs: a ticket data dashboard and a self-updating change calendar.",
      "Automated content summarization with large language models (LLMs) across ServiceNow, Jive and Confluence.",
      "Delivered internal web applications in Python and a modern web stack, with frontends built to RBC brand standards.",
    ],
  },
  {
    org: "RBC",
    title: "Co-op, Financial Shared Services",
    logo: "/resume/rbc.webp",
    period: "May 2025 to August 2025",
    href: "https://jobs.rbc.com/ca/en/rbctech",
    detail: [
      "Learned SAP on the job to manage the invoice lifecycle for RBC's U.S. business units through to payment.",
      "Cross-referenced vendor records, validated purchase orders and monitored payment statuses in SAP.",
    ],
  },
  {
    org: "Torinit Technologies",
    logo: "/resume/torinit.webp",
    title: "Digital Solutions Intern",
    period: "May 2024 to August 2024",
    href: "https://www.torinit.com/",
    detail: [
      "Built a proof of concept for a client's digital solution from design thinking sessions, and ran client prospecting in HubSpot.",
    ],
  },
  {
    org: "Mirabella Development Corporation",
    logo: "/resume/mirabella.webp",
    title: "Research and Development Intern",
    period: "June 2023 to August 2023",
    href: "https://mirabellacorp.com/",
    detail: [
      "Researched industry trends, buyer preferences and competitive positioning, and ran cross-functional meetings.",
    ],
  },
  {
    org: "Panther",
    logo: "/resume/panther.webp",
    title: "Founder and Director of Operations",
    period: "September 2021 to August 2023",
    detail: [
      "Founded a student events company, built it to more than $40,000 in revenue and directed its sales team.",
    ],
  },
];

/** Compact one-liners. Real history, but not worth full entries anymore. */
export const earlier: EarlierRole[] = [
  {
    org: "S&L Sports Camp",
    title: "Co-founder and Lead Director",
    period: "2020",
    note: "Co-founded a youth sports camp that cleared over $15,000. Built the site, kept the books.",
  },
  {
    org: "Scale Hospitality",
    title: "Hospitality Assistant",
    period: "2022",
    note: "Fine dining service in a high volume room.",
  },
  {
    org: "Over the Rainbow",
    title: "Sales Associate",
    period: "2021",
    note: "Upscale retail: inventory, order fulfillment, and client styling.",
  },
];

export const education = {
  school: "Dalhousie University",
  logo: "/resume/dalhousie.webp",
  degree: "Bachelor of Applied Computer Science",
  period: "2023 to 2027",
  expected: "Expected May 2027",
  location: "Halifax, Nova Scotia",
  note: "Applied Computer Science. Coursework across full-stack development, databases, UI and UX, security, and systems design, paired with management courses in project management, communications, and organizational leadership.",
  stats: [
    { value: "3.94", label: "cumulative GPA" },
    { value: "6", label: "times on the Dean's List" },
  ],
};

/*
  Split 2026-08-28. One list held scholarships next to course certificates and
  let a two-column grid wrap them arbitrarily, so the block read as a pile.
  The kinds are different things: honors were awarded, certificates were
  earned and link to their credentials. Each gets its own labeled column.
*/
export const honors: Honor[] = [
  {
    what: "Community Leadership Scholarship",
    where: "Dalhousie University",
    mark: "2023",
  },
  {
    what: "Ontario Scholar",
    where: "Ontario Ministry of Education",
    mark: "2023",
  },
  {
    what: "Honor Roll, Bilingual Studies",
    where: "Lawrence Park Collegiate Institute",
    mark: "94% average",
  },
];

export const certificates: Honor[] = [
  {
    what: "Prompt Engineering for Developers",
    where: "DeepLearning.AI",
    mark: "2024",
    href: "https://learn.deeplearning.ai/accomplishments/19b773e3-6ff0-40f2-8915-dbe1a045f6b0?usp=sharing",
  },
  {
    what: "Agile and Scrum Project Management",
    where: "Udemy",
    mark: "2025",
    href: "https://www.udemy.com/certificate/UC-2674b903-f212-4f1a-95d0-1a44c21bb7a4/",
  },
];

/*
  Audited 2026-11-17 against the repos: every item is something the code uses
  or a tool from a job. The first five groups print on the one-page sheet. The
  last, Model, is the methods the write-ups run, and shows on the web page only.
*/
export const skills: SkillGroup[] = [
  { name: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "Java", "HTML", "CSS"] },
  { name: "Frameworks", items: ["React", "Next.js", "Node.js", "Tailwind CSS", "Vitest", "Playwright", "Jest", "JUnit"] },
  { name: "Backend", items: ["PostgreSQL", "Supabase", "Redis", "REST APIs", "GraphQL", "webhooks", "OAuth", "Stripe API", "row-level security"] },
  { name: "Tools", items: ["Git", "GitHub Actions", "GitLab CI/CD", "Vercel", "Azure", "SAP", "ServiceNow", "Jira", "Confluence", "Excel"] },
  { name: "AI tools", items: ["Claude Code", "Codex", "Grok", "Cursor", "GitHub Copilot", "Claude API", "MCP", "prompt engineering"] },
  {
    name: "Model",
    items: [
      "Projection models",
      "Bayesian shrinkage",
      "Poisson and Monte Carlo",
      "Odds, vig and EV",
      "z-scores and player value",
      "Calibration and Brier",
      "Hungarian assignment",
      "Min-cost flow",
      "Sports data APIs",
    ],
  },
];

export const languages = "Bilingual in English and French.";

/*
  The résumé's opening line and its project list, added 2026-11-11 with the
  downloadable résumé. The projects are the ones on the wall, one line each:
  what it is and the method under it. Every method named here is one the
  project's own page explains.
*/
export const summary =
  "Software developer working in sports analytics and AI. I build the models that turn box scores, betting lines and injury reports into a number, and the products that put that number in front of the person making the decision.";

/** `short` is the same claim cut to one line of the printed sheet. */
export const resumeProjects: { brand: Brand; name: string; line: string; short: string }[] = [
  {
    brand: "glue",
    name: "GLUE Index",
    line: "An NBA index of the players who win possessions and avoid mistakes without needing the ball: fourteen play-by-play components, z-scored and weighted, rescored every night back to 2005-06.",
    short: "NBA index of off-ball value: fourteen play-by-play components, z-scored and weighted, rescored nightly.",
  },
  {
    brand: "sharprfi",
    name: "SHARPRFI",
    line: "MLB first-inning model. A Poisson model and a batter-by-batter simulation price every game, with fair odds and a published backtest.",
    short: "MLB first-inning run model: Poisson plus batter-by-batter simulation, fair odds, published backtest.",
  },
  {
    brand: "tpdl",
    name: "TPDL",
    line: "A full fantasy basketball platform for a ten-team dynasty league: live scoring, trades, a rookie lottery and draft room, with its own projections and win odds.",
    short: "Full fantasy basketball platform for a dynasty league, with its own projections, win odds and lottery.",
  },
  {
    brand: "playcaller",
    name: "Playcaller",
    line: "Runs my Sleeper fantasy football leagues from one app. Lineups and IR moves run by themselves on a blend of props, game lines and projections; waiver bids are sized and explained.",
    short: "Runs my Sleeper football leagues: automatic lineups from a projection blend, sized waiver bids.",
  },
  {
    brand: "lineup-lab",
    name: "Lineup Lab",
    line: "Shows what a fantasy football trade does to both starting lineups, week by week, by re-optimizing each roster.",
    short: "Shows what a fantasy football trade does to both starting lineups, week by week.",
  },
  {
    brand: "hitlist",
    name: "Hitlist",
    line: "Ranks hit props by batter versus pitcher history, weighted by sample size, with a hit chance from expected at bats.",
    short: "Ranks MLB hit props by batter versus pitcher history, weighted by sample size.",
  },
  {
    brand: "phantomgm",
    name: "PhantomGM",
    line: "Lineup autopilot for Fantrax basketball leagues, in development at FBI Basketball. Plans every league at once, including leagues that cap games.",
    short: "Lineup autopilot for Fantrax basketball leagues, in development at FBI Basketball.",
  },
];

/*
  A course project, so it sits with the projects and not with the jobs. From the
  pride-stem-canada repo: most commits, about 50 merges into the protected
  branches, and the README new students set up from.
*/
export const schoolProject = {
  org: "Pride STEM Canada",
  title: "Dalhousie course project for a non-profit client",
  period: "October 2025 to present",
  href: "https://www.psc-fsc.ca",
  detail: [
    "As Senior Developer, wrote the bulk of the code for a non-profit's bilingual conference website in Next.js and Supabase.",
    "Registration is paid through Stripe. I added its paid add-on and rebuilt the registration pages to the client's requests.",
    "Now Development Director: I lead the student team, run version control and documentation, and review and merge its code.",
  ],
};

/** The rest of the projects, named with what each is. The sheet leads into this with a pointer to the site. */
export const alsoBuilt =
  "TPDL (dynasty league platform), GLUE Index (NBA player index), Fandex (franchise index), SHARPRFI and Hitlist (MLB betting models), Playcaller and Lineup Lab (fantasy football tools), PhantomGM (lineup autopilot, with my team) and Blakey Breakthrough (client dashboard).";

/*
  The three lines under "What I do there" in the FBI chapter on the home page.
  They were the role's own lines until the résumé grew to seven; the chapter
  keeps the short version, where the model leads and the platform follows.
*/
export const fbiChapterLines = [
  "Wrote the projection engine behind every redraft ranking, tier and trade verdict: shrinkage on per-minute rates, z-score valuation and Jenks tiering, rerun twice a day.",
  "Built the trade calculator, which judges a deal by each category's weekly win probability.",
  "Lead product engineering for the platform: the site, payments, Fantrax, Yahoo, Sleeper and ESPN league integrations, and the Discord bot for a community of more than six thousand.",
];
