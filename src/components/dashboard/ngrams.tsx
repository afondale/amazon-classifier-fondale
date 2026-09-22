import metrics from "@/data/metrics.json";
import type { Metrics, Sentiment } from "@/lib/sentiment/types";
import { sentimentBarClass, sentimentTextClass } from "@/lib/sentiment/tone";
import { cn } from "@/lib/utils";

const m = metrics as Metrics;

function Column({
  title,
  items,
  sentiment,
}: {
  title: string;
  items: { term: string; weight: number }[];
  sentiment: Sentiment;
}) {
  const max = Math.max(...items.map((i) => Math.abs(i.weight)));
  return (
    <div className="rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
      <h3 className="font-display text-xl text-fg">{title}</h3>
      <p className="mt-1 text-xs text-muted">Words that pull this class up</p>
      <ul className="mt-4 flex flex-col gap-2">
        {items.slice(0, 12).map((it) => (
          <li key={it.term} className="grid grid-cols-[7.5rem_1fr_3.2rem] items-center gap-2">
            <span className="truncate font-mono text-xs text-fg">{it.term}</span>
            <div className="h-1 overflow-hidden rounded-full bg-subtle">
              <div
                className={cn("h-full rounded-full", sentimentBarClass(sentiment))}
                style={{ width: `${Number(((Math.abs(it.weight) / max) * 100).toFixed(1))}%` }}
              />
            </div>
            <span className={cn("text-right font-mono text-xs tabular-nums", sentimentTextClass(sentiment))}>
              {it.weight.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NgramPanel() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      <Column title="Pushes negative" items={m.top_features.negative} sentiment="negative" />
      <Column title="Pushes neutral" items={m.top_features.neutral} sentiment="neutral" />
      <Column title="Pushes positive" items={m.top_features.positive} sentiment="positive" />
    </section>
  );
}
