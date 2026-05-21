import {
  LineChartUserGrowth,
  BarChartTopZones,
  DonutChartCulinary,
  HeatmapPeakPeriod
} from '../components/Charts';
import { TrendingUp, Award, Map, Sparkles, Trophy } from 'lucide-react';

interface AnalyticsTabProps {
  onTriggerActionToast: (msg: string) => void;
}

export default function AnalyticsTab({ onTriggerActionToast }: AnalyticsTabProps) {
  const handleRecalculateStats = () => {
    onTriggerActionToast('Compiling analytical datasets. Recalculating average transaction margins.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
            DATA WAREHOUSE INTELLIGENCE
          </span>
          <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Platform Analytics & BI</h2>
          <p className="text-xs text-slate-400">
            Synthesize transactional velocities, retention matrices, and high-frequency culinary popularity records.
          </p>
        </div>

        <button
          onClick={handleRecalculateStats}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-mono cursor-pointer transition"
        >
          Recalculate Platform Stats
        </button>
      </div>

      {/* STATS TILES BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition"></div>
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Daily Active Users</span>
          <span className="text-xl font-display font-bold block mt-1.5 text-slate-250">
            12.8K <span className="text-xs font-sans text-emerald-400 font-normal">▲ 14.2%</span>
          </span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition"></div>
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Repeat Users Rate</span>
          <span className="text-xl font-display font-bold block mt-1.5 text-slate-250">
            28.4% <span className="text-xs font-sans text-emerald-400 font-normal">▲ 3.1%</span>
          </span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition"></div>
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Monthly Stalls growth</span>
          <span className="text-xl font-display font-bold block mt-1.5 text-slate-250">
            +15.2% <span className="text-xs font-sans text-emerald-400 font-normal">▲ 1.4%</span>
          </span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition"></div>
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Net City Coverage growth</span>
          <span className="text-xl font-display font-bold block mt-1.5 text-slate-250">
            +8.5% <span className="text-xs font-sans text-emerald-400 font-normal">▲ 0.9%</span>
          </span>
        </div>
      </div>

      {/* MATRIX OF CHARTS - GRID BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User acquisition line chart */}
        <LineChartUserGrowth />

        {/* Top busy zones bar chart */}
        <BarChartTopZones />

        {/* Culinary classification pie donut chart */}
        <DonutChartCulinary />

        {/* Peak ordering hours heat-matrix chart */}
        <HeatmapPeakPeriod />
      </div>

      {/* DISCOVERY LEADERBOARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leaderboard 1: Trending dishes */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5 font-bold">
            <Trophy className="w-4 h-4 text-emerald-400" /> Platform Trending Dishes
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-300 font-medium">1. Butter Ghee Roast Dosa</span>
              <span className="font-mono text-emerald-400 font-bold bg-[#10b981]/10 px-2 py-0.5 rounded">₹100 • High</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20">
              <span className="text-slate-300 font-medium">2. Melt-In-Mouth Rava Idli</span>
              <span className="font-mono text-emerald-400 font-bold bg-[#10b981]/10 px-2 py-0.5 rounded">₹60 • Mid</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20">
              <span className="text-slate-300 font-medium">3. Double-Cheese Chicken Shawarma</span>
              <span className="font-mono text-emerald-400 font-bold bg-[#10b981]/10 px-2 py-0.5 rounded">₹140 • Mid</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20">
              <span className="text-slate-300 font-medium">4. Street Veg Samosa Chaat</span>
              <span className="font-mono text-emerald-400 font-bold bg-[#10b981]/10 px-2 py-0.5 rounded">₹70 • Stable</span>
            </div>
          </div>
        </div>

        {/* Leaderboard 2: Top categories performance */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" /> High-Performance Food Styles
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-300 font-medium">South Indian Breakfast Legacy</span>
              <span className="font-mono text-slate-400 font-semibold text-right">4.8★ Avg rating</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20">
              <span className="text-slate-300 font-medium">Sacred Temple Fasting Foods</span>
              <span className="font-mono text-slate-400 font-semibold text-right">4.9★ Avg rating</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20">
              <span className="text-slate-300 font-medium">Midnight Charcoal Biryanis</span>
              <span className="font-mono text-slate-400 font-semibold text-right">4.5★ Avg rating</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20">
              <span className="text-slate-300 font-medium">Indo-Chinese Noodles & Manchurian</span>
              <span className="font-mono text-slate-400 font-semibold text-right">4.1★ Avg rating</span>
            </div>
          </div>
        </div>

        {/* Leaderboard 3: Top performing temple zones */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5 font-bold">
            <Map className="w-4 h-4 text-emerald-400" /> Busiest Tourist & Temple Hubs
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 font-medium">
              <span className="text-slate-300">1. ISKCON Sacred Exit Walkway</span>
              <span className="font-mono text-slate-400">8.9K pilgrim hits/day</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20 font-medium">
              <span className="text-slate-300">2. Malleshwaram Temple Corridor</span>
              <span className="font-mono text-slate-400">5.5K hits/day</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20 font-medium">
              <span className="text-slate-300">3. VV Puram Sajjan Rao Food Circle</span>
              <span className="font-mono text-slate-400">15.2K hits/evening</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-855/20 font-medium">
              <span className="text-slate-300">4. Jayanagar 4th Block Temple area</span>
              <span className="font-mono text-slate-400">3.8K hits/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
