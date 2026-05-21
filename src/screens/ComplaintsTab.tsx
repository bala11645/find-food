import { useState } from 'react';
import { Complaint } from '../types';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, Filter, Search, Cpu, RefreshCw, AlertOctagon } from 'lucide-react';
import { classifyComplaintTicket, ComplaintClassificationResult } from '../services/geminiService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ComplaintsTabProps {
  complaints: Complaint[];
  onResolveComplaint: (id: string) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function ComplaintsTab({
  complaints,
  onResolveComplaint,
  onTriggerActionToast
}: ComplaintsTabProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'Open' | 'Pending' | 'Resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [analyzingTicketId, setAnalyzingTicketId] = useState<string | null>(null);
  const [complaintErrors, setComplaintErrors] = useState<Record<string, string>>({});
  const [complaintClassifications, setComplaintClassifications] = useState<Record<string, ComplaintClassificationResult>>(() => {
    const initial: Record<string, ComplaintClassificationResult> = {};
    complaints.forEach((c) => {
      if ((c as any).aiClassification) {
        initial[c.id] = (c as any).aiClassification;
      }
    });
    return initial;
  });

  const handleClassifyComplaint = async (ticket: Complaint) => {
    setAnalyzingTicketId(ticket.id);
    setComplaintErrors(prev => ({ ...prev, [ticket.id]: '' }));
    onTriggerActionToast(`Engaging Gemini intent engine for semantic text categorization...`);
    try {
      const data = await classifyComplaintTicket(ticket.id, ticket.description);
      setComplaintClassifications(prev => ({
        ...prev,
        [ticket.id]: data
      }));

      // Saved in state
      onTriggerActionToast(`Gemini resolved ticket severity & risk factors!`);
    } catch (e: any) {
      setComplaintErrors(prev => ({ ...prev, [ticket.id]: e.message || String(e) }));
      onTriggerActionToast(`Classification failed: ${e.message}`);
    } finally {
      setAnalyzingTicketId(null);
    }
  };

  const filteredTickets = complaints.filter((t) => {
    // Search
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Filter status
    if (activeFilter === 'all') return true;
    return t.status === activeFilter;
  });

  const handleEscalateManager = (id: string, name: string) => {
    onTriggerActionToast(`Ticket [${id}] escalated to Chief City Food Administrator. SMS alert fired.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          GRIEVANCE REDRESSAL MONITOR
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Complaint & Support Center</h2>
        <p className="text-xs text-slate-400">
          Triage citizen hygiene complaints, process vendor payment disputes, and dispatch inspectors to high-risk street dining spots.
        </p>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-slate-750 transition"
              placeholder="Filter by Ticket ID, vendor target, issue string..."
            />
          </div>

          <div className="flex bg-[#0b0f19] p-1 rounded-xl border border-slate-850 self-start">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs rounded-lg transition ${
                activeFilter === 'all'
                  ? 'bg-slate-800 text-slate-100 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Tickets ({complaints.length})
            </button>
            <button
              onClick={() => setActiveFilter('Open')}
              className={`px-3 py-1 text-xs rounded-lg transition flex items-center gap-1 ${
                activeFilter === 'Open'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Open ({complaints.filter(c => c.status === 'Open').length})
            </button>
            <button
              onClick={() => setActiveFilter('Pending')}
              className={`px-3 py-1 text-xs rounded-lg transition flex items-center gap-1 ${
                activeFilter === 'Pending'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({complaints.filter(c => c.status === 'Pending').length})
            </button>
            <button
              onClick={() => setActiveFilter('Resolved')}
              className={`px-3 py-1 text-xs rounded-lg transition flex items-center gap-1 ${
                activeFilter === 'Resolved'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Resolved ({complaints.filter(c => c.status === 'Resolved').length})
            </button>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="space-y-4 pt-1">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No dispute tickets match current filters.
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              let priorityColor = 'text-slate-400 bg-slate-800 border-slate-700';
              if (ticket.priority === 'Critical') priorityColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
              else if (ticket.priority === 'High') priorityColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';

              let statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/15';
              if (ticket.status === 'Resolved') statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
              else if (ticket.status === 'Pending') statusBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

              return (
                <div
                  key={ticket.id}
                  className="bg-[#080d15] border border-slate-850 rounded-xl p-5 hover:border-slate-800 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-slate-500 font-bold">{ticket.id}</span>
                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${priorityColor}`}>
                        {ticket.priority} Priority
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">{ticket.issueType} Category</span>
                    </div>

                    <h4 className="font-semibold text-slate-200 text-sm">
                      Complaint against: <span className="text-emerald-400">{ticket.targetName}</span>
                    </h4>
                    
                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl italic">
                      "{ticket.description}"
                    </p>

                    {complaintErrors[ticket.id] && (
                      <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-xs text-rose-400 font-mono mt-3">
                        🚨 <strong>Triage Engine Failed:</strong> {complaintErrors[ticket.id]}
                      </div>
                    )}

                    {/* Gemini Live Scan Diagnostic Box */}
                    {complaintClassifications[ticket.id] && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 space-y-2 select-none text-[10px] font-mono mt-3">
                        <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400 font-sans">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" /> GEMINI INCIDENT TRIAGE
                          </span>
                          <span>RISK SEVERITY: {complaintClassifications[ticket.id].priority} ({Math.round((complaintClassifications[ticket.id].confidence || 0.90) * 100)}% CONFIDENCE)</span>
                        </div>
                        <div className="text-zinc-350 leading-relaxed">
                          Category: <strong className="text-zinc-200">{complaintClassifications[ticket.id].issueCategory}</strong> | Agent Advice: <span className="text-slate-400">{complaintClassifications[ticket.id].dispatchedUnit}</span>
                        </div>
                        <div className="text-zinc-300 leading-relaxed p-2.5 bg-slate-900/60 rounded border border-white/5 font-sans italic mt-1 text-[11px]">
                          "Suggested Action: {complaintClassifications[ticket.id].automatedResponseDraft}"
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[10.5px] font-mono text-slate-500 pt-1">
                      <span>Assigned Agent: <strong className="text-slate-450">{ticket.assignedTo}</strong></span>
                      <span>Filed: {ticket.createdDate}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row md:flex-col justify-end gap-2.5 shrink-0 self-end md:self-center">
                    <div className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded border uppercase font-bold self-start md:self-end justify-center w-24">
                      {ticket.status}
                    </div>

                     {ticket.status !== 'Resolved' && (
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => handleClassifyComplaint(ticket)}
                          disabled={analyzingTicketId === ticket.id}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-mono font-bold cursor-pointer transition flex items-center justify-center gap-1 shrink-0"
                        >
                          {analyzingTicketId === ticket.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Cpu className="w-3.5 h-3.5" />
                          )}
                          AI Triage
                        </button>
                        <button
                          onClick={() => {
                            onResolveComplaint(ticket.id);
                            onTriggerActionToast(`Ticket [${ticket.id}] flagged as RESOLVED. Inventory logs closed.`);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-bold cursor-pointer transition"
                        >
                          Mark Solved
                        </button>
                        <button
                          onClick={() => handleEscalateManager(ticket.id, ticket.targetName)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-350 rounded-lg text-xs font-mono cursor-pointer transition border border-slate-815"
                        >
                          Escalate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
