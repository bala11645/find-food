import { Download, FileText, BarChart, HardDriveDownload } from 'lucide-react';

interface ReportsTabProps {
  onTriggerActionToast: (msg: string) => void;
}

export default function ReportsTab({ onTriggerActionToast }: ReportsTabProps) {
  const reportsList = [
    { name: 'Vendor Operational Performance', description: 'Aggregated food orders counts, cooking speed averages, and rating variables across Bangalore.', dateRange: 'May 01, 2026 - May 21, 2026', type: 'performance' },
    { name: 'City Zone Analytics Brief', description: 'Crowd density charts, peak travel delays, and tourist hub visitor hotspots analytics.', dateRange: 'May 14, 2026 - May 21, 2026', type: 'city' },
    { name: 'FSSAI Co-signed Hygiene Audit Log', description: 'Summarized health inspection results, grease trap statuses, and automated AI image safety score files.', dateRange: 'April 2026 Quarterly review', type: 'hygiene' },
    { name: 'SaaS Platform Revenue & Reconciliation', description: 'Micro-transaction subscription recurring fee logs, tax deductions (GST audits), and payout logs.', dateRange: 'May 01, 2026 - May 21, 2526', type: 'revenue' },
    { name: 'Field Inspector Operations Timeline', description: 'Worker route compliance tracking, scheduled versus delayed visits logs, and field notes brief.', dateRange: 'May 01, 2026 - May 21, 2026', type: 'inspector' }
  ];

  const handleExport = (reportName: string, format: 'PDF' | 'CSV') => {
    onTriggerActionToast(`Building raw dataset for "${reportName}". Exporting secure ${format} download...`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          SECURE EXPORT CENTER
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Downloadable Administrative Reports</h2>
        <p className="text-xs text-slate-400">
          Recompile server datasets into compliant official PDF/CSV formats. Suitable for municipal, FSSAI, or accounting audit trials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((rep, idx) => (
          <div
            key={idx}
            className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-200 text-sm leading-snug">{rep.name}</h3>
                <span className="p-1 px-2 text-[9px] font-mono rounded bg-slate-900 text-slate-400 border border-slate-850">
                  {rep.type}
                </span>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">{rep.description}</p>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                📅 Date Range Mask: <strong className="text-slate-400">{rep.dateRange}</strong>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-900/40">
              <button
                onClick={() => handleExport(rep.name, 'PDF')}
                className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs rounded-lg transition font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" /> Export PDF Format
              </button>
              <button
                onClick={() => handleExport(rep.name, 'CSV')}
                className="flex-1 py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 text-xs rounded-lg transition font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Raw CSV
              </button>
            </div>
          </div>
        ))}

        {/* Global database backup auxiliary module */}
        <div className="bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-950/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 md:col-span-2">
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-bold">
              PLATFORM TELEMETRY MASTER BACKUP
            </span>
            <h4 className="text-sm font-semibold text-slate-200">Generate Full Operational Snap-Brief</h4>
            <p className="text-xs text-slate-400 max-w-2xl leading-normal">
              Bundle entire active vendors, orders, hygiene reports, and inspector timelines into a single unified JSON warehouse seed index. Highly recommended before server upgrades.
            </p>
          </div>

          <button
            onClick={() => handleExport('Platform Core Unified Snapshot', 'CSV')}
            className="self-start py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1.5"
          >
            <HardDriveDownload className="w-4 h-4" /> Package Unified Database Backup (.zip)
          </button>
        </div>
      </div>
    </div>
  );
}
