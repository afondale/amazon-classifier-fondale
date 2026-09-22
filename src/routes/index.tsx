import { createFileRoute } from "@tanstack/react-router";
import { BatchPanel } from "@/components/dashboard/batch-panel";
import { ConfusionPanel } from "@/components/dashboard/confusion";
import { Explorer } from "@/components/dashboard/explorer";
import { SiteHeader } from "@/components/dashboard/header";
import { HeroClassifier } from "@/components/dashboard/hero-classifier";
import { Method } from "@/components/dashboard/method";
import { MetricsStrip } from "@/components/dashboard/metrics-strip";
import { NgramPanel } from "@/components/dashboard/ngrams";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div id="top" className="min-h-dvh bg-bg text-fg">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-10 sm:px-8 sm:py-14">
        <section className="max-w-3xl">
          <p className="text-xs tracking-[0.22em] text-muted uppercase">Amazon Gift Cards · 2023</p>
          <h1 className="mt-3 font-display text-3xl italic text-fg sm:text-5xl">
            Positive, neutral, or negative — from the words alone.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">
            Paste a gift-card review. Foil reads the title and the body, then picks a
            class. The star rating is used only to check the answer afterward. It never
            goes into the model.
          </p>
        </section>
        <HeroClassifier />
        <BatchPanel />
        <Explorer />
        <section id="trained" className="scroll-mt-8">
          <details className="group">
            <summary className="list-none [&::-webkit-details-marker]:hidden">
              <p className="text-xs tracking-[0.2em] text-muted uppercase">More detail</p>
              <h2 className="mt-2 font-display text-2xl text-fg sm:text-3xl">How it was trained</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                How stars became labels, which words pull each class, and how the model
                did on the rest of the file — where almost every review is five stars.
              </p>
            </summary>
            <div className="mt-8 flex flex-col gap-8">
              <Method />
              <NgramPanel />
              <MetricsStrip />
              <ConfusionPanel />
            </div>
          </details>
        </section>
      </main>
      <footer className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-faint sm:px-8">
          Trained on Amazon gift-card reviews from 2023. Stars set the answer key.
          The model only sees title and text.
        </p>
      </footer>
    </div>
  );
}
