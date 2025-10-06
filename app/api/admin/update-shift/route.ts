import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getGoogle, getAdmin } from '@/lib/dataStore';
import { updateShift } from '@/lib/shifts';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({success:false, error:'Unauthorized'},{status:401});
  const { employeeId, dateIndex, newShift, googleShift } = await req.json();
  if (!employeeId || dateIndex===undefined) return NextResponse.json({success:false, error:'Missing fields'});
  const g = getGoogle();
  // googleShift fallback
  const ok = updateShift(employeeId, dateIndex, newShift, googleShift||'', getSessionUser()||'admin');
  return NextResponse.json({success:ok});
}