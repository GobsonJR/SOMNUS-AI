import { useCloudNavigate } from "./CloudTunnelTransition";
import { ArrowRight, Activity, Cpu, Heart, Waves, Zap } from "lucide-react";
import LogoLoop, { LogoItem } from "../reactbits/LogoLoop";
import CursorGrid from "../reactbits/CursorGrid";

interface FocusedLandingProps {
  onGetStarted?: () => void;
}

export default function FocusedLanding({ onGetStarted }: FocusedLandingProps) {
  const { navigateWithClouds } = useCloudNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigateWithClouds("/dashboard");
    }
  };

  // Hardware & Biometric Pipeline items in Mountain Cool palette
  const telemetryLogos: LogoItem[] = [
    {
      node: (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill bg-surface/90 border border-line shadow-xs font-nineties text-xs uppercase tracking-wider text-ink">
          <Activity className="w-4 h-4 text-brand" />
          <span>AD8232 ECG Sensor</span>
        </div>
      ),
      title: "AD8232 ECG Sensor",
    },
    {
      node: (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill bg-surface/90 border border-line shadow-xs font-nineties text-xs uppercase tracking-wider text-ink">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Pan-Tompkins QRS Algorithm</span>
        </div>
      ),
      title: "Pan-Tompkins Algorithm",
    },
    {
      node: (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill bg-surface/90 border border-line shadow-xs font-nineties text-xs uppercase tracking-wider text-ink">
          <Cpu className="w-4 h-4 text-sky-700" />
          <span>250Hz Real-Time ADC</span>
        </div>
      ),
      title: "250Hz Real-Time ADC",
    },
    {
      node: (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill bg-surface/90 border border-line shadow-xs font-nineties text-xs uppercase tracking-wider text-ink">
          <Heart className="w-4 h-4 text-brand" />
          <span>N2 Light Sleep Detection</span>
        </div>
      ),
      title: "N2 Light Sleep Detection",
    },
    {
      node: (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill bg-surface/90 border border-line shadow-xs font-nineties text-xs uppercase tracking-wider text-ink">
          <Waves className="w-4 h-4 text-indigo-700" />
          <span>Poincaré SD1/SD2 HRV</span>
        </div>
      ),
      title: "Poincaré SD1/SD2 HRV",
    },
  ];

  return (
    <section
      id="landing-page-section"
      className="relative min-h-screen bg-canvas py-16 px-6 sm:px-12 flex flex-col justify-between celestial-grain overflow-hidden select-none"
    >
      {/* 1. React Bits <CursorGrid /> Interactive Background Integration */}
      <div className="absolute inset-0 pointer-events-auto z-0 opacity-80">
        <CursorGrid
          cellSize={65}
          color="#2c4e7b"
          radius={140}
          falloff="smooth"
          holdTime={350}
          fadeDuration={750}
          lineWidth={1.0}
          maxOpacity={0.8}
          fillOpacity={0.06}
          gridOpacity={0.04}
          cellRadius={4}
          clickPulse
          pulseSpeed={550}
        />
      </div>

      {/* Background Soft Atmospheric Radiance */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-[1]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial from-[#ffffff] to-transparent blur-3xl" />
      </div>

      {/* 2. Top Header Navigation */}
      <header className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pb-8 border-b border-line">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Somnus AI Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-jeanoti text-3xl font-bold tracking-wider text-ink">
            Somnus AI
          </span>
        </div>

        <div className="flex items-center gap-6 font-nineties text-xs uppercase tracking-wider">
          <button
            onClick={() => navigateWithClouds("/dashboard")}
            type="button"
            className="text-muted-ink hover:text-ink transition cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={handleGetStarted}
            type="button"
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-2.5 text-white font-medium hover:bg-brand-dark transition cursor-pointer shadow-sm"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* 3. Main Focused Landing Statement */}
      <main className="relative z-20 max-w-4xl mx-auto my-auto text-center py-16 px-4">
        {/* Brand Page Header in Jeanoti Font */}
        <h2 className="font-jeanoti text-5xl sm:text-7xl md:text-8xl font-bold text-ink leading-tight tracking-tight">
          Somnus AI
        </h2>

        {/* 1-Line Core Sentence Statement in Stenz Graxon */}
        <p className="font-stenz text-lg sm:text-2xl md:text-3xl text-muted-ink max-w-3xl mx-auto mt-6 leading-relaxed">
          Somnus AI is an intelligent ECG-powered sleep monitoring system that analyzes your real-time heart rhythm to wake you exclusively during light sleep for energizing, grogginess-free mornings.
        </p>

        {/* High-Craft CTA Buttons in Behind The Nineties */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGetStarted}
            type="button"
            className="group relative inline-flex items-center gap-3 rounded-pill bg-brand px-10 py-4 font-nineties text-sm uppercase tracking-wider text-white transition-all duration-300 hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.99] cursor-pointer shadow-md"
          >
            <span>Activate Smart Wake</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigateWithClouds("/dashboard")}
            type="button"
            className="inline-flex items-center rounded-pill border border-line bg-surface/90 px-8 py-3.5 font-nineties text-xs uppercase tracking-wider text-ink transition-all duration-300 hover:border-brand hover:text-brand cursor-pointer shadow-xs"
          >
            Telemetry Dashboard
          </button>
        </div>
      </main>

      {/* 4. React Bits <LogoLoop /> Component Integration */}
      <div className="relative z-20 w-full max-w-6xl mx-auto py-6 my-4 border-t border-b border-line/60 overflow-hidden">
        <LogoLoop
          logos={telemetryLogos}
          speed={60}
          direction="left"
          logoHeight={36}
          gap={32}
          fadeOut
          fadeOutColor="#ddecfa"
          ariaLabel="Somnus Physiological Architecture Pipeline"
        />
      </div>

      {/* 5. Minimalist Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between font-nineties text-xs uppercase tracking-wider text-muted-ink gap-4">
        <span>&copy; 2026 Somnus AI &mdash; Autonomous Sleep Biometrics</span>
        <div className="flex items-center gap-6">
          <button onClick={() => navigateWithClouds("#sticky-notes-section", false)} className="hover:text-ink transition cursor-pointer">Sticky Notes</button>
          <button onClick={() => navigateWithClouds("/dashboard")} className="hover:text-ink transition cursor-pointer">Dashboard</button>
        </div>
      </footer>
    </section>
  );
}
