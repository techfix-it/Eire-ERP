import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import './POS.css';

const POS = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/inventory', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.23;
  const total = subtotal + vat;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    const res = await fetch('/api/pos/checkout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userId') || ''
      },
      body: JSON.stringify({ items: cart, total })
    });

    if (res.ok) {
      alert("Sale completed successfully!");
      setCart([]);
    }
  };

  return (
    <div className="pos-container">
      <div className="pos-products-area">
        <div className="pos-search-bar">
          <Search className="pos-search-icon" />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pos-search-input"
          />
        </div>

        <div className="pos-products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="pos-product-card" onClick={() => addToCart(product)}>
              <div className="pos-product-image">
                {product.images?.[0] && <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} referrerPolicy="no-referrer" />}
              </div>
              <div style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{product.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--emerald-500)', fontWeight: '700' }}>€{product.price.toFixed(2)}</span>
                <span style={{ color: 'var(--text-zinc-500)', fontSize: '0.75rem' }}>Stock: {product.stock_quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pos-cart-area">
        <div className="pos-cart-title">
          <ShoppingCart style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
          Current Cart
        </div>

        <div className="pos-cart-items">
          {cart.length === 0 ? (
            <div className="pos-cart-empty">Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-zinc-800)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <div>
                  <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.75rem' }}>{item.quantity}x €{item.price.toFixed(2)}</div>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pos-cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>VAT (23%)</span>
            <span>€{vat.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <button className="pay-button" onClick={handleCheckout}>
            <CreditCard style={{ display: 'inline-block', width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
