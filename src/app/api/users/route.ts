import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if requester is admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, role, permissions');
    
    if (error) throw error;

    return NextResponse.json((profiles || []).map(u => ({
      ...u,
      permissions: typeof u.permissions === 'string' ? JSON.parse(u.permissions) : (u.permissions || ['dashboard'])
    })));
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // Check if requester is admin
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!adminProfile || adminProfile.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { username, password, role, permissions, email } = await request.json();
    
    // Note: To create a full Supabase user with Auth, one would typically use supabase.auth.admin
    // (requires service role). Here we just insert into profiles for simplicity/demonstration,
    // assuming the user is already signed up or managed elsewhere.
    
    const { error } = await supabase.from('profiles').insert([{ 
      username, 
      role: role || 'technician', 
      permissions: permissions || ['dashboard'] 
    }]);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Users POST error:', error);
    return NextResponse.json({ error: 'Failed to create user profile' }, { status: 400 });
  }
}
