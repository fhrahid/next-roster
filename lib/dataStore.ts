import {
  GOOGLE_DATA_FILE, ADMIN_DATA_FILE, MODIFIED_SHIFTS_FILE,
  GOOGLE_LINKS_FILE, SCHEDULE_REQUESTS_FILE
} from './constants';
import {
  RosterData, ModifiedShiftsData, ScheduleRequestsFile, GoogleLinks
} from './types';
import { readJSON, writeJSON, ensureDataDir, deepCopy, getMonthYearNow } from './utils';

let googleData: RosterData = {teams:{}, headers:[], allEmployees:[]};
let adminData: RosterData = {teams:{}, headers:[], allEmployees:[]};
let modifiedShifts: ModifiedShiftsData = {modifications:[], monthly_stats:{}};
let googleLinks: GoogleLinks = {};
let scheduleRequests: ScheduleRequestsFile = {
  shift_change_requests: [],
  swap_requests: [],
  approved_count: 0,
  pending_count: 0
};
let displayData: RosterData = {teams:{}, headers:[], allEmployees:[]};

export function loadAll() {
  ensureDataDir();
  googleData = readJSON(GOOGLE_DATA_FILE, googleData);
  adminData = readJSON(ADMIN_DATA_FILE, adminData);
  modifiedShifts = readJSON(MODIFIED_SHIFTS_FILE, modifiedShifts);
  googleLinks = readJSON(GOOGLE_LINKS_FILE, googleLinks);
  scheduleRequests = readJSON(SCHEDULE_REQUESTS_FILE, scheduleRequests);
  mergeDisplay();
}

export function saveGoogle() { writeJSON(GOOGLE_DATA_FILE, googleData); }
export function saveAdmin() { writeJSON(ADMIN_DATA_FILE, adminData); }
export function saveModified() { writeJSON(MODIFIED_SHIFTS_FILE, modifiedShifts); }
export function saveLinks() { writeJSON(GOOGLE_LINKS_FILE, googleLinks); }
export function saveRequests() { writeJSON(SCHEDULE_REQUESTS_FILE, scheduleRequests); }

export function getGoogle(): RosterData { return googleData; }
export function getAdmin(): RosterData { return adminData; }
export function getDisplay(): RosterData { return displayData; }
export function getModifiedShifts() { return modifiedShifts; }
export function getGoogleLinks() { return googleLinks; }
export function getScheduleRequests() { return scheduleRequests; }

export function setGoogle(data: RosterData) {
  googleData = deepCopy(data);
  saveGoogle();
  if (!adminData || !adminData.headers.length) {
    adminData = deepCopy(data);
    saveAdmin();
  } else {
    // Add newly discovered employees
    Object.entries(data.teams).forEach(([teamName, emps])=>{
      if (!adminData.teams[teamName]) adminData.teams[teamName] = [];
      emps.forEach(gEmp=>{
        const exists = adminData.teams[teamName].some(a=>a.id===gEmp.id);
        if (!exists) {
          adminData.teams[teamName].push(deepCopy(gEmp));
        }
      });
    });
    saveAdmin();
  }
  mergeDisplay();
}

export function setAdmin(data: RosterData) {
  adminData = deepCopy(data);
  saveAdmin();
  mergeDisplay();
}

export function updateAdminTeamStructure() {
  saveAdmin();
  mergeDisplay();
}

function rebuildAllEmployees(data: RosterData) {
  const all: any[] = [];
  Object.entries(data.teams).forEach(([team, emps])=>{
    emps.forEach(e=>{
      e.currentTeam = team;
      all.push(e);
    });
  });
  data.allEmployees = all;
}

export function mergeDisplay() {
  if (!googleData || !googleData.headers.length) {
    displayData = deepCopy(adminData);
    rebuildAllEmployees(displayData);
    return;
  }
  const base = deepCopy(googleData);
  // Overlay admin modifications
  Object.entries(adminData.teams).forEach(([team, aEmps])=>{
    base.teams[team] = deepCopy(aEmps);
  });
  // Remove teams deleted in admin? (If not present in adminData)
  // In your Flask logic you removed teams not in admin modifications; we'll mimic:
  Object.keys(base.teams).forEach(team=>{
    if (!(team in adminData.teams)) {
      delete base.teams[team];
    }
  });
  rebuildAllEmployees(base);
  base.headers = adminData.headers.length ? adminData.headers : base.headers;
  displayData = base;
}

export function trackModifiedShift(
  employee_id: string,
  date_index: number,
  old_shift: string,
  new_shift: string,
  employee_name: string,
  team_name: string,
  date_header: string,
  modified_by: string
) {
  const mod = {
    employee_id,
    date_index,
    old_shift,
    new_shift,
    employee_name,
    team_name,
    date_header,
    modified_by,
    timestamp: new Date().toISOString(),
    month_year: getMonthYearNow()
  };
  modifiedShifts.modifications.push(mod);
  const month = mod.month_year;
  if (!modifiedShifts.monthly_stats[month]) {
    modifiedShifts.monthly_stats[month] = {
      total_modifications:0,
      employees_modified:[],
      modifications_by_user:{}
    };
  }
  const stats = modifiedShifts.monthly_stats[month];
  stats.total_modifications += 1;
  if (!stats.employees_modified.includes(employee_id)) stats.employees_modified.push(employee_id);
  stats.modifications_by_user[modified_by] = (stats.modifications_by_user[modified_by]||0)+1;
  saveModified();
}

export function setGoogleLinks(obj: GoogleLinks) {
  googleLinks = obj;
  saveLinks();
}

export function addGoogleLink(monthYear: string, link: string) {
  googleLinks[monthYear] = link;
  saveLinks();
}

export function deleteGoogleLink(monthYear: string) {
  delete googleLinks[monthYear];
  saveLinks();
}

export function resetAdminToGoogle() {
  adminData = deepCopy(googleData);
  saveAdmin();
  mergeDisplay();
}

export function addScheduleChangeRequest(r: Omit<import('./types').ScheduleRequestChange,'id'|'status'|'type'|'created_at'|'approved_at'|'approved_by'>) {
  const file = getScheduleRequests();
  const newReq = {
    ...r,
    id: `shift_change_${file.shift_change_requests.length+1}`,
    status: 'pending' as const,
    type: 'shift_change' as const,
    created_at: new Date().toISOString(),
    approved_at: null,
    approved_by: null
  };
  file.shift_change_requests.push(newReq);
  updateCounts();
  saveRequests();
  return newReq;
}

export function addSwapRequest(r: Omit<import('./types').ScheduleRequestSwap,'id'|'status'|'type'|'created_at'|'approved_at'|'approved_by'>) {
  const file = getScheduleRequests();
  const newReq = {
    ...r,
    id: `swap_${file.swap_requests.length+1}`,
    status: 'pending' as const,
    type: 'swap' as const,
    created_at: new Date().toISOString(),
    approved_at: null,
    approved_by: null
  };
  file.swap_requests.push(newReq);
  updateCounts();
  saveRequests();
  return newReq;
}

export function updateRequestStatus(id: string, status: 'approved'|'rejected', user: string) {
  const file = getScheduleRequests();
  const sc = file.shift_change_requests.find(r=>r.id===id);
  if (sc) {
    sc.status = status;
    if (status==='approved') {
      sc.approved_at = new Date().toISOString();
      sc.approved_by = user;
      file.approved_count += 1;
    }
    updateCounts();
    saveRequests();
    return sc;
  }
  const sw = file.swap_requests.find(r=>r.id===id);
  if (sw) {
    sw.status = status;
    if (status==='approved') {
      sw.approved_at = new Date().toISOString();
      sw.approved_by = user;
      file.approved_count += 1;
    }
    updateCounts();
    saveRequests();
    return sw;
  }
  return null;
}

function updateCounts() {
  const file = getScheduleRequests();
  file.pending_count =
    file.shift_change_requests.filter(r=>r.status==='pending').length +
    file.swap_requests.filter(r=>r.status==='pending').length;
}

export function getPendingRequests() {
  const file = getScheduleRequests();
  return [
    ...file.shift_change_requests.filter(r=>r.status==='pending'),
    ...file.swap_requests.filter(r=>r.status==='pending')
  ];
}

export function getAllRequestsSorted() {
  const file = getScheduleRequests();
  const all = [
    ...file.shift_change_requests,
    ...file.swap_requests
  ];
  return all.sort((a:any,b:any)=> (b.created_at || '').localeCompare(a.created_at || ''));
}

export function findEmployeeInAdmin(employeeId: string) {
  for (const [team, employees] of Object.entries(adminData.teams)) {
    for (const e of employees) {
      if (e.id === employeeId) return { employee:e, team };
    }
  }
  return null;
}

export function findEmployeeInGoogle(employeeId: string) {
  for (const [team, employees] of Object.entries(googleData.teams)) {
    for (const e of employees) {
      if (e.id === employeeId) return { employee:e, team };
    }
  }
  return null;
}

// IMPORTANT: call loadAll() initially