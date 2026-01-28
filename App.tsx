
import React, { useState, useEffect } from 'react';
import { User, Part, Order } from './types';
import { AUTH_USERS, RAW_CSV_SAMPLE } from './constants';
import Login from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrderEntry from './components/OrderEntry';
import MasterData from './components/MasterData';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [masterData, setMasterData] = useState<Part[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize with some data
  useEffect(() => {
    const parseCSV = (csv: string) => {
      const lines = csv.split('\n');
      const result: Part[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 10) continue;
        result.push({
          partNo: cols[0].trim(),
          partName: cols[1].trim(),
          location: cols[2].trim(),
          onHand: parseFloat(cols[3]),
          dueIn: parseFloat(cols[4]),
          onOrder: parseFloat(cols[5]),
          amd3: parseFloat(cols[6]),
          mav: parseFloat(cols[7]),
          stkEff: parseFloat(cols[8]),
          sysGenStock: parseFloat(cols[9])
        });
      }
      return result;
    };
    setMasterData(parseCSV(RAW_CSV_SAMPLE));

    // Load from local storage if exists
    const storedOrders = localStorage.getItem('trend_hyundai_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedMaster = localStorage.getItem('trend_hyundai_master');
    if (storedMaster) setMasterData(JSON.parse(storedMaster));
  }, []);

  useEffect(() => {
    localStorage.setItem('trend_hyundai_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('trend_hyundai_master', JSON.stringify(masterData));
  }, [masterData]);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard orders={orders} masterData={masterData} />;
      case 'orders':
        return (
          <OrderEntry 
            masterData={masterData} 
            user={currentUser} 
            onAddOrder={(newOrder) => setOrders([newOrder, ...orders])} 
          />
        );
      case 'master':
        return <MasterData data={masterData} onUpdateData={setMasterData} />;
      case 'reports':
        return <Reports orders={orders} />;
      default:
        return <Dashboard orders={orders} masterData={masterData} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={() => setCurrentUser(null)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
