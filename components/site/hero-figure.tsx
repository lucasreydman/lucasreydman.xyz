"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";

/*
  The portrait beside the headline, arriving as data and then as itself.

  The panel opens as an even field of small dots, like an empty plot. A sweep
  from left to right sizes each dot by how dark the photograph is at that
  spot, so the field becomes a picture of him made only of plotted points.
  A second sweep follows behind it and the photograph itself comes through.
  The field of small dots stays around him afterwards.

  It plays once. After that, a pointer over the portrait opens a round window
  back onto the dots underneath it.

  There is nothing to read and nothing to decode: it is one picture, shown
  first as data and then as itself. Two earlier versions put a diagram beside
  him (chart axes with an unlabelled point, then a ball flying between two
  captioned stops) and Lucas rejected both as not making sense. A third removed
  the motion altogether, and he had not asked for that either: he wanted a
  more creative animation, not none.

  If script never runs, the photograph still appears: `.hp-photo` in
  `app/globals.css` fades it in by itself after a few seconds, and this
  component takes that over as soon as it starts.
*/

const COLS = 60; // dots across, and down
const SWEEP = 1300; // ms for the dots to take their sizes, left to right
const PHOTO_AT = 950; // ms after the start that the photograph begins to follow
const PHOTO = 1300; // ms for the photograph to come through
const LENS = 0.2; // the pointer's window, as a share of the figure's width

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export function HeroFigure() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const ph = photo.current;
    const img = ph?.querySelector("img");
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ph || !img || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ink = getComputedStyle(el).getPropertyValue("--ink").trim() || "#11163a";
    const dark = new Float32Array(COLS * COLS); // how dark the photograph is at each dot, 0 to 1
    const solid = new Uint8Array(COLS * COLS); // whether any of him is on that dot
    const lens = { x: 0, y: 0, r: 0, to: 0 };
    let ready = false;
    let start = 0;
    let frame = 0;
    let done = false;

    function size() {
      const r = el!.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv!.width = Math.round(r.width * dpr);
      cv!.height = Math.round(r.height * dpr);
    }

    /* Read the photograph down to one value per dot. */
    function sample() {
      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = COLS;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return false;
      try {
        o.drawImage(img!, 0, 0, COLS, COLS);
        const px = o.getImageData(0, 0, COLS, COLS).data;
        for (let i = 0; i < COLS * COLS; i++) {
          const a = px[i * 4 + 3] / 255;
          const lum = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
          dark[i] = a * (0.18 + 0.82 * (1 - lum));
          solid[i] = a > 0.04 ? 1 : 0; // any of him at all, so no dots fringe his outline
        }
        return true;
      } catch {
        return false;
      }
    }

    function draw(now: number) {
      const w = cv!.width;
      const h = cv!.height;
      const cell = w / COLS;
      const t = still ? Infinity : now - start;
      const dots = ease(t / SWEEP); // how far the first sweep has travelled
      const shown = ease((t - PHOTO_AT) / PHOTO); // how far the photograph has followed
      const lx = lens.x * w;
      const ly = lens.y * h;
      const lr = lens.r * w;

      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = ink;
      for (let row = 0; row < COLS; row++) {
        for (let col = 0; col < COLS; col++) {
          const i = row * COLS + col;
          const x = (col + 0.5) * cell;
          const y = (row + 0.5) * cell;
          const u = (col + 0.5) / COLS;
          const inLens = lr > 0 && (x - lx) * (x - lx) + (y - ly) * (y - ly) < lr * lr;
          /* Where the photograph has come through, his dots are under it and are not drawn. */
          if (solid[i] === 1 && u < shown * 1.02 && !inLens) continue;
          /* Each dot grows as the sweep passes it, over a soft edge a fifth of the width wide. */
          const amount = dark[i] * ease((dots * 1.2 - u) / 0.2);
          ctx!.globalAlpha = 0.22 + 0.78 * Math.min(1, amount * 1.6);
          ctx!.beginPath();
          ctx!.arc(x, y, cell * (0.09 + 0.4 * amount), 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;

      /* The photograph comes in from the left, with the pointer's window cut out of it. */
      ph!.style.clipPath = `inset(0 ${((1 - shown) * 100).toFixed(2)}% 0 0)`;
      const hole =
        lens.r > 0.002
          ? `radial-gradient(circle ${(lens.r * 100).toFixed(2)}cqw at ${(lens.x * 100).toFixed(2)}% ${(lens.y * 100).toFixed(2)}%, transparent 97%, #000 100%)`
          : "none";
      ph!.style.maskImage = hole;
      ph!.style.webkitMaskImage = hole;

      done = t >= PHOTO_AT + PHOTO;
    }

    function tick(now: number) {
      lens.r += (lens.to - lens.r) * 0.2;
      if (Math.abs(lens.to - lens.r) < 0.001) lens.r = lens.to;
      draw(now);
      frame = !done || lens.r !== lens.to ? requestAnimationFrame(tick) : 0;
    }

    function wake() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function begin() {
      ph!.style.animation = "none";
      ph!.style.opacity = "1";
      /* If the photograph cannot be read, show it as it is and leave the dots out. */
      if (!sample()) return;
      ready = true;
      size();
      ph!.style.clipPath = "inset(0 100% 0 0)";
      start = performance.now() + 250;
      wake();
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" || !done) return;
      const r = el!.getBoundingClientRect();
      lens.x = (e.clientX - r.left) / r.width;
      lens.y = (e.clientY - r.top) / r.height;
      lens.to = LENS;
      wake();
    }

    function onLeave() {
      lens.to = 0;
      wake();
    }

    const resize = new ResizeObserver(() => {
      if (!ready) return;
      size();
      wake();
    });
    resize.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    if (img.complete && img.naturalWidth > 0) begin();
    else img.addEventListener("load", begin, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      img.removeEventListener("load", begin);
    };
  }, []);

  return (
    <div ref={box} className="hp relative mx-auto aspect-square w-full max-w-[400px] overflow-hidden rounded-xl bg-raised lg:max-w-[540px]">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div ref={photo} className="hp-photo absolute inset-0">
        <Image src="/lucas.webp" alt={profile.name} width={1080} height={1080} priority sizes="(min-width: 1024px) 540px, 400px" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
