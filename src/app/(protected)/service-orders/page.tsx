import { createClient } from '@/utils/supabase/server';
import Card from '@/components/Card/Card';
import { Plus } from 'lucide-react';
import '@/modules/ServiceOrders/ServiceOrders.css';

export default async function ServiceOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('service_orders')
    .select('*')
    .order('created_at', { ascending: false });

  const typedOrders = orders || [];

  return (
    <div className="module-container">
      <Card 
        title="Service Orders (OS)" 
        action={
          <button className="sidebar-logo-icon-wrapper" style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.875rem', cursor: 'pointer', border: 'none', backgroundColor: 'var(--emerald-600)' }}>
            <Plus className="w-4 h-4" /> New Order
          </button>
        }
      >
        <div className="item-sub-text" style={{ marginBottom: '1.5rem' }}>Track maintenance and repair orders across Ireland.</div>
        <div className="item-list">
          {typedOrders.length === 0 ? (
            <div className="item-sub-text">No service orders found.</div>
          ) : (
            typedOrders.map(order => (
              <div key={order.id} className="service-order-card" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(39, 39, 42, 0.5)', borderRadius: '0.5rem', border: '1px solid var(--border-zinc-800)' }}>
                <div className="service-order-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="service-order-title" style={{ color: 'white', fontWeight: '600' }}>OS-{order.id}: {order.customer_name}</span>
                  <span className="service-order-status" style={{ color: order.status === 'open' ? 'var(--emerald-500)' : 'var(--text-zinc-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{order.status}</span>
                </div>
                <div className="service-order-footer" style={{ fontSize: '0.75rem', color: 'var(--text-zinc-500)' }}>
                  Description: {order.description} | Date: {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
