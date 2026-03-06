import { createClient } from '@/utils/supabase/server';
import Card from '@/components/Card/Card';
import '@/modules/Dashboard/Dashboard.css';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch summaries in parallel
  const [
    { data: invoices },
    { data: contractsCount },
    { data: stockAlerts },
    { data: transactions }
  ] = await Promise.all([
    supabase.from('invoices').select('total_amount').eq('status', 'paid'),
    supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock_quantity', 10),
    supabase.from('transactions').select('amount').eq('type', 'in')
  ]);

  const revenue = (invoices?.reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0) || 0) +
                  (transactions?.reduce((acc, tran) => acc + (Number(tran.amount) || 0), 0) || 0);

  const stats = {
    revenue,
    activeContracts: contractsCount === null ? 0 : (contractsCount as any).count || 0,
    stockAlerts: stockAlerts === null ? 0 : (stockAlerts as any).count || 0
  };

  // If count: 'exact' and head: true, the return value should have count
  // But let's handle the specific return type of supabase count queries correctly
  // In newer supabase-js, count is returned directly in the response object
  
  return (
    <div className="dashboard-grid">
      <Card title="Revenue (MTD)">
        <div className="stat-value stat-value-emerald">€{stats.revenue.toLocaleString()}</div>
        <p className="stat-label">Total from Invoices & Transactions</p>
      </Card>
      <Card title="Active Contracts">
        <div className="stat-value stat-value-white">{stats.activeContracts}</div>
        <p className="stat-label">Managed service agreements</p>
      </Card>
      <Card title="Stock Alerts">
        <div className="stat-value stat-value-amber">{stats.stockAlerts}</div>
        <p className="stat-label">Items below threshold</p>
      </Card>
    </div>
  );
}
