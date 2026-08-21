const steps = [
  {
    number: "01",
    title: "Capture",
    body: "The AD8232 module records ECG while you sleep. The ESP32 detects R-peaks and sends 30-second RR epochs.",
  },
  {
    number: "02",
    title: "Interpret",
    body: "The backend extracts HRV features and runs an ONNX model to estimate N2 probability and coarse sleep stage.",
  },
  {
    number: "03",
    title: "Respond",
    body: "When three consecutive N2 epochs appear inside your wake window, Somnus triggers the alarm.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line bg-surface py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm uppercase tracking-widest text-muted-ink">How it works</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Three steps from signal to wake decision.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="card">
              <span className="font-mono text-sm text-brand">{step.number}</span>
              <h3 className="mt-3 font-serif text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-ink">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
