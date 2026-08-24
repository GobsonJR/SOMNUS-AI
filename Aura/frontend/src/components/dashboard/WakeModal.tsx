import React, { useEffect, useRef } from "react";
import { Sparkles, Bell, X, Moon, Sun, CheckCircle2, Clock } from "lucide-react";

interface WakeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSnooze: () => void;
  reason?: string;
}

export default function WakeModal({ isOpen, onDismiss, onSnooze, reason }: WakeModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      {/* Hidden Audio Player */}
      <audio ref={audioRef} src="/assets/alarm.mp3" loop preload="auto" />

      {/* Floating Liquid Glass Awakening Modal */}
      <div className="relative w-full max-w-lg rounded-3xl backdrop-blur-2xl bg-white/85 border border-white shadow-[0_25px_60px_rgba(44,78,123,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Specular Light Blur */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-radial from-sky-200/50 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Header with Close (X) Button */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shadow-xs">
              <Sun className="w-6 h-6 animate-spin text-amber-500" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <span className="font-stenz text-xs uppercase tracking-widest text-brand font-semibold block">
                Optimal Awakening Triggered
              </span>
              <h3 className="font-ciberus text-2xl sm:text-3xl font-normal text-ink mt-0.5">
                Good Morning, Alex
              </h3>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-full text-muted-ink hover:text-ink hover:bg-black/5 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        <div className="relative z-10 p-4 rounded-2xl backdrop-blur-md bg-white/60 border border-line/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-stenz font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>3 Consecutive Light N2 Epochs Confirmed</span>
          </div>
          <p className="font-stenz text-xs text-muted-ink leading-relaxed">
            {reason || "Your autonomic tone indicated ideal light sleep ascent within your wake window. Zero sleep inertia achieved."}
          </p>
        </div>

        {/* Action Buttons: Snooze & Dismiss */}
        <div className="relative z-10 grid grid-cols-2 gap-3 pt-2 font-nineties text-xs uppercase tracking-wider">
          <button
            onClick={onSnooze}
            className="w-full py-3.5 rounded-xl border border-line bg-canvas/80 text-ink hover:bg-canvas transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <Clock className="w-4 h-4 text-muted-ink" />
            <span>Snooze (5m)</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-3.5 rounded-xl bg-brand text-white hover:bg-brand-dark transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I'm Awake</span>
          </button>
        </div>
      </div>
    </div>
  );
}
