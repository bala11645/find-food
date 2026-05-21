import { Vendor, Zone, Order, AIAlert } from '../types';
import MapPlaceholder from '../components/MapPlaceholder';
import { initialAIInsights, trendingSearchQueries } from '../data';
import {
  Users,
  Store,
  Clock,
  MapPin,
  ShieldAlert,
  Sparkles,
  ClipboardCheck,
  TrendingUp,
  Search,
  Bell,
  ArrowRight
} from 'lucide-react';

interface DashboardTabProps {
  vendors: Vendor[];
  zones: Zone[];
  orders: Order[];
  aiAlerts: AIAlert[];
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
  onNavigateTab: (tab: any) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function DashboardTab({
  vendors,
  zones,
  orders,
  aiAlerts,
  selectedZone,
  onSelectZone,
  onNavigateTab,
  onTriggerActionToast
}: DashboardTabProps) {
  // Compute key stats dynamically
  const totalVendors = vendors.length;
  const activeVendorsCount = vendors.filter((v) => v.status === 'Active').length;
  const liveOrdersCount = orders.filter((o) => o.status === 'Processing').length;
  const activeZonesCount = zones.filter((z) => z.status === 'Active').length;
  const pendingApprovalsCount = vendors.filter((v) => v.onboardingStatus === 'Pending').length;
  const hygieneAlertsCount = vendors.filter((v) => v.hygieneScore < 70).length;
  const hiddenGemsCount = vendors.filter((v) => v.hiddenGemScore >= 90).length;

  // Render metric card helper
  const renderMetricCard = (
    title: string,
    value: string | number,
    colorClass: string,
    icon: any,
    trendText?: string,
    isTrendUp?: boolean,
    onClickTab?: any
  ) => {
    return (
      <div
        onClick={onClickTab ? () => onNavigateTab(onClickTab) : undefined}
        className={`bg-[#0f172a] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition cursor-pointer relative group`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-2xl group-hover:bg-slate-800/25 transition"></div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
              {title}
            </span>
            <span className={`text-2xl font-display font-semibold ${colorClass}`}>{value}</span>
          </div>
          <div className="bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800 text-slate-300">
            {icon}
          </div>
        </div>
        {trendText && (
          <div className="mt-3.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`font-medium ${isTrendUp ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isTrendUp ? '▲' : '•'} {trendText}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Activity events
  const activityEvents = [
    { id: 'e-1', type: 'signup', text: 'New vendor signup request from "Central Silk Board Gobi Cart"', area: 'Koramangala', time: '12 min ago' },
    { id: 'e-2', type: 'spike', text: 'Order transaction spike detected (180 orders/min) during evening festival', area: 'ISKCON Sacred food lane', time: '20 min ago' },
    { id: 'e-3', type: 'gem', text: 'AI updated Hidden Gem ranking score for "Veena Stores Malleshwaram Legacy" to 97', area: 'Malleshwaram', time: '1 hr ago' },
    { id: 'e-4', type: 'flag', text: 'Content automated moderator flagged a Reel uploaded by "Koramangala Shawarma Spot" for duplicate tag spamming', area: 'Koramangala', time: '2 hr ago' },
    { id: 'e-5', type: 'alert', text: 'Hygiene alert: low inspection score logged, warning sent', area: 'VV Puram Chaat House', time: '4 hr ago' },
    { id: 'e-6', type: 'complaint', text: 'Critical hygiene complaint registered: "Raw poultry reported served"', area: 'Koramangala Shawarma Spot', time: '5 hr ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
            SUPER ADMIN SYSTEMS MONITOR
          </span>
          <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Bangalore Command Center</h2>
          <p className="text-xs text-slate-400">Platform-wide health, safety, and business indicators</p>
        </div>
        
        {/* Quick action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              onNavigateTab('approval');
              onTriggerActionToast('Loading vendor approval queue.');
            }}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition"
          >
            <ClipboardCheck className="w-3.5 h-3.5" /> Approve Pending ({pendingApprovalsCount})
          </button>
          <button
            onClick={() => {
              onNavigateTab('hygiene');
              onTriggerActionToast('Analyzing platform safety parameters.');
            }}
            className="px-3.5 py-1.5 bg-[#ef4444]/15 hover:bg-[#ef4444]/30 text-rose-400 border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Hygiene Watch ({hygieneAlertsCount})
          </button>
        </div>
      </div>

      {/* Metric Cards Grid - Multi column */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard('Total Vendor Registy', totalVendors, 'text-slate-100', <Store className="w-4 h-4 text-slate-400" />, `${activeVendorsCount} stalls active platform-wide`, true, 'vendors')}
        {renderMetricCard('Live Processing Orders', liveOrdersCount, 'text-emerald-400', <Clock className="w-4 h-4 text-emerald-400" />, 'Peak evening transaction pace', true, 'orders')}
        {renderMetricCard('Active City Zones', activeZonesCount, 'text-blue-400', <MapPin className="w-4 h-4 text-blue-400" />, 'Across 6 high-density hub districts', false, 'zones')}
        {renderMetricCard('Pending Screening Queue', pendingApprovalsCount, 'text-amber-400', <Users className="w-4 h-4 text-amber-400" />, 'Approvals require documents inspection', false, 'approval')}
        {renderMetricCard('Hygiene Breaches Flagged', hygieneAlertsCount, 'text-rose-400', <ShieldAlert className="w-4 h-4 text-rose-400" />, 'Vendors score below safety limit', false, 'hygiene')}
        {renderMetricCard('Platform Hidden Gems', hiddenGemsCount, 'text-amber-500', <Sparkles className="w-4 h-4 text-amber-500" />, 'Weighted rating above 90/100', true, 'ai')}
        {renderMetricCard('Active Inspectors Pool', 3, 'text-slate-200', <ClipboardCheck className="w-4 h-4 text-slate-400" />, 'Monitoring compliance daily in zones', false, 'inspectors')}
        {renderMetricCard('Daily Average Revenue', '₹24.8K', 'text-emerald-500', <TrendingUp className="w-4 h-4 text-emerald-500" />, '+11.4% platform growth (WoW)', true, 'analytics')}
      </div>

      {/* Main split: Map and AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heavy graphic Map section */}
        <div className="xl:col-span-2">
          <MapPlaceholder
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={onSelectZone}
          />
        </div>

        {/* AI Engine real-time cognitive insights panel */}
        <div className="bg-[#161618] border border-amber-500/15 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.03)] hover:border-amber-500/35 transition-all duration-500 group/ai-card">
          {/* Subtle neon orb ambient glow in background top-right */}
          <div className="absolute top-[-30px] right-[-20px] w-48 h-48 bg-amber-500/5 rounded-full blur-[50px] group-hover/ai-card:bg-amber-500/8 transition-all duration-500" />
          
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-semibold text-white tracking-tight">Cognitive AI Dispatch</h3>
                  <span className="text-[9px] font-mono text-slate-500">Autonomous Risk Scoring v2.9</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Active
              </span>
            </div>

            <div className="space-y-3.5 mt-5 relative z-10">
              {initialAIInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-white/5 bg-[#0d0d0f]/60 hover:bg-[#1a1a1c]/40 text-xs leading-relaxed text-slate-300 relative overflow-hidden flex gap-3 hover:border-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.03)] transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">SIGNAL #{idx + 1}</span>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('ai')}
            className="w-full mt-6 py-3 px-4 bg-[#0d0d0f] border border-white/5 hover:bg-slate-900 hover:text-amber-400 hover:border-amber-500/30 text-slate-400 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 cursor-pointer transition relative z-10"
          >
            Launch Neural Engine Monitoring <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Secondary split: Live event log and Trending searches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time event log */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Real-Time Operations Feed</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live platform telemetry logs</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              9 live triggers
            </span>
          </div>

          <div className="divide-y divide-slate-850 text-xs">
            {activityEvents.map((evt) => {
              let labelColor = 'text-blue-400 bg-blue-500/10';
              if (evt.type === 'alert' || evt.type === 'complaint') labelColor = 'text-rose-400 bg-rose-500/10';
              else if (evt.type === 'signup') labelColor = 'text-amber-400 bg-amber-500/10';
              else if (evt.type === 'gem') labelColor = 'text-emerald-400 bg-emerald-500/10';

              return (
                <div key={evt.id} className="py-3 flex justify-between items-center gap-4 hover:bg-slate-900/40 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded shrink-0 font-bold ${labelColor}`}>
                      {evt.type}
                    </span>
                    <span className="text-slate-350">{evt.text}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap text-right">
                    <span className="block text-slate-400 font-medium">{evt.area}</span>
                    <span>{evt.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-Time Search Query Spike */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-emerald-400" />
                  AI Hot-Searches
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">Real-time localized customer intents</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {trendingSearchQueries.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-[#0b0f19] border border-slate-850 hover:border-slate-750 transition">
                  <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[10px]">#{idx + 1}</span>
                    <span>“{item.query}”</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold block">{item.spike}</span>
                    <span className="text-[9px] font-mono text-slate-500">{item.count} hits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-850 mt-4 pt-3 text-[11px] text-slate-500 font-mono text-center flex items-center justify-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-amber-500" /> Search queries affect real-time rank weights active on customer menus.
          </div>
        </div>
      </div>
    </div>
  );
}
