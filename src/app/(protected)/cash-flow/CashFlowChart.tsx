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
      .reduce((acc, t) => acc + t.amount, 0);
    const outVal = transactions
      .filter(t => t.type === 'out' && new Date(t.date).getMonth() === index)
      .reduce((acc, t) => acc + t.amount, 0);
    return { month, inVal, outVal };
  });

  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.inVal, d.outVal, 1000)));

  return (
    <div style={{ height: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgb(39, 39, 42)', position: 'relative' }}>
        {/* Y-axis grid lines */}
        {[0, 2500, 5000, 7500, 10000].map(val => (
          <div key={val} style={{ 
            position: 'absolute', left: '-40px', bottom: `${(val / 10000) * 100}%`, color: 'rgb(113, 113, 122)', fontSize: '0.75rem', width: '35px', textAlign: 'right', display: 'flex', alignItems: 'center' 
          }}>
            {val} —
          </div>
        ))}

        {monthlyData.filter((_, i) => i < 6).map((data, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', height: '100%' }}>
              <div 
                style={{ flex: 1, backgroundColor: 'rgb(16, 185, 129)', height: `${(data.inVal / 10000) * 100}%`, borderRadius: '2px 2px 0 0' }} 
                title={`In: €${data.inVal}`}
              />
              <div 
                style={{ flex: 1, backgroundColor: 'rgb(244, 63, 94)', height: `${(data.outVal / 10000) * 100}%`, borderRadius: '2px 2px 0 0' }} 
                title={`Out: €${data.outVal}`}
              />
            </div>
            <div style={{ color: 'rgb(161, 161, 170)', fontSize: '0.75rem' }}>{data.month}</div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', color: 'rgb(161, 161, 170)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgb(16, 185, 129)' }}></div> Inflow
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgb(244, 63, 94)' }}></div> Outflow
        </div>
      </div>
    </div>
  );
}
