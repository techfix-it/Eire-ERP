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

    const brands = db.prepare("SELECT * FROM brands").all();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, image_url, description } = await request.json();
    db.prepare("INSERT INTO brands (name, image_url, description) VALUES (?, ?, ?)")
      .run(name, image_url, description);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Brand name must be unique' }, { status: 400 });
  }
}
