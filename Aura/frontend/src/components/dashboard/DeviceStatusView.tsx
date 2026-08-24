import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Battery, 
  BatteryCharging, 
  Radio, 
  RefreshCw, 
  Wifi, 
  Bluetooth, 
  CheckCircle2, 
  Sliders, 
  AlertCircle, 
  Info,
  ShieldCheck,
  Activity
} from "lucide-react";
import SpecularButton from "../reactbits/SpecularButton";

export default function DeviceStatusView() {
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState("Just now");
  const [batteryLevel, setBatteryLevel] = useState(72);
  const [signalQuality, setSignalQuality] = useState<"Good" | "Fair" | "Poor">("Good");
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleResync = () => {
    if (!isConnected) return;
    setIsSyncing(true);
    setSyncMessage("Synchronizing 250Hz biological buffer over BLE...");

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText("Just now");
      setBatteryLevel(prev => Math.max(20, prev));
      setSignalQuality("Good");
      setSyncMessage("Hardware telemetry and epoch buffer synchronized successfully.");
      setTimeout(() => setSyncMessage(null), 3500);
    }, 1200);
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setSyncMessage("Somnus Band S1 disconnected.");
    } else {
      setIsConnected(true);
      setSyncMessage("Reconnected to Somnus Band S1 (ESP32 · AD8232).");
    }
    setTimeout(() => setSyncMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Top Device Status Card */}
      <div className="card bg-surface/90 border-line shadow-xs space-y-6 p-6 sm:p-8">
        {/* Device Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0 shadow-2xs">
              <Cpu className="w-7 h-7" strokeWidth={1.5} />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-ciberus text-2xl sm:text-3xl font-normal text-ink">
                  Somnus Band S1
                </h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[11px] font-stenz font-medium border ${
                  isConnected 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <p className="font-stenz text-xs text-muted-ink mt-0.5">
                ESP32 · AD8232 single-lead ECG · Firmware v1.4.2
              </p>
            </div>
          </div>

          {/* Action Buttons: Specular Styled */}
          <div className="flex items-center gap-3">
            <SpecularButton
              size="sm"
              radius={14}
              tint="#ffffff"
              tintOpacity={0.25}
              blur={8}
              textColor="#2c4e7b"
              onClick={handleResync}
              disabled={!isConnected || isSyncing}
            >
              <span className="flex items-center gap-1.5 text-xs font-nineties uppercase tracking-wider">
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? "Syncing..." : "Re-sync device"}</span>
              </span>
            </SpecularButton>

            <SpecularButton
              size="sm"
              radius={14}
              tint="#ffffff"
              tintOpacity={0.1}
              blur={6}
              textColor="#64748b"
              onClick={handleToggleConnection}
            >
              <span className="text-xs font-nineties uppercase tracking-wider">
                {isConnected ? "Disconnect" : "Connect"}
              </span>
            </SpecularButton>
          </div>
        </div>

        {/* 2x2 Telemetry Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Battery */}
          <div className="p-4 rounded-2xl bg-canvas border border-line space-y-1">
            <div className="flex items-center justify-between text-muted-ink">
              <span className="font-stenz text-[10px] uppercase tracking-wider font-semibold">Battery</span>
              <Battery className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-ciberus text-3xl text-ink font-normal">{batteryLevel}%</span>
            </div>
            <span className="font-stenz text-[11px] text-muted-ink block">~2 nights remaining</span>
          </div>

          {/* Signal Quality */}
          <div className="p-4 rounded-2xl bg-canvas border border-line space-y-1">
            <div className="flex items-center justify-between text-muted-ink">
              <span className="font-stenz text-[10px] uppercase tracking-wider font-semibold">Signal Quality</span>
              <Radio className="w-4 h-4 text-brand animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-emerald-50 text-emerald-800 text-xs font-stenz font-medium border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {signalQuality}
              </span>
            </div>
            <span className="font-stenz text-[11px] text-muted-ink block">Clean electrode contact</span>
          </div>

          {/* Last Synced */}
          <div className="p-4 rounded-2xl bg-canvas border border-line space-y-1">
            <div className="flex items-center justify-between text-muted-ink">
              <span className="font-stenz text-[10px] uppercase tracking-wider font-semibold">Last Synced</span>
              <RefreshCw className="w-4 h-4 text-[#5A84B5]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-ciberus text-2xl text-ink font-normal">{lastSyncText}</span>
            </div>
            <span className="font-stenz text-[11px] text-muted-ink block">BLE buffer synchronized</span>
          </div>

          {/* Streaming Sampling Rate */}
          <div className="p-4 rounded-2xl bg-canvas border border-line space-y-1">
            <div className="flex items-center justify-between text-muted-ink">
              <span className="font-stenz text-[10px] uppercase tracking-wider font-semibold">Streaming</span>
              <Activity className="w-4 h-4 text-brand" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-ciberus text-3xl text-ink font-normal">250 Hz</span>
              <span className="text-xs font-stenz text-muted-ink font-medium">ECG</span>
            </div>
            <span className="font-stenz text-[11px] text-emerald-700 font-medium block">Millisecond R-R accuracy</span>
          </div>
        </div>

        {/* Sync Toast Banner */}
        {syncMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-stenz flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* Hardware Telemetry & Architecture Note */}
      <div className="p-4 rounded-2xl bg-surface/90 border border-line shadow-xs flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-canvas border border-line text-brand shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs font-stenz">
          <span className="font-semibold text-ink block">Hardware Architecture & Electrode Placement</span>
          <p className="text-muted-ink leading-relaxed">
            The Somnus Band S1 streams single-lead cardiac ECG over BLE/WiFi to the Somnus classifier, which scores each 30-second window as Light N2 or Non-N2. Ensure lead placement is snug against the chest or wrist for a high artifact signal score.
          </p>
        </div>
      </div>
    </div>
  );
}
