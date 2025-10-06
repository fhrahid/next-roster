import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getGoogle, setGoogle, mergeDisplay } from '@/lib/dataStore';
import { parseCsv } from '@/lib/utils';
import { mergeCsvIntoGoogle } from '@/lib/rosterMerge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  // Use raw body (Expect client to send plain text or use FormData with file)
  const formData = await req.formData();
  const file = formData.get('csv_file') as File | null;
  if (!file) return NextResponse.json({success:false,error:'No file uploaded'});
  const text = await file.text();
  const rows = parseCsv(text);
  const google = getGoogle();
  try {
    const {detectedMonth} = mergeCsvIntoGoogle(google, rows);
    setGoogle(google);
    mergeDisplay();
    return NextResponse.json({success:true, message:`CSV imported successfully for ${detectedMonth || 'Month'}!`});
  } catch (e:any) {
    return NextResponse.json({success:false, error:e.message});
  }
}