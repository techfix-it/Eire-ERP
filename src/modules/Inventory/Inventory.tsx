import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, ImageIcon, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Card from '../../components/Card/Card';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [attributeDefs, setAttributeDefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/inventory', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  const fetchBrands = () => {
    fetch('/api/brands', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setBrands);
  };

  const fetchAttributes = () => {
    fetch('/api/attributes', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setAttributeDefs);
  };

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

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/brands', {
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

  const handleDeleteBrand = async (id: number) => {
    if (!confirm("Delete brand?")) return;
    const res = await fetch(`/api/brands/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': localStorage.getItem('userId') || '' }
    });
    if (res.ok) fetchBrands();
  };

  const handleAddAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = attrFormData.label.toLowerCase().replace(/\s+/g, '_');
    const res = await fetch('/api/attributes', {
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

  const handleDeleteAttribute = async (id: number) => {
    if (!confirm("Delete attribute definition?")) return;
    const res = await fetch(`/api/attributes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': localStorage.getItem('userId') || '' }
    });
    if (res.ok) fetchAttributes();
  };
  
  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchAttributes();
  }, []);

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
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      brand: '',
      category: '',
      condition: 'new',
      description: '',
      price: 0,
      stock_quantity: 0,
      vat_rate: 23,
      attributes: {},
      images: []
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      brand: product.brand || '',
      category: product.category || '',
      condition: product.condition || 'new',
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      vat_rate: product.vat_rate,
      attributes: product.attributes || {},
      images: product.images || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/inventory/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': localStorage.getItem('userId') || '' }
    });
    if (res.ok) fetchProducts();
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filtering
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => {
        const inName = p.name.toLowerCase().includes(term);
        const inSku = p.sku.toLowerCase().includes(term);
        const inAttributes = Object.values(p.attributes || {}).some(val => 
          String(val).toLowerCase().includes(term)
        );
        return inName || inSku || inAttributes;
      });
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested or special cases if needed
        if (sortConfig.key === 'name') {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, selectedBrand, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortArrow = ({ column }: { column: string }) => {
    if (!sortConfig || sortConfig.key !== column) return <ChevronDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-3 h-3 ml-1 text-emerald-500" /> : 
      <ChevronDown className="w-3 h-3 ml-1 text-emerald-500" />;
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
                placeholder="Search by name, SKU or attributes..." 
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

          <Card 
            title="Inventory Management" 
            action={
              <button 
                onClick={() => { resetForm(); setEditingProduct(null); setShowModal(true); }}
                className="add-button"
              >
                <Plus className="add-button-icon" /> Add Product
              </button>
            }
          >
            <div className="table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('name')}>
                      <div className="flex items-center">Product <SortArrow column="name" /></div>
                    </th>
                    <th onClick={() => requestSort('brand')}>
                      <div className="flex items-center">Brand <SortArrow column="brand" /></div>
                    </th>
                    <th onClick={() => requestSort('category')}>
                      <div className="flex items-center">Category <SortArrow column="category" /></div>
                    </th>
                    <th onClick={() => requestSort('stock_quantity')}>
                      <div className="flex items-center">Stock <SortArrow column="stock_quantity" /></div>
                    </th>
                    <th onClick={() => requestSort('price')}>
                      <div className="flex items-center">Price <SortArrow column="price" /></div>
                    </th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProducts.map((p: any) => (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-image-container">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="product-image" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon className="text-zinc-600" style={{ width: '1.25rem', height: '1.25rem' }} />
                            )}
                          </div>
                          <div>
                            <div className="product-name">{p.name}</div>
                            <div className="product-sku">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="brand-badge">
                          {p.brand}
                        </span>
                      </td>
                      <td>
                        <span className="category-text">{p.category}</span>
                        <div className="condition-text">{p.condition}</div>
                      </td>
                      <td>
                        <span className={`stock-badge ${p.stock_quantity < 10 ? 'stock-low' : 'stock-ok'}`}>
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td className="price-text">€{p.price.toFixed(2)}</td>
                      <td className="actions-cell">
                        <div className="actions-container">
                          <button onClick={() => handleEdit(p)} className="action-button">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="action-button action-button-delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {view === 'brands' && (
        <Card 
          title="Brand Management" 
          action={
            <button onClick={() => setShowBrandModal(true)} className="add-button">
              <Plus className="add-button-icon" /> Add Brand
            </button>
          }
        >
          <div className="grid-cards">
            {brands.map(b => (
              <div key={b.id} className="item-card">
                <div className="item-info">
                  <div className="item-icon-wrapper">
                    {b.image_url ? <img src={b.image_url} alt={b.name} className="item-logo" referrerPolicy="no-referrer" /> : <div className="item-logo-placeholder">LOGO</div>}
                  </div>
                  <div>
                    <div className="item-name">{b.name}</div>
                    <div className="item-id">Brand ID: {b.id}</div>
                  </div>
                </div>
                <button onClick={() => handleDeleteBrand(b.id)} className="action-button action-button-delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {view === 'attributes' && (
        <Card 
          title="Attribute Definitions" 
          action={
            <button onClick={() => setShowAttributeModal(true)} className="add-button">
              <Plus className="add-button-icon" /> Add Attribute
            </button>
          }
        >
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {attributeDefs.map(a => (
              <div key={a.id} className="item-card">
                <div>
                  <div className="item-name">{a.label}</div>
                  <div className="item-key">Key: {a.name}</div>
                </div>
                <button onClick={() => handleDeleteAttribute(a.id)} className="action-button action-button-delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* CRUD Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
            >
              <div className="modal-header">
                <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setShowModal(false)} className="modal-close"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label-small">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="form-input-large"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">SKU / Code</label>
                    <input 
                      required
                      type="text" 
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      className="form-input-large"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">Brand</label>
                    <select 
                      required
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="form-input-large"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="form-input-large"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">Condition</label>
                    <div className="condition-toggle">
                      {['new', 'used'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData({...formData, condition: c})}
                          className={`toggle-button ${formData.condition === c ? 'toggle-button-active' : 'toggle-button-inactive'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">Price (€)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="form-input-large"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-small">Stock Quantity</label>
                    <input 
                      required
                      type="number" 
                      value={formData.stock_quantity}
                      onChange={e => setFormData({...formData, stock_quantity: Number(e.target.value)})}
                      className="form-input-large"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label-small">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="textarea-input"
                  />
                </div>

                <div className="form-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="footer-button button-cancel">Cancel</button>
                  <button type="submit" className="footer-button button-save">Save Product</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brand Modal */}
      <AnimatePresence>
        {showBrandModal && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              style={{ maxWidth: '32rem' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Add New Brand</h3>
                <button onClick={() => setShowBrandModal(false)} className="modal-close"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddBrand} className="modal-form">
                <div className="form-group">
                  <label className="form-label-small">Brand Name</label>
                  <input 
                    required
                    type="text" 
                    value={brandFormData.name}
                    onChange={e => setBrandFormData({...brandFormData, name: e.target.value})}
                    className="form-input-large"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label-small">Logo URL</label>
                  <input 
                    type="text" 
                    value={brandFormData.image_url}
                    onChange={e => setBrandFormData({...brandFormData, image_url: e.target.value})}
                    className="form-input-large"
                  />
                </div>
                <div className="form-footer">
                  <button type="button" onClick={() => setShowBrandModal(false)} className="footer-button button-cancel">Cancel</button>
                  <button type="submit" className="footer-button button-save">Add Brand</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attribute Modal */}
      <AnimatePresence>
        {showAttributeModal && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              style={{ maxWidth: '32rem' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Add New Attribute</h3>
                <button onClick={() => setShowAttributeModal(false)} className="modal-close"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddAttribute} className="modal-form">
                <div className="form-group">
                  <label className="form-label-small">Label (Display Name)</label>
                  <input 
                    required
                    type="text" 
                    value={attrFormData.label}
                    onChange={e => setAttrFormData({...attrFormData, label: e.target.value})}
                    className="form-input-large"
                  />
                </div>
                <div className="form-footer">
                  <button type="button" onClick={() => setShowAttributeModal(false)} className="footer-button button-cancel">Cancel</button>
                  <button type="submit" className="footer-button button-save">Add Attribute</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
