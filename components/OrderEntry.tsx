import React, { useState, useEffect, useRef } from 'react';
import { Part, User, Order } from '../types';

interface OrderEntryProps {
  masterData: Part[];
  user: User;
  onAddOrder: (order: Order) => void;
}

const OrderEntry: React.FC<OrderEntryProps> = ({ masterData, user, onAddOrder }) => {
  const [search, setSearch] = useState('');
  const [matchedPart, setMatchedPart] = useState<Part | null>(null);
  const [physicalQty, setPhysicalQty] = useState('');
  const [isNewLocation, setIsNewLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Real-time lookup
  useEffect(() => {
    const cleanSearch = search.trim().toUpperCase();
    if (cleanSearch.length >= 3) {
      const found = masterData.find(p => p.partNo.toUpperCase() === cleanSearch);
      if (found) {
        setMatchedPart(found);
      } else {
        setMatchedPart(null);
      }
    } else {
      setMatchedPart(null);
    }
  }, [search, masterData]);

  const handleSave = () => {
    if (!matchedPart || !physicalQty) return;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: user.userName,
      vehicleNumber: 'INVENTORY_AUDIT',
      orderType: 'Stock',
      partNo: matchedPart.partNo,
      partName: matchedPart.partName,
      location: matchedPart.location,
      quantity: parseInt(physicalQty) || 0,
      status: 'Completed'
    };

    onAddOrder(newOrder);
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      setSearch('');
      setPhysicalQty('');
      setMatchedPart(null);
      searchInputRef.current?.focus();
    }, 1200);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F2F2F2] pb-24 font-sans">
      {/* Header Bar */}
      <div className="bg-[#3D2C24] text-white px-5 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-[15px] font-bold tracking-widest uppercase">Trend Spares</h1>
        <button className="text-lg opacity-80"><i className="fas fa-ellipsis-v"></i></button>
      </div>

      <div className="p-4 space-y-4">
        {/* Date Row */}
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
          <span>Date</span>
          <span className="text-slate-400">{currentDate}</span>
        </div>

        {/* Part No Card */}
        <div className="bg-[#EAEAEA] rounded-lg shadow-sm border border-slate-200 p-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight block mb-1">Part No</label>
          <input
            ref={searchInputRef}
            type="text"
            className="w-full text-2xl font-black text-slate-900 uppercase outline-none bg-transparent"
            placeholder="— — — — —"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
          />
        </div>

        {/* Part Name Card */}
        <div className="bg-[#EAEAEA] rounded-lg shadow-sm border border-slate-200 p-4 flex justify-between items-start">
          <div className="w-full">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight block mb-2">Part Name</label>
            <p className="text-[13px] font-black text-slate-700 uppercase leading-tight text-right pr-2">
              {matchedPart ? matchedPart.partName : '—'}
            </p>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          {/* On Hand Block - Matches Image Orange Label */}
          <div className="flex justify-between items-center">
             <div className="bg-[#EF8E3A] px-3 py-1.5 rounded-sm text-white text-[11px] font-black uppercase tracking-tight min-w-[120px]">
                On Hand Qty
             </div>
             <span className="text-[18px] font-bold text-slate-800">{matchedPart?.onHand ?? 0}</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">On Order Qty:</span>
             <span className="text-[17px] font-bold text-slate-700">{matchedPart?.onOrder ?? 0}</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Due In Qty:</span>
             <span className="text-[17px] font-bold text-slate-700">{matchedPart?.dueIn ?? 0}</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Location</span>
             <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-slate-700">{matchedPart?.location || '—'}</span>
                <span className="w-5 h-5 bg-[#333] text-white flex items-center justify-center text-[10px] rounded-sm font-bold">N</span>
             </div>
          </div>

          <div className="flex justify-between items-center pt-1">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">System Gen Qty:</span>
             <span className="text-[16px] font-bold text-slate-400">{matchedPart?.sysGenStock ?? 0}</span>
          </div>
        </div>

        {/* Physical Qty Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center border-l-4 border-slate-300">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Physical Qty</label>
            <input 
              type="number" 
              className="text-4xl font-black text-slate-900 text-center w-full outline-none bg-transparent"
              placeholder="0"
              value={physicalQty}
              onChange={(e) => setPhysicalQty(e.target.value)}
            />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 pb-8">
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">New Location</span>
                <button 
                  onClick={() => setIsNewLocation(!isNewLocation)}
                  className={`w-11 h-6 rounded-full transition-all relative ${isNewLocation ? 'bg-orange-500' : 'bg-slate-300'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isNewLocation ? 'right-1' : 'left-1'}`}></div>
                </button>
            </div>
            <button 
              onClick={handleSave}
              disabled={!matchedPart || !physicalQty}
              className="bg-[#EF8E3A] text-white px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-md active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
            >
                Save
            </button>
        </div>
      </div>

      {success && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white px-8 py-3 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5">
            <p className="font-black uppercase tracking-widest text-[10px] text-center">Entry Recorded Successfully</p>
        </div>
      )}
    </div>
  );
};

export default OrderEntry;