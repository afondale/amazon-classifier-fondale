import { useMemo, useState } from "react";
import batchJson from "@/data/batch150.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BatchFile, Sentiment } from "@/lib/sentiment/types";
import { SENTIMENT_ORDER } from "@/lib/sentiment/types";
import { sentimentBarClass, sentimentTone } from "@/lib/sentiment/tone";
import { cn } from "@/lib/utils";

const batch = batchJson as BatchFile;
const c = batch.overall.confusion;

const CLASS_FILTERS = ["all", "negative", "neutral", "positive"] as const;
const RESULT_FILTERS = [
  { id: "all", label: "All 150" },
  { id: "hit", label: "Match" },
  { id: "miss", label: "Miss" },
] as const;

function label(s: Sentiment) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function BatchPanel() {
  const [cls, setCls] = useState<(typeof CLASS_FILTERS)[number]>("all");
  const [result, setResult] = useState<(typeof RESULT_FILTERS)[number]["id"]>("miss");

  const rows = useMemo(() => {
    return batch.rows.filter((r) => {
      if (cls !== "all" && r.gold !== cls) return false;
      if (result === "hit" && !r.correct) return false;
      if (result === "miss" && r.correct) return false;
      return true;
    });
  }, [cls, result]);

  return (
    <section id="results" className="scroll-mt-8 flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Results</p>
        <h2 className="mt-2 font-display text-2xl text-fg sm:text-3xl">
          {batch.overall.correct} of 150, on reviews it never trained on.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Fifty reviews in each class, drawn once and set aside. 1–2 stars are negative,
          3 is neutral, 4–5 are positive. The model saw only the title and the body.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className="font-display text-4xl text-fg tabular-nums sm:text-5xl">
            {batch.overall.correct}
            <span className="text-muted"> / 150</span>
          </p>
          <p className="mt-1 text-sm text-muted">Correct calls. A guess of “always positive” would get 50.</p>
          <ul className="mt-5 flex flex-col gap-3">
            {SENTIMENT_ORDER.map((s) => {
              const row = batch.by_class[s];
              return (
                <li key={s} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3">
                  <span className="text-sm text-fg">{label(s)}</span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
                    <div
                      className={cn("h-full rounded-full", sentimentBarClass(s))}
                      style={{ width: `${Number((row.accuracy * 100).toFixed(1))}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-xs tabular-nums text-fg">
                    {row.correct}/{row.n}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Neutral is the hard one: {batch.by_class.neutral.correct} of 50. Most of those
            misses were called negative. Positive held at {batch.by_class.positive.correct} of 50.
          </p>
        </div>

        <div className="rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <h3 className="font-display text-xl text-fg">Where the misses went</h3>
          <p className="mt-1 text-xs text-muted">Rows are the actual class. Columns are what the model said.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[18rem] text-center text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="pb-2 pr-2 text-left font-medium">Actual</th>
                  {SENTIMENT_ORDER.map((s) => (
                    <th key={s} className="pb-2 font-medium">
                      {label(s)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SENTIMENT_ORDER.map((gold) => (
                  <tr key={gold}>
                    <th className="py-1.5 pr-2 text-left text-xs font-medium text-muted">
                      {label(gold)}
                    </th>
                    {SENTIMENT_ORDER.map((pred) => {
                      const n = c[gold][pred];
                      const hit = gold === pred;
                      return (
                        <td key={pred} className="py-1.5">
                          <span
                            className={cn(
                              "inline-flex min-w-[2.5rem] justify-center rounded-md px-2 py-1 font-display text-xl tabular-nums",
                              hit ? sentimentTextClassSafe(gold) : "text-fg",
                              hit ? "bg-subtle" : "",
                            )}
                          >
                            {n}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          {CLASS_FILTERS.map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={cls === s ? "primary" : "quiet"}
              onClick={() => setCls(s)}
            >
              {s === "all" ? "All classes" : label(s)}
            </Button>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {RESULT_FILTERS.map((f) => (
            <Button
              key={f.id}
              type="button"
              size="sm"
              variant={result === f.id ? "primary" : "quiet"}
              onClick={() => setResult(f.id)}
            >
              {f.label}
            </Button>
          ))}
          <span className="self-center text-xs text-muted tabular-nums">{rows.length} shown</span>
        </div>
        <ul className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <li key={`${r.rating}-${r.title}-${i}`}>
              <details className="group rounded-xl bg-elevated shadow-[var(--shadow-border)]">
                <summary className="flex list-none flex-wrap items-center gap-2 px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <Badge>{r.rating} star</Badge>
                  <Badge tone={sentimentTone(r.gold)}>Actual {label(r.gold)}</Badge>
                  <Badge tone={sentimentTone(r.predicted)}>Model {label(r.predicted)}</Badge>
                  {!r.correct && <Badge>Miss</Badge>}
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{r.title}</span>
                </summary>
                <div className="px-4 pb-4 sm:px-5">
                  <p className="text-sm text-muted">{r.text}</p>
                  <p className="mt-2 text-sm text-fg">{r.why}</p>
                  <p className="mt-2 font-mono text-xs text-muted tabular-nums">
                    Negative {(r.p_negative * 100).toFixed(0)}% · Neutral{" "}
                    {(r.p_neutral * 100).toFixed(0)}% · Positive {(r.p_positive * 100).toFixed(0)}%
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function sentimentTextClassSafe(s: Sentiment) {
  if (s === "positive") return "text-pos";
  if (s === "negative") return "text-neg";
  return "text-accent";
}
