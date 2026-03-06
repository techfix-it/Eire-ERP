import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username.trim(), password.trim()) as any;

    if (user) {
      return NextResponse.json({
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: JSON.parse(user.permissions)
      });
    } else {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
