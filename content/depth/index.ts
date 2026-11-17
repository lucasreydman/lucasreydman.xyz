import type { Brand, ProjectDepth } from "../types";
import { depth as blakey } from "./blakey";
import { depth as hitlist } from "./hitlist";
import { depth as fandex } from "./fandex";
import { depth as fbi } from "./fbi";
import { depth as glue } from "./glue";
import { depth as lineupLab } from "./lineup-lab";
import { depth as phantomgm } from "./phantomgm";
import { depth as playcaller } from "./playcaller";
import { depth as sharprfi } from "./sharprfi";
import { depth as tpdl } from "./tpdl";

/** Everything each project does and the engineering under it, written from its repo. */
export const DEPTH: Record<Brand, ProjectDepth> = {
  fbi,
  glue,
  phantomgm,
  tpdl,
  fandex,
  playcaller,
  "lineup-lab": lineupLab,
  sharprfi,
  hitlist,
  blakey,
};
