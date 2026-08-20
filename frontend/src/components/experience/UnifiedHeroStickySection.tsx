import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Wind, ArrowRight, RotateCcw, AlertCircle, CheckCircle2, Sparkles, Layers, ChevronRight } from "lucide-react";
import HeavenCloudCanvas from "./HeavenCloudCanvas";
import { useCloudNavigate } from "./CloudTunnelTransition";

export default function UnifiedHeroStickySection() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const headerBrandRef = useRef<HTMLDivElement>(null);

  // 3-Sticky Notes interactive state
  // 0: Note 1 in center front
  // 1: Note 1 parked on left, Note 2 in center
  // 2: Note 1 parked on left, Note 2 parked on right, Note 3 in center
  const [activeStep, setActiveStep] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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

  // GSAP Entrance Animation for Hero
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerBrandRef.current,
        { opacity: 0, y: -25, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 90, scale: 0.92, filter: "blur(14px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.8, ease: "power2.out" },
          "-=0.7"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power2.out" },
          "-=1.1"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          "-=0.9"
        );
    }, containerRef);

    return () => ctx.revert();
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

  const scrollToNotes = () => {
    const el = document.getElementById("sticky-notes-anchor");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFlyToDashboard = () => {
    navigateWithClouds("/dashboard", true);
  };

  // Parallax calculations
  const cloud1X = -scrollY * 0.25;
  const cloud1Y = scrollY * 0.08;

  const cloud2X = scrollY * 0.25;
  const cloud2Y = -scrollY * 0.06;

  const cloudMidY = scrollY * 0.15;
  const cloudBottomY = -scrollY * 0.1;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-canvas text-ink select-none"
    >
      {/* 1. Single Continuous 3D Three.js Volumetric Night Sky & Stars */}
      <HeavenCloudCanvas />

      {/* 2. Soft Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-radial from-[#ffffff]/70 via-[#ddecfa]/50 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[45%] left-1/5 w-[800px] h-[500px] bg-[#c3daf2]/50 rounded-full blur-3xl" />
        <div className="absolute top-[65%] right-1/5 w-[750px] h-[550px] bg-[#b4d3f2]/40 rounded-full blur-3xl" />
      </div>

      {/* 3. Global Parallax Clouds spanning the entire combined page seamlessly */}
      {/* Top Left Cloud */}
      <div
        className="pointer-events-none absolute -top-20 -left-32 sm:-left-16 w-[580px] sm:w-[850px] md:w-[1100px] z-10 opacity-90 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${cloud1X}px, ${cloud1Y}px, 0)`,
        }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Atmospheric cloud bank top left"
          className="w-full h-auto object-contain filter contrast-[0.98] brightness-[1.03]"
        />
      </div>

      {/* Top Right Cloud */}
      <div
        className="pointer-events-none absolute -top-12 -right-32 sm:-right-16 w-[600px] sm:w-[880px] md:w-[1150px] z-10 opacity-90 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${cloud2X}px, ${cloud2Y}px, 0)`,
        }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Atmospheric cloud bank top right"
          className="w-full h-auto object-contain scale-x-[-1] filter contrast-[0.98] brightness-[1.03]"
        />
      </div>

      {/* Mid Transition Clouds (Seamless bridge between Hero and Sticky Notes) */}
      <div
        className="pointer-events-none absolute top-[38%] -left-36 w-[700px] sm:w-[1000px] md:w-[1300px] z-10 opacity-60 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${cloudMidY}px, 0)`,
        }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Mid-page seamless cloud mist"
          className="w-full h-auto object-contain brightness-[1.04]"
        />
      </div>

      <div
        className="pointer-events-none absolute top-[48%] -right-36 w-[750px] sm:w-[1050px] md:w-[1350px] z-10 opacity-65 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${-cloudMidY * 0.8}px, 0) scale-x-[-1]`,
        }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Mid-page seamless cloud mist"
          className="w-full h-auto object-contain brightness-[1.04]"
        />
      </div>

      {/* Bottom Cloud Bank */}
      <div
        className="pointer-events-none absolute bottom-0 -right-24 sm:-right-12 w-[700px] sm:w-[1100px] md:w-[1450px] z-10 opacity-85 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${cloudBottomY}px, 0) scale-x-[-1]`,
        }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Bottom cloud canopy"
          className="w-full h-auto object-contain brightness-[1.02]"
        />
      </div>

      {/* ========================================================================= */}
      {/* PART A: HERO SECTION (Somnus AI in Jeanoti, Drift in Ciberus)             */}
      {/* ========================================================================= */}
      <div className="relative min-h-screen flex flex-col justify-between py-10 px-6">
        {/* Brand Header */}
        <header className="relative z-40 w-full max-w-7xl mx-auto flex items-center justify-center pt-4">
          <div
            ref={headerBrandRef}
            className="flex items-center gap-3.5 px-6 py-2"
          >
            <img
              src="/assets/logo.png"
              alt="Somnus AI Logo"
              className="w-8 h-8 object-contain drop-shadow-md"
            />
            <span className="font-jeanoti text-3xl sm:text-4xl font-bold tracking-wider text-ink drop-shadow-sm">
              Somnus AI
            </span>
          </div>
        </header>

        {/* Hero Title & Subtitle */}
        <div className="relative z-30 text-center max-w-4xl mx-auto my-auto py-12 px-4">
          <h1
            ref={titleRef}
            className="font-ciberus text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-ink leading-[1.06] tracking-tight drop-shadow-sm"
          >
            Drift Through The Clouds
          </h1>

          <p
            ref={subtitleRef}
            className="font-stenz text-base sm:text-lg md:text-xl text-muted-ink max-w-2xl mx-auto mt-6 leading-relaxed font-normal"
          >
            Conventional alarms wake you blindly during deep sleep, inducing severe sleep inertia. Somnus AI tracks 250Hz ECG cardiac rhythms to synchronize your awakening exclusively with natural light sleep.
          </p>

          <div ref={ctaRef} className="mt-8 flex items-center justify-center">
            <button
              onClick={scrollToNotes}
              type="button"
              className="group relative inline-flex items-center gap-2.5 rounded-pill bg-brand px-8 py-3.5 font-nineties text-sm uppercase tracking-wider text-white transition-all duration-300 hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.99] cursor-pointer shadow-md"
            >
              <span>Descend Through the Clouds</span>
              <Wind className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="relative z-30 flex flex-col items-center gap-2 mb-4">
          <button
            onClick={scrollToNotes}
            type="button"
            className="flex flex-col items-center gap-2 font-nineties text-xs tracking-widest uppercase text-muted-ink hover:text-brand transition cursor-pointer p-2"
          >
            <span>Scroll into the Architecture</span>
            <div className="w-7 h-11 rounded-full border-2 border-muted-ink/30 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-2.5 bg-brand rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART B: STICKY NOTES SECTION (Seamless Direct Continuation in Same World) */}
      {/* ========================================================================= */}
      <div id="sticky-notes-anchor" className="relative min-h-screen py-20 px-6 flex flex-col items-center justify-center">
        {/* Section Heading */}
        <div className="relative z-30 text-center max-w-2xl mb-10">
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

        {/* 3-Sticky Notes Workspace */}
        <div className="relative z-30 w-full max-w-5xl min-h-[580px] sm:min-h-[620px] mx-auto flex items-center justify-center">

          {/* NOTE #03: Advantages of Somnus AI (Yellow Paper) */}
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

          {/* NOTE #02: Why Traditional Wake Fails (Blue Paper) */}
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

          {/* NOTE #01: Why Somnus AI? (Yellow Paper) */}
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

        {/* Action Controls */}
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
      </div>
    </section>
  );
}
