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
  const [isNotFound, setIsNotFound] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const partInputRef = useRef<HTMLInputElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);

  // XLOOKUP Style Logic: =XLOOKUP(D2, Sheet1!A:A, Sheet1!B:J, "Not Found")
  useEffect(() => {
    const cleanSearch = formData.partNo.trim().toUpperCase();
    
    if (cleanSearch.length >= 2) {
      const found = masterData.find(p => p.partNo.toUpperCase() === cleanSearch);
      if (found) {
        setMatchedPart(found);
        setIsNotFound(false);
        // Automatic focus shift to Quantity for rapid entry
        const timer = setTimeout(() => qtyInputRef.current?.focus(), 400);
        return () => clearTimeout(timer);
      } else if (cleanSearch.length > 5) {
        // "Not Found" state triggered after sufficient input length
        setMatchedPart(null);
        setIsNotFound(true);
      }
    } else {
      setMatchedPart(null);
      setIsNotFound(false);
    }
  }, [formData.partNo, masterData]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!matchedPart || !formData.quantity) return;

    const qtyValue = parseInt(formData.quantity);
    if (isNaN(qtyValue) || qtyValue <= 0) return;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: user.userName,
      vehicleNumber: formData.vehicleNumber || 'NOT SPECIFIED',
      orderType: formData.orderType as any,
      partNo: matchedPart.partNo,
      partName: matchedPart.partName,
      location: matchedPart.location,
      quantity: qtyValue,
      status: 'Pending'
    };

    onAddOrder(newOrder);
    
    // Clear and reset for next line item
    setFormData(prev => ({ ...prev, partNo: '', quantity: '' }));
    setMatchedPart(null);
    setIsNotFound(false);
    setSuccess(true);
    
    setTimeout(() => {
        setSuccess(false);
        partInputRef.current?.focus();
    }, 1000);
  };

  const totalAvailable = matchedPart 
    ? (matchedPart.onHand || 0) + (matchedPart.dueIn || 0) + (matchedPart.onOrder || 0)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Session Metadata Header */}
      <div className="bg-white px-8 py-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle Reference</p>
          <div className="relative group">
            <input 
              type="text" 
              className="text-lg font-black text-blue-900 uppercase bg-slate-50 px-4 py-2 rounded-xl outline-none border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all w-full md:w-64"
              placeholder="ENTER PLATE NO"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
            />
            <i className="fas fa-car absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          {ORDER_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, orderType: type })}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                formData.orderType === type 
                ? 'hyundai-blue text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Entry Panel */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12 space-y-10">
          
          {/* Step 1: Part Search */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] mr-2">1</span>
                    XLOOKUP Part Finder
                </label>
                {matchedPart && (
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">
                        <i className="fas fa-check-circle mr-1"></i> Part Matched
                    </span>
                )}
            </div>
            <div className="relative">
              <input
                ref={partInputRef}
                type="text"
                autoFocus
                autoComplete="off"
                className={`w-full px-8 py-7 rounded-3xl border-4 outline-none transition-all font-black text-3xl uppercase tracking-widest shadow-inner ${
                  matchedPart 
                  ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900' 
                  : isNotFound 
                  ? 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-slate-100 bg-slate-50 focus:border-blue-600 focus:bg-white'
                }`}
                placeholder="TYPE PART NUMBER..."
                value={formData.partNo}
                onChange={(e) => setFormData({ ...formData, partNo: e.target.value.toUpperCase() })}
              />
              {isNotFound && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Not Found
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Auto-Populated Data (Range B:J) */}
          <div className={`transition-all duration-700 ease-out ${matchedPart ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-10 h-0 overflow-hidden pointer-events-none'}`}>
            {matchedPart && (
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
                {/* Decorative Hyundai Motif */}
                <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                    <i className="fas fa-car-side text-[12rem]"></i>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Part Description</p>
                    <h4 className="text-2xl font-black text-white uppercase leading-tight tracking-tight">
                      {matchedPart.partName}
                    </h4>
                  </div>
                  <div className="md:text-right space-y-1">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Master Location</p>
                    <p className="text-2xl font-black text-hyundai-gold uppercase tracking-wider">
                      {matchedPart.location || 'UNASSIGNED'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 relative z-10">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2">On Hand</p>
                    <p className="text-2xl font-black text-white">{matchedPart.onHand}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Due In</p>
                    <p className="text-2xl font-black text-white">{matchedPart.dueIn}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2">On Order</p>
                    <p className="text-2xl font-black text-white">{matchedPart.onOrder}</p>
                  </div>
                  <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-900/40">
                    <p className="text-[9px] font-black text-blue-200 uppercase mb-2">Total Avail.</p>
                    <p className="text-2xl font-black text-white">{totalAvailable}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 relative z-10">
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">AMD3</span>
                        <span className="text-xs font-black text-emerald-400">{matchedPart.amd3}</span>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">MAV</span>
                        <span className="text-xs font-black text-blue-300">{matchedPart.mav}</span>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">STK EFF</span>
                        <span className="text-xs font-black text-amber-400">{matchedPart.stkEff}%</span>
                    </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Quantity & Submission */}
          <div className={`space-y-4 transition-all duration-300 ${!matchedPart ? 'opacity-20 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] mr-2">2</span>
              Order Quantity
            </label>
            <div className="flex flex-col sm:flex-row gap-5">
              <input
                ref={qtyInputRef}
                type="number"
                min="1"
                className="flex-1 px-8 py-7 rounded-3xl border-4 border-slate-100 focus:border-blue-600 outline-none transition-all font-black text-6xl text-slate-900 bg-white placeholder:text-slate-100"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!matchedPart || !formData.quantity}
                className={`sm:w-64 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 py-6 sm:py-0 ${
                  matchedPart && formData.quantity
                  ? 'hyundai-gold-bg text-slate-900 hover:brightness-110 shadow-gold/30' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                }`}
              >
                LOG LINE <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4">
              Press Enter to quickly log the order
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-10 flex items-center gap-6 z-50 ring-8 ring-emerald-500/20 border-t-4 border-emerald-500">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <i className="fas fa-check text-xl"></i>
          </div>
          <div>
            <p className="font-black uppercase tracking-tight text-xl">Order Logged Successfully</p>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">XLOOKUP Reference Cleared for next entry</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderEntry;