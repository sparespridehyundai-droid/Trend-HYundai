
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
  const [activeTab, setActiveTab] = useState('orders');
  const [masterData, setMasterData] = useState<Part[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize Data Persistence
  useEffect(() => {
    // 1. Try to load Master Data from Local Storage first
    const storedMaster = localStorage.getItem('trend_hyundai_master');
    if (storedMaster) {
      try {
        const parsed = JSON.parse(storedMaster);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMasterData(parsed);
        } else {
          loadSampleData();
        }
      } catch (e) {
        loadSampleData();
      }
    } else {
      loadSampleData();
    }

    // 2. Load Orders from Local Storage
    const storedOrders = localStorage.getItem('trend_hyundai_orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (e) {
        setOrders([]);
      }
    }
  }, []);

  const loadSampleData = () => {
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
          onHand: parseFloat(cols[3]) || 0,
          dueIn: parseFloat(cols[4]) || 0,
          onOrder: parseFloat(cols[5]) || 0,
          amd3: parseFloat(cols[6]) || 0,
          mav: parseFloat(cols[7]) || 0,
          stkEff: parseFloat(cols[8]) || 0,
          sysGenStock: parseFloat(cols[9]) || 0
        });
      }
      return result;
    };
    const sample = parseCSV(RAW_CSV_SAMPLE);
    setMasterData(sample);
    localStorage.setItem('trend_hyundai_master', JSON.stringify(sample));
  };

  // Persist Data whenever it changes
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('trend_hyundai_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleUpdateMaster = (newData: Part[]) => {
    setMasterData(newData);
    localStorage.setItem('trend_hyundai_master', JSON.stringify(newData));
  };

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
        return <MasterData data={masterData} onUpdateData={handleUpdateMaster} />;
      case 'reports':
        return <Reports orders={orders} />;
      default:
        return <OrderEntry 
          masterData={masterData} 
          user={currentUser} 
          onAddOrder={(newOrder) => setOrders([newOrder, ...orders])} 
        />;
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
