import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { classifyTitleText } from "@/lib/sentiment/infer";
import { SENTIMENT_ORDER } from "@/lib/sentiment/types";
import { sentimentBarClass, sentimentTextClass } from "@/lib/sentiment/tone";
import { cn } from "@/lib/utils";

const PRESETS = [
  {
    label: "Declined card",
    title: "One Star",
    text: "Card did not work!!!! Was not activated. Do not order.",
  },
  {
    label: "Okay, I guess",
    title: "It's fine",
    text: "The card worked after a delay. Nothing special, nothing broken. Average gift.",
  },
  {
    label: "Perfect gift",
    title: "The perfect gift!",
    text: "Always the perfect gift. Arrives fast and they are thrilled.",
  },
  {
    label: "Balance missing",
    title: "Zero balance",
    text: "The gift card arrived with a $0 balance and customer service could not help.",
  },
];

export function HeroClassifier() {
  const [title, setTitle] = useState(PRESETS[1].title);
  const [text, setText] = useState(PRESETS[1].text);

  const result = useMemo(() => classifyTitleText(title, text), [title, text]);
  const probs = {
    negative: result.pNegative,
    neutral: result.pNeutral,
    positive: result.pPositive,
  };

  return (
    <section id="classify" className="scroll-mt-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex flex-col gap-5">
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Try a review</p>
          <h2 className="font-display text-2xl text-fg sm:text-3xl">
            Title and body in. A call comes out.
          </h2>
          <p className="max-w-xl text-sm text-muted">
            Type anything, or start from an example. Stars, buyer names, and purchase
            flags are not part of the call.
          </p>
          <div className="flex flex-col gap-3 rounded-2xl bg-elevated p-3 shadow-[var(--shadow-border)] sm:p-4">
            <label className="text-xs font-medium text-muted" htmlFor="review-title">
              Title
            </label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Review title"
              maxLength={180}
            />
            <label className="text-xs font-medium text-muted" htmlFor="review-text">
              Body
            </label>
            <Textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Review text"
              rows={6}
              maxLength={4000}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  type="button"
                  size="sm"
                  variant="quiet"
                  onClick={() => {
                    setTitle(p.title);
                    setText(p.text);
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
          <p className={cn("font-display text-4xl italic sm:text-5xl", sentimentTextClass(result.sentiment))}>
            {result.sentiment === "positive"
              ? "Positive"
              : result.sentiment === "negative"
                ? "Negative"
                : "Neutral"}
          </p>
          <ul className="flex flex-col gap-2">
            {SENTIMENT_ORDER.map((s) => (
              <li key={s}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span className="capitalize">{s}</span>
                  <span className="font-mono tabular-nums">{(probs[s] * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
                  <div
                    className={cn("h-full rounded-full", sentimentBarClass(s))}
                    style={{ width: `${Number((probs[s] * 100).toFixed(1))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-fg">{result.explanation}</p>
          <details className="group">
            <summary className="list-none text-sm text-muted underline-offset-4 hover:text-fg hover:underline [&::-webkit-details-marker]:hidden">
              Why this call
            </summary>
            <ul className="mt-3 flex flex-col gap-1.5">
              {result.contributors.length === 0 && (
                <li className="text-sm text-muted">None of these words were in the training vocabulary.</li>
              )}
              {result.contributors.map((c) => (
                <li
                  key={c.term}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="font-mono text-fg">{c.term}</span>
                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      c.score >= 0 ? "text-pos" : "text-neg",
                    )}
                  >
                    {c.score >= 0 ? "+" : ""}
                    {c.score.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}
