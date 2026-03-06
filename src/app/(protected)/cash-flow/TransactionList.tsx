'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionListProps {
  transactions: any[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-zinc-500)' }}>
        <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No records found</div>
        <div style={{ fontSize: '0.875rem' }}>Try adjusting your filters or date range.</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '0.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(24, 24, 27, 0.5)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-zinc-500)', fontWeight: '600', borderBottom: '1px solid var(--border-zinc-800)' }}>DATE</th>
            <th style={{ padding: '1rem', color: 'var(--text-zinc-500)', fontWeight: '600', borderBottom: '1px solid var(--border-zinc-800)' }}>DESCRIPTION</th>
            <th style={{ padding: '1rem', color: 'var(--text-zinc-500)', fontWeight: '600', borderBottom: '1px solid var(--border-zinc-800)' }}>CATEGORY</th>
            <th style={{ padding: '1rem', color: 'var(--text-zinc-500)', fontWeight: '600', borderBottom: '1px solid var(--border-zinc-800)' }}>TYPE</th>
            <th style={{ padding: '1rem', color: 'var(--text-zinc-500)', fontWeight: '600', borderBottom: '1px solid var(--border-zinc-800)', textAlign: 'right' }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody className="transaction-table-body">
          {transactions.map((t, i) => (
            <tr key={i} className="list-item-hover" style={{ transition: 'background-color 0.2s' }}>
              <td style={{ padding: '1.25rem 1rem', color: 'var(--text-zinc-400)', borderBottom: '1px solid var(--border-zinc-800)' }}>
                {new Date(t.date).toLocaleDateString()}
              </td>
              <td style={{ padding: '1.25rem 1rem', fontWeight: '500', color: 'white', borderBottom: '1px solid var(--border-zinc-800)' }}>
                {t.description}
              </td>
              <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border-zinc-800)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-zinc-400)', backgroundColor: 'var(--bg-zinc-800)', padding: '0.25rem 0.625rem', borderRadius: '2rem' }}>
                  {t.category}
                </span>
              </td>
              <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border-zinc-800)' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: t.type === 'in' ? 'var(--emerald-500)' : 'var(--rose-500)',
                  fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {t.type === 'in' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                  {t.type === 'in' ? 'Credit' : 'Debit'}
                </div>
              </td>
              <td style={{ padding: '1.25rem 1rem', textAlign: 'right', borderBottom: '1px solid var(--border-zinc-800)' }}>
                <div style={{ 
                  color: t.type === 'in' ? 'var(--emerald-500)' : 'white', 
                  fontWeight: '700', fontSize: '1rem' 
                }}>
                  {t.type === 'in' ? '+' : '-'} €{(Number(t.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
