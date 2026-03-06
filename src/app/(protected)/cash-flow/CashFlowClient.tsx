'use client';

import React, { useState } from 'react';
import { Download, LayoutPanelLeft, List } from 'lucide-react';
import Card from '@/components/Card/Card';
import CashFlowChart from './CashFlowChart';
import TransactionList from './TransactionList';
import '@/modules/CashFlow/CashFlow.css';

interface CashFlowClientProps {
  initialTransactions: any[];
  stats: {
    cashIn: number;
    cashOut: number;
    netBalance: number;
  };
}

export default function CashFlowClient({ initialTransactions, stats }: CashFlowClientProps) {
  const [view, setView] = useState<'chart' | 'list'>('chart');
  const [transactions, setTransactions] = useState(initialTransactions);

  return (
    <div className="cash-flow-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgb(24, 24, 27)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgb(39, 39, 42)' }}>
          <div style={{ color: 'rgb(161, 161, 170)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>Cash In</div>
          <div style={{ color: 'rgb(16, 185, 129)', fontSize: '2rem', fontWeight: '700' }}>€{stats.cashIn.toLocaleString()}</div>
        </div>
        <div style={{ backgroundColor: 'rgb(24, 24, 27)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgb(39, 39, 42)' }}>
          <div style={{ color: 'rgb(161, 161, 170)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>Cash Out</div>
          <div style={{ color: 'rgb(244, 63, 94)', fontSize: '2rem', fontWeight: '700' }}>€{stats.cashOut.toLocaleString()}</div>
        </div>
        <div style={{ backgroundColor: 'rgb(24, 24, 27)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgb(39, 39, 42)' }}>
          <div style={{ color: 'rgb(161, 161, 170)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>Net Balance</div>
          <div style={{ color: stats.netBalance >= 0 ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)', fontSize: '2rem', fontWeight: '700' }}>€{stats.netBalance.toLocaleString()}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgb(24, 24, 27)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid rgb(39, 39, 42)' }}>
          <button 
            onClick={() => setView('chart')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem',
              backgroundColor: view === 'chart' ? 'rgb(16, 185, 129)' : 'transparent',
              color: view === 'chart' ? 'white' : 'rgb(161, 161, 170)',
              transition: 'all 0.2s'
            }}
          >
            <LayoutPanelLeft size={16} /> Chart View
          </button>
          <button 
            onClick={() => setView('list')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem',
              backgroundColor: view === 'list' ? 'rgb(16, 185, 129)' : 'transparent',
              color: view === 'list' ? 'white' : 'rgb(161, 161, 170)',
              transition: 'all 0.2s'
            }}
          >
            <List size={16} /> Transaction List
          </button>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgb(39, 39, 42)', cursor: 'pointer', fontSize: '0.875rem', backgroundColor: 'rgb(24, 24, 27)', color: 'white'
        }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Content */}
      {view === 'chart' ? (
        <Card title="Cash Flow Projection">
          <CashFlowChart transactions={transactions} />
        </Card>
      ) : (
        <Card title="Recent Transactions">
          <TransactionList transactions={transactions} />
        </Card>
      )}
    </div>
  );
}
