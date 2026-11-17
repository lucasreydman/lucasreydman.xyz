import type { Brand } from "@/content/types";
import { SURFACES as blakey } from "./blakey";
import { SURFACES as hitlist } from "./hitlist";
import { SURFACES as fandex } from "./fandex";
import { SURFACES as fbi } from "./fbi";
import { SURFACES as glue } from "./glue";
import { SURFACES as lineupLab } from "./lineup-lab";
import { SURFACES as phantomgm } from "./phantomgm";
import { SURFACES as playcaller } from "./playcaller";
import { SURFACES as sharprfi } from "./sharprfi";
import { SURFACES as tpdl } from "./tpdl";
import type { SurfaceDef } from "./types";

/** Every rebuilt screen, by project. The order inside a project is the order on its page. */
export const SURFACES: Record<Brand, SurfaceDef[]> = {
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

export type { SurfaceDef };
