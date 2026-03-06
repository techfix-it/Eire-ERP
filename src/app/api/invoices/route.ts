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

    const invoices = db.prepare("SELECT * FROM invoices ORDER BY issue_date DESC").all();
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customer_name, customer_email, total_amount, vat_amount, status } = await request.json();
    
    const result = db.prepare(`
        INSERT INTO invoices (customer_name, customer_email, total_amount, vat_amount, status) 
        VALUES (?, ?, ?, ?, ?)
    `).run(customer_name, customer_email, total_amount, vat_amount, status || 'pending');
    
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 400 });
  }
}
