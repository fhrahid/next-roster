import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getCurrentMonthModifiedData } from '@/lib/stats';

export async function GET() {
  if (!getSessionUser()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const data = getCurrentMonthModifiedData();
  return NextResponse.json({
    monthly_stats: data.monthly,
    recent_modifications: data.recent,
    current_month: data.currentMonth
  });
}