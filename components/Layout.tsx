
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
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'orders', label: 'New Order', icon: 'fa-plus-circle' },
    { id: 'reports', label: 'Reports', icon: 'fa-file-invoice' },
    { id: 'master', label: 'Master Data', icon: 'fa-database' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 hyundai-blue text-white flex flex-col">
        <div className="p-6 text-center border-b border-blue-800">
          <h1 className="text-xl font-bold tracking-widest text-white">TREND <span className="text-blue-300">HYUNDAI</span></h1>
        </div>
        <nav className="flex-1 mt-6 px-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center p-3 rounded-xl bg-blue-900/50">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
              {currentUser.userName.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold truncate">{currentUser.userName}</p>
              <p className="text-xs text-blue-300 capitalize">{currentUser.role}</p>
            </div>
            <button 
              onClick={onLogout}
              className="ml-auto text-blue-300 hover:text-white"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <header className="bg-white h-16 flex items-center px-8 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center capitalize">
             <i className={`fas ${menuItems.find(m => m.id === activeTab)?.icon} mr-3 hyundai-gold`}></i>
             {activeTab === 'dashboard' ? 'Overview' : activeTab.replace(/([A-Z])/g, ' $1')}
          </h2>
          <div className="ml-auto flex items-center space-x-4">
             <span className="text-sm text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
             <div className="h-6 w-px bg-slate-200"></div>
             <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fas fa-bell"></i>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
