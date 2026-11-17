import { Arrow } from "@/components/site/arrow";
import { profile } from "@/content/profile";

/** The ask and the ways to reach him, on the site's dark band. */
export function SiteFooter() {
  return (
    <footer id="contact" data-noprint className="midnight">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-20 sm:px-6 sm:py-24">
        <h2 className="max-w-[22ch] font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
          {profile.contact.headline}
        </h2>
        <p className="mt-5 max-w-[52ch] font-sans text-[17px] leading-7 text-secondary">{profile.contact.body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="btn inline-flex h-11 items-center rounded-lg bg-accent px-5 font-sans text-[15px] font-semibold text-accent-ink hover:brightness-95"
          >
            {profile.email}
            <Arrow />
          </a>
          <a
            href={profile.resumePdf}
            download
            className="btn btn-line inline-flex h-11 items-center rounded-lg border border-line px-5 font-sans text-[15px] font-medium text-ink"
          >
            Download résumé
            <Arrow dir="down" />
          </a>
          {profile.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center rounded-lg px-3 font-sans text-[15px] font-medium text-secondary hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="mt-16 border-t border-line pt-6 font-mono text-[12px] leading-5 text-muted">
          {profile.name} · {profile.location} · 2026
        </p>
      </div>
    </footer>
  );
}
