import React from 'react';
import Card from '../../components/Card/Card';
import './Shipping.css';

const Shipping = () => (
  <div className="module-container">
    <Card title="Freight Quotation">
      <div className="form-grid-2">
        <div>
          <label className="form-label-block">Origin (Eircode/City)</label>
          <input type="text" className="form-input-standard" placeholder="Dublin D01" />
        </div>
        <div>
          <label className="form-label-block">Destination (Eircode/City)</label>
          <input type="text" className="form-input-standard" placeholder="Cork T12" />
        </div>
      </div>
      <button className="button-full">Get Quote</button>
    </Card>
    <Card title="Recent Shipments">
       <div className="item-sub-text">No active shipments.</div>
    </Card>
  </div>
);

export default Shipping;
