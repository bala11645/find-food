import { useState, FormEvent } from 'react';
import { Settings, Shield, Bell, HardDrive, Cpu, RefreshCw, CheckCircle } from 'lucide-react';

interface SettingsTabProps {
  onTriggerActionToast: (msg: string) => void;
}

export default function SettingsTab({ onTriggerActionToast }: SettingsTabProps) {
  // Configs
  const [commissionRate, setCommissionRate] = useState(12);
  const [mapPrecision, setMapPrecision] = useState(5);
  const [autoWarnEnabled, setAutoWarnEnabled] = useState(true);
  const [smsGateway, setSmsGateway] = useState(true);
  const [telemetryRefresh, setTelemetryRefresh] = useState(15);

  // Profile
  const [adminName, setAdminName] = useState('Chaitanya Gowda');
  const [adminMail, setAdminMail] = useState('commissioner@foodcourt.blr.gov.in');

  const handleSaveAppPreferences = (e: FormEvent) => {
    e.preventDefault();
    onTriggerActionToast('Administrative configurations updated. Syncing CDN geo-gates.');
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    onTriggerActionToast(`Admin credentials saved: Welcome back, Officer ${adminName}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          CENTRAL CONFIG SYSTEM
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">App Configurations & Settings</h2>
        <p className="text-xs text-slate-400">
          Calibrate transactional commission rates, toggle dispatch messaging nodes, customize automated hygiene report warnings, and save profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App configurations form */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-2 flex items-center gap-1.5 text-slate-205">
            <Settings className="w-5 h-5 text-emerald-450" />
            <h3 className="text-sm font-semibold text-slate-200">Global Platform Adjusters</h3>
          </div>

          <form onSubmit={handleSaveAppPreferences} className="space-y-5 text-xs font-medium">
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase mb-1.5">
                <span>Direct Platform Commission Fee</span>
                <span className="text-emerald-400 font-bold">{commissionRate}% gross order price</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseInt(e.target.value))}
                className="w-full text-emerald-400 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase mb-1.5">
                <span>Vector Geospatial Match Radius</span>
                <span className="text-emerald-400 font-bold">{mapPrecision} km search boundary</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={mapPrecision}
                onChange={(e) => setMapPrecision(parseInt(e.target.value))}
                className="w-full text-emerald-400 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-3.5 pt-2 border-t border-slate-850">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0f19] border border-slate-850">
                <div>
                  <span className="text-slate-150 block">Auto-Warn Flagged Hygiene Scores</span>
                  <span className="text-[10px] font-normal text-slate-500 mt-0.5 block">
                    Instantly emails warnings and tags critical alerts when sanitary scoring decreases below average.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoWarnEnabled}
                  onChange={(e) => setAutoWarnEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-450 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0f19] border border-slate-850">
                <div>
                  <span className="text-slate-150 block">Activate Cellular SMS Notification Gateways</span>
                  <span className="text-[10px] font-normal text-slate-500 mt-0.5 block">
                    Uses high-frequency mobile channels to push compliance briefs (charged at platform cost).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.checked)}
                  className="w-4 h-4 accent-emerald-450 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex justify-center items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Save App Preferences
            </button>
          </form>
        </div>

        {/* Admin profile configurations */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-850 pb-2 flex items-center gap-1.5 text-slate-205">
              <Shield className="w-5 h-5 text-emerald-450" />
              <h3 className="text-sm font-semibold text-slate-200">Municipal Administrator Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                  Full Officers Name
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-855 text-slate-200 p-2.5 rounded-xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                  Official Administrative Email
                </label>
                <input
                  type="email"
                  value={adminMail}
                  onChange={(e) => setAdminMail(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-855 text-slate-200 p-2.5 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-[#0c101e] border border-slate-855 text-[10px] text-slate-500 leading-normal font-mono rounded-lg">
                🔒 Authentications session verified via government FSSAI OTP keys. System SecOps levels OK.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                Save Profile Parameters
              </button>
            </form>
          </div>

          {/* System info auxiliary block */}
          <div className="bg-[#0f172a] border border-[#ef444455]/10 p-5 rounded-2xl space-y-2.5 relative overflow-hidden flex items-start gap-4">
            <span className="p-2 rounded bg-amber-500/10 text-amber-500 text-lg">💡</span>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">System Telemetry Logs Note</h4>
              <p className="text-[10.5px] text-slate-405 leading-relaxed italic">
                Platform is built following strict desktop-first and high-density responsive visual aesthetics with full Dark Modern SaaS configurations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
