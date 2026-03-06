'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Minus, Plus, Info, Calendar, Filter, Share2 } from 'lucide-react';
import Card from '@/components/Card/Card';

interface ProfitabilityClientProps {
  initialTransactions: any[];
}

export default function ProfitabilityClient({ initialTransactions }: ProfitabilityClientProps) {
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

  const dre = useMemo(() => {
    const grossRevenue = filteredTransactions
      .filter(t => t.type === 'in')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const cogs = filteredTransactions
      .filter(t => t.type === 'out' && (t.category === 'Inventory' || t.category === 'Hardware' || t.category === 'Supplier'))
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const operatingExpenses = filteredTransactions
      .filter(t => t.type === 'out' && !(['Inventory', 'Hardware', 'Supplier'].includes(t.category)))
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const salesTaxes = grossRevenue * 0.141; // Irish VAT/Sales Tax Est.
    const netRevenue = grossRevenue - salesTaxes;
    const grossProfit = netRevenue - cogs;
    const ebitda = grossProfit - operatingExpenses;
    const corporationTax = ebitda > 0 ? ebitda * 0.125 : 0;
    const netProfit = ebitda - corporationTax;

    const grossMargin = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;
    const netMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
    const operatingEfficiency = grossRevenue > 0 ? (ebitda / grossRevenue) * 100 : 0;

    return {
      grossRevenue,
      salesTaxes,
      netRevenue,
      cogs,
      grossProfit,
      operatingExpenses,
      ebitda,
      corporationTax,
      netProfit,
      grossMargin,
      netMargin,
      operatingEfficiency
    };
  }, [filteredTransactions]);

  const rows = [
    { label: "Gross Revenue", value: dre.grossRevenue, icon: TrendingUp, type: 'main', desc: 'Total hardware and service sales volume' },
    { label: "Taxes on Sales", value: -dre.salesTaxes, icon: Minus, type: 'sub', desc: 'Estimated VAT and sales levies' },
    { label: "Net Revenue", value: dre.netRevenue, icon: TrendingUp, type: 'active', desc: 'Revenue after direct government deductions' },
    { label: "Cost of Goods Sold (COGS)", value: -dre.cogs, icon: Minus, type: 'sub', desc: 'Direct costs of components and inventory' },
    { label: "Gross Profit", value: dre.grossProfit, icon: TrendingUp, type: 'active', desc: 'Margin available to cover operating costs' },
    { label: "Operating Expenses (OpEx)", value: -dre.operatingExpenses, icon: Minus, type: 'sub', desc: 'Utilities, rent, staff, and marketing' },
    { label: "EBITDA", value: dre.ebitda, icon: TrendingUp, type: 'active', desc: 'Earnings before interest, taxes, and depreciation' },
    { label: "Corporate Tax", value: -dre.corporationTax, icon: Minus, type: 'sub', desc: 'Estimated 12.5% Corp Tax (Ireland)' },
    { label: "Net Profit", value: dre.netProfit, icon: TrendingUp, type: 'final', desc: 'Final company bottom line' },
  ];

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

  return (
    <div className="profitability-client-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-zinc-900)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-zinc-800)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Gross Margin</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div style={{ color: 'var(--emerald-500)', fontSize: '2.5rem', fontWeight: '800' }}>{dre.grossMargin.toFixed(1)}%</div>
            <TrendingUp size={16} style={{ color: 'var(--emerald-500)' }} />
          </div>
          <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Product & Service efficiency</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-zinc-900)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-zinc-800)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Net Margin</div>
          <div style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800' }}>{dre.netMargin.toFixed(1)}%</div>
          <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Final profitability coefficient</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-zinc-900)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-zinc-800)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Operating Efficiency</div>
          <div style={{ color: 'var(--amber-500)', fontSize: '2.5rem', fontWeight: '800' }}>{dre.operatingEfficiency.toFixed(1)}%</div>
          <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.75rem', marginTop: '0.5rem' }}>EBITDA conversion rate</div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
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
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value)}
            style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-zinc-900)', border: '1px solid var(--border-zinc-800)', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none' }}
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: 'var(--emerald-600)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
        }}>
          <Share2 size={16} /> Export Financial Report
        </button>
      </div>

      {/* Income Statement Table */}
      <Card title="Income Statement (DRE)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '1rem' }}>
          {rows.map((row, i) => {
            const isNegative = row.value < 0;
            const RowIcon = row.icon;
            
            let rowBg = 'transparent';
            let textColor = 'var(--text-zinc-400)';
            let valueColor = 'white';
            
            if (row.type === 'active' || row.type === 'final') {
              rowBg = 'rgba(16, 185, 129, 0.03)';
              textColor = 'white';
              valueColor = 'var(--emerald-400)';
            }
            if (row.type === 'final') {
                rowBg = 'rgba(16, 185, 129, 0.08)';
                valueColor = 'var(--emerald-500)';
            }

            return (
              <div key={i} className="list-item-hover" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderRadius: '0.75rem',
                backgroundColor: rowBg,
                borderBottom: row.type === 'sub' ? 'none' : '1px solid var(--border-zinc-800)',
                transition: 'all 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingLeft: row.type === 'sub' ? '2.5rem' : '0' }}>
                  <div style={{ 
                    width: '28px', height: '28px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isNegative ? 'rgba(244, 63, 94, 0.1)' : 'rgba(39, 39, 42, 0.5)'
                  }}>
                    <RowIcon size={14} style={{ color: isNegative ? 'var(--rose-500)' : 'var(--text-zinc-500)' }} />
                  </div>
                  <div>
                    <div style={{ color: textColor, fontWeight: row.type === 'main' || row.type === 'active' || row.type === 'final' ? '700' : '500', fontSize: '0.925rem' }}>
                      {row.label}
                    </div>
                    <div style={{ color: 'var(--text-zinc-600)', fontSize: '0.7rem', marginTop: '0.125rem' }}>{row.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: isNegative ? 'var(--rose-500)' : valueColor, 
                      fontWeight: '800',
                      fontSize: row.type === 'final' ? '1.5rem' : '1.125rem',
                      letterSpacing: '-0.025em'
                    }}>
                      {isNegative ? '-' : ''} €{Math.abs(row.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Knowledge Tooltip */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <Info size={16} style={{ color: 'var(--blue-400)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-zinc-400)' }}>
            Financial metrics are calculated based on registered transactions and approximated Irish tax policies (12.5% Corp Tax, 23% Standard VAT).
        </span>
      </div>
    </div>
  );
}
