"use client";
import { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { ShiftChangeModal, SwapRequestModal } from './ShiftRequestsModals';

interface ScheduleData {
  employee: { name:string; id:string; team:string };
  today: any;
  tomorrow: any;
  upcoming_work_days: any[];
  planned_time_off: any[];
  shift_changes: any[];
  summary: { next_work_days_count:number; planned_time_off_count:number; shift_changes_count:number };
  success: boolean;
}

interface RequestHistory {
  id:string;
  type:'shift_change'|'swap';
  status:string;
  date:string;
  created_at:string;
  reason:string;
  requested_shift?:string;
  current_shift?:string;
  requester_shift?:string;
  target_shift?:string;
  requester_name?:string;
  target_employee_name?:string;
}

interface Props {
  employeeId: string;
  fullName: string;
  onLogout: ()=>void;
}

export default function ClientDashboard({employeeId, fullName, onLogout}:Props) {
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [data,setData]=useState<ScheduleData|null>(null);
  const [roster,setRoster]=useState<any>(null);
  const [requests,setRequests]=useState<RequestHistory[]>([]);
  const [selectedDate,setSelectedDate]=useState<string>('');
  const [selectedShift,setSelectedShift]=useState<string>('');
  const [teamMembers,setTeamMembers]=useState<{id:string; name:string; shift:string}[]>([]);
  const [showChange,setShowChange]=useState(false);
  const [showSwap,setShowSwap]=useState(false);
  const [teamShiftArray,setTeamShiftArray]=useState<string[]>([]);
  const [headers,setHeaders]=useState<string[]>([]);
  const [mySchedule,setMySchedule]=useState<string[]>([]);
  const [refreshing,setRefreshing]=useState(false);

  async function loadSchedule() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/my-schedule/${employeeId}`);
      const j = await res.json();
      if (!res.ok || !j.success) {
        setError(j.error||'Error loading schedule'); setLoading(false); return;
      }
      setData(j);
    } catch(e:any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function loadRoster() {
    const res = await fetch('/api/admin/get-display-data').then(r=>r.json());
    setRoster(res);
    setHeaders(res.headers||[]);
    const team = Object.entries(res.teams||{}).find(([,list]:any)=> list.some((e:any)=> e.id===employeeId));
    if (team) {
      const employees = team[1] as any[];
      const mine = employees.find(e=>e.id===employeeId);
      setMySchedule(mine.schedule);
      setTeamShiftArray(mine.schedule);
    }
  }

  async function loadRequests() {
    const res = await fetch('/api/schedule-requests/get-employee-requests',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({employeeId})
    }).then(r=>r.json());
    if (res.success) {
      // sort newest
      const sorted = res.requests.sort((a:any,b:any)=> (b.created_at || '').localeCompare(a.created_at||''));
      setRequests(sorted);
    }
  }

  async function refreshAll() {
    setRefreshing(true);
    await Promise.all([loadSchedule(), loadRoster(), loadRequests()]);
    setRefreshing(false);
  }

  useEffect(()=>{ refreshAll(); },[employeeId]);

  function onCalendarSelect(date:string, shift:string) {
    setSelectedDate(date);
    setSelectedShift(shift);
  }

  async function openShiftChange() {
    if (!selectedDate) { alert('Select a date on the calendar first'); return; }
    setShowChange(true);
  }

  async function openSwap() {
    if (!selectedDate) { alert('Select a date on the calendar first'); return; }
    if (!data) return;
    // fetch team members with shift on that date
    const res = await fetch('/api/schedule-requests/get-team-members',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({teamName:data.employee.team, currentEmployeeId:employeeId, date:selectedDate})
    }).then(r=>r.json());
    if (!res.success) { alert(res.error||'Could not load teammates'); return; }
    setTeamMembers(res.teamMembers);
    setShowSwap(true);
  }

  function myShiftForDate(date:string) {
    const idx = headers.indexOf(date);
    if (idx === -1) return '';
    return mySchedule[idx] || '';
  }

  return (
    <div className="container">
      <header>
        <h1>🛒 Cartup CxP Roster Viewer 🛒</h1>
        <p className="subtitle">Employee Schedule Portal</p>
      </header>
      <div className="app-container">
        <div className="app-header">
          <div>
            <h2>Shift Dashboard</h2>
            <div className="user-info" style={{display:'flex', flexDirection:'column', gap:6}}>
              <span>Welcome, <strong>{fullName}</strong> ({employeeId})</span>
              <div className="user-actions" style={{display:'flex', gap:10}}>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
                <button className="btn small" onClick={refreshAll} disabled={refreshing}>
                  {refreshing ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
          </div>
          <div className="sync-controls">
            <div className="sync-status">
              {loading? 'Loading schedule...' : 'Schedule Loaded'}
            </div>
            <div style={{fontSize:'.55rem', letterSpacing:'.8px', textTransform:'uppercase', color:'#6E8298'}}>
              Select a date below to request a change or swap
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!loading && data &&
          <>
            <div className="shifts-panel" style={{display:'block'}}>
              <div className="employee-header">
                <div>
                  <div className="employee-name">{data.employee.name}</div>
                  <div className="employee-id">{data.employee.id}</div>
                </div>
                <div className="employee-category">{data.employee.team}</div>
              </div>
              <div className="shift-row">
                <div className="shift-label">Today ({data.today.date || 'N/A'}):</div>
                <div className="shift-code">{data.today.shift}</div>
              </div>
              <div className="shift-row">
                <div className="shift-label">Tomorrow ({data.tomorrow.date || 'N/A'}):</div>
                <div className="shift-code">{data.tomorrow.shift}</div>
              </div>
              <div className="actions-row" style={{marginTop:14}}>
                <button className="btn primary small" onClick={openShiftChange} disabled={!selectedDate}>✏️ Request Shift Change</button>
                <button className="btn small" onClick={openSwap} disabled={!selectedDate}>🔁 Request Swap</button>
                <span style={{fontSize:'.6rem', letterSpacing:'.8px', color:'#8094AA'}}>
                  Selected: {selectedDate ? `${selectedDate} (${myShiftForDate(selectedDate) || 'N/A'})` : 'None'}
                </span>
              </div>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <div className="stat-number">{data.summary.next_work_days_count}</div>
                    <div className="stat-label">Upcoming Days</div>
                    <div className="stat-subtitle">Next 7 view</div>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon">🏖️</div>
                  <div className="stat-content">
                    <div className="stat-number">{data.summary.planned_time_off_count}</div>
                    <div className="stat-label">Planned Time Off</div>
                    <div className="stat-subtitle">30 days span</div>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-icon">🔄</div>
                  <div className="stat-content">
                    <div className="stat-number">{data.summary.shift_changes_count}</div>
                    <div className="stat-label">Shift Changes</div>
                    <div className="stat-subtitle">Vs original</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{marginTop:10}}>Calendar</h3>
            <Calendar
              headers={headers}
              schedule={mySchedule}
              onSelect={(d,s)=>onCalendarSelect(d,s)}
            />

            <div style={{display:'grid', gap:22, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', marginTop:40}}>
              <div>
                <h3 style={{margin:'0 0 10px'}}>Upcoming Work Days</h3>
                <div className="table-wrapper">
                  <table className="data-table small">
                    <thead>
                      <tr><th>Date</th><th>Day</th><th>Shift</th></tr>
                    </thead>
                    <tbody>
                      {data.upcoming_work_days.length===0 && <tr><td colSpan={3}>None</td></tr>}
                      {data.upcoming_work_days.map((d:any)=>(
                        <tr key={d.date}>
                          <td>{d.date}</td>
                          <td>{d.day}</td>
                          <td>{d.shift}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 style={{margin:'0 0 10px'}}>Planned Time Off</h3>
                <div className="table-wrapper">
                  <table className="data-table small">
                    <thead>
                      <tr><th>Date</th><th>Day</th><th>Code</th></tr>
                    </thead>
                    <tbody>
                      {data.planned_time_off.length===0 && <tr><td colSpan={3}>None</td></tr>}
                      {data.planned_time_off.map((d:any)=>(
                        <tr key={d.date}>
                          <td>{d.date}</td>
                          <td>{d.day}</td>
                          <td>{d.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 style={{margin:'0 0 10px'}}>Recent Shift Changes</h3>
                <div className="table-wrapper">
                  <table className="data-table small">
                    <thead>
                      <tr><th>Date</th><th>Orig</th><th>Now</th></tr>
                    </thead>
                    <tbody>
                      {data.shift_changes.length===0 && <tr><td colSpan={3}>None</td></tr>}
                      {data.shift_changes.map((c:any)=>(
                        <tr key={c.date}>
                          <td>{c.date}</td>
                          <td>{c.original_shift}</td>
                          <td className="status approved">{c.current_shift}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 style={{margin:'0 0 10px'}}>My Requests</h3>
                <div className="table-wrapper">
                  <table className="data-table small">
                    <thead>
                      <tr><th>ID</th><th>Type</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {requests.length===0 && <tr><td colSpan={4}>No requests</td></tr>}
                      {requests.slice(0,25).map(r=>(
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.type==='swap'?'Swap':'Change'}</td>
                          <td>{r.date}</td>
                          <td className={`status ${r.status}`}>{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{fontSize:'.55rem', color:'#7D91A5', marginTop:6}}>
                  Showing latest {Math.min(requests.length,25)}
                </div>
              </div>
            </div>
          </>
        }
      </div>

      {data &&
        <ShiftChangeModal
          open={showChange}
          onClose={()=>setShowChange(false)}
          employeeId={employeeId}
          employeeName={data.employee.name}
          team={data.employee.team}
          date={selectedDate}
          currentShift={myShiftForDate(selectedDate)}
          onSubmitted={()=>{ loadRequests(); }}
        />
      }

      {data &&
        <SwapRequestModal
          open={showSwap}
          onClose={()=>setShowSwap(false)}
            requesterId={employeeId}
            requesterName={data.employee.name}
            team={data.employee.team}
            date={selectedDate}
            requesterShift={myShiftForDate(selectedDate)}
            teamMembers={teamMembers}
            onSubmitted={()=>{ loadRequests(); }}
        />
      }
    </div>
  );
}