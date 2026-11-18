import type { Profile } from "./types";

export const profile: Profile = {
  /**
   * The name is the nameplate. No slogan sits above the work: slogans are where
   * portfolio copy goes false, so this site does not have one.
   */
  name: "Lucas Reydman",

  /*
    The folio line, under the nameplate.

    It used to end "I build complete products on my own", which stopped being
    true once FBI Basketball was corrected from sole developer to product
    engineering lead. "Solutions" rather than "products" on purpose: the work
    includes internal tools that are not products in any sense a client would
    recognise, and a private coaching dashboard is not a product.
  */
  sub: "Software developer, working in analytics and AI",

  /*
    An overview, not a catalogue. It names no clients and no projects on purpose:
    the index sits directly under it and every one of them is a heading further
    down, so naming them here made the reader read the same three names twice
    before learning anything. It says what kind of work it is, what he does when
    nobody is paying him, and that the specifics are further on.

    Two earlier versions are worth not repeating. One led with a revenue figure,
    which turned a paragraph about instinct into a paragraph about money. The
    other invented a backstory and reached for lines like "a big, messy, public
    dataset that argues back", which is a copywriter doing an impression of him.
    Nothing below claims anything he has not actually done.
  */
  /*
    Rewritten 2026-11-10 for the sports analytics angle (Lucas: "talk about how
    my background / focus is in sports / sports analytics data ... trying to get
    a job in that field"). Every claim traces to a write-up further down the
    page; the engine authorship is from git (lib/ros/ in fbi-basketball, every
    commit his).
  */
  about: [
    "I build sports analytics software: the models that turn box scores, betting lines and injury reports into a number, and the products that put that number in front of the people making the decision. I am in my final year of Applied Computer Science at Dalhousie, with coursework in the Faculty of Management.",
    "Most of my work is at FBI Basketball, a fantasy basketball platform, where I lead product engineering and wrote the projection engine behind its rankings, tiers and trade calculator. Outside it I build my own: an NBA player index, a franchise index across nine leagues, betting models for baseball's first inning and hit props, a full platform for my dynasty league, and lineup and trade tools for fantasy football.",
    "I put as much work into the product as into the model. A probability is only useful once it is compared with the price on offer and put on the screen where the decision gets made. I show my method too, including where it is weak, so nobody has to take a number on trust.",
    "I work with AI agents every day, and a lot of what I ship is written with agents in the loop. The parts I spend my effort on are setting up the task, choosing the tools the agent gets, and reviewing what comes back before it ships.",
  ],

  /*
    Rewritten after the unslop pass (2026-11-10). The headline says what he
    builds in his own nouns. The facts are plain facts, not stats: the earlier
    "career totals" (projects on this page, sports modelled, commits) were
    numbers picked to look like numbers, and Lucas called them out as that.
  */
  hero: {
    /*
      2026-11-17. It was "Sports analytics, from the model to the screen".
      Lucas: "its more like yes this is about sports but also about software
      development and AI". So the headline names all three, in the order of
      what he is (a software developer), what he works on, and what he works
      with. The sub says what the AI part is in fact: he builds with agents.

      Later the same day "sports" came out of the headline so it also reads
      for someone hiring outside sport, and the sub and metadata followed. The
      work under it is all sport, and the About text says so in full.
    */
    headline: "Software, analytics and AI",
    /*
      2026-11-17. The sub used to say "where I wrote the projection engine
      behind its rankings". Lucas: it "dumbs it down", as if that were all he
      did there. The hero names the job at its full size and what FBI is, and
      leaves the parts of the job to the FBI chapter directly below. The
      headline already says the range of the work, so the sub does not repeat
      it: it gives the job, where he is in school, and what he is looking for.
    */
    sub: "I lead product engineering at FBI Basketball, a paid fantasy basketball platform, and I build with AI agents every day. I am in my final year of computer science at Dalhousie and looking for a role in software, analytics or AI.",
    caption: "",
  },
  /* Sits between the job and the projects, and says plainly what the projects are. */
  projectsLede: {
    headline: "And the things I build on my own time",
    body: "Player metrics, betting models and fantasy tools, built for my own leagues and my own questions. Each one has a page with its screens, its features and its math.",
  },
  /* Opens the Experience section on the home page, beside the list of roles. */
  experienceLede:
    "Product engineering at FBI Basketball now, two co-op terms in technology and finance operations at RBC before it, and a company of my own before that. Applied Computer Science at Dalhousie, graduating 2027.",
  facts: [
    { label: "Working at", value: "FBI Basketball" },
    { label: "School", value: "Dalhousie University" },
    { label: "Graduating", value: "2027" },
    { label: "Based", value: "Toronto" },
    { label: "Languages", value: "English and French" },
  ],
  contact: {
    headline: "Looking for work in software, analytics and AI",
    body: "I graduate in 2027 and take freelance work in the meantime. If you are hiring for a role that sits between the model and the product, I would like to hear about it.",
  },

  location: "Toronto",
  email: "lucas@reydman.com",
  resumePdf: "/resume/Lucas-Reydman-Resume.pdf",

  links: [
    { label: "GitHub", href: "https://github.com/lucasreydman" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/lucasreydman" },
  ],
};
