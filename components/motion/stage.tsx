"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A stage that holds while the scroll steps through screens.
 *
 * The first version of this felt like being stuck, because for long stretches
 * of scrolling nothing on screen moved. The rule here is that something always
 * answers the scroll:
 *
 *   - a progress rail fills continuously, so the reader knows where they are
 *     and how much is left;
 *   - while a screen holds, it pans upward inside its frame, so a tall screen
 *     is read top to bottom;
 *   - between screens the next one slides up over the last, which falls back
 *     and dims, in direct proportion to the scroll;
 *   - the position is eased toward the scroll a little each frame, so a wheel
 *     tick or a flick lands softly.
 *
 * `steps` are the captions (one is active at a time) and `screens` the screens,
 * in the same order. Styling of the active caption is by `data-active`.
 */
export function Stage({ steps, screens, label }: { steps: ReactNode[]; screens: ReactNode[]; label: string }) {
  const root = useRef<HTMLElement>(null);
  const n = screens.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const frames = [...el.querySelectorAll<HTMLElement>("[data-screen]")];
    const pans = frames.map((f) => f.firstElementChild as HTMLElement);
    const caps = [...el.querySelectorAll<HTMLElement>("[data-step]")];
    const rail = el.querySelector<HTMLElement>("[data-rail]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target = 0;
    let shown = 0;
    let frame = 0;
    let active = -1;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);

    const read = () => {
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      target = span > 0 ? clamp(-rect.top / span) : 0;
    };

    const draw = () => {
      frame = 0;
      shown += (target - shown) * (reduce ? 1 : 0.14);
      if (Math.abs(target - shown) < 0.0004) shown = target;

      const at = Math.min(n - 1e-4, shown * n);
      const i = Math.floor(at);
      const f = at - i;
      /* A step holds for its first half and hands over to the next in its second. */
      const hand = i < n - 1 ? smooth(clamp((f - 0.5) / 0.5)) : 0;
      const hold = i < n - 1 ? clamp(f / 0.5) : f;

      frames.forEach((fr, k) => {
        const pan = pans[k];
        const over = Math.max(0, pan.scrollHeight - fr.clientHeight);
        if (k < i) {
          fr.style.transform = "scale(0.94)";
          fr.style.opacity = "0";
          pan.style.transform = `translateY(${-over}px)`;
        } else if (k === i) {
          fr.style.transform = `scale(${1 - 0.06 * hand})`;
          fr.style.opacity = String(1 - 0.75 * hand);
          pan.style.transform = `translateY(${-over * smooth(hold)}px)`;
        } else if (k === i + 1) {
          fr.style.transform = `translateY(${(1 - hand) * 100}%)`;
          fr.style.opacity = "1";
          pan.style.transform = "translateY(0)";
        } else {
          fr.style.transform = "translateY(100%)";
          fr.style.opacity = "1";
          pan.style.transform = "translateY(0)";
        }
      });

      if (rail) rail.style.transform = `scaleY(${shown})`;

      const now = hand > 0.5 ? i + 1 : i;
      if (now !== active) {
        active = now;
        caps.forEach((c, k) => c.setAttribute("data-active", String(k === now)));
      }

      if (shown !== target) frame = requestAnimationFrame(draw);
    };

    const tick = () => {
      read();
      if (!frame) frame = requestAnimationFrame(draw);
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      cancelAnimationFrame(frame);
    };
  }, [n]);

  return (
    <section ref={root} aria-label={label} className="relative border-t border-line" style={{ height: `calc(${n} * 110svh + 100svh)` }}>
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-[1320px] grid-rows-[auto_minmax(0,1fr)] gap-x-14 gap-y-4 px-4 py-5 sm:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:grid-rows-1 lg:py-10">
          <div className="relative lg:self-center lg:pl-7">
            {/* The rail: how far through the screens the reader is. */}
            <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-line lg:block">
              <div data-rail className="h-full w-full origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
            </div>
            <ol className="grid lg:block">
              {steps.map((step, k) => (
                <li key={k} data-step data-active={k === 0} className="group/step col-start-1 row-start-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative min-h-0 overflow-hidden rounded-xl border border-line bg-ground">
            {screens.map((screen, k) => (
              <div
                key={k}
                data-screen
                className="absolute inset-0 overflow-hidden bg-ground will-change-transform"
                style={k === 0 ? undefined : { transform: "translateY(100%)" }}
              >
                <div className="will-change-transform">{screen}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
