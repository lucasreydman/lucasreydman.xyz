import type { CSSProperties } from "react";
import Link from "next/link";
import { Words } from "@/components/motion/words";
import { Arrow } from "@/components/site/arrow";
import { HeroFigure } from "@/components/site/hero-figure";
import { profile } from "@/content/profile";

/*
  The opening shot. One sentence, what he does now, the two actions, and him:
  his portrait, which arrives as plotted dots and then as itself (`hero-figure.tsx`). On a phone the
  words come first and he follows.
*/

export function Hero() {
  const { hero } = profile;
  return (
    <header id="top" className="opening mx-auto grid w-full max-w-[1440px] items-center gap-x-12 gap-y-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:min-h-[calc(100svh-3.5rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:pb-24 xl:gap-x-20">
      <div>
        <h1 id="hero-title" className="max-w-[15ch] font-display text-[38px] font-bold leading-[1.02] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[46px] xl:text-[58px] 2xl:text-[68px]">
          <Words text={hero.headline} />
        </h1>
        <p className="rise mt-7 max-w-[46ch] font-sans text-[17px] leading-7 text-secondary sm:text-[19px] sm:leading-8" style={{ "--d": 450 } as CSSProperties}>
          {hero.sub}
        </p>
        <div className="rise mt-9 flex flex-wrap gap-3" style={{ "--d": 600 } as CSSProperties}>
          <a
            href={profile.resumePdf}
            download
            className="btn inline-flex h-12 items-center rounded-lg bg-accent px-6 font-sans text-[15px] font-semibold text-accent-ink hover:brightness-95"
          >
            Download résumé
            <Arrow dir="down" />
          </a>
          <Link
            href="/#work"
            className="btn inline-flex h-12 items-center rounded-lg bg-ink px-6 font-sans text-[15px] font-medium text-ground hover:bg-secondary"
          >
            See the work
            <Arrow dir="down" />
          </Link>
        </div>
      </div>
      <HeroFigure />
    </header>
  );
}
