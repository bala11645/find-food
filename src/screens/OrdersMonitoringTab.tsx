import { useState } from 'react';
import { Order } from '../types';
import {
  Clock,
  Compass,
  TrendingUp,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Truck,
  Flame,
  Search
} from 'lucide-react';

interface OrdersMonitoringTabProps {
  orders: Order[];
  onTriggerActionToast: (msg: string) => void;
  onUpdateOrderStatus?: (orderId: string, status: any) => void;
}

export default function OrdersMonitoringTab({
  orders,
  onTriggerActionToast,
  onUpdateOrderStatus
}: OrdersMonitoringTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Compute metrics dynamically
  const totalOrdersCount = orders.length;
  const pickupCount = orders.filter((o) => o.type === 'Pickup').length;
  const deliveryCount = orders.filter((o) => o.type === 'Delivery').length;
  const avgPrepTime = Math.round(
    orders.reduce((acc, current) => acc + current.prepTimeMinutes, 0) / orders.length
  );
  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;

  const handlePromptVendor = (vendorName: string) => {
    onTriggerActionToast(`Automated dispatcher call sent to "${vendorName}". Demanding cooking speed-up!`);
  };

  const filteredOrders = orders.filter((o) =>
    o.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
          LIVE TRANSACTION MATRIX
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Platform Order Monitoring</h2>
        <p className="text-xs text-slate-400">
          Track preparation times, pickup coordinates, delivery dispatch grids, and localized customer dining demand.
        </p>
      </div>

      {/* METRICS HEADER BANNER */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Total Today</span>
          <span className="text-xl font-display font-bold text-slate-155 block mt-1">
            {totalOrdersCount} orders
          </span>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Pickup Mode</span>
          <span className="text-xl font-display font-bold text-emerald-400 block mt-1 flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" /> {pickupCount}
          </span>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Delivery Mode</span>
          <span className="text-xl font-display font-bold text-indigo-400 block mt-1 flex items-center gap-1">
            <Truck className="w-4 h-4" /> {deliveryCount}
          </span>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Avg Prep Time</span>
          <span className="text-xl font-display font-bold text-amber-500 block mt-1 flex items-center gap-1">
            <Clock className="w-4 h-4" /> {avgPrepTime} mins
          </span>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Cancellations</span>
          <span className="text-xl font-display font-bold text-rose-400 block mt-1 flex items-center gap-1">
            <XCircle className="w-4 h-4" /> {cancelledCount}
          </span>
        </div>
      </div>

      {/* SYSTEM WARNINGS ALERTS DRAWER */}
      <div className="bg-rose-500/5 border border-rose-950/40 p-4 rounded-2xl space-y-3">
        <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> High-Risk Operational Disruption Warnings
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1.5 text-xs">
          <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800 relative">
            <span className="text-[10px] font-mono text-rose-400 block uppercase font-bold">Delayed Cooking Alert</span>
            <p className="text-slate-300 mt-1 leading-normal">
              <strong>Koramangala Shawarma Spot</strong> prep averages 28 mins today. Sneeze-guard and grill clean checks queued.
            </p>
            <button
              onClick={() => handlePromptVendor('Koramangala Shawarma Spot')}
              className="mt-2.5 text-[10px] font-mono text-rose-455 font-bold hover:underline block"
            >
              Dispatch Push Alert Notification ➜
            </button>
          </div>

          <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800 relative">
            <span className="text-[10px] font-mono text-amber-500 block uppercase font-bold">Crowd Overload Danger</span>
            <p className="text-slate-300 mt-1 leading-normal">
              <strong>VV Puram Food Street</strong> reports massive congestion of 4.5x normal density. Food prep limits recommended.
            </p>
            <button
              onClick={() => onTriggerActionToast('Dispatched municipal traffic controllers to Sajjan Rao Circle.')}
              className="mt-2.5 text-[10px] font-mono text-amber-500 font-bold hover:underline block"
            >
              Alert Traffic Squad ➜
            </button>
          </div>

          <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800 relative">
            <span className="text-[10px] font-mono text-amber-400 block uppercase font-bold">High Cancel Rate (15%)</span>
            <p className="text-slate-300 mt-1 leading-normal">
              <strong>VV Puram Chaat House</strong> has rejected 3 out-of-stock orders in past 12 mins. Automatic item freeze enabled.
            </p>
            <button
              onClick={() => onTriggerActionToast('In-stock menu inventory corrected of starch ingredients.')}
              className="mt-2.5 text-[10px] font-mono text-amber-400 font-bold hover:underline block"
            >
              Freeze Out-of-Stock Items ➜
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND TRANSACTIONS MASTER REGISTER */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-semibold text-slate-200">Processing Order Manifest</h3>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-slate-700 transition"
              placeholder="Search ID, stall name, user..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 font-mono text-[9px] text-slate-400 uppercase tracking-widest border-b border-slate-850">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Vendor Stall</th>
                <th className="p-3">Customer User</th>
                <th className="p-3 text-center">Amount (INR)</th>
                <th className="p-3 text-center">Modality</th>
                <th className="p-3 text-center">Current Prep Score</th>
                <th className="p-3">Status Badge</th>
                <th className="p-3 text-right">System Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">
                    No orders match search string query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  let statusColor = 'text-green-400 bg-green-500/10 border-green-500/20';
                  if (ord.status === 'Cancelled') statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                  else if (ord.status === 'Processing') statusColor = 'text-yellow-450 bg-yellow-500/10 border-yellow-500/20';
                  else if (ord.status === 'Delayed') statusColor = 'text-rose-450 bg-red-500/10 border-red-500/20 animate-pulse';

                  return (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* ID */}
                      <td className="p-3 font-mono font-semibold text-slate-400">{ord.id}</td>
                      {/* Vendor name */}
                      <td className="p-3 text-slate-200 font-medium">{ord.vendorName}</td>
                      {/* Customer */}
                      <td className="p-3 text-slate-350">{ord.customerName}</td>
                      {/* Amount */}
                      <td className="p-3 text-center text-emerald-400 font-mono font-bold">₹{ord.amount}</td>
                      {/* Type */}
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          ord.type === 'Pickup'
                            ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-950/40'
                            : 'bg-indigo-500/5 text-indigo-400 border border-indigo-950/40'
                        }`}>
                          {ord.type}
                        </span>
                      </td>
                      {/* Prep time */}
                      <td className="p-3 text-center">
                        <span className={`font-mono ${ord.prepTimeMinutes > 20 ? 'text-red-400 font-bold' : 'text-slate-350'}`}>
                          {ord.prepTimeMinutes} mins
                        </span>
                      </td>
                      {/* Status */}
                      <td className="p-3">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${statusColor}`}>
                          {ord.status}
                        </span>
                      </td>
                      {/* Action */}
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          {ord.status === 'Delayed' && (
                            <button
                              onClick={() => handlePromptVendor(ord.vendorName)}
                              className="bg-[#ef4444]/15 hover:bg-[#ef4444]/35 text-rose-400 border border-rose-500/10 py-1 px-2 rounded font-mono text-[9px] cursor-pointer"
                            >
                              📞 Buzz Chef
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (onUpdateOrderStatus) {
                                onUpdateOrderStatus(ord.id, 'Completed');
                                onTriggerActionToast(`Force completed order ${ord.id}.`);
                              } else {
                                onTriggerActionToast(`Override check: verified transit code credentials index.`);
                              }
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-2 rounded font-mono text-[9px] cursor-pointer"
                          >
                            Mark Verified
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
