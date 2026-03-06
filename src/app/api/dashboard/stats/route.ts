import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = db.prepare("SELECT SUM(total_amount) as total FROM invoices WHERE status = 'paid'").get() as any;
    const contracts = db.prepare("SELECT COUNT(*) as count FROM contracts WHERE status = 'active'").get() as any;
    const stockAlerts = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10").get() as any;
    const transactions = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE type = 'in'").get() as any;

    return NextResponse.json({
      revenue: (invoices?.total || 0) + (transactions?.total || 0),
      activeContracts: contracts?.count || 0,
      stockAlerts: stockAlerts?.count || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
