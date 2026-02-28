import React, { useState, useEffect } from 'react';
import { Plus, UserCircle, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Card from '../../components/Card/Card';
import './UsersManagement.css';

interface UsersManagementProps {
  currentUser?: any;
}

const ALL_PERMISSIONS = [
  'dashboard', 'inventory', 'pos', 'service_orders', 'contracts', 
  'fleet', 'shipping', 'cash_flow', 'profitability', 'invoices', 'users'
];

const UsersManagement: React.FC<UsersManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    permissions: ['dashboard'] as string[]
  });

  const fetchUsers = () => {
    fetch('/api/users', { headers: { 'Authorization': localStorage.getItem('userId') || '' } })
      .then(res => res.json())
      .then(setUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', role: 'user', permissions: ['dashboard'] });
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // blank intentionally
      role: user.role,
      permissions: user.permissions || ['dashboard']
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this user?")) return;
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': localStorage.getItem('userId') || '' }
    });
    if (res.ok) fetchUsers();
    else alert("Failed to delete user. You may not delete yourself.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
    const method = editingUser ? 'PUT' : 'POST';

    const reqData = { ...formData };
    if (editingUser && !reqData.password) delete (reqData as any).password;

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('userId') || ''
      },
      body: JSON.stringify(reqData)
    });

    if (res.ok) {
      setShowModal(false);
      fetchUsers();
    } else {
      const { error } = await res.json();
      alert(error || "Action failed");
    }
  };

  const togglePermission = (perm: string) => {
    setFormData(prev => {
      const current = prev.permissions;
      if (current.includes(perm)) {
        return { ...prev, permissions: current.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...current, perm] };
      }
    });
  };

  return (
    <div className="users-management-container">
      <Card 
        title="User Management & RBAC" 
        action={
          currentUser?.role === 'admin' ? (
            <button className="btn-create-user" onClick={openAddModal}>
              <Plus className="btn-create-icon" /> Create User
            </button>
          ) : null
        }
      >
        <div className="users-list">
          {users.map((u: any) => (
            <div key={u.id} className="user-card">
              <div className="user-info-group">
                <div className="user-avatar">
                  <UserCircle className="user-avatar-icon" />
                </div>
                <div>
                  <div className="user-name">{u.username}</div>
                  <div className="user-role">{u.role}</div>
                </div>
              </div>
              <div className="user-actions-row">
                <div className="user-permissions-group">
                  {u.permissions.map((p: string) => (
                    <span key={p} className="permission-badge">{p}</span>
                  ))}
                </div>
                {currentUser?.role === 'admin' && (
                  <div className="user-action-buttons">
                    <button onClick={() => openEditModal(u)} className="action-button">
                      <Edit className="w-4 h-4" />
                    </button>
                    {u.id !== currentUser.id && (
                      <button onClick={() => handleDelete(u.id)} className="action-button action-button-delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              style={{ maxWidth: '400px' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button type="button" onClick={() => setShowModal(false)} className="modal-close"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label-small">Username</label>
                  <input 
                    required
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="form-input-large"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label-small">
                    Password {editingUser && '(Leave blank to keep current)'}
                  </label>
                  <input 
                    required={!editingUser}
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="form-input-large"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label-small">Role / Department</label>
                  <input 
                    required
                    type="text" 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="form-input-large"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label-small" style={{ marginBottom: '8px', display: 'block' }}>Permissions assigned</label>
                  <div className="permissions-grid">
                    {ALL_PERMISSIONS.map(p => (
                      <label key={p} className="permission-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.permissions.includes(p)}
                          onChange={() => togglePermission(p)}
                        />
                        <span>{p.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="footer-button button-cancel">Cancel</button>
                  <button type="submit" className="footer-button button-save">{editingUser ? 'Update' : 'Save'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersManagement;
