import { useState } from 'react';
import { Users, Shield, Check, Lock, Save } from 'lucide-react';

interface RolesTabProps {
  onTriggerActionToast: (msg: string) => void;
}

export default function RolesTab({ onTriggerActionToast }: RolesTabProps) {
  const roles = [
    { title: 'Super Admin', desc: 'Platform founders with ultimate systems, compliance, and billing configurations access.', color: 'text-rose-450 border-rose-500/20 bg-rose-500/5' },
    { title: 'City Admin', desc: 'Assigned to municipal district commissioners managing regional sub-zones.', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' },
    { title: 'Inspection Manager', desc: 'Supervises field inspectors, reviews physical hygiene audits, and files reports.', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { title: 'Moderation Team', desc: 'Audits uploaded vendor shorts reels, removes spams, and reviews captions.', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
    { title: 'Support Team', desc: 'Processes payment disputes, responds to customer hygiene complaints tickets.', color: 'text-slate-400 border-slate-700/20 bg-slate-800/10' }
  ];

  const permissionsList = [
    { key: 'dash', label: 'View Command Analytics Dashboard' },
    { key: 'approve', label: 'Approve & Onboard Pending Vendors' },
    { key: 'suspend', label: 'Suspend Vendor operational permits' },
    { key: 'hygiene', label: 'Manage Hygiene Scores & Badging' },
    { key: 'content', label: 'Moderate & Filter reels feed content' },
    { key: 'sub', label: 'Modify Vendor SaaS Billing codes' },
    { key: 'revenue', label: 'View platform MRR financial columns' },
    { key: 'settings', label: 'Alter SeOps server root system rules' }
  ];

  const [activeRole, setActiveRole] = useState('Super Admin');

  // Realistic matrix state containing role-permission pairings
  const [roleMatrix, setRoleMatrix] = useState<Record<string, string[]>>({
    'Super Admin': ['dash', 'approve', 'suspend', 'hygiene', 'content', 'sub', 'revenue', 'settings'],
    'City Admin': ['dash', 'approve', 'suspend', 'hygiene', 'content'],
    'Inspection Manager': ['dash', 'hygiene'],
    'Moderation Team': ['dash', 'content'],
    'Support Team': ['dash']
  });

  const handleTogglePermission = (roleKey: string, permKey: string) => {
    // If Super Admin, warn that editing requires SecOps root consent but allow it
    if (roleKey === 'Super Admin' && permKey === 'settings') {
      onTriggerActionToast('SecOps Alert: Revoking Super Admin system rules access requires secondary root key verification.');
    }

    const currentPerms = roleMatrix[roleKey] || [];
    let updatedPerms: string[];
    if (currentPerms.includes(permKey)) {
      updatedPerms = currentPerms.filter((p) => p !== permKey);
    } else {
      updatedPerms = [...currentPerms, permKey];
    }

    setRoleMatrix({
      ...roleMatrix,
      [roleKey]: updatedPerms
    });

    onTriggerActionToast(`Permission rules modified for role: "${roleKey}"!`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          INTERNAL ACCESS SECURITY
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Admin Roles & Permissions</h2>
        <p className="text-xs text-slate-400">
          Enforce strict Role-Based Access Control (RBAC). Configure granular capabilities checklist boundaries per staff profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Left Column: Role Profiles picker */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-850 pb-2">
            Staff Profiles Register
          </h3>

          <div className="space-y-3">
            {roles.map((r, idx) => {
              const isSelected = activeRole === r.title;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveRole(r.title)}
                  className={`border rounded-xl p-4 cursor-pointer hover:border-slate-750 transition flex items-start gap-3.5 select-none ${
                    isSelected ? 'bg-slate-900 border-emerald-500/20' : 'bg-[#0f172a] border-slate-800'
                  }`}
                >
                  <span className={`p-1.5 rounded border text-xs font-bold font-mono shrink-0 uppercase tracking-widest ${r.color}`}>
                    🛡️
                  </span>
                  <div>
                    <h4 className={`font-semibold text-xs ${isSelected ? 'text-emerald-400' : 'text-slate-150'}`}>
                      {r.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Granular Permissions Checklist */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-850 pb-2.5 flex justify-between items-baseline">
              <h3 className="text-sm font-semibold text-slate-200">
                Grant Access: <span className="text-emerald-400">{activeRole} Capabilities Checklist</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-550">RBAC Configuration</span>
            </div>

            <div className="divide-y divide-slate-850/60 mt-4 text-xs font-medium">
              {permissionsList.map((perm) => {
                const isActive = (roleMatrix[activeRole] || []).includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    onClick={() => handleTogglePermission(activeRole, perm.key)}
                    className="p-3.5 flex justify-between items-center hover:bg-slate-900/40 cursor-pointer rounded-lg transition"
                  >
                    <span className="text-slate-300 leading-normal">{perm.label}</span>
                    <button
                      type="button"
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isActive
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-[#0b0f19] border-slate-850 text-slate-650'
                      }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0b0f19] border border-slate-850 rounded-xl p-4 mt-6 flex justify-between items-center flex-wrap gap-3">
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 leading-none">
              <Lock className="w-4 h-4 text-slate-605" /> Settings saved globally. Changes propagate in real-time.
            </span>
            <button
              onClick={() => onTriggerActionToast(`Success: RBAC matrix settings saved to SecOps config file.`)}
              className="py-1.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" /> Save Matrix Block
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
