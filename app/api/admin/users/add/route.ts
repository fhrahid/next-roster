import { NextRequest, NextResponse } from 'next/server';
import { addAdminUser, getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { username, password, role, full_name } = body;

  if (!username || !password || !role || !full_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newUser = addAdminUser({ username, password, role, full_name });
    return NextResponse.json({ 
      success: true, 
      user: {
        username: newUser.username,
        role: newUser.role,
        full_name: newUser.full_name,
        created_at: newUser.created_at
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
