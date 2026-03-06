import React from 'react';
import db from '@/lib/db';
import Card from '@/components/Card/Card';
import { Plus } from 'lucide-react';
import '@/modules/Invoices/Invoices.css';

export default async function InvoicesPage() {
  const invoices = db.prepare("SELECT * FROM invoices ORDER BY issue_date DESC").all() as any[];

  return (
    <Card title="Invoices" action={<button className="add-button"><Plus className="add-button-icon" /> New Invoice</button>}>
      <div className="module-info-text">Invoice module compliant with Irish Revenue standards.</div>
      <div className="item-list">
        {invoices.length === 0 ? (
          <div className="item-sub-text">No invoices found.</div>
        ) : (
          invoices.map(inv => (
            <div key={inv.id} className="list-item">
              <div>
                <div className="item-main-text">INV-{new Date(inv.issue_date).getFullYear()}-{inv.id.toString().padStart(4, '0')}</div>
                <div className="item-sub-text">Customer: {inv.customer_name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="item-value-text">€{inv.total_amount?.toFixed(2) || '0.00'}</div>
                <div className="item-status-text" style={{ color: inv.status === 'paid' ? 'var(--emerald-500)' : 'var(--amber-500)' }}>
                  {inv.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
