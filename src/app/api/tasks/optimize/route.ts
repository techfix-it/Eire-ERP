import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get('authorization');
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { vehicleId, taskIds } = await request.json();
    
    // Update tasks with new order and assign to vehicle
    const update = db.prepare("UPDATE tasks SET vehicle_id = ?, order_index = ? WHERE id = ?");
    
    const transaction = db.transaction((ids: number[], vId: number) => {
      ids.forEach((id, index) => {
        update.run(vId, index, id);
      });
    });

    transaction(taskIds, vehicleId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize tasks' }, { status: 400 });
  }
}
