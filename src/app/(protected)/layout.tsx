'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarClient from '@/components/Sidebar/SidebarClient';
import { Menu, Search, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import '@/styles/layout.css';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // Validate session with the new API
    fetch('/api/auth/me', {
      headers: { 'Authorization': parsedUser.id.toString() }
    })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
    })
    .catch(() => {
      handleLogout();
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  if (loading) return <div className="loading-bg">Loading session...</div>;

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <SidebarClient 
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
              <SidebarClient 
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
            <h2 className="page-title">Management System</h2>
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
          {children}
        </div>
      </main>
    </div>
  );
}
