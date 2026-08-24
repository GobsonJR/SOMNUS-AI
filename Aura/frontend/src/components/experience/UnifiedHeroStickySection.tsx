import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HeavenCloudCanvas from "./HeavenCloudCanvas";
import SlidingLiquidGlassDeck from "./SlidingLiquidGlassDeck";

export default function UnifiedHeroStickySection() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headerBrandRef = useRef<HTMLDivElement>(null);

  // Cloud layer refs for continuous GSAP floating & parallax animation
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const cloud3Ref = useRef<HTMLDivElement>(null);
  const cloud4Ref = useRef<HTMLDivElement>(null);
  const cloud5Ref = useRef<HTMLDivElement>(null);
  const cloud6Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Entrance & Continuous Clouds Floating Movement
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
          { opacity: 0, y: 70, scale: 0.94, filter: "blur(12px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.6, ease: "power2.out" },
          "-=0.7"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 35, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.3, ease: "power2.out" },
          "-=1.0"
        );

      // Continuous gentle drifting cloud animations
      gsap.to(cloud1Ref.current, {
        x: "+=50",
        y: "-=20",
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloud2Ref.current, {
        x: "-=60",
        y: "+=18",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloud3Ref.current, {
        x: "+=70",
        y: "-=25",
        duration: 24,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloud4Ref.current, {
        x: "-=45",
        y: "+=20",
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloud5Ref.current, {
        x: "+=40",
        y: "-=18",
        duration: 26,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloud6Ref.current, {
        x: "-=45",
        y: "+=22",
        duration: 21,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth parallax calculations
  const cloud1X = -scrollY * 0.15;
  const cloud2X = scrollY * 0.15;
  const cloudMidY = scrollY * 0.08;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-canvas text-ink select-none"
    >
      {/* 1. Continuous 3D Volumetric Sky & Star Canvas */}
      <HeavenCloudCanvas />

      {/* 2. Soft Atmospheric Radiance */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1200px] h-[750px] bg-radial from-[#ffffff]/75 via-[#ddecfa]/55 to-transparent blur-3xl opacity-85" />
        <div className="absolute top-[35%] left-1/6 w-[800px] h-[550px] bg-[#c3daf2]/50 rounded-full blur-3xl" />
        <div className="absolute top-[55%] right-1/6 w-[850px] h-[600px] bg-[#b4d3f2]/45 rounded-full blur-3xl" />
      </div>

      {/* 3. Extra Drifting Cloud Banks with Parallax Motion */}
      {/* Top Left Cloud */}
      <div
        ref={cloud1Ref}
        className="pointer-events-none absolute -top-24 -left-36 sm:-left-16 w-[620px] sm:w-[900px] md:w-[1150px] z-10 opacity-90 transition-transform duration-75 ease-out"
        style={{ transform: `translate3d(${cloud1X}px, ${scrollY * 0.06}px, 0)` }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Cloud Bank Top Left"
          className="w-full h-auto object-contain filter contrast-[0.98] brightness-[1.04]"
        />
      </div>

      {/* Top Right Cloud */}
      <div
        ref={cloud2Ref}
        className="pointer-events-none absolute -top-16 -right-36 sm:-right-16 w-[640px] sm:w-[920px] md:w-[1200px] z-10 opacity-90 transition-transform duration-75 ease-out"
        style={{ transform: `translate3d(${cloud2X}px, ${-scrollY * 0.05}px, 0)` }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Cloud Bank Top Right"
          className="w-full h-auto object-contain scale-x-[-1] filter contrast-[0.98] brightness-[1.04]"
        />
      </div>

      {/* Mid Left Cloud */}
      <div
        ref={cloud3Ref}
        className="pointer-events-none absolute top-[28%] -left-44 w-[750px] sm:w-[1050px] md:w-[1350px] z-10 opacity-65 transition-transform duration-100 ease-out"
        style={{ transform: `translate3d(0, ${cloudMidY}px, 0)` }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Mid Cloud Pass Left"
          className="w-full h-auto object-contain brightness-[1.03]"
        />
      </div>

      {/* Mid Right Cloud */}
      <div
        ref={cloud4Ref}
        className="pointer-events-none absolute top-[36%] -right-44 w-[780px] sm:w-[1100px] md:w-[1400px] z-10 opacity-70 transition-transform duration-100 ease-out"
        style={{ transform: `translate3d(0, ${-cloudMidY * 0.7}px, 0) scale-x-[-1]` }}
      >
        <img
          src="/assets/cloud asset.png"
          alt="Mid Cloud Pass Right"
          className="w-full h-auto object-contain brightness-[1.03]"
        />
      </div>

      {/* Lower Mid Clouds */}
      <div
        ref={cloud5Ref}
        className="pointer-events-none absolute top-[62%] -left-32 w-[700px] sm:w-[1000px] md:w-[1300px] z-10 opacity-60"
      >
        <img
          src="/assets/cloud asset.png"
          alt="Lower Cloud Pass Left"
          className="w-full h-auto object-contain brightness-[1.04]"
        />
      </div>

      {/* Bottom Canopy Cloud */}
      <div
        ref={cloud6Ref}
        className="pointer-events-none absolute bottom-0 -right-24 sm:-right-12 w-[750px] sm:w-[1150px] md:w-[1500px] z-10 opacity-85"
      >
        <img
          src="/assets/cloud asset.png"
          alt="Bottom Cloud Canopy"
          className="w-full h-auto object-contain scale-x-[-1] brightness-[1.02]"
        />
      </div>

      {/* ========================================================================= */}
      {/* PART A: HERO TITLE                                                        */}
      {/* ========================================================================= */}
      <div className="relative z-20 min-h-[70vh] flex flex-col justify-between pt-8 px-6">
        {/* Brand Header */}
        <header className="relative z-40 w-full max-w-7xl mx-auto flex items-center justify-center pt-4">
          <div
            ref={headerBrandRef}
            className="flex items-center gap-3 px-6 py-2"
          >
            <img
              src="/assets/logo.png"
              alt="Somnus AI Logo"
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-md"
            />
            <span className="font-jeanoti text-3xl sm:text-4xl md:text-5xl tracking-wider text-ink drop-shadow-xs">
              Somnus AI
            </span>
          </div>
        </header>

        {/* Hero Title & Concise Subtitle */}
        <div className="relative z-30 text-center max-w-4xl mx-auto my-auto py-10 px-4">
          <h1
            ref={titleRef}
            className="font-ciberus text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ink leading-[1.08] tracking-tight drop-shadow-xs"
          >
            Drift Through The Clouds
          </h1>

          <p
            ref={subtitleRef}
            className="font-stenz text-sm sm:text-base md:text-lg text-muted-ink max-w-2xl mx-auto mt-5 leading-relaxed font-normal"
          >
            Conventional alarms wake you blindly during slow-wave deep sleep. Somnus AI monitors 250Hz ECG cardiac rhythms to synchronize awakening exclusively with natural light sleep.
          </p>
        </div>

        <div className="h-6" />
      </div>

      {/* ========================================================================= */}
      {/* PART B: SLIDING LIQUID GLASS DECK (Interactive Sliders With 2 Points)     */}
      {/* ========================================================================= */}
      <div className="relative z-30 py-12 px-6 flex flex-col items-center justify-center">
        <SlidingLiquidGlassDeck />
      </div>
    </section>
  );
}
