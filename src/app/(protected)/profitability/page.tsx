import React from 'react';
import db from '@/lib/db';
import Card from '@/components/Card/Card';
import { TrendingUp, Minus, Plus, Info } from 'lucide-react';
import '@/modules/Profitability/Profitability.css';

export default async function ProfitabilityPage() {
  // Fetch transactions to calculate real DRE
  const transactions = db.prepare("SELECT * FROM transactions").all() as any[];

  const grossRevenue = transactions
    .filter(t => t.type === 'in')
    .reduce((acc, t) => acc + t.amount, 0);

  const cogs = transactions
    .filter(t => t.type === 'out' && (t.category === 'Fornecedor' || t.category === 'Custo Direto'))
    .reduce((acc, t) => acc + t.amount, 0);

  const operatingExpenses = transactions
    .filter(t => t.type === 'out' && !(['Fornecedor', 'Custo Direto'].includes(t.category)))
    .reduce((acc, t) => acc + t.amount, 0);

  // Ireland approx VAT/Tax on sales (just for demo consistency with screenshot)
  const salesTaxes = grossRevenue * 0.141; // Derived from screenshot ratio 12000/85000
  const netRevenue = grossRevenue - salesTaxes;
  const grossProfit = netRevenue - cogs;
  const ebitda = grossProfit - operatingExpenses;
  
  // Irish Corporate Tax approx (12.5% for trading)
  const corporationTax = ebitda * 0.125;
  const netProfit = ebitda - corporationTax;

  // Margins
  const grossMargin = (grossProfit / grossRevenue) * 100;
  const netMargin = (netProfit / grossRevenue) * 100;
  const operatingEfficiency = (ebitda / grossRevenue) * 100;

  const rows = [
    { label: "Gross Revenue", value: grossRevenue, icon: TrendingUp, type: 'main' },
    { label: "Taxes on Sales", value: -salesTaxes, icon: Minus, type: 'sub' },
    { label: "Net Revenue", value: netRevenue, icon: TrendingUp, type: 'active' },
    { label: "Cost of Goods Sold (COGS)", value: -cogs, icon: Minus, type: 'sub' },
    { label: "Gross Profit", value: grossProfit, icon: TrendingUp, type: 'active' },
    { label: "Operating Expenses", value: -operatingExpenses, icon: Minus, type: 'sub' },
    { label: "EBITDA", value: ebitda, icon: TrendingUp, type: 'active' },
    { label: "Net Profit", value: netProfit, icon: TrendingUp, type: 'final' },
  ];

  return (
    <div className="dre-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      {/* Top Margin Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgb(24, 24, 27)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgb(39, 39, 42)' }}>
          <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Gross Margin</div>
          <div style={{ color: 'rgb(16, 185, 129)', fontSize: '2rem', fontWeight: '700' }}>{grossMargin.toFixed(1)}%</div>
          <div style={{ color: 'rgb(113, 113, 122)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Efficiency in production/sales</div>
        </div>
        <div style={{ backgroundColor: 'rgb(24, 24, 27)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgb(39, 39, 42)' }}>
          <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Net Margin</div>
          <div style={{ color: 'rgb(16, 185, 129)', fontSize: '2rem', fontWeight: '700' }}>{netMargin.toFixed(1)}%</div>
          <div style={{ color: 'rgb(113, 113, 122)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Final profitability ratio</div>
        </div>
        <div style={{ backgroundColor: 'rgb(24, 24, 27)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgb(39, 39, 42)' }}>
          <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Operating Efficiency</div>
          <div style={{ color: 'rgb(245, 158, 11)', fontSize: '2rem', fontWeight: '700' }}>{operatingEfficiency.toFixed(1)}%</div>
          <div style={{ color: 'rgb(113, 113, 122)', fontSize: '0.75rem', marginTop: '0.5rem' }}>EBITDA Margin</div>
        </div>
      </div>

      <Card title="Income Statement (DRE)">
        <div style={{ color: 'rgb(161, 161, 170)', fontSize: '0.875rem', fontStyle: 'italic', marginBottom: '2rem' }}>
          Detailed view of income and expenses for the current fiscal period.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {rows.map((row, i) => {
            const isNegative = row.value < 0;
            const RowIcon = row.icon;
            
            let rowBg = 'transparent';
            let textColor = 'rgb(161, 161, 170)';
            let valueColor = 'white';
            
            if (row.type === 'active' || row.type === 'final') {
              rowBg = 'rgba(16, 185, 129, 0.05)';
              textColor = 'white';
              valueColor = 'rgb(16, 185, 129)';
            }
            if (row.type === 'final') {
                rowBg = 'rgba(16, 185, 129, 0.1)';
            }

            return (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: rowBg,
                borderBottom: row.type === 'sub' ? 'none' : '1px solid rgba(39, 39, 42, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: row.type === 'sub' ? '2rem' : '0' }}>
                  <RowIcon size={14} style={{ color: isNegative ? 'rgb(244, 63, 94)' : 'rgb(113, 113, 122)' }} />
                  <span style={{ color: textColor, fontWeight: row.type === 'main' || row.type === 'active' || row.type === 'final' ? '600' : '400' }}>
                    {row.label}
                  </span>
                </div>
                <div style={{ 
                  color: isNegative ? 'rgb(244, 63, 94)' : valueColor, 
                  fontWeight: '700',
                  fontSize: '1rem'
                }}>
                  {isNegative ? '- ' : ''}€{Math.abs(row.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
