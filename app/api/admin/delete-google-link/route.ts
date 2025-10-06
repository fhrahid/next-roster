import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { deleteGoogleLink } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {monthYear} = await req.json();
  if (!monthYear) return NextResponse.json({success:false, error:'Month year required'});
  deleteGoogleLink(monthYear);
  return NextResponse.json({success:true, message:'Google Sheets link deleted successfully'});
}