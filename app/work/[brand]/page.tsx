import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Arrow } from "@/components/site/arrow";
import { Engineering, Features } from "@/components/site/depth";
import { Method } from "@/components/site/method";
import { ProjectAction } from "@/components/site/project-action";
import { HEADING, Wordmark } from "@/components/site/wordmark";
import { SURFACES } from "@/components/surfaces";
import { DEPTH } from "@/content/depth";
import { profile } from "@/content/profile";
import { projectByBrand, projects } from "@/content/projects";
import { noWidow } from "@/lib/text";
import { cn } from "@/lib/utils";

/*
  A project's own page. Everything inside the wrapper sits in that project's
  brand scope, so the page is set in its typefaces and colours, opens on its
  real logo, shows its screens large, and then explains how it works.
*/

export function generateStaticParams() {
  return projects.map((p) => ({ brand: p.brand }));
}

export async function generateMetadata({ params }: PageProps<"/work/[brand]">): Promise<Metadata> {
  const { brand } = await params;
  const project = projectByBrand(brand);
  if (!project) return {};
  return {
    title: `${project.name}, by ${profile.name}`,
    description: project.study.deck,
    alternates: { canonical: `/work/${project.brand}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[brand]">) {
  const { brand } = await params;
  const project = projectByBrand(brand);
  if (!project) notFound();

  const { study } = project;
  const surfaces = SURFACES[project.brand];
  const depth = DEPTH[project.brand];
  const featureCount = depth.features.reduce((n, g) => n + g.items.length, 0);
  const wide = surfaces.filter((s) => s.full);
  const narrow = surfaces.filter((s) => !s.full);
  const heading = HEADING[project.brand];
  const at = projects.indexOf(project);
  const next = projects[(at + 1) % projects.length];

  return (
    <div className={cn("brand min-h-screen bg-ground", `b-${project.brand}`)}>
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link href="/#work" className="inline-flex h-9 items-center gap-2 rounded-lg pr-3 font-sans text-[14px] font-medium text-secondary hover:text-ink">
          <span aria-hidden="true">←</span> All work
        </Link>
        <Link href="/" className="font-sans text-[14px] font-medium text-secondary hover:text-ink">
          {profile.name}
        </Link>
      </div>

      <header className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        {/* The wordmark arrives from the home page's panel, so it is not part of the block that fades up. */}
        <div className="text-[20px] text-ink sm:text-[28px]" aria-hidden="true">
          <ViewTransition name={`mark-${project.brand}`}>
            <div className="w-fit">
              <Wordmark brand={project.brand} />
            </div>
          </ViewTransition>
        </div>
        <h1 className="sr-only">{project.name}</h1>
        <div className="enter">
        <p className="mt-10 max-w-[26ch] font-sans text-[26px] font-medium leading-[1.2] tracking-[-0.01em] text-ink sm:text-[36px]">
          {study.deck.replace(/\.$/, "")}
        </p>

        <div className="mt-12 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div className="max-w-[64ch] space-y-5">
            {study.intro.map((para) => (
              <p key={para.slice(0, 32)} className="font-sans text-[16px] leading-7 text-secondary">
                {noWidow(para)}
              </p>
            ))}
          </div>
          <div>
            <p className="font-mono text-[11px] leading-4 text-muted">Built with</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {study.stack.map((item) => (
                <li key={item} className="rounded-md border border-line bg-card px-2.5 py-1 font-sans text-[13px] leading-5 text-secondary">
                  {item}
                </li>
              ))}
            </ul>
            {project.action && (
              <div className="mt-8">
                <ProjectAction project={project} />
              </div>
            )}
            {study.href && (
              <a
                href={study.href}
                target="_blank"
                rel="noopener"
                className={cn(
                  "btn inline-flex h-11 items-center rounded-lg px-5 font-sans text-[15px]",
                  project.action
                    ? "btn-line mt-4 border border-line font-medium text-ink"
                    : "mt-8 bg-accent font-semibold text-accent-ink hover:brightness-95",
                )}
              >
                {study.hrefLabel ?? "Visit"}
                <Arrow dir="out" />
              </a>
            )}
          </div>
        </div>
        </div>
      </header>

      <section aria-labelledby="screens" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="screens" className={cn("text-[28px] leading-[1.1] text-ink sm:text-[36px]", heading)}>
            The screens
          </h2>
          <p className="mt-3 max-w-[60ch] font-sans text-[15px] leading-6 text-muted">
            Redrawn for this site from the real product, in its own type and colours, with sample data.
          </p>

          <div className="mt-10 space-y-14">
            {wide.map((s) => {
              const Screen = s.full!;
              const Narrow = s.tile;
              return (
                <figure key={s.id}>
                  {/* A wide screen shrunk to a phone is unreadable, so a phone gets the one-column version. */}
                  <div className="hidden overflow-hidden rounded-xl ring-1 ring-line lg:block">
                    <Screen />
                  </div>
                  <div className="mx-auto max-w-[440px] overflow-hidden rounded-xl ring-1 ring-line lg:hidden">
                    <Narrow />
                  </div>
                  <figcaption className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-[12rem_minmax(0,1fr)]">
                    <span className="font-sans text-[15px] font-semibold leading-6 text-ink">{s.title}</span>
                    <span className="max-w-[68ch] font-sans text-[15px] leading-6 text-secondary">{s.caption}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {narrow.length > 0 && (
            <div className={cn("columns-1 gap-6 sm:columns-2 lg:columns-3", wide.length > 0 && "mt-14")}>
              {narrow.map((s) => {
                const Screen = s.tile;
                return (
                  <figure key={s.id} className="mb-8 break-inside-avoid">
                    <div className="overflow-hidden rounded-xl ring-1 ring-line">
                      <Screen />
                    </div>
                    <figcaption className="mt-3">
                      <span className="block font-sans text-[15px] font-semibold leading-6 text-ink">{s.title}</span>
                      <span className="mt-1 block font-sans text-[14px] leading-[22px] text-secondary">{s.caption}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="features" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="features" className={cn("text-[28px] leading-[1.1] text-ink sm:text-[36px]", heading)}>
            Everything it does
          </h2>
          <p className="mt-3 max-w-[60ch] font-sans text-[15px] leading-6 text-muted">
            {featureCount} features in {depth.features.length} areas, written from the code.
          </p>
          <div className="mt-8">
            <Features groups={depth.features} heading={heading} />
          </div>
        </div>
      </section>

      <section aria-labelledby="method" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="method" className={cn("text-[28px] leading-[1.1] text-ink sm:text-[36px]", heading)}>
            The math
          </h2>
          <p className="mt-3 max-w-[60ch] font-sans text-[15px] leading-6 text-muted">
            The formulas are the ones the code runs, and each chart is computed from them.
          </p>
          <div className="mt-8">
            <Method steps={study.steps} heading={heading} />
          </div>
        </div>
      </section>

      <section aria-labelledby="engineering" className="border-t border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="engineering" className={cn("text-[28px] leading-[1.1] text-ink sm:text-[36px]", heading)}>
            Under the hood
          </h2>
          <p className="mt-3 max-w-[60ch] font-sans text-[15px] leading-6 text-muted">The work nobody using it sees.</p>
          <div className="mt-8">
            <Engineering items={depth.engineering} />
          </div>
        </div>
      </section>

      <nav aria-label="More work" className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[15px] font-medium text-secondary">
            <Link href="/#work" className="hover:text-ink">
              <span aria-hidden="true">←</span> All work
            </Link>
            <Link href="/resume" className="hover:text-ink">
              Résumé
            </Link>
            <a href={`mailto:${profile.email}`} className="hover:text-ink">
              {profile.email}
            </a>
          </div>
          <Link href={`/work/${next.brand}`} className="group flex items-center gap-3 font-sans text-[15px] font-medium text-ink">
            <span className="text-muted">Next</span>
            <Image src={next.icon} alt="" width={48} height={48} unoptimized={next.icon.endsWith(".svg")} className="h-7 w-7 rounded-full object-cover" />
            <span className="underline decoration-line underline-offset-4 group-hover:decoration-ink">{next.name}</span>
            <Arrow />
          </Link>
        </div>
      </nav>
    </div>
  );
}
