import { lab } from "./box-score";
import { glue } from "./glue-study";
import type { Brand, Study } from "./types";
import { work } from "./work";

export type Sport = "Basketball" | "Baseball" | "Football" | "Nine leagues" | "Training";

/**
 * One thing Lucas built, as the home page and its own page need it.
 *
 * `brand` is the key for everything: the scope in `app/globals.css`
 * (`.b-<brand>`), the assets in `public/brand/<brand>/`, the screens in
 * `components/surfaces/<brand>.tsx`, and the URL `/work/<brand>`.
 *
 * `kind` is how the project relates to his working life, and it is the honest
 * one: FBI is his job, Blakey was client work, the rest he built for his own
 * leagues and questions. Nothing here is presented as a business.
 */
/**
 * What a reader can do about a project, shown under it on the home page and at
 * the top of its own page. Every project but FBI has one (FBI's link is on its
 * write-up, `study.href`).
 *
 * `open`: the tool is public and free, so the button goes to it. Each address
 * was loaded signed out on 2026-11-16; recheck before adding one.
 * `soon`: not open to anyone yet. No link, only the line saying where it stands.
 * `ask`: private work Lucas would build again for someone else. The button
 * starts an email to him with `subject` filled in.
 */
export type Action =
  | { kind: "open"; href: string; label: string; note: string }
  | { kind: "soon"; note: string }
  | { kind: "ask"; subject: string; label: string; note: string };

export type Project = {
  brand: Brand;
  name: string;
  sport: Sport;
  kind: "Current job" | "Client work" | "Project";
  /** What the thing is, in a few words. */
  what: string;
  /** His part in it, said exactly. Where someone else built part of it, they are named. */
  part: string;
  /** Square brand mark, shown small on every tile and large on the project page. */
  icon: string;
  /** Set when the mark is drawn for a dark ground and needs one behind it at small size. */
  iconGround?: string;
  action?: Action;
  study: Study;
};

const studies = [...work, glue, ...lab];
const study = (slug: string): Study => {
  const found = studies.find((s) => s.slug === slug);
  if (!found) throw new Error(`No write-up for ${slug}`);
  return found;
};

/**
 * In the order of the home page and the "next" links.
 *
 * FBI leads because it is the job. Then the four that make the analytics case:
 * a player metric, a pricing model, a whole platform, an index across leagues.
 * Then the tools for his own fantasy play. PhantomGM comes after everything
 * that is finished and his alone, because it is neither, and Blakey is last so
 * that client work runs into the Experience section. Playcaller and PhantomGM
 * are both lineup autopilots drawn as phones: keep them apart.
 */
export const projects: Project[] = [
  { brand: "fbi", what: "Fantasy basketball platform", part: "Product engineering lead", name: "FBI Basketball", sport: "Basketball", kind: "Current job", icon: "/brand/fbi/emblem.png", study: study("fbi-basketball") },
  {
    brand: "glue", what: "NBA player index", part: "Designed and built it", name: "GLUE Index", sport: "Basketball", kind: "Project", icon: "/brand/glue/icon.svg", study: study("glue"),
    action: { kind: "open", href: "https://glue-index.vercel.app/", label: "Open GLUE Index", note: "Free to use, no account. Night and season boards back to 2005-06." },
  },
  {
    brand: "sharprfi", what: "First inning betting model", part: "Built with Francisco Nevarez", name: "SHARPRFI", sport: "Baseball", kind: "Project", icon: "/brand/sharprfi/mark.svg", study: study("sharprfi"),
    action: { kind: "open", href: "https://sharprfi.vercel.app/", label: "Open SHARPRFI", note: "Free to use, no account. It prices games on MLB game days, so the slate is empty in the off-season." },
  },
  {
    brand: "tpdl", what: "Dynasty league platform", part: "Designed and built it", name: "TPDL", sport: "Basketball", kind: "Project", icon: "/brand/tpdl/icon.png", study: study("tpdl"),
    action: { kind: "ask", subject: "A platform for my league", label: "Ask about one for your league", note: "TPDL is private to its ten teams. If you want a platform like it for your own league, with your rules and your scoring, email me." },
  },
  {
    brand: "fandex", what: "Franchise index for nine leagues", part: "Designed and built it", name: "Fandex", sport: "Nine leagues", kind: "Project", icon: "/brand/fandex/icon.svg", study: study("fandex"),
    action: { kind: "open", href: "https://thefandex.vercel.app/", label: "Try Fandex", note: "Free to use, no account. Pick a birth year and one team to get your number." },
  },
  {
    brand: "playcaller", what: "Lineup and waiver autopilot", part: "Designed and built it", name: "Playcaller", sport: "Football", kind: "Project", icon: "/brand/playcaller/icon.svg", study: study("playcaller"),
    action: { kind: "soon", note: "Today it runs only on my own leagues." },
  },
  {
    brand: "lineup-lab", what: "Fantasy trade analyzer", part: "Designed and built it", name: "Lineup Lab", sport: "Football", kind: "Project", icon: "/brand/lineup-lab/icon.svg", study: study("lineup-lab"),
    action: { kind: "open", href: "https://fantasy-lineup-lab.vercel.app/", label: "Open Lineup Lab", note: "Free to use with any Sleeper league. There is a demo league if you do not have one." },
  },
  {
    brand: "hitlist", what: "Hit prop board", part: "Designed and built it", name: "Hitlist", sport: "Baseball", kind: "Project", icon: "/brand/hitlist/mark.svg", study: study("mlb-hitlist"),
    action: { kind: "open", href: "https://hitlist-mlb.vercel.app/", label: "Open Hitlist", note: "Free to use, no account. The board fills on MLB game days, once lineups are posted." },
  },
  {
    brand: "phantomgm", what: "Fantrax lineup autopilot", part: "Building it with the FBI team", name: "PhantomGM", sport: "Basketball", kind: "Project", icon: "/brand/phantomgm/icon.png", study: study("phantomgm"),
    action: { kind: "soon", note: "FBI's admins are testing it before it opens to members." },
  },
  {
    brand: "blakey", what: "Coaching dashboard", part: "Sole developer", name: "Blakey Breakthrough", sport: "Training", kind: "Client work", icon: "/brand/blakey/mark.svg", study: study("blakey-breakthrough"),
    action: { kind: "ask", subject: "A custom build", label: "Ask about a custom build", note: "This one is private to the coach. If you need a tool built around your own business or brand, I take freelance work." },
  },
];

export const projectByBrand = (brand: string) => projects.find((p) => p.brand === brand);
