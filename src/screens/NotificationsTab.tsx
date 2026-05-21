import { useState, FormEvent } from 'react';
import { AdminNotification } from '../types';
import { Bell, Mail, Plus, CheckCircle, RefreshCw } from 'lucide-react';

interface NotificationsTabProps {
  notifications: AdminNotification[];
  onAddNotification: (n: AdminNotification) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function NotificationsTab({
  notifications,
  onAddNotification,
  onTriggerActionToast
}: NotificationsTabProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'All Vendors' | 'Specific Zone' | 'Low Hygiene' | 'Premium Only'>('All Vendors');
  const [type, setType] = useState<'Hygiene Alert' | 'Festival Notice' | 'System Maintenance' | 'Promotion'>('Hygiene Alert');
  const [scheduleTime, setScheduleTime] = useState('2026-05-21T18:00');

  const handleDispatchAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      onTriggerActionToast('Error: Please fill in Title and Body contents.');
      return;
    }

    const created: AdminNotification = {
      id: `NTF-${Date.now()}`,
      title,
      body,
      audience,
      type,
      scheduleTime: new Date(scheduleTime).toISOString(),
      sentStatus: 'Sent'
    };

    onAddNotification(created);
    onTriggerActionToast(`SMS & App Broadcast sent to target [${audience}]!`);
    
    // reset form
    setTitle('');
    setBody('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          METROPOLITAN ALERTS DISPATCHER
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Broadcast Notifications & Announcements</h2>
        <p className="text-xs text-slate-400">
          Compose state notifications, distribute hygiene alerts, broadcast carnival notices, and audit historically sent SMS files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Composing announcement */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 font-sans">
              <Mail className="w-5 h-5 text-emerald-400" />
              Compose Broadcast Message
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Dispatches to mobile SMS & dashboard widgets</p>
          </div>

          <form onSubmit={handleDispatchAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Audience Filter Target
              </label>
              <select
                value={audience}
                onChange={(e: any) => setAudience(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-850 p-2.5 rounded-xl text-slate-300 outline-none"
              >
                <option value="All Vendors">All City Street-Food Vendors</option>
                <option value="Specific Zone">Specific Zone Hub (Sajjan Rao bounds)</option>
                <option value="Low Hygiene">Sellers on Hygiene Watch list (&lt;75)</option>
                <option value="Premium Only">SaaS Premium Tier Only</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1">
                  Message Type Theme
                </label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-850 p-2 text-slate-300 rounded-xl outline-none"
                >
                  <option value="Hygiene Alert">Hygiene Mandate warning</option>
                  <option value="Festival Notice">Holy Festival / Carnival notice</option>
                  <option value="System Maintenance">SaaS Console Maintenance</option>
                  <option value="Promotion">SaaS Special Promotion discount</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1">
                  Scheduler Date-Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-850 p-2 text-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Broadcast Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-850 p-2.5 rounded-xl text-slate-100 outline-none focus:border-slate-750"
                placeholder="e.g. FSSAI License Renewal Mandate June 2026"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Message Body (SMS friendly)
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-24 bg-[#0b0f19] border border-slate-850 p-2.5 rounded-xl text-slate-150 outline-none resize-none focus:border-slate-750"
                placeholder="Type your official announcement here. Limit to 160 characters for standard Indian cellular networks..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Bell className="w-4 h-4" /> Dispatch Official Broadcast
            </button>
          </form>
        </div>

        {/* Right Columns: Sent Announcments History Ledger */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-850 pb-2">
            Historical Notifications Ledger
          </h3>

          <div className="space-y-4">
            {notifications.map((notif) => {
              let typeColor = 'bg-blue-500/10 text-blue-400';
              if (notif.type === 'Hygiene Alert') typeColor = 'bg-rose-500/10 text-rose-400';
              else if (notif.type === 'Festival Notice') typeColor = 'bg-amber-500/10 text-amber-400';

              return (
                <div
                  key={notif.id}
                  className="bg-[#080d15] border border-slate-850 rounded-xl p-4 space-y-2 hover:border-slate-800 transition"
                >
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-bold ${typeColor}`}>
                      {notif.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Scheduled: {notif.scheduleTime.substring(0, 16).replace('T', ' ')}</span>
                  </div>

                  <h4 className="font-semibold text-slate-200 text-xs mt-1">{notif.title}</h4>
                  <p className="text-slate-400 leading-normal font-sans text-xs italic">
                    "{notif.body}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900/40">
                    <span>Target Audience: <strong className="text-slate-400">{notif.audience}</strong></span>
                    <span className="text-emerald-450 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-450" /> Live-Broadcast Successful
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
