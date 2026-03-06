import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: brands, error } = await supabase.from('brands').select('*').order('name');
    if (error) throw error;

    return NextResponse.json(brands || []);
  } catch (error) {
    console.error('Brands GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, image_url, description } = await request.json();
    const { error } = await supabase.from('brands').insert([{ name, image_url, description }]);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Brands POST error:', error);
    return NextResponse.json({ error: 'Brand name must be unique' }, { status: 400 });
  }
}
