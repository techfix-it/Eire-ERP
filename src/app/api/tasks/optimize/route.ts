import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { vehicleId, taskIds } = await request.json();
    
    // Update tasks with new order and assign to vehicle
    // Sequential updates for simplicity (ideally use a batch update RPC if many tasks)
    for (let i = 0; i < taskIds.length; i++) {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          vehicle_id: vehicleId, 
          priority: taskIds.length - i // Using priority instead of order_index for consistency
        })
        .eq('id', taskIds[i]);
      
      if (error) throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize tasks' }, { status: 400 });
  }
}
