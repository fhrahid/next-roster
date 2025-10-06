import { NextResponse } from 'next/server';
import { getAdminUsers } from '@/lib/auth';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const adminUsers = getAdminUsers();
  // Don't send passwords to client
  const safeUsers = adminUsers.users.map(u => ({
    username: u.username,
    role: u.role,
    full_name: u.full_name,
    created_at: u.created_at
  }));

  return NextResponse.json({ success: true, users: safeUsers });
}
