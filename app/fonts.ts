import {
  Archivo,
  Barlow,
  Barlow_Condensed,
  Big_Shoulders,
  DM_Sans,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  Instrument_Sans,
  Inter,
  Martian_Mono,
  Poppins,
  Sofia_Sans,
  Sofia_Sans_Extra_Condensed,
  Sometype_Mono,
  Zalando_Sans,
  Zalando_Sans_Expanded,
} from "next/font/google";
import localFont from "next/font/local";

/*
  The site's own type is one family at two widths, plus a mono:

  - Zalando Sans Expanded for the name, headlines and section titles. It is a
    wide grotesque, the proportions of a jersey nameplate or a broadcast
    lower third, set in sentence case so it stays calm.
  - Zalando Sans for everything read or pressed.
  - Martian Mono for figures, dates and formulas, where digits sit in columns.

  Every other family here belongs to one project and is the face that
  project's own app loads, so its tiles and its page are set in its real type.
  Only the site's own faces are preloaded.
*/
const display = Zalando_Sans_Expanded({ variable: "--font-zalando-expanded", subsets: ["latin"], display: "swap" });
const text = Zalando_Sans({ variable: "--font-zalando", subsets: ["latin"], display: "swap" });
const mono = Martian_Mono({ variable: "--font-martian-mono", subsets: ["latin"], display: "swap", preload: false });

/* FBI Basketball, PhantomGM and SHARPRFI are set in Geist; Blakey uses Geist Mono. */
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap", preload: false });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", preload: false });

/* FBI Basketball: Norwester, self-hosted in its repo under the SIL OFL. */
const norwester = localFont({
  src: "./fonts/norwester.otf",
  variable: "--font-norwester",
  display: "swap",
  preload: false,
});

/* PhantomGM */
/* The app widens Archivo to 104 to 112 percent, so the width axis comes with it. */
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"], display: "swap", preload: false });

/* TPDL */
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
});
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  preload: false,
});

/* Fandex: Archivo, which PhantomGM already loads with its width axis, and IBM Plex Mono for figures. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

/* Playcaller */
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/* Lineup Lab */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

/* GLUE Index */
const sofiaSans = Sofia_Sans({ variable: "--font-sofia-sans", subsets: ["latin"], display: "swap", preload: false });
const sofiaCondensed = Sofia_Sans_Extra_Condensed({
  variable: "--font-sofia-condensed",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const sometypeMono = Sometype_Mono({ variable: "--font-sometype-mono", subsets: ["latin"], display: "swap", preload: false });

/* Hitlist */
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: false });

/* Blakey Breakthrough */
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap", preload: false });

export const fontVariables = [
  display,
  text,
  mono,
  geist,
  geistMono,
  norwester,
  archivo,
  barlow,
  barlowCondensed,
  plexMono,
  bigShoulders,
  instrumentSans,
  poppins,
  sofiaSans,
  sofiaCondensed,
  sometypeMono,
  inter,
  dmSans,
]
  .map((f) => f.variable)
  .join(" ");
