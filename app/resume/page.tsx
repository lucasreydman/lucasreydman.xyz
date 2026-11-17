import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { certificates, earlier, education, experience, honors, languages, resumeProjects, schoolProject, skills, summary } from "@/content/resume";
import { roleAnchor } from "@/lib/text";

/*
  The résumé, to read on screen. The same content, set for one sheet of paper,
  is at `/resume/print`; the PDF behind the download button is made from that
  page by `tools/make-resume.mjs`.
*/

export const metadata: Metadata = {
  title: `Résumé, ${profile.name}`,
  description: "Experience, projects, education and skills. Software developer working in sports analytics and AI.",
  alternates: { canonical: "/resume" },
};

function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="underline decoration-line underline-offset-4 hover:decoration-ink">
      {children}
    </a>
  );
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display text-[20px] font-bold leading-6 tracking-[-0.01em] text-ink">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <>
      <SiteNav />
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <header className="enter grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div>
            <h1 className="font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[52px]">Résumé</h1>
            <p className="mt-5 max-w-[56ch] font-sans text-[17px] leading-7 text-secondary">{summary}</p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end lg:justify-end">
            <a
              href={profile.resumePdf}
              download
              className="inline-flex h-11 items-center gap-2.5 rounded-lg bg-accent px-5 font-sans text-[15px] font-semibold text-accent-ink hover:brightness-95 active:scale-[0.98]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download PDF
            </a>
            <p className="font-mono text-[11px] leading-[18px] text-muted lg:text-right">One page, letter size</p>
          </div>
        </header>

        <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div>
            <SectionTitle id="experience">Experience</SectionTitle>
            <ol className="mt-6 border-t border-line">
              {experience.map((role) => (
                <li key={`${role.org}-${role.period}`} id={roleAnchor(role)} className="border-b border-line py-8">
                  <div className="flex items-start gap-4">
                    {role.logo ? (
                      <Image src={role.logo} alt="" width={80} height={80} className="h-10 w-10 shrink-0 rounded-lg bg-white object-cover ring-1 ring-line" />
                    ) : (
                      <span className="h-10 w-10 shrink-0 rounded-lg bg-raised" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <h3 className="font-display text-[18px] font-bold leading-6 tracking-[-0.01em] text-ink">
                          {role.href ? <Out href={role.href}>{role.org}</Out> : role.org}
                        </h3>
                        <p className="font-mono text-[11px] leading-5 text-muted">{role.period}</p>
                      </div>
                      <p className="mt-0.5 font-sans text-[15px] font-medium leading-6 text-secondary">{role.title}</p>
                      <ul className="mt-4 space-y-2.5">
                        {role.detail.map((line) => (
                          <li key={line} className="relative pl-5 font-sans text-[15px] leading-[26px] text-secondary">
                            <span className="absolute left-0 top-[11px] h-1 w-1 rounded-full bg-accent ring-2 ring-accent" aria-hidden="true" />
                            {line}
                          </li>
                        ))}
                      </ul>
                      {role.project && (
                        <Link
                          href={`/work/${role.project}`}
                          className="mt-5 inline-flex h-9 items-center rounded-lg bg-raised px-3.5 font-sans text-[14px] font-medium text-ink hover:bg-ink hover:text-ground"
                        >
                          See the product and its engine
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <ul className="mt-8 space-y-4">
              {earlier.map((role) => (
                <li key={`${role.org}-${role.period}`}>
                  <p className="flex items-baseline justify-between gap-4">
                    <span className="font-sans text-[15px] font-semibold leading-6 text-ink">
                      {role.org}
                      <span className="font-normal text-secondary">, {role.title}</span>
                    </span>
                    <span className="font-mono text-[11px] leading-5 text-muted">{role.period}</span>
                  </p>
                  <p className="font-sans text-[15px] leading-6 text-secondary">{role.note}</p>
                </li>
              ))}
            </ul>

            <div className="mt-16">
              <SectionTitle id="projects">Projects</SectionTitle>
              <div className="mt-6 border-t border-line py-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-[18px] font-bold leading-6 tracking-[-0.01em] text-ink">
                    <Out href={schoolProject.href}>{schoolProject.org}</Out>
                  </h3>
                  <p className="font-mono text-[11px] leading-5 text-muted">{schoolProject.period}</p>
                </div>
                <p className="mt-0.5 font-sans text-[15px] font-medium leading-6 text-secondary">{schoolProject.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {schoolProject.detail.map((line) => (
                    <li key={line} className="relative pl-5 font-sans text-[15px] leading-[26px] text-secondary">
                      <span className="absolute left-0 top-[11px] h-1 w-1 rounded-full bg-accent ring-2 ring-accent" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="border-t border-line">
                {resumeProjects.map((item) => {
                  const project = projects.find((p) => p.brand === item.brand)!;
                  return (
                    <li key={item.brand} className="border-b border-line">
                      <Link href={`/work/${item.brand}`} className="group flex items-start gap-4 py-5">
                        <Image
                          src={project.icon}
                          alt=""
                          width={80}
                          height={80}
                          unoptimized={project.icon.endsWith(".svg")}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-line"
                        />
                        <span className="min-w-0">
                          <span className="font-display text-[16px] font-bold leading-6 tracking-[-0.01em] text-ink group-hover:underline group-hover:decoration-accent group-hover:decoration-2 group-hover:underline-offset-4">
                            {item.name}
                          </span>
                          <span className="ml-2.5 font-mono text-[11px] text-muted">{project.sport}</span>
                          <span className="mt-1 block font-sans text-[15px] leading-6 text-secondary">{item.line}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <aside className="space-y-12 lg:sticky lg:top-24 lg:self-start">
            <div>
              <SectionTitle id="education">Education</SectionTitle>
              <div className="mt-6 rounded-xl bg-card p-5 ring-1 ring-line">
                <div className="flex items-center gap-3">
                  <Image src={education.logo} alt="" width={72} height={72} className="h-9 w-9 rounded-lg bg-white object-cover ring-1 ring-line" />
                  <p className="font-display text-[15px] font-bold leading-5 text-ink">{education.school}</p>
                </div>
                <p className="mt-4 font-sans text-[15px] leading-6 text-secondary">{education.degree}</p>
                <p className="mt-1 font-mono text-[11px] leading-5 text-muted">
                  {education.period} · {education.location}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                  {education.stats.map((s) => (
                    <div key={s.label} className="rounded-lg bg-raised px-3 py-3">
                      <dd className="font-display text-[22px] font-bold leading-none text-ink">{s.value}</dd>
                      <dt className="mt-1.5 font-sans text-[12px] leading-4 text-muted">{s.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div>
              <SectionTitle id="skills">Skills</SectionTitle>
              <dl className="mt-6 space-y-5">
                {skills.map((group) => (
                  <div key={group.name}>
                    <dt className="font-sans text-[13px] font-semibold leading-5 text-ink">{group.name}</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="rounded-md bg-raised px-2 py-1 font-sans text-[13px] leading-4 text-secondary">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 font-sans text-[14px] leading-5 text-muted">{languages}</p>
            </div>

            <div>
              <SectionTitle id="honors">Honors and certificates</SectionTitle>
              <ul className="mt-6 space-y-3">
                {[...honors, ...certificates].map((h) => (
                  <li key={h.what}>
                    <p className="font-sans text-[15px] leading-6 text-ink">{h.href ? <Out href={h.href}>{h.what}</Out> : h.what}</p>
                    <p className="font-sans text-[13px] leading-5 text-muted">
                      {h.where}, {h.mark}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
