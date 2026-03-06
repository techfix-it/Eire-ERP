import db from '@/lib/db';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const users = db.prepare("SELECT id, username, role, permissions FROM users").all() as any[];
  
  const serializedUsers = users.map(u => ({
    ...u,
    permissions: JSON.parse(u.permissions || '["dashboard"]')
  }));

  return (
    <UsersClient initialUsers={serializedUsers} />
  );
}
