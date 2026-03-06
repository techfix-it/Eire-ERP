import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: orders, error } = await supabase
      .from('service_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Service Orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customer_name, description, status } = await request.json();
    
    const { data: order, error } = await supabase
      .from('service_orders')
      .insert([{
        customer_name,
        description,
        status: status || 'open',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, id: order.id });
  } catch (error) {
    console.error('Service Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to create service order' }, { status: 400 });
  }
}
