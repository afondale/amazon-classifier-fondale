import { useMemo, useState } from "react";
import samplesJson from "@/data/samples.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Sample, Sentiment } from "@/lib/sentiment/types";
import { sentimentTone } from "@/lib/sentiment/tone";

const samples = samplesJson as Sample[];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "hit", label: "Match" },
  { id: "miss", label: "Miss" },
  { id: "negative", label: "Actual negative" },
  { id: "neutral", label: "Actual neutral" },
  { id: "positive", label: "Actual positive" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function Explorer() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return samples.filter((s) => {
      if (filter === "hit" && s.predicted !== s.actual) return false;
      if (filter === "miss" && s.predicted === s.actual) return false;
      if (
        (filter === "negative" || filter === "neutral" || filter === "positive") &&
        s.actual !== filter
      ) {
        return false;
      }
      if (!needle) return true;
      return (
        s.title.toLowerCase().includes(needle) || s.text.toLowerCase().includes(needle)
      );
    });
  }, [q, filter]);

  return (
    <section id="examples" className="scroll-mt-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Examples</p>
          <h3 className="mt-2 font-display text-xl text-fg sm:text-2xl">A few more from the rest of the file</h3>
          <p className="mt-1 max-w-xl text-sm text-muted">
            These were not in the 150. Open a row to read the review and why the model
            called it that way. “Actual” is the star class, used only to score.
          </p>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or body"
          className="sm:max-w-xs"
          aria-label="Search reviews"
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            type="button"
            size="sm"
            variant={filter === f.id ? "primary" : "quiet"}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {rows.length === 0 && (
          <li className="rounded-xl bg-elevated px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]">
            No reviews match.
          </li>
        )}
        {rows.map((s, i) => (
          <li key={`${s.title}-${i}`}>
            <details className="rounded-xl bg-elevated shadow-[var(--shadow-border)]">
              <summary className="flex list-none flex-wrap items-center gap-2 px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden">
                <Badge tone={sentimentTone(s.predicted as Sentiment)}>
                  Model {s.predicted}
                </Badge>
                <Badge tone={sentimentTone(s.actual as Sentiment)}>Actual {s.actual}</Badge>
                {s.predicted !== s.actual && <Badge>Miss</Badge>}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{s.title}</span>
              </summary>
              <div className="px-4 pb-4 sm:px-5">
                <p className="text-sm text-muted">{s.text}</p>
                <p className="mt-2 text-sm text-fg">{s.why}</p>
                <p className="mt-2 font-mono text-xs text-muted tabular-nums">
                  Negative {(s.p_negative * 100).toFixed(0)}% · Neutral{" "}
                  {(s.p_neutral * 100).toFixed(0)}% · Positive {(s.p_positive * 100).toFixed(0)}%
                </p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
