import { NextRequest, NextResponse } from 'next/server';
import { updateAdminUser, getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { username, updates } = body;

  if (!username || !updates) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const success = updateAdminUser(username, updates);
  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
