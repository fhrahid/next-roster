import { NextRequest, NextResponse } from 'next/server';
import { getScheduleRequests } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  const {employeeId} = await req.json();
  if (!employeeId) return NextResponse.json({success:false,error:'Employee ID required'});
  const file = getScheduleRequests();
  const list = [
    ...file.shift_change_requests.filter(r=>r.employee_id===employeeId),
    ...file.swap_requests.filter(r=>r.requester_id===employeeId || r.target_employee_id===employeeId)
  ];
  return NextResponse.json({success:true, requests:list});
}