import metrics from "@/data/metrics.json";
import type { Metrics, Sentiment } from "@/lib/sentiment/types";
import { SENTIMENT_ORDER } from "@/lib/sentiment/types";
import { sentimentTextClass } from "@/lib/sentiment/tone";
import { cn } from "@/lib/utils";

const m = metrics as Metrics;
const c = m.test.confusion;

export function ConfusionPanel() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
        <h3 className="font-display text-xl text-fg">On the rest of the file</h3>
        <p className="mt-1 max-w-prose text-sm text-muted">
          Same three classes, but this set looks like the real catalog: mostly five stars.
          Rows are the actual class. Columns are what the model said.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[18rem] text-center text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="pb-2 pr-2 text-left font-medium">Actual</th>
                {SENTIMENT_ORDER.map((s) => (
                  <th key={s} className="pb-2 font-medium">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SENTIMENT_ORDER.map((gold) => (
                <tr key={gold}>
                  <th className="py-1.5 pr-2 text-left font-mono text-xs font-medium text-muted">
                    {gold}
                  </th>
                  {SENTIMENT_ORDER.map((pred) => {
                    const n = c[gold][pred];
                    const hit = gold === pred;
                    return (
                      <td key={pred} className="py-1.5">
                        <span
                          className={cn(
                            "inline-flex min-w-[2.75rem] justify-center rounded-md px-2 py-1 font-display text-xl tabular-nums",
                            hit ? sentimentTextClass(gold as Sentiment) : "text-fg",
                            hit ? "bg-subtle" : "",
                          )}
                        >
                          {n.toLocaleString()}
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
      <div className="rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
        <h3 className="font-display text-xl text-fg">Why that accuracy looks too good</h3>
        <p className="mt-2 text-sm text-muted">
          {m.n_positive.toLocaleString()} of {m.n_labeled.toLocaleString()} reviews are
          positive. A dummy that always says positive scores{" "}
          {(m.baseline_majority.accuracy * 100).toFixed(1)}% on the full file and 33.3% on
          the balanced batch. Neutral is 2.1% of the data — that is where the three-class
          model pays.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-muted">Neutral F1 (test)</dt>
            <dd className="font-mono text-lg tabular-nums">
              {(m.test.neutral.f1 * 100).toFixed(1)}%
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Neutral recall</dt>
            <dd className="font-mono text-lg tabular-nums">
              {(m.test.neutral.recall * 100).toFixed(1)}%
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Negative F1</dt>
            <dd className="font-mono text-lg tabular-nums">
              {(m.test.negative.f1 * 100).toFixed(1)}%
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Macro F1</dt>
            <dd className="font-mono text-lg tabular-nums">
              {(m.test.macro_f1 * 100).toFixed(1)}%
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
