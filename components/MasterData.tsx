
import React, { useState } from 'react';
import { Part } from '../types';

interface MasterDataProps {
  data: Part[];
  onUpdateData: (newData: Part[]) => void;
}

const MasterData: React.FC<MasterDataProps> = ({ data, onUpdateData }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split(/\r?\n/);
      const result: Part[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 10) continue;
        result.push({
          partNo: cols[0].trim(),
          partName: cols[1].trim(),
          location: cols[2].trim(),
          onHand: parseFloat(cols[3]) || 0,
          dueIn: parseFloat(cols[4]) || 0,
          onOrder: parseFloat(cols[5]) || 0,
          amd3: parseFloat(cols[6]) || 0,
          mav: parseFloat(cols[7]) || 0,
          stkEff: parseFloat(cols[8]) || 0,
          sysGenStock: parseFloat(cols[9]) || 0
        });
      }
      onUpdateData(result);
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Master Data Catalog</h3>
          <p className="text-slate-500 text-sm mt-1">Upload and manage the central repository of parts</p>
        </div>
        <div className="mt-4 md:mt-0">
          <label className="cursor-pointer group">
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
            <div className="flex items-center bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all border-2 border-dashed border-blue-200 group-hover:border-transparent">
              <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-file-upload'} mr-3`}></i>
              {isUploading ? 'Processing...' : 'Upload Parts CSV'}
            </div>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Part No</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">LOC</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">On Hand</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">On Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice(0, 100).map((part, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-black text-blue-900">{part.partNo}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{part.partName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold text-[10px]">{part.location || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${part.onHand < 5 ? 'text-rose-500' : 'text-slate-800'}`}>{part.onHand}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-500">{part.onOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 100 && (
          <div className="p-4 text-center border-t border-slate-100 bg-slate-50">
             <p className="text-xs font-bold text-slate-400 italic">Showing first 100 of {data.length} records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterData;
