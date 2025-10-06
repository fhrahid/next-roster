import fetch from 'node-fetch';
import { getGoogleLinks, setGoogle } from './dataStore';
import { RosterData } from './types';

export async function syncGoogleSheets(): Promise<{ employees:number; sheets:number }> {
  const links = getGoogleLinks();
  const urls = Object.values(links);
  if (!urls.length) throw new Error("No Google Sheets links configured");
  const aggregated: RosterData = {teams:{}, headers:[], allEmployees:[]};

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      const parsed = parseOne(text);
      merge(aggregated, parsed);
    } catch (e) {
      console.error("Error loading sheet:", url, e);
    }
  }
  setGoogle(aggregated);
  return { employees: aggregated.allEmployees.length, sheets: urls.length };
}

function parseOne(csvText: string): RosterData {
  const lines = csvText.split(/\r?\n/).map(l=>l.trim()).filter(l=>l);
  if (lines.length < 3) return { teams:{}, headers:[], allEmployees:[] };
  const headerLine = lines[1].split(',');
  const dateHeaders = headerLine.slice(3).map(h=>h.replace(/"/g,'').trim());

  const teams: Record<string, any[]> = {};
  let currentTeam = '';
  for (let i=2;i<lines.length;i++) {
    const cols = lines[i].split(',');
    if (cols.length < 4) continue;
    if (cols[0].trim()) currentTeam = cols[0].trim();
    if (!teams[currentTeam]) teams[currentTeam] = [];
    const employee = {
      name: cols[1].trim(),
      id: cols[2].trim(),
      team: currentTeam,
      currentTeam,
      schedule: cols.slice(3).map(s=>s.trim())
    };
    if (employee.name && employee.id) teams[currentTeam].push(employee);
  }
  const allEmployees: any[] = [];
  Object.values(teams).forEach(emps => emps.forEach(e=>allEmployees.push(e)));
  return { teams, headers: dateHeaders, allEmployees };
}

function merge(base: RosterData, incoming: RosterData) {
  // unify headers
  incoming.headers.forEach(h=>{
    if (!base.headers.includes(h)) base.headers.push(h);
  });
  Object.entries(incoming.teams).forEach(([team, emps])=>{
    if (!base.teams[team]) base.teams[team] = [];
    emps.forEach(emp=>{
      const existing = base.teams[team].find(e=>e.id===emp.id);
      if (existing) {
        // fill
        incoming.headers.forEach((hdr,i)=>{
          const idx = base.headers.indexOf(hdr);
          if (idx>-1) {
            existing.schedule[idx] = emp.schedule[i];
          }
        });
      } else {
        const newEmp = {
          ...emp,
          schedule: Array(base.headers.length).fill('')
        };
        incoming.headers.forEach((hdr,i)=>{
          const idx = base.headers.indexOf(hdr);
            newEmp.schedule[idx] = emp.schedule[i];
        });
        base.teams[team].push(newEmp);
      }
    });
  });
  const all:any[] = [];
  Object.entries(base.teams).forEach(([team,emps])=>{
    emps.forEach(e=>{
      e.currentTeam=team;
      all.push(e);
    });
  });
  base.allEmployees = all;
}