import { createClient } from '@/utils/supabase/server';
import FleetClient from './FleetClient';

export default async function FleetPage() {
  const supabase = await createClient();

  const [
    { data: vehicles },
    { data: tasks },
    { data: messages }
  ] = await Promise.all([
    supabase.from('vehicles').select('*'),
    supabase.from('tasks').select('*').order('priority', { ascending: false }),
    supabase.from('messages').select('*').order('timestamp', { ascending: false }).limit(20)
  ]);

  return (
    <FleetClient 
      initialVehicles={vehicles || []}
      initialTasks={tasks || []}
      initialMessages={messages || []}
    />
  );
}
