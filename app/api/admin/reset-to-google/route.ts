import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getGoogle, setAdmin } from '@/lib/dataStore';

export async function POST() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({success:false, error:'Unauthorized'},{status:401});
  const google = getGoogle();
  if (!google.headers.length) return NextResponse.json({success:false, error:'No Google data loaded'});
  setAdmin(google);
  return NextResponse.json({success:true, message:'Admin data reset to Google base roster.'});
}