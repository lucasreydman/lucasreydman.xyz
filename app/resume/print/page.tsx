import type { Metadata } from "next";
import { profile } from "@/content/profile";
import "./sheet.css";
import { alsoBuilt, education, experience, honors, languages, schoolProject, skills } from "@/content/resume";

/*
  The résumé as one US Letter sheet. This is the source of the downloadable
  PDF: `tools/make-resume.mjs` opens this page in a headless browser and
  prints it to `public/resume/Lucas-Reydman-Resume.pdf`. Run it again whenever
  `content/resume.ts` changes.

  Sizes are in points and the sheet is drawn at its real size (8.5 by 11
  inches), so what is on screen here is what prints. It has to stay on one
  page: the tool fails if it runs to a second.

  Plain black on white with one hairline rule colour. No accent fills, because
  it will be printed on office printers and read by applicant tracking
  systems; the text is real text in reading order, with ordinary headings.
*/

export const metadata: Metadata = {
  title: `${profile.name}, Résumé`,
  robots: { index: false },
};

/* The roles that go on the sheet, and how many lines each gets. */
const SHEET_ROLES: Record<string, number> = {
  "FBI Basketball": 6,
  "RBC|May 2026 to August 2026": 3,
  "RBC|May 2025 to August 2025": 2,
  "Torinit Technologies": 1,
  "Mirabella Development Corporation": 1,
  Panther: 1,
};

/* The sheet gives FBI its full name, so nobody reads the initials as the bureau. */
const SHEET_ORG: Record<string, string> = { "FBI Basketball": "Fantasy Basketball International" };

const site = "lucasreydman.xyz";

export default function ResumePrint() {
  const roles = experience
    .map((role) => ({ role, lines: SHEET_ROLES[role.org] ?? SHEET_ROLES[`${role.org}|${role.period}`] }))
    .filter((r) => r.lines);

  return (
    <div className="resume-sheet-wrap">
      <article className="resume-sheet">
        <header>
          <h1>{profile.name}</h1>
          <p className="rs-contact">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span>·</span>
            <a href={`https://${site}`}>{site}</a>
            <span>·</span>
            <a href="https://github.com/lucasreydman">github.com/lucasreydman</a>
            <span>·</span>
            <a href="https://www.linkedin.com/in/lucasreydman">linkedin.com/in/lucasreydman</a>
            <span>·</span>
            {profile.location}, Ontario
          </p>
        </header>

        <section>
          <h2>Experience</h2>
          {roles.map(({ role, lines }) => (
            <div key={`${role.org}-${role.period}`} className="rs-role">
              <div className="rs-row">
                <h3>
                  {SHEET_ORG[role.org] ?? role.org}
                  <span>, {role.title}</span>
                </h3>
                <p className="rs-date">{role.period}</p>
              </div>
              <ul>
                {role.detail.slice(0, lines).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Projects</h2>
          <div className="rs-role">
            <div className="rs-row">
              <h3>
                {schoolProject.org}
                <span>, {schoolProject.title}</span>
              </h3>
              <p className="rs-date">{schoolProject.period}</p>
            </div>
            <ul>
              {schoolProject.detail.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <p className="rs-plain rs-also">
            <strong>
              More projects, each with its screens and a write-up at <a href={`https://${site}`}>{site}</a>:
            </strong>{" "}
            {alsoBuilt}
          </p>
        </section>

        <section>
          <h2>Education</h2>
          <div className="rs-row">
            <h3>
              {education.school}
              <span>, {education.degree}</span>
            </h3>
            <p className="rs-date">{education.expected}</p>
          </div>
          <p className="rs-plain">
            {education.stats[0].value} GPA. Sexton Scholar and Dean&apos;s List. {honors[0].what}. {languages}
          </p>
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="rs-skills">
            {/* Model is the web page's group: the sheet has no room for it. */}
            {skills
              .filter((group) => group.name !== "Model")
              .map((group) => (
                <div key={group.name}>
                  <dt>{group.name}</dt>
                  <dd>{group.items.join(", ")}</dd>
                </div>
              ))}
          </dl>
        </section>
      </article>
    </div>
  );
}
