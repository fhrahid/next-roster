"use client";
import { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { ShiftChangeModal, SwapRequestModal } from './ShiftRequestsModals';
import StatCard from './Shared/StatCard';
import EmployeeSearch from './Shared/EmployeeSearch';
import ShiftView from './ShiftView';
import ParticleBackground from './Shared/ParticleBackground';
import CalendarSelector from './Shared/CalendarSelector';

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
  const [viewingEmployeeId,setViewingEmployeeId]=useState<string>(employeeId);
  const [viewingEmployeeData,setViewingEmployeeData]=useState<ScheduleData|null>(null);
  const [viewingEmployeeSchedule,setViewingEmployeeSchedule]=useState<string[]>([]);
  const [approvedRequests,setApprovedRequests]=useState<RequestHistory[]>([]);

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
      
      // Filter approved requests for stat card
      const approved = sorted.filter((r: RequestHistory) => r.status === 'approved');
      setApprovedRequests(approved);
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
    setShowChange(true);
  }

  async function openSwap() {
    setShowSwap(true);
  }

  function myShiftForDate(date:string) {
    const idx = headers.indexOf(date);
    if (idx === -1) return '';
    return mySchedule[idx] || '';
  }

  const handleEmployeeSearch = async (employee: any) => {
    // Load the employee's schedule data
    const res = await fetch(`/api/my-schedule/${employee.id}`);
    const j = await res.json();
    if (j.success) {
      setViewingEmployeeId(employee.id);
      setViewingEmployeeData(j);
      
      // Load their schedule from roster
      if (roster?.teams) {
        Object.entries(roster.teams).forEach(([teamName, teamEmployees]: [string, any]) => {
          const emp = teamEmployees.find((e: any) => e.id === employee.id);
          if (emp) {
            setViewingEmployeeSchedule(emp.schedule);
          }
        });
      }
    }
  };

  const resetToMySchedule = () => {
    setViewingEmployeeId(employeeId);
    setViewingEmployeeData(null);
    setViewingEmployeeSchedule([]);
  };

  const isViewingOtherEmployee = viewingEmployeeId !== employeeId;

  const getAllEmployees = () => {
    if (!roster?.teams) return [];
    const employees: any[] = [];
    Object.entries(roster.teams).forEach(([teamName, teamEmployees]: [string, any]) => {
      teamEmployees.forEach((emp: any) => {
        employees.push({
          id: emp.id,
          name: emp.name,
          team: teamName
        });
      });
    });
    return employees;
  };

  return (
    <div className="container">
      <ParticleBackground />
      <header style={{position: 'relative', zIndex: 1}}>
        <h1>🛒 Cartup CxP Roster Viewer 🛒</h1>
        <p className="subtitle">Employee Schedule Portal</p>
      </header>
      <div className="app-container" style={{position: 'relative', zIndex: 1}}>
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
                  <div className="employee-name">
                    {isViewingOtherEmployee && viewingEmployeeData 
                      ? viewingEmployeeData.employee.name 
                      : data.employee.name}
                  </div>
                  <div className="employee-id">
                    {isViewingOtherEmployee && viewingEmployeeData 
                      ? viewingEmployeeData.employee.id 
                      : data.employee.id}
                  </div>
                </div>
                <div className="employee-category">
                  {isViewingOtherEmployee && viewingEmployeeData 
                    ? viewingEmployeeData.employee.team 
                    : data.employee.team}
                </div>
              </div>
              
              {isViewingOtherEmployee && (
                <div style={{marginBottom: 10}}>
                  <button className="btn small" onClick={resetToMySchedule}>
                    ← Back to My Schedule
                  </button>
                </div>
              )}

              <div className="shift-row">
                <div className="shift-label">
                  Today ({isViewingOtherEmployee && viewingEmployeeData ? viewingEmployeeData.today.date : data.today.date || 'N/A'}):
                </div>
                <div className="shift-code">
                  {isViewingOtherEmployee && viewingEmployeeData ? viewingEmployeeData.today.shift : data.today.shift}
                </div>
              </div>
              <div className="shift-row">
                <div className="shift-label">
                  Tomorrow ({isViewingOtherEmployee && viewingEmployeeData ? viewingEmployeeData.tomorrow.date : data.tomorrow.date || 'N/A'}):
                </div>
                <div className="shift-code">
                  {isViewingOtherEmployee && viewingEmployeeData ? viewingEmployeeData.tomorrow.shift : data.tomorrow.shift}
                </div>
              </div>
              
              {selectedDate && (
                <div className="shift-row">
                  <div className="shift-label">Selected Date ({selectedDate}):</div>
                  <div className="shift-code">{selectedShift || 'N/A'}</div>
                </div>
              )}

              <div className="actions-row" style={{marginTop:14, flexWrap: 'wrap'}}>
                {!isViewingOtherEmployee && (
                  <>
                    <button className="btn primary small" onClick={openShiftChange}>✏️ Request Shift Change</button>
                    <button className="btn small" onClick={openSwap}>🔁 Request Swap</button>
                  </>
                )}
                {roster && <ShiftView roster={roster} headers={headers} />}
              </div>
            </div>

            {roster && getAllEmployees().length > 0 && (
              <div style={{marginTop: 20}}>
                <h3 style={{marginBottom: 10}}>Search Other Employees</h3>
                <EmployeeSearch 
                  employees={getAllEmployees()}
                  onSelect={handleEmployeeSearch}
                  placeholder="Search employees by name, ID, or team..."
                />
              </div>
            )}

            <div className="dashboard-stats">
              <StatCard
                icon="📅"
                value={isViewingOtherEmployee && viewingEmployeeData 
                  ? viewingEmployeeData.summary.next_work_days_count 
                  : data.summary.next_work_days_count}
                label="Upcoming Days"
                subtitle="Next 7 view"
                details={isViewingOtherEmployee && viewingEmployeeData 
                  ? viewingEmployeeData.upcoming_work_days 
                  : data.upcoming_work_days}
                detailsType="workdays"
              />
              <StatCard
                icon="🏖️"
                value={isViewingOtherEmployee && viewingEmployeeData 
                  ? viewingEmployeeData.summary.planned_time_off_count 
                  : data.summary.planned_time_off_count}
                label="Planned Time Off"
                subtitle="30 days span"
                details={isViewingOtherEmployee && viewingEmployeeData 
                  ? viewingEmployeeData.planned_time_off 
                  : data.planned_time_off}
                detailsType="timeoff"
              />
              <StatCard
                icon="🔄"
                value={isViewingOtherEmployee && viewingEmployeeData 
                  ? viewingEmployeeData.summary.shift_changes_count 
                  : data.summary.shift_changes_count}
                label="Shift Changes"
                subtitle="Vs original"
                details={isViewingOtherEmployee && viewingEmployeeData 
                  ? viewingEmployeeData.shift_changes 
                  : data.shift_changes}
                detailsType="changes"
              />
              {!isViewingOtherEmployee && approvedRequests.length > 0 && (
                <StatCard
                  icon="✅"
                  value={approvedRequests.length}
                  label="Approved Shifts"
                  subtitle="Approved requests"
                  details={approvedRequests.map(r => ({
                    date: r.date,
                    type: r.type,
                    original_shift: r.current_shift || r.requester_shift || 'N/A',
                    current_shift: r.requested_shift || r.target_shift || 'N/A'
                  }))}
                  detailsType="changes"
                />
              )}
            </div>

            <div style={{marginTop: 30}}>
              <h3 style={{marginBottom: 10}}>Schedule Calendar</h3>
              <CalendarSelector
                headers={headers}
                schedule={isViewingOtherEmployee ? viewingEmployeeSchedule : mySchedule}
                selectedDate={selectedDate}
                onSelect={(d,s)=>onCalendarSelect(d,s)}
              />
            </div>

            <div style={{marginTop: 40}}>
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
          headers={headers}
          mySchedule={mySchedule}
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
          headers={headers}
          mySchedule={mySchedule}
          onSubmitted={()=>{ loadRequests(); }}
        />
      }
    </div>
  );
}