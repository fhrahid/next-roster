"use client";
import Modal from './Shared/Modal';
import { useState } from 'react';

interface ShiftChangeProps {
  open: boolean;
  onClose: ()=>void;
  employeeId: string;
  employeeName: string;
  team: string;
  date: string;
  currentShift: string;
  onSubmitted: ()=>void;
}

export function ShiftChangeModal(props:ShiftChangeProps) {
  const {open,onClose,employeeId,employeeName,team,date,currentShift,onSubmitted} = props;
  const [requested,setRequested]=useState('');
  const [reason,setReason]=useState('');
  const [loading,setLoading]=useState(false);
  const shiftCodes = ['M2','M3','M4','D1','D2','DO','SL','CL','EL'];

  async function submit() {
    if (!requested || !reason) return;
    setLoading(true);
    const res = await fetch('/api/schedule-requests/submit-shift-change',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        employeeId, employeeName, team,
        date, currentShift, requestedShift: requested, reason
      })
    }).then(r=>r.json());
    setLoading(false);
    if (!res.success) alert(res.error); else {
      onSubmitted();
      onClose();
      setRequested('');
      setReason('');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request Shift Change">
      <p><strong>{employeeName}</strong> – {employeeId}</p>
      <p>Date: {date}</p>
      <p>Current: {currentShift}</p>
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
        <button className="btn primary" disabled={loading||!requested||!reason} onClick={submit}>
          {loading? 'Submitting...' : 'Submit'}
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
  date: string;
  requesterShift: string;
  teamMembers: {id:string; name:string; shift:string}[];
  onSubmitted: ()=>void;
}

export function SwapRequestModal(props:SwapProps) {
  const {open,onClose,requesterId,requesterName,team,date,requesterShift,teamMembers,onSubmitted} = props;
  const [target,setTarget]=useState('');
  const [reason,setReason]=useState('');
  const [loading,setLoading]=useState(false);

  const targetEmployee = teamMembers.find(m=>m.id===target);

  async function submit() {
    if (!target || !reason) return;
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
        date,
        requesterShift,
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
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request Shift Swap">
      <p><strong>{requesterName}</strong> – {requesterId}</p>
      <p>Date: {date}</p>
      <p>Your Shift: {requesterShift}</p>
      <div className="form-group">
        <label>Swap With</label>
        <select value={target} onChange={e=>setTarget(e.target.value)}>
          <option value="">Select team member...</option>
          {teamMembers.filter(m=>m.shift).map(m=>(
            <option key={m.id} value={m.id}>{m.name} ({m.shift})</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Reason</label>
        <textarea rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why do you need this swap?"/>
      </div>
      <div className="actions-row">
        <button className="btn primary" disabled={loading||!target||!reason} onClick={submit}>
          {loading? 'Submitting...' : 'Submit'}
        </button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}