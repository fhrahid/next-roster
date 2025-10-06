import crypto from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE } from './constants';

interface SessionValue {
  username: string;
  ts: number;
  sig: string;
}

function sign(value:string, secret: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export function createSession(username: string) {
  const secret = process.env.APP_SECRET || 'dev_secret';
  const payload = JSON.stringify({username, ts: Date.now()});
  const sig = sign(payload, secret);
  cookies().set(ADMIN_SESSION_COOKIE, Buffer.from(JSON.stringify({username, ts: Date.now(), sig})).toString('base64'), {
    httpOnly: true,
    path:'/',
    maxAge: 60*60*8
  });
}

export function destroySession() {
  cookies().set(ADMIN_SESSION_COOKIE, '', { path:'/', maxAge:0 });
}

export function getSessionUser(): string|null {
  const secret = process.env.APP_SECRET || 'dev_secret';
  const c = cookies().get(ADMIN_SESSION_COOKIE);
  if (!c) return null;
  try {
    const raw = JSON.parse(Buffer.from(c.value,'base64').toString());
    const sigCheck = sign(JSON.stringify({username:raw.username, ts:raw.ts}), secret);
    if (sigCheck !== raw.sig) return null;
    return raw.username;
  } catch {
    return null;
  }
}

export function requireAdmin(): string {
  const u = getSessionUser();
  if (!u) throw new Error("Unauthorized");
  return u;
}

export function validateAdminLogin(username: string, password: string): boolean {
  try {
    const arr = JSON.parse(process.env.ADMIN_USERS_JSON || '[]');
    return !!arr.find((u:any)=>u.username===username && u.password===password);
  } catch {
    return false;
  }
}