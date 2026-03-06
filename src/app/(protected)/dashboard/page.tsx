import db from '@/lib/db';
import Card from '@/components/Card/Card';
import '@/modules/Dashboard/Dashboard.css';

export default async function DashboardPage() {
  // Direct DB access because this is a Server Component
  const invoices = db.prepare("SELECT SUM(total_amount) as total FROM invoices WHERE status = 'paid'").get() as any;
  const contracts = db.prepare("SELECT COUNT(*) as count FROM contracts WHERE status = 'active'").get() as any;
  const stockAlerts = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10").get() as any;
  const transactions = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE type = 'in'").get() as any;

  const stats = {
    revenue: (invoices?.total || 0) + (transactions?.total || 0),
    activeContracts: contracts?.count || 0,
    stockAlerts: stockAlerts?.count || 0
  };

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
