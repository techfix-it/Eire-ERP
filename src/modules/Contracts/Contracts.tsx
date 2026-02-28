import React from 'react';
import { Plus } from 'lucide-react';
import Card from '../../components/Card/Card';
import './Contracts.css';

const Contracts = () => {
  return (
    <div className="module-container">
      <Card 
        title="Service Contracts (Ireland)" 
        action={
          <button 
            onClick={async () => {
              const name = prompt("Customer Name?");
              const service = prompt("Service Type?");
              if (name && service) {
                alert("Generating Irish-compliant contract...");
              }
            }}
            className="sidebar-logo-icon-wrapper"
            style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.875rem', cursor: 'pointer', border: 'none', backgroundColor: 'var(--emerald-600)' }}
          >
            <Plus className="w-4 h-4" /> New Contract
          </button>
        }
      >
        <div className="item-sub-text" style={{ marginBottom: '1.5rem' }}>
          Contracts are generated using Gemini AI to ensure compliance with the 
          <span className="stat-card-value-positive" style={{ fontWeight: '500', fontSize: 'inherit' }}> Consumer Rights Act 2022 (Ireland)</span>.
        </div>
        <div className="item-list">
          {[1, 2].map(i => (
            <div key={i} className="contract-card">
              <div className="contract-header">
                <div>
                  <div className="contract-title">Maintenance Agreement - Client {i}</div>
                  <div className="contract-detail-label">Status: Active | Law: Ireland</div>
                </div>
                <button className="item-status-text" style={{ color: 'var(--emerald-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View PDF</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Contracts;
