import { RosterData, Employee } from './types';
import { normalizeDateHeader, extractMonthFromHeaders } from './utils';

export function mergeCsvIntoGoogle(existing: RosterData, rawRows: string[][]) {
  // rawRows as parsed CSV: first row headers row, second maybe date row convention
  if (rawRows.length < 2) throw new Error("CSV too short");

  // FIRST ROW: Team,Name,ID,Dates...
  const headerRow = rawRows[0];
  const dateHeadersRaw = headerRow.slice(3).filter(h=>h.trim());
  const normalized = dateHeadersRaw.map(normalizeDateHeader);
  const detectedMonth = extractMonthFromHeaders(dateHeadersRaw);
  const newHeaders = mergeHeaders(existing.headers, normalized, detectedMonth);

  const importedTeams: Record<string, Employee[]> = {};
  for (let i=1;i<rawRows.length;i++) {
    const row = rawRows[i];
    if (row.length < 3) continue;
    const [team, name, emp_id, ...shifts] = row.map(v=>v.trim());
    if (!team || !name || !emp_id) continue;
    if (!importedTeams[team]) importedTeams[team] = [];
    importedTeams[team].push({
      name,
      id: emp_id,
      team,
      currentTeam: team,
      schedule: shifts.slice(0, normalized.length)
    });
  }

  // apply merges
  Object.entries(importedTeams).forEach(([team, emps])=>{
    if (!existing.teams[team]) existing.teams[team] = [];
    emps.forEach(imp=>{
      const existingEmp = existing.teams[team].find(e=>e.id===imp.id);
      if (existingEmp) {
        while (existingEmp.schedule.length < newHeaders.length) existingEmp.schedule.push('');
        normalized.forEach((hdr,i)=>{
          const idx = newHeaders.indexOf(hdr);
          if (idx>-1 && imp.schedule[i]) {
            existingEmp.schedule[idx] = imp.schedule[i];
          }
        });
      } else {
        const newEmp: Employee = {
          name: imp.name,
          id: imp.id,
          currentTeam: team,
          team,
          schedule: Array(newHeaders.length).fill('')
        };
        normalized.forEach((hdr,i)=>{
          const idx = newHeaders.indexOf(hdr);
          if (idx>-1 && imp.schedule[i]) {
            newEmp.schedule[idx] = imp.schedule[i];
          }
        });
        existing.teams[team].push(newEmp);
      }
    });
  });

  // rebuild allEmployees
  const all: Employee[] = [];
  Object.entries(existing.teams).forEach(([team, emps])=>{
    emps.forEach(e=>{
      e.currentTeam = team;
      all.push(e);
    });
  });
  existing.allEmployees = all;
  existing.headers = newHeaders;
  return { normalized, detectedMonth };
}

function mergeHeaders(existing: string[], newMonthHeaders: string[], detectedMonth: string|null): string[] {
  if (!detectedMonth) return Array.from(new Set([...existing, ...newMonthHeaders]));
  const filtered = existing.filter(h=>!h.toLowerCase().includes(detectedMonth.toLowerCase()));
  return [...filtered, ...newMonthHeaders];
}