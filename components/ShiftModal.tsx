"use client";
import Modal from './Shared/Modal';
import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: ()=>void;
  date: string;
  current: string;
  onSave: (newShift:string)=>void;
}

const SHIFT_CODES = ['M2','M3','M4','D1','D2','DO','SL','CL','EL'];

export default function ShiftModal({open,onClose,date,current,onSave}:Props) {
  const [value,setValue]=useState(current);
  useEffect(()=>{ setValue(current); },[current,open]);

  return (
    <Modal open={open} onClose={onClose} title={`Edit Shift – ${date}`}>
      <div className="form-group">
        <label>Shift Code</label>
        <select value={value} onChange={e=>setValue(e.target.value)}>
          {SHIFT_CODES.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="actions-row">
        <button className="btn primary" onClick={()=>{onSave(value); onClose();}}>Save</button>
        <button className="btn" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}