import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { username, password, email } = await request.json();
    const supabase = await createClient();

    // In Supabase, login is usually by email. If username is used, we assume it's the email or mapped.
    const loginEmail = email || username;

    if (!loginEmail || !password) {
      return NextResponse.json({ error: "Email/Username and password are required" }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Get extra profile info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return NextResponse.json({
      id: authData.user.id,
      username: profile?.username || authData.user.email,
      role: profile?.role || 'user',
      permissions: profile?.permissions || ["dashboard"]
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
