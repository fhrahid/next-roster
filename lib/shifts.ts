import { getAdmin, trackModifiedShift, setAdmin, mergeDisplay } from './dataStore';

export function updateShift(employeeId: string, dateIndex: number, newShift: string, googleOriginal: string, modifiedBy: string) {
  const admin = getAdmin();
  let found = false;
  for (const [teamName, emps] of Object.entries(admin.teams)) {
    const emp = emps.find(e=>e.id===employeeId);
    if (emp) {
      if (dateIndex >=0 && dateIndex < emp.schedule.length) {
        const old = emp.schedule[dateIndex];
        emp.schedule[dateIndex] = newShift;
        if (newShift !== googleOriginal) {
          const dateHeader = admin.headers[dateIndex] || `Date_${dateIndex}`;
            trackModifiedShift(employeeId, dateIndex, old, newShift, emp.name, teamName, dateHeader, modifiedBy);
        }
        found = true;
        break;
      }
    }
  }
  if (found) {
    setAdmin(admin);
    mergeDisplay();
    return true;
  }
  return false;
}

export function applyShiftChangeRequest(req: any, approvedBy: string) {
  updateShift(req.employee_id,
    getAdmin().headers.indexOf(req.date),
    req.requested_shift,
    req.current_shift,
    `Schedule Request (Approved by ${approvedBy})`
  );
}

export function applySwap(req: any, approvedBy: string) {
  const admin = getAdmin();
  const idx = admin.headers.indexOf(req.date);
  if (idx === -1) return;
  let requesterRef: {emp:any, team:string}|null = null;
  let targetRef: {emp:any, team:string}|null = null;

  for (const [team, emps] of Object.entries(admin.teams)) {
    emps.forEach(e=>{
      if (e.id===req.requester_id) requesterRef = {emp:e, team};
      if (e.id===req.target_employee_id) targetRef = {emp:e, team};
    });
  }
  if (requesterRef && targetRef) {
    const rOld = requesterRef.emp.schedule[idx];
    const tOld = targetRef.emp.schedule[idx];
    requesterRef.emp.schedule[idx] = tOld;
    targetRef.emp.schedule[idx] = rOld;
    // track
    // For simplicity old shift from google can't be easily known; we keep old->new
    // you may want to store google original if needed (pass them in request)
    trackModifiedShift(
      requesterRef.emp.id,
      idx,
      rOld,
      tOld,
      requesterRef.emp.name,
      requesterRef.team,
      admin.headers[idx],
      `Swap Request (Approved by ${approvedBy})`
    );
    trackModifiedShift(
      targetRef.emp.id,
      idx,
      tOld,
      rOld,
      targetRef.emp.name,
      targetRef.team,
      admin.headers[idx],
      `Swap Request (Approved by ${approvedBy})`
    );
    setAdmin(admin);
    mergeDisplay();
  }
}