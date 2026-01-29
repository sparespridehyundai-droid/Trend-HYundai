import React, { useState, useEffect, useRef } from 'react';
import { Part, User, Order } from '../types';

interface OrderEntryProps {
  masterData: Part[];
  user: User;
  onAddOrder: (order: Order) => void;
  onUpdatePart: (part: Part) => void;
}

const OrderEntry: React.FC<OrderEntryProps> = ({ masterData, user, onAddOrder, onUpdatePart }) => {
  const [search, setSearch] = useState('');
  const [matchedPart, setMatchedPart] = useState<Part | null>(null);
  const [physicalQty, setPhysicalQty] = useState('');
  const [isNewLocation, setIsNewLocation] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [success, setSuccess] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cleanSearch = search.trim().toUpperCase();
    if (cleanSearch.length >= 3) {
      const found = masterData.find(p => p.partNo.toUpperCase() === cleanSearch);
      setMatchedPart(found || null);
    } else {
      setMatchedPart(null);
    }
  }, [search, masterData]);

  const handleSave = () => {
    if (!matchedPart || !physicalQty) return;

    let finalLocation = matchedPart.location;
    if (isNewLocation && newLocation) {
      finalLocation = newLocation.toUpperCase();
      // Update master data location
      onUpdatePart({ ...matchedPart, location: finalLocation });
    }

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: user.userName,
      vehicleNumber: 'INVENTORY_AUDIT',
      orderType: 'Stock',
      partNo: matchedPart.partNo,
      partName: matchedPart.partName,
      location: finalLocation,
      quantity: parseInt(physicalQty) || 0,
      status: 'Completed'
    };

    onAddOrder(newOrder);
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      setSearch('');
      setPhysicalQty('');
      setNewLocation('');
      setIsNewLocation(false);
      setMatchedPart(null);
      searchInputRef.current?.focus();
    }, 1500);
  };

  const upcomingStock = matchedPart ? (matchedPart.dueIn + matchedPart.onOrder) : 0;

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Search Part Number</label>
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            className="w-full text-2xl font-black text-slate-800 uppercase outline-none bg-slate-50 rounded-2xl px-5 py-4 border-2 border-transparent focus:border-[#E67E22] transition-all"
            placeholder="— — — — —"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
          />
          <i className="fas fa-barcode absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
        </div>
      </div>

      {matchedPart ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[8px] border-[#E67E22]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Part Name</p>
            <h2 className="text-lg font-black text-[#0F172A] leading-tight uppercase">{matchedPart.partName}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#E67E22] to-[#D35400] p-5 rounded-[2rem] text-white shadow-lg">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">On Hand</p>
              <p className="text-3xl font-black">{matchedPart.onHand}</p>
            </div>
            <div className="bg-[#0F172A] p-5 rounded-[2rem] text-white shadow-lg">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Upcoming</p>
              <p className="text-3xl font-black">{upcomingStock}</p>
            </div>
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">MAV Value</p>
              <p className="text-2xl font-black text-slate-800">{matchedPart.mav}</p>
            </div>
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</p>
              <p className="text-2xl font-black text-[#E67E22]">{matchedPart.location || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 space-y-8 border border-slate-100">
            <div className="text-center">
              <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-4">Physical Count Qty</label>
              <input 
                type="number" 
                className="text-7xl font-black text-[#0F172A] text-center w-full outline-none bg-transparent"
                placeholder="0"
                value={physicalQty}
                onChange={(e) => setPhysicalQty(e.target.value)}
              />
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Update Location?</span>
                <button 
                  onClick={() => setIsNewLocation(!isNewLocation)}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative ${isNewLocation ? 'bg-[#E67E22]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${isNewLocation ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
              {isNewLocation && (
                <input 
                  type="text"
                  className="w-full bg-slate-50 rounded-2xl px-5 py-4 border-2 border-slate-200 focus:border-[#E67E22] outline-none font-black text-slate-800 uppercase animate-in slide-in-from-top-2"
                  placeholder="NEW BIN LOC..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={!physicalQty}
              className="w-full py-6 bg-[#E67E22] text-white font-black uppercase tracking-[0.3em] rounded-3xl shadow-xl active:scale-[0.96] transition-all disabled:opacity-20"
            >
              FINALIZE AUDIT
            </button>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center opacity-20">
          <i className="fas fa-search text-6xl mb-4"></i>
          <p className="font-black uppercase text-xs tracking-[0.2em]">Retreiving Part Information...</p>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm z-50">
           <div className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center gap-6 animate-bounce">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-5xl text-white shadow-lg shadow-emerald-500/30">
                <i className="fas fa-check"></i>
              </div>
              <p className="font-black uppercase tracking-widest text-[#0F172A]">Inventory Updated</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrderEntry;