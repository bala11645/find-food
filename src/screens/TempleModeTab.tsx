import { useState } from 'react';
import { Vendor } from '../types';
import { Landmark, Compass, Bell, Flame, HelpCircle, AlertCircle, ShieldCheck } from 'lucide-react';

interface TempleModeTabProps {
  vendors: Vendor[];
  onTriggerActionToast: (msg: string) => void;
}

export default function TempleModeTab({ vendors, onTriggerActionToast }: TempleModeTabProps) {
  // Focus on temple or direct pure veg vendors
  const templeVendors = vendors.filter(
    (v) => v.zoneId === 'z-iskcon' || v.category.toLowerCase().includes('temple') || v.category.toLowerCase().includes('idli')
  );

  // Festival switches
  const [fastingMode, setFastingMode] = useState(false);
  const [tempSellersActive, setTempSellersActive] = useState(false);
  const [routeA, setRouteA] = useState(true);

  const handleToggleFestivalMode = (festivalName: string) => {
    onTriggerActionToast(`Sacred Temple Food Route rules activated for: ${festivalName}. Boosted strict sathvik rankings.`);
  };

  const handleBroadcastCrowdAlert = () => {
    onTriggerActionToast('Crowd Alert: Broadcast SMS sent to ISKCON exit corridor vendors to pace preparation speeds.');
  };

  const textGradient = 'bg-gradient-to-r from-emerald-450 via-amber-400 to-emerald-500 bg-clip-text text-transparent';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
            SACRED DIETARY REGULATORY
          </span>
          <h2 className="text-2xl font-display font-medium text-slate-100 mt-1 flex items-center gap-2">
            🕉️ Temple Mode Management
          </h2>
          <p className="text-xs text-slate-400">
            Regulate pure vegetarian (Sathvik) compliance, manage sacred temple prasad spaces, and activate festival pathways.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Festival controls console */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
              <Landmark className="w-4 h-4" />
              Active Devotional Festival Controls
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Scale operations around pilgrim corridors</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Control 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0f19] border border-slate-850 hover:border-slate-800 transition">
              <div>
                <span className="font-semibold text-slate-200 block">Strict Fasting Specials (Phalahar Mode)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Limits menu display to sago, rock salt, and buckwheat.</span>
              </div>
              <input
                type="checkbox"
                checked={fastingMode}
                onChange={(e) => {
                  setFastingMode(e.target.checked);
                  handleToggleFestivalMode(e.target.checked ? 'Fasting phalahar protocol' : 'Standard sathvik list');
                }}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Control 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0f19] border border-slate-850 hover:border-slate-800 transition">
              <div>
                <span className="font-semibold text-slate-200 block">Temporary Festival Stall Permits</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Authorize 20 vetted micro-stalls near temple exit lines.</span>
              </div>
              <input
                type="checkbox"
                checked={tempSellersActive}
                onChange={(e) => {
                  setTempSellersActive(e.target.checked);
                  onTriggerActionToast(e.target.checked ? 'Authorized temporary non-commercial prasadam distribution stalls.' : 'Festival micro-stalls deactivated.');
                }}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Control 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0f19] border border-slate-850 hover:border-slate-800 transition">
              <div>
                <span className="font-semibold text-slate-200 block">Optimized Prasadam Footpath Routes</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Route pilgrim crowd movements via verified high-hygiene counters.</span>
              </div>
              <input
                type="checkbox"
                checked={routeA}
                onChange={(e) => {
                  setRouteA(e.target.checked);
                  onTriggerActionToast(`Path-finder algorithms mapped to exit gate ${e.target.checked ? 'A' : 'B'} corridor.`);
                }}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleBroadcastCrowdAlert}
              className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 text-xs font-semibold rounded-xl transition flex justify-center items-center gap-1.5"
            >
              <Bell className="w-4 h-4 animate-swing" /> Trigger Temple Crowd Warnings
            </button>
          </div>
        </div>

        {/* Right column: Temple food vendors */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Dietary compliant & Temple Stall Registry
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Sathvik Certified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templeVendors.map((v) => (
              <div key={v.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                      {v.stallName}
                      <span className="text-xs" title="Strict Pure Veg">🟢</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">{v.category}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-950/40 px-2 py-0.5 rounded font-mono font-bold">
                    Score {v.hygieneScore}/100
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-850/60">
                  <p>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">Ingredients & Sourcing:</span>
                    <span className="text-slate-300 font-medium text-[11.5px] block truncate">{v.photos.foodPrep}</span>
                  </p>
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">Exit Waypoint:</span>
                    <span className="text-slate-350">{v.location}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-3 border-t border-slate-900/40">
                  <button
                    onClick={() => onTriggerActionToast(`Verified and audited strict onion-garlic free compliance for ${v.stallName}.`)}
                    className="py-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-[#10b981] text-[10px] rounded font-mono cursor-pointer"
                  >
                    Audited Pure Sathvik ➜
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
