'use client';

import React, { useState, useMemo } from 'react';
import { Download, LayoutPanelLeft, List, Calendar, Filter } from 'lucide-react';
import Card from '@/components/Card/Card';
import CashFlowChart from './CashFlowChart';
import TransactionList from '@/app/(protected)/cash-flow/TransactionList';
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
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('2026');

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter(t => {
      const date = new Date(t.date);
      const monthMatch = filterMonth === 'all' || date.getMonth().toString() === filterMonth;
      const yearMatch = filterYear === 'all' || date.getFullYear().toString() === filterYear;
      return monthMatch && yearMatch;
    });
  }, [initialTransactions, filterMonth, filterYear]);

  const filteredStats = useMemo(() => {
    const cashIn = filteredTransactions
      .filter(t => t.type === 'in')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const cashOut = filteredTransactions
      .filter(t => t.type === 'out')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    return { cashIn, cashOut, netBalance: cashIn - cashOut };
  }, [filteredTransactions]);

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  const years = ['2025', '2026'];

  return (
    <div className="cash-flow-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-zinc-900)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-zinc-800)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.875rem', fontWeight: '600' }}>CASH INFLOW</div>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--emerald-500)' }} />
            </div>
          </div>
          <div style={{ color: 'var(--emerald-500)', fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.025em' }}>€{filteredStats.cashIn.toLocaleString()}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-zinc-500)' }}>Total hardware and service sales</div>
        </div>
        
        <div style={{ backgroundColor: 'var(--bg-zinc-900)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-zinc-800)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.875rem', fontWeight: '600' }}>CASH OUTFLOW</div>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--rose-500)' }} />
            </div>
          </div>
          <div style={{ color: 'var(--rose-500)', fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.025em' }}>€{filteredStats.cashOut.toLocaleString()}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-zinc-500)' }}>Operational expenses and COGS</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-zinc-900)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-zinc-800)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.875rem', fontWeight: '600' }}>NET BALANCE</div>
            <div style={{ padding: '0.5rem', backgroundColor: filteredStats.netBalance >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: filteredStats.netBalance >= 0 ? 'var(--emerald-500)' : 'var(--rose-500)' }} />
            </div>
          </div>
          <div style={{ color: filteredStats.netBalance >= 0 ? 'white' : 'var(--rose-500)', fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.025em' }}>€{filteredStats.netBalance.toLocaleString()}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-zinc-500)' }}>Overall company profitability</div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Calendar size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-zinc-500)' }} />
            <select 
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', backgroundColor: 'var(--bg-zinc-900)', border: '1px solid var(--border-zinc-800)', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none', appearance: 'none', minWidth: '140px' }}
            >
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-zinc-500)' }} />
            <select 
              value={filterYear} 
              onChange={(e) => setFilterYear(e.target.value)}
              style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', backgroundColor: 'var(--bg-zinc-900)', border: '1px solid var(--border-zinc-800)', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none', appearance: 'none', minWidth: '100px' }}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-zinc-900)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-zinc-800)' }}>
          <button 
            onClick={() => setView('chart')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600',
              backgroundColor: view === 'chart' ? 'var(--emerald-600)' : 'transparent',
              color: view === 'chart' ? 'white' : 'var(--text-zinc-500)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <LayoutPanelLeft size={16} /> Chart
          </button>
          <button 
            onClick={() => setView('list')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600',
              backgroundColor: view === 'list' ? 'var(--emerald-600)' : 'transparent',
              color: view === 'list' ? 'white' : 'var(--text-zinc-500)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <List size={16} /> History
          </button>
        </div>

        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-zinc-800)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', backgroundColor: 'var(--bg-zinc-900)', color: 'white', transition: 'all 0.2s'
        }}>
          <Download size={16} /> Export Data
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {view === 'chart' ? (
          <Card title="Revenue vs Expenses (Yearly Overview)">
            <CashFlowChart transactions={filteredTransactions} />
          </Card>
        ) : (
          <Card title="Detailed Transaction History">
            <TransactionList transactions={filteredTransactions} />
          </Card>
        )}
      </div>
    </div>
  );
}
