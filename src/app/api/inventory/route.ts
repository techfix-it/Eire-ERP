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

    const products = db.prepare("SELECT * FROM products").all() as any[];
    return NextResponse.json(products.map(p => ({
      ...p,
      attributes: p.attributes ? JSON.parse(p.attributes) : {},
      images: p.images ? JSON.parse(p.images) : []
    })));
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, sku, brand, category, condition, description, attributes, images, price, stock_quantity, vat_rate } = await request.json();
    
    db.prepare(`
        INSERT INTO products (name, sku, brand, category, condition, description, attributes, images, price, stock_quantity, vat_rate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        name, sku, brand, category, condition, description, 
        JSON.stringify(attributes || {}), JSON.stringify(images || []), 
        price, stock_quantity, vat_rate || 23.0
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'SKU must be unique or missing fields' }, { status: 400 });
  }
}
