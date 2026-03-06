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

    const attributes = db.prepare("SELECT * FROM attribute_definitions").all();
    return NextResponse.json(attributes);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, label, type } = await request.json();
    db.prepare("INSERT INTO attribute_definitions (name, label, type) VALUES (?, ?, ?)")
      .run(name, label, type || 'text');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Attribute name must be unique' }, { status: 400 });
  }
}
