import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  if (!path.startsWith('/admin')) return NextResponse.next();

  // Allow login page always
  if (path.startsWith('/admin/login')) return NextResponse.next();

  // Read cookie
  const session = req.cookies.get('admin_session_v1');
  if (!session) {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};