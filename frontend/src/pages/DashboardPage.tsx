import { useEffect, useRef, useState } from "react";
import { Radio, ArrowLeft } from "lucide-react";
import { useCloudNavigate } from "../components/experience/CloudTunnelTransition";
import MetricCard from "../components/dashboard/MetricCard";
import Hypnogram from "../components/dashboard/Hypnogram";
import AlarmSetup from "../components/dashboard/AlarmSetup";
import WakeBanner from "../components/dashboard/WakeBanner";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";
const WS_URL = import.meta.env.VITE_WS_URL ?? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;
const DEFAULT_DEVICE_ID = import.meta.env.VITE_DEFAULT_DEVICE_ID ?? "esp32_01";

type StageUpdate = {
  type: "STAGE_UPDATE";
  stage: string;
  n2_probability: number;
  features: Record<string, number>;
  timestamp: string;
};

type AlarmTrigger = {
  type: "ALARM_TRIGGER";
  reason: string;
};

export default function DashboardPage() {
  const { navigateWithClouds } = useCloudNavigate();
  const [deviceId, setDeviceId] = useState(DEFAULT_DEVICE_ID);
  const [stage, setStage] = useState<string | null>(null);
  const [n2Prob, setN2Prob] = useState<number | null>(null);
  const [rmssd, setRmssd] = useState<number | null>(null);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [connection, setConnection] = useState("connecting");
  const [hypnogram, setHypnogram] = useState<{ time: string; stage: number }[]>([]);
  const [alarm, setAlarm] = useState<AlarmTrigger | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const stageToNum = (s: string) => (s === "Wake" ? 0 : s === "REM" ? 2 : 1);

  const refreshSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/summary?device_id=${encodeURIComponent(deviceId)}`);
      if (!res.ok) return;
      const data = await res.json();
      setStage(data.current_stage);
      setN2Prob(data.n2_probability);
      setRmssd(data.rmssd);
      setAlarmEnabled(Boolean(data.alarm_enabled));
    } catch {
      setConnection("backend unavailable");
    }
  };

  useEffect(() => {
    refreshSummary();

    try {
      const ws = new WebSocket(`${WS_URL}/ws/${encodeURIComponent(deviceId)}`);
      wsRef.current = ws;

      ws.onopen = () => setConnection("live");
      ws.onclose = () => setConnection("disconnected");
      ws.onerror = () => setConnection("connection error");
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "STAGE_UPDATE") {
          const update = msg as StageUpdate;
          setStage(update.stage);
          setN2Prob(update.n2_probability);
          setRmssd(update.features?.rmssd ?? null);
          const time = new Date(update.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          setHypnogram((prev) => [...prev.slice(-49), { time, stage: stageToNum(update.stage) }]);
        }
        if (msg.type === "ALARM_TRIGGER") {
          setAlarm(msg as AlarmTrigger);
        }
        if (msg.type === "CONNECTION_STATUS") {
          setConnection(msg.state?.toLowerCase() ?? "live");
        }
      };

      return () => ws.close();
    } catch {
      setConnection("connection error");
    }
  }, [deviceId]);

  return (
    <div className="min-h-screen bg-canvas celestial-grain pb-16">
      {alarm && <WakeBanner reason={alarm.reason} onDismiss={() => setAlarm(null)} />}

      {/* Top Header */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => navigateWithClouds("/")} className="flex items-center gap-3 cursor-pointer">
            <div className="h-3 w-3 rounded-full bg-brand" />
            <span className="font-ciberus text-2xl font-bold tracking-wider text-ink">Somnus AI</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-ink bg-canvas px-3 py-1.5 rounded-pill border border-line">
              <span className={`h-2 w-2 rounded-full ${connection === "live" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span>{connection === "live" ? "Telemetry stream active" : connection}</span>
            </div>

            <button
              onClick={() => navigateWithClouds("/")}
              className="font-stenz text-xs font-semibold text-muted-ink hover:text-ink transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-stenz text-xs uppercase tracking-widest text-brand font-semibold">
                Autonomous Sleep Stage Telemetry
              </span>
            </div>
            <h1 className="font-ciberus text-3xl sm:text-4xl font-bold text-ink mt-1">
              Physiological Sleep Monitor
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-ink">
            <Radio className="w-3.5 h-3.5 text-brand" />
            <label>
              Hardware Node
              <input aria-label="Hardware node ID" className="ml-2 w-28 border-b border-line bg-transparent font-mono text-ink outline-none focus:border-brand" value={deviceId} onChange={(event) => setDeviceId(event.target.value)} />
              <span> (AD8232 ECG)</span>
            </label>
          </div>
        </div>

        {/* Real-time Metric Cards Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Current Sleep Stage" value={stage} />
          <MetricCard label="N2 Light Probability" value={n2Prob != null ? (n2Prob * 100).toFixed(0) : null} unit="%" />
          <MetricCard label="RMSSD Autonomic Tone" value={rmssd != null ? rmssd.toFixed(1) : null} unit="ms" />
        </div>

        {/* Kokonut Profile and Hypnogram Suite */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-1 space-y-6">
            <AlarmSetup deviceId={deviceId} onSaved={refreshSummary} />
          </div>

          <div className="lg:col-span-2">
            <Hypnogram data={hypnogram} alarmEnabled={alarmEnabled} />
          </div>
        </div>
      </main>
    </div>
  );
}
