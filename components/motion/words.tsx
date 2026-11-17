import type { CSSProperties } from "react";

/**
 * A line of type that rises out of its own baseline, word by word.
 *
 * Each word sits in a clipped box and starts below it, so the words come up
 * out of a mask line; they are never faded in. The stagger is in the markup
 * (`--i`), the motion is in `app/globals.css` under "shots".
 *
 * Screen readers get the sentence once, whole.
 */
export function Words({ text, from = 0 }: { text: string; from?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="w" style={{ "--i": from + i } as CSSProperties}>
              <span>{word}</span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </>
  );
}
