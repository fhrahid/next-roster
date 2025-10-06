import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  if (!getSessionUser()) return new NextResponse('Unauthorized',{status:401});
  const now = new Date();
  const mon = now.toLocaleString('en-US',{month:'short'});
  const year = now.getFullYear();
  const days = new Date(year, now.getMonth()+1,0).getDate();
  const headers = Array.from({length:days}, (_,i)=>`${i+1}${mon}`);
  const headerRow = `Team,Name,ID,${headers.join(',')}`;
  const dateRow = `,,Date,${headers.map(()=> '').join(',')}`;
  const example1 = `Team A,John Doe,EMP001,${headers.map(()=> 'M2').join(',')}`;
  const example2 = `Team B,Jane Smith,EMP002,${headers.map(()=> 'M3').join(',')}`;
  const csv = [headerRow, dateRow, example1, example2].join('\n');
  return new NextResponse(csv, {
    status:200,
    headers:{
      'Content-Type':'text/csv',
      'Content-Disposition':`attachment; filename=roster_template_${mon}.csv`
    }
  });
}