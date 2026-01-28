
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'orders', label: 'Search', icon: 'fa-search' },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-line' },
    { id: 'dashboard', label: 'Stats', icon: 'fa-chart-pie' },
    { id: 'master', label: 'Data', icon: 'fa-database' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-[#0F172A] text-white flex-col shrink-0 h-screen sticky top-0 border-r border-white/5 shadow-2xl">
        <div className="p-8 flex flex-col items-center border-b border-white/5">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#E67E22] to-[#F39C12] rounded-2xl flex items-center justify-center shadow-lg mb-4 rotate-3 group hover:rotate-0 transition-transform">
             <span className="text-3xl font-black text-white">T</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Trend</h1>
          <p className="text-[10px] text-[#E67E22] tracking-[0.4em] font-black">SPARES</p>
        </div>
        
        <nav className="flex-1 mt-8 px-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-200 ${
                activeTab === item.id 
                ? 'bg-[#E67E22] text-white shadow-[0_8px_20px_rgba(230,126,34,0.3)] scale-105' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-sm`}></i>
              <span className="ml-4 font-black uppercase text-[11px] tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={onLogout}
            className="w-full py-4 rounded-xl border border-white/10 text-slate-500 hover:text-rose-400 hover:border-rose-400/30 transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            Exit System
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center px-4 py-3 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all py-1 ${
              activeTab === item.id ? 'text-[#E67E22] scale-110' : 'text-slate-400'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[9px] font-black uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1.5 text-slate-400 py-1"
        >
          <i className="fas fa-power-off text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-tight">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
