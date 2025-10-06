import { NextRequest, NextResponse } from 'next/server';
import { getAdmin, setAdmin } from '@/lib/dataStore';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {teamName} = await req.json();
  const admin = getAdmin();
  if (teamName in admin.teams) {
    delete admin.teams[teamName];
    setAdmin(admin);
  }
  return NextResponse.json({success:true});
}