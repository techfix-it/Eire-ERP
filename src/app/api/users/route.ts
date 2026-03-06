import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token) as any;
    if (!user || user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = db.prepare(`SELECT id, username, role, permissions FROM users`).all() as any[];
    return NextResponse.json(users.map(u => ({
      ...u,
      permissions: JSON.parse(u.permissions || '["dashboard"]')
    })));
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const admin = db.prepare("SELECT * FROM users WHERE id = ?").get(token) as any;
    if (!admin || admin.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { username, password, role, permissions } = await request.json();
    db.prepare("INSERT INTO users (username, password, role, permissions) VALUES (?, ?, ?, ?)")
      .run(username, password || 'Padrão123', role || 'user', JSON.stringify(permissions || ['dashboard']));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Username must be unique' }, { status: 400 });
  }
}
