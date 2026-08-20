import UnifiedHeroStickySection from "../components/experience/UnifiedHeroStickySection";
import CloudPassageSection from "../components/experience/CloudPassageSection";
import FocusedLanding from "../components/experience/FocusedLanding";

export default function LandingPage() {
  return (
    <div id="main" className="min-h-screen bg-canvas text-ink selection:bg-brand/20 selection:text-brand">
      {/* 1. Combined Seamless Hero & 3-Sticky Notes Section */}
      <UnifiedHeroStickySection />

      {/* 2. Somnus AI Logo Cloud Passage with Aceternity WebGL Cloud Shader */}
      <CloudPassageSection />

      {/* 3. Focused Telemetry Pipeline & Interactive CursorGrid Landing */}
      <FocusedLanding />
    </div>
  );
}
