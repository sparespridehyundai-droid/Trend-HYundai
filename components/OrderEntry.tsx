
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
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      {/* Mobile Header */}
      <div className="bg-[#0F172A] text-white px-5 py-5 flex justify-between items-center shadow-xl border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-[#E67E22] to-[#F39C12] w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-lg">T</div>
            <div>
                <h1 className="text-[13px] font-black tracking-[0.2em] uppercase leading-none">Trend Spares</h1>
                <p className="text-[9px] text-[#E67E22] font-black uppercase tracking-widest mt-0.5">Inventory Audit</p>
            </div>
        </div>
        <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Part Lookup</label>
          <div className="relative group">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full text-2xl font-black text-slate-800 uppercase outline-none bg-slate-50 rounded-2xl px-5 py-4 border-2 border-transparent focus:border-[#E67E22] focus:bg-white transition-all"
              placeholder="SEARCH PART..."
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E67E22]">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {matchedPart ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm p-6 border-l-[10px] border-[#E67E22]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
              <h2 className="text-xl font-black text-[#0F172A] leading-tight uppercase">{matchedPart.partName}</h2>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#E67E22] to-[#D35400] p-5 rounded-[2rem] text-white shadow-lg shadow-orange-500/20">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">On Hand Qty</p>
                <p className="text-3xl font-black">{matchedPart.onHand}</p>
              </div>
              <div className="bg-[#0F172A] p-5 rounded-[2rem] text-white shadow-lg shadow-slate-900/10">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Upcoming Stock</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black">{upcomingStock}</p>
                    <span className="text-[10px] opacity-40 font-bold">(In+Order)</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">MAV Value</p>
                <p className="text-2xl font-black text-slate-800">{matchedPart.mav}</p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Bin Location</p>
                <div className="flex items-center gap-2">
                    <p className="text-xl font-black text-[#E67E22]">{matchedPart.location || 'NONE'}</p>
                    {!matchedPart.location && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
                </div>
              </div>
            </div>

            {/* Audit Input Block */}
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 space-y-8 border border-slate-100">
              <div className="text-center">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-4">Actual Inventory Count</label>
                <div className="relative inline-block w-full">
                  <input 
                    type="number" 
                    className="text-7xl font-black text-[#0F172A] text-center w-full outline-none bg-transparent placeholder-slate-100"
                    placeholder="0"
                    value={physicalQty}
                    onChange={(e) => setPhysicalQty(e.target.value)}
                  />
                </div>
              </div>

              {/* Location Override */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-[#E67E22]"></i>
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Update Bin Location?</span>
                  </div>
                  <button 
                    onClick={() => setIsNewLocation(!isNewLocation)}
                    className={`w-14 h-7 rounded-full transition-all duration-300 relative ${isNewLocation ? 'bg-[#E67E22]' : 'bg-slate-100'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${isNewLocation ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
                {isNewLocation && (
                  <input 
                    type="text"
                    className="w-full bg-slate-50 rounded-2xl px-5 py-4 border-2 border-slate-200 focus:border-[#E67E22] outline-none font-black text-slate-800 uppercase animate-in slide-in-from-top-2"
                    placeholder="ENTER NEW BIN COORDINATES..."
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                )}
              </div>

              <button 
                onClick={handleSave}
                disabled={!physicalQty}
                className="w-full py-6 bg-[#E67E22] text-white font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_15px_40px_rgba(230,126,34,0.3)] active:scale-[0.96] transition-all disabled:opacity-20 disabled:grayscale"
              >
                FINALIZE AUDIT
              </button>
            </div>
          </div>
        ) : search.length >= 3 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-box-open text-3xl text-slate-300"></i>
            </div>
            <p className="font-black uppercase text-slate-400 text-sm tracking-widest">Part Reference Not Found</p>
            <p className="text-[10px] text-slate-300 font-bold uppercase mt-2">Check the Part Number format</p>
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mx-auto mb-8 animate-bounce duration-1000">
                <i className="fas fa-barcode text-4xl text-[#E67E22]/20"></i>
            </div>
            <p className="font-black uppercase text-slate-300 text-xs tracking-[0.2em]">Start typing to retrieve part info</p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-md z-50 animate-in fade-in">
           <div className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center gap-6 max-w-[80%]">
              <div className="w-24 h-24 bg-[#E67E22] rounded-full flex items-center justify-center text-5xl text-white shadow-[0_20px_40px_rgba(230,126,34,0.4)] animate-bounce">
                <i className="fas fa-check"></i>
              </div>
              <div className="text-center">
                <p className="font-black uppercase tracking-[0.3em] text-[#0F172A] text-lg">Inventory Updated</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Data successfully synced to Master</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrderEntry;
