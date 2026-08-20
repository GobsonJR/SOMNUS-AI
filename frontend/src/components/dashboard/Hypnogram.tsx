import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { time: string; stage: number };

type Props = {
  data: Point[];
  alarmEnabled: boolean;
};

export default function Hypnogram({ data, alarmEnabled }: Props) {
  return (
    <div className="card h-80 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <h3 className="font-ciberus text-xl font-bold text-ink">Hypnogram Staging History</h3>
        <span className="font-mono text-xs text-muted-ink">AD8232 Epochs</span>
      </div>

      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "monospace" }} />
            <YAxis
              domain={[0, 2]}
              ticks={[0, 1, 2]}
              tick={{ fontSize: 11, fontFamily: "sans-serif" }}
              tickFormatter={(v) => ["Wake", "Light (N2)", "REM"][v] ?? ""}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FAF8F3",
                borderColor: "#DDD7CB",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line type="stepAfter" dataKey="stage" stroke="#C54B32" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] font-stenz text-muted-ink pt-2 border-t border-line/60">
        <span>Continuous Sleep Hypnogram</span>
        <span className={alarmEnabled ? "text-emerald-700 font-semibold" : "text-muted-ink"}>
          {alarmEnabled ? "Smart wake enabled" : "Smart wake disabled"}
        </span>
      </div>
    </div>
  );
}
