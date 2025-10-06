import { NextRequest, NextResponse } from 'next/server';
import { validateAdminLogin, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const {username, password} = await req.json();
  if (validateAdminLogin(username, password)) {
    createSession(username);
    return NextResponse.json({success:true});
  }
  return NextResponse.json({success:false, error:'Invalid credentials'});
}