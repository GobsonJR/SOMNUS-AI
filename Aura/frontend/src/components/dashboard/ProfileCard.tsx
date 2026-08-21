import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  KeyRound, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle2, 
  Edit3, 
  Activity,
  Heart,
  Radio,
  Moon,
  Sparkles
} from "lucide-react";
import SpecularButton from "../reactbits/SpecularButton";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis 
} from "recharts";

// Generate live single-lead ECG pulse for profile live session
const generateMiniECG = () => {
  const points = [];
  for (let i = 0; i < 28; i++) {
    let v = Math.sin(i * 0.6) * 12 + 25;
    if (i % 6 === 0) v = 95; // QRS R-peak
    else if (i % 6 === 1) v = 5;
    points.push({ index: i, val: Math.round(v) });
  }
  return points;
};

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Alex Vance");
  const [userId, setUserId] = useState("alexvance");
  const [age, setAge] = useState("28");
  const [email, setEmail] = useState("alex.vance@somnus.ai");
  const [phone, setPhone] = useState("+1 (555) 234-8901");
  const [bio, setBio] = useState("Sleep tracking enthusiast. Optimizing circadian rhythms and REM architecture.");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Live session telemetry values
  const [ecgMini, setEcgMini] = useState(generateMiniECG);
  const [hrBpm, setHrBpm] = useState(60);
  const [hrvMs, setHrvMs] = useState(64);
  const [rrIntervalMs, setRrIntervalMs] = useState(982);
  const [rmssdMs, setRmssdMs] = useState(58.4);
  const [currentTimeStr, setCurrentTimeStr] = useState(() => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("somnus_user_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setName(parsed.name);
        if (parsed.userId) setUserId(parsed.userId);
        if (parsed.age) setAge(parsed.age);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.bannerUrl) setBannerUrl(parsed.bannerUrl);
        if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
      }
    } catch {}
  }, []);

  // Real-time live session telemetry ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setHrBpm(Math.round(59 + Math.random() * 3));
      setHrvMs(Math.round(62 + Math.random() * 5));
      setRrIntervalMs(Math.round(975 + Math.random() * 15));
      setRmssdMs(Number((57.5 + Math.random() * 2.0).toFixed(1)));

      setEcgMini(prev => {
        const nextIdx = prev.length > 0 ? prev[prev.length - 1].index + 1 : 0;
        let v = Math.sin(nextIdx * 0.6) * 12 + 25;
        if (nextIdx % 6 === 0) v = 95;
        else if (nextIdx % 6 === 1) v = 5;
        return [...prev.slice(1), { index: nextIdx, val: Math.round(v) }];
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setAvatarUrl(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setBannerUrl(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    setSaveStatus("Profile and custom banner updated successfully.");
    try {
      localStorage.setItem(
        "somnus_user_profile",
        JSON.stringify({ name, userId, age, email, phone, bio, bannerUrl, avatarUrl })
      );
    } catch {}
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordStatus("New passwords do not match.");
      return;
    }
    setPasswordStatus("Password changed securely.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setPasswordStatus(null);
      setIsChangingPassword(false);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Profile Card with Working Banner & Avatar Upload */}
      <div className="card bg-surface/90 border-line shadow-xs overflow-hidden p-0">
        {/* Banner Cover with direct image display */}
        <div 
          className="h-44 sm:h-56 w-full relative flex items-end justify-end p-4 bg-slate-800"
          style={
            bannerUrl 
              ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "linear-gradient(135deg, #1E293B 0%, #2C4E7B 50%, #0F172A 100%)" }
          }
        >
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-stenz cursor-pointer hover:bg-black/80 transition"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Banner</span>
              </button>
              <input 
                ref={bannerInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleBannerFile} 
                className="hidden" 
              />
              {bannerUrl && (
                <button
                  type="button"
                  onClick={() => setBannerUrl("")}
                  className="px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs hover:bg-black/80"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Details Header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            {/* Avatar */}
            <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-canvas border-4 border-surface shadow-md overflow-hidden shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-brand to-sky-700 text-white flex items-center justify-center text-3xl font-bold font-jeanoti">
                  {name.charAt(0)}
                </div>
              )}

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white cursor-pointer opacity-90 hover:opacity-100 transition"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[9px] uppercase tracking-wider font-stenz mt-1">Upload</span>
                  </button>
                  <input 
                    ref={avatarInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarFile} 
                    className="hidden" 
                  />
                </>
              )}
            </div>

            {/* Specular Action Buttons */}
            <div className="flex items-center gap-2.5">
              {isEditing ? (
                <>
                  <SpecularButton
                    size="sm"
                    radius={16}
                    tint="#ffffff"
                    tintOpacity={0.1}
                    blur={6}
                    textColor="#64748b"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </SpecularButton>
                  <SpecularButton
                    size="sm"
                    radius={16}
                    tint="#ffffff"
                    tintOpacity={0.25}
                    blur={8}
                    textColor="#2c4e7b"
                    onClick={handleSaveProfile}
                  >
                    Save Profile
                  </SpecularButton>
                </>
              ) : (
                <SpecularButton
                  size="sm"
                  radius={16}
                  tint="#ffffff"
                  tintOpacity={0.2}
                  blur={8}
                  textColor="#2c4e7b"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </span>
                </SpecularButton>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div>
              {isEditing ? (
                <div className="grid gap-3 sm:grid-cols-2 max-w-lg">
                  <div>
                    <label className="text-[11px] font-stenz uppercase tracking-wider text-muted-ink block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm font-semibold rounded-md border border-line bg-canvas text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-stenz uppercase tracking-wider text-muted-ink block mb-1">User ID</label>
                    <div className="flex items-center rounded-md border border-line bg-canvas px-3 py-1.5 text-sm">
                      <span className="text-muted-ink mr-0.5">@</span>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full bg-transparent text-ink font-mono text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="font-ciberus text-2xl sm:text-3xl font-normal text-ink leading-tight">
                    {name}
                  </h2>
                  <span className="font-mono text-xs text-muted-ink">@{userId}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              {isEditing ? (
                <div>
                  <label className="text-[11px] font-stenz uppercase tracking-wider text-muted-ink block mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-md border border-line bg-canvas text-ink font-stenz resize-none"
                  />
                </div>
              ) : (
                <p className="font-stenz text-xs sm:text-sm text-muted-ink leading-relaxed max-w-2xl">
                  {bio}
                </p>
              )}
            </div>

            {/* Registration Details Grid */}
            <div className="grid gap-3 sm:grid-cols-3 pt-3 border-t border-line font-stenz text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-canvas border border-line">
                <Calendar className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <span className="text-[10px] uppercase text-muted-ink block">Age</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-16 px-1.5 py-0.5 text-xs font-semibold rounded border border-line bg-surface text-ink"
                    />
                  ) : (
                    <span className="font-semibold text-ink">{age} years old</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-canvas border border-line">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase text-muted-ink block">Email</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-1.5 py-0.5 text-xs font-semibold rounded border border-line bg-surface text-ink"
                    />
                  ) : (
                    <span className="font-semibold text-ink truncate block">{email}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-canvas border border-line">
                <Phone className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <span className="text-[10px] uppercase text-muted-ink block">Phone</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-1.5 py-0.5 text-xs font-semibold rounded border border-line bg-surface text-ink"
                    />
                  ) : (
                    <span className="font-semibold text-ink">{phone}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {saveStatus && (
          <div className="mx-6 mb-6 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-stenz flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* 2. LIVE SESSION TELEMETRY (Single-Lead ECG, HRV, RR Interval, RMSSD) */}
      <div className="card bg-surface/90 border-line shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-stenz text-xs uppercase tracking-wider text-brand font-semibold block">
                Live Sleep Session
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="font-ciberus text-2xl text-ink font-normal">{currentTimeStr}</h3>
                <span className="font-stenz text-xs text-muted-ink">asleep 7h 54m</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-emerald-50 text-emerald-800 text-xs font-stenz font-medium border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Optimal Autonomic State
            </span>
          </div>
        </div>

        {/* Live Metrics Grid: Single-Lead ECG & Autonomic Staging */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mini Single-lead ECG Stream */}
          <div className="p-4 rounded-2xl bg-canvas border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-stenz">
              <span className="text-muted-ink font-medium">Single-Lead ECG Stream</span>
              <span className="flex items-center gap-1 text-rose-600 font-semibold font-mono">
                <Heart className="w-3.5 h-3.5 fill-rose-600 animate-pulse" />
                <span>{hrBpm} bpm</span>
              </span>
            </div>

            <div className="w-full h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ecgMini} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <YAxis domain={[0, 100]} hide />
                  <Line type="monotone" dataKey="val" stroke="#2C4E7B" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Autonomic Tone & N2 Probability Indicator */}
          <div className="p-4 rounded-2xl bg-canvas border border-line flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-line" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-brand" strokeDasharray="67, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-bold text-ink leading-none font-mono">67%</span>
                <span className="text-[8px] text-muted-ink uppercase font-stenz">N2 Prob</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-ink font-stenz block">Monitoring Autonomic Staging</span>
              <span className="text-[11px] text-muted-ink font-stenz block">Stage now: <strong className="text-brand">Light N2</strong></span>
              <span className="text-[10px] text-emerald-700 font-medium font-stenz block">Stable cardiac delta suppression</span>
            </div>
          </div>
        </div>

        {/* Real-time Vital Metrics: HRV, RR Interval, RMSSD */}
        <div className="grid gap-3 sm:grid-cols-3 font-stenz">
          <div className="p-3.5 rounded-xl bg-canvas border border-line">
            <span className="text-[10px] uppercase text-muted-ink font-medium block">HRV (Heart Rate Var)</span>
            <p className="mt-1 font-mono text-xl font-semibold text-ink">{hrvMs} <span className="text-xs font-normal text-muted-ink">ms</span></p>
            <span className="text-[10px] text-emerald-700 font-medium">High parasympathetic response</span>
          </div>

          <div className="p-3.5 rounded-xl bg-canvas border border-line">
            <span className="text-[10px] uppercase text-muted-ink font-medium block">R-R Peak Interval</span>
            <p className="mt-1 font-mono text-xl font-semibold text-ink">{rrIntervalMs} <span className="text-xs font-normal text-muted-ink">ms</span></p>
            <span className="text-[10px] text-brand font-medium">Synchronized sinus rhythm</span>
          </div>

          <div className="p-3.5 rounded-xl bg-canvas border border-line">
            <span className="text-[10px] uppercase text-muted-ink font-medium block">RMSSD Autonomic Tone</span>
            <p className="mt-1 font-mono text-xl font-semibold text-ink">{rmssdMs} <span className="text-xs font-normal text-muted-ink">ms</span></p>
            <span className="text-[10px] text-emerald-700 font-medium">Optimal light sleep threshold</span>
          </div>
        </div>

        {/* Tonight's Hypnogram Sleep Architecture Timeline Bar */}
        <div className="p-4 rounded-2xl bg-canvas border border-line space-y-2 font-stenz text-xs">
          <div className="flex items-center justify-between text-muted-ink">
            <span className="font-semibold text-ink">Tonight's Hypnogram Architecture</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand" /> N2 Light Stable</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#A8C4E8]" /> Non-N2</span>
            </div>
          </div>

          <div className="w-full h-4 rounded-full overflow-hidden flex bg-line">
            <div className="h-full bg-[#2C4E7B]" style={{ width: "55%" }} title="N2 Light Sleep (55%)" />
            <div className="h-full bg-[#A8C4E8]" style={{ width: "35%" }} title="Non-N2 Deep/REM (35%)" />
            <div className="h-full bg-[#2C4E7B]" style={{ width: "10%" }} title="N2 Light Awakening (10%)" />
          </div>

          <div className="flex justify-between text-[10px] text-muted-ink font-mono">
            <span>5:15 AM (Sleep onset)</span>
            <span>{currentTimeStr} (Current stage)</span>
          </div>
        </div>
      </div>

      {/* 3. Security & Password Management */}
      <div className="card bg-surface/90 border-line shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand" />
            <h3 className="font-ciberus text-lg font-normal text-ink">Account Security</h3>
          </div>

          {!isChangingPassword && (
            <SpecularButton
              size="sm"
              radius={14}
              tint="#ffffff"
              tintOpacity={0.15}
              blur={6}
              textColor="#2c4e7b"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </SpecularButton>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-3 font-stenz text-xs max-w-md animate-in fade-in">
            <div>
              <label className="block text-muted-ink uppercase tracking-wider mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-ink"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-muted-ink uppercase tracking-wider mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-ink"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-muted-ink uppercase tracking-wider mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-line bg-canvas text-ink"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <SpecularButton
                size="sm"
                radius={14}
                tint="#ffffff"
                tintOpacity={0.25}
                blur={8}
                textColor="#2c4e7b"
                type="submit"
              >
                Update Password
              </SpecularButton>
              <SpecularButton
                size="sm"
                radius={14}
                tint="#ffffff"
                tintOpacity={0.1}
                blur={6}
                textColor="#64748b"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancel
              </SpecularButton>
            </div>

            {passwordStatus && (
              <div className="p-2.5 rounded-md bg-canvas border border-line text-xs font-stenz text-ink">
                {passwordStatus}
              </div>
            )}
          </form>
        ) : (
          <p className="font-stenz text-xs text-muted-ink">
            Two-factor authentication is active on device.
          </p>
        )}
      </div>
    </div>
  );
}
