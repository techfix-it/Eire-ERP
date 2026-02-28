import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div className="loading-text">Loading dashboard...</div>;

  return (
    <div className="dashboard-grid">
      <Card title="Revenue (MTD)">
        <div className="stat-value stat-value-emerald">€{stats.revenue.toLocaleString()}</div>
        <p className="stat-label">Total from Invoices & Transactions</p>
      </Card>
      <Card title="Active Contracts">
        <div className="stat-value stat-value-white">{stats.activeContracts}</div>
        <p className="stat-label">Managed service agreements</p>
      </Card>
      <Card title="Stock Alerts">
        <div className="stat-value stat-value-amber">{stats.stockAlerts}</div>
        <p className="stat-label">Items below threshold</p>
      </Card>
    </div>
  );
};

export default Dashboard;
