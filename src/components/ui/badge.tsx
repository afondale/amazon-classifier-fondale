import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "pos" | "neg" | "neu" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tone === "neutral" && "bg-subtle text-muted",
        tone === "pos" && "bg-pos-dim text-pos",
        tone === "neg" && "bg-neg-dim text-neg",
        tone === "neu" && "bg-subtle text-accent",
        className,
      )}
      {...props}
    />
  );
}
