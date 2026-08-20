import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Wind } from "lucide-react";
import HeavenCloudCanvas from "./HeavenCloudCanvas";

interface CloudScrollSectionProps {
  onScrollToNext: () => void;
}

export default function CloudScrollSection({ onScrollToNext }: CloudScrollSectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const headerBrandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Entrance Animation - Emerges from behind clouds and stays permanently in place
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Start behind the cloud haze
      tl.fromTo(
        headerBrandRef.current,
        { opacity: 0, y: -25, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 }
      )
        // Text emerges upward out of the clouds
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 90, scale: 0.92, filter: "blur(14px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.8, ease: "power2.out" },
          "-=0.7"
        )
        // Subtitle emerges behind title
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power2.out" },
          "-=1.1"
        )
        // CTA settles into view
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          "-=0.9"
        );
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  // Parallax calculations for the 4 overlapping clouds
  const cloud1X = -scrollY * 0.35;
  const cloud1Y = scrollY * 0.12;

  const cloud2X = scrollY * 0.35;
  const cloud2Y = -scrollY * 0.1;

  const cloud3Y = scrollY * 0.22;
  const cloud4Y = -scrollY * 0.18;

  return (
    <section
      ref={heroContainerRef}
      className="relative min-h-screen overflow-hidden bg-canvas flex flex-col justify-between py-10 px-6 select-none"
    >
      {/* 1. Interactive 3D Three.js Volumetric Night Sky & Stars */}
      <HeavenCloudCanvas />

      {/* 2. Soft Ambient Lighting (Nocturnal Mountain Cool Sky) */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-radial from-[#ffffff]/70 via-[#ddecfa]/50 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 left-1/6 w-[600px] h-[400px] bg-[#c3daf2]/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/6 w-[550px] h-[450px] bg-[#b4d3f2]/40 rounded-full blur-3xl" />
      </div>

      {/* 3. Centered Brand Header — Logo + Somnus AI in Jeanoti font */}
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

      {/* 4. EXACTLY 4 Overlapping Parallax Clouds Covering the Viewport with No Hard Cuts */}

      {/* Cloud 1: Top-Left Cloud Bank */}
      <div
        className="pointer-events-none absolute -top-24 -left-32 sm:-left-16 w-[580px] sm:w-[850px] md:w-[1100px] z-10 opacity-90 transition-transform duration-75 ease-out"
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

      {/* Cloud 2: Top-Right Cloud Bank */}
      <div
        className="pointer-events-none absolute -top-16 -right-32 sm:-right-16 w-[600px] sm:w-[880px] md:w-[1150px] z-10 opacity-90 transition-transform duration-75 ease-out"
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

      {/* Cloud 3: Mid-Background Soft Ambient Cloud (low opacity behind text) */}
      <div
        className="pointer-events-none absolute top-1/3 -left-32 w-[650px] sm:w-[950px] md:w-[1250px] z-10 opacity-40 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${cloud3Y}px, 0)`,
        }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Atmospheric background cloud"
          className="w-full h-auto object-contain brightness-[1.04]"
        />
      </div>

      {/* Cloud 4: Bottom-Right Large Cloud Canopy (extends below to transition into sticky notes) */}
      <div
        className="pointer-events-none absolute -bottom-36 -right-24 sm:-right-12 w-[700px] sm:w-[1050px] md:w-[1450px] z-10 opacity-90 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${cloud4Y}px, 0) scale-x-[-1]`,
        }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Bottom cloud canopy"
          className="w-full h-auto object-contain brightness-[1.02]"
        />
      </div>

      {/* 5. Main Hero Content — Emerges from clouds and stays in place */}
      <div className="relative z-30 text-center max-w-4xl mx-auto my-auto py-12 px-4">
        {/* Hero Title in Ciberus Font */}
        <h1
          ref={titleRef}
          className="font-ciberus text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-ink leading-[1.06] tracking-tight drop-shadow-sm"
        >
          Drift Through The Clouds
        </h1>

        {/* Supporting Subtitle in StenzGraxon */}
        <p
          ref={subtitleRef}
          className="font-stenz text-base sm:text-lg md:text-xl text-muted-ink max-w-2xl mx-auto mt-6 leading-relaxed font-normal"
        >
          Conventional alarms wake you blindly during deep sleep, inducing severe sleep inertia. Somnus AI tracks 250Hz ECG cardiac rhythms to synchronize your awakening exclusively with natural light sleep.
        </p>

        {/* Action Button in BehindTheNineties with Mountain Cool brand color */}
        <div ref={ctaRef} className="mt-8 flex items-center justify-center">
          <button
            onClick={onScrollToNext}
            type="button"
            className="group relative inline-flex items-center gap-2.5 rounded-pill bg-brand px-8 py-3.5 font-nineties text-sm uppercase tracking-wider text-white transition-all duration-300 hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.99] cursor-pointer shadow-md"
          >
            <span>Descend Through the Clouds</span>
            <Wind className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 6. Scroll Cue to Sticky Notes */}
      <div className="relative z-30 flex flex-col items-center gap-2 mb-2">
        <button
          onClick={onScrollToNext}
          type="button"
          className="flex flex-col items-center gap-2 font-nineties text-xs tracking-widest uppercase text-muted-ink hover:text-brand transition cursor-pointer p-2"
          aria-label="Scroll down to biological architecture"
        >
          <span>Scroll into the Architecture</span>
          <div className="w-7 h-11 rounded-full border-2 border-muted-ink/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-brand rounded-full animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}
