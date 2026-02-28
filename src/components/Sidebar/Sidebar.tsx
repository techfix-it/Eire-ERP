import React from 'react';
import './Sidebar.css';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  FileSignature, 
  Truck, 
  Wallet, 
  TrendingUp, 
  FileText, 
  Users, 
  LogOut, 
  UserCircle,
  X
} from 'lucide-react';

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }: SidebarItemProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`sidebar-item ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'} ${disabled ? 'sidebar-item-disabled' : ''}`}
  >
    <Icon className="sidebar-item-icon" />
    {label}
  </button>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  handleLogout: () => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar = ({ activeTab, setActiveTab, user, handleLogout, setIsMobileMenuOpen }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'pos', label: 'POS System', icon: ShoppingCart },
    { id: 'service_orders', label: 'Service Orders', icon: ClipboardList },
    { id: 'contracts', label: 'Contracts', icon: FileSignature },
    { id: 'fleet', label: 'Fleet & Logistics', icon: Truck },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'cash_flow', label: 'Cash Flow', icon: Wallet },
    { id: 'profitability', label: 'Profitability (DRE)', icon: TrendingUp },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'users', label: 'Users & RBAC', icon: Users, adminOnly: true },
  ];

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-icon-wrapper">
            <LayoutDashboard className="sidebar-logo-icon" />
          </div>
          <span className="sidebar-logo-text">Techfix-IT ERP</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="mobile-menu-toggle"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          (!item.adminOnly || user?.role === 'admin') && user?.permissions?.includes(item.id) && (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
            />
          )
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="user-info">
            <p className="user-name">{user?.username}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          <LogOut className="logout-icon" />
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
