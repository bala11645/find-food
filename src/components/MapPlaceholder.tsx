import { useState } from 'react';
import { MapPin, Flame, Sparkles, AlertTriangle, Moon, Landmark } from 'lucide-react';
import { Zone } from '../types';

interface MapPlaceholderProps {
  zones: Zone[];
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

export default function MapPlaceholder({ zones, selectedZone, onSelectZone }: MapPlaceholderProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'crowd' | 'gems' | 'temple' | 'tourist'>('all');

  // Realistic map points for visual display
  const mapHotspots = [
    { id: 'h-1', name: 'Sajjan Rao Circle Hotspot', x: 38, y: 72, type: 'crowd', desc: 'Extreme crowd surge for Ghee Dosa', crowd: 'Overloaded' },
    { id: 'h-2', name: 'Flyover Pillar 104 Biryani', x: 79, y: 48, type: 'gem', desc: 'Hidden Gem 99/100 score trending', crowd: 'High' },
    { id: 'h-3', name: 'JNC Road Shawarma Row', x: 67, y: 58, type: 'risk', desc: 'Hygiene Watch: Temperature issues reported', crowd: 'High' },
    { id: 'h-4', name: 'ISKCON Prasadam exit lane', x: 27, y: 28, type: 'temple', desc: 'Sacred fasting special food route activated', crowd: 'Moderate' },
    { id: 'h-5', name: 'Malleshwaram Filter Coffee Corner', x: 32, y: 32, type: 'tourist', desc: 'Classic tourist must-try heritage spot', crowd: 'High' },
  ];

  const filteredHotspots = mapHotspots.filter(h => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'crowd') return h.type === 'crowd' || h.crowd === 'Overloaded';
    if (activeFilter === 'gems') return h.type === 'gem';
    if (activeFilter === 'temple') return h.type === 'temple';
    if (activeFilter === 'tourist') return h.type === 'tourist';
    return true;
  });

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
      {/* Background neon ambient glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 z-10 relative">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE RADAR FEED
          </span>
          <h3 className="text-lg font-display font-medium text-slate-100 mt-1">Bangalore AI Food Zone Map</h3>
          <p className="text-xs text-slate-400">Interactive telemetry tracking traffic, sanitation, and hidden gems</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 bg-[#0b0f19] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-emerald-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Areas
          </button>
          <button
            onClick={() => setActiveFilter('crowd')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 ${
              activeFilter === 'crowd'
                ? 'bg-[#ef4444]/15 text-[#ef4444] font-medium border border-[#ef4444]/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Hotspots
          </button>
          <button
            onClick={() => setActiveFilter('gems')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 ${
              activeFilter === 'gems'
                ? 'bg-amber-500/15 text-amber-400 font-medium border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Gems
          </button>
          <button
            onClick={() => setActiveFilter('temple')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 ${
              activeFilter === 'temple'
                ? 'bg-[#10b981]/15 text-[#10b981] font-medium border border-[#10b981]/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" /> Temple
          </button>
          <button
            onClick={() => setActiveFilter('tourist')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1 ${
              activeFilter === 'tourist'
                ? 'bg-[#3b82f6]/15 text-[#3b82f6] font-medium border border-[#3b82f6]/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Tourist
          </button>
        </div>
      </div>

      <div className="relative border border-slate-800 bg-[#090d16] rounded-xl overflow-hidden aspect-video md:min-h-[400px]">
        {/* Custom Visual Vector Grid Map */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radial grid */}
          <circle cx="50%" cy="55%" r="20%" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50%" cy="55%" r="35%" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50%" cy="55%" r="50%" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="5 5" />
          
          {/* Grid coordinates */}
          <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

          {/* Stylized Bangalore roads/metro tracks network overlay */}
          {/* Outer Ring Road */}
          <path d="M 0,2 10,20 Q 35,45 50,55 T 100,120" fill="none" stroke="#334155" strokeWidth="2" strokeOpacity="0.4" />
          {/* Hosur Road */}
          <path d="M 120,0 Q 80,45 65,60 T 50,150" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" strokeOpacity="0.5" />
          {/* Mysore Road / Tumkur Road */}
          <path d="M 0,100 Q 25,60 35,50 T 150,20" fill="none" stroke="#475569" strokeWidth="3" strokeOpacity="0.6" />
          <path d="M 50,0 Q 55,55 35,70 T 0,110" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.15" /> {/* High congestion link */}
          
          {/* Radar sweeping scanline vector */}
          <circle cx="50%" cy="55%" r="1" fill="#10b981">
            <animate attributeName="r" values="0; 350" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25; 0" dur="4s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Ambient Pulsing glowing hotspots underneath */}
        {zones.map((zone) => {
          const isSelected = selectedZone === zone.id;
          let color = 'bg-emerald-500';
          if (zone.crowdLevel === 'Overloaded') color = 'bg-rose-500';
          else if (zone.crowdLevel === 'High') color = 'bg-amber-500';
          else if (zone.category === 'Temple Zone') color = 'bg-green-400';

          return (
            <div
              key={`pulse-${zone.id}`}
              style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
            >
              <div className={`w-12 h-12 rounded-full ${color} opacity-10 animate-ping absolute -left-6 -top-6`}></div>
              {isSelected && (
                <div className={`w-20 h-20 rounded-full ${color} opacity-20 animate-pulse absolute -left-10 -top-10`}></div>
              )}
            </div>
          );
        })}

        {/* Master Zone Pins (defined in database) */}
        {zones.map((zone) => {
          const isSelected = selectedZone === zone.id;
          let statusColor = 'text-green-400 border-green-500';
          let bgColor = 'bg-green-500/25';
          if (zone.crowdLevel === 'Overloaded') {
            statusColor = 'text-rose-400 border-rose-500';
            bgColor = 'bg-rose-500/25';
          } else if (zone.crowdLevel === 'High') {
            statusColor = 'text-amber-400 border-amber-500';
            bgColor = 'bg-amber-500/25';
          }

          return (
            <button
              onClick={() => onSelectZone(zone.id)}
              key={zone.id}
              style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20 outline-none`}
            >
              <div
                className={`p-1.5 rounded-full border-2 ${statusColor} ${bgColor} ${
                  isSelected ? 'scale-125' : 'scale-100 hover:scale-110'
                } transition-all shadow-lg backdrop-blur-sm`}
              >
                {zone.category === 'Temple Zone' ? (
                  <Landmark className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </div>
              <div
                className={`absolute top-8 bg-slate-900/95 border border-slate-800 text-[10px] text-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap shadow-md pointer-events-none ${
                  isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                } transition-all`}
              >
                <div className="font-medium">{zone.name}</div>
                <div className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className={`w-1 h-1 rounded-full ${statusColor.split(' ')[0].replace('text', 'bg')}`}></span>
                  {zone.crowdLevel} • Gen {zone.activeVendorsCount} stalls
                </div>
              </div>
            </button>
          );
        })}

        {/* Dynamic mapHotspots overlay */}
        {filteredHotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none group/hotspot"
          >
            {/* Small glowing dots for custom metrics */}
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                hotspot.type === 'risk' ? 'bg-red-500' : hotspot.type === 'gem' ? 'bg-amber-400' : 'bg-emerald-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                hotspot.type === 'risk' ? 'bg-red-500' : hotspot.type === 'gem' ? 'bg-amber-400' : 'bg-emerald-400'
              }`}></span>
            </span>

            {/* Hover tooltip for indicators */}
            <div className="opacity-0 group-hover/hotspot:opacity-100 absolute left-4 bg-[#090d16] border border-slate-800 p-2.5 rounded-lg w-52 text-[10px] shadow-xl transition-all pointer-events-none">
              <div className="flex items-center gap-1 font-mono font-semibold text-slate-200">
                {hotspot.type === 'crowd' && <Flame className="w-3 h-3 text-red-500" />}
                {hotspot.type === 'gem' && <Sparkles className="w-3 h-3 text-amber-400" />}
                {hotspot.type === 'risk' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                {hotspot.type === 'temple' && <Landmark className="w-3 h-3 text-emerald-400" />}
                {hotspot.type === 'tourist' && <Moon className="w-3 h-3 text-blue-400" />}
                {hotspot.name}
              </div>
              <p className="text-slate-400 mt-1">{hotspot.desc}</p>
            </div>
          </div>
        ))}

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-[#090d16]/90 border border-slate-800/80 p-2.5 rounded-xl text-[10px] space-y-1.5 backdrop-blur-sm shadow-xl z-20">
          <div className="font-mono text-[9px] text-slate-400 font-semibold tracking-wider uppercase">MAP LEGEND</div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Stable Traffic Zone</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>High Density Crowd</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Congested / Overloaded</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 border border-amber-400/50 bg-amber-500/10 rounded flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-amber-400" />
            </span>
            <span>AI Hidden Gem Beacon</span>
          </div>
        </div>

        {/* Selected zone telemetric card */}
        {selectedZone && (
          <div className="absolute top-3 right-3 bg-[#090d16]/95 border border-slate-800 p-3 rounded-xl w-60 backdrop-blur-sm shadow-xl z-20 animate-fade-in">
            {(() => {
              const zone = zones.find(z => z.id === selectedZone);
              if (!zone) return null;
              return (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 uppercase">
                      Telemetry Active
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectZone(''); }}
                      className="text-slate-500 hover:text-slate-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-2">{zone.name}</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2.5 border-t border-slate-800/80 pt-2.5 text-[10px]">
                    <div>
                      <span className="text-slate-500 block">Active Vendors:</span>
                      <span className="text-slate-200 font-medium">{zone.activeVendorsCount} stalls</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hidden Gems:</span>
                      <span className="text-amber-400 font-medium">✨ {zone.hiddenGemsCount} pins</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Crowd State:</span>
                      <span className={`font-medium ${
                        zone.crowdLevel === 'Overloaded' ? 'text-rose-400' :
                        zone.crowdLevel === 'High' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{zone.crowdLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Road Traffic:</span>
                      <span className={`font-medium ${
                        zone.trafficIntensity === 'Gridlock' || zone.trafficIntensity === 'Heavy' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>{zone.trafficIntensity}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
