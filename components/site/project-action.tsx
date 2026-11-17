import Link from "next/link";
import { Arrow } from "@/components/site/arrow";
import { profile } from "@/content/profile";
import type { Project } from "@/content/projects";

/*
  What a reader can do about a project: open the free tool, email about having
  one built, or learn that it is not out yet. The words are in
  `content/projects.ts`.

  One accent button per project. It is the action when there is one. A project
  that is coming soon has nowhere to send anyone, so on the home page the
  accent goes to its own page instead and the status is a plain line.

  `more` is the link to the project's page, passed by the home page only.
*/

const primary =
  "btn inline-flex h-11 items-center rounded-lg bg-accent px-5 font-sans text-[15px] font-semibold text-accent-ink hover:brightness-95";
const secondary =
  "btn btn-line inline-flex h-11 items-center rounded-lg border border-line px-5 font-sans text-[15px] font-medium text-ink";

export function ProjectAction({ project, more }: { project: Project; more?: { href: string; label: string } }) {
  const { action } = project;
  if (!action) return null;
  const soon = action.kind === "soon";

  return (
    <div>
      {(!soon || more) && (
        <div className="flex flex-wrap gap-3">
          {action.kind === "open" && (
            <a href={action.href} target="_blank" rel="noopener" className={primary}>
              {action.label}
              <Arrow dir="out" />
            </a>
          )}
          {action.kind === "ask" && (
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent(action.subject)}`} className={primary}>
              {action.label}
              <Arrow />
            </a>
          )}
          {more && (
            <Link href={more.href} className={soon ? primary : secondary}>
              {more.label}
              <Arrow />
            </Link>
          )}
        </div>
      )}
      <p className={`max-w-[46ch] font-sans text-[14px] leading-[22px] text-secondary ${!soon || more ? "mt-4" : ""}`}>
        {soon && <span className="font-semibold text-ink">Coming soon. </span>}
        {action.note}
      </p>
    </div>
  );
}
