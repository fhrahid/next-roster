import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAdmin, setAdmin } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {teamName, action, oldName} = await req.json();
  if (!teamName) return NextResponse.json({success:false, error:'Team name required'});
  const admin = getAdmin();
  if (action==='add') {
    if (!admin.teams[teamName]) admin.teams[teamName] = [];
  } else if (action==='edit') {
    if (oldName && admin.teams[oldName]) {
      admin.teams[teamName] = admin.teams[oldName];
      delete admin.teams[oldName];
    }
  }
  setAdmin(admin);
  return NextResponse.json({success:true});
}