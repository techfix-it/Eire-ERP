'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import '@/components/Sidebar/Sidebar.css';

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  href: string;
  disabled?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, href, disabled }: SidebarItemProps) => (
  <Link
    href={disabled ? '#' : href}
    className={`sidebar-item ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'} ${disabled ? 'sidebar-item-disabled' : ''}`}
  >
    <Icon className="sidebar-item-icon" />
    {label}
  </Link>
);

interface SidebarProps {
  user: any;
  handleLogout: () => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar = ({ user, handleLogout, setIsMobileMenuOpen }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'inventory', label: 'Inventory', icon: Package, href: '/inventory' },
    { id: 'pos', label: 'POS System', icon: ShoppingCart, href: '/pos' },
    { id: 'service_orders', label: 'Service Orders', icon: ClipboardList, href: '/service-orders' },
    { id: 'contracts', label: 'Contracts', icon: FileSignature, href: '/contracts' },
    { id: 'fleet', label: 'Fleet & Logistics', icon: Truck, href: '/fleet' },
    { id: 'shipping', label: 'Shipping', icon: Truck, href: '/shipping' },
    { id: 'cash_flow', label: 'Cash Flow', icon: Wallet, href: '/cash-flow' },
    { id: 'profitability', label: 'Profitability (DRE)', icon: TrendingUp, href: '/profitability' },
    { id: 'invoices', label: 'Invoices', icon: FileText, href: '/invoices' },
    { id: 'users', label: 'Users & RBAC', icon: Users, href: '/users', adminOnly: true },
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
        {menuItems.map(item => {
          const isActive = pathname.startsWith(item.href);
          const isAdmin = user?.role === 'admin';
          const hasPermission = isAdmin || user?.permissions?.includes(item.id.replace(/-/g, '_')) || item.id === 'dashboard';
          const isAdminRequired = item.adminOnly && !isAdmin;

          if (isAdminRequired || !hasPermission) return null;

          return (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={isActive}
              href={item.href}
            />
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="user-info">
            <p className="user-name">{user?.username}</p>
            <p className="user-name" style={{ fontSize: '0.7rem', opacity: 0.7 }}>{user?.role}</p>
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
