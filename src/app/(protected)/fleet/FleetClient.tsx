'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Card from '@/components/Card/Card';
import '@/modules/Fleet/Fleet.css';

interface FleetClientProps {
  initialVehicles: any[];
  initialTasks: any[];
  initialMessages: any[];
}

export default function FleetClient({ initialVehicles, initialTasks, initialMessages }: FleetClientProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [tasks, setTasks] = useState(initialTasks);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const fetchData = async () => {
    const headers = { 'Authorization': localStorage.getItem('userId') || '' };
    try {
      const [vRes, tRes, mRes] = await Promise.all([
        fetch('/api/fleet', { headers }),
        fetch('/api/tasks', { headers }),
        fetch('/api/messages', { headers })
      ]);
      if (vRes.ok) setVehicles(await vRes.json());
      if (tRes.ok) setTasks(await tRes.json());
      if (mRes.ok) setMessages(await mRes.json());
    } catch (e) {
      console.error('Fleet sync error:', e);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimize = async () => {
    if (!activeVehicle) return;
    setIsOptimizing(true);
    try {
      const optimizedIds = tasks.map((t: any) => t.id).reverse();
      await fetch('/api/tasks/optimize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('userId') || ''
        },
        body: JSON.stringify({ vehicleId: activeVehicle.id, taskIds: optimizedIds })
      });
      fetchData();
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
    fetchData();
  };

  return (
    <div className="fleet-container">
      <div className="fleet-sidebar">
        <Card title="Fleet Status">
          <div className="item-list">
            {vehicles.map((v: any) => (
              <div 
                key={v.id} 
                onClick={() => setActiveVehicle(v)}
                className={`vehicle-card ${activeVehicle?.id === v.id ? 'vehicle-card-active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.25rem' }}>
                  <span className="item-main-text">{v.name}</span>
                  <span className="permission-badge" style={{ backgroundColor: v.status === 'available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: v.status === 'available' ? 'var(--emerald-500)' : 'var(--amber-500)' }}>
                    {v.status}
                  </span>
                </div>
                <div className="item-sub-text">{v.plate}</div>
              </div>
            ))}
          </div>
        </Card>

        {activeVehicle && (
          <Card title={`Chat with ${activeVehicle.name}`}>
            <div className="chat-container" style={{ height: '200px' }}>
              <div className="chat-messages" style={{ fontSize: '0.75rem' }}>
                {messages.filter((m: any) => m.sender_id === activeVehicle.driver_id || m.receiver_id === activeVehicle.driver_id).map((m: any, i: number) => (
                  <div key={i} className={`message-bubble ${m.sender_id === Number(localStorage.getItem('userId')) ? 'message-sent' : 'message-received'}`}>
                    {m.content}
                  </div>
                ))}
              </div>
              <div className="chat-input-area" style={{ padding: '0.5rem' }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="chat-input"
                  placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} className="chat-send-button">
                  <Plus style={{ width: '1rem', height: '1rem', transform: 'rotate(45deg)', transition: 'transform 0.2s' }} />
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="fleet-main">
        <div className="form-grid-2">
          <Card title="Logistics Map">
            <div className="map-placeholder">
              <svg className="map-bg-svg" viewBox="0 0 100 100">
                <path d="M10,20 L30,40 L50,30 L70,50 L90,40" stroke="white" fill="none" strokeWidth="0.5" />
                <path d="M20,10 L40,30 L30,50 L50,70 L40,90" stroke="white" fill="none" strokeWidth="0.5" />
              </svg>

              {vehicles.map((v: any) => (
                <motion.div 
                  key={v.id}
                  animate={{ x: (v.lng + 6.3) * 500, y: (53.4 - v.lat) * 500 }}
                  className="vehicle-pin"
                >
                  <Truck className="vehicle-icon" />
                  <div className="pin-tooltip">{v.name}</div>
                </motion.div>
              ))}

              {tasks.map((t: any) => (
                <div 
                  key={t.id}
                  style={{ left: `${(t.lng + 6.3) * 500}px`, top: `${(53.4 - t.lat) * 500}px` }}
                  className="task-pin"
                >
                  <div className="task-pin-tooltip">{t.description}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Optimization" action={
            <button onClick={handleOptimize} disabled={isOptimizing || !activeVehicle} className="btn-optimize">
              {isOptimizing ? "Optimizing..." : "Optimize Route"}
            </button>
          }>
            <div className="tasks-list">
              {tasks.map((t: any, i: number) => (
                <div key={t.id} className="task-item">
                  <div className="task-index">{i + 1}</div>
                  <div className="task-details">
                    <div className="task-desc">{t.description}</div>
                    <div className="task-meta">{t.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
