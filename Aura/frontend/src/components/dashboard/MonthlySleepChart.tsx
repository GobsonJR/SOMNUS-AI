import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend
} from "recharts";
import { Calendar, Activity, Moon } from "lucide-react";

// Generate 30 days of N2 vs Non-N2 sleep values
const generateMonthlyData = () => {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    // N2 Light Sleep: ~4.2h
    const n2 = Number((3.6 + Math.random() * 1.2).toFixed(1));
    // Non-N2 (Deep Sleep & REM): ~3.8h
    const nonN2 = Number((3.2 + Math.random() * 1.0).toFixed(1));
    const totalSleep = Number((n2 + nonN2).toFixed(1));

    days.push({
      date: dayName,
      n2_hours: n2,
      non_n2_hours: nonN2,
      total: totalSleep,
    });
  }
  return days;
};

export default function MonthlySleepChart() {
  const [data] = useState(generateMonthlyData);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card bg-surface/90 border-line">
          <div className="flex items-center justify-between text-muted-ink">
            <span className="font-stenz text-xs uppercase tracking-wider font-medium">N2 Light Sleep</span>
            <Activity className="w-4 h-4 text-brand" />
          </div>
          <p className="mt-2 font-ciberus text-3xl font-normal text-ink">
            4.2 <span className="text-xs font-stenz text-muted-ink font-normal">hrs / night (52%)</span>
          </p>
          <span className="text-[11px] text-brand font-medium mt-1 block">Primary smart awakening target</span>
        </div>

        <div className="card bg-surface/90 border-line">
          <div className="flex items-center justify-between text-muted-ink">
            <span className="font-stenz text-xs uppercase tracking-wider font-medium">Non-N2 (Deep & REM)</span>
            <Moon className="w-4 h-4 text-[#5A84B5]" />
          </div>
          <p className="mt-2 font-ciberus text-3xl font-normal text-ink">
            3.8 <span className="text-xs font-stenz text-muted-ink font-normal">hrs / night (48%)</span>
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Slow-wave delta & memory consolidation</span>
        </div>

        <div className="card bg-surface/90 border-line">
          <div className="flex items-center justify-between text-muted-ink">
            <span className="font-stenz text-xs uppercase tracking-wider font-medium">Monthly Daily Sleep Average</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-ciberus text-3xl font-normal text-ink">
            8.0 <span className="text-xs font-stenz text-muted-ink font-normal">hrs / 24h</span>
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Optimal circadian synchronization</span>
        </div>
      </div>

      {/* Monthly Stacked N2 vs Non-N2 Bar Chart (Y-Axis up to 24h) */}
      <div className="card bg-surface/90 border-line shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <h3 className="font-ciberus text-xl font-normal text-ink">
              30-Day Sleep Architecture (N2 vs Non-N2 Across 24h)
            </h3>
            <p className="font-stenz text-xs text-muted-ink mt-0.5">
              Strict breakdown comparing Light N2 sleep against Non-N2 (Deep + REM) on a 24-hour vertical timeline.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-stenz text-muted-ink">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2C4E7B]" /> N2 Light Sleep
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#A8C4E8]" /> Non-N2 (Deep & REM)
            </span>
          </div>
        </div>

        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.6} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} interval={3} />
              <YAxis domain={[0, 24]} ticks={[0, 4, 8, 12, 16, 20, 24]} tick={{ fontSize: 10, fill: "#64748b" }} unit="h" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#FAF8F3",
                  borderColor: "#DDD7CB",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(44,78,123,0.08)",
                }}
                formatter={(value: any, name: any) => [
                  `${value} hrs`, 
                  name === "n2_hours" ? "N2 Light Sleep" : "Non-N2 (Deep & REM)"
                ]}
              />
              <Bar dataKey="non_n2_hours" name="non_n2_hours" stackId="sleep" fill="#A8C4E8" radius={[0, 0, 0, 0]} />
              <Bar dataKey="n2_hours" name="n2_hours" stackId="sleep" fill="#2C4E7B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
