'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Cpu, 
  Wrench, 
  Package,
  Zap
} from 'lucide-react';
import '@/modules/POS/POS.css';

interface POSClientProps {
  initialProducts: any[];
}

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Package },
  { id: 'hardware', name: 'Hardware', icon: Cpu },
  { id: 'smartphone', name: 'Phones', icon: Smartphone },
  { id: 'audio', name: 'Audio', icon: Headphones },
  { id: 'service', name: 'Repair', icon: Wrench },
  { id: 'accessory', name: 'Others', icon: Zap },
];

export default function POSClient({ initialProducts }: POSClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.23;
  
  const discountAmount = discountType === 'percent' 
    ? (subtotal + vat) * (discountValue / 100)
    : discountValue;

  const total = Math.max(0, (subtotal + vat) - discountAmount);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category?.toLowerCase() === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchTerm, activeCategory]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // In a real app, this would call the API
    console.log("Processing payment via", paymentMethod, "Total:", total);
    
    const res = await fetch('/api/pos/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total, paymentMethod, discount: { type: discountType, value: discountValue } })
    });

    if (res.ok) {
      alert("Payment Successful! Printing receipt...");
      setCart([]);
      setDiscountValue(0);
      setIsPaymentModalOpen(false);
    }
  };

  return (
    <div className="pos-container">
      {/* Category Sidebar */}
      <div className="pos-categories-sidebar">
        {CATEGORIES.map(cat => (
          <div 
            key={cat.id} 
            className={`category-item ${activeCategory === cat.id ? 'category-item-active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <cat.icon size={24} />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div className="pos-main-area">
        <div className="pos-header">
          <h2 className="pos-totem-title">Self-Service Terminal</h2>
          <div className="pos-search-wrapper">
            <Search className="pos-search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search products or SKU..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pos-search-input"
            />
          </div>
        </div>

        <div className="pos-totem-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="pos-totem-card" onClick={() => addToCart(product)}>
              <div className="pos-card-image">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <Package size={40} color="var(--text-zinc-700)" />
                )}
              </div>
              <div className="pos-card-name">{product.name}</div>
              <div className="pos-card-price">€{product.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="pos-cart-sidebar">
        <div className="cart-header">
          <span className="cart-title">My Order</span>
          <span style={{ backgroundColor: 'var(--emerald-600)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '800' }}>
            {cart.reduce((acc, i) => acc + i.quantity, 0)} Items
          </span>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-zinc-600)' }}>
              <ShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>Your cart is empty.<br/>Select items to start.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item-totem">
                <div className="cart-item-image">
                   {item.images?.[0] ? <img src={item.images[0]} alt={item.name} /> : <Package size={20} />}
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">€{item.price.toFixed(2)} each</div>
                </div>
                <div className="cart-item-controls">
                  <button className="control-btn" onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                  <span style={{ color: 'white', fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="control-btn" onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer-totem">
          <div className="summary-details">
            <div className="summary-row"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>VAT (23%)</span><span>€{vat.toFixed(2)}</span></div>
            
            {/* Discount Section */}
            <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <div className="discount-toggle">
                <button 
                    className={`discount-btn ${discountType === 'percent' ? 'discount-btn-active' : ''}`}
                    onClick={() => setDiscountType('percent')}
                >Percentage (%)</button>
                <button 
                    className={`discount-btn ${discountType === 'fixed' ? 'discount-btn-active' : ''}`}
                    onClick={() => setDiscountType('fixed')}
                >Fixed (€)</button>
              </div>
              <div className="discount-input-wrapper" style={{ marginTop: '0.5rem' }}>
                <input 
                    type="number" 
                    className="discount-input" 
                    placeholder={`Discount ${discountType === 'percent' ? '%' : '€'}`}
                    value={discountValue || ''}
                    onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {discountAmount > 0 && (
                <div className="summary-row" style={{ color: 'var(--rose-400)' }}>
                    <span>Discount Applied</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                </div>
            )}

            <div className="summary-total-totem">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="checkout-btn-totem" 
            disabled={cart.length === 0}
            onClick={() => setIsPaymentModalOpen(true)}
          >
            COMPLETE ORDER <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <button 
                className="control-btn" 
                style={{ position: 'absolute', right: '1.5rem', top: '1.5rem' }}
                onClick={() => setIsPaymentModalOpen(false)}
            >
                <X size={24} color="var(--text-zinc-500)" />
            </button>
            
            <h2 className="payment-title">Payment System</h2>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ color: 'var(--text-zinc-500)', fontSize: '0.875rem' }}>Total Amount to Pay</div>
                <div style={{ color: 'white', fontSize: '3rem', fontWeight: '900' }}>€{total.toFixed(2)}</div>
            </div>

            <div className="payment-grid">
                <div 
                    className={`payment-option ${paymentMethod === 'card' ? 'payment-option-selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                >
                    <CreditCard size={32} color={paymentMethod === 'card' ? 'var(--emerald-500)' : 'white'} />
                    <span>Card / Tap</span>
                </div>
                <div 
                    className={`payment-option ${paymentMethod === 'cash' ? 'payment-option-selected' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                >
                    <Package size={32} color={paymentMethod === 'cash' ? 'var(--emerald-500)' : 'white'} />
                    <span>Cash</span>
                </div>
            </div>

            <button className="checkout-btn-totem" onClick={handleCheckout}>
                PAY NOW €{total.toFixed(2)}
            </button>
            
            <p style={{ color: 'var(--text-zinc-600)', fontSize: '0.7rem', textAlign: 'center', marginTop: '1.5rem' }}>
                Secure transaction processed via Eire-ERP Payment Gateway.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
