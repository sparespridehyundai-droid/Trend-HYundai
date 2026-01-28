
import React, { useState, useMemo } from 'react';
import { Order } from '../types';

interface ReportsProps {
  orders: Order[];
}

const Reports: React.FC<ReportsProps> = ({ orders }) => {
  const [filter, setFilter] = useState({
    user: '',
    vehicle: '',
    date: '',
  });

  const uniqueUsers = useMemo(() => Array.from(new Set(orders.map(o => o.userName))), [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchUser = !filter.user || o.userName === filter.user;
      const matchVehicle = !filter.vehicle || o.vehicleNumber.includes(filter.vehicle.toUpperCase());
      const matchDate = !filter.date || o.timestamp.startsWith(filter.date);
      return matchUser && matchVehicle && matchDate;
    });
  }, [orders, filter]);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6"><i className="fas fa-filter mr-2 hyundai-gold"></i> Report Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">User</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
              value={filter.user}
              onChange={(e) => setFilter({ ...filter, user: e.target.value })}
            >
              <option value="">All Users</option>
              {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Vehicle Number</label>
            <input 
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="Search Vehicle"
              value={filter.vehicle}
              onChange={(e) => setFilter({ ...filter, vehicle: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
            <input 
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <span className="text-sm font-bold text-slate-500">Results: <span className="text-blue-600">{filteredOrders.length} records</span></span>
           <button 
             onClick={() => window.print()}
             className="px-4 py-2 text-sm font-bold text-white hyundai-blue rounded-xl hover:bg-blue-800 transition-all flex items-center"
           >
              <i className="fas fa-download mr-2"></i> Export Report
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Vehicle</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Part Info</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Type</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {new Date(order.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4 font-black text-blue-900 text-sm tracking-tight">
                    {order.vehicleNumber}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{order.partNo}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium truncate w-32">{order.partName}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                       order.orderType === 'Urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                     }`}>
                       {order.orderType}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-slate-800">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="flex items-center justify-center text-[10px] font-black text-amber-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                    <i className="fas fa-search text-4xl mb-4 opacity-20"></i>
                    <p className="font-bold">No matching records found for current filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
