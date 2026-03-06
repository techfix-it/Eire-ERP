import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: attributes, error } = await supabase.from('attribute_definitions').select('*').order('name');
    if (error) throw error;

    return NextResponse.json(attributes || []);
  } catch (error) {
    console.error('Attributes GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, label, type } = await request.json();
    const { error } = await supabase.from('attribute_definitions').insert([{ name, label, type: type || 'text' }]);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Attributes POST error:', error);
    return NextResponse.json({ error: 'Attribute name must be unique' }, { status: 400 });
  }
}
