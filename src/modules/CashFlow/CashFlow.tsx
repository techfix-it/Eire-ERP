import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import Card from '../../components/Card/Card';
import './CashFlow.css';

const CashFlow = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [view, setView] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    fetch('/api/transactions', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setTransactions);
  }, []);

  const chartData = [
    { name: 'Jan', in: 4000, out: 2400 },
    { name: 'Feb', in: 3000, out: 1398 },
    { name: 'Mar', in: 2000, out: 9800 },
    { name: 'Apr', in: 2780, out: 3908 },
    { name: 'May', in: 1890, out: 4800 },
    { name: 'Jun', in: 2390, out: 3800 },
  ];

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "cash_flow_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIn = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIn - totalOut;

  return (
    <div className="module-container">
      <div className="finance-stats-grid">
        <Card title="Cash In">
          <div className="stat-card-value stat-card-value-positive">€{totalIn.toLocaleString()}</div>
        </Card>
        <Card title="Cash Out">
          <div className="stat-card-value stat-card-value-negative">€{totalOut.toLocaleString()}</div>
        </Card>
        <Card title="Net Balance">
          <div className="stat-card-value" style={{ color: balance >= 0 ? 'var(--emerald-500)' : '#ef4444' }}>€{balance.toLocaleString()}</div>
        </Card>
      </div>

      <div className="finance-tabs">
        <button 
          className={`finance-tab-button ${view === 'chart' ? 'finance-tab-button-active' : ''}`}
          onClick={() => setView('chart')}
        >
          Chart View
        </button>
        <button 
          className={`finance-tab-button ${view === 'table' ? 'finance-tab-button-active' : ''}`}
          onClick={() => setView('table')}
        >
          Transaction List
        </button>
        <div style={{ flex: 1 }} />
        <button className="export-button" onClick={exportToCSV}>
          <Download style={{ width: '1rem', height: '1rem' }} /> Export CSV
        </button>
      </div>

      {view === 'chart' ? (
        <Card title="Cash Flow Projection">
          <div className="chart-container-large">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="in" fill="#10b981" name="Inflow" />
                <Bar dataKey="out" fill="#ef4444" name="Outflow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card title="Recent Transactions">
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i}>
                    <td className="item-sub-text">{t.date}</td>
                    <td className="item-main-text">{t.description}</td>
                    <td><span className="permission-badge">{t.category}</span></td>
                    <td>
                      <span className="item-status-text" style={{ color: t.type === 'in' ? 'var(--emerald-500)' : '#ef4444' }}>
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="item-value-text" style={{ textAlign: 'right' }}>€{t.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CashFlow;
