import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, total } = await request.json();
    
    // 1. Create Invoice for the sale
    // 2. Update stock for products
    
    const transaction = db.transaction((cartItems: any[], totalAmt: number) => {
      // Create invoice
      db.prepare(`
        INSERT INTO invoices (customer_name, issue_date, total_amount, status) 
        VALUES (?, CURRENT_TIMESTAMP, ?, ?)
      `).run('POS Customer', totalAmt, 'paid');

      // Update stock
      const updateStock = db.prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?");
      cartItems.forEach(item => {
        updateStock.run(item.quantity, item.id);
      });
    });

    transaction(items, total);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POS Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 400 });
  }
}
