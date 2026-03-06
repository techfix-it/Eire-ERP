'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import '@/modules/Auth/Login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('userId', data.id.toString());
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again.');
      console.error('Login fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div className="auth-header">
          <div className="auth-logo-container">
            <LayoutDashboard className="auth-logo-icon" />
          </div>
          <h1 className="auth-title">Techfix-IT ERP</h1>
          <p className="auth-subtitle">Management System for Ireland</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Demo credentials: admin / admin123
        </div>
      </motion.div>
    </div>
  );
}
