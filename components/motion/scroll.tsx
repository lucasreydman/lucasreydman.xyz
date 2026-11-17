"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/*
  Scroll is the timeline.

  `Shot` turns scroll position into one CSS
  variable on its own element, and everything inside is styled as a pure
  function of it. No state lives between frames and nothing re-renders.

  The held stage for FBI's screens is in `stage.tsx`.
*/

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function onScroll(update: () => void) {
  let frame = 0;
  const tick = () => {
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
  };
  update();
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  return () => {
    window.removeEventListener("scroll", tick);
    window.removeEventListener("resize", tick);
    cancelAnimationFrame(frame);
  };
}

/**
 * A shot that arrives. As the section scrolls up into view, `--e` runs from 0
 * to 1 (the camera settling on it), and once it is properly in view the
 * section gets `data-in`, which lets the type and the screens inside make
 * their entrance. See the "shots" block in `app/globals.css`.
 */
export function Shot({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.armed = "true";
    return onScroll(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const e = clamp((vh - rect.top) / (vh * 0.85));
      el.style.setProperty("--e", String(smooth(e)));
      if (rect.top < vh * 0.72) el.dataset.in = "true";
    });
  }, []);

  return (
    <section ref={ref} id={id} className={className} style={{ "--e": 1 } as CSSProperties}>
      {children}
    </section>
  );
}
