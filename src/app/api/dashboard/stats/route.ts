import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch summaries in parallel
    const [
      { data: invoices },
      { data: contractsRes },
      { data: stockAlertsRes },
      { data: transactions }
    ] = await Promise.all([
      supabase.from('invoices').select('total_amount').eq('status', 'paid'),
      supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock_quantity', 10),
      supabase.from('transactions').select('amount').eq('type', 'in')
    ]);

    const revenue = (invoices?.reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0) || 0) +
                    (transactions?.reduce((acc, tran) => acc + (Number(tran.amount) || 0), 0) || 0);

    return NextResponse.json({
      revenue,
      activeContracts: (contractsRes as any)?.count || 0,
      stockAlerts: (stockAlertsRes as any)?.count || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
