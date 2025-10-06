import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getGoogleLinks } from '@/lib/dataStore';

export async function GET() {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  return NextResponse.json(getGoogleLinks());
}