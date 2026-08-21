import React, { useState } from "react";
import { 
  Zap, 
  Plus, 
  Play, 
  Sun, 
  Coffee, 
  Thermometer, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  X
} from "lucide-react";
import SpecularButton from "../reactbits/SpecularButton";

type AutomationRoutine = {
  id: string;
  name: string;
  trigger: string;
  device: string;
  action: string;
  enabled: boolean;
  icon: "sun" | "temp" | "coffee" | "curtain";
};

const initialRoutines: AutomationRoutine[] = [
  {
    id: "1",
    name: "Sunrise Ambient Lighting",
    trigger: "On Light N2 Sleep Confirmation",
    device: "Philips Hue / Nanoleaf",
    action: "Gradually ramp bedroom lighting from 0% to 80% at 2700K warm sunrise spectrum.",
    enabled: true,
    icon: "sun",
  },
  {
    id: "2",
    name: "Motorized Smart Curtains",
    trigger: "On Optimal Awakening Triggered",
    device: "SwitchBot Curtain 3",
    action: "Open master bedroom drapery to 100% at smooth low-noise speed.",
    enabled: true,
    icon: "curtain",
  },
  {
    id: "3",
    name: "Circadian Climate Warmup",
    trigger: "15m Before Wake Window Target",
    device: "Ecobee / Nest Smart Thermostat",
    action: "Raise ambient temperature to 21.5°C to reduce nocturnal melatonin production.",
    enabled: true,
    icon: "temp",
  },
  {
    id: "4",
    name: "Morning Espresso Preheat",
    trigger: "On Alarm Dismissed (\"I'm Awake\")",
    device: "Zigbee Smart Plug / Breville",
    action: "Activate espresso machine preheating relay for instant morning brew.",
    enabled: false,
    icon: "coffee",
  },
];

export default function AutomationHub() {
  const [routines, setRoutines] = useState<AutomationRoutine[]>(initialRoutines);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState("On Light N2 Sleep Confirmation");
  const [newDevice, setNewDevice] = useState("Philips Hue Smart Lights");
  const [newAction, setNewAction] = useState("");

  // Live simulation execution pipeline state
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLog, setSimLog] = useState<string[]>([]);

  const handleToggleRoutine = (id: string) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newRoutine: AutomationRoutine = {
      id: Date.now().toString(),
      name: newName,
      trigger: newTrigger,
      device: newDevice,
      action: newAction || `Execute ${newDevice} command upon ${newTrigger}.`,
      enabled: true,
      icon: newDevice.toLowerCase().includes("light") ? "sun" : newDevice.toLowerCase().includes("temp") ? "temp" : newDevice.toLowerCase().includes("coffee") ? "coffee" : "curtain",
    };

    setRoutines(prev => [newRoutine, ...prev]);
    setIsCreating(false);
    setNewName("");
    setNewAction("");
  };

  const handleRunSimulation = () => {
    setSimulating(true);
    setSimStep(1);
    setSimLog([`[${new Date().toLocaleTimeString()}] Pipeline Armed: Listening for physiological light N2 sleep...`]);

    setTimeout(() => {
      setSimStep(2);
      setSimLog(prev => [
        `[${new Date().toLocaleTimeString()}] Biometric Match: 250Hz R-R delta drop confirms Light N2 sleep.`,
        ...prev
      ]);
    }, 1200);

    setTimeout(() => {
      setSimStep(3);
      setSimLog(prev => [
        `[${new Date().toLocaleTimeString()}] Dispatching Action: Philips Hue Sunrise ramp 2700K initiated.`,
        `[${new Date().toLocaleTimeString()}] Dispatching Action: SwitchBot Curtains opened to 100%.`,
        ...prev
      ]);
    }, 2400);

    setTimeout(() => {
      setSimStep(4);
      setSimLog(prev => [
        `[${new Date().toLocaleTimeString()}] Pipeline Execution Success: 200 OK (Latency: 38ms). All smart IoT devices active.`,
        ...prev
      ]);
      setSimulating(false);
    }, 3800);
  };

  const getIcon = (type: AutomationRoutine["icon"]) => {
    switch (type) {
      case "sun": return <Sun className="w-4 h-4 text-amber-500" />;
      case "temp": return <Thermometer className="w-4 h-4 text-sky-500" />;
      case "coffee": return <Coffee className="w-4 h-4 text-amber-700" />;
      case "curtain": return <SlidersHorizontal className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="card bg-surface/90 border-line shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-ciberus text-2xl font-normal text-ink">
              Automations & IoT Hub
            </h3>
          </div>
          <p className="font-stenz text-xs text-muted-ink mt-1 max-w-2xl">
            Orchestrate smart lighting, motorized curtains, climate thermostats, and appliances the exact second light sleep is detected.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SpecularButton
            size="sm"
            radius={14}
            tint="#ffffff"
            tintOpacity={0.2}
            blur={6}
            textColor="#2c4e7b"
            onClick={handleRunSimulation}
            disabled={simulating}
          >
            <span className="flex items-center gap-1.5 text-xs font-nineties uppercase tracking-wider">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{simulating ? "Executing Routine..." : "Test Run Routine"}</span>
            </span>
          </SpecularButton>

          <SpecularButton
            size="sm"
            radius={14}
            tint="#ffffff"
            tintOpacity={0.25}
            blur={8}
            textColor="#2c4e7b"
            onClick={() => setIsCreating(true)}
          >
            <span className="flex items-center gap-1.5 text-xs font-nineties uppercase tracking-wider">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Routine</span>
            </span>
          </SpecularButton>
        </div>
      </div>

      {/* Live Pipeline Execution Stream (when simulating) */}
      {simLog.length > 0 && (
        <div className="card bg-canvas border-line p-4 space-y-3 font-stenz text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="font-semibold text-ink flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${simulating ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>Live Automation Execution Pipeline</span>
            </span>
            <button onClick={() => setSimLog([])} className="text-muted-ink hover:text-ink text-xs underline cursor-pointer">
              Clear Stream
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {simLog.map((log, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-surface/80 border border-line text-emerald-800">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routine Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {routines.map((routine) => (
          <div 
            key={routine.id}
            className={`card border transition-all p-5 flex flex-col justify-between space-y-4 ${
              routine.enabled 
                ? "bg-surface/90 border-line shadow-xs" 
                : "bg-canvas/60 border-line/60 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-canvas border border-line flex items-center justify-center shrink-0">
                    {getIcon(routine.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-ink font-stenz">{routine.name}</h4>
                    <span className="text-[11px] text-brand font-medium font-stenz block">{routine.device}</span>
                  </div>
                </div>

                {/* Toggle switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={routine.enabled}
                    onChange={() => handleToggleRoutine(routine.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand" />
                </label>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-canvas border border-line/60 text-[11px] font-stenz text-muted-ink space-y-1">
                <div className="flex items-center gap-1.5 text-ink font-medium">
                  <span className="text-muted-ink">Trigger:</span>
                  <span>{routine.trigger}</span>
                </div>
                <p className="text-muted-ink leading-relaxed">
                  {routine.action}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-line/60 text-xs font-stenz">
              <span className={`text-[10px] font-semibold ${routine.enabled ? 'text-emerald-700' : 'text-muted-ink'}`}>
                {routine.enabled ? "Active in wake window" : "Disabled"}
              </span>

              <button
                type="button"
                onClick={() => handleDeleteRoutine(routine.id)}
                className="text-muted-ink hover:text-rose-600 transition p-1 cursor-pointer"
                title="Delete Routine"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Routine Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <form onSubmit={handleCreateRoutine} className="w-full max-w-lg rounded-3xl backdrop-blur-2xl bg-white/95 border border-line shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand" />
                <h4 className="font-ciberus text-xl text-ink font-normal">
                  Create Smart Sleep Routine
                </h4>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCreating(false)} 
                className="p-1 text-muted-ink hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-stenz text-xs">
              <div>
                <label className="block text-muted-ink uppercase tracking-wider mb-1">Routine Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Master Bedroom Lighting Ramp"
                  className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-ink text-xs focus:border-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-ink uppercase tracking-wider mb-1">Biometric Trigger Event</label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-ink text-xs focus:border-brand outline-none"
                >
                  <option>On Light N2 Sleep Confirmation</option>
                  <option>On Smart Wake Window Start</option>
                  <option>15m Before Hard Wake Deadline</option>
                  <option>On Alarm Dismissed ("I'm Awake")</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-ink uppercase tracking-wider mb-1">Target Smart Device</label>
                <select
                  value={newDevice}
                  onChange={(e) => setNewDevice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-ink text-xs focus:border-brand outline-none"
                >
                  <option>Philips Hue / Nanoleaf Smart Lights</option>
                  <option>SwitchBot Motorized Curtains</option>
                  <option>Ecobee / Nest Thermostat</option>
                  <option>Smart Espresso Brewer Relay</option>
                  <option>Matter / HomeKit Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-ink uppercase tracking-wider mb-1">Action Description</label>
                <textarea
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Describe device state, color temperature, or target values..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-ink text-xs focus:border-brand outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-line font-nineties text-xs uppercase tracking-wider">
              <SpecularButton
                size="sm"
                radius={14}
                tint="#ffffff"
                tintOpacity={0.1}
                blur={6}
                textColor="#64748b"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </SpecularButton>

              <SpecularButton
                size="sm"
                radius={14}
                tint="#ffffff"
                tintOpacity={0.25}
                blur={8}
                textColor="#2c4e7b"
                type="submit"
              >
                Save Routine
              </SpecularButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
