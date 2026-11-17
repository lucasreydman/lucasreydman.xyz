import { type CSSProperties, ViewTransition } from "react";
import Link from "next/link";
import { Shot } from "@/components/motion/scroll";
import { Words } from "@/components/motion/words";
import { ProjectAction } from "@/components/site/project-action";
import { HEADING, Wordmark } from "@/components/site/wordmark";
import { SURFACES } from "@/components/surfaces";
import type { Project } from "@/content/projects";
import { LIVE, PHONES, shots } from "@/content/scroll";
import { noWidow } from "@/lib/text";
import { cn } from "@/lib/utils";

/*
  One project, one shot.

  The panel is the project's own world: its ground, its type, its real mark.
  As it scrolls in, the panel grows to fill the width and its corners square
  off, the way a camera settles on a subject. Then the question it answers
  rises word by word, and its screen comes up on a spring. Under the words is
  what a reader can do about it (`ProjectAction`) and the way to its page. One screen per
  project, shown at the width it was drawn for: a second, smaller screen was
  tried and its type was too small to read.
*/
export function ProjectShot({ project, flip }: { project: Project; flip: boolean }) {
  const { study, brand } = project;
  if (brand === "fbi") return null;
  const mainId = shots[brand];
  const main = SURFACES[brand].find((s) => s.id === mainId)!;
  const Main = main.tile;
  const href = `/work/${brand}`;
  /* A card or a board gets an edge and a shadow. A phone already is an object with its own edge, so it
     stands on the panel with no box around it, and where it runs off the bottom it fades out. */
  const card = "block overflow-hidden rounded-xl ring-1 ring-line shadow-[0_24px_48px_rgba(0,0,0,0.28)]";
  const phone = "block overflow-hidden [mask-image:linear-gradient(to_bottom,black_82%,transparent)]";
  const frameOf = (id: string) => (PHONES.has(id) ? phone : card);

  const settle = {
    transform: "scale(calc(0.93 + 0.07 * var(--e)))",
    borderRadius: "calc(12px + (1 - var(--e)) * 36px)",
  } as CSSProperties;

  return (
    <Shot className="px-2 py-1 sm:px-3">
      <div className={cn("brand overflow-hidden bg-ground", `b-${brand}`)} style={settle}>
        {/* On a phone the order is name and question, then the screen, then the rest.
            On a desk the words stack in one column and the screens hold the other. */}
        <div
          className={cn(
            "mx-auto grid w-full max-w-[1320px] gap-x-16 gap-y-10 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-0 lg:py-24",
            flip ? "lg:[grid-template-areas:'visual_head''visual_body']" : "lg:[grid-template-areas:'head_visual''body_visual']",
          )}
        >
          <div className="lg:self-end lg:[grid-area:head]">
            {/* The same object as the wordmark on the project's page: it travels there on a click. */}
            <div className="rise text-[18px] text-ink sm:text-[22px]" aria-hidden="true">
              <ViewTransition name={`mark-${brand}`}>
                <div className="w-fit">
                  <Wordmark brand={brand} />
                </div>
              </ViewTransition>
            </div>
            <h3 className="sr-only">{project.name}</h3>
            <p className={cn("mt-8 max-w-[20ch] text-balance text-[28px] leading-[1.1] text-ink sm:text-[40px]", HEADING[brand])}>
              <Words text={study.deck.replace(/\.$/, "")} />
            </p>
          </div>

          {/* One screen, at the size it was drawn for, so every figure on it can be read. */}
          <div className="rise mx-auto w-full max-w-[440px] lg:self-center lg:[grid-area:visual]" style={{ "--d": 150 } as CSSProperties}>
            {LIVE.has(main.id) ? (
              <div className={frameOf(main.id)}>
                <Main />
              </div>
            ) : (
              <Link href={href} className={cn(frameOf(main.id), "lift")} aria-label={`${project.name}: ${main.title}`}>
                <Main />
              </Link>
            )}
          </div>

          <div className="lg:self-start lg:[grid-area:body]">
            <p className="rise max-w-[52ch] font-sans text-[16px] leading-7 text-secondary lg:mt-5" style={{ "--d": 320 } as CSSProperties}>
              {noWidow(study.intro[0])}
            </p>
            <ol className="rise mt-7 max-w-[52ch] border-t border-line" style={{ "--d": 400 } as CSSProperties}>
              {study.steps.slice(0, 3).map((step, i) => (
                <li key={step.title} className="flex items-baseline gap-4 border-b border-line py-2.5">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-sans text-[15px] leading-6 text-ink">{step.title}</span>
                </li>
              ))}
            </ol>
            <div className="rise mt-8" style={{ "--d": 480 } as CSSProperties}>
              <ProjectAction project={project} more={{ href, label: "How it works" }} />
            </div>
          </div>
        </div>
      </div>
    </Shot>
  );
}
