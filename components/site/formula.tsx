import type { ReactNode } from "react";

/**
 * A formula line with its exponents raised. Content writes `x^0.55` or
 * `e^(−λ home)`; whatever follows the caret is set as a superscript: a
 * bracketed group (brackets dropped, nesting respected), or a run of word
 * characters with an optional leading minus.
 */
export function formula(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let i = 0;
  while (i < line.length) {
    if (line[i] !== "^") {
      buf += line[i++];
      continue;
    }
    i++;
    let sup = "";
    if (line[i] === "(") {
      let depth = 0;
      for (; i < line.length; i++) {
        if (line[i] === "(") depth++;
        if (line[i] === ")") depth--;
        sup += line[i];
        if (depth === 0) {
          i++;
          break;
        }
      }
      sup = sup.slice(1, -1);
    } else {
      if (line[i] === "−" || line[i] === "-") sup += line[i++];
      while (i < line.length && /[\w.λ]/.test(line[i])) sup += line[i++];
    }
    out.push(buf, <sup key={i}>{sup}</sup>);
    buf = "";
  }
  out.push(buf);
  return out;
}
