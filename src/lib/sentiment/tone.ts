import type { Sentiment } from "./types";

export function sentimentTone(s: Sentiment): "pos" | "neg" | "neu" {
  if (s === "positive") return "pos";
  if (s === "negative") return "neg";
  return "neu";
}

export function sentimentBarClass(s: Sentiment): string {
  if (s === "positive") return "bg-pos";
  if (s === "negative") return "bg-neg";
  return "bg-accent";
}

export function sentimentTextClass(s: Sentiment): string {
  if (s === "positive") return "text-pos";
  if (s === "negative") return "text-neg";
  return "text-accent";
}
