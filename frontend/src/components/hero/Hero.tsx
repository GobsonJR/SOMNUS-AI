import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        <p className="mb-3 text-sm uppercase tracking-widest text-muted-ink">Sleep staging wearable</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Wake during light sleep, not deep sleep.
        </h1>
        <p className="mt-5 max-w-lg text-muted-ink">
          Somnus reads single-lead ECG, estimates N2 sleep stages, and triggers your alarm inside a window you choose.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/dashboard" className="button-primary">Open dashboard</Link>
          <a href="#how-it-works" className="button-secondary">How it works</a>
        </div>
      </div>

      <div
        className="flex aspect-square items-center justify-center rounded-large border border-line bg-surface"
        aria-hidden="true"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-32 w-32 rounded-full border border-line bg-canvas" />
          <p className="text-sm text-muted-ink">3D product scene</p>
          <p className="mt-1 text-xs text-muted-ink">Antigravity integration pending</p>
        </div>
      </div>
    </section>
  );
}
