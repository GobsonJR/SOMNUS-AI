import React, { useMemo, useState } from "react";
import { Flame, Sparkles, CheckCircle2, Trophy, Shield, Star, Award } from "lucide-react";
import SpecularButton from "../reactbits/SpecularButton";

type DaySleep = {
  date: string;
  hours: number;
  quality: number;
  isPeak: boolean;
  isGap: boolean;
  isStreakMember: boolean;
};

export default function SleepStreakThermalMap() {
  const [selectedDay, setSelectedDay] = useState<DaySleep | null>(null);
  const [streakCount, setStreakCount] = useState(18);
  const [claimedToday, setClaimedToday] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // 48 weeks (336 days) with exactly the last 18 days forming an unbroken active streak
  const sleepGrid = useMemo(() => {
    const days: DaySleep[] = [];
    const today = new Date();
    const totalDays = 48 * 7;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      // The last 18 days (i = 0 to 17) are part of the active unbroken 18-day streak
      const isStreakMember = i < 18;
      
      // Day 18 (the day before the streak began) was a clear break / unrecorded gap day
      const isStreakBreakDay = i === 18;

      // Sparse natural distribution for days before the streak
      const isUnrecorded = !isStreakMember && (isStreakBreakDay || i % 4 === 0 || i % 7 === 1 || i % 11 === 3);
      const isGap = !isStreakMember && (isUnrecorded || i % 9 === 0 || i === 42 || i === 88);
      const isPeak = (isStreakMember && (i === 3 || i === 10 || i === 16)) || (!isStreakMember && !isGap && i % 18 === 5);

      let hours = 0;
      if (isStreakMember) {
        // Unbroken 8h+ streak days
        hours = isPeak ? Number((8.9 + Math.random() * 0.5).toFixed(1)) : Number((8.0 + Math.random() * 0.4).toFixed(1));
      } else if (isStreakBreakDay) {
        hours = 0; // The missed day that resets the streak
      } else if (isGap) {
        hours = isUnrecorded ? 0 : Number((4.1 + Math.random() * 1.4).toFixed(1));
      } else if (isPeak) {
        hours = Number((8.8 + Math.random() * 0.7).toFixed(1));
      } else {
        hours = Number((6.0 + Math.random() * 1.8).toFixed(1));
      }

      const quality = hours === 0
        ? 0
        : isPeak 
        ? Math.round(96 + Math.random() * 4)
        : isStreakMember
        ? Math.round(90 + Math.random() * 8)
        : isGap 
        ? Math.round(45 + Math.random() * 20) 
        : Math.min(100, Math.round((hours / 8.0) * 92));

      days.push({
        date: dateStr,
        hours,
        quality,
        isPeak,
        isGap: isGap || hours === 0 || isStreakBreakDay,
        isStreakMember,
      });
    }
    return days;
  }, []);

  const weeks = useMemo(() => {
    const w: DaySleep[][] = [];
    for (let i = 0; i < sleepGrid.length; i += 7) {
      w.push(sleepGrid.slice(i, i + 7));
    }
    return w;
  }, [sleepGrid]);

  // Color mapping from Somnus UI Color Guide
  const getColorClass = (day: DaySleep) => {
    if (day.hours === 0 || day.isGap) return "bg-[#EAE6DF]/70 hover:ring-1 hover:ring-slate-300"; // Unrecorded / gap
    if (day.isStreakMember) return "bg-[#2C4E7B] ring-1 ring-[#5A84B5]/60 hover:ring-2 hover:ring-[#A8C4E8]"; // Active streak cells
    if (day.isPeak || day.hours >= 8.8) return "bg-[#1B365D] ring-1 ring-[#5A84B5] hover:ring-2 hover:ring-[#A8C4E8]"; // Peak
    if (day.hours >= 7.8) return "bg-[#2C4E7B] hover:ring-2 hover:ring-[#5A84B5]"; // 8h target
    if (day.hours >= 6.8) return "bg-[#5A84B5] hover:ring-2 hover:ring-[#A8C4E8]"; // Good
    return "bg-[#A8C4E8] hover:ring-2 hover:ring-[#DCE8F7]"; // Moderate
  };

  const handleClaimStreak = () => {
    if (!claimedToday) {
      setStreakCount(prev => prev + 1);
      setClaimedToday(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Streak Hero Card with Specular Button */}
      <div className="card bg-surface/90 border-line shadow-xs overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2">
          <div className="flex items-center gap-5">
            {/* Streak Flame */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md relative shrink-0">
              <Flame className="w-9 h-9 sm:w-11 sm:h-11 fill-white" strokeWidth={1.5} />
              <div className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-white">
                {streakCount}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-stenz text-xs uppercase tracking-widest text-brand font-medium">
                  Continuous Sleep Habit
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                  <Shield className="w-3 h-3" /> Streak Protected
                </span>
              </div>
              <h2 className="font-ciberus text-3xl sm:text-4xl font-normal text-ink mt-0.5">
                {streakCount} Day Streak
              </h2>
              <p className="font-stenz text-xs text-muted-ink mt-1">
                You have met your 8.0-hour restorative sleep window for 18 consecutive nights.
              </p>
            </div>
          </div>

          {/* Specular Action Button */}
          <div className="w-full md:w-auto">
            <SpecularButton
              size="md"
              radius={20}
              tint="#ffffff"
              tintOpacity={0.2}
              blur={8}
              textColor="#2c4e7b"
              disabled={claimedToday}
              onClick={handleClaimStreak}
            >
              <span className="flex items-center gap-2 text-xs font-nineties uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{claimedToday ? "Today's Streak Logged" : "Log Today's 8h Sleep"}</span>
              </span>
            </SpecularButton>
          </div>
        </div>

        {showCelebration && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-stenz flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Streak updated! 19th consecutive restorative night recorded.</span>
          </div>
        )}
      </div>

      {/* 2. Milestones Progress */}
      <div className="grid gap-3 sm:grid-cols-4 font-stenz text-xs">
        {[
          { goal: "7 Days", title: "Circadian Foundation", reached: true, icon: Star },
          { goal: "14 Days", title: "Autonomic Balance", reached: true, icon: Trophy },
          { goal: "30 Days", title: "Master Staging Streak", reached: false, icon: Award, current: "18/30" },
          { goal: "60 Days", title: "Neuro-Restoration Peak", reached: false, icon: Trophy, current: "18/60" },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition flex items-center gap-3 ${
                m.reached
                  ? "bg-surface/90 border-emerald-300/80 shadow-2xs"
                  : "bg-surface/50 border-line opacity-80"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.reached ? "bg-emerald-100 text-emerald-800" : "bg-canvas text-muted-ink"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="font-semibold text-ink block">{m.goal}</span>
                <span className="text-[11px] text-muted-ink truncate block">{m.title}</span>
                {m.current && (
                  <span className="text-[10px] text-brand font-medium font-mono mt-0.5 block">{m.current}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Full Panoramic Heatmap with 18-Day Continuous Active Run */}
      <div className="card bg-surface/90 border-line shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-ciberus text-xl font-normal text-ink">
                Extended Sleep Consistency Thermal Map
              </h3>
              <span className="px-2 py-0.5 rounded-pill bg-brand/10 text-brand text-[10px] font-medium font-stenz border border-brand/20">
                18-Day Active Streak Active
              </span>
            </div>
            <p className="font-stenz text-xs text-muted-ink mt-0.5">
              The last 18 consecutive days reflect continuous &gt;8.0h sleep targets. Earlier historical months show natural rest days and sparse logs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-stenz text-muted-ink">
            <span>Rest / Gap</span>
            <div className="w-3 h-3 rounded-xs bg-[#EAE6DF]" />
            <div className="w-3 h-3 rounded-xs bg-[#A8C4E8]" />
            <div className="w-3 h-3 rounded-xs bg-[#5A84B5]" />
            <div className="w-3 h-3 rounded-xs bg-[#2C4E7B]" />
            <div className="w-3 h-3 rounded-xs bg-[#1B365D] ring-1 ring-[#5A84B5]" />
            <span>Streak (8h+)</span>
          </div>
        </div>

        {/* Full-Width Grid with highlighted active streak */}
        <div className="overflow-x-auto py-2 w-full">
          <div className="flex justify-between gap-1 min-w-full">
            {weeks.map((week, wIdx) => {
              const isRecentWeek = wIdx >= weeks.length - 3;
              return (
                <div key={wIdx} className={`flex flex-col gap-1 flex-1 ${isRecentWeek ? 'relative' : ''}`}>
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onClick={() => setSelectedDay(day)}
                      title={`${day.date}: ${day.hours > 0 ? `${day.hours} hrs (${day.quality}%)` : "Unrecorded / Break Day"}${day.isStreakMember ? " [Part of 18-Day Streak]" : ""}`}
                      className={`w-full aspect-square min-w-[10px] max-w-[14px] rounded-xs transition-all cursor-pointer ${getColorClass(day)}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Inspector */}
        {selectedDay && (
          <div className="p-3 bg-canvas rounded-lg border border-line flex items-center justify-between text-xs font-stenz animate-in fade-in duration-150">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-ink font-mono">{selectedDay.date}</span>
              <span className="text-muted-ink">
                Duration: <strong className="text-ink font-mono">{selectedDay.hours > 0 ? `${selectedDay.hours} hrs` : "Unrecorded / Streak Reset Day"}</strong>
              </span>
              {selectedDay.hours > 0 && (
                <span className="text-muted-ink">Quality: <strong className="text-brand font-mono">{selectedDay.quality}%</strong></span>
              )}
              {selectedDay.isStreakMember && <span className="text-brand font-semibold font-mono">18-Day Streak Day</span>}
              {selectedDay.isPeak && <span className="text-emerald-700 font-medium">Restorative Peak Night</span>}
            </div>
            <button 
              onClick={() => setSelectedDay(null)}
              className="text-muted-ink hover:text-ink text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
