/**
 * Glue the last three words of a block with no-break spaces, so a wrapped
 * paragraph can never end in a one- or two-word stub line. `text-wrap: pretty`
 * was supposed to be this, but Chromium's version only prevents the single
 * word case, and the page was full of "or refreshing." tails.
 *
 * Three words, not two: a two word tail is exactly the shape being banned.
 * Short standalone lines (stack lists, metadata) use `text-balance` instead,
 * which evens the lines rather than protecting the tail.
 */
export function noWidow(text: string) {
  return text.replace(/ (\S+) (\S+)$/, " $1 $2");
}

/** The id a role is anchored by on the résumé page: "rbc-2026", "fbi-basketball-2026". */
export function roleAnchor(role: { org: string; period: string }) {
  const year = role.period.match(/\d{4}/)?.[0] ?? "";
  const org = role.org
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${org}-${year}`;
}
