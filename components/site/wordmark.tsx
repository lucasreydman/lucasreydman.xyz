import Image from "next/image";
import type { Brand } from "@/content/types";

/**
 * Each project's name, set the way its own app sets it: the real mark beside
 * the real lettering, in the project's own typeface. Sizes are in em so the
 * caller picks the scale with a font size.
 */
export function Wordmark({ brand }: { brand: Brand }) {
  switch (brand) {
    case "fbi":
      return (
        <span className="flex items-center gap-[0.5em]">
          <Image src="/brand/fbi/emblem-gold.png" alt="" width={540} height={540} className="h-[2.1em] w-[2.1em]" />
          <span className="font-display leading-[0.95] tracking-[0.02em]">
            FANTASY BASKETBALL
            <br />
            <span className="text-accent">INTERNATIONAL</span>
          </span>
        </span>
      );
    case "glue":
      return (
        <span className="flex items-center gap-[0.4em]">
          {/* The ledger mark, drawn as the product's header draws it: two credits right of the axis, one debit left. */}
          <svg viewBox="0 0 20 20" className="h-[1.5em] w-[1.5em]" aria-hidden="true">
            <rect x="10" y="2" width="9" height="4" fill="#1b5e4b" />
            <rect x="10" y="8" width="5" height="4" fill="#1b5e4b" />
            <rect x="3" y="14" width="7" height="4" fill="#b3261e" />
          </svg>
          <span className="font-display text-[2em] font-bold leading-none tracking-[0.01em]">GLUE</span>
        </span>
      );
    case "phantomgm":
      return <Image src="/brand/phantomgm/wordmark.png" alt="" width={1200} height={272} className="h-[1.9em] w-auto" />;
    case "tpdl":
      return (
        <span className="inline-flex flex-col">
          <span className="font-display text-[2.2em] font-extrabold italic leading-[0.85] tracking-[-0.01em]">TPDL</span>
          <span className="mt-[0.3em] h-[0.22em] w-[62%] self-center rounded-full bg-accent" />
        </span>
      );
    case "fandex":
      return (
        <span className="flex items-center gap-[0.3em]">
          {/* The pennant, drawn as the product's header draws it: the mark for a title. */}
          <svg viewBox="0 0 10 10" className="h-[1.35em] w-[1.35em] text-accent" aria-hidden="true">
            <path d="M1 0.5v9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M1.6 1.2 9.4 3.6 1.6 6z" fill="currentColor" />
          </svg>
          <span className="font-display text-[2em] font-semibold leading-none tracking-[0.01em] [font-stretch:68%]">Fandex</span>
        </span>
      );
    case "playcaller":
      return (
        <span className="flex items-center gap-[0.45em]">
          <Image src="/brand/playcaller/icon.svg" alt="" width={512} height={512} unoptimized className="h-[1.7em] w-[1.7em] rounded-[22%]" />
          <span className="font-display text-[1.7em] font-black uppercase leading-none">Playcaller</span>
        </span>
      );
    case "lineup-lab":
      return (
        <span className="flex items-center gap-[0.45em]">
          <Image src="/brand/lineup-lab/icon.svg" alt="" width={64} height={64} unoptimized className="h-[1.6em] w-[1.6em]" />
          <span className="font-display text-[1.4em] font-semibold leading-none tracking-[-0.01em]">Lineup Lab</span>
        </span>
      );
    case "sharprfi":
      return (
        <span className="flex items-center gap-[0.4em]">
          <Image src="/brand/sharprfi/mark.svg" alt="" width={64} height={64} unoptimized className="h-[1.7em] w-[1.7em]" />
          <span className="font-display text-[1.7em] font-extrabold leading-none tracking-[-0.03em]">
            <span className="text-accent">SHARP</span>RFI
          </span>
        </span>
      );
    case "hitlist":
      return (
        <span className="flex items-center gap-[0.45em]">
          <Image src="/brand/hitlist/mark.svg" alt="" width={64} height={64} unoptimized className="h-[1.8em] w-[1.8em]" />
          <span className="font-display text-[1.7em] font-extrabold leading-none tracking-[-0.03em]">Hitlist</span>
        </span>
      );
    case "blakey":
      return (
        <span className="flex items-center gap-[0.45em]">
          <Image src="/brand/blakey/mark.svg" alt="" width={64} height={64} unoptimized className="h-[1.8em] w-[1.8em] rounded-[18%] ring-1 ring-line" />
          <span className="font-display text-[1.4em] font-bold leading-none tracking-[-0.02em]">Blakey Breakthrough</span>
        </span>
      );
  }
}

/** How each brand sets a section heading on its own page. */
export const HEADING: Record<Brand, string> = {
  fbi: "font-display uppercase tracking-[0.02em]",
  glue: "font-display font-semibold tracking-[0.005em]",
  phantomgm: "font-display font-extrabold tracking-[-0.02em]",
  tpdl: "font-display font-bold uppercase",
  fandex: "font-display font-semibold [font-stretch:68%]",
  playcaller: "font-display font-black uppercase",
  "lineup-lab": "font-display font-semibold tracking-[-0.01em]",
  sharprfi: "font-display font-bold tracking-[-0.02em]",
  hitlist: "font-display font-bold tracking-[-0.02em]",
  blakey: "font-display font-bold tracking-[-0.02em]",
};
