import fs from 'fs';
import path from 'path';
import { DATA_DIR } from './constants';

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
}

export function readJSON<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file,'utf-8')) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(file: string, data: any) {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data,null,2),'utf-8');
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function getMonthYearNow() {
  const d = new Date();
  return d.toISOString().slice(0,7);
}

export function isoNow() {
  return new Date().toISOString();
}

export function normalizeDateHeader(raw: string): string {
  const cleaned = raw.replace(/[-.\s]/g,'');
  const match = cleaned.match(/^(\d+)([A-Za-z]+)/);
  const mm: Record<string,string> = {
    jan:"Jan",feb:"Feb",mar:"Mar",apr:"Apr",may:"May",jun:"Jun",
    jul:"Jul",aug:"Aug",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dec"
  };
  if (match) {
    const day = match[1];
    const m = match[2].toLowerCase();
    if (mm[m]) return `${day}${mm[m]}`;
  }
  return cleaned;
}

export function extractMonthFromHeaders(headers: string[]): string|null {
  const map: Record<string,string> = {
    jan:"Jan",january:"Jan",feb:"Feb",february:"Feb",mar:"Mar",march:"Mar",
    apr:"Apr",april:"Apr",may:"May",jun:"Jun",june:"Jun",jul:"Jul",july:"Jul",
    aug:"Aug",august:"Aug",sep:"Sep",september:"Sep",oct:"Oct",october:"Oct",
    nov:"Nov",november:"Nov",dec:"Dec",december:"Dec"
  };
  const counts: Record<string, number> = {};
  headers.forEach(h=>{
    const m = h.match(/(\d{1,2})[-.\s]*([A-Za-z]+)/);
    if (m) {
      const part = m[2].toLowerCase();
      if (map[part]) counts[map[part]] = (counts[map[part]]||0)+1;
    } else {
      Object.keys(map).forEach(k=>{
        if (h.toLowerCase().includes(k)) {
          const mm = map[k];
            counts[mm] = (counts[mm]||0)+1;
        }
      });
    }
  });
  if (!Object.keys(counts).length) return null;
  return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
}

export function parseCsv(text: string): string[][] {
  return text.split(/\r?\n/).map(r=>r.split(','));
}

export function formatDateHeader(date: Date) {
  const day = date.getDate();
  const mon = date.toLocaleString('en-US',{month:'short'});
  return `${day}${mon}`;
}

export function arrayUnique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function sleep(ms:number) {
  return new Promise(r=>setTimeout(r,ms));
}