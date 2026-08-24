import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, RotateCcw, AlertCircle, CheckCircle2, Sparkles, Layers, ChevronRight } from "lucide-react";
import { useCloudNavigate } from "./CloudTunnelTransition";

interface StickyNotesSectionProps {
  onContinueToLanding?: () => void;
}

export default function StickyNotesSection({ onContinueToLanding }: StickyNotesSectionProps) {
  // activeStep:
  // 0: Note #1 in center, Note #2 & Note #3 stacked behind
  // 1: Note #1 parked on LEFT, Note #2 in center, Note #3 behind
  // 2: Note #1 parked on LEFT, Note #2 parked on RIGHT, Note #3 in center
  const [activeStep, setActiveStep] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const { navigateWithClouds } = useCloudNavigate();

  const startXRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slideNext = useCallback(() => {
    setActiveStep((prev) => (prev < 2 ? prev + 1 : 0));
    setIsDragging(false);
    setDragOffset(0);
    currentOffsetRef.current = 0;
  }, []);

  const resetAll = useCallback(() => {
    setActiveStep(0);
    setIsDragging(false);
    setDragOffset(0);
    currentOffsetRef.current = 0;
  }, []);

  // Pointer drag/swipe handling
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newOffset = Math.max(-320, Math.min(320, deltaX));
    setDragOffset(newOffset);
    currentOffsetRef.current = newOffset;

    if (Math.abs(newOffset) >= 140) {
      slideNext();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (Math.abs(currentOffsetRef.current) > 70) {
      slideNext();
    } else {
      setDragOffset(0);
      currentOffsetRef.current = 0;
    }
  };

  const handleFlyToDashboard = () => {
    navigateWithClouds("/dashboard", true);
  };

  return (
    <section
      id="sticky-notes-section"
      className="relative min-h-screen py-24 px-6 flex flex-col items-center justify-center overflow-hidden bg-canvas select-none"
    >
      {/* 1. Seamless Parallax Background Clouds */}
      <div
        className="pointer-events-none absolute -top-32 -left-28 w-[650px] sm:w-[950px] md:w-[1250px] opacity-75 transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, ${scrollY * 0.12}px, 0)`,
        }}
      >
        <img src="/assets/cloud asset.png" alt="Seamless cloud mist" className="w-full h-auto object-contain" />
      </div>

      <div
        className="pointer-events-none absolute -bottom-36 -right-28 w-[700px] sm:w-[1000px] md:w-[1300px] opacity-80 transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(0, -${scrollY * 0.08}px, 0) scale-x-[-1]`,
        }}
      >
        <img src="/assets/cloud asset.png" alt="Seamless cloud mist" className="w-full h-auto object-contain" />
      </div>

      {/* 2. Section Header */}
      <div className="relative z-10 text-center max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-[#c3daf2]/60 border border-[#b4d3f2] font-nineties text-xs uppercase tracking-widest text-brand mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive 3-Note Deck</span>
        </div>

        <h2 className="font-ciberus text-3xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight">
          Biological Architecture & Paradigm
        </h2>

        <p className="font-stenz text-sm sm:text-base text-muted-ink mt-3 max-w-xl mx-auto leading-relaxed">
          Slide each note to pin it on the desk and explore the full Somnus AI intelligence story.
        </p>
      </div>

      {/* 3. 3-Sticky Notes Physical Stacking Workspace */}
      <div className="relative z-20 w-full max-w-5xl min-h-[580px] sm:min-h-[620px] mx-auto flex items-center justify-center">

        {/* ============================================================ */}
        {/* NOTE #03 (BACK NOTE): Advantages of Somnus AI (Yellow Paper) */}
        {/* ============================================================ */}
        <div
          onClick={() => setActiveStep(2)}
          className={`w-full max-w-[460px] rounded-xl p-7 sm:p-9 flex flex-col justify-between select-none shadow-xl transition-all duration-700 ease-out ${
            activeStep === 2
              ? "relative z-30 scale-100 rotate-0 cursor-default opacity-100"
              : "absolute z-10 scale-[0.93] rotate-1 opacity-75 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url('/assets/sticky notes -1.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 14px 28px rgba(0,0,0,0.12), 0 10px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <div className="flex items-center justify-between border-b border-black/15 pb-3 font-nineties">
              <span className="text-xs uppercase font-bold tracking-wider text-brand px-2.5 py-1 rounded bg-[#2c4e7b]/10 border border-[#2c4e7b]/25">
                Clinical Precision
              </span>
              <span className="text-xs text-black/60 font-bold tracking-wider">NOTE #03</span>
            </div>

            <h3 className="font-nineties text-2xl sm:text-3xl font-bold text-ink mt-4 uppercase tracking-wide">
              Advantages of Somnus AI
            </h3>
            <p className="font-nineties text-xs sm:text-sm text-black/80 font-medium mt-1 leading-normal">
              Autonomous, physiological morning awakening backed by cardiac intelligence.
            </p>
          </div>

          <div className="space-y-3 my-4 font-nineties text-xs sm:text-sm text-black/90">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-ink">Zero Sleep Inertia</strong>
                <span className="text-black/75 text-xs">Eliminates the groggy, confused morning state caused by deep sleep interruption.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-ink">250Hz Medical-Grade ECG</strong>
                <span className="text-black/75 text-xs">Millisecond RR-interval resolution outperforms wrist optical PPG photoplethysmography.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-ink">Autonomous Awakening Window</strong>
                <span className="text-black/75 text-xs">Monitors your natural biological ascent to trigger gentle acoustic stimuli exclusively in N2 light sleep.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-ink">Clinically Validated HRV</strong>
                <span className="text-black/75 text-xs">Continuous RMSSD and Poincaré cluster analysis detects true physiological rest.</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/15 flex items-center justify-between font-nineties">
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetAll();
              }}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Notes to Start</span>
            </button>
            <span className="text-xs text-black/50 font-bold uppercase">Note 3 of 3</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NOTE #02 (MIDDLE NOTE): Why Traditional Wake Mechanism Fails (Blue Paper) */}
        {/* ========================================================================= */}
        <div
          onPointerDown={activeStep === 1 ? handlePointerDown : undefined}
          onPointerMove={activeStep === 1 ? handlePointerMove : undefined}
          onPointerUp={activeStep === 1 ? handlePointerUp : undefined}
          onPointerCancel={activeStep === 1 ? handlePointerUp : undefined}
          onClick={activeStep !== 1 ? () => setActiveStep(1) : undefined}
          className={`w-full max-w-[460px] rounded-xl p-7 sm:p-9 flex flex-col justify-between select-none shadow-xl transition-all duration-700 ease-out ${
            activeStep === 0
              ? "absolute z-20 scale-[0.96] -rotate-2 opacity-90 pointer-events-none"
              : activeStep === 1
              ? `relative z-30 scale-100 rotate-0 cursor-grab active:cursor-grabbing opacity-100 ${
                  isDragging ? "transition-none" : ""
                }`
              : "absolute z-20 scale-[0.88] translate-x-[64%] sm:translate-x-[74%] rotate-[7deg] opacity-90 cursor-pointer hover:translate-x-[58%]"
          }`}
          style={{
            backgroundImage: `url('/assets/sticky notes -2.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform:
              activeStep === 1 && isDragging
                ? `translate3d(${dragOffset}px, ${Math.abs(dragOffset) * 0.05}px, 0) rotate(${
                    (dragOffset / 300) * 12
                  }deg)`
                : undefined,
            boxShadow: "0 14px 28px rgba(16,36,62,0.14), 0 10px 10px rgba(16,36,62,0.08)",
          }}
        >
          <div>
            <div className="flex items-center justify-between border-b border-[#10243e]/15 pb-3 font-nineties">
              <span className="text-xs uppercase font-bold tracking-wider text-red-700 px-2.5 py-1 rounded bg-red-100/90 border border-red-300 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Conventional Mechanism</span>
              </span>
              <span className="text-xs text-[#10243e]/70 font-bold tracking-wider">NOTE #02</span>
            </div>

            <h3 className="font-nineties text-2xl sm:text-3xl font-bold text-[#10243e] mt-4 uppercase tracking-wide">
              Why Traditional Wake Fails
            </h3>
            <p className="font-nineties text-xs sm:text-sm text-[#10243e]/80 font-medium mt-1 leading-normal">
              Fixed-time clocks ignore your biological sleep state, causing chronic grogginess.
            </p>
          </div>

          <div className="space-y-3 my-4 font-nineties text-xs sm:text-sm text-[#10243e]/90">
            <div className="flex items-start gap-2.5">
              <span className="font-mono font-bold text-red-700 text-sm leading-none mt-0.5">&minus;</span>
              <div>
                <strong className="block text-sm font-bold text-[#10243e]">Blind Timestamp Trigger</strong>
                <span className="text-[#10243e]/75 text-xs">Fires rigidly at 7:00 AM regardless of whether you are in deep slow-wave N3 sleep.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="font-mono font-bold text-red-700 text-sm leading-none mt-0.5">&minus;</span>
              <div>
                <strong className="block text-sm font-bold text-[#10243e]">Cortisol & Stress Spikes</strong>
                <span className="text-[#10243e]/75 text-xs">Rips the autonomic nervous system violently out of delta waves, triggering acute tachycardia.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="font-mono font-bold text-red-700 text-sm leading-none mt-0.5">&minus;</span>
              <div>
                <strong className="block text-sm font-bold text-[#10243e]">Persistent Morning Brain Fog</strong>
                <span className="text-[#10243e]/75 text-xs">Sleep inertia can degrade executive cognitive performance for up to 4 hours.</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#10243e]/15 flex items-center justify-between font-nineties">
            {activeStep === 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  slideNext();
                }}
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
              >
                <span>Slide to reveal Note #03 &rarr;</span>
              </button>
            ) : (
              <span className="text-xs text-[#10243e]/60 font-bold">Placed on Right Side</span>
            )}
            <span className="text-xs text-[#10243e]/60 font-bold uppercase">Note 2 of 3</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NOTE #01 (FRONT NOTE): Why Somnus AI? (Yellow Paper)         */}
        {/* ============================================================ */}
        <div
          onPointerDown={activeStep === 0 ? handlePointerDown : undefined}
          onPointerMove={activeStep === 0 ? handlePointerMove : undefined}
          onPointerUp={activeStep === 0 ? handlePointerUp : undefined}
          onPointerCancel={activeStep === 0 ? handlePointerUp : undefined}
          onClick={activeStep !== 0 ? () => setActiveStep(0) : undefined}
          className={`w-full max-w-[460px] rounded-xl p-7 sm:p-9 flex flex-col justify-between select-none shadow-2xl transition-all duration-700 ease-out ${
            activeStep === 0
              ? `relative z-40 scale-100 rotate-0 cursor-grab active:cursor-grabbing opacity-100 ${
                  isDragging ? "transition-none" : ""
                }`
              : "absolute z-20 scale-[0.88] -translate-x-[64%] sm:-translate-x-[74%] -rotate-[7deg] opacity-90 cursor-pointer hover:-translate-x-[58%]"
          }`}
          style={{
            backgroundImage: `url('/assets/sticky notes -1.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform:
              activeStep === 0 && isDragging
                ? `translate3d(${dragOffset}px, ${Math.abs(dragOffset) * 0.05}px, 0) rotate(${
                    (dragOffset / 300) * 12
                  }deg)`
                : undefined,
            boxShadow: "0 18px 32px rgba(0,0,0,0.15), 0 12px 14px rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <div className="flex items-center justify-between border-b border-black/15 pb-3 font-nineties">
              <span className="text-xs uppercase font-bold tracking-wider text-brand px-2.5 py-1 rounded bg-[#2c4e7b]/10 border border-[#2c4e7b]/25 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Next-Gen Sleep Intelligence</span>
              </span>
              <span className="text-xs text-black/60 font-bold tracking-wider">NOTE #01</span>
            </div>

            <h3 className="font-nineties text-2xl sm:text-3xl font-bold text-ink mt-4 uppercase tracking-wide">
              Why Somnus AI?
            </h3>
            <p className="font-nineties text-xs sm:text-sm text-black/80 font-medium mt-1 leading-normal">
              Autonomous physiological sleep staging that tracks your autonomic cardiac rhythm.
            </p>
          </div>

          <div className="space-y-3 my-4 font-nineties text-xs sm:text-sm text-black/90">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-ink">Real-Time Autonomic Staging</strong>
                <span className="text-black/75 text-xs">Continuous R-R interval ECG signal processing identifies exact transitions from Deep/REM to N2 light sleep.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-ink">Zero Sleep Inertia Protocol</strong>
                <span className="text-black/75 text-xs">Awakens you only when your brain is naturally ready, guaranteeing energized, clear mornings.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-ink">Edge-Computed Intelligence</strong>
                <span className="text-black/75 text-xs">Ultra-low latency Pan-Tompkins QRS algorithm runs locally on embedded ESP32 hardware.</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/15 flex items-center justify-between font-nineties">
            {activeStep === 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  slideNext();
                }}
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
              >
                <span>Slide to reveal Note #02 &rarr;</span>
              </button>
            ) : (
              <span className="text-xs text-black/60 font-bold">Placed on Left Side</span>
            )}
            <span className="text-xs text-black/50 font-bold uppercase">Note 1 of 3</span>
          </div>
        </div>

      </div>

      {/* 4. Controls & Navigation */}
      <div className="relative z-30 mt-10 flex flex-wrap items-center justify-center gap-4 font-nineties">
        <button
          onClick={slideNext}
          type="button"
          className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface/90 px-6 py-2.5 text-xs uppercase tracking-wider text-ink hover:border-brand hover:text-brand transition cursor-pointer shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
          <span>{activeStep === 2 ? "Reset Deck to Note #01" : `Slide to Note #0${activeStep + 2}`}</span>
        </button>

        <button
          onClick={handleFlyToDashboard}
          type="button"
          className="group inline-flex items-center gap-2.5 rounded-pill bg-brand px-8 py-3 text-xs uppercase tracking-wider text-white transition-all duration-300 hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.99] cursor-pointer shadow-md"
        >
          <span>Fly Through The Clouds</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
