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

    // For simplicity, returning all messages or filtered by user if needed
    const messages = db.prepare("SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50").all();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { receiver_id, content } = await request.json();
    
    db.prepare(`
        INSERT INTO messages (sender_id, receiver_id, content) 
        VALUES (?, ?, ?)
    `).run(token, receiver_id, content);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 400 });
  }
}
