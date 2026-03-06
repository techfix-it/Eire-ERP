import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, total } = await request.json();
    
    // 1. Create Invoice
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .insert([{
        customer_name: 'POS Customer',
        total_amount: total,
        status: 'paid',
        issue_date: new Date().toISOString()
      }])
      .select()
      .single();

    if (invError) throw invError;

    // 2. Update Stock for each product
    // Note: Ideally use an RPC for atomicity, but sequential is standard for basic Next.js integration
    for (const item of items) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        product_id: item.id,
        quantity: item.quantity
      });
      
      // If RPC doesn't exist yet, we do it manually (caution: race conditions)
      if (stockError) {
        const { data: p } = await supabase.from('products').select('stock_quantity').eq('id', item.id).single();
        if (p) {
          await supabase.from('products').update({ 
            stock_quantity: Math.max(0, p.stock_quantity - item.quantity) 
          }).eq('id', item.id);
        }
      }
    }

    // 3. Register transaction for Cash Flow
    await supabase.from('transactions').insert([{
      date: new Date().toISOString(),
      description: `POS Sale - Inv #${invoice.id}`,
      category: 'Sales',
      type: 'in',
      amount: total,
      business_type: 'POS'
    }]);
    
    return NextResponse.json({ success: true, invoiceId: invoice.id });
  } catch (error) {
    console.error('POS Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 400 });
  }
}
