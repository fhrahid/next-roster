import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  const {teamName, currentEmployeeId, date} = await req.json();
  if (![teamName, currentEmployeeId, date].every(Boolean)) return NextResponse.json({success:false,error:'All fields required'});
  const admin = getAdmin();
  const team = admin.teams[teamName] || [];
  const dateIndex = admin.headers.indexOf(date);
  const members = team.filter(e=>e.id!==currentEmployeeId).map(e=>{
    const shift = dateIndex>-1 ? (e.schedule[dateIndex]||'') : '';
    return {
      id: e.id,
      name: e.name,
      shift,
      shift_display: shift || 'N/A'
    };
  });
  return NextResponse.json({success:true, teamMembers: members});
}