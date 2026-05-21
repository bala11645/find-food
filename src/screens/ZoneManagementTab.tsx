import { useState, FormEvent } from 'react';
import { Zone } from '../types';
import { MapPin, ShieldAlert, CheckCircle, Flame, Plus, TrafficCone, Cpu, RefreshCw } from 'lucide-react';
import { getZoneIntelligence, ZoneInsightsResult } from '../services/geminiService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ZoneManagementTabProps {
  zones: Zone[];
  onAddZone: (newZone: Zone) => void;
  onUpdateZoneStatus: (id: string, status: 'Active' | 'Disabled', aiZoneInsights?: any) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function ZoneManagementTab({
  zones,
  onAddZone,
  onUpdateZoneStatus,
  onTriggerActionToast
}: ZoneManagementTabProps) {
  // New zone state parameters
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCategory, setNewZoneCategory] = useState<'Night Food Street' | 'Temple Zone' | 'Tourist Zone' | 'SaaS Hub'>('Night Food Street');
  const [crowdLevel, setCrowdLevel] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [traffic, setTraffic] = useState<'Clear' | 'Busy' | 'Heavy'>('Busy');

  const [queryingZoneId, setQueryingZoneId] = useState<string | null>(null);
  const [zoneErrors, setZoneErrors] = useState<Record<string, string>>({});
  const [zoneInsights, setZoneInsights] = useState<Record<string, ZoneInsightsResult>>(() => {
    const initial: Record<string, ZoneInsightsResult> = {};
    zones.forEach((z) => {
      if ((z as any).aiZoneInsights) {
        initial[z.id] = (z as any).aiZoneInsights;
      }
    });
    return initial;
  });

  const handleFetchZoneInsights = async (zone: Zone) => {
    setQueryingZoneId(zone.id);
    setZoneErrors(prev => ({ ...prev, [zone.id]: '' }));
    onTriggerActionToast(`Quering Gemini model for localized traffic & congestion forecast for ${zone.name}...`);
    try {
      const data = await getZoneIntelligence(
        zone.id,
        zone.name,
        zone.crowdLevel,
        zone.trafficIntensity,
        zone.activeVendorsCount
      );
      setZoneInsights(prev => ({
        ...prev,
        [zone.id]: data
      }));

      // Store in verified zones doc
      try {
        onUpdateZoneStatus(zone.id, zone.status, data);
      } catch (dbErr: any) {
        console.error("Firestore spatial logging failure:", dbErr);
      }

      onTriggerActionToast(`Gemini spatial traffic model resolved successfully.`);
    } catch (e: any) {
      setZoneErrors(prev => ({ ...prev, [zone.id]: e.message || String(e) }));
      onTriggerActionToast(`Spatial routing error: ${e.message}`);
    } finally {
      setQueryingZoneId(null);
    }
  };

  const handleRegisterZone = (e: FormEvent) => {
    e.preventDefault();
    if (!newZoneName) {
      onTriggerActionToast('Error: Zone name is required.');
      return;
    }

    const created: Zone = {
      id: `z-${Date.now()}`,
      name: newZoneName,
      activeVendorsCount: Math.floor(Math.random() * 20)+5,
      hiddenGemsCount: Math.floor(Math.random() * 5)+1,
      crowdLevel: crowdLevel,
      trafficIntensity: traffic,
      category: newZoneCategory,
      status: 'Active',
      coordinates: { x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 60) + 20 }
    };

    onAddZone(created);
    onTriggerActionToast(`New administrative food precinct registered: "${newZoneName}"!`);
    setNewZoneName('');
  };

  const handleHighlight = (name: string) => {
    onTriggerActionToast(`Seasonal focus boost broadcasted for ${name}. Highlighting near the discovery map.`);
  };

  const handleSeasonalToggle = (name: string) => {
    onTriggerActionToast(`Seasonal holiday rules applied for ${name}. Temporary vendor limits adjusted.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          CITY SPATIAL SUB-ZONING
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Metropolitan Zone Control</h2>
        <p className="text-xs text-slate-400">
          Supervise active street-food corridors, regulate vendor ceilings, track traffic gridlocks, and toggle holiday zones.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left lists cards */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
            Active Districts Mapping
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => {
              const isBlocked = zone.status === 'Disabled';
              let categoryBadge = 'bg-blue-500/10 text-blue-400 border border-blue-950/40';
              if (zone.category === 'Temple Zone') categoryBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-950/40';
              else if (zone.category === 'Night Food Street') categoryBadge = 'bg-purple-500/10 text-purple-400 border border-purple-950/40';

              return (
                <div
                  key={zone.id}
                  className={`bg-[#0f172a] border ${
                    isBlocked ? 'border-dashed border-slate-850 opacity-60' : 'border-slate-800'
                  } rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`font-semibold ${isBlocked ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                        {zone.name}
                      </h4>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${categoryBadge}`}>
                        {zone.category}
                      </span>
                    </div>

                    {/* Telemetrics inline row */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3.5 text-xs mt-4 pb-4 border-b border-slate-850/60 font-medium">
                      <div>
                        <span className="text-slate-500 block text-[10px] font-mono">Active Stalls:</span>
                        <span className="text-slate-200">{zone.activeVendorsCount} sellers</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] font-mono">Hidden Gems:</span>
                        <span className="text-amber-400">✨ {zone.hiddenGemsCount} stars</span>
                      </div>
                      <div>
                        <span className="text-slate-555 block text-[10px] font-mono">Crowd Peak:</span>
                        <span className={`font-mono ${zone.crowdLevel === 'Overloaded' ? 'text-rose-455 font-bold' : 'text-slate-300'}`}>
                          {zone.crowdLevel}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-555 block text-[10px] font-mono">Road Congestion:</span>
                        <span className="text-slate-350">{zone.trafficIntensity}</span>
                      </div>
                    </div>

                    {zoneErrors[zone.id] && (
                      <div className="bg-rose-500/10 border border-rose-500/25 rounded-md p-2 text-[10px] text-rose-400 font-mono mt-2 flex flex-col gap-0.5">
                        🚨 <strong>Precision Traffic Scan Failed:</strong>
                        <span>{zoneErrors[zone.id]}</span>
                      </div>
                    )}

                    {/* Gemini Live Scan Diagnostic Box */}
                    {zoneInsights[zone.id] && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 space-y-1.5 select-none text-[10px] font-mono mt-3">
                        <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" /> SPATIAL FORECAST
                          </span>
                          <span className="text-zinc-550 uppercase">DEMAND: {zoneInsights[zone.id].forecastDemand} ({Math.round((zoneInsights[zone.id].confidence || 0.92) * 100)}%)</span>
                        </div>
                        <div className="text-zinc-350 font-sans leading-relaxed">
                          {zoneInsights[zone.id].recommendation}
                        </div>
                        <div className="text-[9px] text-zinc-500 italic mt-1 leading-normal">
                          ⚠️ warning: {zoneInsights[zone.id].congestionWarning}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    <button
                      onClick={() => handleFetchZoneInsights(zone)}
                      disabled={queryingZoneId === zone.id}
                      className="py-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono font-bold cursor-pointer transition flex items-center gap-1"
                    >
                      {queryingZoneId === zone.id ? (
                        <RefreshCw className="w-3" />
                      ) : (
                        <Cpu className="w-3 h-3" />
                      )}
                      Insights
                    </button>
                    {zone.status === 'Active' ? (
                      <button
                        onClick={() => {
                          onUpdateZoneStatus(zone.id, 'Disabled');
                          onTriggerActionToast(`Disabled zone permit listings for "${zone.name}".`);
                        }}
                        className="py-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-455 border border-rose-500/10 rounded text-[10px] font-mono cursor-pointer"
                      >
                        Disable listing
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onUpdateZoneStatus(zone.id, 'Active');
                          onTriggerActionToast(`Restamped active status for "${zone.name}".`);
                        }}
                        className="py-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-950/40 rounded text-[10px] font-mono cursor-pointer"
                      >
                        Enable lists
                      </button>
                    )}
                    <button
                      onClick={() => handleHighlight(zone.name)}
                      className="py-1 px-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-[10px] font-mono cursor-pointer"
                    >
                      Boost Rank
                    </button>
                    <button
                      onClick={() => handleSeasonalToggle(zone.name)}
                      className="py-1 px-2 bg-slate-805 hover:bg-slate-755 text-slate-400 text-[10px] font-mono cursor-pointer"
                      title="Holiday Temporary Regulations"
                    >
                      Seasonal Rules
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Register new zone map form */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              Register New City Food Hub
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Define municipal zoning bound guidelines</p>
          </div>

          <form onSubmit={handleRegisterZone} className="space-y-4">
            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Precinct / Zone Hub Name
              </label>
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-850 text-xs text-slate-100 p-2.5 rounded-xl outline-none focus:border-slate-750"
                placeholder="e.g. Shivaji Nagar Night Market"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Regulatory Category
              </label>
              <select
                value={newZoneCategory}
                onChange={(e: any) => setNewZoneCategory(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-850 text-xs text-slate-250 p-2.5 rounded-xl outline-none"
              >
                <option value="Night Food Street">Night Food Street Corridor</option>
                <option value="Temple Zone">Temple Precinct (Strict Veg)</option>
                <option value="Tourist Zone">Tourist Specialty Zone</option>
                <option value="SaaS Hub">Commercial IT Technology Hub</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1">
                  Crowd volume ceiling
                </label>
                <select
                  value={crowdLevel}
                  onChange={(e: any) => setCrowdLevel(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-850 text-[11px] text-slate-300 p-2.5 rounded-xl outline-none"
                >
                  <option value="Low">Low limits</option>
                  <option value="Moderate">Default (Moderate)</option>
                  <option value="High">Overload Peak limits</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1">
                  Traffic congestion profile
                </label>
                <select
                  value={traffic}
                  onChange={(e: any) => setTraffic(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-850 text-[11px] text-slate-300 p-2.5 rounded-xl outline-none"
                >
                  <option value="Clear">Clear transit flows</option>
                  <option value="Busy">Moderate Busy corridors</option>
                  <option value="Heavy">Heavy transit junctions</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-850 text-[11px] text-slate-500 leading-normal font-mono">
              💡 Registering automatically maps random GPS co-ordinates and generates FSSAI regulatory rules for physical stalls.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Approve & Map District
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
