'use client';

import React from 'react';

interface CashFlowChartProps {
  transactions: any[];
}

export default function CashFlowChart({ transactions }: CashFlowChartProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = months.map((month, index) => {
    const inVal = transactions
      .filter(t => t.type === 'in' && new Date(t.date).getMonth() === index)
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const outVal = transactions
      .filter(t => t.type === 'out' && new Date(t.date).getMonth() === index)
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    return { month, inVal, outVal };
  });

  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.inVal, d.outVal)), 1000);
  const roundedMax = Math.ceil(maxVal / 1000) * 1000;
  
  const gridLines = [0, roundedMax * 0.25, roundedMax * 0.5, roundedMax * 0.75, roundedMax];

  return (
    <div style={{ height: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '2rem', borderBottom: '1px solid var(--border-zinc-800)', position: 'relative' }}>
        {/* Y-axis grid lines */}
        {gridLines.map(val => (
          <div key={val} style={{ 
            position: 'absolute', left: '0', right: '0', bottom: `${(val / roundedMax) * 100}%`, 
            borderBottom: val === 0 ? 'none' : '1px dashed rgba(39, 39, 42, 0.5)',
            color: 'var(--text-zinc-500)', fontSize: '0.625rem', paddingBottom: '2px', display: 'flex', alignItems: 'flex-end'
          }}>
            <span style={{ position: 'absolute', left: '-45px' }}>€{val.toLocaleString()}</span>
          </div>
        ))}

        {monthlyData.map((data, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.75rem', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', width: '100%', height: '100%' }}>
              <div 
                style={{ 
                  flex: 1, 
                  backgroundColor: 'var(--emerald-500)', 
                  height: data.inVal > 0 ? `${(data.inVal / roundedMax) * 100}%` : '2px', 
                  borderRadius: '3px 3px 0 0',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  transition: 'height 0.3s ease'
                }} 
                title={`In: €${data.inVal.toLocaleString()}`}
              />
              <div 
                style={{ 
                  flex: 1, 
                  backgroundColor: 'var(--rose-500)', 
                  height: data.outVal > 0 ? `${(data.outVal / roundedMax) * 100}%` : '2px', 
                  borderRadius: '3px 3px 0 0',
                  boxShadow: '0 4px 12px rgba(244, 63, 94, 0.2)',
                  transition: 'height 0.3s ease'
                }} 
                title={`Out: €${data.outVal.toLocaleString()}`}
              />
            </div>
            <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.625rem', fontWeight: '500' }}>{data.month}</div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.75rem', color: 'var(--text-zinc-500)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--emerald-500)' }}></div> 
          <span style={{ fontWeight: '500' }}>Inflow (Hardware/Sales)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--rose-500)' }}></div> 
          <span style={{ fontWeight: '500' }}>Outflow (Expenses/COGS)</span>
        </div>
      </div>
    </div>
  );
}
