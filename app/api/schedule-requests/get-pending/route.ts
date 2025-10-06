import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getPendingRequests, getScheduleRequests } from '@/lib/dataStore';

export async function GET() {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const pending_requests = getPendingRequests();
  const stats = {
    pending_count: getScheduleRequests().pending_count,
    approved_count: getScheduleRequests().approved_count,
    total_shift_change: getScheduleRequests().shift_change_requests.length,
    total_swap: getScheduleRequests().swap_requests.length
  };
  return NextResponse.json({success:true, pending_requests, stats});
}