import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CloudShader from "../reactbits/CloudShader";
import LogoLoop from "../reactbits/LogoLoop";
import { techStackLogos } from "../reactbits/TechStackLogos";

gsap.registerPlugin(ScrollTrigger);

export default function CloudPassageSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoPortalRef = useRef<HTMLDivElement>(null);
  const cloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const cloudCenterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      tl.fromTo(
        [cloudLeftRef.current, cloudRightRef.current],
        { scale: 0.9, opacity: 0.7 },
        { scale: 1.35, opacity: 1, ease: "none" }
      )
        .fromTo(
          logoPortalRef.current,
          { scale: 0.4, opacity: 0, y: 100 },
          { scale: 1.05, opacity: 1, y: 0, ease: "power2.out" },
          "<0.1"
        )
        .to(
          cloudLeftRef.current,
          { x: -350, opacity: 0.2, scale: 1.6, ease: "power1.in" },
          ">0.3"
        )
        .to(
          cloudRightRef.current,
          { x: 350, opacity: 0.2, scale: 1.6, ease: "power1.in" },
          "<"
        )
        .to(
          cloudCenterRef.current,
          { scale: 1.8, opacity: 0, ease: "power1.in" },
          "<"
        )
        .to(
          logoPortalRef.current,
          { y: -30, opacity: 0.95 },
          "<"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[95vh] flex flex-col items-center justify-between overflow-hidden celestial-grain bg-canvas select-none py-16"
    >
      {/* Dynamic Aceternity WebGL Cloud Shader Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
        <CloudShader speed={0.45} cloudColor="#ffffff" skyColor="#ddecfa" />
      </div>

      {/* Cloud Passage: Left Cloud Bank */}
      <div
        ref={cloudLeftRef}
        className="pointer-events-none absolute -left-28 w-[650px] sm:w-[950px] md:w-[1250px] z-10 opacity-80"
      >
        <img
          src="/assets/cloud asset.png"
          alt="Cloud passage layer"
          className="w-full h-auto object-contain brightness-[1.04]"
        />
      </div>

      {/* Cloud Passage: Right Cloud Bank */}
      <div
        ref={cloudRightRef}
        className="pointer-events-none absolute -right-28 w-[650px] sm:w-[950px] md:w-[1250px] z-10 opacity-80"
      >
        <img
          src="/assets/cloud asset.png"
          alt="Cloud passage layer"
          className="w-full h-auto object-contain scale-x-[-1] brightness-[1.04]"
        />
      </div>

      {/* Cloud Passage: Center Mist */}
      <div
        ref={cloudCenterRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center z-20 opacity-70"
      >
        <img
          src="/assets/cloud asset.png"
          alt="Center cloud portal"
          className="w-[800px] sm:w-[1100px] h-auto object-contain opacity-60"
        />
      </div>

      <div className="h-6" />

      {/* Central Illuminating Somnus Logo rising through the cloud passage */}
      <div
        ref={logoPortalRef}
        className="relative z-30 flex flex-col items-center justify-center text-center opacity-0 my-auto"
      >
        <div className="relative mb-4">
          <div className="absolute -inset-6 rounded-full bg-[#ffffff]/70 blur-2xl animate-pulse" />
          <img
            src="/assets/logo.png"
            alt="Somnus AI Portal Logo"
            className="relative w-24 h-24 sm:w-32 sm:h-32 object-contain filter drop-shadow-md"
          />
        </div>

        <span className="font-jeanoti text-4xl sm:text-6xl md:text-7xl font-normal tracking-wider text-ink mt-2">
          Somnus AI
        </span>
        <span className="font-nineties text-xs uppercase tracking-widest text-muted-ink mt-2">
          Autonomous Sleep Staging Intelligence
        </span>
      </div>

      {/* Tech Stack LogoLoop Integration Below Logo (GitHub, Vercel, TypeScript, HTML, CSS, React, Tailwind, Docker) */}
      <div className="relative z-30 w-full max-w-6xl mx-auto py-5 mt-8 border-t border-b border-line/50 overflow-hidden">
        <LogoLoop
          logos={techStackLogos}
          speed={60}
          direction="left"
          logoHeight={36}
          gap={28}
          fadeOut
          fadeOutColor="#ddecfa"
          ariaLabel="Somnus AI Engineering Tech Stack"
        />
      </div>
    </section>
  );
}
