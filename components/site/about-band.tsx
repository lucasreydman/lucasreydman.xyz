import Image from "next/image";
import { profile } from "@/content/profile";
import { noWidow } from "@/lib/text";

/** Who made the wall: a portrait, the plain facts, and four paragraphs in his own words. */
export function AboutBand() {
  return (
    <section id="about" className="border-t border-line bg-card">
      <div className="mx-auto grid w-full max-w-[1440px] gap-x-16 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[40px]">About</h2>
          <div className="mt-8 flex items-start gap-6">
            <Image
              src="/lucas.webp"
              alt="Lucas Reydman"
              width={1080}
              height={1080}
              sizes="160px"
              className="h-28 w-28 shrink-0 rounded-2xl object-cover object-top sm:h-40 sm:w-40"
            />
            <dl className="min-w-0 flex-1 border-t border-line">
              {profile.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 border-b border-line py-2">
                  <dt className="font-mono text-[11px] leading-5 text-muted">{f.label}</dt>
                  <dd className="text-right font-sans text-[14px] font-medium leading-5 text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="max-w-[64ch] space-y-5">
          {profile.about.map((para, i) => (
            <p
              key={para.slice(0, 32)}
              className={i === 0 ? "font-sans text-[19px] leading-8 text-ink" : "font-sans text-[16px] leading-7 text-secondary"}
            >
              {noWidow(para)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
