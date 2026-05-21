import { useState, useEffect } from 'react';
import { Vendor } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  MapPin,
  Flame,
  Award,
  RefreshCw,
  FolderLock,
  Cpu
} from 'lucide-react';
import { getVendorRiskScore, VendorRiskResult } from '../services/geminiService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface VendorDetailTabProps {
  vendors: Vendor[];
  selectedVendorId: string | null;
  onUpdateVendor: (vendor: Vendor) => void;
  onBackToManagement: () => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function VendorDetailTab({
  vendors,
  selectedVendorId,
  onUpdateVendor,
  onBackToManagement,
  onTriggerActionToast
}: VendorDetailTabProps) {
  // If no vendor is currently active, default to the first one for demonstration
  const activeId = selectedVendorId || vendors[0]?.id;
  const vendor = vendors.find((v) => v.id === activeId);

  // Local state edit fields
  const [editedCategory, setEditedCategory] = useState(vendor?.category || '');
  const [editedStatus, setEditedStatus] = useState(vendor?.status || 'Active');
  const [editedOnboarding, setEditedOnboarding] = useState(vendor?.onboardingStatus || 'Approved');

  const [checkingRisk, setCheckingRisk] = useState(false);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<VendorRiskResult | null>((vendor as any)?.aiRiskAssessment || null);

  useEffect(() => {
    if (vendor) {
      setEditedCategory(vendor.category || '');
      setEditedStatus(vendor.status || 'Active');
      setEditedOnboarding(vendor.onboardingStatus || 'Approved');
      setRiskAssessment((vendor as any).aiRiskAssessment || null);
      setRiskError(null);
    }
  }, [vendor?.id]);

  const handleRunAIScoring = async () => {
    if (!vendor) return;
    setCheckingRisk(true);
    setRiskError(null);
    onTriggerActionToast(`Injecting telemetry to Gemini model for compliance audit...`);
    try {
      const data = await getVendorRiskScore(
        vendor.id,
        vendor.stallName,
        vendor.hygieneScore,
        vendor.onboardingStatus,
        vendor.aiFlags.length
      );
      setRiskAssessment(data);

      // Store in verified vendors record
      try {
        // Update local/global vendor record
        onUpdateVendor({
          ...vendor,
          aiRiskAssessment: data
        } as any);
      } catch (dbErr: any) {
        console.error("Firestore save failure:", dbErr);
      }

      onTriggerActionToast(`Gemini compliance score generated successfully!`);
    } catch (error: any) {
      setRiskError(error.message || String(error));
      onTriggerActionToast(`Scoring Error: ${error.message}`);
    } finally {
      setCheckingRisk(false);
    }
  };

  if (!vendor) {
    return (
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 text-center">
        <p className="text-slate-400">No active vendor selected. Please browse the register on the Vendors list.</p>
        <button
          onClick={onBackToManagement}
          className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  // Action handlers
  const handleToggleTrustedBadge = () => {
    const updated = { ...vendor, isTrustedBadge: !vendor.isTrustedBadge };
    onUpdateVendor(updated);
    onTriggerActionToast(`Trusted badge status updated for ${vendor.stallName}.`);
  };

  const handleVerifyVendor = () => {
    const updated = {
      ...vendor,
      onboardingStatus: 'Approved' as const,
      status: 'Active' as const,
      riskLevel: 'Low' as const,
      aiFlags: []
    };
    onUpdateVendor(updated);
    setEditedOnboarding('Approved');
    setEditedStatus('Active');
    onTriggerActionToast(`Verified and cleared risk flags for ${vendor.stallName}.`);
  };

  const handleSuspendVendor = () => {
    const updated = {
      ...vendor,
      status: 'Suspended' as const,
      onboardingStatus: 'Needs Docs' as const
    };
    onUpdateVendor(updated);
    setEditedStatus('Suspended');
    setEditedOnboarding('Needs Docs');
    onTriggerActionToast(`Suspended operations for ${vendor.stallName}.`);
  };

  const handleRequestReinspection = () => {
    onTriggerActionToast(`Inspection ticket queued. Task assigned for ${vendor.stallName} hygiene re-audit.`);
  };

  const handleSaveCategory = (categoryStr: string) => {
    const updated = { ...vendor, category: categoryStr };
    onUpdateVendor(updated);
    setEditedCategory(categoryStr);
    onTriggerActionToast(`Category updated to "${categoryStr}"`);
  };

  return (
    <div className="space-y-6">
      {/* breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToManagement}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono"
          >
            ← BACK TO VENDORS REGISTER
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400 font-mono">STALL {vendor.id} PROFILE</span>
        </div>

        <div className="flex gap-2">
          {vendor.status !== 'Suspended' ? (
            <button
              onClick={handleSuspendVendor}
              className="px-3 py-1.5 bg-[#ef4444]/10 hover:bg-[#ef4444]/25 text-rose-450 border border-[#ef4444]/20 rounded-xl text-xs font-semibold cursor-pointer transition"
            >
              Suspend Operational Permit
            </button>
          ) : (
            <button
              onClick={handleVerifyVendor}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold cursor-pointer transition"
            >
              Re-Verify and Reinstate
            </button>
          )}
          <button
            onClick={handleToggleTrustedBadge}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition ${
              vendor.isTrustedBadge
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            {vendor.isTrustedBadge ? 'Trusted Badge Active' : 'Grant Trusted Badge'}
          </button>
        </div>
      </div>

      {/* Main Grid: Info card left, Inspection Assets right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stall Identity & Verification metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-slate-800/10 to-transparent rounded-full blur-2xl"></div>

            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-850 pb-5">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
                  {vendor.stallName}
                  {vendor.isTrustedBadge && <Award className="w-5 h-5 text-amber-500 fill-amber-500/20" />}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <span className="text-slate-500">ID:</span>
                  <span className="font-mono text-slate-350">{vendor.id}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500">Zone:</span>
                  <span className="text-emerald-400 font-semibold">{vendor.nearbyFoodStreet}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-full uppercase ${
                    vendor.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/15 text-rose-450 border border-red-500/20'
                  }`}
                >
                  {vendor.status}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-full">
                  Joined {vendor.createdDate}
                </span>
              </div>
            </div>

            {/* Core parameters fields */}
            <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-6 mb-4">
              Registered Operational Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Owner / Operator Legal Representative</label>
                <div className="text-slate-200 font-medium text-sm bg-[#080d15] p-3 rounded-xl border border-slate-850">
                  {vendor.ownerName}
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">FSSAI License Reg Code</label>
                <div className="text-slate-200 font-medium text-sm font-mono bg-[#080d15] p-3 rounded-xl border border-slate-850 flex items-center justify-between">
                  <span>{vendor.documents.license}</span>
                  <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-2">Category Classification Type</label>
                <div className="flex gap-1.5">
                  <select
                    value={editedCategory}
                    onChange={(e) => handleSaveCategory(e.target.value)}
                    className="w-full bg-[#080d15] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-slate-700"
                  >
                    <option value="South Indian Breakfast">South Indian Breakfast</option>
                    <option value="Chaat & North Indian Street Food">Chaat & North Indian Street Food</option>
                    <option value="Middle Eastern Food / Shawarma">Middle Eastern Food / Shawarma</option>
                    <option value="Sacred Vegetarian Food / Temple Prasadam">Sacred Vegetarian Food / Temple Prasadam</option>
                    <option value="Bangalore-style Mutton Biryani">Bangalore-style Mutton Biryani</option>
                    <option value="Melt-in-mouth Idli & Filter Coffee">Melt-in-mouth Idli & Filter Coffee</option>
                    <option value="Indo-Chinese Gobi Manchurian">Indo-Chinese Gobi Manchurian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Direct Contact Handset Link</label>
                <div className="text-slate-200 font-medium text-sm font-mono bg-[#080d15] p-3 rounded-xl border border-slate-850">
                  {vendor.phone}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500 block mb-1">Exact Stall Coordinates / Spatial Location Pin</label>
                <div className="text-slate-200 font-medium text-xs bg-[#080d15] p-3 rounded-xl border border-slate-850 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" /> {vendor.location}
                </div>
              </div>
            </div>

            {/* Platform Metrics details */}
            <div className="mt-6 pt-5 border-t border-slate-850 grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#0b0f19] p-3.5 rounded-xl border border-slate-850">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase block">
                  Hygiene rating
                </span>
                <span className={`text-xl font-display font-semibold block mt-1.5 ${
                  vendor.hygieneScore >= 90 ? 'text-emerald-400' :
                  vendor.hygieneScore >= 70 ? 'text-amber-400' : 'text-rose-450'
                }`}>
                  {vendor.hygieneScore}/100
                </span>
              </div>
              <div className="bg-[#0b0f19] p-3.5 rounded-xl border border-slate-850">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase block">
                  Hidden Gem Rank
                </span>
                <span className="text-xl font-display font-semibold text-amber-400 block mt-1.5">
                  ✨ {vendor.hiddenGemScore}
                </span>
              </div>
              <div className="bg-[#0b0f19] p-3.5 rounded-xl border border-slate-850">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase block">
                  Served Orders
                </span>
                <span className="text-xl font-display font-semibold text-blue-400 block mt-1.5">
                  {vendor.ordersCount}
                </span>
              </div>
            </div>
          </div>

          {/* AI Risk Flags and Safety metrics */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2.5">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-450" />
                Automated AI Risk Flags & Verification Logs
              </h3>
              <button
                onClick={handleRunAIScoring}
                disabled={checkingRisk}
                className="py-1 px-3 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {checkingRisk ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Assessing Risk...
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" /> Gemini Risk Scan
                  </>
                )}
              </button>
            </div>

            {riskError && (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3.5 text-xs text-rose-400 font-mono">
                🚨 <strong>Audit Execution Error:</strong> {riskError}
              </div>
            )}

            {/* Assessment results */}
            {riskAssessment && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-3 font-mono text-xs select-none">
                <div className="flex justify-between items-center text-[10px] text-emerald-400">
                  <span className="font-bold flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" /> GEMINI RISK AUDIT COMPLETED
                  </span>
                  <span>CONFIDENCE: {Math.round(riskAssessment.confidence * 100)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900/60 rounded border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block">Calculated Level</span>
                    <span className={`text-sm font-bold block mt-1 ${
                      riskAssessment.riskLevel.includes('High') ? 'text-red-400' :
                      riskAssessment.riskLevel.includes('Medium') ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {riskAssessment.riskLevel}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block">Required Compliance Action</span>
                    <span className="text-zinc-300 font-semibold text-[11px] block mt-1 leading-tight">{riskAssessment.recommendedAction}</span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-905/42 border border-white/5 rounded text-[11px] text-zinc-300 leading-relaxed font-sans">
                  <strong>Grounding justification:</strong> {riskAssessment.explanation}
                </div>
              </div>
            )}
            
            {vendor.aiFlags.length === 0 ? (
              <div className="bg-[#0b0f19] p-4 rounded-2xl border border-emerald-950/40 text-xs text-slate-300 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold block text-emerald-400">Zero AI Red-Flags Active</span>
                  All submitted documents are verified, photos pass safety classification, and hygiene telemetry is standard.
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="p-3 bg-rose-500/10 border border-slate-800 text-xs rounded-xl text-rose-400 font-mono">
                  ⚠️ SYSTEM ALERT: Smart computer vision & policy checkers registered {vendor.aiFlags.length} flags.
                </div>
                {vendor.aiFlags.map((flag, idx) => (
                  <div key={idx} className="bg-[#0b0f19] border border-slate-850 p-3 rounded-xl text-xs text-slate-300 flex items-start gap-2.5 hover:border-slate-800 transition">
                    <span className="text-rose-450 mt-1">●</span>
                    <div>
                      <span className="font-semibold text-slate-100 block">{flag}</span>
                      <span className="text-slate-500 text-[11px] block mt-1">
                        Flagged during automatic nightly document re-screening and safety indexing. Action recommended.
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleVerifyVendor}
                    className="px-4 py-2 bg-[#0b0f19] border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 transition shrink-0"
                  >
                    Force Wipe Flags (Ad-Hoc Clear)
                  </button>
                  <button
                    onClick={handleRequestReinspection}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-100 rounded-xl transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Force Physical Hygiene Audit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Physical Photos Placeholder & Auditing Assets */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-3">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Stall Photo Assets
            </h3>

            {/* Stall Photo 1: Kitchen */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">1. Core Kitchen Layout</span>
              <div className="bg-[#090d16] border border-slate-850 rounded-xl p-3 text-xs flex flex-col justify-center h-28 text-center relative group overflow-hidden">
                <span className="text-[28px] block mb-1">🧼</span>
                <span className="text-xs font-semibold text-slate-300">Kitchen View Verified</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{vendor.photos.kitchen}</p>
              </div>
            </div>

            {/* Stall Photo 2: Serving Counter */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">2. Display Counter</span>
              <div className="bg-[#090d16] border border-slate-850 rounded-xl p-3 text-xs flex flex-col justify-center h-28 text-center relative group overflow-hidden">
                <span className="text-[28px] block mb-1">🍲</span>
                <span className="text-xs font-semibold text-slate-300">Sneeze Guards Check</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{vendor.photos.counter}</p>
              </div>
            </div>

            {/* Stall Photo 3: Food Preparation Unit */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">3. Sourcing & Storage</span>
              <div className="bg-[#090d16] border border-slate-850 rounded-xl p-3 text-xs flex flex-col justify-center h-28 text-center relative group overflow-hidden">
                <span className="text-[28px] block mb-1">🥩</span>
                <span className="text-xs font-semibold text-slate-300">Ingredient Storage Check</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{vendor.photos.foodPrep}</p>
              </div>
            </div>

            <button
              onClick={handleRequestReinspection}
              className="w-full py-2.5 px-4 bg-[#0b0f19] hover:bg-[#0f172a] border border-slate-850 hover:border-slate-750 text-slate-400 hover:text-slate-200 text-xs font-mono font-medium rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              Request Fresh Photo Upload
            </button>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 select-none">
              Operational Tags
            </h3>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-950/40">FSSAI Active</span>
              <span className="bg-blue-500/10 text-blue-450 px-2 py-1 rounded border border-blue-950/40">Gems Qualified</span>
              <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-950/40">Ghee Roast Leader</span>
              <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-950/40">VV Puram Hub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
