import { type CSSProperties, ViewTransition } from "react";
import Link from "next/link";
import { Shot } from "@/components/motion/scroll";
import { Stage } from "@/components/motion/stage";
import { Words } from "@/components/motion/words";
import { Arrow } from "@/components/site/arrow";
import { Wordmark } from "@/components/site/wordmark";
import { SURFACES } from "@/components/surfaces";
import { projectByBrand } from "@/content/projects";
import { experience, fbiChapterLines } from "@/content/resume";
import { fbiChapter, fbiClose } from "@/content/scroll";
import { noWidow } from "@/lib/text";

/*
  FBI Basketball, the current job, as a chapter of the page.

  It opens by saying what FBI is and what he does there, in words, before any
  screen. Then a stage holds while the scroll steps through four screens, each
  with what it is for and what is particular about it (`Stage`, which explains
  what keeps a held stage from feeling stuck). It closes on the engine
  everything comes from and how access is sold.
*/

const screen = (id: string) => SURFACES.fbi.find((s) => s.id === id)!;
const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

export function FbiChapter() {
  const project = projectByBrand("fbi")!;
  const { study } = project;
  const role = experience.find((r) => r.project === "fbi");
  const engine = screen(fbiClose.engine.surface);
  const cards = screen(fbiClose.cards.surface);
  const Engine = engine.tile;
  const Cards = cards.tile;

  return (
    <div id="work" className="brand b-fbi bg-ground">
      <Shot className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="rise text-[18px] text-ink sm:text-[24px]" aria-hidden="true">
          <ViewTransition name="mark-fbi">
            <div className="w-fit">
              <Wordmark brand="fbi" />
            </div>
          </ViewTransition>
        </div>
        <h2 className="sr-only">{project.name}</h2>
        {role && (
          <p className="rise mt-5 font-mono text-[12px] leading-5 text-muted" style={delay(80)}>
            {role.title} · {role.period}
          </p>
        )}

        <p className="mt-10 max-w-[28ch] font-display text-[34px] leading-[1.02] tracking-[0.01em] text-ink sm:text-[52px] lg:text-[60px]">
          <Words text={study.deck.replace(/\.$/, "")} />
        </p>

        <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="rise max-w-[62ch] space-y-5" style={delay(250)}>
            {study.intro.map((para, i) => (
              <p
                key={para.slice(0, 32)}
                className={i === 0 ? "font-sans text-[19px] leading-8 text-ink" : "font-sans text-[16px] leading-7 text-secondary"}
              >
                {noWidow(para)}
              </p>
            ))}
          </div>

          {role && (
            <div className="rise" style={delay(350)}>
              <h3 className="font-display text-[22px] leading-none tracking-[0.02em] text-accent">WHAT I DO THERE</h3>
              <ul className="mt-5 border-t border-line">
                {fbiChapterLines.map((line) => (
                  <li key={line} className="border-b border-line py-4 font-sans text-[15px] leading-6 text-secondary">
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/work/fbi"
                  className="btn inline-flex h-11 items-center rounded-md bg-accent px-5 font-sans text-[15px] font-semibold text-accent-ink hover:brightness-95"
                >
                  Everything it does
                  <Arrow />
                </Link>
                {study.href && (
                  <a
                    href={study.href}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-line inline-flex h-11 items-center rounded-md border border-line px-5 font-sans text-[15px] font-medium text-ink"
                  >
                    {study.hrefLabel ?? "Visit"}
                    <Arrow dir="out" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </Shot>

      <Stage
        label="FBI Basketball, screen by screen"
        steps={fbiChapter.map((row, k) => (
          <div key={row.surface} className="lg:border-b lg:border-line lg:py-5">
            {/* On a desk every title shows and the active one opens. On a phone only the active step shows. */}
            <h3 className="font-display text-[24px] leading-[1.05] tracking-[0.01em] text-muted transition-colors duration-300 group-data-[active=true]/step:text-ink max-lg:opacity-0 max-lg:transition-opacity max-lg:group-data-[active=true]/step:opacity-100 sm:text-[30px] lg:text-[26px] xl:text-[30px]">
              <span className="mb-1.5 block font-mono text-[11px] leading-none tracking-normal text-accent">
                {String(k + 1).padStart(2, "0")} / {String(fbiChapter.length).padStart(2, "0")}
              </span>
              {row.title}
            </h3>
            <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-out group-data-[active=true]/step:grid-rows-[1fr] group-data-[active=true]/step:opacity-100">
              <div className="overflow-hidden">
                <p className="mt-3 max-w-[46ch] font-sans text-[14px] leading-[22px] text-secondary sm:text-[16px] sm:leading-7">{row.body}</p>
                <ul className="mt-4 hidden max-w-[46ch] space-y-2 lg:block">
                  {row.points.map((point) => (
                    <li key={point} className="flex gap-3 font-sans text-[14px] leading-[22px] text-ink">
                      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        screens={fbiChapter.map((row) => {
          const s = screen(row.surface);
          const Full = s.full ?? s.tile;
          const Tile = s.tile;
          return (
            <div key={row.surface}>
              <div className="hidden lg:block">
                <Full />
              </div>
              <div className="mx-auto max-w-[460px] lg:hidden">
                <Tile />
              </div>
            </div>
          );
        })}
      />

      <Shot className="border-t border-line">
        <div className="mx-auto grid w-full max-w-[1320px] gap-x-16 gap-y-16 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
          {[
            { copy: fbiClose.engine, Screen: Engine, list: study.steps.map((step) => step.title) },
            { copy: fbiClose.cards, Screen: Cards, list: [] as string[] },
          ].map(({ copy, Screen, list }, i) => (
            <div key={copy.title}>
              <h3 className="max-w-[16ch] font-display text-[28px] leading-[1.02] tracking-[0.01em] text-ink sm:text-[36px]">
                <Words text={copy.title} />
              </h3>
              <p className="rise mt-4 max-w-[52ch] font-sans text-[16px] leading-7 text-secondary" style={delay(200)}>
                {copy.body}
              </p>
              {list.length > 0 && (
                <ol className="rise mt-6 grid max-w-[52ch] grid-cols-2 gap-x-8 border-t border-line" style={delay(260)}>
                  {list.map((title, n) => (
                    <li key={title} className="flex items-baseline gap-3 border-b border-line py-2.5">
                      <span className="font-mono text-[11px] text-accent">{String(n + 1).padStart(2, "0")}</span>
                      <span className="font-sans text-[14px] leading-5 text-ink">{title}</span>
                    </li>
                  ))}
                </ol>
              )}
              <div className="rise mt-8 max-w-[440px]" style={delay(320 + i * 80)}>
                <Link
                  href="/work/fbi"
                  aria-label={`FBI Basketball: ${copy.title}`}
                  className="lift block overflow-hidden rounded-xl border border-line shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
                >
                  <Screen />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Shot>
    </div>
  );
}
