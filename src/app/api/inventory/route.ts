import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) throw error;

    return NextResponse.json((products || []).map(p => ({
      ...p,
      attributes: typeof p.attributes === 'string' ? JSON.parse(p.attributes) : (p.attributes || {}),
      images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : [])
    })));
  } catch (error) {
    console.error('Inventory GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, sku, brand, category, condition, description, attributes, images, price, stock_quantity, vat_rate } = body;
    
    const { error } = await supabase
      .from('products')
      .insert([{
        name, 
        sku, 
        brand, 
        category, 
        condition: condition || 'new', 
        description, 
        attributes: attributes || {}, 
        images: images || [], 
        price, 
        stock_quantity, 
        vat_rate: vat_rate || 23.0
      }]);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inventory POST error:', error);
    return NextResponse.json({ error: 'SKU must be unique or missing fields' }, { status: 400 });
  }
}
