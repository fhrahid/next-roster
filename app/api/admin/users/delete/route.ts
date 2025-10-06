import { NextRequest, NextResponse } from 'next/server';
import { deleteAdminUser, getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { username } = body;

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  // Prevent deleting self
  if (username === user) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const success = deleteAdminUser(username);
  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
