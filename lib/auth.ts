import crypto from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, ADMIN_USERS_FILE } from './constants';
import { readJSON, writeJSON } from './utils';
import { AdminUsersFile, AdminUser } from './types';

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
    // First try file-based system
    const adminUsers: AdminUsersFile = readJSON(ADMIN_USERS_FILE, { users: [] });
    const found = adminUsers.users.find((u: AdminUser) => 
      u.username === username && u.password === password
    );
    if (found) return true;
    
    // Fallback to environment variable
    const arr = JSON.parse(process.env.ADMIN_USERS_JSON || '[]');
    return !!arr.find((u:any)=>u.username===username && u.password===password);
  } catch {
    return false;
  }
}

export function getAdminUsers(): AdminUsersFile {
  return readJSON(ADMIN_USERS_FILE, { users: [] });
}

export function saveAdminUsers(data: AdminUsersFile) {
  writeJSON(ADMIN_USERS_FILE, data);
}

export function addAdminUser(user: Omit<AdminUser, 'created_at'>): AdminUser {
  const adminUsers = getAdminUsers();
  const newUser: AdminUser = {
    ...user,
    created_at: new Date().toISOString()
  };
  adminUsers.users.push(newUser);
  saveAdminUsers(adminUsers);
  return newUser;
}

export function updateAdminUser(username: string, updates: Partial<AdminUser>): boolean {
  const adminUsers = getAdminUsers();
  const userIndex = adminUsers.users.findIndex(u => u.username === username);
  if (userIndex === -1) return false;
  
  adminUsers.users[userIndex] = {
    ...adminUsers.users[userIndex],
    ...updates
  };
  saveAdminUsers(adminUsers);
  return true;
}

export function deleteAdminUser(username: string): boolean {
  const adminUsers = getAdminUsers();
  const initialLength = adminUsers.users.length;
  adminUsers.users = adminUsers.users.filter(u => u.username !== username);
  if (adminUsers.users.length < initialLength) {
    saveAdminUsers(adminUsers);
    return true;
  }
  return false;
}