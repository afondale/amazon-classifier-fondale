import metrics from "@/data/metrics.json";
import type { Metrics } from "@/lib/sentiment/types";

const m = metrics as Metrics;

function fmt(n: number, digits = 0) {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export function MetricsStrip() {
  const items = [
    { label: "Accuracy on the rest", value: pct(m.test.accuracy), note: `always-positive would score ${pct(m.baseline_majority.accuracy)}` },
    { label: "Even score across classes", value: pct(m.test.macro_f1), note: "average of the three class scores" },
    { label: "Neutral score", value: pct(m.test.neutral.f1), note: "3-star reviews, about 2% of the file" },
    { label: "Reviews in this check", value: fmt(m.test.n), note: "after the 150 were set aside" },
  ];

  return (
    <section id="model" className="scroll-mt-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border shadow-[var(--shadow-border)] sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="bg-elevated px-4 py-5 sm:px-5">
            <p className="text-xs tracking-[0.14em] text-muted uppercase">{it.label}</p>
            <p className="mt-2 font-display text-2xl text-fg tabular-nums sm:text-3xl">{it.value}</p>
            <p className="mt-1 text-xs text-faint">{it.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
