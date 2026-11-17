import type { DepthItem, FeatureGroup } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Everything the product does, group by group. The group's name holds the left
 * column while its features run beside it, so a long list still reads as a few
 * named areas.
 */
export function Features({ groups, heading }: { groups: FeatureGroup[]; heading: string }) {
  return (
    <div className="border-t border-line">
      {groups.map((group) => (
        <section key={group.title} className="grid gap-x-12 gap-y-6 border-b border-line py-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className={cn("text-[22px] leading-[1.15] text-ink", heading)}>{group.title}</h3>
            {group.summary && <p className="mt-3 max-w-[36ch] font-sans text-[15px] leading-6 text-muted">{group.summary}</p>}
            <p className="mt-4 font-mono text-[11px] leading-4 text-muted">{group.items.length} features</p>
          </div>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-8">
            {group.items.map((item) => (
              <div key={item.name}>
                <dt className="font-sans text-[15px] font-semibold leading-6 text-ink">{item.name}</dt>
                <dd className="mt-1 font-sans text-[14px] leading-[22px] text-secondary">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

/** The work a user never sees, as a numbered ledger. */
export function Engineering({ items }: { items: DepthItem[] }) {
  return (
    <ol className="grid gap-x-12 border-t border-line md:grid-cols-2">
      {items.map((item, i) => (
        <li key={item.name} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-b border-line py-6">
          <span className="pt-1 font-mono text-[11px] leading-4 text-accent">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="font-sans text-[15px] font-semibold leading-6 text-ink">{item.name}</h3>
            <p className="mt-1 font-sans text-[14px] leading-[22px] text-secondary">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
