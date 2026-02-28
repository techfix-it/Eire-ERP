import React from 'react';
import { Plus } from 'lucide-react';
import Card from '../../components/Card/Card';
import './Invoices.css';

const Invoices = () => (
  <Card title="Invoices" action={<button className="add-button"><Plus className="add-button-icon" /> New Invoice</button>}>
    <div className="module-info-text">Invoice module compliant with Irish Revenue standards.</div>
    <div className="item-list">
      {[1, 2, 3].map(i => (
        <div key={i} className="list-item">
          <div>
            <div className="item-main-text">INV-2024-00{i}</div>
            <div className="item-sub-text">Customer: Tech Solutions Ltd</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="item-value-text">€450.00</div>
            <div className="item-status-text">Paid</div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default Invoices;
