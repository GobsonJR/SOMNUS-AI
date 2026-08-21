import React from 'react';
import { 
  User, 
  Flame,
  Activity, 
  Clock, 
  Cpu,
  Download, 
  Zap, 
  Settings, 
  LogOut,
  BrainCircuit
} from 'lucide-react';

export type DashboardViewId = 
  | 'profile' 
  | 'therapy'
  | 'sleep-streak' 
  | 'sleep-stages' 
  | 'wake-window' 
  | 'device'
  | 'export-data' 
  | 'automation' 
  | 'settings';

export type NavItemData = {
  id: DashboardViewId;
  title: string;
  icon: React.ElementType;
  badge?: string;
};

const navItems: NavItemData[] = [
  { id: 'profile', title: 'Profile', icon: User },
  { id: 'therapy', title: 'Somnus AI', icon: BrainCircuit, badge: 'Agentic' },
  { id: 'sleep-streak', title: 'Sleep Streak', icon: Flame, badge: '18d' },
  { id: 'sleep-stages', title: 'Sleep Stages', icon: Activity },
  { id: 'wake-window', title: 'Smart Wake Window', icon: Clock },
  { id: 'device', title: 'Device Status', icon: Cpu, badge: '250Hz' },
  { id: 'export-data', title: 'Export Data', icon: Download },
];

const connectItems: NavItemData[] = [
  { id: 'automation', title: 'Automations', icon: Zap, badge: 'Active' },
];

const bottomItems: { id: DashboardViewId | 'logout'; title: string; icon: React.ElementType }[] = [
  { id: 'settings', title: 'Settings', icon: Settings },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

export function SidebarNav({ 
  className = '',
  activeId,
  onSelect,
  onLogout
}: { 
  className?: string,
  activeId: DashboardViewId,
  onSelect: (id: DashboardViewId) => void,
  onLogout?: () => void
}) {
  return (
    <div className={`flex flex-col w-[290px] h-full bg-surface/95 border-r border-line p-4 font-sans select-none ${className}`}>
      {/* 1. Profile Quick Card */}
      <div 
        onClick={() => onSelect('profile')}
        className={`flex items-center gap-3.5 p-3 mb-5 rounded-2xl border transition-all cursor-pointer ${
          activeId === 'profile' 
            ? 'bg-brand/10 border-brand/40 text-ink shadow-2xs' 
            : 'bg-canvas border-line hover:bg-black/5 text-ink'
        }`}
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand to-sky-700 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 font-jeanoti">
          A
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold leading-tight text-ink truncate">Alex Vance</span>
          <span className="text-xs text-muted-ink leading-tight truncate">@alexvance</span>
          <span className="text-[10px] text-brand font-medium mt-1 font-stenz">18-Day Streak Active</span>
        </div>
      </div>

      {/* 2. Navigation Items (Named "Somnus AI") */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-muted-ink/60 uppercase font-stenz">
            Telemetry & Intelligence
          </span>
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-stenz cursor-pointer ${
                  isActive
                    ? 'bg-brand text-white font-medium shadow-xs'
                    : 'text-muted-ink hover:bg-black/5 hover:text-ink font-normal'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted-ink'}`} strokeWidth={1.75} />
                  <span className="truncate">{item.title}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Connect Section */}
        <div className="flex flex-col gap-1.5">
          <span className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-muted-ink/60 uppercase font-stenz">
            Connect
          </span>
          {connectItems.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-stenz cursor-pointer ${
                  isActive
                    ? 'bg-brand text-white font-medium shadow-xs'
                    : 'text-muted-ink hover:bg-black/5 hover:text-ink font-normal'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted-ink'}`} strokeWidth={1.75} />
                  <span className="truncate">{item.title}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Controls */}
      <div className="mt-auto pt-4 border-t border-line flex flex-col gap-1.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'logout' && onLogout) {
                  onLogout();
                } else if (item.id !== 'logout') {
                  onSelect(item.id);
                }
              }}
              type="button"
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-stenz cursor-pointer ${
                isActive
                  ? 'bg-brand text-white font-medium'
                  : 'text-muted-ink hover:bg-black/5 hover:text-ink'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SidebarNav;
