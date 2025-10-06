import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { addGoogleLink } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {monthYear, googleLink} = await req.json();
  if (!monthYear || !googleLink) return NextResponse.json({success:false, error:'Month year and link required'});
  addGoogleLink(monthYear, googleLink);
  return NextResponse.json({success:true, message:'Google Sheets link saved successfully'});
}