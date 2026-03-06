import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: vehicles, error } = await supabase.from('vehicles').select('*');
    if (error) throw error;

    return NextResponse.json(vehicles || []);
  } catch (error) {
    console.error('Fleet GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
