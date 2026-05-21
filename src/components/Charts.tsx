import { useState } from 'react';
import { Eye, Clock, TrendingUp, Compass } from 'lucide-react';

// Line chart component
export function LineChartUserGrowth() {
  const points = [
    { label: 'Mon', value: 1200 },
    { label: 'Tue', value: 1600 },
    { label: 'Wed', value: 1400 },
    { label: 'Thu', value: 2100 },
    { label: 'Fri', value: 2900 },
    { label: 'Sat', value: 4200 },
    { label: 'Sun', value: 3800 },
  ];

  // Map to SVG coordinates
  const height = 150;
  const width = 450;
  const paddingX = 40;
  const paddingY = 20;

  const maxVal = Math.max(...points.map((p) => p.value)) * 1.1;
  const pointsString = points
    .map((p, i) => {
      const x = paddingX + (i * (width - 2 * paddingX)) / (points.length - 1);
      const y = height - paddingY - (p.value * (height - 2 * paddingY)) / maxVal;
      return `${x},${y}`;
    })
    .join(' ');

  // Create area path
  const areaString = `${paddingX},${height - paddingY} ${pointsString} ${width - paddingX},${height - paddingY}`;

  return (
    <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl relative overflow-hidden h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Active User Trajectory</h4>
          <span className="text-2xl font-display font-semibold text-slate-100 flex items-baseline gap-1 mt-1">
            4.2K <span className="text-xs font-sans text-emerald-400 font-normal">▲ 32% this week</span>
          </span>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/15">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="relative w-full overflow-hidden mt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
          <defs>
            <linearGradient id="gradient-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="2 2" />
          <line x1={paddingX} y1={(height - paddingY * 2) / 2 + paddingY} x2={width - paddingX} y2={(height - paddingY * 2) / 2 + paddingY} stroke="#1e293b" strokeDasharray="2 2" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#334155" strokeWidth="1" />

          {/* Glowing area under curve */}
          <polygon points={areaString} fill="url(#gradient-glow)" />

          {/* Polyline line */}
          <polyline fill="none" stroke="#10b981" strokeWidth="3" points={pointsString} strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive dots */}
          {points.map((p, i) => {
            const x = paddingX + (i * (width - 2 * paddingX)) / (points.length - 1);
            const y = height - paddingY - (p.value * (height - 2 * paddingY)) / maxVal;
            return (
              <g key={i} className="group/dot cursor-pointer">
                <circle cx={x} cy={y} r="4" fill="#0b0f19" stroke="#10b981" strokeWidth="2.5" />
                <circle cx={x} cy={y} r="10" fill="#10b981" fillOpacity="0" className="hover:fill-opacity-15 transition" />
              </g>
            );
          })}
        </svg>

        {/* Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-6">
          {points.map((p, i) => (
            <span key={i}>{p.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bar chart component
export function BarChartTopZones() {
  const data = [
    { zone: 'Koramangala Hub', orders: 1240, color: 'bg-indigo-500' },
    { zone: 'VV Puram Street', orders: 1105, color: 'bg-emerald-500' },
    { zone: 'Indiranagar late', orders: 843, color: 'bg-amber-500' },
    { zone: 'Malleshwaram Hub', orders: 620, color: 'bg-blue-500' },
    { zone: 'ISKCON Sacred', orders: 490, color: 'bg-rose-500' },
  ];

  const maxVal = Math.max(...data.map((d) => d.orders));

  return (
    <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full">
      <div className="mb-4">
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Busiest Food Precincts</h4>
        <p className="text-xs text-slate-500 mt-1">Weighted transaction velocity per zone</p>
      </div>

      <div className="space-y-3.5 pt-2">
        {data.map((item, idx) => {
          const percentage = (item.orders / maxVal) * 100;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-300">{item.zone}</span>
                <span className="font-mono text-slate-400 font-semibold">{item.orders} orders</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Donut/Pie Chart component
export function DonutChartCulinary() {
  const categories = [
    { name: 'South Indian Legacy', percent: 45, color: '#10b981' },
    { name: 'Chaat & Savory', percent: 22, color: '#f59e0b' },
    { name: 'Mutton & Biryani', percent: 18, color: '#ef4444' },
    { name: 'Shawarma & Grilled', percent: 15, color: '#6366f1' },
  ];

  // Draw simple SVG rings based on stroke-dasharray
  // Concentric ring representation is simple, highly styled and responsive
  return (
    <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl h-full flex flex-col justify-between">
      <div>
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Culinary Share</h4>
        <p className="text-xs text-slate-500 mt-1">Platform classification statistics</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        {/* SVG Donut */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background base Ring */}
            <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="none" />

            {/* Segment 1: 45% (dasharray: 45 * 2 * pi * r / 100) -> 38 * 2 * 3.1415 = 238.7 -> 45% is 107.4 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#10b981"
              strokeWidth="12"
              fill="none"
              strokeDasharray="107.4 238.7"
              strokeDashoffset="0"
            />

            {/* Segment 2: 22% (52.5 length, offset 107.4) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#f59e0b"
              strokeWidth="12"
              fill="none"
              strokeDasharray="52.5 238.7"
              strokeDashoffset="-107.4"
            />

            {/* Segment 3: 18% (42.9 length, offset 159.9) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#ef4444"
              strokeWidth="12"
              fill="none"
              strokeDasharray="42.9 238.7"
              strokeDashoffset="-159.9"
            />

            {/* Segment 4: 15% (35.8 length, offset 202.8) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#6366f1"
              strokeWidth="12"
              fill="none"
              strokeDasharray="35.8 238.7"
              strokeDashoffset="-202.8"
            />
          </svg>

          {/* Central text overlay */}
          <div className="absolute flex flex-col items-center">
            <span className="text-sm font-display font-semibold text-slate-100">8K+</span>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Items</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 flex-1 w-full">
          {categories.map((c, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.color }}></span>
                <span className="text-slate-400 font-medium">{c.name}</span>
              </div>
              <span className="font-mono text-slate-300 font-bold">{c.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Heatmap / Grid for Peak Hours activity
export function HeatmapPeakPeriod() {
  const days = ['Breakfast (8-11)', 'Lunch (12-15)', 'Snacks (16-19)', 'Dinner (19-22)', 'Midnight (22-02)'];
  const statusLevels = [
    { label: 'Indiranagar', values: [3, 4, 2, 5, 5] },
    { label: 'VV Puram', values: [1, 2, 4, 5, 4] },
    { label: 'Koramangala', values: [2, 5, 3, 5, 5] },
    { label: 'ISKCON Temple', values: [5, 4, 3, 2, 0] },
    { label: 'Malleshwaram', values: [5, 4, 4, 2, 1] },
  ];

  // Helper for background color mapping based on index (0 to 5 density)
  const getDensityColor = (lvl: number) => {
    switch (lvl) {
      case 0:
        return 'bg-slate-900 border-slate-800 text-slate-700';
      case 1:
        return 'bg-emerald-950/20 text-emerald-800 border-emerald-900/30';
      case 2:
        return 'bg-emerald-900/30 text-emerald-600 border-emerald-800/40';
      case 3:
        return 'bg-emerald-800/45 text-emerald-400 border-emerald-700/50';
      case 4:
        return 'bg-emerald-600/70 text-emerald-100 border-emerald-500/30';
      case 5:
        return 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm shadow-emerald-500/20';
      default:
        return 'bg-slate-950';
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Peak Load Density Map</h4>
          <span className="text-xs text-slate-500 block mt-1">Real-time crowd order levels per time-slot</span>
        </div>
        <div className="flex gap-1 items-center bg-[#0b0f19] px-2 py-1 rounded-lg border border-slate-800 text-[9px] text-slate-400 font-mono">
          <Clock className="w-3 h-3 text-slate-400" /> Hourly Matrix
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-[10px] font-mono text-slate-500 font-medium whitespace-nowrap">Zone Hub</th>
              {days.map((d, i) => (
                <th key={i} className="p-1.5 text-[9px] font-mono text-slate-500 font-medium text-center whitespace-nowrap">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statusLevels.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-800/30">
                <td className="p-1.5 text-xs text-slate-300 font-medium whitespace-nowrap">{row.label}</td>
                {row.values.map((v, i) => (
                  <td key={i} className="p-1 text-center">
                    <div
                      className={`h-7 w-12 rounded-md mx-auto text-[9px] flex items-center justify-center border transition-all ${getDensityColor(
                        v
                      )}`}
                    >
                      {v * 20}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-4 border-t border-slate-800/60 pt-3">
        <span>Low Traffic (0%)</span>
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-950/40"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-900/60"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-700/80"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
        </div>
        <span>Peak Overload (100%)</span>
      </div>
    </div>
  );
}
