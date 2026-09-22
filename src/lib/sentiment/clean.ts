const BR_RE = /<br\s*\/?>/gi;
const TAG_RE = /<[^>]+>/g;
const WS_RE = /\s+/g;

/** Same HTML/whitespace cleanup used when the model was trained. */
export function cleanText(raw: string): string {
  let s = raw ?? "";
  s = s.replace(/&nbsp;/gi, " ");
  s = s.replace(/&/gi, "&");
  s = s.replace(/"/gi, '"');
  s = s.replace(/&#34;/gi, '"');
  s = s.replace(/&#39;/gi, "'");
  s = s.replace(/'/gi, "'");
  s = s.replace(/</gi, "<");
  s = s.replace(/>/gi, ">");
  s = s.replace(BR_RE, " ");
  s = s.replace(TAG_RE, " ");
  // Numeric and named entities remaining
  s = s.replace(/&#(\d+);/g, (_, n: string) => {
    const code = Number(n);
    return Number.isFinite(code) ? String.fromCodePoint(code) : "";
  });
  return s.replace(WS_RE, " ").trim();
}

export function documentFrom(title: string, text: string): string {
  return `${cleanText(title)} ${cleanText(text)}`.trim();
}
