import { Figure } from "@/components/figures/figures";
import type { StudyStep } from "@/content/types";
import { noWidow } from "@/lib/text";
import { cn } from "@/lib/utils";
import { formula } from "./formula";

/**
 * How the thing works, step by step: the reasoning on the left, the formula
 * the code runs and a chart computed from it on the right. Drawn inside the
 * project's brand scope, so the charts take its colours.
 */
export function Method({ steps, heading }: { steps: StudyStep[]; heading: string }) {
  return (
    <ol className="border-t border-line">
      {steps.map((step, i) => {
        const side = Boolean(step.math || step.figure);
        return (
          <li key={step.title} className="grid gap-x-12 gap-y-6 border-b border-line py-10 lg:grid-cols-12">
            <div className={side ? "lg:col-span-5" : "lg:col-span-8"}>
              <p className="font-mono text-[12px] leading-4 text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className={cn("mt-3 text-[22px] leading-[1.15] text-ink", heading)}>{step.title}</h3>
              <p className="mt-3 font-sans text-[15px] leading-[26px] text-secondary">{noWidow(step.body)}</p>
            </div>
            {side && (
              <div className="min-w-0 lg:col-span-7">
                {step.math && (
                  <div className="space-y-1 rounded-lg border border-line bg-card px-4 py-3">
                    {step.math.map((line) => (
                      <p key={line} className="whitespace-pre-wrap break-words font-mono text-[13px] leading-6 tabular-nums text-ink">
                        {formula(line)}
                      </p>
                    ))}
                  </div>
                )}
                {step.figure && (
                  <figure className={step.math ? "mt-6" : undefined}>
                    <Figure id={step.figure} />
                    {step.caption && <figcaption className="mt-4 font-sans text-[13px] leading-5 text-muted">{step.caption}</figcaption>}
                  </figure>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
