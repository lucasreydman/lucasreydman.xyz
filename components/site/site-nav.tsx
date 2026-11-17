import Link from "next/link";
import { profile } from "@/content/profile";
import { Mark } from "./mark";

/**
 * The bar over every page of the site's own (not over a project's page, which
 * wears that project's brand and has its own way back).
 */
export function SiteNav() {
  return (
    <header data-noprint className="sticky top-0 z-40 border-b border-line bg-ground/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-[14px] font-bold tracking-[-0.01em] text-ink sm:text-[15px]">
          <Mark />
          {profile.name}
        </Link>
        <nav aria-label="Site" className="flex items-center gap-1 whitespace-nowrap font-sans text-[14px] font-medium">
          <Link href="/#work" className="hidden h-9 items-center rounded-lg px-3 text-secondary hover:bg-raised hover:text-ink sm:inline-flex">
            Work
          </Link>
          <Link href="/#experience" className="hidden h-9 items-center rounded-lg px-3 text-secondary hover:bg-raised hover:text-ink sm:inline-flex">
            Experience
          </Link>
          <Link href="/#about" className="hidden h-9 items-center rounded-lg px-3 text-secondary hover:bg-raised hover:text-ink md:inline-flex">
            About
          </Link>
          <Link href="/resume" className="inline-flex h-9 items-center rounded-lg px-3 text-secondary hover:bg-raised hover:text-ink">
            Résumé
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="btn ml-1 inline-flex h-9 items-center rounded-lg bg-ink px-3.5 text-ground sm:px-4 hover:bg-secondary"
          >
            Email me
          </a>
        </nav>
      </div>
    </header>
  );
}
