import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(contracts || []);
  } catch (error) {
    console.error('Contracts GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customer_name, terms, start_date, end_date, status } = await request.json();
    
    const { data: contract, error } = await supabase
      .from('contracts')
      .insert([{
        customer_name,
        terms,
        start_date: start_date || new Date().toISOString().split('T')[0],
        end_date,
        status: status || 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, id: contract.id });
  } catch (error) {
    console.error('Contracts POST error:', error);
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 400 });
  }
}
