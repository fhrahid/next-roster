import { NextResponse } from 'next/server';
import { getDisplay } from '@/lib/dataStore';

export async function GET() {
  return NextResponse.json(getDisplay());
}