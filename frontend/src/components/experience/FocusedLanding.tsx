import { useCloudNavigate } from "./CloudTunnelTransition";
import { ArrowRight } from "lucide-react";
import CursorGrid from "../reactbits/CursorGrid";
import SpecularButton from "../reactbits/SpecularButton";

interface FocusedLandingProps {
  onGetStarted?: () => void;
}

export default function FocusedLanding({ onGetStarted }: FocusedLandingProps) {
  const { navigateWithClouds } = useCloudNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigateWithClouds("/auth");
    }
  };

  return (
    <section
      id="landing-page-section"
      className="relative min-h-screen bg-canvas py-12 px-6 sm:px-12 flex flex-col justify-between celestial-grain overflow-hidden select-none"
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

      {/* 2. Top Header Navigation with SpecularButton for Sign In */}
      <header className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-line">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Somnus AI Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-jeanoti text-3xl font-normal tracking-wider text-ink">
            Somnus AI
          </span>
        </div>

        {/* Right Top: Sign In Specular Button ALONE */}
        <div>
          <SpecularButton
            size="sm"
            radius={20}
            tint="#ffffff"
            tintOpacity={0.2}
            blur={10}
            textColor="#2c4e7b"
            lineColor="#ffffff"
            baseColor="#94a3b8"
            intensity={1.2}
            shineSize={12}
            shineFade={35}
            followMouse
            proximity={200}
            onClick={() => navigateWithClouds("/auth")}
          >
            <span className="font-nineties text-xs uppercase tracking-wider">Sign In</span>
          </SpecularButton>
        </div>
      </header>

      {/* 3. Main Focused Landing Statement */}
      <main className="relative z-20 max-w-4xl mx-auto my-auto text-center py-16 px-4">
        {/* Brand Page Header in Jeanoti Font */}
        <h2 className="font-jeanoti text-5xl sm:text-7xl md:text-8xl font-normal text-ink leading-tight tracking-tight">
          Somnus AI
        </h2>

        {/* Reduced 1-Line Core Sentence Statement */}
        <p className="font-stenz text-base sm:text-xl md:text-2xl text-muted-ink max-w-2xl mx-auto mt-5 leading-relaxed font-normal">
          Real-time cardiac rhythm intelligence designed to awaken you exclusively during natural light sleep.
        </p>

        {/* SpecularButton "Get Started" */}
        <div className="mt-10 flex items-center justify-center">
          <SpecularButton
            size="lg"
            radius={24}
            tint="#ffffff"
            tintOpacity={0.25}
            blur={14}
            textColor="#2c4e7b"
            lineColor="#ffffff"
            baseColor="#94a3b8"
            intensity={1.4}
            shineSize={14}
            shineFade={35}
            followMouse
            proximity={250}
            onClick={handleGetStarted}
          >
            <span className="font-nineties text-sm uppercase tracking-wider flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-brand" />
            </span>
          </SpecularButton>
        </div>
      </main>

      {/* 4. Minimalist Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto pt-6 flex items-center justify-center font-nineties text-xs uppercase tracking-wider text-muted-ink">
        <span>Somnus AI 2026</span>
      </footer>
    </section>
  );
}
