import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Settings
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Styles
import './styles/layout.css';

// Components
import Sidebar from './components/Sidebar/Sidebar';

// Modules
import Login from './modules/Auth/Login';
import Dashboard from './modules/Dashboard/Dashboard';
import Inventory from './modules/Inventory/Inventory';
import POS from './modules/POS/POS';
import ServiceOrders from './modules/ServiceOrders/ServiceOrders';
import Contracts from './modules/Contracts/Contracts';
import Fleet from './modules/Fleet/Fleet';
import Shipping from './modules/Shipping/Shipping';
import CashFlow from './modules/CashFlow/CashFlow';
import Profitability from './modules/Profitability/Profitability';
import Invoices from './modules/Invoices/Invoices';
import UsersManagement from './modules/UsersManagement/UsersManagement';

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Refresh permissions from server to ensure they are up to date
      fetch('/api/me', {
        headers: { 'Authorization': parsedUser.id.toString() }
      }).then(res => {
         if (!res.ok) throw new Error("Unauthorized");
         return res.json();
      }).then(data => {
        if (data.id) {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          handleLogout();
        }
      }).catch(err => {
        console.error("Session expired or invalid token", err);
        handleLogout();
      });
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id.toString());
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          handleLogout={handleLogout} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-overlay"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-sidebar"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                user={user} 
                handleLogout={handleLogout} 
                setIsMobileMenuOpen={setIsMobileMenuOpen} 
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="main-container">
        <header className="main-header">
          <div className="header-left">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="mobile-menu-toggle"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="page-title">{activeTab.replace('_', ' ')}</h2>
          </div>
          <div className="header-right">
            <div className="search-container">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="search-input"
              />
            </div>
            <button className="header-button">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="content-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'inventory' && <Inventory />}
              {activeTab === 'invoices' && <Invoices />}
              {activeTab === 'shipping' && <Shipping />}
              {activeTab === 'pos' && <POS />}
              {activeTab === 'users' && <UsersManagement currentUser={user} />}
              {activeTab === 'fleet' && <Fleet />}
              {activeTab === 'cash_flow' && <CashFlow />}
              {activeTab === 'profitability' && <Profitability />}
              {activeTab === 'contracts' && <Contracts />}
              {activeTab === 'service_orders' && <ServiceOrders />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
