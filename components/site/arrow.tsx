/*
  The arrow at the end of an action. It is drawn twice inside a box the size of
  one: on hover the first leaves in the direction it points and the second
  arrives from behind it, on the site's spring. It says where the action goes
  before the click: `out` leaves the site, `go` stays on it or starts an
  email, `down` saves a file or moves down the page.

  The motion is in the "controls" block of `app/globals.css`.
*/

const paths = {
  out: "M4.5 11.5 11.5 4.5M5.5 4.5h6v6",
  go: "M3 8h10M9 4l4 4-4 4",
  down: "M8 3v10M4 9l4 4 4-4",
} as const;

export function Arrow({ dir = "go" }: { dir?: keyof typeof paths }) {
  const glyph = (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[dir]} />
    </svg>
  );
  return (
    <span className={`arrow arrow-${dir}`} aria-hidden="true">
      {glyph}
      {glyph}
    </span>
  );
}
