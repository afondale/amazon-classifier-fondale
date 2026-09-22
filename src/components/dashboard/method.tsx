import metrics from "@/data/metrics.json";
import type { Metrics } from "@/lib/sentiment/types";

const m = metrics as Metrics;

const stars = [
  { star: "1", n: m.rating_counts["1"], used: "negative" },
  { star: "2", n: m.rating_counts["2"], used: "negative" },
  { star: "3", n: m.rating_counts["3"], used: "neutral" },
  { star: "4", n: m.rating_counts["4"], used: "positive" },
  { star: "5", n: m.rating_counts["5"], used: "positive" },
];
const maxStar = Math.max(...stars.map((s) => s.n));

export function Method() {
  return (
    <section>
      <h3 className="font-display text-xl text-fg sm:text-2xl">How the labels were made</h3>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {m.n_raw.toLocaleString()} gift-card reviews from Amazon Reviews 2023. The classifier
        is blind to everything except title and text. Stars become the answer key:
        1–2 negative, 3 neutral, 4–5 positive.
      </p>
      <ul className="mt-5 flex flex-col gap-2">
        {stars.map((s) => (
          <li key={s.star} className="grid grid-cols-[3rem_1fr_7.5rem] items-center gap-3">
            <span className="font-mono text-xs text-muted">{s.star} star</span>
            <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
              <div
                className={
                  s.used === "positive"
                    ? "h-full bg-pos"
                    : s.used === "negative"
                      ? "h-full bg-neg"
                      : "h-full bg-accent"
                }
                style={{ width: `${Number(((s.n / maxStar) * 100).toFixed(1))}%` }}
              />
            </div>
            <span className="text-right font-mono text-xs text-muted tabular-nums">
              {s.n.toLocaleString()} · {s.used}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted">
        {m.n_train.toLocaleString()} reviews trained the model. {m.n_batch_holdout} were
        set aside for the score above. Another {m.n_test.toLocaleString()} checked it on
        the real mix, which is almost all five-star reviews.
      </p>
    </section>
  );
}
