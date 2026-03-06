'use client';

import React from 'react';

interface TransactionListProps {
  transactions: any[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgb(39, 39, 42)', color: 'rgb(113, 113, 122)' }}>
            <th style={{ padding: '1rem', fontWeight: '500' }}>DATE</th>
            <th style={{ padding: '1rem', fontWeight: '500' }}>DESCRIPTION</th>
            <th style={{ padding: '1rem', fontWeight: '500' }}>CATEGORY</th>
            <th style={{ padding: '1rem', fontWeight: '500' }}>TYPE</th>
            <th style={{ padding: '1rem', fontWeight: '500', textAlign: 'right' }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(39, 39, 42, 0.5)', color: 'rgb(228, 228, 231)' }}>
              <td style={{ padding: '1rem' }}>{new Date(t.date).toLocaleDateString()}</td>
              <td style={{ padding: '1rem' }}>{t.description}</td>
              <td style={{ padding: '1rem' }}>{t.category}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase',
                  backgroundColor: t.type === 'in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                  color: t.type === 'in' ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)'
                }}>
                  {t.type}
                </span>
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                €{t.amount?.toLocaleString() || '0'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
