/*
  Makes the downloadable résumé.

    npm run build && npx next start -p 3210     (in one terminal)
    node tools/make-resume.mjs http://localhost:3210

  Prints `/resume/print` to `public/resume/Lucas-Reydman-Resume.pdf` with a
  headless Chrome or Edge already on the machine, so the site needs no extra
  dependency for it. Fails, and keeps the old file, if the sheet runs past one
  page: trim `content/resume.ts` or the role line counts in
  `app/resume/print/page.tsx` and run it again.

  Run it whenever `content/resume.ts` or the sheet changes, and commit the PDF.
*/
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = path.resolve("public/resume/Lucas-Reydman-Resume.pdf");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error("No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const dir = await mkdtemp(path.join(os.tmpdir(), "resume-"));
const tmp = path.join(dir, "resume.pdf");

try {
  execFileSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${path.join(dir, "profile")}`,
      /* Give the web fonts time to load before the page is printed. */
      "--virtual-time-budget=8000",
      `--print-to-pdf=${tmp}`,
      `${base}/resume/print`,
    ],
    { stdio: "ignore" },
  );

  const pdf = await readFile(tmp);
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? []).length;
  if (pages !== 1) {
    console.error(`The résumé is ${pages} pages. It has to be one. The existing PDF was left alone.`);
    process.exit(1);
  }
  await writeFile(out, pdf);
  console.log(`Wrote ${out} (${Math.round(pdf.length / 1024)} KB, 1 page) with ${path.basename(browser)}`);
} finally {
  await rm(dir, { recursive: true, force: true });
}
