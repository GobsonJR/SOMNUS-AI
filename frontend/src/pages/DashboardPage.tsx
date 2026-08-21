import { useState } from "react";
import { 
  ArrowLeft, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Settings
} from "lucide-react";
import { useCloudNavigate } from "../components/experience/CloudTunnelTransition";
import WakeBanner from "../components/dashboard/WakeBanner";
import { SidebarNav, DashboardViewId } from "../components/ui/dashboard-sidebar";

// Dedicated Window Components
import ProfileCard from "../components/dashboard/ProfileCard";
import SomnusTherapyChat from "../components/dashboard/SomnusTherapyChat";
import SleepStreakThermalMap from "../components/dashboard/SleepStreakThermalMap";
import MonthlySleepChart from "../components/dashboard/MonthlySleepChart";
import SmartWakeWindowView from "../components/dashboard/SmartWakeWindowView";
import DeviceStatusView from "../components/dashboard/DeviceStatusView";
import AutomationHub from "../components/dashboard/AutomationHub";
import ExportDataView from "../components/dashboard/ExportDataView";

export default function DashboardPage() {
  const { navigateWithClouds } = useCloudNavigate();
  
  // Default: sidebar is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Default view: Profile
  const [activeView, setActiveView] = useState<DashboardViewId>("profile");
  const [alarm, setAlarm] = useState<{ reason: string } | null>(null);

  const handleSelectView = (view: DashboardViewId) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case "profile":
        return {
          category: "User Profile & Account Settings",
          title: "Personal Profile",
        };
      case "therapy":
        return {
          category: "Autonomous Circadian Intelligence",
          title: "Somnus AI",
        };
      case "sleep-streak":
        return {
          category: "Circadian Habit & Tracking",
          title: "Sleep Streak & Consistency",
        };
      case "sleep-stages":
        return {
          category: "Sleep Architecture Breakdown",
          title: "Monthly N2 vs Non-N2 Stages",
        };
      case "wake-window":
        return {
          category: "Autonomous Awakening",
          title: "Smart Wake Window",
        };
      case "device":
        return {
          category: "Hardware Diagnostics & BLE",
          title: "Device Status",
        };
      case "automation":
        return {
          category: "IoT Orchestration",
          title: "Automations Hub",
        };
      case "export-data":
        return {
          category: "Data Interoperability",
          title: "Export Telemetry Dataset",
        };
      case "settings":
        return {
          category: "System Preferences",
          title: "Calibration & Settings",
        };
    }
  };

  const currentMeta = getTitle();

  return (
    <div className="min-h-screen bg-canvas celestial-grain flex overflow-hidden select-none">
      {alarm && <WakeBanner reason={alarm.reason} onDismiss={() => setAlarm(null)} />}

      {/* Sidebar Navigation with 290px spacious width */}
      <div 
        className={`h-screen transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-surface/95 border-r border-line z-40 ${
          isSidebarOpen ? 'w-[290px] opacity-100' : 'w-0 opacity-0 border-none'
        }`}
      >
        <SidebarNav 
          className="w-[290px] border-none bg-transparent"
          activeId={activeView}
          onSelect={handleSelectView}
          onLogout={() => navigateWithClouds("/auth")}
        />
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top App Header */}
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-ink bg-canvas border border-line hover:bg-black/5 transition cursor-pointer flex items-center gap-1.5 text-xs font-stenz font-medium"
              title={isSidebarOpen ? "Hide sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 text-brand" strokeWidth={1.75} /> : <PanelLeftOpen className="w-4 h-4 text-brand" strokeWidth={1.75} />}
              <span className="hidden sm:inline">{isSidebarOpen ? "Hide Menu" : "Menu"}</span>
            </button>

            <button onClick={() => navigateWithClouds("/")} className="flex items-center gap-2 cursor-pointer ml-1">
              <img src="/assets/logo.png" alt="Somnus Logo" className="w-6 h-6 object-contain" />
              <span className="font-jeanoti text-2xl font-normal text-ink">Somnus AI</span>
            </button>

            <span className="text-line mx-1">/</span>
            <span className="font-stenz text-xs uppercase tracking-wider text-muted-ink font-medium truncate max-w-[220px]">
              {currentMeta.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-ink bg-canvas px-3 py-1.5 rounded-pill border border-line">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Telemetry stream (250Hz)</span>
            </div>

            <button
              onClick={() => navigateWithClouds("/")}
              className="font-stenz text-xs font-medium text-muted-ink hover:text-ink transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Window Content */}
        <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1 space-y-6">
          {/* View Header with Clean Segmented Navigation */}
          <div className="pb-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-stenz text-xs uppercase tracking-widest text-brand font-medium block">
                {currentMeta.category}
              </span>
              <h1 className="font-ciberus text-3xl sm:text-4xl font-normal text-ink mt-1">
                {currentMeta.title}
              </h1>
            </div>

            {/* Quick Segmented Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 font-stenz text-xs">
              {[
                { id: "profile", label: "Profile" },
                { id: "therapy", label: "Somnus AI" },
                { id: "sleep-streak", label: "Sleep Streak" },
                { id: "sleep-stages", label: "Stages" },
                { id: "wake-window", label: "Wake Window" },
                { id: "device", label: "Device" },
                { id: "automation", label: "Automations" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-3 py-1.5 rounded-pill font-medium border transition cursor-pointer ${
                    activeView === tab.id
                      ? "bg-brand text-white border-brand shadow-2xs"
                      : "bg-surface border-line text-muted-ink hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================================================================= */}
          {/* 1. PROFILE WINDOW (With Custom Banner, Avatar & Live Telemetry)   */}
          {/* ================================================================= */}
          {activeView === "profile" && (
            <ProfileCard />
          )}

          {/* ================================================================= */}
          {/* 2. SOMNUS AI (AI Chat 9 Block)                                    */}
          {/* ================================================================= */}
          {activeView === "therapy" && (
            <SomnusTherapyChat />
          )}

          {/* ================================================================= */}
          {/* 3. SLEEP STREAK (Accurate 18-Day Continuous Run Heatmap)          */}
          {/* ================================================================= */}
          {activeView === "sleep-streak" && (
            <SleepStreakThermalMap />
          )}

          {/* ================================================================= */}
          {/* 4. SLEEP STAGES (N2 vs Non-N2 with 24h Y-Axis)                    */}
          {/* ================================================================= */}
          {activeView === "sleep-stages" && (
            <MonthlySleepChart />
          )}

          {/* ================================================================= */}
          {/* 5. SMART WAKE WINDOW (System Time, 6h Warning, Auto-Arming)      */}
          {/* ================================================================= */}
          {activeView === "wake-window" && (
            <SmartWakeWindowView onSaved={() => setAlarm({ reason: "Smart Wake Window calibrated with light sleep detection rule." })} />
          )}

          {/* ================================================================= */}
          {/* 6. HARDWARE DEVICE STATUS (ESP32, AD8232, Battery, Re-sync)       */}
          {/* ================================================================= */}
          {activeView === "device" && (
            <DeviceStatusView />
          )}

          {/* ================================================================= */}
          {/* 7. AUTOMATIONS HUB (Interactive Builder & Live Simulator)        */}
          {/* ================================================================= */}
          {activeView === "automation" && (
            <AutomationHub />
          )}

          {/* ================================================================= */}
          {/* 8. EXPORT DATA WINDOW                                            */}
          {/* ================================================================= */}
          {activeView === "export-data" && (
            <ExportDataView />
          )}

          {/* ================================================================= */}
          {/* 9. SETTINGS WINDOW                                               */}
          {/* ================================================================= */}
          {activeView === "settings" && (
            <div className="card bg-surface/90 border-line shadow-xs space-y-6 animate-in fade-in max-w-3xl">
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <Settings className="w-5 h-5 text-brand" />
                <h3 className="font-ciberus text-2xl font-normal text-ink">System Preferences</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs font-stenz">
                <div className="p-4 bg-canvas rounded-xl border border-line space-y-2">
                  <span className="font-semibold text-ink text-sm block">Signal Filtering</span>
                  <p className="text-muted-ink">0.5Hz - 45Hz bandpass filter with active notch filter for baseline noise suppression.</p>
                </div>

                <div className="p-4 bg-canvas rounded-xl border border-line space-y-2">
                  <span className="font-semibold text-ink text-sm block">ECG Stream Sampling</span>
                  <p className="text-muted-ink">250Hz real-time stream over BLE/WebSocket with millisecond R-R accuracy.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
