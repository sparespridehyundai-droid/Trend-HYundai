import React, { useState, useMemo } from 'react';
import { Order, Part } from '../types';

interface ReportsProps {
  orders: Order[];
  masterData: Part[];
}

type ReportType = 'Full History' | 'SysGen vs Stock' | 'Low Stock' | 'High Stock' | 'High Value Parts';

const Reports: React.FC<ReportsProps> = ({ orders, masterData }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('Full History');
  const [searchTerm, setSearchTerm] = useState('');

  const reportData = useMemo(() => {
    switch (activeReport) {
      case 'SysGen vs Stock':
        return masterData.map(p => ({
          id: p.partNo,
          label: p.partName,
          val1: p.sysGenStock,
          val2: p.onHand,
          val3: (p.dueIn + p.onOrder),
          status: (p.onHand + p.dueIn + p.onOrder) < p.sysGenStock ? 'Shortage' : 'Healthy'
        })).filter(p => !searchTerm || p.id.includes(searchTerm.toUpperCase()));

      case 'Low Stock':
        return masterData.filter(p => p.onHand < 5).map(p => ({
          id: p.partNo,
          label: p.partName,
          val1: p.onHand,
          val2: p.location,
          val3: p.mav,
          status: 'Restock'
        })).filter(p => !searchTerm || p.id.includes(searchTerm.toUpperCase()));

      case 'High Stock':
        return masterData.filter(p => p.onHand > 50).map(p => ({
          id: p.partNo,
          label: p.partName,
          val1: p.onHand,
          val2: p.location,
          val3: p.mav,
          status: 'Overstock'
        })).filter(p => !searchTerm || p.id.includes(searchTerm.toUpperCase()));

      case 'High Value Parts':
        return [...masterData].sort((a, b) => b.mav - a.mav).slice(0, 30).map(p => ({
          id: p.partNo,
          label: p.partName,
          val1: p.mav,
          val2: p.onHand,
          val3: p.location,
          status: 'VIP'
        })).filter(p => !searchTerm || p.id.includes(searchTerm.toUpperCase()));

      default:
        return orders.map(o => ({
          id: o.partNo,
          label: o.partName,
          val1: o.quantity,
          val2: o.userName,
          val3: new Date(o.timestamp).toLocaleDateString(),
          status: 'Audit Log'
        })).filter(p => !searchTerm || p.id.includes(searchTerm.toUpperCase()));
    }
  }, [orders, masterData, activeReport, searchTerm]);

  const exportExcel = () => {
    const headers = ["Part No", "Description", "Value 1", "Value 2", "Value 3", "Status"];
    const rows = reportData.map(r => [r.id, r.label, r.val1, r.val2, r.val3, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Trend_Spares_${activeReport.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const shareWhatsApp = () => {
    const summary = `*Trend Spares Report: ${activeReport}*\n\n` + 
      reportData.slice(0, 10).map(r => `• ${r.id}: ${r.val1} (${r.status})`).join("\n") +
      `\n\n_Generated via Trend Spares Premium_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">System Reports</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Exported: {new Date().toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={exportExcel} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                <i className="fas fa-file-excel mr-2"></i> Excel
            </button>
            <button onClick={() => window.print()} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                <i className="fas fa-print mr-2"></i> Print/PDF
            </button>
            <button onClick={shareWhatsApp} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                <i className="fab fa-whatsapp mr-2"></i> WhatsApp
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto scrollbar-hide gap-1">
        {(['Full History', 'SysGen vs Stock', 'Low Stock', 'High Stock', 'High Value Parts'] as ReportType[]).map(type => (
          <button
            key={type}
            onClick={() => setActiveReport(type)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeReport === type 
              ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-500/20 scale-105' 
              : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Filter Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
        <i className="fas fa-filter text-slate-300 mr-4"></i>
        <input 
            type="text" 
            placeholder="FILTER BY PART NUMBER..." 
            className="w-full py-2 bg-transparent outline-none font-black text-[11px] uppercase tracking-widest text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Report View */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identifier</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metrics Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reportData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-black text-[#0F172A] text-sm uppercase">{row.id}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[200px] mt-0.5">{row.label}</p>
                </td>
                <td className="px-8 py-6">
                  {activeReport === 'SysGen vs Stock' ? (
                    <div className="flex gap-6">
                        <div>
                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Sys Gen</p>
                            <p className="text-sm font-black text-blue-600">{row.val1}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Actual+Up</p>
                            <p className="text-sm font-black text-[#E67E22]">{Number(row.val2) + Number(row.val3)}</p>
                        </div>
                    </div>
                  ) : (
                    <div>
                        <p className="text-[10px] font-black text-slate-500 italic">
                            {activeReport === 'Full History' ? `Audit: ${row.val2}` : `Loc: ${row.val2}`}
                        </p>
                        <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">{row.val3}</p>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        row.status === 'Shortage' || row.status === 'Restock' 
                        ? 'bg-rose-50 text-rose-500' 
                        : 'bg-emerald-50 text-emerald-500'
                    }`}>
                        {row.status === 'Shortage' ? `Diff: ${Number(row.val1) - (Number(row.val2) + Number(row.val3))}` : row.val1}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reportData.length === 0 && (
            <div className="py-20 text-center text-slate-300">
                <i className="fas fa-inbox text-5xl mb-4 opacity-10"></i>
                <p className="font-black uppercase text-xs tracking-[0.2em]">No results for this view</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reports;