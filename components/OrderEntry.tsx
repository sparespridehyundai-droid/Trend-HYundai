
import React, { useState, useEffect, useRef } from 'react';
import { Part, User, Order } from '../types';
import { ORDER_TYPES } from '../constants';

interface OrderEntryProps {
  masterData: Part[];
  user: User;
  onAddOrder: (order: Order) => void;
}

const OrderEntry: React.FC<OrderEntryProps> = ({ masterData, user, onAddOrder }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    orderType: 'Stock',
    partNo: '',
    quantity: '',
  });

  const [matchedPart, setMatchedPart] = useState<Part | null>(null);
  const [success, setSuccess] = useState(false);
  
  const partInputRef = useRef<HTMLInputElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);

  // Instant lookup and Auto-Focus Logic
  useEffect(() => {
    const cleanSearch = formData.partNo.trim().toUpperCase();
    if (cleanSearch.length >= 3) {
      const found = masterData.find(p => p.partNo.toUpperCase() === cleanSearch);
      if (found) {
        setMatchedPart(found);
        // Direct jump to Quantity box once the part is successfully identified
        setTimeout(() => qtyInputRef.current?.focus(), 50);
      } else {
        setMatchedPart(null);
      }
    } else {
      setMatchedPart(null);
    }
  }, [formData.partNo, masterData]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!matchedPart || !formData.quantity) return;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: user.userName,
      vehicleNumber: formData.vehicleNumber || 'NOT SPECIFIED',
      orderType: formData.orderType as any,
      partNo: matchedPart.partNo,
      partName: matchedPart.partName,
      location: matchedPart.location,
      quantity: parseInt(formData.quantity) || 0,
      status: 'Pending'
    };

    onAddOrder(newOrder);
    
    // Reset inputs for next part in same order
    setFormData(prev => ({ ...prev, partNo: '', quantity: '' }));
    setMatchedPart(null);
    setSuccess(true);
    
    // Jump back to Part Search for next item
    setTimeout(() => {
        setSuccess(false);
        partInputRef.current?.focus();
    }, 800);
  };

  const upcomingTotal = matchedPart 
    ? (matchedPart.onHand || 0) + (matchedPart.dueIn || 0) + (matchedPart.onOrder || 0)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Information Display */}
        <div className="hyundai-blue p-6 text-white border-b border-blue-800/30">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">Trend Hyundai Order Entry</h2>
              <div className="flex gap-4 mt-1 text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>User: {user.userName}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {ORDER_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, orderType: type })}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                    formData.orderType === type 
                    ? 'hyundai-gold-bg text-slate-900 border-transparent' 
                    : 'bg-blue-900/50 text-blue-100 border-blue-800 hover:bg-blue-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Section 1: Vehicle & Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Number</label>
              <input
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-400 focus:bg-white outline-none transition-all font-black text-lg uppercase"
                placeholder="ENTER VEHICLE NO"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">1. Part Number Search</label>
              <input
                ref={partInputRef}
                type="text"
                autoFocus
                className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-black text-lg uppercase tracking-widest ${
                  matchedPart ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900' : 'border-blue-200 bg-blue-50/30 focus:border-blue-500'
                }`}
                placeholder="TYPE OR SCAN PART NO"
                value={formData.partNo}
                onChange={(e) => setFormData({ ...formData, partNo: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          {/* Section 2: Automated Details (THE GAP) */}
          <div className="transition-all duration-500 overflow-hidden">
            {matchedPart ? (
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white animate-in zoom-in-95 fade-in duration-300 shadow-xl">
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Part Identification</p>
                    <h4 className="text-2xl font-black uppercase text-white">{matchedPart.partName}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Location (LOC)</p>
                    <p className="text-lg font-black text-emerald-400">{matchedPart.location || 'NONE'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">On Hand</p>
                    <p className="text-2xl font-black text-white">{matchedPart.onHand}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Due In</p>
                    <p className="text-2xl font-black text-white">{matchedPart.dueIn}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">On Order</p>
                    <p className="text-2xl font-black text-white">{matchedPart.onOrder}</p>
                  </div>
                  <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
                    <p className="text-[10px] font-black text-blue-300 uppercase mb-1">Total Available</p>
                    <p className="text-2xl font-black text-blue-400">{upcomingTotal}</p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">AMD3</p>
                    <p className="text-lg font-bold text-white/80">{matchedPart.amd3}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">MAV</p>
                    <p className="text-lg font-bold text-white/80">{matchedPart.mav}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Stock Eff %</p>
                    <p className="text-lg font-bold text-white/80">{matchedPart.stkEff}%</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Sys Gen Stock</p>
                    <p className="text-lg font-bold text-white/80">{matchedPart.sysGenStock}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-slate-300">
                <i className="fas fa-search-plus text-3xl mb-3 opacity-20"></i>
                <p className="text-sm font-bold uppercase tracking-widest">Details will appear here</p>
                {formData.partNo.length >= 3 && !matchedPart && (
                  <p className="text-rose-500 text-[10px] font-black mt-2 uppercase">Part Not Found in Sheet1</p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Quantity Input (Open Box) */}
          <div className={`space-y-4 transition-all duration-300 ${!matchedPart ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">2. Order Quantity (Hit Enter to Confirm)</label>
            <div className="flex gap-4">
              <input
                ref={qtyInputRef}
                type="number"
                min="1"
                className="flex-1 px-8 py-6 rounded-[2rem] border-4 border-slate-100 focus:border-blue-600 outline-none transition-all font-black text-4xl text-slate-900 bg-white shadow-inner"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!matchedPart || !formData.quantity}
                className={`px-10 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  matchedPart && formData.quantity
                  ? 'hyundai-gold-bg text-slate-900 hover:brightness-110' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-10 flex items-center gap-3 z-50">
          <i className="fas fa-check-circle text-xl"></i>
          <span className="font-black text-sm uppercase tracking-widest">Order Recorded Successfully</span>
        </div>
      )}
    </div>
  );
};

export default OrderEntry;
