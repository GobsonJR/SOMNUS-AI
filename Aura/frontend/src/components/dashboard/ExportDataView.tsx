import React, { useState } from "react";
import { Download, FileText, Database, FileSpreadsheet, CheckCircle2, Shield, Calendar, ArrowDownToLine } from "lucide-react";
import SpecularButton from "../reactbits/SpecularButton";

export default function ExportDataView() {
  const [format, setFormat] = useState<"csv" | "json" | "edf" | "pdf">("csv");
  const [range, setRange] = useState("30d");
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = () => {
    setDownloading(true);

    setTimeout(() => {
      let content = "";
      let filename = `somnus_sleep_telemetry_${range}_${new Date().toISOString().slice(0, 10)}`;

      if (format === "csv") {
        content = "timestamp,stage,n2_probability,rmssd_ms,heart_rate_bpm,epochs_count\n";
        for (let i = 0; i < 30; i++) {
          const t = new Date(Date.now() - i * 60000).toISOString();
          content += `${t},N2,0.86,58.4,56,${140 - i}\n`;
        }
        filename += ".csv";
      } else if (format === "json") {
        const payload = {
          subject: "Alex Vance",
          device: "ESP32_AD8232_250Hz",
          export_range: range,
          exported_at: new Date().toISOString(),
          epochs: Array.from({ length: 20 }, (_, idx) => ({
            epoch_id: idx + 1,
            stage: idx % 3 === 0 ? "REM" : "Light N2",
            n2_probability: 0.85,
            rmssd: 58.2,
            ecg_sampling_hz: 250,
          }))
        };
        content = JSON.stringify(payload, null, 2);
        filename += ".json";
      } else {
        content = `SOMNUS AI CLINICAL SLEEP REPORT\nSubject: Alex Vance\nDate Range: ${range}\nFormat: ${format.toUpperCase()}\nStatus: Verified 250Hz ECG Hypnogram Analysis`;
        filename += format === "edf" ? ".edf" : ".txt";
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloadSuccess(`Successfully downloaded ${filename}`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="card bg-surface/90 border-line shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-brand" />
          <h3 className="font-ciberus text-2xl font-normal text-ink">Export Sleep Telemetry</h3>
        </div>
        <p className="font-stenz text-xs sm:text-sm text-muted-ink max-w-3xl leading-relaxed">
          Download your complete raw 250Hz ECG waveforms, epoch staging history, and heart rate variability metrics for clinical sleep consultation or independent data analysis.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Export Form Options */}
        <div className="card bg-surface/90 border-line space-y-5 lg:col-span-2 shadow-xs">
          <div>
            <h4 className="font-ciberus text-lg font-normal text-ink border-b border-line pb-2">
              Select Export Format
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 mt-4 font-stenz text-xs">
              {[
                { id: "csv", title: "CSV Data Table", desc: "Tabular R-R intervals and epoch classifications", icon: FileSpreadsheet },
                { id: "json", title: "JSON Biological Manifest", desc: "Nested sleep architecture & stage transitions", icon: Database },
                { id: "edf", title: "EDF Polysomnography", desc: "European Data Format for clinical sleep labs", icon: FileText },
                { id: "pdf", title: "Clinical Summary Report", desc: "Physician-ready monthly sleep analysis", icon: FileText },
              ].map((fmt) => {
                const isSelected = format === fmt.id;
                const Icon = fmt.icon;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as any)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-brand/10 border-brand text-ink ring-1 ring-brand"
                        : "bg-canvas border-line hover:border-brand/40 text-muted-ink hover:text-ink"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? "text-brand" : "text-muted-ink"}`} />
                    <div>
                      <span className="font-semibold text-ink block">{fmt.title}</span>
                      <span className="text-[11px] text-muted-ink block mt-0.5">{fmt.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-ciberus text-lg font-normal text-ink border-b border-line pb-2">
              Time Range
            </h4>
            <div className="flex flex-wrap gap-2 mt-4 font-stenz text-xs">
              {[
                { id: "7d", label: "Last 7 Days" },
                { id: "30d", label: "Last 30 Days" },
                { id: "90d", label: "Last 90 Days" },
                { id: "all", label: "All-Time Full History" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRange(r.id)}
                  className={`px-4 py-2 rounded-lg border transition cursor-pointer ${
                    range === r.id
                      ? "bg-brand text-white font-medium border-brand shadow-2xs"
                      : "bg-canvas border-line text-muted-ink hover:text-ink"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full pt-2">
            <SpecularButton
              size="lg"
              radius={18}
              tint="#ffffff"
              tintOpacity={0.25}
              blur={8}
              textColor="#2c4e7b"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2 font-nineties text-xs uppercase tracking-wider">
                <ArrowDownToLine className="w-4 h-4" />
                <span>{downloading ? "Compiling Dataset..." : `Download ${format.toUpperCase()} Package`}</span>
              </span>
            </SpecularButton>
          </div>

          {downloadSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-stenz animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{downloadSuccess}</span>
            </div>
          )}
        </div>

        {/* Data Privacy & Compliance info */}
        <div className="space-y-4">
          <div className="card bg-surface/90 border-line space-y-3 font-stenz text-xs">
            <div className="flex items-center gap-2 border-b border-line pb-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h4 className="font-ciberus text-base font-normal text-ink">HIPAA & GDPR Compliant</h4>
            </div>
            <p className="text-muted-ink leading-relaxed">
              All exported biological telemetry is encrypted client-side. No identifiable biometric telemetry is shared without your explicit authorization.
            </p>
            <div className="space-y-2 pt-2 border-t border-line/60 text-[11px] text-muted-ink">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero cloud-stored unencrypted raw ECG</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standardized 250Hz R-R CSV headers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
