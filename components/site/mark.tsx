/**
 * The site's own mark: L and R as one shape.
 *
 * The L is a pair of axes, and its base runs on under the R, so the R stands
 * on it the way a plotted value stands on a chart. That is the whole idea, and
 * nothing else is drawn. The R is the R of the headline typeface (Zalando Sans
 * Expanded at 800), scaled so its strokes are the same weight as the L's. It
 * takes the accent so the two letters stay apart at 16 pixels.
 *
 * It replaced thin axes with one plotted point (2026-11-16), which Lucas did
 * not love: you had to be told it was an L. Several rounds of options followed
 * (plain letters, charts inside the axes, jersey lettering, jersey lettering
 * with charts added), and his verdict on those was "you are overthinking, do
 * real design". Do not add ticks, balls, bars or stripes to this.
 *
 * `public/mark.svg` is the same drawing with the colours written out, and the
 * icons in `app/` are made from it with `tools/make-icons.mjs`.
 */
export function Mark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="var(--ink)" />
      <path d="M10.5 50.52V13.48H18.42V44.54H53.5V50.52Z" fill="var(--ground)" />
      <path d="M22.16 40.8V13.48H42.13Q45.19 13.48 47.39 14.32Q49.59 15.17 50.78 16.83Q51.97 18.5 51.97 20.97Q51.97 22.88 51.12 24.5Q50.26 26.12 48.38 27.17Q46.49 28.22 43.35 28.46L43.96 28.08Q46.1 28.1 47.52 28.64Q48.93 29.18 49.82 30.34Q50.71 31.49 51.26 33.32L53.5 40.8H45.25L43.4 34.53Q42.94 32.95 41.93 32.1Q40.92 31.25 38.93 31.25H30.08V40.8ZM30.08 25.26H40.82Q41.55 25.26 42.22 24.98Q42.89 24.69 43.32 24.05Q43.75 23.41 43.75 22.36Q43.75 20.76 42.82 20.11Q41.88 19.46 40.82 19.46H30.08Z" fill="var(--accent)" />
    </svg>
  );
}
