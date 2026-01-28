
import React from 'react';
import { Part, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  orders: Order[];
  masterData: Part[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, masterData }) => {
  const stats = [
    { label: 'Total Orders', value: orders.length, icon: 'fa-shopping-cart', color: 'bg-blue-500' },
    { label: 'Pending Parts', value: orders.filter(o => o.status === 'Pending').length, icon: 'fa-clock', color: 'bg-amber-500' },
    { label: 'Parts in Catalog', value: masterData.length, icon: 'fa-box-open', color: 'bg-emerald-500' },
    { label: 'High Demand', value: masterData.filter(m => m.amd3 > 10).length, icon: 'fa-fire', color: 'bg-rose-500' },
  ];

  // Prepare chart data
  const ordersByType = orders.reduce((acc: any, order) => {
    acc[order.orderType] = (acc[order.orderType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(ordersByType).map(key => ({
    name: key,
    value: ordersByType[key]
  }));

  const COLORS = ['#002C5F', '#A39161', '#10b981', '#f43f5e', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white text-xl shadow-lg shadow-${stat.color.split('-')[1]}-200/50`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
             <i className="fas fa-chart-bar mr-2 text-blue-500"></i> Order Distribution
          </h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <i className="fas fa-inbox text-5xl mb-2 opacity-20"></i>
                 <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
             <i className="fas fa-exclamation-triangle mr-2 text-rose-500"></i> Critical Stock Alerts
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
            {masterData.filter(p => p.onHand <= 2).slice(0, 10).map((part, idx) => (
              <div key={idx} className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 mr-3">
                  <i className="fas fa-box"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{part.partNo}</p>
                  <p className="text-xs text-slate-500 truncate w-48">{part.partName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-rose-600">{part.onHand}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On Hand</p>
                </div>
              </div>
            ))}
            {masterData.filter(p => p.onHand <= 2).length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <i className="fas fa-check-circle text-5xl mb-2 text-emerald-500 opacity-20"></i>
                <p>Stock levels are healthy</p>
             </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
