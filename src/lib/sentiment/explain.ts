import type { Sentiment } from "./types";

function quotedList(terms: string[]): string {
  const q = terms.map((t) => `"${t}"`);
  if (q.length === 1) return q[0];
  if (q.length === 2) return `${q[0]} and ${q[1]}`;
  return `${q.slice(0, -1).join(", ")}, and ${q[q.length - 1]}`;
}

/** One sentence from the n-grams that actually moved the logit. */
export function explainClassification(
  sentiment: Sentiment,
  contributors: { term: string; score: number }[],
): string {
  const support = contributors
    .filter((c) => (sentiment === "positive" ? c.score > 0 : c.score < 0))
    .slice(0, 3)
    .map((c) => c.term);
  const contrary = contributors
    .filter((c) => (sentiment === "positive" ? c.score < 0 : c.score > 0))
    .slice(0, 2)
    .map((c) => c.term);

  if (support.length === 0 && contrary.length === 0) {
    return `Called ${sentiment} from a thin overlap with the training vocabulary.`;
  }
  if (support.length === 0) {
    return `Called ${sentiment} even though ${quotedList(contrary)} pointed the other way — the rest of the mix still won.`;
  }
  const head = `Called ${sentiment} because ${quotedList(support)} carried the score`;
  if (contrary.length === 0) return `${head}.`;
  return `${head}, despite ${quotedList(contrary)}.`;
}
