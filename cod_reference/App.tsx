/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Truck, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  ChevronUp,
  ChevronDown,
  ClipboardList,
  FileSignature,
  UserCircle,
  Menu,
  X,
  TrendingUp,
  Wallet,
  Download,
  Edit,
  Trash2,
  Image as ImageIcon,
  Tag,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface User {
  id: number;
  username: string;
  role: string;
  permissions: string[];
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1",
      active ? "bg-emerald-600 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
      disabled && "opacity-30 cursor-not-allowed"
    )}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

const Card = ({ children, title, action }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
    <div className="px-6 py-4 border-bottom border-zinc-800 flex justify-between items-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// --- Modules ---

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div className="text-zinc-500">Loading dashboard...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Revenue (MTD)">
        <div className="text-3xl font-bold text-emerald-500">€{stats.revenue.toLocaleString()}</div>
        <p className="text-zinc-500 text-sm mt-1">Total from Invoices & Transactions</p>
      </Card>
      <Card title="Active Contracts">
        <div className="text-3xl font-bold text-white">{stats.activeContracts}</div>
        <p className="text-zinc-500 text-sm mt-1">Managed service agreements</p>
      </Card>
      <Card title="Stock Alerts">
        <div className="text-3xl font-bold text-amber-500">{stats.stockAlerts}</div>
        <p className="text-zinc-500 text-sm mt-1">Items below threshold</p>
      </Card>
    </div>
  );
};

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
    <div className="space-y-6">
      <div className="flex gap-2 mb-2">
        {(['products', 'brands', 'attributes'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
              view === v ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search by name, SKU or attributes..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <select 
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none transition-all"
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
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-emerald-500 transition-all"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Product
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                    <th className="pb-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>
                      <div className="flex items-center">Product <SortArrow column="name" /></div>
                    </th>
                    <th className="pb-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('brand')}>
                      <div className="flex items-center">Brand <SortArrow column="brand" /></div>
                    </th>
                    <th className="pb-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('category')}>
                      <div className="flex items-center">Category <SortArrow column="category" /></div>
                    </th>
                    <th className="pb-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('stock_quantity')}>
                      <div className="flex items-center">Stock <SortArrow column="stock_quantity" /></div>
                    </th>
                    <th className="pb-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('price')}>
                      <div className="flex items-center">Price <SortArrow column="price" /></div>
                    </th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredAndSortedProducts.map((p: any) => (
                    <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 group">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-zinc-800 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{p.name}</div>
                            <div className="text-[10px] text-zinc-500 font-mono uppercase">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[10px] font-bold uppercase border border-zinc-700">
                          {p.brand}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-zinc-400 text-xs">{p.category}</span>
                        <div className="text-[10px] text-zinc-600 uppercase">{p.condition}</div>
                      </td>
                      <td className="py-4">
                        <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", p.stock_quantity < 10 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td className="py-4 text-white font-bold">€{p.price.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all">
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
            <button onClick={() => setShowBrandModal(true)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Brand
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brands.map(b => (
              <div key={b.id} className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-xl flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-zinc-800 rounded mr-3 flex items-center justify-center overflow-hidden">
                    {b.image_url ? <img src={b.image_url} alt={b.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" /> : <div className="text-[10px] text-zinc-600">LOGO</div>}
                  </div>
                  <div>
                    <div className="text-white font-bold">{b.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Brand ID: {b.id}</div>
                  </div>
                </div>
                <button onClick={() => handleDeleteBrand(b.id)} className="text-zinc-500 hover:text-red-500 p-2">
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
            <button onClick={() => setShowAttributeModal(true)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Attribute
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributeDefs.map(a => (
              <div key={a.id} className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">{a.label}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Key: {a.name}</div>
                </div>
                <button onClick={() => handleDeleteAttribute(a.id)} className="text-zinc-500 hover:text-red-500 p-2">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
                <h3 className="text-xl font-bold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">SKU / Code</label>
                    <input 
                      required
                      type="text" 
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Brand</label>
                    <select 
                      required
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Condition</label>
                    <div className="flex gap-4">
                      {['new', 'used'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData({...formData, condition: c})}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-sm font-bold uppercase transition-all border",
                            formData.condition === c ? "bg-emerald-600 border-emerald-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Price (€)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Stock Quantity</label>
                    <input 
                      required
                      type="number" 
                      value={formData.stock_quantity}
                      onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">VAT Rate (%)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.vat_rate}
                      onChange={e => setFormData({...formData, vat_rate: parseFloat(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">Technical Attributes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attributeDefs.map(attr => (
                      <div key={attr.id} className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{attr.label}</label>
                        <input 
                          type="text"
                          value={formData.attributes[attr.name] || ''}
                          onChange={e => setFormData({
                            ...formData, 
                            attributes: { ...formData.attributes, [attr.name]: e.target.value }
                          })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none transition-all"
                          placeholder={`Enter ${attr.label.toLowerCase()}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all h-24 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Image URLs (one per line)</label>
                  <textarea 
                    value={formData.images.join('\n')}
                    onChange={e => setFormData({...formData, images: e.target.value.split('\n').filter(url => url.trim())})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-all h-24 resize-none font-mono text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-800 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brand Modal */}
      <AnimatePresence>
        {showBrandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add Brand</h3>
                <button onClick={() => setShowBrandModal(false)} className="text-zinc-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddBrand} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Brand Name</label>
                  <input required type="text" value={brandFormData.name} onChange={e => setBrandFormData({...brandFormData, name: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Logo URL</label>
                  <input type="text" value={brandFormData.image_url} onChange={e => setBrandFormData({...brandFormData, image_url: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                  <textarea value={brandFormData.description} onChange={e => setBrandFormData({...brandFormData, description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none h-20 resize-none" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all">Save Brand</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attribute Modal */}
      <AnimatePresence>
        {showAttributeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add Attribute Definition</h3>
                <button onClick={() => setShowAttributeModal(false)} className="text-zinc-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddAttribute} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Attribute Label</label>
                  <input required type="text" value={attrFormData.label} onChange={e => setAttrFormData({...attrFormData, label: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none" placeholder="e.g. Screen Size" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                  <select value={attrFormData.type} onChange={e => setAttrFormData({...attrFormData, type: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all">Save Attribute</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Invoices = () => (
  <Card title="Invoices" action={<button className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><Plus className="w-4 h-4 mr-1" /> New Invoice</button>}>
    <div className="text-zinc-500 italic">Invoice module compliant with Irish Revenue standards.</div>
    <div className="mt-4 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div>
            <div className="text-white font-medium">INV-2024-00{i}</div>
            <div className="text-xs text-zinc-500">Customer: Tech Solutions Ltd</div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">€450.00</div>
            <div className="text-xs text-emerald-500">Paid</div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const Shipping = () => (
  <div className="space-y-6">
    <Card title="Freight Quotation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Origin (Eircode/City)</label>
          <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white" placeholder="Dublin D01" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Destination (Eircode/City)</label>
          <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white" placeholder="Cork T12" />
        </div>
      </div>
      <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-500 transition-colors">Get Quote</button>
    </Card>
    <Card title="Recent Shipments">
       <div className="text-zinc-500 text-sm">No active shipments.</div>
    </Card>
  </div>
);

const POS = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full lg:h-[calc(100vh-200px)]">
    <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-y-auto">
      <div className="flex items-center bg-zinc-800 rounded-lg px-4 py-2 mb-6">
        <Search className="w-5 h-5 text-zinc-500 mr-2" />
        <input type="text" placeholder="Search products or scan barcode..." className="bg-transparent border-none outline-none text-white w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl hover:border-emerald-500 cursor-pointer transition-all">
            <div className="w-full aspect-square bg-zinc-700 rounded-lg mb-3"></div>
            <div className="text-white font-medium">Product {i}</div>
            <div className="text-emerald-500 font-bold">€19.99</div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
      <h3 className="text-white font-bold mb-4 flex items-center"><ShoppingCart className="w-5 h-5 mr-2" /> Current Sale</h3>
      <div className="flex-1 space-y-4 overflow-y-auto min-h-[200px]">
        <div className="text-zinc-500 text-center py-10">Cart is empty</div>
      </div>
      <div className="border-t border-zinc-800 pt-4 mt-4">
        <div className="flex justify-between text-zinc-400 mb-2">
          <span>Subtotal</span>
          <span>€0.00</span>
        </div>
        <div className="flex justify-between text-zinc-400 mb-4">
          <span>VAT (23%)</span>
          <span>€0.00</span>
        </div>
        <div className="flex justify-between text-white text-xl font-bold mb-6">
          <span>Total</span>
          <span>€0.00</span>
        </div>
        <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-500 transition-colors">Pay Now</button>
      </div>
    </div>
  </div>
);

const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/users', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <Card title="User Management & RBAC" action={<button className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><Plus className="w-4 h-4 mr-1" /> Create User</button>}>
      <div className="space-y-4">
        {users.map((u: any) => (
          <div key={u.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mr-4">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-medium">{u.username}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">{u.role}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {u.permissions.map((p: string) => (
                <span key={p} className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded uppercase">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const Fleet = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const fetchData = async () => {
    const headers = { 'Authorization': localStorage.getItem('userId') || '' };
    const [vRes, tRes, mRes] = await Promise.all([
      fetch('/api/fleet', { headers }),
      fetch('/api/tasks', { headers }),
      fetch('/api/messages', { headers })
    ]);
    setVehicles(await vRes.json());
    setTasks(await tRes.json());
    setMessages(await mRes.json());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimize = async () => {
    if (!activeVehicle) {
      alert("Please select a vehicle first.");
      return;
    }
    setIsOptimizing(true);
    try {
      // Import the service dynamically or use it if available
      const { optimizeRoute } = await import('./services/api');
      const optimizedIds = await optimizeRoute(tasks);
      
      await fetch('/api/tasks/optimize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('userId') || ''
        },
        body: JSON.stringify({ vehicleId: activeVehicle.id, taskIds: optimizedIds })
      });
      await fetchData();
      alert("Route optimized successfully!");
    } catch (e) {
      console.error(e);
      alert("Optimization failed.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage || !activeVehicle) return;
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userId') || ''
      },
      body: JSON.stringify({ receiver_id: activeVehicle.driver_id || 1, content: newMessage })
    });
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
      {/* Fleet List */}
      <div className="xl:col-span-1 space-y-4">
        <Card title="Fleet Status">
          <div className="space-y-3">
            {vehicles.map(v => (
              <div 
                key={v.id} 
                onClick={() => setActiveVehicle(v)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  activeVehicle?.id === v.id ? "bg-emerald-600/20 border-emerald-500" : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-medium">{v.name}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase", v.status === 'available' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                    {v.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">{v.plate}</div>
              </div>
            ))}
          </div>
        </Card>

        {activeVehicle && (
          <Card title={`Chat with ${activeVehicle.name}`}>
            <div className="h-48 overflow-y-auto mb-4 space-y-2 text-xs">
              {messages.map((m, i) => (
                <div key={i} className={cn("p-2 rounded-lg max-w-[80%]", m.sender_id === 1 ? "bg-emerald-600 text-white ml-auto" : "bg-zinc-800 text-zinc-300")}>
                  {m.content}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage} className="bg-emerald-600 text-white p-2 rounded-lg"><Plus className="w-4 h-4 rotate-45" /></button>
            </div>
          </Card>
        )}
      </div>

      {/* Map & Routing */}
      <div className="xl:col-span-3 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Real-time Logistics Map">
            <div className="aspect-video bg-zinc-950 rounded-xl relative overflow-hidden border border-zinc-800">
              {/* Mock Map Background (Dublin area) */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
                <path d="M10,20 L30,40 L50,30 L70,50 L90,40" stroke="white" fill="none" strokeWidth="0.5" />
                <path d="M20,10 L40,30 L30,50 L50,70 L40,90" stroke="white" fill="none" strokeWidth="0.5" />
              </svg>
              
              {/* Vehicles */}
              {vehicles.map(v => (
                <motion.div 
                  key={v.id}
                  animate={{ x: (v.lng + 6.3) * 500, y: (53.4 - v.lat) * 500 }}
                  className="absolute w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 flex items-center justify-center"
                >
                  <Truck className="w-2 h-2 text-white" />
                  <div className="absolute top-full mt-1 bg-black/80 text-[8px] px-1 rounded whitespace-nowrap text-white">{v.name}</div>
                </motion.div>
              ))}

              {/* Tasks */}
              {tasks.map(t => (
                <div 
                  key={t.id}
                  style={{ left: `${(t.lng + 6.3) * 500}px`, top: `${(53.4 - t.lat) * 500}px` }}
                  className="absolute w-3 h-3 bg-zinc-500 rounded-full flex items-center justify-center border border-white/20"
                >
                  <div className="absolute top-full mt-1 bg-black/80 text-[8px] px-1 rounded whitespace-nowrap text-zinc-400">{t.description}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card 
            title="Pending Tasks & Optimization" 
            action={
              <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50"
              >
                {isOptimizing ? "Optimizing..." : "Optimize Route"}
              </button>
            }
          >
            <div className="space-y-3">
              {tasks.map((t, i) => (
                <div key={t.id} className="flex items-center p-3 bg-zinc-800/30 border border-zinc-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold mr-3">{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">{t.description}</div>
                    <div className="text-[10px] text-zinc-500">{t.address} • {t.duration}m</div>
                  </div>
                  <div className={cn("text-[10px] px-2 py-0.5 rounded uppercase", t.type === 'delivery' ? "bg-blue-500/10 text-blue-500" : t.type === 'visit' ? "bg-purple-500/10 text-purple-500" : "bg-amber-500/10 text-amber-500")}>
                    {t.type}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CashFlow = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [view, setView] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    fetch('/api/transactions', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setTransactions);
  }, []);

  const chartData = [
    { name: 'Jan', in: 4000, out: 2400 },
    { name: 'Feb', in: 3000, out: 1398 },
    { name: 'Mar', in: 2000, out: 9800 },
    { name: 'Apr', in: 2780, out: 3908 },
    { name: 'May', in: 1890, out: 4800 },
    { name: 'Jun', in: 2390, out: 3800 },
  ];

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "cash_flow_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIn = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIn - totalOut;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Cash In">
          <div className="text-3xl font-bold text-emerald-500">€{totalIn.toLocaleString()}</div>
        </Card>
        <Card title="Cash Out">
          <div className="text-3xl font-bold text-red-500">€{totalOut.toLocaleString()}</div>
        </Card>
        <Card title="Closing Balance">
          <div className={cn("text-3xl font-bold", balance >= 0 ? "text-emerald-500" : "text-red-500")}>
            €{balance.toLocaleString()}
          </div>
        </Card>
      </div>

      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setView('chart')}
          className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", view === 'chart' ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400")}
        >
          Charts
        </button>
        <button 
          onClick={() => setView('table')}
          className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", view === 'table' ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400")}
        >
          Transactions Table
        </button>
      </div>

      {view === 'chart' ? (
        <Card title="Monthly Cash Flow">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="in" fill="#10b981" name="Cash In" radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" fill="#ef4444" name="Cash Out" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card 
          title="Transaction History" 
          action={
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-sm transition-all">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((t: any) => (
                  <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="py-4 text-zinc-400">{t.date}</td>
                    <td className="py-4 text-white font-medium">{t.description}</td>
                    <td className="py-4 text-zinc-500">{t.category}</td>
                    <td className="py-4">
                      <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", t.type === 'in' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                        {t.type === 'in' ? 'Cash In' : 'Cash Out'}
                      </span>
                    </td>
                    <td className={cn("py-4 text-right font-bold", t.type === 'in' ? "text-emerald-500" : "text-red-500")}>
                      {t.type === 'in' ? '+' : '-'}€{t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

const Profitability = () => {
  const [dre, setDre] = useState<any>(null);

  useEffect(() => {
    fetch('/api/finance/dre', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setDre);
  }, []);

  if (!dre) return <div className="text-zinc-500">Loading DRE data...</div>;

  const rows = [
    { label: 'Gross Revenue (incl. VAT)', key: 'grossRevenue', prefix: '' },
    { label: '(-) Taxes (VAT 23%)', key: 'vat', prefix: '-' },
    { label: '(=) Net Revenue', key: 'revenueNet', prefix: '', highlight: true },
    { label: '(-) Direct Costs (COGS)', key: 'cogs', prefix: '-' },
    { label: '(-) Freight', key: 'freight', prefix: '-' },
    { label: '(=) GROSS PROFIT', key: 'grossProfit', prefix: '', highlight: true },
    { label: '(-) Income Tax/USC/PRSI (2026 Est.)', key: 'taxEst', prefix: '-' },
    { label: '(=) NET PROFIT', key: 'netProfit', prefix: '', highlight: true, final: true },
  ];

  return (
    <div className="space-y-6">
      <Card title="Profitability Breakdown (DRE - Irish Tax 2026)">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                <th className="pb-4">Item</th>
                <th className="pb-4 text-right">Products (Hardware - 12.5% CT)</th>
                <th className="pb-4 text-right">Services (Software - Progressive)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.map((row, i) => (
                <tr 
                  key={i} 
                  className={cn(
                    "border-b border-zinc-800/50",
                    row.highlight && "bg-zinc-800/30 font-bold",
                    row.final && "text-emerald-500 text-lg"
                  )}
                >
                  <td className="py-4 text-zinc-300">{row.label}</td>
                  <td className="py-4 text-right">
                    {row.prefix}€{dre.hardware[row.key].toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    {row.prefix}€{dre.software[row.key].toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-6 text-zinc-500 font-medium">Profit Margin</td>
                <td className="py-6 text-right text-white font-bold">
                  {((dre.hardware.netProfit / dre.hardware.grossRevenue) * 100).toFixed(1)}%
                </td>
                <td className="py-6 text-right text-white font-bold">
                  {((dre.software.netProfit / dre.software.grossRevenue) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Profit Distribution">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Hardware', profit: dre.hardware.netProfit },
                { name: 'Software', profit: dre.software.netProfit }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#8b5cf6" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Refresh permissions from server to ensure they are up to date
      fetch('/api/me', {
        headers: { 'Authorization': parsedUser.id.toString() }
      }).then(res => res.json()).then(data => {
        if (data.id) {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      }).catch(console.error);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('userId', data.id.toString());
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again.');
      console.error('Login fetch error:', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'pos', label: 'POS System', icon: ShoppingCart },
    { id: 'service_orders', label: 'Service Orders', icon: ClipboardList },
    { id: 'contracts', label: 'Contracts', icon: FileSignature },
    { id: 'fleet', label: 'Fleet & Logistics', icon: Truck },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'cash_flow', label: 'Cash Flow', icon: Wallet },
    { id: 'profitability', label: 'Profitability (DRE)', icon: TrendingUp },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'users', label: 'Users & RBAC', icon: Users, adminOnly: true },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Techfix-IT ERP</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-2 text-zinc-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 mt-4">
        {menuItems.map(item => (
          (!item.adminOnly || user?.role === 'admin') && (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              disabled={!user?.permissions.includes(item.id)}
            />
          )
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mr-3">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-zinc-500 truncate uppercase">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-600/20">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Techfix-IT ERP</h1>
            <p className="text-zinc-500 mt-2">Management System for Ireland</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-zinc-600">
            Demo credentials: admin / admin123
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-zinc-800 flex-col bg-zinc-950">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-zinc-950 z-50 lg:hidden flex flex-col border-r border-zinc-800 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/50 backdrop-blur-md z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-white capitalize truncate">{activeTab.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 w-32 md:w-64 transition-all"
              />
            </div>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-zinc-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'inventory' && <Inventory />}
              {activeTab === 'invoices' && <Invoices />}
              {activeTab === 'shipping' && <Shipping />}
              {activeTab === 'pos' && <POS />}
              {activeTab === 'users' && <UsersManagement />}
              {activeTab === 'fleet' && <Fleet />}
              {activeTab === 'cash_flow' && <CashFlow />}
              {activeTab === 'profitability' && <Profitability />}
              {activeTab === 'contracts' && (
                <div className="space-y-6">
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
                        className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> New Contract
                      </button>
                    }
                  >
                    <div className="text-zinc-500 text-sm mb-6">
                      Contracts are generated using Gemini AI to ensure compliance with the 
                      <span className="text-emerald-500 font-medium"> Consumer Rights Act 2022 (Ireland)</span>.
                    </div>
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium">Maintenance Agreement - Client {i}</div>
                            <div className="text-xs text-zinc-500">Status: Active | Law: Ireland</div>
                          </div>
                          <button className="text-emerald-500 text-sm hover:underline">View PDF</button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
              {activeTab === 'service_orders' && (
                <Card title="Service Orders (OS)" action={<button className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><Plus className="w-4 h-4 mr-1" /> New Order</button>}>
                  <div className="text-zinc-500 text-sm mb-6">Track maintenance and repair orders across Ireland.</div>
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 border-l-4 border-l-amber-500">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">OS-1024: Boiler Repair</span>
                        <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">In Progress</span>
                      </div>
                      <div className="text-xs text-zinc-500">Assigned to: John Doe | Location: Dublin 2</div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
