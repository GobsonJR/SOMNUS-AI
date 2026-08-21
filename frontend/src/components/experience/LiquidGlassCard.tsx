import React from "react";
import { Activity, Sparkles, CheckCircle2, Shield, Heart } from "lucide-react";

export default function LiquidGlassCard() {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
      {/* SVG Liquid Distortion & Refraction Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="liquid-distortion-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" result="noise" seed="4" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Outer Glow & Liquid Chromatic Rim */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-300/40 via-indigo-300/30 to-teal-300/40 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

        {/* Liquid Glass Container with Refraction & Specular Highlights */}
        <div className="relative rounded-3xl backdrop-blur-2xl bg-white/35 border border-white/60 shadow-[0_20px_50px_rgba(44,78,123,0.12),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.05)] p-8 sm:p-12 transition-all duration-500 overflow-hidden">
          {/* Subtle Internal Liquid Sheen */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-radial from-white/60 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-radial from-sky-200/40 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Liquid Glass Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/40 pb-6 mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand" />
                <span className="font-stenz text-xs uppercase tracking-widest text-brand font-medium">
                  Autonomous Biometric Staging
                </span>
              </div>
              <h3 className="font-ciberus text-2xl sm:text-3xl md:text-4xl font-normal text-ink mt-1">
                Why Somnus AI ?
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill backdrop-blur-md bg-white/50 border border-white/60 shadow-2xs text-xs font-stenz text-ink">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time 250Hz Autonomic Engine</span>
            </div>
          </div>

          {/* ONLY 2 MAIN POINTS WITH PROPER SPACING AND JUSTIFICATION */}
          <div className="grid gap-8 md:grid-cols-2 relative z-10">
            {/* Point 1 */}
            <div className="flex flex-col justify-between space-y-4 p-6 sm:p-7 rounded-2xl backdrop-blur-md bg-white/40 border border-white/50 shadow-[0_4px_20px_rgba(44,78,123,0.06)] hover:bg-white/55 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-ciberus text-xl sm:text-2xl font-normal text-ink leading-snug">
                  250Hz Real-Time Autonomic Staging
                </h4>
                <p className="font-stenz text-xs sm:text-sm text-muted-ink leading-relaxed text-justify">
                  Continuous millisecond-accurate R-R interval ECG signal processing monitors autonomic nervous tone, detecting the exact micro-ascent from slow-wave sleep into Light N2 sleep.
                </p>
              </div>

              <div className="pt-3 border-t border-white/40 flex items-center gap-2 text-xs font-stenz text-brand font-medium">
                <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                <span>Millisecond Precision Over Wrist PPG</span>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex flex-col justify-between space-y-4 p-6 sm:p-7 rounded-2xl backdrop-blur-md bg-white/40 border border-white/50 shadow-[0_4px_20px_rgba(44,78,123,0.06)] hover:bg-white/55 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-ciberus text-xl sm:text-2xl font-normal text-ink leading-snug">
                  Zero Sleep Inertia Protocol
                </h4>
                <p className="font-stenz text-xs sm:text-sm text-muted-ink leading-relaxed text-justify">
                  Awakens you exclusively when your brain enters natural light sleep within your wake window, entirely preventing morning cognitive grogginess and cortisol stress spikes.
                </p>
              </div>

              <div className="pt-3 border-t border-white/40 flex items-center gap-2 text-xs font-stenz text-brand font-medium">
                <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                <span>Energized Awakening Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
