import React from 'react';
import Card from '@/components/Card/Card';
import '@/modules/Shipping/Shipping.css';

export default function ShippingPage() {
  return (
    <div className="module-container">
      <Card title="Freight Quotation">
        <div className="form-grid-2">
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label-block" style={{ color: 'var(--text-zinc-500)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>Origin (Eircode/City)</label>
            <input type="text" className="form-input-standard" placeholder="Dublin D01" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-zinc-800)', borderRadius: '0.5rem', border: '1px solid var(--border-zinc-700)', color: 'white' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label-block" style={{ color: 'var(--text-zinc-500)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>Destination (Eircode/City)</label>
            <input type="text" className="form-input-standard" placeholder="Cork T12" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-zinc-800)', borderRadius: '0.5rem', border: '1px solid var(--border-zinc-700)', color: 'white' }} />
          </div>
        </div>
        <button className="button-full" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--emerald-600)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 'bold' }}>Get Quote</button>
      </Card>
      <div style={{ marginTop: '2rem' }}>
        <Card title="Recent Shipments">
          <div className="item-sub-text" style={{ color: 'var(--text-zinc-500)' }}>No active shipments.</div>
        </Card>
      </div>
    </div>
  );
}
