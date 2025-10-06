import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { updateRequestStatus } from '@/lib/dataStore';
import { applyShiftChangeRequest, applySwap } from '@/lib/shifts';

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {requestId, status} = await req.json();
  if (!requestId || !['approved','rejected'].includes(status)) return NextResponse.json({success:false,error:'Invalid request'});
  const upd = updateRequestStatus(requestId, status, user);
  if (!upd) return NextResponse.json({success:false,error:'Request not found'});
  if (status==='approved') {
    if (upd.type==='shift_change') {
      applyShiftChangeRequest(upd, user);
    } else if (upd.type==='swap') {
      applySwap(upd, user);
    }
  }
  return NextResponse.json({success:true, request:upd});
}