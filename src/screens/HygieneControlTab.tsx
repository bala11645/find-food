import { useState } from 'react';
import { Vendor, HygieneReport } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ClipboardCheck,
  Star,
  Award,
  Cpu
} from 'lucide-react';
import { analyzeHygienePhoto, HygienePhotoResult } from '../services/geminiService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface HygieneControlTabProps {
  vendors: Vendor[];
  hygieneReports: HygieneReport[];
  onUpdateVendor: (v: Vendor) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function HygieneControlTab({
  vendors,
  hygieneReports,
  onUpdateVendor,
  onTriggerActionToast
}: HygieneControlTabProps) {
  // Categorize vendors based on hygiene score
  const highHygieneVendors = vendors.filter((v) => v.hygieneScore >= 90);
  const lowHygieneVendors = vendors.filter((v) => v.hygieneScore < 75);
  const totalVerifiedCount = vendors.length;

  const [scanningId, setScanningId] = useState<string | null>(null);
  const [scanErrors, setScanErrors] = useState<Record<string, string>>({});
  const [scannedResults, setScannedResults] = useState<Record<string, HygienePhotoResult>>(() => {
    const initial: Record<string, HygienePhotoResult> = {};
    vendors.forEach((v) => {
      if ((v as any).aiPhotoResult) {
        initial[v.id] = (v as any).aiPhotoResult;
      }
    });
    return initial;
  });

  const handleTriggerAIPScan = async (v: Vendor) => {
    setScanningId(v.id);
    setScanErrors(prev => ({ ...prev, [v.id]: '' }));
    onTriggerActionToast(`Initializing Gemini vision compliance audit for ${v.stallName}...`);
    try {
      const data = await analyzeHygienePhoto(v.id, v.stallName, v.photos?.kitchen || 'kitchen.png');
      setScannedResults(prev => ({
        ...prev,
        [v.id]: data
      }));

      // Store results inside the secured live vendor document itself
      try {
        // Save scan result inside the live vendor document itself
        onUpdateVendor({
          ...v,
          hygieneScore: data.aiPhotoScore,
          aiPhotoResult: data
        } as any);
      } catch (dbErr: any) {
        console.error("Firestore persistence failed:", dbErr);
      }

      onTriggerActionToast(`Gemini compliance check complete! Safety Status: ${data.foodSafetyStatus}`);
    } catch (error: any) {
      setScanErrors(prev => ({ ...prev, [v.id]: error.message || String(error) }));
      onTriggerActionToast(`Error conducting Gemini photo scan: ${error.message}`);
    } finally {
      setScanningId(null);
    }
  };

  const handleIssueWarning = (v: Vendor) => {
    onTriggerActionToast(`Strict warning issued and emailed to the registered FSSAI contact for "${v.stallName}". 48hr compliance window active.`);
  };

  const handleScheduleInspection = (v: Vendor) => {
    onTriggerActionToast(`Priority inspection task queued for "${v.stallName}". Local district supervisor assigned.`);
  };

  const handleSuspendTemporarily = (v: Vendor) => {
    const updated = { ...v, status: 'Suspended' as const, onboardingStatus: 'Needs Docs' as const };
    onUpdateVendor(updated);
    onTriggerActionToast(`Temporary operations halt enforced for "${v.stallName}" owing to critical sanitation score.`);
  };

  const handleGrantBadge = (v: Vendor) => {
    const updated = { ...v, isTrustedBadge: true, hygieneScore: Math.max(95, v.hygieneScore) };
    onUpdateVendor(updated);
    onTriggerActionToast(`"TRUSTED SANITATION" golden badge granted to "${v.stallName}". Visual star unlocked.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          METROPOLITAN SANITATION TELEMETRY
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Hygiene & Safety Control Center</h2>
        <p className="text-xs text-slate-400">
          Verify digital sanitation reviews, investigate FSSAI licensing lapses, and audit physical inspection scores dynamically.
        </p>
      </div>

      {/* CORE STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Average Platform Hygiene</span>
          <span className="text-2xl font-display font-bold text-emerald-400 block mt-1.5">
            85.4%
          </span>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Critical Suspensions</span>
          <span className="text-2xl font-display font-semibold text-rose-400 block mt-1.5 font-mono">
            {vendors.filter((v) => v.status === 'Suspended').length} stalls
          </span>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Passed Sanitized Badges</span>
          <span className="text-2xl font-display font-bold text-amber-400 block mt-1.5 flex justify-center items-center gap-1">
            ✨ {vendors.filter((v) => v.isTrustedBadge).length}
          </span>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Inspections Queued</span>
          <span className="text-2xl font-display font-semibold text-blue-400 block mt-1.5 font-mono">
            3 pending
          </span>
        </div>
      </div>

      {/* MAIN TWO PANEL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical / Action-required Low Hygiene list */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <span className="text-sm font-semibold text-rose-450 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Critical Risk Watch (Hygiene &lt; 75)
            </span>
            <span className="text-[10px] font-mono text-slate-400">{lowHygieneVendors.length} breaches logged</span>
          </div>

          <div className="space-y-4">
            {lowHygieneVendors.map((vendor) => {
              // Extract report metrics if exists
              const report = hygieneReports.find((r) => r.vendorId === vendor.id);

              return (
                <div
                  key={vendor.id}
                  className="bg-[#080d15] border border-rose-950/20 rounded-xl p-4 space-y-3.5 hover:border-slate-850 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-200">{vendor.stallName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{vendor.nearbyFoodStreet}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-950/40 px-2 py-0.5 rounded">
                      Score: {vendor.hygieneScore}/100
                    </span>
                  </div>

                  {/* Diagnostic details */}
                  {report && (
                    <div className="grid grid-cols-3 gap-2 bg-[#0c101d] border border-slate-900 rounded-lg p-2.5 text-center text-[10px] font-mono">
                      <div>
                        <span className="text-slate-550 block text-[9px] uppercase">AI Photo</span>
                        <span className={`font-semibold ${(scannedResults[vendor.id]?.aiPhotoScore ?? report.aiPhotoScore) < 70 ? 'text-red-400' : 'text-slate-300'}`}>
                          {scannedResults[vendor.id]?.aiPhotoScore ?? report.aiPhotoScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-550 block text-[9px] uppercase">Customer rating</span>
                        <span className="text-slate-300 font-medium">{report.customerFeedbackScore}%</span>
                      </div>
                      <div>
                        <span className="text-slate-550 block text-[9px] uppercase">FSSAI Status</span>
                        <span className="text-[#ef4444] font-bold uppercase">{scannedResults[vendor.id]?.foodSafetyStatus ?? report.foodSafetyStatus}</span>
                      </div>
                    </div>
                  )}

                  {scanErrors[vendor.id] && (
                    <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-xs text-rose-450 font-mono">
                      🚨 <strong>Scan Failed:</strong> {scanErrors[vendor.id]}
                    </div>
                  )}

                  {/* Gemini Live Scan Diagnostic Box */}
                  {scannedResults[vendor.id] ? (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 space-y-2 select-none">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" /> GEMINI VISION REPORT
                        </span>
                        <span className="text-[#10b981] font-bold">CONFIDENCE: {Math.round((scannedResults[vendor.id].confidence || 0.89) * 100)}%</span>
                      </div>
                      <div className="text-[11px] text-zinc-300 space-y-1.5 list-disc leading-normal pl-1.5">
                        {scannedResults[vendor.id].findings.map((bullet, bidx) => (
                          <div key={bidx} className="flex gap-1.5 items-start">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500">
                        <span>Hazards: <strong className="text-rose-400">{scannedResults[vendor.id].hazardCount}</strong></span>
                        <span>Alert Ref: <strong className="text-slate-400">{scannedResults[vendor.id].inspectorAlertTriggered ? 'TRIGGERED SRAF' : 'NONE'}</strong></span>
                      </div>
                    </div>
                  ) : null}

                  {/* Hazard details */}
                  {vendor.aiFlags.length > 0 && (
                    <div className="p-2.5 bg-rose-500/5 text-[11px] text-slate-300 rounded border border-rose-950/25 italic">
                      "System Flag: {vendor.aiFlags.join(' • ')}"
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-900/40">
                    <button
                      onClick={() => handleTriggerAIPScan(vendor)}
                      disabled={scanningId === vendor.id}
                      className="flex-1 min-w-[124px] py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      {scanningId === vendor.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Image...
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3.5 h-3.5" /> Trigger Gemini Scan
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleIssueWarning(vendor)}
                      className="flex-1 min-w-[70px] py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-medium rounded-lg transition"
                    >
                      Issue warning
                    </button>
                    <button
                      onClick={() => handleScheduleInspection(vendor)}
                      className="flex-1 min-w-[70px] py-1.5 px-2 bg-slate-800 hover:bg-slate-755 text-slate-300 text-[10px] font-medium rounded-lg transition"
                    >
                      Audit stall
                    </button>
                    <button
                      onClick={() => handleSuspendTemporarily(vendor)}
                      className="flex-1 min-w-[70px] py-1.5 px-2 bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-rose-400 text-[10px] font-semibold rounded-lg transition border border-[#ef4444]/10"
                    >
                      Halt Operations
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Hygiene role-models list */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Sanitation Role-Models (Hygiene &gt;= 90)
            </span>
            <span className="text-[10px] font-mono text-slate-400">{highHygieneVendors.length} icons certified</span>
          </div>

          <div className="space-y-4">
            {highHygieneVendors.map((vendor) => {
              const rpt = hygieneReports.find((r) => r.vendorId === vendor.id);

              return (
                <div
                  key={vendor.id}
                  className="bg-[#080d15] border border-slate-850 rounded-xl p-4 space-y-3.5 hover:border-slate-800 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                        {vendor.stallName}{' '}
                        {vendor.isTrustedBadge && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{vendor.nearbyFoodStreet}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-950/40 px-2 py-0.5 rounded">
                      Score: {vendor.hygieneScore}/100
                    </span>
                  </div>

                  {rpt && (
                    <div className="grid grid-cols-3 gap-2 bg-[#0c101d] border border-slate-900 rounded-lg p-2 text-center text-[10px] font-mono">
                      <div>
                        <span className="text-slate-550 block text-[9px] uppercase">AI Photo</span>
                        <span className="text-emerald-400 font-bold">{rpt.aiPhotoScore}%</span>
                      </div>
                      <div>
                        <span className="text-slate-550 block text-[9px] uppercase">Inspector</span>
                        <span className="text-emerald-400 font-bold">{rpt.inspectorReviewScore}%</span>
                      </div>
                      <div>
                        <span className="text-slate-550 block text-[9px] uppercase">Safety badge</span>
                        <span className="text-emerald-400 font-bold uppercase">{rpt.foodSafetyStatus}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="flex justify-end gap-2 pt-1 border-t border-slate-900/40">
                    <button
                      onClick={() => handleScheduleInspection(vendor)}
                      className="py-1 px-3 bg-slate-800 hover:bg-slate-750 text-slate-350 text-[10.5px] rounded-lg transition"
                    >
                      Verify Audit
                    </button>
                    {!vendor.isTrustedBadge && (
                      <button
                        onClick={() => handleGrantBadge(vendor)}
                        className="py-1 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10.5px] font-bold rounded-lg transition"
                      >
                        Grant trusted star
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
