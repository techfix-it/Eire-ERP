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

    const contracts = db.prepare("SELECT * FROM contracts ORDER BY start_date DESC").all();
    return NextResponse.json(contracts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customer_name, terms, start_date, end_date, status } = await request.json();
    
    const result = db.prepare(`
        INSERT INTO contracts (customer_name, terms, start_date, end_date, status) 
        VALUES (?, ?, ?, ?, ?)
    `).run(customer_name, terms, start_date, end_date, status || 'active');
    
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 400 });
  }
}
