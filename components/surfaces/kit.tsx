import type { CSSProperties, ReactNode } from "react";
import type { Brand } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The frame every rebuilt product screen is drawn in.
 *
 * `w` is the design width in pixels. Everything inside is sized in design
 * pixels through Tailwind's spacing scale (`p-4` is 16), `t-13` (type), `r-8`
 * (radius) and `bw-2` (border width), and the whole screen scales with the box
 * it is placed in. See the surfaces block in `app/globals.css`.
 *
 * `brand` puts the screen in that project's own colours and typefaces.
 */
export function Surface({
  w,
  brand,
  className,
  children,
  label,
  interactive,
}: {
  w: number;
  brand: Brand;
  className?: string;
  children: ReactNode;
  /** What the screen shows, for a screen reader. The markup inside is hidden from it. */
  label: string;
  /** Set when the screen has real controls. It is then exposed as a group, not as a picture. */
  interactive?: boolean;
}) {
  if (interactive) {
    return (
      <div className={cn("sf brand", `b-${brand}`)} role="group" aria-label={label}>
        <div className={cn("sf-root", className)} style={{ "--w": w } as CSSProperties}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={cn("sf brand", `b-${brand}`)} role="img" aria-label={label}>
      <div className={cn("sf-root", className)} style={{ "--w": w } as CSSProperties} aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

/**
 * A phone, for the projects that are installed apps. The screen is 320 design
 * pixels wide inside a 336 body, so set the surface to `w={336 + 2 * margin}`.
 */
export function Phone({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="relative mx-auto w-84 r-46 bg-[#0c0c0d] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_24px_48px_rgba(0,0,0,0.35)]">
      <div className={cn("relative overflow-hidden r-38", className)}>
        <div className="absolute left-1/2 top-2.5 z-20 h-6 w-22 -translate-x-1/2 r-12 bg-black" />
        {children}
      </div>
    </div>
  );
}

/** The status bar inside a phone screen: the time on the left, nothing fake on the right. */
export function StatusBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-11 items-center justify-between px-7 t-13 font-semibold", className)}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="h-2.5 w-4 r-1 border border-current opacity-80" />
      </span>
    </div>
  );
}

/** A browser window, for the projects that are used on a desk. */
export function Window({
  children,
  url,
  className,
  bar,
}: {
  children: ReactNode;
  url: string;
  className?: string;
  /** Classes for the title bar, so it can match the page under it. */
  bar?: string;
}) {
  return (
    <div className={cn("overflow-hidden r-10 shadow-[0_0_0_1px_var(--line),0_24px_48px_rgba(0,0,0,0.18)]", className)}>
      <div className={cn("flex h-8 items-center gap-1.5 border-b border-line px-3", bar)}>
        <span className="h-2 w-2 r-4 bg-current opacity-20" />
        <span className="h-2 w-2 r-4 bg-current opacity-20" />
        <span className="h-2 w-2 r-4 bg-current opacity-20" />
        <span className="ml-3 t-10 text-muted">{url}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * A player's headshot, as the real products show one. The picture comes from
 * ESPN's public headshot CDN by athlete id; `league` is "nba", "nfl" or "mlb".
 * The frame is sized by the caller (`h-10 w-10 r-20` and so on); the image
 * fills it and is anchored to the top so the face stays in view. If the image
 * fails, the frame is left as a plain block. Never fall back to initials.
 */
export function Headshot({ league, id, className }: { league: "nba" | "nfl" | "mlb"; id: number | string; className?: string }) {
  return (
    <span className={cn("block shrink-0 overflow-hidden bg-raised", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a small decorative image inside a scaled surface; the optimizer adds nothing here */}
      <img
        src={`https://a.espncdn.com/i/headshots/${league}/players/full/${id}.png`}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </span>
  );
}
