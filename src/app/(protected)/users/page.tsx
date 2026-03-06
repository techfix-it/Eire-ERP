import { createClient } from '@/utils/supabase/server';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, role, permissions');
  
  const serializedUsers = (profiles || []).map(u => ({
    ...u,
    permissions: typeof u.permissions === 'string' 
      ? JSON.parse(u.permissions || '["dashboard"]') 
      : (u.permissions || ["dashboard"])
  }));

  return (
    <UsersClient initialUsers={serializedUsers} />
  );
}
