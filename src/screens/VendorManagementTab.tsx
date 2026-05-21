import { useState } from 'react';
import { Vendor } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Award,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Eye,
  MessageSquareOff,
  Trash2
} from 'lucide-react';

interface VendorManagementTabProps {
  vendors: Vendor[];
  onUpdateStatus: (id: string, status: any, onboarding: any) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onViewDetail: (id: string) => void;
  onTriggerActionToast: (msg: string) => void;
  onDeleteVendor?: (id: string) => void;
}

export default function VendorManagementTab({
  vendors,
  onUpdateStatus,
  onUpdateVendor,
  onViewDetail,
  onTriggerActionToast,
  onDeleteVendor
}: VendorManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'active' | 'pending' | 'suspended' | 'premium' | 'gems' | 'low_hygiene'
  >('all');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Suspended'>('All');
  const [statusSort, setStatusSort] = useState<'none' | 'Ac-Pe-Su' | 'Su-Pe-Ac' | 'alphabetical'>('none');

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'suspend' | 'delete';
    vendorId: string | null;
    stallName: string;
  }>({
    isOpen: false,
    type: 'suspend',
    vendorId: null,
    stallName: ''
  });

  // Search and filter logic
  const filteredVendors = vendors.filter((v) => {
    // Search match
    const textMatch =
      v.stallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!textMatch) return false;

    // Status filter dropdown match (Active, Suspended, Pending)
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;

    // Preset filter match
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return v.status === 'Active';
    if (activeFilter === 'pending') return v.status === 'Pending';
    if (activeFilter === 'suspended') return v.status === 'Suspended';
    if (activeFilter === 'premium') return v.subscriptionPlan === 'Premium';
    if (activeFilter === 'gems') return v.hiddenGemScore >= 90;
    if (activeFilter === 'low_hygiene') return v.hygieneScore < 75;

    return true;
  });

  // Status sort logic
  const sortedAndFilteredVendors = [...filteredVendors].sort((a, b) => {
    if (statusSort === 'none') return 0;

    if (statusSort === 'alphabetical') {
      return a.status.localeCompare(b.status);
    }

    const priority: Record<string, number> = {
      'Active': 1,
      'Pending': 2,
      'Suspended': 3,
    };

    const valA = priority[a.status] || 99;
    const valB = priority[b.status] || 99;

    if (statusSort === 'Ac-Pe-Su') {
      return valA - valB;
    } else if (statusSort === 'Su-Pe-Ac') {
      return valB - valA;
    }

    return 0;
  });

  // Action methods
  const handleFeatureVendor = (vendor: Vendor) => {
    const updated = { ...vendor, hiddenGemScore: Math.min(100, vendor.hiddenGemScore + 5), isTrustedBadge: true };
    onUpdateVendor(updated);
    onTriggerActionToast(`Featured ${vendor.stallName} across city catalogs.`);
  };

  const handleContactVendor = (v: Vendor) => {
    onTriggerActionToast(`Secure messaging channel initialized with ${v.ownerName} (${v.stallName}). SMS alert dispatched.`);
  };

  const badgeColorMap = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Suspended':
        return 'bg-red-500/15 text-rose-450 border border-red-500/25';
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
            MASTER REGISTRY (REAL-TIME CRUD)
          </span>
          <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Vendor Master Control</h2>
          <p className="text-xs text-slate-400">
            Monitor, modify parameters, assign trusted badges, and execute ad-hoc compliance suspensions.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-550 outline-none focus:border-slate-700 transition"
              placeholder="Filter by stall name, owner representative, style..."
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-400">Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#0b0f19] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-700 transition cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Status Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-400">Sort Status:</span>
            <select
              value={statusSort}
              onChange={(e) => setStatusSort(e.target.value as any)}
              className="bg-[#0b0f19] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-700 transition cursor-pointer"
            >
              <option value="none">Default Order</option>
              <option value="Ac-Pe-Su">Active ➔ Pending ➔ Suspended</option>
              <option value="Su-Pe-Ac">Suspended ➔ Pending ➔ Active</option>
              <option value="alphabetical">By Status Name (A-Z)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs shrink-0 select-none">
            <Filter className="w-3.5 h-3.5" /> Filter presets:
          </div>
        </div>

        {/* Filters pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
              activeFilter === 'all'
                ? 'bg-slate-300 text-slate-900'
                : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Registered ({vendors.length})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
              activeFilter === 'active'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Active Stalls
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Onscreen queue
          </button>
          <button
            onClick={() => setActiveFilter('suspended')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
              activeFilter === 'suspended'
                ? 'bg-rose-500 text-slate-900 font-semibold'
                : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-505"></span>
            Suspended
          </button>
          <button
            onClick={() => setActiveFilter('premium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
              activeFilter === 'premium'
                ? 'bg-indigo-500 text-slate-100 font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            👑 Premium Tier
          </button>
          <button
            onClick={() => setActiveFilter('gems')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
              activeFilter === 'gems'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            ✨ Super Gems
          </button>
          <button
            onClick={() => setActiveFilter('low_hygiene')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
              activeFilter === 'low_hygiene'
                ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚠️ Low Sanitation Score
          </button>
        </div>
      </div>

      {/* MATRIX TABLE - DESKTOP ONLY */}
      <div className="hidden lg:block bg-[#161618] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 font-mono text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-850">
                <th className="p-4">Vendor Details</th>
                <th className="p-4">Urban Zone Hub</th>
                <th className="p-4 text-center">Orders Served</th>
                <th className="p-4 text-center">Hygiene Metric</th>
                <th className="p-4 text-center">Hidden Gem</th>
                <th className="p-4">SaaS Subscription</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Telemetry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-xs">
              {sortedAndFilteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No vendors match structural query filters.
                  </td>
                </tr>
              ) : (
                sortedAndFilteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-slate-900/45 transition-colors group/row cursor-pointer"
                    onClick={() => onViewDetail(vendor.id)}
                  >
                    {/* Stall and category */}
                    <td className="p-4">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl pt-0.5 select-none" title="Vendor Badge Icon">
                          {vendor.category.includes('Breakfast') || vendor.category.includes('Idli') ? '🥞' :
                           vendor.category.includes('Temple') ? '🕉️' :
                           vendor.category.includes('Shawarma') ? '🌯' : '🍲'}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5 group-hover/row:text-emerald-400 transition-colors">
                            {vendor.stallName}
                            {vendor.isTrustedBadge && (
                              <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500/15" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{vendor.category}</div>
                        </div>
                      </div>
                    </td>

                    {/* Zone info */}
                    <td className="p-4 text-slate-350">
                      <div>{vendor.nearbyFoodStreet}</div>
                      <div className="text-[10px] text-slate-550 font-mono mt-0.5">UID: {vendor.id}</div>
                    </td>

                    {/* Orders count */}
                    <td className="p-4 text-center text-slate-300 font-mono font-medium">
                      {vendor.ordersCount.toLocaleString()}
                    </td>

                    {/* Hygiene rating */}
                    <td className="p-4 text-center">
                      <div
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          vendor.hygieneScore >= 90
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-950/40'
                            : vendor.hygieneScore >= 70
                            ? 'text-amber-500 bg-amber-500/10 border border-amber-950/40'
                            : 'text-rose-400 bg-rose-500/10 border border-rose-955/40'
                        }`}
                      >
                        {vendor.hygieneScore}/100
                      </div>
                    </td>

                    {/* Hidden gem index */}
                    <td className="p-4 text-center">
                      <span className="text-amber-400 font-mono font-bold">✨ {vendor.hiddenGemScore}</span>
                    </td>

                    {/* Subscription billing */}
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                          vendor.subscriptionPlan === 'Premium'
                            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                            : vendor.subscriptionPlan === 'Growth'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {vendor.subscriptionPlan}
                      </span>
                    </td>

                    {/* Operational Status */}
                    <td className="p-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${badgeColorMap(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </td>

                    {/* Control Actions Row (prevents table click if trigger button is focused) */}
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5 opacity-85 group-hover/row:opacity-100 transition-opacity">
                        <button
                          onClick={() => onViewDetail(vendor.id)}
                          className="p-1 px-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded text-[10px] font-mono border border-slate-800 cursor-pointer"
                          title="Open Comprehensive Telemetry Monitor"
                        >
                          View Audits
                        </button>
                        
                        {vendor.status !== 'Active' ? (
                          <button
                            onClick={() => setModalState({
                              isOpen: true,
                              type: 'approve',
                              vendorId: vendor.id,
                              stallName: vendor.stallName
                            })}
                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 p-1 px-2 rounded text-[10px] font-mono font-medium cursor-pointer"
                          >
                            Verify Active
                          </button>
                        ) : (
                          <button
                            onClick={() => setModalState({
                              isOpen: true,
                              type: 'suspend',
                              vendorId: vendor.id,
                              stallName: vendor.stallName
                            })}
                            className="bg-rose-500/10 text-rose-455 border border-rose-500/20 hover:bg-rose-500/20 p-1 px-2 rounded text-[10px] font-mono font-medium cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}

                        <button
                          onClick={() => setModalState({
                            isOpen: true,
                            type: 'delete',
                            vendorId: vendor.id,
                            stallName: vendor.stallName
                          })}
                          className="bg-rose-500/5 hover:bg-rose-500/15 text-rose-450 hover:text-rose-400 border border-rose-500/10 p-1 px-2 rounded text-[10px] font-mono font-medium cursor-pointer"
                          title="Permanently Expel Vendor"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => handleFeatureVendor(vendor)}
                          className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 p-1 px-2 rounded text-[10px] font-mono font-medium cursor-pointer"
                        >
                          Feature Item
                        </button>

                        <button
                          onClick={() => handleContactVendor(vendor)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-250 rounded cursor-pointer"
                          title="Broadcast SMS Alert Code"
                        >
                          ✉️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Counter summary */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-850 flex justify-between items-center text-[11px] font-mono text-slate-500">
          <span>Displaying {sortedAndFilteredVendors.length} matches of {vendors.length} registered state sellers</span>
          <span>FSSAI Local compliance certified</span>
        </div>
      </div>

      {/* MOBILE FRIENDLY CARD LIST - SHOWS ON MOBILE ONLY */}
      <div className="block lg:hidden space-y-4">
        {sortedAndFilteredVendors.length === 0 ? (
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-8 text-center text-slate-500">
            No vendors match structural query filters.
          </div>
        ) : (
          sortedAndFilteredVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="bg-[#161618] border border-white/5 rounded-2xl p-4 space-y-3 hover:border-emerald-500/30 transition cursor-pointer"
              onClick={() => onViewDetail(vendor.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {vendor.category.includes('Breakfast') || vendor.category.includes('Idli') ? '🥞' :
                     vendor.category.includes('Temple') ? '🕉️' :
                     vendor.category.includes('Shawarma') ? '🌯' : '🍲'}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-200 flex items-center gap-1">
                      {vendor.stallName}
                      {vendor.isTrustedBadge && (
                        <Award className="w-3 h-3 text-amber-500 fill-amber-500/10" />
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">{vendor.category}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${badgeColorMap(vendor.status)}`}>
                  {vendor.status}
                </span>
              </div>

              {/* Grid indices */}
              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-white/5 pt-2.5">
                <div>
                  <span className="text-slate-500 block">Urban Zone:</span>
                  <span className="text-slate-300 font-medium">{vendor.nearbyFoodStreet}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Orders Filled:</span>
                  <span className="text-slate-300 font-medium font-mono">{vendor.ordersCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Inspection Score:</span>
                  <span className={`font-mono font-bold ${
                    vendor.hygieneScore >= 90 ? 'text-emerald-400' :
                    vendor.hygieneScore >= 70 ? 'text-amber-500' : 'text-rose-400'
                  }`}>
                    {vendor.hygieneScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hidden Gem Power:</span>
                  <span className="text-amber-400 font-mono font-bold">✨ {vendor.hiddenGemScore}</span>
                </div>
              </div>

              {/* Mobile Actions block */}
              <div className="flex gap-1.5 pt-2 border-t border-white/5 justify-end" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onViewDetail(vendor.id)}
                  className="px-2.5 py-1.5 bg-[#0d0d0f] border border-white/5 hover:bg-slate-800 text-slate-400 rounded-lg text-[10px] font-mono"
                >
                  Audits
                </button>
                {vendor.status !== 'Active' ? (
                  <button
                    onClick={() => setModalState({
                      isOpen: true,
                      type: 'approve',
                      vendorId: vendor.id,
                      stallName: vendor.stallName
                    })}
                    className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg text-[10px] font-mono"
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    onClick={() => setModalState({
                      isOpen: true,
                      type: 'suspend',
                      vendorId: vendor.id,
                      stallName: vendor.stallName
                    })}
                    className="bg-rose-500/10 text-rose-455 border border-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg text-[10px] font-mono"
                  >
                    Suspend
                  </button>
                )}
                <button
                  onClick={() => setModalState({
                    isOpen: true,
                    type: 'delete',
                    vendorId: vendor.id,
                    stallName: vendor.stallName
                  })}
                  className="bg-red-500/5 hover:bg-red-500/15 text-rose-455 hover:text-rose-400 border border-red-500/10 px-2.5 py-1.5 rounded-lg text-[10px] font-mono"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* COMPREHENSIVE ACTION MODALS */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (!modalState.vendorId) return;
          if (modalState.type === 'approve') {
            onUpdateStatus(modalState.vendorId, 'Active', 'Approved');
            onTriggerActionToast(`Operational limits successfully reinstated for "${modalState.stallName}".`);
          } else if (modalState.type === 'suspend') {
            onUpdateStatus(modalState.vendorId, 'Suspended', 'Needs Docs');
            onTriggerActionToast(`Suspended operations permit for "${modalState.stallName}". Listings disabled.`);
          } else if (modalState.type === 'delete') {
            if (onDeleteVendor) {
              onDeleteVendor(modalState.vendorId);
              onTriggerActionToast(`Vendor "${modalState.stallName}" expelled and completely deleted from administrative register.`);
            } else {
              // fallback inline soft delete simulation
              onUpdateStatus(modalState.vendorId, 'Suspended', 'Needs Docs');
              onTriggerActionToast(`Stall deleted representing "${modalState.stallName}" operations.`);
            }
          }
        }}
        title={
          modalState.type === 'approve' ? 'Verify and Reinstate Permit?' :
          modalState.type === 'suspend' ? 'Suspend Operational License?' : 'Expel Vendor from Registry?'
        }
        message={
          modalState.type === 'approve' ? `By confirming, you will release the suspension on "${modalState.stallName}", restore customer menu endpoints, and certify FSSAI state compliance.` :
          modalState.type === 'suspend' ? `By confirming, you will immediately suspend all commercial processing rights for "${modalState.stallName}", block active customer checkout carts, and flag an urgent document audit.` :
          `CRITICAL WARNING: Are you absolutely certain you want to permanently delete and expel "${modalState.stallName}"? This action CANNOT be undone and will destroy all metrics and audit reports.`
        }
        confirmText={
          modalState.type === 'approve' ? 'Reinstate Stalls' :
          modalState.type === 'suspend' ? 'Suspend License' : 'Delete Permanently'
        }
        type={modalState.type}
      />
    </div>
  );
}
