import { NextRequest, NextResponse } from 'next/server';
import { addSwapRequest } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  const {
    requesterId, requesterName,
    targetEmployeeId, targetEmployeeName,
    team, date, requesterShift, targetShift, reason
  } = await req.json();
  // Shifts can be empty strings, so we check them separately
  if (!requesterId || !requesterName || !targetEmployeeId || !targetEmployeeName || !team || !date || !reason) {
    return NextResponse.json({success:false, error:'All fields are required'});
  }
  // Ensure shifts are defined (can be empty string)
  if (requesterShift === undefined || requesterShift === null || targetShift === undefined || targetShift === null) {
    return NextResponse.json({success:false, error:'Shift information is required'});
  }
  const r = addSwapRequest({
    requester_id: requesterId,
    requester_name: requesterName,
    target_employee_id: targetEmployeeId,
    target_employee_name: targetEmployeeName,
    team,
    date,
    requester_shift: requesterShift,
    target_shift: targetShift,
    reason
  });
  return NextResponse.json({success:true, request:r});
}