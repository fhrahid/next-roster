import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAdmin, setAdmin } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {employeeId} = await req.json();
  const admin = getAdmin();
  Object.entries(admin.teams).forEach(([team,emps])=>{
    admin.teams[team] = emps.filter(e=>e.id!==employeeId);
  });
  setAdmin(admin);
  return NextResponse.json({success:true});
}