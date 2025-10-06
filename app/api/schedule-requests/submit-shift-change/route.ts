import { NextRequest, NextResponse } from 'next/server';
import { addScheduleChangeRequest } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  const {employeeId, employeeName, team, date, currentShift, requestedShift, reason} = await req.json();
  if (![employeeId, employeeName, team, date, currentShift, requestedShift, reason].every(Boolean)) {
    return NextResponse.json({success:false, error:'All fields required'});
  }
  const r = addScheduleChangeRequest({
    employee_id:employeeId,
    employee_name:employeeName,
    team,
    date,
    current_shift: currentShift,
    requested_shift: requestedShift,
    reason
  });
  return NextResponse.json({success:true, request:r});
}