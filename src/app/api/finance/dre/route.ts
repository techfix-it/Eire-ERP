import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Dynamic DRE calculation from Supabase
    const [
      { data: invoices },
      { data: transactions }
    ] = await Promise.all([
      supabase.from('invoices').select('total_amount, vat_amount').eq('status', 'paid'),
      supabase.from('transactions').select('amount, type, category')
    ]);

    const grossRevenue = (invoices?.reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0) || 0) +
                        (transactions?.filter(t => t.type === 'in').reduce((acc, t) => acc + (Number(t.amount) || 0), 0) || 0);
    
    const taxes = invoices?.reduce((acc, inv) => acc + (Number(inv.vat_amount) || 0), 0) || (grossRevenue * 0.14); // Est. 14% if no data
    const netRevenue = grossRevenue - taxes;
    const cogs = transactions?.filter(t => t.category === 'Inventory').reduce((acc, t) => acc + (Number(t.amount) || 0), 0) || (grossRevenue * 0.33);
    const grossProfit = netRevenue - cogs;
    const operatingExpenses = transactions?.filter(t => t.type === 'out' && t.category !== 'Inventory').reduce((acc, t) => acc + (Number(t.amount) || 0), 0) || (grossRevenue * 0.21);
    const ebitda = grossProfit - operatingExpenses;
    const netProfit = ebitda * 0.8; // Est. 20% corp tax

    return NextResponse.json({
      grossRevenue,
      taxes,
      netRevenue,
      cogs,
      grossProfit,
      operatingExpenses,
      ebitda,
      netProfit
    });
  } catch (error) {
    console.error('DRE calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
