"use client";
import Modal from './Shared/Modal';
import { useState, useEffect } from 'react';
import MiniCalendar from './Shared/MiniCalendar';

interface ShiftChangeProps {
  open: boolean;
  onClose: ()=>void;
  employeeId: string;
  employeeName: string;
  team: string;
  date?: string;
  currentShift?: string;
  onSubmitted: ()=>void;
  headers?: string[];
  mySchedule?: string[];
}

export function ShiftChangeModal(props:ShiftChangeProps) {
  const {open,onClose,employeeId,employeeName,team,date,currentShift,onSubmitted,headers,mySchedule} = props;
  const [selectedDate, setSelectedDate] = useState(date || '');
  const [requested,setRequested]=useState('');
  const [reason,setReason]=useState('');
  const [loading,setLoading]=useState(false);
  const shiftCodes = ['M2','M3','M4','D1','D2','DO','SL','CL','EL'];

  useEffect(() => {
    if (date) setSelectedDate(date);
  }, [date]);

  const getCurrentShift = () => {
    if (currentShift) return currentShift;
    if (!headers || !mySchedule || !selectedDate) return '';
    const idx = headers.indexOf(selectedDate);
    return idx >= 0 ? mySchedule[idx] : '';
  };

  async function submit() {
    if (!requested || !reason || !selectedDate) return;
    setLoading(true);
    const res = await fetch('/api/schedule-requests/submit-shift-change',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        employeeId, employeeName, team,
        date: selectedDate, currentShift: getCurrentShift(), requestedShift: requested, reason
      })
    }).then(r=>r.json());
    setLoading(false);
    if (!res.success) alert(res.error); else {
      onSubmitted();
      onClose();
      setRequested('');
      setReason('');
      setSelectedDate('');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request Shift Change">
      <div className="modal-info-card">
        <div className="modal-info-row">
          <span className="modal-info-label">Employee:</span>
          <span className="modal-info-value">{employeeName} ({employeeId})</span>
        </div>
        <div className="modal-info-row">
          <span className="modal-info-label">Team:</span>
          <span className="modal-info-value">{team}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Select Date</label>
        {headers && mySchedule && headers.length > 0 ? (
          <MiniCalendar 
            headers={headers}
            schedule={mySchedule}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        ) : (
          <input type="text" value={selectedDate} disabled />
        )}
      </div>

      {selectedDate && (
        <div className="shift-info-display">
          <span className="shift-info-label">Current Shift:</span>
          <span className="shift-info-badge">{getCurrentShift() || 'N/A'}</span>
        </div>
      )}

      <div className="form-group">
        <label>Requested Shift</label>
        <select value={requested} onChange={e=>setRequested(e.target.value)}>
          <option value="">Select...</option>
          {shiftCodes.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Reason</label>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain your need..." rows={3}/>
      </div>
      <div className="actions-row">
        <button className="btn primary" disabled={loading||!requested||!reason||!selectedDate} onClick={submit}>
          {loading? 'Submitting...' : 'Submit Request'}
        </button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

interface SwapProps {
  open: boolean;
  onClose: ()=>void;
  requesterId: string;
  requesterName: string;
  team: string;
  date?: string;
  requesterShift?: string;
  teamMembers?: {id:string; name:string; shift:string}[];
  onSubmitted: ()=>void;
  headers?: string[];
  mySchedule?: string[];
}

export function SwapRequestModal(props:SwapProps) {
  const {open,onClose,requesterId,requesterName,team,date,requesterShift,teamMembers,onSubmitted,headers,mySchedule} = props;
  const [selectedDate, setSelectedDate] = useState(date || '');
  const [target,setTarget]=useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reason,setReason]=useState('');
  const [loading,setLoading]=useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [currentTeamMembers, setCurrentTeamMembers] = useState(teamMembers || []);

  useEffect(() => {
    if (date) setSelectedDate(date);
    if (teamMembers) setCurrentTeamMembers(teamMembers);
  }, [date, teamMembers]);

  useEffect(() => {
    if (selectedDate && open) {
      loadTeamMembers();
    }
  }, [selectedDate, open]);

  const loadTeamMembers = async () => {
    if (!selectedDate) return;
    setLoadingMembers(true);
    try {
      const res = await fetch('/api/schedule-requests/get-team-members',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({teamName:team, currentEmployeeId:requesterId, date:selectedDate})
      }).then(r=>r.json());
      if (res.success) {
        setCurrentTeamMembers(res.teamMembers);
      }
    } catch (e) {
      console.error('Failed to load team members', e);
    }
    setLoadingMembers(false);
  };

  const getMyShift = () => {
    if (requesterShift) return requesterShift;
    if (!headers || !mySchedule || !selectedDate) return '';
    const idx = headers.indexOf(selectedDate);
    return idx >= 0 ? mySchedule[idx] : '';
  };

  const targetEmployee = currentTeamMembers.find(m=>m.id===target);

  const filteredMembers = currentTeamMembers.filter(m => 
    m.shift && (
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  async function submit() {
    if (!target || !reason || !selectedDate) return;
    if (!targetEmployee) return;
    setLoading(true);
    const res = await fetch('/api/schedule-requests/submit-swap-request',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        requesterId,
        requesterName,
        targetEmployeeId: targetEmployee.id,
        targetEmployeeName: targetEmployee.name,
        team,
        date: selectedDate,
        requesterShift: getMyShift(),
        targetShift: targetEmployee.shift,
        reason
      })
    }).then(r=>r.json());
    setLoading(false);
    if (!res.success) alert(res.error);
    else {
      onSubmitted();
      onClose();
      setTarget('');
      setReason('');
      setSearchTerm('');
      setSelectedDate('');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request Shift Swap">
      <div className="modal-info-card">
        <div className="modal-info-row">
          <span className="modal-info-label">Requester:</span>
          <span className="modal-info-value">{requesterName} ({requesterId})</span>
        </div>
        <div className="modal-info-row">
          <span className="modal-info-label">Team:</span>
          <span className="modal-info-value">{team}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Select Date</label>
        {headers && mySchedule && headers.length > 0 ? (
          <MiniCalendar 
            headers={headers}
            schedule={mySchedule}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        ) : (
          <input type="text" value={selectedDate} disabled />
        )}
      </div>

      {selectedDate && (
        <div className="shift-info-display">
          <span className="shift-info-label">Your Shift:</span>
          <span className="shift-info-badge">{getMyShift() || 'N/A'}</span>
        </div>
      )}

      {selectedDate && (
        <>
          <div className="form-group">
            <label>Search Team Member</label>
            <input 
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Swap With</label>
            {loadingMembers ? (
              <div className="inline-loading">Loading team members...</div>
            ) : (
              <select value={target} onChange={e=>setTarget(e.target.value)}>
                <option value="">Select team member...</option>
                {filteredMembers.map(m=>(
                  <option key={m.id} value={m.id}>{m.name} - {m.shift}</option>
                ))}
              </select>
            )}
          </div>

          {targetEmployee && (
            <div className="swap-comparison">
              <div className="swap-comparison-item">
                <div className="swap-comparison-label">You</div>
                <div className="swap-comparison-shift">{getMyShift()}</div>
              </div>
              <div className="swap-comparison-arrow">⇄</div>
              <div className="swap-comparison-item">
                <div className="swap-comparison-label">{targetEmployee.name}</div>
                <div className="swap-comparison-shift">{targetEmployee.shift}</div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="form-group">
        <label>Reason</label>
        <textarea rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why do you need this swap?"/>
      </div>
      <div className="actions-row">
        <button className="btn primary" disabled={loading||!target||!reason||!selectedDate} onClick={submit}>
          {loading? 'Submitting...' : 'Submit Request'}
        </button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}