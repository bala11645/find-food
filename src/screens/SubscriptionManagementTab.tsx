import { useState, FormEvent } from 'react';
import { SubscriptionStats, Vendor } from '../types';
import { CreditCard, Award, ArrowUpRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface SubscriptionManagementTabProps {
  subscriptions: SubscriptionStats[];
  vendors: Vendor[];
  onUpgradePlan: (vendorName: string, plan: 'Free' | 'Starter' | 'Growth' | 'Premium') => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function SubscriptionManagementTab({
  subscriptions,
  vendors,
  onUpgradePlan,
  onTriggerActionToast
}: SubscriptionManagementTabProps) {
  // Compute key indices
  const mrrTotal = subscriptions.reduce((acc, current) => acc + current.amount, 0);
  const activeSubsCount = subscriptions.length;
  const premiumAdoptionRate = Math.round(
    (subscriptions.filter((s) => s.plan === 'Premium').length / activeSubsCount) * 100
  );

  const [vendorSelect, setVendorSelect] = useState(vendors[0]?.stallName || '');
  const [planSelect, setPlanSelect] = useState<'Starter' | 'Growth' | 'Premium'>('Premium');

  const handleTriggerUpgradeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!vendorSelect) return;

    onUpgradePlan(vendorSelect, planSelect);
    onTriggerActionToast(`Upgraded "${vendorSelect}" to SaaS [${planSelect}] plan. System visibility multiplier recalculated!`);
  };

  const handlePromotionalCoupon = (name: string) => {
    onTriggerActionToast(`Promotional 15-day visibility boost applied gratis to "${name}".`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          METROPOLITAN VENDOR SAAS ENGINE
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">SaaS Subscription Management</h2>
        <p className="text-xs text-slate-400">
          Supervise recurring micro-transaction collections, customize promotional placement rankings, and adjust vendor SaaS tiers.
        </p>
      </div>

      {/* METRIC ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Monthly Recurring Revenue</span>
          <span className="text-2xl font-display font-bold text-slate-200 mt-1.5 block">
            ₹{(mrrTotal * 34).toLocaleString()}
          </span>
          <span className="text-[9.5px] font-mono text-emerald-450 block mt-1">▲ +8.2% this month</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Active Subscriptions</span>
          <span className="text-2xl font-display font-semibold text-emerald-400 mt-1.5 block font-mono">
            {activeSubsCount} vendors
          </span>
          <span className="text-[9.5px] font-mono text-slate-500 block mt-1">On auto-renew cycle</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Premium Adoption Curve</span>
          <span className="text-2xl font-display font-bold text-indigo-400 mt-1.5 block">
            {premiumAdoptionRate}%
          </span>
          <span className="text-[9.5px] font-mono text-slate-500 block mt-1">Target threshold: 60%</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Annualized Renewal Velocity</span>
          <span className="text-2xl font-display font-semibold text-blue-405 mt-1.5 block font-mono">
            96.4%
          </span>
          <span className="text-[9.5px] font-mono text-[#10b981] block mt-1">Secure Churn rate (&lt;1%)</span>
        </div>
      </div>

      {/* TWO BLOCK LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upgrade actions block */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" /> Adjust SaaS Operational Tier
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Edit billing status, apply free trials</p>
          </div>

          <form onSubmit={handleTriggerUpgradeSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Target Vendor Stall
              </label>
              <select
                value={vendorSelect}
                onChange={(e) => setVendorSelect(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-850 text-slate-300 p-2.5 rounded-xl outline-none"
                required
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.stallName}>
                    {v.stallName} ({v.subscriptionPlan})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Choose Subscription Plan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Starter', 'Growth', 'Premium'].map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setPlanSelect(plan as any)}
                    className={`p-2 rounded-xl text-center font-mono border font-semibold ${
                      planSelect === plan
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-[#0b0f19] border-slate-850 text-slate-400 hover:border-slate-805'
                    } transition-colors`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal font-mono">
              💡 Upgrading plans multiplies the search discovery indexing weight automatically (Premium: 2.5x, Growth: 1.5x boost).
            </p>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              Update Subscription Tier <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Subscriptions master lists columns */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-850 pb-2">
            Active Billing Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/40 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-850">
                  <th className="p-3">Vendor Name</th>
                  <th className="p-3">SaaS Tier</th>
                  <th className="p-3 text-center">Price / month</th>
                  <th className="p-3">Renewal Target</th>
                  <th className="p-3">Auto-Renew</th>
                  <th className="p-3 text-right">Quick Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {subscriptions.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/35 transition-colors">
                    <td className="p-3 font-semibold text-slate-300">{sub.vendorName}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-mono border font-bold px-2 py-0.5 rounded ${
                        sub.plan === 'Premium' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10' :
                        sub.plan === 'Growth' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-950/40' :
                        'bg-slate-800 text-slate-400 border-slate-750'
                      }`}>
                        {sub.plan}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-300">₹{sub.amount}</td>
                    <td className="p-3 font-mono text-slate-400">{sub.renewalDate}</td>
                    <td className="p-3 text-slate-450 font-mono">
                      {sub.autoRenew ? '✅ Enabled' : '✖ Disabled'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handlePromotionalCoupon(sub.vendorName)}
                        className="p-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-amber-500 rounded text-[9.5px] font-mono cursor-pointer transition"
                      >
                        Promo Gift
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
