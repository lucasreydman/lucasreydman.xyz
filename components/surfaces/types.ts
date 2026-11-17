import type { ComponentType } from "react";

/**
 * One product screen, rebuilt for this site.
 *
 * `tile` is the one-column version that hangs on the wall. `full` is the wide
 * version shown on the project's own page; when a screen is naturally narrow
 * (a phone) it can be left out and the tile is used at both sizes.
 */
export type SurfaceDef = {
  /** Unique across the site, prefixed by the project: "fbi-rankings". */
  id: string;
  /** Two or three words, shown on hover: "Rankings board". */
  title: string;
  /** One or two plain sentences for the project page: what the screen is for and what sits behind it. */
  caption: string;
  tile: ComponentType;
  full?: ComponentType;
};
