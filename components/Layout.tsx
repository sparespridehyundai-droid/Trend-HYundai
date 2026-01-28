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
    { id: 'dashboard', label: 'Stats', icon: 'fa-chart-pie' },
    { id: 'reports', label: 'History', icon: 'fa-clock-rotate-left' },
    { id: 'master', label: 'Data', icon: 'fa-database' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F5F5]">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-[#001D3D] text-white flex-col shrink-0 h-screen sticky top-0">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tight italic">Trend</h1>
          <p className="text-[10px] text-[#E67E22] tracking-[0.3em] font-bold mt-1">SPARES</p>
        </div>
        <nav className="flex-1 mt-8 px-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-[#E67E22] text-white shadow-xl' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              <span className="ml-4 font-black uppercase text-[11px] tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6">
          <button 
            onClick={onLogout}
            className="w-full py-4 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center px-4 py-3 z-40">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id ? 'text-[#E67E22]' : 'text-slate-400'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <i className="fas fa-sign-out-alt text-lg"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;