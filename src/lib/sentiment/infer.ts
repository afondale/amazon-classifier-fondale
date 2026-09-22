import modelJson from "@/data/model.json";
import { explainClassification } from "./explain";
import type { ClassifyResult, ModelJson, Sentiment } from "./types";
import { documentFrom } from "./clean";

const model = modelJson as unknown as ModelJson;

const indexByTerm = new Map<string, number>();
for (let i = 0; i < model.features.length; i++) {
  indexByTerm.set(model.features[i], i);
}

const TOKEN_RE = /[\p{L}\p{N}_]{2,}/gu;

function tokenize(doc: string): string[] {
  const s = model.lowercase ? doc.toLowerCase() : doc;
  return s.match(TOKEN_RE) ?? [];
}

function ngrams(tokens: string[]): string[] {
  const [minN, maxN] = model.ngram_range;
  const out: string[] = [];
  const n = tokens.length;
  for (let size = minN; size <= maxN; size++) {
    if (size === 1) {
      for (const t of tokens) out.push(t);
    } else {
      for (let i = 0; i <= n - size; i++) {
        out.push(tokens.slice(i, i + size).join(" "));
      }
    }
  }
  return out;
}

function softmax(logits: number[]): number[] {
  const m = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function classifyTitleText(title: string, text: string): ClassifyResult {
  const doc = documentFrom(title, text);
  const grams = ngrams(tokenize(doc));

  const tf = new Map<number, number>();
  for (const g of grams) {
    const idx = indexByTerm.get(g);
    if (idx === undefined) continue;
    tf.set(idx, (tf.get(idx) ?? 0) + 1);
  }

  let norm = 0;
  const weighted: { idx: number; v: number }[] = [];
  for (const [idx, count] of tf) {
    const v = count * model.idf[idx];
    weighted.push({ idx, v });
    norm += v * v;
  }
  const denom = Math.sqrt(norm);
  if (denom > 0) {
    for (const w of weighted) w.v /= denom;
  }

  const nClass = model.classes.length;
  const logits = model.intercept.slice();
  for (const w of weighted) {
    for (let k = 0; k < nClass; k++) {
      logits[k] += w.v * model.coef[k][w.idx];
    }
  }

  const probs = softmax(logits);
  let best = 0;
  for (let k = 1; k < nClass; k++) {
    if (probs[k] > probs[best]) best = k;
  }
  const sentiment = model.classes[best] as Sentiment;

  const contributors: { term: string; score: number }[] = [];
  for (const w of weighted) {
    contributors.push({
      term: model.features[w.idx],
      score: w.v * model.coef[best][w.idx],
    });
  }
  contributors.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

  const byName: Record<string, number> = {};
  model.classes.forEach((c, i) => {
    byName[c] = probs[i];
  });

  return {
    sentiment,
    pNegative: byName.negative ?? 0,
    pNeutral: byName.neutral ?? 0,
    pPositive: byName.positive ?? 0,
    contributors: contributors.slice(0, 8),
    explanation: explainClassification(sentiment, contributors),
  };
}
