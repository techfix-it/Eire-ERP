import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token) as any;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: JSON.parse(user.permissions)
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
