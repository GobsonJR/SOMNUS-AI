import React, { useState, useRef, useEffect } from "react";
import { 
  Clock, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  BellRing, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Info
} from "lucide-react";
import WakeModal from "./WakeModal";
import SpecularButton from "../reactbits/SpecularButton";

type Props = {
  onSaved?: () => void;
};

// Helper: Calculate difference in hours between current system time and a target HH:mm
const calculateHoursFromNow = (targetHHMM: string) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [tH, tM] = targetHHMM.split(":").map(Number);
  let targetMinutes = tH * 60 + tM;

  // If target time is earlier or equal to now, it is for tomorrow morning (+24h)
  if (targetMinutes <= currentMinutes) {
    targetMinutes += 24 * 60;
  }

  const diffMinutes = targetMinutes - currentMinutes;
  return Number((diffMinutes / 60).toFixed(1));
};

// Helper: Calculate end timestamp string given start HH:mm and duration in minutes
const calculateEndTime = (startHHMM: string, durationMinutes: number) => {
  const [sH, sM] = startHHMM.split(":").map(Number);
  let totalMin = sH * 60 + sM + durationMinutes;

  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;

  const formatAMPM = (h: number, m: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const mStr = m < 10 ? `0${m}` : m;
    return `${h12}:${mStr} ${ampm}`;
  };

  const startFormatted = formatAMPM(sH, sM);
  const endFormatted = formatAMPM(endH, endM);

  return {
    startFormatted,
    endFormatted,
    previewRange: `${startFormatted} – ${endFormatted}`,
    latestWake: endFormatted,
  };
};

export default function SmartWakeWindowView({ onSaved }: Props) {
  const [windowStart, setWindowStart] = useState("06:30");
  const [windowLength, setWindowLength] = useState<number>(30); // in minutes: 15, 20, 30, 45, 60
  
  // Audio & Vibration settings
  const [volume, setVolume] = useState(75);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Staging & Modal triggers
  const [isArmed, setIsArmed] = useState(false);
  const [consecutiveN2Count, setConsecutiveN2Count] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showWakeModal, setShowWakeModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // When armed, monitors and triggers floating alarm upon confirmed light sleep
  useEffect(() => {
    if (!isArmed) return;

    const timer = setInterval(() => {
      setConsecutiveN2Count((prev) => {
        if (prev < 2) return prev + 1;
        if (prev === 2) {
          setShowWakeModal(true);
          setIsArmed(false);
          return 3;
        }
        return 0;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isArmed]);

  const handleDismissAlarm = () => {
    setShowWakeModal(false);
    setConsecutiveN2Count(0);
  };

  const handleSnoozeAlarm = () => {
    setShowWakeModal(false);
    setConsecutiveN2Count(0);
  };

  const handleSaveWindow = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursFromNow = calculateHoursFromNow(windowStart);

    // If difference between system time and window start is less than 6 hours, trigger warning
    if (hoursFromNow < 6.0) {
      setShowWarningModal(true);
    } else {
      finalizeSave();
    }
  };

  const finalizeSave = () => {
    setShowWarningModal(false);
    setStatus("saved");
    setIsArmed(true);
    setConsecutiveN2Count(0);
    if (onSaved) onSaved();
    setTimeout(() => setStatus("idle"), 4000);
  };

  const toggleSoundTest = () => {
    if (!audioRef.current) return;
    if (isPlayingSound) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingSound(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingSound(true);
      }).catch(() => {
        setIsPlayingSound(false);
      });
    }
  };

  const timing = calculateEndTime(windowStart, windowLength);
  const hoursUntilWake = calculateHoursFromNow(windowStart);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Hidden Audio Element for Test Preview */}
      <audio
        ref={audioRef}
        src="/assets/alarm.mp3"
        preload="auto"
        onEnded={() => setIsPlayingSound(false)}
      />

      {/* Floating Awakening Modal */}
      <WakeModal
        isOpen={showWakeModal}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
        reason="Autonomous Light N2 sleep confirmed inside your active wake window."
      />

      {/* < 6 Hours Sleep Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl backdrop-blur-2xl bg-white/95 border border-line shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-ciberus text-xl text-ink font-normal">
                Short Sleep Duration Warning
              </h4>
            </div>

            <p className="font-stenz text-xs text-muted-ink leading-relaxed">
              The duration from current system time until your window starts is only <strong>{hoursUntilWake} hours</strong> (&lt; 6 hrs). Short sleep increases morning sleep inertia and reduces restorative N2/deep sleep phases.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 font-nineties text-xs uppercase tracking-wider">
              <SpecularButton
                size="sm"
                radius={14}
                tint="#ffffff"
                tintOpacity={0.1}
                blur={6}
                textColor="#64748b"
                onClick={() => setShowWarningModal(false)}
              >
                Adjust Time
              </SpecularButton>
              <SpecularButton
                size="sm"
                radius={14}
                tint="#ffffff"
                tintOpacity={0.25}
                blur={8}
                textColor="#2c4e7b"
                onClick={finalizeSave}
              >
                Save Window Anyway
              </SpecularButton>
            </div>
          </div>
        </div>
      )}

      {/* Header Narrative */}
      <div className="space-y-2">
        <h2 className="font-ciberus text-3xl sm:text-4xl font-normal text-ink">
          Your wake window
        </h2>
        <p className="font-stenz text-xs sm:text-sm text-muted-ink leading-relaxed max-w-3xl">
          A fixed alarm can land mid-way through deep sleep or REM, which is why you wake up groggy. Give Somnus a window instead: it watches for sustained N2 — light, stable sleep — and rings the moment it finds it. If N2 never appears, the alarm still fires at the end of the window, so you're never late.
        </p>
      </div>

      {/* Main Wake Window Configuration Card */}
      <div className="card bg-surface/90 border-line shadow-xs space-y-6 p-6 sm:p-8">
        <form onSubmit={handleSaveWindow} className="space-y-6">
          {/* 1. Window starts */}
          <div className="space-y-2">
            <label className="block font-stenz text-xs uppercase tracking-wider text-muted-ink font-semibold">
              Window starts
            </label>
            <div className="relative max-w-md">
              <input
                type="time"
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
                className="w-full rounded-2xl border border-line bg-canvas px-4 py-3.5 text-2xl font-mono text-ink focus:border-brand focus:outline-none"
              />
              <Clock className="w-5 h-5 text-muted-ink absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="font-stenz text-[11px] text-muted-ink block">
              {hoursUntilWake} hours from current system time
            </span>
          </div>

          {/* 2. Window length segmented pills */}
          <div className="space-y-2">
            <label className="block font-stenz text-xs uppercase tracking-wider text-muted-ink font-semibold">
              Window length
            </label>
            <div className="flex flex-wrap gap-2.5 font-stenz text-xs">
              {[15, 20, 30, 45, 60].map((mins) => {
                const isSelected = windowLength === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setWindowLength(mins)}
                    className={`px-5 py-2.5 rounded-full transition-all cursor-pointer font-medium ${
                      isSelected
                        ? "bg-brand text-white shadow-xs"
                        : "bg-canvas border border-line text-muted-ink hover:text-ink"
                    }`}
                  >
                    {mins} min
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. PREVIEW Container */}
          <div className="p-5 rounded-2xl bg-canvas border border-line space-y-1">
            <span className="font-stenz text-[10px] uppercase tracking-widest text-muted-ink font-semibold block">
              Preview
            </span>
            <div className="font-ciberus text-2xl sm:text-3xl font-normal text-ink">
              {timing.previewRange}
            </div>
            <span className="font-stenz text-xs text-muted-ink block">
              Latest possible wake: <strong className="text-ink font-mono">{timing.latestWake}</strong>
            </span>
          </div>

          {/* Audio Calibration Drawer */}
          <div className="p-4 rounded-2xl bg-canvas/60 border border-line/60 space-y-3 font-stenz text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink font-medium">
                <BellRing className="w-4 h-4 text-brand" />
                <span>Alarm Sound & Tone</span>
              </div>
              <button
                type="button"
                onClick={toggleSoundTest}
                className="text-brand hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                {isPlayingSound ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlayingSound ? "Stop audio" : "Test audio"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-muted-ink">
              <span className="flex items-center gap-1.5">
                {volume > 0 ? <Volume2 className="w-3.5 h-3.5 text-brand" /> : <VolumeX className="w-3.5 h-3.5 text-muted-ink" />}
                <span>Volume ({volume}%)</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-40 accent-brand cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Save Window Specular Action Button */}
          <div className="w-full pt-2">
            <SpecularButton
              size="lg"
              radius={20}
              tint="#ffffff"
              tintOpacity={0.25}
              blur={8}
              textColor="#2c4e7b"
              type="submit"
              className="w-full"
            >
              <span className="font-nineties text-xs uppercase tracking-wider py-1">
                Save window
              </span>
            </SpecularButton>
          </div>

          {status === "saved" && (
            <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-stenz animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Wake window configured for {timing.previewRange}. Somnus will awaken you upon light N2 sleep detection.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
