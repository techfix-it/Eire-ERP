import db from '@/lib/db';
import FleetClient from './FleetClient';

export default async function FleetPage() {
  const vehicles = db.prepare("SELECT * FROM vehicles").all() as any[];
  const tasks = db.prepare("SELECT * FROM tasks ORDER BY order_index ASC").all() as any[];
  const messages = db.prepare("SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20").all() as any[];

  return (
    <FleetClient 
      initialVehicles={vehicles}
      initialTasks={tasks}
      initialMessages={messages}
    />
  );
}
