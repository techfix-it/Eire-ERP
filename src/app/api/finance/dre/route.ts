import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // In a real scenario, this would calculate based on invoices/transactions
    // For now, mirroring the original mocked DRE
    return NextResponse.json({
      grossRevenue: 85000,
      taxes: 12000,
      netRevenue: 73000,
      cogs: 28000,
      grossProfit: 45000,
      operatingExpenses: 18000,
      ebitda: 27000,
      netProfit: 21600
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
