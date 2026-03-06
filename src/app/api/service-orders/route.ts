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

    const orders = db.prepare("SELECT * FROM service_orders ORDER BY created_at DESC").all();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customer_name, description, status } = await request.json();
    
    const result = db.prepare(`
        INSERT INTO service_orders (customer_name, description, status) 
        VALUES (?, ?, ?)
    `).run(customer_name, description, status || 'open');
    
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service order' }, { status: 400 });
  }
}
