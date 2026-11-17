import { Shot } from "@/components/motion/scroll";
import { Words } from "@/components/motion/words";
import { AboutBand } from "@/components/site/about-band";
import { ExperienceBand } from "@/components/site/experience-band";
import { FbiChapter } from "@/components/site/fbi-chapter";
import { Hero } from "@/components/site/hero";
import { ProjectShot } from "@/components/site/project-shot";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

/*
  One scroll, in the order a reader needs it: who he is, the job he has now,
  the other things he has built, where he has worked, a little about him, and
  how to reach him. Each project is one shot; its own page holds the rest.
*/
export default function Home() {
  const rest = projects.filter((p) => p.brand !== "fbi");

  return (
    <>
      <SiteNav />
      <Hero />
      <FbiChapter />

      <Shot id="projects" className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32">
        <h2 className="max-w-[18ch] font-display text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[52px]">
          <Words text={profile.projectsLede.headline} />
        </h2>
        <p className="rise mt-5 max-w-[52ch] font-sans text-[17px] leading-7 text-secondary" style={{ ["--d" as string]: 300 }}>
          {profile.projectsLede.body}
        </p>
      </Shot>

      {rest.map((project, i) => (
        <ProjectShot key={project.brand} project={project} flip={i % 2 === 1} />
      ))}

      <ExperienceBand />
      <AboutBand />
      <SiteFooter />
    </>
  );
}
