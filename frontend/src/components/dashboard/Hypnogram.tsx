import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { Radio, Activity } from "lucide-react";

interface SerialPlotterPoint {
  index: number;
  time: string;
  ecgAdc: number; // Raw ADC / Voltage Signal like Arduino IDE (0 - 3,000)
}

// Generate realistic Arduino Serial Plotter ECG pulse stream
const generateInitialSerialStream = () => {
  const points: SerialPlotterPoint[] = [];
  const now = Date.now();

  for (let i = 0; i < 40; i++) {
    const t = new Date(now - (39 - i) * 600);
    const timeStr = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    // Triangular ECG pulse wave matching Arduino Serial Plotter (0 - 2,800 ADC units)
    let adc = Math.sin(i * 0.5) * 150 + 200;
    if (i % 5 === 0) {
      adc = 2450 + Math.random() * 200; // QRS Peak
    } else if (i % 5 === 1) {
      adc = -100 + Math.random() * 50; // S-Wave dip
    }

    points.push({
      index: i,
      time: timeStr,
      ecgAdc: Math.round(adc),
    });
  }
  return points;
};

export default function Hypnogram() {
  const [streamData, setStreamData] = useState<SerialPlotterPoint[]>(generateInitialSerialStream);

  // Live real-time ECG streaming based on system time clock
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamData((prev) => {
        const lastIdx = prev.length > 0 ? prev[prev.length - 1].index + 1 : 0;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        const isPeak = lastIdx % 5 === 0;
        const isDip = lastIdx % 5 === 1;
        let adc = Math.sin(lastIdx * 0.5) * 150 + 200;
        if (isPeak) {
          adc = 2450 + (Math.random() * 250 - 125);
        } else if (isDip) {
          adc = -80 + (Math.random() * 40 - 20);
        }

        const newPoint: SerialPlotterPoint = {
          index: lastIdx,
          time: timeStr,
          ecgAdc: Math.round(adc),
        };

        return [...prev.slice(1), newPoint];
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-brand animate-pulse" />
            <h3 className="font-ciberus text-xl font-normal text-ink">
              Arduino IDE Serial ECG Plotter (250Hz ADC)
            </h3>
          </div>
          <p className="font-stenz text-xs text-muted-ink mt-0.5">
            Continuous real-time single-lead ECG cardiac waveform streaming with millisecond QRS spikes.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-stenz text-muted-ink">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-canvas border border-line">
            <span className="w-2.5 h-2.5 rounded-full bg-brand" />
            <span className="font-mono text-ink font-semibold">value 1 (Raw ADC)</span>
          </div>
        </div>
      </div>

      {/* Arduino Serial Plotter style visual canvas */}
      <div className="w-full h-80 pt-2 bg-[#FAF8F3]/70 rounded-2xl p-3 border border-line/70 shadow-2xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={streamData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={true} horizontal={true} opacity={0.8} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} interval={5} />
            <YAxis domain={[-300, 3000]} ticks={[-300, 0, 500, 1000, 1500, 2000, 2500, 3000]} tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#FAF8F3",
                borderColor: "#DDD7CB",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(44,78,123,0.08)",
              }}
              formatter={(val: any) => [`${val} ADC`, "Raw ECG Signal"]}
            />
            <Line 
              type="linear" 
              dataKey="ecgAdc" 
              name="Raw ECG (ADC)"
              stroke="#2C4E7B" 
              strokeWidth={2.0} 
              dot={false}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
