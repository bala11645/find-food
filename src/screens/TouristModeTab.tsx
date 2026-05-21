import { useState, FormEvent } from 'react';
import { Vendor } from '../types';
import { Sparkles, MapPin, Award, Compass, Eye, Heart, Plus, ListFilter, Cpu, RefreshCw, CheckCircle, ThumbsUp } from 'lucide-react';
import { getHiddenGemsDetail, HiddenGemResult } from '../services/geminiService';
import { initialContentPosts, trendingSearchQueries } from '../data';

interface TouristModeTabProps {
  vendors: Vendor[];
  onUpdateVendor: (v: Vendor) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function TouristModeTab({ vendors, onUpdateVendor, onTriggerActionToast }: TouristModeTabProps) {
  // Filter tourist-favorite gems or high hidden-gem scores
  const touristGems = vendors.filter((v) => v.hiddenGemScore >= 85);

  const getBuzzSignals = (v: Vendor) => {
    const post = initialContentPosts.find(p => p.vendorName.toLowerCase().includes(v.stallName.toLowerCase()) || v.stallName.toLowerCase().includes(p.vendorName.toLowerCase()));
    const trend = trendingSearchQueries.find(t => v.nearbyFoodStreet.toLowerCase().includes(t.query.toLowerCase()) || v.stallName.toLowerCase().includes(t.query.toLowerCase()));
    return {
      views: post?.views || (v.ordersCount * 14 + 1200),
      likes: post?.likes || (Math.floor(v.ordersCount * 2.4) + 180),
      spike: trend?.spike || (v.hiddenGemScore > 92 ? "+38% search spike" : "+10% buzz")
    };
  };

  const getCustomReviews = (v: Vendor) => {
    return [
      { id: '1', text: `Incredible authentic taste. True culinary lineage at ${v.stallName}! Fully organic prep.`, user: 'CulinaryTraveler' },
      { id: '2', text: `Fabulous hidden retreat in ${v.nearbyFoodStreet}. Super clean, highly recommended.`, user: 'BangaloreBites' }
    ];
  };

  const [evaluatingGemId, setEvaluatingGemId] = useState<string | null>(null);
  const [gemPredictions, setGemPredictions] = useState<Record<string, HiddenGemResult>>({});
  const [gemErrors, setGemErrors] = useState<Record<string, string>>({});

  const handlePredictGem = async (vendor: Vendor) => {
    setEvaluatingGemId(vendor.id);
    setGemErrors(prev => ({ ...prev, [vendor.id]: '' }));
    onTriggerActionToast(`Gemini scanning safety markers & community buzz indicators for "${vendor.stallName}"...`);
    try {
      const reviews = getCustomReviews(vendor);
      const buzz = getBuzzSignals(vendor);
      const vendorPayload = {
        ...vendor,
        buzzViews: buzz.views,
        buzzLikes: buzz.likes,
        buzzSpike: buzz.spike
      };
      
      const data = await getHiddenGemsDetail(vendorPayload, reviews);
      setGemPredictions(prev => ({
        ...prev,
        [vendor.id]: data
      }));
      onTriggerActionToast(`AI Hidden Gem breakdown generated for ${vendor.stallName}!`);
    } catch (e: any) {
      setGemErrors(prev => ({ ...prev, [vendor.id]: e.message || String(e) }));
      onTriggerActionToast(`AI Scan failed: ${e.message}`);
    } finally {
      setEvaluatingGemId(null);
    }
  };

  const [trails, setTrails] = useState([
    { id: 't-1', name: 'Legacy Filter Coffee & Idli Run', duration: '90 mins', coverage: 'Malleshwaram Corridor', activeSellers: 3, description: 'Savor legendary autoclaved fluffy idlis with locally-roasted aromatic filter brews.' },
    { id: 't-2', name: 'Late-Night Butter Ghee Dosa Ride', duration: '120 mins', coverage: 'VV Puram Food Street', activeSellers: 5, description: 'An unforgettable evening ride featuring thick coal-fried crisped ghee roast dosas.' },
    { id: 't-3', name: 'Koramangala Gourmet Bites Trail', duration: '150 mins', coverage: 'Koramangala Tech Hub', activeSellers: 4, description: 'Modern fusion shawarmas, loaded momos, and viral paneer roll carts.' }
  ]);

  const [newTrailName, setNewTrailName] = useState('');
  const [newTrailCoverage, setNewTrailCoverage] = useState('');

  const handleAddCustomTrail = (e: FormEvent) => {
    e.preventDefault();
    if (!newTrailName || !newTrailCoverage) {
      onTriggerActionToast('Error: Please fill in Trail name and district coverage.');
      return;
    }

    const newTrail = {
      id: `trail-${Date.now()}`,
      name: newTrailName,
      duration: '110 mins',
      coverage: newTrailCoverage,
      activeSellers: Math.floor(Math.random() * 3) + 3,
      description: 'Hand-curated state specialty food exploration walk mapped in real-time.'
    };

    setTrails([...trails, newTrail]);
    onTriggerActionToast(`Curated trail created: "${newTrailName}"!`);
    setNewTrailName('');
    setNewTrailCoverage('');
  };

  const handleBoostVendor = (v: Vendor) => {
    const updated = { ...v, hiddenGemScore: Math.min(100, v.hiddenGemScore + 4) };
    onUpdateVendor(updated);
    onTriggerActionToast(`Tourist rating index boosted (+4 points) for ${v.stallName}!`);
  };

  const handleToggleMustTryBadge = (v: Vendor) => {
    const updated = { ...v, isTrustedBadge: !v.isTrustedBadge };
    onUpdateVendor(updated);
    onTriggerActionToast(`"MUST TRY" recommendations badge toggled for ${v.stallName}.`);
  };

  const handleAddVendorToTrail = (trailId: string, vendorName: string) => {
    setTrails(prev => prev.map(t => {
      if (t.id === trailId) {
        return {
          ...t,
          activeSellers: t.activeSellers + 1,
          description: `${t.description.split(' (Now featuring')[0]} (Now featuring ${vendorName}!)`
        };
      }
      return t;
    }));
    onTriggerActionToast(`Success: Added ${vendorName} to trail!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          TOURIST DISCOVERY COMMANDS
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Tourist Mode & Food Trails</h2>
        <p className="text-xs text-slate-400">
          Design curated legacy food walking tours, boost high-integrity local hidden gems, and review community checklist scores.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: Curated food trails list */}
        <div className="xl:col-span-2 space-y-5">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" /> Platform Curated Walks & Trails ({trails.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trails.map((trail) => (
              <div
                key={trail.id}
                className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-slate-150 leading-snug">{trail.name}</h4>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase font-bold whitespace-nowrap">
                      {trail.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {trail.coverage}
                  </p>
                  <p className="text-xs text-slate-300 mt-3 italic leading-relaxed">
                    "{trail.description}"
                  </p>
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-905/60 text-[10.5px] font-mono">
                  <span className="text-slate-500">Includes {trail.activeSellers} active stalls</span>
                  <button
                    onClick={() => onTriggerActionToast(`Pre-pushed trail coordinates of "${trail.name}" to city visitor GPS units.`)}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Broadcast Trail ➜
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create custom path trail form */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-mono text-slate-300 uppercase tracking-widest">
              Create New Curated Food Trail Walkway
            </h4>
            <form onSubmit={handleAddCustomTrail} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name: e.g. Shivaji Nagar Biryani feast"
                value={newTrailName}
                onChange={(e) => setNewTrailName(e.target.value)}
                className="bg-[#0b0f19] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Coverage: e.g. Indiranagar late night"
                value={newTrailCoverage}
                onChange={(e) => setNewTrailCoverage(e.target.value)}
                className="bg-[#0b0f19] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                required
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Save Walkway Path
              </button>
            </form>
          </div>
        </div>

        {/* Right column: MUST TRY & HIDDEN GEMS controller */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              AI 'Hidden Gems' Finder
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Scans hygiene safety, customer reviews & live traffic spike signals with Gemini AI</p>
          </div>

          <div className="divide-y divide-slate-850 text-xs">
            {touristGems.map((v) => {
              const buzz = getBuzzSignals(v);
              return (
                <div key={v.id} className="py-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-200 text-sm leading-normal">{v.stallName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{v.nearbyFoodStreet}</p>
                    </div>
                    <span className="font-mono text-amber-450 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                      Score {v.hiddenGemScore}
                    </span>
                  </div>

                  {/* Dynamic Indicators displaying hygiene safety + customer reviews existence + community buzz signals */}
                  <div className="grid grid-cols-2 gap-2 bg-[#080d16] p-2 rounded-lg border border-white/5 font-mono text-[9px] text-slate-400">
                    <div>
                      <span className="text-[8px] text-slate-550 block">HYGIENE LEVEL</span>
                      <strong className={v.hygieneScore >= 80 ? "text-emerald-400" : "text-amber-400"}>
                        {v.hygieneScore}% • {v.hygieneScore >= 80 ? "Clean Pass" : "Needs Review"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-550 block">BUZZ VECTOR</span>
                      <strong className="text-amber-400 animate-pulse">{buzz.spike}</strong>
                    </div>
                  </div>

                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => handleBoostVendor(v)}
                      className="py-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-[9.5px] font-mono cursor-pointer transition"
                    >
                      Boost (+4)
                    </button>
                    <button
                      onClick={() => handleToggleMustTryBadge(v)}
                      className={`py-1 px-2.5 rounded text-[9.5px] font-mono cursor-pointer border transition ${
                        v.isTrustedBadge
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/20 font-bold'
                          : 'bg-slate-900 border-slate-850 text-slate-500'
                      }`}
                    >
                      {v.isTrustedBadge ? '★ Must Try' : '☆ Pin Star'}
                    </button>
                    <button
                      onClick={() => handlePredictGem(v)}
                      disabled={evaluatingGemId === v.id}
                      className="py-1 px-2.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20 rounded text-[9.5px] font-mono cursor-pointer flex items-center gap-1 transition"
                    >
                      {evaluatingGemId === v.id ? (
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Cpu className="w-2.5 h-2.5" />
                      )}
                      Ask AI
                    </button>
                  </div>

                  {/* Evaluated predictions block */}
                  {gemErrors[v.id] && (
                    <div className="bg-rose-500/10 border border-rose-500/25 p-2 text-[10px] text-rose-450 font-mono rounded">
                      ⚠️ AI Exception: {gemErrors[v.id]}
                    </div>
                  )}

                  {gemPredictions[v.id] && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 space-y-2 font-mono text-[10px] text-zinc-300 leading-normal select-none">
                      <div className="flex justify-between text-emerald-400 border-b border-emerald-500/10 pb-1 text-[9px] font-bold">
                        <span>culinary class</span>
                        <span>{gemPredictions[v.id].gemClassification}</span>
                      </div>
                      <p className="font-sans text-xs italic text-slate-200 leading-snug">
                        "{gemPredictions[v.id].underRatedFactor}"
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-550 border-t border-white/5 pt-1.5">
                        <span>Pulse Likelihood: <strong className="text-emerald-400">{gemPredictions[v.id].spikeProbability}</strong></span>
                        <span>Sentiment: <strong className="text-amber-400">{gemPredictions[v.id].sentimentScore}%</strong></span>
                      </div>
                      <div className="text-[9px] text-emerald-400 animate-pulse bg-emerald-500/5 p-1.5 rounded border border-emerald-500/10">
                        ⭐ <strong>Campaign:</strong> {gemPredictions[v.id].suggestedCampaign}
                      </div>

                      {/* Interactive Add to Walk Trail control! */}
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Add to walking expedition trail:</span>
                        <div className="flex flex-col gap-1">
                          {trails.map(trail => (
                            <button
                              key={trail.id}
                              onClick={() => handleAddVendorToTrail(trail.id, v.stallName)}
                              className="text-[9px] text-left p-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-white/5 cursor-pointer flex justify-between items-center transition"
                            >
                              <span>+ {trail.name}</span>
                              <span className="text-[8px] bg-[#10b981]/15 text-[#10b981] px-1 rounded uppercase font-bold text-[8px]">
                                {trail.duration}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
