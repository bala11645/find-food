import { useState } from 'react';
import { Vendor, Inspector } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  CheckCircle,
  XCircle,
  FileText,
  UserCheck,
  ClipboardList,
  UserPlus,
  Compass,
  AlertTriangle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface VendorApprovalTabProps {
  vendors: Vendor[];
  inspectors: Inspector[];
  onApproveVendor: (id: string) => void;
  onRejectVendor: (id: string, reason?: string) => void;
  onUpdateStatus: (id: string, status: any, onboarding: any) => void;
  onAssignInspector: (vendorId: string, inspectorName: string) => void;
  onViewDetail: (id: string) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function VendorApprovalTab({
  vendors,
  inspectors,
  onApproveVendor,
  onRejectVendor,
  onUpdateStatus,
  onAssignInspector,
  onViewDetail,
  onTriggerActionToast
}: VendorApprovalTabProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    vendorId: string | null;
    stallName: string;
  }>({
    isOpen: false,
    type: 'approve',
    vendorId: null,
    stallName: ''
  });

  // Pending queue entries
  const pendingVendors = vendors.filter(
    (v) => v.onboardingStatus === 'Pending' || v.onboardingStatus === 'Needs Docs'
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block">
          CRITICAL REGULATORY SYSTEM
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Vendor Onboarding Queue</h2>
        <p className="text-xs text-slate-400">
          Verify digital licenses, AI-driven risk signals, and photos before authorizing commercial platform presence.
        </p>
      </div>

      {pendingVendors.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-slate-200 font-semibold">Queue Fully Cleared</h3>
          <p className="text-xs text-slate-500 mt-2">No vendors awaiting administrative onboarding or document audit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingVendors.map((vendor) => {
            let riskBadgeColor = 'bg-green-500/10 text-green-400 border-green-500/20';
            if (vendor.riskLevel === 'High') riskBadgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/25';
            else if (vendor.riskLevel === 'Medium') riskBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

            return (
              <div
                key={vendor.id}
                className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between"
              >
                {/* Card header banner */}
                <div className="p-5 border-b border-slate-850 bg-slate-900/60">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-slate-100 flex items-center gap-1.5">
                        {vendor.stallName}
                        {vendor.isTrustedBadge && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Trusted Badge Candidate"></span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-420 font-medium font-mono text-emerald-400 mt-0.5">
                        {vendor.category}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono border uppercase px-2 py-0.5 rounded-full font-bold ${riskBadgeColor}`}>
                      {vendor.riskLevel} Risk
                    </span>
                  </div>

                  {/* Onboarding status badge */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="text-[10px] font-mono text-slate-400">Current Status:</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        vendor.onboardingStatus === 'Needs Docs'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {vendor.onboardingStatus}
                    </span>
                  </div>
                </div>

                {/* Info parameters */}
                <div className="p-5 space-y-4">
                  {/* Metadata fields */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block font-mono text-[9px] uppercase tracking-wider">Owner name</span>
                      <span className="text-slate-300 font-medium">{vendor.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-mono text-[9px] uppercase tracking-wider">Phone contact</span>
                      <span className="text-slate-300 font-medium font-mono">{vendor.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block font-mono text-[9px] uppercase tracking-wider">Stall location</span>
                      <span className="text-slate-300 font-medium leading-tight block">{vendor.location}</span>
                    </div>
                  </div>

                  {/* Documents section */}
                  <div className="bg-[#0b0f19] border border-slate-850 p-3 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500" /> Digital Document Proofs
                    </span>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2 py-1 rounded bg-[#0f172a] text-slate-300 font-mono border border-slate-800">
                        License: {vendor.documents.license}
                      </span>
                      <span className="px-2 py-1 rounded bg-[#0f172a] text-slate-300 font-mono border border-slate-800">
                        ID: {vendor.documents.idProof}
                      </span>
                      {vendor.documents.gst && (
                        <span className="px-2 py-1 rounded bg-[#0f172a] text-emerald-400 font-mono border border-emerald-950/40">
                          GST: {vendor.documents.gst} (Registered)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI computer vision photo insights */}
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Photo Screening Insights
                    </span>
                    <p className="text-[11px] text-slate-300 italic mt-1.5 leading-relaxed">
                      "Stall kitchen view shows: {vendor.photos.kitchen.substring(0,68)}..."
                    </p>
                    {vendor.aiFlags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {vendor.aiFlags.map((flag, idx) => (
                          <span
                            key={idx}
                            className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded text-[9px] flex items-center gap-1 font-mono"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" /> {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Card Action Footer */}
                <div className="p-5 border-t border-slate-850 bg-slate-900/20 flex flex-col gap-4">
                  {/* Inspector allocation drawer */}
                  <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2 bg-[#0b0f19] p-3 rounded-xl border border-slate-850">
                    <span className="text-[10px] font-mono text-slate-400">Review & Verify Task:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          onAssignInspector(vendor.id, e.target.value);
                        }
                      }}
                      className="text-xs bg-[#0f172a] border border-slate-800 rounded px-2.5 py-1 text-slate-300 outline-none w-full sm:w-auto"
                      defaultValue=""
                    >
                      <option value="" disabled>Assign inspector...</option>
                      {inspectors.map((ins) => (
                        <option key={ins.id} value={ins.name}>
                          {ins.name} ({ins.currentZone.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action core buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setModalState({
                        isOpen: true,
                        type: 'approve',
                        vendorId: vendor.id,
                        stallName: vendor.stallName
                      })}
                      className="flex-1 min-w-[90px] py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Vendor
                    </button>
                    <button
                      onClick={() => {
                        onUpdateStatus(vendor.id, 'Pending', 'Needs Docs');
                        onTriggerActionToast(`Documents request sent to "${vendor.stallName}". Status changed.`);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition border border-slate-750"
                    >
                      Request Docs
                    </button>
                    <button
                      onClick={() => setModalState({
                        isOpen: true,
                        type: 'reject',
                        vendorId: vendor.id,
                        stallName: vendor.stallName
                      })}
                      className="py-2 px-3 rounded-xl bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-rose-450 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition border border-[#ef4444]/10"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => onViewDetail(vendor.id)}
                      className="py-2 px-2.5 rounded-xl bg-[#0b0f19] hover:bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1 cursor-pointer transition"
                      title="Open Profile Audits"
                    >
                      Audits <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REUSABLE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (!modalState.vendorId) return;
          if (modalState.type === 'approve') {
            onApproveVendor(modalState.vendorId);
            onTriggerActionToast(`Vendor "${modalState.stallName}" onboarding application approved successfully! Permit activated.`);
          } else {
            onRejectVendor(modalState.vendorId, 'Unacceptable health risk level');
            onTriggerActionToast(`Vendor onboarding rejected for "${modalState.stallName}". License marked suspended.`);
          }
        }}
        title={modalState.type === 'approve' ? 'Approve Commercial Food License?' : 'Reject Food Court Application?'}
        message={
          modalState.type === 'approve'
            ? `Are you sure you want to approve "${modalState.stallName}"? This will activate their FSSAI automated commercial permissions and open their listings live.`
            : `Are you sure you want to reject "${modalState.stallName}"? This will deny their permit request, place their application in rejected status, and notify the stall representative.`
        }
        confirmText={modalState.type === 'approve' ? 'Approve Stalls' : 'Reject & Notify'}
        type={modalState.type}
      />
    </div>
  );
}
