import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tasks = db.prepare("SELECT * FROM tasks ORDER BY order_index ASC").all();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
