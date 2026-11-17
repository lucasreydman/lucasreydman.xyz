import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/site/arrow";
import { profile } from "@/content/profile";
import { education, experience } from "@/content/resume";
import { roleAnchor } from "@/lib/text";

/**
 * The jobs, under the wall. The wall shows what he built; this says where he
 * has worked and as what, and hands over the résumé. FBI Basketball is both,
 * so its row links to its project page.
 */
export function ExperienceBand() {
  return (
    <section id="experience" className="border-t border-line">
      <div className="mx-auto grid w-full max-w-[1440px] gap-x-16 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[40px]">Experience</h2>
          <p className="mt-5 max-w-[44ch] font-sans text-[17px] leading-7 text-secondary">{profile.experienceLede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.resumePdf}
              download
              className="btn inline-flex h-11 items-center rounded-lg bg-accent px-5 font-sans text-[15px] font-semibold text-accent-ink hover:brightness-95"
            >
              Download résumé
              <Arrow dir="down" />
            </a>
            <Link
              href="/resume"
              className="btn btn-line inline-flex h-11 items-center rounded-lg border border-transparent bg-raised px-5 font-sans text-[15px] font-medium text-ink"
            >
              Read it here
              <Arrow />
            </Link>
          </div>
          <p className="mt-8 font-mono text-[11px] leading-[18px] text-muted">
            {education.school} · {education.degree} · {education.period}
          </p>
        </div>

        <ol className="border-t border-line">
          {experience.map((role) => {
            const href = role.project ? `/work/${role.project}` : `/resume#${roleAnchor(role)}`;
            return (
              <li key={`${role.org}-${role.period}`} className="border-b border-line">
                <Link
                  href={href}
                  className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-4 py-5 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto]"
                >
                  {role.logo ? (
                    <Image src={role.logo} alt="" width={72} height={72} className="h-9 w-9 rounded-lg bg-white object-cover ring-1 ring-line" />
                  ) : (
                    <span className="h-9 w-9 rounded-lg bg-raised" />
                  )}
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="font-display text-[17px] font-bold leading-6 tracking-[-0.01em] text-ink group-hover:underline group-hover:decoration-accent group-hover:decoration-2 group-hover:underline-offset-4">
                        {role.org}
                      </span>
                      <span className="row-arrow text-[15px] text-ink">
                        <Arrow />
                      </span>
                      {role.current && (
                        <span className="rounded-full bg-accent px-2 py-0.5 font-sans text-[11px] font-semibold leading-4 text-accent-ink">Now</span>
                      )}
                    </span>
                    <span className="mt-0.5 block font-sans text-[15px] leading-6 text-secondary">{role.title}</span>
                    <span className="mt-1 block font-mono text-[11px] leading-5 text-muted sm:hidden">{role.period}</span>
                  </span>
                  <span className="hidden pt-1 font-mono text-[11px] leading-5 text-muted sm:block">{role.period}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
