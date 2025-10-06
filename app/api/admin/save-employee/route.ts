import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAdmin, setAdmin } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {name,id,team,action,oldId,oldTeam} = await req.json();
  if (!name || !id || !team) return NextResponse.json({success:false,error:'All fields required'});
  const admin = getAdmin();
  if (action==='add') {
    if (!admin.teams[team]) admin.teams[team]=[];
    admin.teams[team].push({name,id,schedule:Array(admin.headers.length).fill(''), currentTeam:team});
  } else if (action==='edit') {
    let found = false;
    if (oldTeam && admin.teams[oldTeam]) {
      const idx = admin.teams[oldTeam].findIndex(e=>e.id===oldId);
      if (idx>-1) {
        const emp = admin.teams[oldTeam].splice(idx,1)[0];
        emp.name=name; emp.id=id;
        if (!admin.teams[team]) admin.teams[team]=[];
        emp.currentTeam=team;
        admin.teams[team].push(emp);
        found = true;
      }
    }
    if (!found) {
      for (const [t,emps] of Object.entries(admin.teams)) {
        const ee = emps.find(e=>e.id===id);
        if (ee){
          ee.name=name;
          if (t!==team) {
            admin.teams[t]=emps.filter(e=>e.id!==id);
            if (!admin.teams[team]) admin.teams[team]=[];
            ee.currentTeam=team;
            admin.teams[team].push(ee);
          }
          break;
        }
      }
    }
  }
  setAdmin(admin);
  return NextResponse.json({success:true});
}