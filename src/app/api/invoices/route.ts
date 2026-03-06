import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(invoices || []);
  } catch (error) {
    console.error('Invoices GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customer_name, customer_email, total_amount, vat_amount, status } = await request.json();
    
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert([{
        customer_name,
        customer_email,
        total_amount,
        vat_amount: vat_amount || (total_amount * 0.23), // Default 23% VAT if not provided
        status: status || 'pending',
        issue_date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, id: invoice.id });
  } catch (error) {
    console.error('Invoices POST error:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 400 });
  }
}
