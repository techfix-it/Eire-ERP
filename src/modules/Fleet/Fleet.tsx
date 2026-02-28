import React, { useState, useEffect } from 'react';
import { Truck, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Card from '../../components/Card/Card';
import './Fleet.css';

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
      // Mock optimize logic since it was missing in api
      await new Promise(resolve => setTimeout(resolve, 1000));
      const optimizedIds = tasks.map(t => t.id).reverse(); // dummy optimization
      
      
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
    fetchData();
  };

  return (
    <div className="fleet-container">
      {/* Fleet List */}
      <div className="fleet-sidebar">
        <Card title="Fleet Status">
          <div className="item-list">
            {vehicles.map(v => (
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
                {messages.map((m, i) => (
                  <div key={i} className={`message-bubble ${m.sender_id === 1 ? 'message-sent' : 'message-received'}`}>
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
                  style={{ fontSize: '0.75rem' }}
                  placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} className="chat-send-button" style={{ padding: '0.25rem' }}>
                  <Plus style={{ width: '1rem', height: '1rem', transform: 'rotate(45deg)' }} />
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Map & Routing */}
      <div className="fleet-main">
        <div className="form-grid-2">
          <Card title="Real-time Logistics Map">
            <div className="map-placeholder">
              {/* Mock Map Background */}
              <svg className="map-bg-svg" viewBox="0 0 100 100">
                <path d="M10,20 L30,40 L50,30 L70,50 L90,40" stroke="white" fill="none" strokeWidth="0.5" />
                <path d="M20,10 L40,30 L30,50 L50,70 L40,90" stroke="white" fill="none" strokeWidth="0.5" />
              </svg>

              {/* Vehicles */}
              {vehicles.map(v => (
                <motion.div 
                  key={v.id}
                  animate={{ x: (v.lng + 6.3) * 500, y: (53.4 - v.lat) * 500 }}
                  className="vehicle-pin"
                >
                  <Truck className="vehicle-icon" />
                  <div className="pin-tooltip">{v.name}</div>
                </motion.div>
              ))}

              {/* Tasks */}
              {tasks.map(t => (
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

          <Card 
            title="Pending Tasks & Optimization"
            action={
              <button 
                onClick={handleOptimize} 
                disabled={isOptimizing || !activeVehicle}
                className="btn-optimize"
                style={{ opacity: (isOptimizing || !activeVehicle) ? 0.5 : 1 }}
              >
                {isOptimizing ? "Optimizing..." : "Optimize Route"}
              </button>
            }
          >
            <div className="tasks-list">
              {tasks.map((t, i) => (
                <div key={t.id} className="task-item">
                  <div className="task-index">{i + 1}</div>
                  <div className="task-details">
                    <div className="task-desc">{t.description}</div>
                    <div className="task-meta">{t.address} • {t.duration}m</div>
                  </div>
                  <div className={`task-badge ${t.type === 'delivery' ? 'task-badge-delivery' : t.type === 'visit' ? 'task-badge-visit' : 'task-badge-default'}`}>
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

export default Fleet;
