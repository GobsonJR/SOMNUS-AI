import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw,
  Zap,
  ShieldCheck
} from "lucide-react";

export default function SlidingLiquidGlassDeck() {
  // 0: Card 1 front, 1: Card 2 front, 2: Card 3 front
  const [activeStep, setActiveStep] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const startXRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentOffsetRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });

    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newOffset = Math.max(-450, Math.min(450, deltaX));
    setDragOffset(newOffset);
    currentOffsetRef.current = newOffset;

    if (Math.abs(newOffset) >= 75) {
      slideNext();
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(currentOffsetRef.current) > 35) {
      slideNext();
    } else {
      setDragOffset(0);
      currentOffsetRef.current = 0;
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mb-8 relative z-30">
        <span className="font-stenz text-xs uppercase tracking-widest text-brand font-medium block">
          Biological Architecture & Staging
        </span>
        <h2 className="font-ciberus text-4xl sm:text-5xl md:text-6xl font-normal text-ink mt-1">
          Why Somnus AI ?
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-xs font-stenz text-muted-ink">
          <span>Slide fluid glass cards to explore the intelligence layers</span>
          {activeStep > 0 && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-brand font-medium hover:underline cursor-pointer ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Deck</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Fluid Glass Sliding Deck Container */}
      <div className="relative w-full min-h-[480px] sm:min-h-[520px] flex items-center justify-center select-none">
        
        {/* CARD #03: Advantages & Edge Intelligence (Base Fluid Glass Card) */}
        <div
          onClick={() => setActiveStep(2)}
          className={`w-[360px] sm:w-[480px] md:w-[540px] rounded-3xl backdrop-blur-3xl bg-white/[0.14] border border-white/80 shadow-[0_25px_60px_rgba(44,78,123,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.85)] p-7 sm:p-9 flex flex-col justify-between transition-all duration-700 ease-out cursor-pointer overflow-hidden ${
            activeStep === 2
              ? "relative z-30 scale-100 rotate-0 opacity-100"
              : "absolute z-10 scale-[0.93] rotate-1 opacity-70"
          }`}
        >
          {/* Fluid Specular Highlight */}
          <div className="absolute -top-28 -left-28 w-80 h-80 bg-radial from-white/50 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between border-b border-white/30 pb-3 font-stenz">
              <span className="text-xs uppercase font-semibold tracking-widest text-brand flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Clinical Precision</span>
              </span>
              <span className="text-xs text-ink/60 font-mono font-bold">#03</span>
            </div>

            <h3 className="font-ciberus text-2xl sm:text-3xl font-normal text-ink mt-4">
              Advantages of Somnus AI
            </h3>
          </div>

          {/* EXACTLY 2 MAIN POINTS WITH PROPER JUSTIFICATION */}
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/[0.16] border border-white/40 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-ciberus text-base text-ink">
                <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                <span>Zero Sleep Inertia Protocol</span>
              </div>
              <p className="font-stenz text-xs text-ink/80 leading-relaxed text-justify">
                Awakens you exclusively when your brain enters natural light sleep within your wake window, entirely eliminating morning cognitive grogginess and cortisol stress spikes.
              </p>
            </div>

            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/[0.16] border border-white/40 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-ciberus text-base text-ink">
                <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                <span>250Hz Real-Time Autonomic Staging</span>
              </div>
              <p className="font-stenz text-xs text-ink/80 leading-relaxed text-justify">
                Continuous millisecond-accurate R-R interval ECG signal processing monitors autonomic nervous tone, detecting the exact micro-ascent from slow-wave sleep into Light N2 sleep.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/30 text-[11px] font-stenz text-ink/70">
            <span>Autonomous awakening guarantee</span>
            <span className="text-brand font-medium">Layer 3 of 3</span>
          </div>
        </div>

        {/* CARD #02: Why Traditional Wake Fails (Middle Sliding Card) */}
        <div
          onPointerDown={activeStep === 1 ? handlePointerDown : undefined}
          onPointerMove={activeStep === 1 ? handlePointerMove : undefined}
          onPointerUp={activeStep === 1 ? handlePointerUp : undefined}
          onPointerCancel={activeStep === 1 ? handlePointerUp : undefined}
          onClick={activeStep !== 1 ? () => setActiveStep(1) : undefined}
          className={`w-[360px] sm:w-[480px] md:w-[540px] rounded-3xl backdrop-blur-3xl bg-white/[0.14] border border-white/80 shadow-[0_25px_60px_rgba(44,78,123,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.85)] p-7 sm:p-9 flex flex-col justify-between transition-all duration-700 ease-out overflow-hidden ${
            activeStep === 0
              ? "absolute z-20 scale-[0.95] -rotate-2 opacity-80 pointer-events-none"
              : activeStep === 1
              ? `relative z-30 scale-100 rotate-0 cursor-grab active:cursor-grabbing opacity-100 ${
                  isDragging ? "transition-none" : ""
                }`
              : "absolute z-20 scale-[0.88] translate-x-[85%] sm:translate-x-[102%] md:translate-x-[112%] rotate-[8deg] opacity-90 cursor-pointer hover:translate-x-[80%] sm:hover:translate-x-[96%]"
          }`}
          style={{
            transform:
              activeStep === 1 && isDragging
                ? `translate3d(${dragOffset}px, ${Math.abs(dragOffset) * 0.05}px, 0) rotate(${
                    (dragOffset / 300) * 10
                  }deg)`
                : undefined,
          }}
        >
          <div className="absolute -top-28 -left-28 w-80 h-80 bg-radial from-rose-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-white/30 pb-3 font-stenz">
              <span className="text-xs uppercase font-semibold tracking-widest text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Conventional Mechanism</span>
              </span>
              <span className="text-xs text-ink/60 font-mono font-bold">#02</span>
            </div>

            <h3 className="font-ciberus text-2xl sm:text-3xl font-normal text-ink mt-4">
              Why Traditional Wake Fails
            </h3>
          </div>

          {/* EXACTLY 2 MAIN POINTS WITH PROPER JUSTIFICATION */}
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/[0.16] border border-white/40 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-ciberus text-base text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Blind Timestamp Triggering</span>
              </div>
              <p className="font-stenz text-xs text-ink/80 leading-relaxed text-justify">
                Standard alarm clocks trigger blindly at arbitrary timestamps regardless of whether you are in deep slow-wave delta sleep, violently jolting your autonomic nervous system.
              </p>
            </div>

            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/[0.16] border border-white/40 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-ciberus text-base text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Severe Cognitive Sleep Inertia</span>
              </div>
              <p className="font-stenz text-xs text-ink/80 leading-relaxed text-justify">
                Abrupt awakenings from deep delta sleep trigger heavy adenosine accumulation and elevated morning cortisol, degrading brain performance and focus for hours after waking.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/30 text-[11px] font-stenz text-ink/70">
            <span>Slide card left or right</span>
            <span className="text-brand font-medium">Layer 2 of 3</span>
          </div>
        </div>

        {/* CARD #01: Next-Gen Sleep Intelligence (Top Sliding Fluid Glass Card) */}
        <div
          onPointerDown={activeStep === 0 ? handlePointerDown : undefined}
          onPointerMove={activeStep === 0 ? handlePointerMove : undefined}
          onPointerUp={activeStep === 0 ? handlePointerUp : undefined}
          onPointerCancel={activeStep === 0 ? handlePointerUp : undefined}
          onClick={activeStep !== 0 ? () => setActiveStep(0) : undefined}
          className={`w-[360px] sm:w-[480px] md:w-[540px] rounded-3xl backdrop-blur-3xl bg-white/[0.14] border border-white/80 shadow-[0_25px_60px_rgba(44,78,123,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.85)] p-7 sm:p-9 flex flex-col justify-between transition-all duration-700 ease-out overflow-hidden ${
            activeStep === 0
              ? `relative z-40 scale-100 rotate-0 cursor-grab active:cursor-grabbing opacity-100 ${
                  isDragging ? "transition-none" : ""
                }`
              : "absolute z-20 scale-[0.88] -translate-x-[85%] sm:-translate-x-[102%] md:-translate-x-[112%] -rotate-[8deg] opacity-90 cursor-pointer hover:-translate-x-[80%] sm:hover:-translate-x-[96%]"
          }`}
          style={{
            transform:
              activeStep === 0 && isDragging
                ? `translate3d(${dragOffset}px, ${Math.abs(dragOffset) * 0.05}px, 0) rotate(${
                    (dragOffset / 300) * 10
                  }deg)`
                : undefined,
          }}
        >
          <div className="absolute -top-28 -left-28 w-80 h-80 bg-radial from-sky-200/50 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-white/30 pb-3 font-stenz">
              <span className="text-xs uppercase font-semibold tracking-widest text-brand flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Sleep Intelligence</span>
              </span>
              <span className="text-xs text-ink/60 font-mono font-bold">#01</span>
            </div>

            <h3 className="font-ciberus text-2xl sm:text-3xl font-normal text-ink mt-4">
              Why Somnus AI ?
            </h3>
          </div>

          {/* EXACTLY 2 MAIN POINTS WITH PROPER JUSTIFICATION */}
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/[0.16] border border-white/40 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-ciberus text-base text-ink">
                <Activity className="w-4 h-4 text-brand shrink-0" />
                <span>Real-Time Autonomic Staging</span>
              </div>
              <p className="font-stenz text-xs text-ink/80 leading-relaxed text-justify">
                Continuous 250Hz R-R interval ECG signal processing monitors cardiac parasympathetic tone, accurately detecting the natural ascent into Light N2 sleep with millisecond precision.
              </p>
            </div>

            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/[0.16] border border-white/40 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-ciberus text-base text-ink">
                <Zap className="w-4 h-4 text-brand shrink-0" />
                <span>Autonomous Smart Wake Synchronization</span>
              </div>
              <p className="font-stenz text-xs text-ink/80 leading-relaxed text-justify">
                Synchronizes alarm triggers with your physiological light sleep window to guarantee effortless awakening, optimal hormonal balance, and maximum morning alertness.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/30 text-[11px] font-stenz text-ink/70">
            <span>Slide card to explore</span>
            <span className="text-brand font-medium flex items-center gap-1">
              <span>Next Layer</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
