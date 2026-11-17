/** A project, by the name of its brand scope in `app/globals.css` (`.b-<brand>`). */
export type Brand = "fbi" | "glue" | "phantomgm" | "tpdl" | "fandex" | "playcaller" | "lineup-lab" | "sharprfi" | "hitlist" | "blakey";

export type Profile = {
  name: string;
  sub: string;
  about: string[];
  hero: { headline: string; sub: string; caption: string };
  experienceLede: string;
  projectsLede: { headline: string; body: string };
  facts: { label: string; value: string }[];
  contact: { headline: string; body: string };
  location: string;
  email: string;
  /** The downloadable résumé, generated from `/resume/print` by `tools/make-resume.mjs`. */
  resumePdf: string;
  links: { label: string; href: string }[];
};

/**
 * A built thing, opened up.
 *
 * Replaced the separate `Project` and `LabEntry` types on 2026-11-10, when the
 * site was re-angled toward sports analytics and every entry grew a method. A
 * gallery card could only hold a paragraph, which is the wrong shape for work
 * whose interesting part is the math, so each entry now carries the question it
 * answers and the steps it takes to answer it.
 */
export type Study = {
  slug: string;
  name: string;
  /** Short facts set above the name: sport, what it is, role or status, year. */
  meta: string[];
  /** The question the thing answers, in one sentence. */
  deck: string;
  /** A link on the write-up itself: FBI's site, and the business Blakey was built for. What a reader can do about a project is its `action` in `projects.ts`. */
  href?: string;
  hrefLabel?: string;
  /** Each string is a paragraph. */
  intro: string[];
  steps: StudyStep[];
  stack: string[];
};

/**
 * One stage of a method. `math` lines are set as formulas, one per line, and
 * must be the formula the code actually runs. `figure` names a chart in
 * `components/site/figures.tsx`, which computes it from the same constants.
 */
export type StudyStep = {
  title: string;
  body: string;
  math?: string[];
  figure?: FigureId;
  caption?: string;
};

export type FigureId =
  | "fbi-prior-k"
  | "fbi-shrink"
  | "fbi-forgiveness"
  | "sharp-shrink"
  | "nrfi-calculator"
  | "sharp-brier"
  | "bvp-score"
  | "bvp-spot"
  | "tpdl-weight"
  | "tpdl-t"
  | "tpdl-lottery"
  | "fdx-spread"
  | "fdx-prior"
  | "fdx-recency"
  | "pgm-play"
  | "pgm-flow"
  | "pgm-faab"
  | "ll-blend"
  | "ll-dvp"
  | "pc-weeks"
  | "pc-bid"
  | "pc-agree"
  | "bb-trend"
  | "bb-priority";

export type Role = {
  org: string;
  title: string;
  period: string;
  current?: boolean;
  href?: string;
  /** Small square brand mark in /public, shown at favicon size beside the org. */
  logo?: string;
  /** Set when the job has a project page of its own: the role links there. */
  project?: Brand;
  detail: string[];
};

export type EarlierRole = {
  org: string;
  title: string;
  period: string;
  note: string;
  logo?: string;
};

export type Honor = {
  what: string;
  where: string;
  mark: string;
  href?: string;
};

export type SkillGroup = {
  name: string;
  items: string[];
};

/**
 * The full account of a project, for its own page: everything it does, and the
 * engineering under it. Written from the project's repo (its routes, its
 * README, its code), not from memory, and never padded.
 *
 * `features` is grouped the way a user meets the product. `engineering` is the
 * work a user never sees: data pipelines, scheduling, auth, testing, the hard
 * problems and how they were solved.
 */
export type ProjectDepth = {
  features: FeatureGroup[];
  engineering: DepthItem[];
};

export type FeatureGroup = {
  /** Two to four words: "Trades and picks". */
  title: string;
  /** Optional single sentence that frames the group. */
  summary?: string;
  items: DepthItem[];
};

export type DepthItem = {
  /** The feature or the piece of work, in a few words. */
  name: string;
  /** One or two plain sentences: what it does, and what makes it more than the obvious version. */
  detail: string;
};
