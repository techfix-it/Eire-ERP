import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Package, FileText, Truck, ShoppingCart, 
  Users, Settings, LogOut, Menu, X, TrendingUp, Wallet, 
  ClipboardList, FileSignature, UserCircle
} from 'lucide-react';
import { cn } from '../../utils/cn.js';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'pos', label: 'POS', icon: ShoppingCart },
    { id: 'service_orders', label: 'Service Orders', icon: ClipboardList },
    { id: 'contracts', label: 'Contracts', icon: FileSignature },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'fleet', label: 'Fleet Management', icon: Truck },
    { id: 'cash_flow', label: 'Cash Flow', icon: Wallet },
    { id: 'profitability', label: 'Profitability', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(item => user?.permissions?.includes(item.id));

  return (
    <div className="layout-wrapper">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-box">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="sidebar-title">Techfix-IT</h1>
        </div>

        <nav className="nav-container">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "nav-item",
                activeTab === item.id && "active"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">
              <UserCircle className="w-6 h-6 text-zinc-500" />
            </div>
            <div className="user-info">
              <p className="user-name">{user?.username}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="btn-signout"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="flex items-center gap-2">
          <div className="sidebar-logo-box" style={{ width: '32px', height: '32px' }}>
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">Techfix-IT</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2" style={{ color: 'var(--text-zinc-400)', border: 'none', background: 'transparent' }}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="sidebar"
              style={{ display: 'flex', width: '288px', height: '100%', position: 'relative' }}
            >
              <div className="flex justify-between items-center p-6">
                <span className="font-bold text-white">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2" style={{ color: 'var(--text-zinc-400)', border: 'none', background: 'transparent' }}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="nav-container">
                {filteredMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "nav-item",
                      activeTab === item.id && "active"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="sidebar-footer">
                <button 
                  onClick={logout}
                  className="btn-signout"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};
