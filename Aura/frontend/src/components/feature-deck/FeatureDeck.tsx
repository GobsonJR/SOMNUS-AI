import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Epoch telemetry",
    body: "RR intervals arrive every 30 seconds with signal quality metadata for reliable staging.",
  },
  {
    number: "02",
    title: "Smart wake window",
    body: "Set a deadline and earliest wake time. Somnus searches for sustained N2 inside that range.",
  },
  {
    number: "03",
    title: "Live hypnogram",
    body: "The dashboard shows stage probability, RMSSD, and a rolling timeline for the night.",
  },
];

export default function FeatureDeck() {
  const trackRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          const idx = Number(visible.target.dataset.index ?? 0);
          setActiveIndex(idx);
        }
      },
      { root: track.parentElement, threshold: [0.5, 0.75] }
    );

    track.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const el = trackRef.current?.querySelector(`[data-index="${index}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section id="product" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm uppercase tracking-widest text-muted-ink">What it does</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Three parts of the experience.</h2>
      </div>

      <div className="mt-10 overflow-x-auto scroll-smooth [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ol ref={trackRef} className="flex gap-6 px-6 pb-4 md:px-[max(24px,calc((100vw-1200px)/2))]">
          {features.map((feature, index) => (
            <li
              key={feature.number}
              data-index={index}
              data-active={activeIndex === index}
              className="w-[min(78vw,720px)] shrink-0 scroll-ml-6 scroll-snap-align-center rounded-medium border border-line bg-surface p-8 transition duration-[220ms] data-[active=false]:scale-[0.97] data-[active=false]:opacity-55 data-[active=true]:scale-100 data-[active=true]:opacity-100"
            >
              <span className="font-mono text-sm text-brand">{feature.number}</span>
              <h3 className="mt-3 font-serif text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-4 text-muted-ink">{feature.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl items-center gap-3 px-6">
        <button type="button" className="button-secondary" onClick={() => goTo(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0}>
          Previous
        </button>
        <button type="button" className="button-secondary" onClick={() => goTo(Math.min(2, activeIndex + 1))} disabled={activeIndex === 2}>
          Next
        </button>
      </div>
    </section>
  );
}
