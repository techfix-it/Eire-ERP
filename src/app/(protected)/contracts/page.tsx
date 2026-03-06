import React from 'react';
import db from '@/lib/db';
import Card from '@/components/Card/Card';
import { Plus } from 'lucide-react';
import '@/modules/Contracts/Contracts.css';

export default async function ContractsPage() {
  const contracts = db.prepare("SELECT * FROM contracts ORDER BY start_date DESC").all() as any[];

  return (
    <div className="module-container">
      <Card 
        title="Service Contracts (Ireland)" 
        action={
          <button className="sidebar-logo-icon-wrapper" style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.875rem', cursor: 'pointer', border: 'none', backgroundColor: 'var(--emerald-600)' }}>
            <Plus className="w-4 h-4" /> New Contract
          </button>
        }
      >
        <div className="item-sub-text" style={{ marginBottom: '1.5rem' }}>
          Contracts are compliant with the 
          <span className="stat-card-value-positive" style={{ fontWeight: '500', fontSize: 'inherit', color: 'var(--emerald-500)' }}> Consumer Rights Act 2022 (Ireland)</span>.
        </div>
        <div className="item-list">
          {contracts.length === 0 ? (
            <div className="item-sub-text">No active contracts found.</div>
          ) : (
            contracts.map(c => (
              <div key={c.id} className="contract-card" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(39, 39, 42, 0.5)', borderRadius: '0.5rem', border: '1px solid var(--border-zinc-800)' }}>
                <div className="contract-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="contract-title" style={{ color: 'white', fontWeight: '600' }}>Agreement - {c.customer_name}</div>
                    <div className="contract-detail-label" style={{ fontSize: '0.75rem', color: 'var(--text-zinc-500)' }}>Status: {c.status} | Expires: {c.end_date}</div>
                  </div>
                  <button className="item-status-text" style={{ color: 'var(--emerald-500)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>View PDF</button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
