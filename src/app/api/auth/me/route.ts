import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profile details from our public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // Fallback or handle missing profile
      return NextResponse.json({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email,
        role: user.user_metadata?.role || 'technician',
        permissions: ["dashboard"]
      });
    }

    return NextResponse.json({
      id: profile.id,
      username: profile.username,
      role: profile.role,
      permissions: typeof profile.permissions === 'string' 
        ? JSON.parse(profile.permissions) 
        : (profile.permissions || ["dashboard"])
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
