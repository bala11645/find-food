import { useState, FormEvent } from 'react';
import { Inspector, Vendor } from '../types';
import { ClipboardList, Users, Shield, RefreshCw, UploadCloud, CheckCircle } from 'lucide-react';

interface InspectorManagementTabProps {
  inspectors: Inspector[];
  vendors: Vendor[];
  onTriggerActionToast: (msg: string) => void;
  onAuditSubmit?: (vendorId: string, score: number, remarks: string) => void;
}

export default function InspectorManagementTab({
  inspectors,
  vendors,
  onTriggerActionToast,
  onAuditSubmit
}: InspectorManagementTabProps) {
  const [selectedVendorID, setSelectedVendorID] = useState(vendors[0]?.id || '');
  const [cleanlinessScore, setCleanlinessScore] = useState(85);
  const [recommendationNotes, setRecommendationNotes] = useState('Satisfactory stainless steel counter setup. LPG line certified. Storage temperature normal.');
  const [submitting, setSubmitting] = useState(false);

  // Filter approved or active vendor stalls for the inspector review
  const availableStallsForAudit = vendors.filter((v) => v.status === 'Active' || v.status === 'Pending');

  const handleSimulateReportSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedVendorID) {
      onTriggerActionToast('Error: Please select a vendor stall first.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const targetStall = vendors.find((v) => v.id === selectedVendorID);
      const stallLabel = targetStall ? targetStall.stallName : selectedVendorID;

      if (onAuditSubmit) {
        onAuditSubmit(selectedVendorID, cleanlinessScore, recommendationNotes);
      }
      onTriggerActionToast(`FSSAI Compliance report logged for "${stallLabel}" with high hygiene index!`);
      // Reset
      setRecommendationNotes('');
    }, 850);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          FIELD INSPECTION MANAGEMENT
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Field Health Inspectors</h2>
        <p className="text-xs text-slate-400">
          Coordinate FSSAI-certified field personnel, review scheduled sanitary visits, and file digital audit briefs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Worker list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide border-b border-slate-850 pb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> Administrative Field Workforce
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspectors.map((ins) => (
              <div
                key={ins.id}
                className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden group hover:border-slate-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-2.5xl p-2 bg-[#0b0f19] rounded-xl border border-slate-800 shadow">
                      {ins.avatar}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-100">{ins.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">UID: {ins.id}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-950/40 px-2 py-0.5 rounded uppercase font-bold">
                    ACTIVE FIELD
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-850/60 pt-3">
                  <div>
                    <span className="text-slate-500 block">Current Location:</span>
                    <span className="text-slate-200 font-medium text-[11px] block truncate">{ins.currentZone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Completed Inspections:</span>
                    <span className="text-slate-200 font-semibold text-[11px] font-mono">{ins.completedVisits} runs</span>
                  </div>
                </div>

                {/* Assigned list */}
                <div className="space-y-1 bg-[#0b0f19] p-3 rounded-lg border border-slate-850">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                    Under monitoring
                  </span>
                  <div className="text-[10.5px] text-slate-350 flex flex-wrap gap-1 mt-1">
                    {ins.assignedVendors.map((vId) => {
                      const vObj = vendors.find((v) => v.id === vId);
                      return (
                        <span key={vId} className="bg-[#1e293b] px-1.5 py-0.5 rounded text-[9.5px]">
                          {vObj ? vObj.stallName : vId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upload report simulation */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-emerald-400 animate-bounce" />
              File Sanitary Audit Brief
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Mock input tool simulation for field workers</p>
          </div>

          <form onSubmit={handleSimulateReportSubmit} className="space-y-4">
            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Target Street Stall Location
              </label>
              <select
                value={selectedVendorID}
                onChange={(e) => setSelectedVendorID(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-850 text-xs text-slate-250 p-2.5 rounded-xl outline-none"
                required
              >
                <option value="" disabled>Select active stall...</option>
                {availableStallsForAudit.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.stallName} ({s.nearbyFoodStreet.substring(0, 15)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1 text-slate-400 uppercase tracking-wider">
                <span>Sanitary Cleanliness Score</span>
                <span className="text-emerald-450 font-bold">{cleanlinessScore}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={cleanlinessScore}
                onChange={(e) => setCleanlinessScore(parseInt(e.target.value))}
                className="w-full text-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Compliance Officer Logs & Findings
              </label>
              <textarea
                value={recommendationNotes}
                onChange={(e) => setRecommendationNotes(e.target.value)}
                className="w-full h-24 bg-[#0b0f19] border border-slate-850 text-xs text-slate-200 p-2.5 rounded-xl outline-none resize-none"
                placeholder="Remarks, safety devices, water purification check status..."
                required
              ></textarea>
            </div>

            {/* Photo upload simulated module */}
            <div className="border border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center cursor-pointer bg-[#0b0f19]/40 transition">
              <UploadCloud className="w-6 h-6 text-slate-500 mx-auto" />
              <span className="text-[10px] font-semibold text-slate-300 block mt-1">Upload Stall Photo Evidences</span>
              <span className="text-[9px] text-slate-500 font-mono block mt-0.5">Accepts kitchen, counter PNG (Max 1MB)</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              {submitting ? 'Transmitting to Server...' : 'Submit Certified Audit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
