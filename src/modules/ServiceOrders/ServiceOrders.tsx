import React from 'react';
import { Plus } from 'lucide-react';
import Card from '../../components/Card/Card';
import './ServiceOrders.css';

const ServiceOrders = () => {
  return (
    <div className="module-container">
      <Card 
        title="Service Orders (OS)" 
        action={
          <button className="sidebar-logo-icon-wrapper" style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.875rem', cursor: 'pointer', border: 'none', backgroundColor: 'var(--emerald-600)' }}>
            <Plus className="w-4 h-4" /> New Order
          </button>
        }
      >
        <div className="item-sub-text" style={{ marginBottom: '1.5rem' }}>Track maintenance and repair orders across Ireland.</div>
        <div className="item-list">
          <div className="service-order-card">
            <div className="service-order-header">
              <span className="service-order-title">OS-1024: Boiler Repair</span>
              <span className="service-order-status">In Progress</span>
            </div>
            <div className="service-order-footer">Assigned to: John Doe | Location: Dublin 2</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServiceOrders;
