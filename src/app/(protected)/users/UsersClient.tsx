'use client';

import React, { useState } from 'react';
import Card from '@/components/Card/Card';
import { Plus, User, Shield, Trash2, Edit } from 'lucide-react';
import '@/modules/UsersManagement/UsersManagement.css';

interface UsersClientProps {
  initialUsers: any[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user', permissions: ['dashboard'] });

  const fetchUsers = async () => {
    const res = await fetch('/api/users', { headers: { 'Authorization': localStorage.getItem('userId') || '' } });
    if (res.ok) setUsers(await res.json());
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('userId') || '' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowModal(false);
      setFormData({ username: '', password: '', role: 'user', permissions: ['dashboard'] });
      fetchUsers();
    }
  };

  return (
    <div className="users-container">
      <Card title="Users Management" action={
        <button onClick={() => setShowModal(true)} className="add-button">
          <Plus className="w-4 h-4 mr-1" /> Add User
        </button>
      }>
        <div className="users-list">
          {users.map((u: any) => (
            <div key={u.id} className="user-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-zinc-800)', borderRadius: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--bg-zinc-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User className="text-zinc-500 w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">{u.username}</div>
                  <div className="text-xs text-zinc-500 uppercase flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {u.role}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="action-button"><Edit className="w-4 h-4" /></button>
                <button className="action-button-delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '24rem' }}>
            <div className="modal-header">
              <h3 className="modal-title">New User</h3>
              <button onClick={() => setShowModal(false)}>X</button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <input placeholder="Username" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="form-input-large" />
              <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="form-input-large" />
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="form-input-large">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="button-save">Create User</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
