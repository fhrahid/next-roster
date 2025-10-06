import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/dataStore';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  return NextResponse.json(getAdmin());
}