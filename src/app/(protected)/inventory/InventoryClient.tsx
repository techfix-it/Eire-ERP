'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, ImageIcon, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Card from '@/components/Card/Card';
import '@/modules/Inventory/Inventory.css';

interface InventoryClientProps {
  initialProducts: any[];
  initialBrands: any[];
  initialAttributes: any[];
}

export default function InventoryClient({ initialProducts, initialBrands, initialAttributes }: InventoryClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [brands, setBrands] = useState(initialBrands);
  const [attributeDefs, setAttributeDefs] = useState(initialAttributes);
  const [view, setView] = useState<'products' | 'brands' | 'attributes'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [brandFormData, setBrandFormData] = useState({ name: '', image_url: '', description: '' });
  const [attrFormData, setAttrFormData] = useState({ name: '', label: '', type: 'text' });
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category: '',
    condition: 'new',
    description: '',
    price: 0,
    stock_quantity: 0,
    vat_rate: 23,
    attributes: {} as any,
    images: [] as string[]
  });

  const categories = [
    "Processors (CPU)", "Graphics Cards (GPU)", "Motherboards", "RAM Memory", 
    "Storage (SSD/HDD)", "Power Supplies", "Cases/Chassis", "Power Supply Units",
    "Power Cables", "Braided Power Supply Cables", "ARGB Power Supply Extension Cables",
    "Processor Cooling (Air/Water)", "LED Lighting", "Thermal Paste", "Extra Case Fans",
    "Fan Controllers", "Internal Sound Cards", "External Sound Cards", "Network Cards",
    "Wireless Network Cards", "Wireless Routers/HomePlugs", "USB/Thunderbolt Options",
    "Capture/Streaming Cards", "External Capture Cards", "Firewire", "Operating Systems",
    "Office & Productivity", "Antivirus & Security", "Design & Creative Tools",
    "Backup & Recovery", "Server Software", "Gaming PCs", "Office/Home PCs",
    "Workstations", "Laptops/Notebooks", "Upgrade Kits", "Custom PC Builder",
    "Keyboards", "Mice", "Headsets", "Mousepads", "Monitors", "Webcams", "Microphones",
    "PlayStation", "Xbox", "Nintendo", "Controllers and Accessories"
  ];

  const fetchProducts = async () => {
    const res = await fetch('/api/inventory', { headers: { 'Authorization': localStorage.getItem('userId') || '' } });
    if (res.ok) setProducts(await res.json());
  };

  const fetchBrands = async () => {
    const res = await fetch('/api/inventory/brands', { headers: { 'Authorization': localStorage.getItem('userId') || '' } });
    if (res.ok) setBrands(await res.json());
  };

  const fetchAttributes = async () => {
    const res = await fetch('/api/inventory/attributes', { headers: { 'Authorization': localStorage.getItem('userId') || '' } });
    if (res.ok) setAttributeDefs(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/inventory/${editingProduct.id}` : '/api/inventory';
    const method = editingProduct ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userId') || ''
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/inventory/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userId') || '' },
      body: JSON.stringify(brandFormData)
    });
    if (res.ok) {
      setShowBrandModal(false);
      setBrandFormData({ name: '', image_url: '', description: '' });
      fetchBrands();
    }
  };

  const handleAddAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = attrFormData.label.toLowerCase().replace(/\s+/g, '_');
    const res = await fetch('/api/inventory/attributes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userId') || '' },
      body: JSON.stringify({ ...attrFormData, name })
    });
    if (res.ok) {
      setShowAttributeModal(false);
      setAttrFormData({ name: '', label: '', type: 'text' });
      fetchAttributes();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', sku: '', brand: '', category: '', condition: 'new',
      description: '', price: 0, stock_quantity: 0, vat_rate: 23,
      attributes: {}, images: []
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.sku.toLowerCase().includes(term)
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, searchTerm, selectedBrand, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const SortArrow = ({ column }: { column: string }) => {
    if (!sortConfig || sortConfig.key !== column) return <ChevronDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-emerald-500" /> : <ChevronDown className="w-3 h-3 ml-1 text-emerald-500" />;
  };

  return (
    <div className="inventory-container">
      <div className="view-tabs">
        {(['products', 'brands', 'attributes'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`tab-button ${view === v ? 'tab-button-active' : 'tab-button-inactive'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'products' && (
        <div className="inventory-container">
          <div className="inventory-filters">
            <div className="search-wrapper">
              <Search className="search-input-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="inventory-search-input"
              />
            </div>
            <select 
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="brand-select"
            >
              <option value="">All Brands</option>
              {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>

          <Card title="Inventory" action={
            <button onClick={() => { resetForm(); setEditingProduct(null); setShowModal(true); }} className="add-button">
              <Plus className="add-button-icon" /> Add Product
            </button>
          }>
            <div className="table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('name')}>Product <SortArrow column="name" /></th>
                    <th onClick={() => requestSort('brand')}>Brand <SortArrow column="brand" /></th>
                    <th onClick={() => requestSort('stock_quantity')}>Stock <SortArrow column="stock_quantity" /></th>
                    <th onClick={() => requestSort('price')}>Price <SortArrow column="price" /></th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProducts.map((p: any) => (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-image-container">
                            {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="product-image" /> : <ImageIcon className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="product-name">{p.name}</div>
                            <div className="product-sku">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="brand-badge">{p.brand}</span></td>
                      <td><span className={p.stock_quantity < 10 ? 'stock-low' : 'stock-ok'}>{p.stock_quantity} units</span></td>
                      <td>€{p.price.toFixed(2)}</td>
                      <td className="actions-cell">
                        <button onClick={() => { setEditingProduct(p); setFormData({...p}); setShowModal(true); }} className="action-button"><Edit className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* CRUD Modal for Product */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={() => setShowModal(false)}><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label-small">Name</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input-large" />
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">SKU</label>
                    <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="form-input-large" />
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">Price</label>
                    <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="form-input-large" />
                  </div>
                </div>
                <div className="form-footer">
                   <button type="submit" className="button-save">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
