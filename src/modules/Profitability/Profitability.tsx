import React, { useState, useEffect } from 'react';
import { TrendingUp, Wallet, Info } from 'lucide-react';
import Card from '../../components/Card/Card';
import './Profitability.css';

const Profitability = () => {
  const [dre, setDre] = useState<any>(null);

  useEffect(() => {
    fetch('/api/finance/dre', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setDre);
  }, []);

  if (!dre) return <div className="loading-text">Loading DRE data...</div>;

  const rows = [
    { label: 'Gross Revenue', value: dre.grossRevenue, type: 'main' },
    { label: 'Taxes on Sales', value: -dre.taxes, type: 'sub' },
    { label: 'Net Revenue', value: dre.netRevenue, type: 'main', highlight: true },
    { label: 'Cost of Goods Sold (COGS)', value: -dre.cogs, type: 'sub' },
    { label: 'Gross Profit', value: dre.grossProfit, type: 'main', highlight: true },
    { label: 'Operating Expenses', value: -dre.operatingExpenses, type: 'sub' },
    { label: 'EBITDA', value: dre.ebitda, type: 'main', highlight: true },
    { label: 'Net Profit', value: dre.netProfit, type: 'main', highlight: true, final: true }
  ];

  return (
    <div className="module-container">
      <div className="finance-stats-grid">
        <Card title="Gross Margin">
          <div className="stat-card-value stat-card-value-positive">
            {dre.netRevenue ? ((dre.grossProfit / dre.netRevenue) * 100).toFixed(1) : '0.0'}%
          </div>
          <p className="item-sub-text">Efficiency in production/sales</p>
        </Card>
        <Card title="Net Margin">
          <div className="stat-card-value stat-card-value-positive">
            {dre.netRevenue ? ((dre.netProfit / dre.netRevenue) * 100).toFixed(1) : '0.0'}%
          </div>
          <p className="item-sub-text">Final profitability ratio</p>
        </Card>
        <Card title="Operating Efficiency">
          <div className="stat-card-value" style={{ color: 'var(--amber-500)' }}>
            {dre.netRevenue ? ((dre.ebitda / dre.netRevenue) * 100).toFixed(1) : '0.0'}%
          </div>
          <p className="item-sub-text">EBITDA Margin</p>
        </Card>
      </div>

      <Card title="Income Statement (DRE)">
        <div className="module-info-text" style={{ marginBottom: '1.5rem' }}>
          Detailed view of income and expenses for the current fiscal period.
        </div>
        <div className="item-list" style={{ gap: 0 }}>
          {rows.map((row, i) => (
            <div 
              key={i} 
              className={`dre-row ${row.highlight ? 'dre-row-highlight' : ''} ${row.final ? 'dre-row-final' : ''} ${row.type === 'sub' ? 'dre-row-sub' : 'dre-row-main'}`}
            >
              <div className="dre-label-container">
                {row.type === 'main' ? <TrendingUp className="dre-icon-main" /> : <Wallet className="dre-icon-sub" />}
                <span className={row.highlight ? 'dre-label-highlight' : 'dre-label'}>
                  {row.label}
                </span>
              </div>
              <div className={`dre-value ${row.value < 0 ? 'dre-value-negative' : row.highlight ? 'dre-value-highlight' : ''}`}>
                €{row.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Profitability;
