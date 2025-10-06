"use client";
import { useState } from 'react';
import { SHIFT_MAP } from '@/lib/constants';

interface Day {
  date: string;
  shift: string;
  shiftTime: string;
}

interface Props {
  headers: string[];
  schedule: string[];
  onSelect?: (date:string, shift:string)=>void;
}

export default function Calendar({headers,schedule,onSelect}:Props) {
  const [filter,setFilter]=useState('');

  function filtered() {
    const days = headers.map((h,i)=>({
      date:h, 
      shift:schedule[i]||'',
      shiftTime: SHIFT_MAP[schedule[i]||''] || schedule[i] || 'N/A'
    }));
    if (!filter) return days;
    return days.filter(d=>d.shift===filter);
  }

  return (
    <div className="calendar-box">
      <div className="calendar-filters">
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">All Shifts</option>
          {['M2','M3','M4','D1','D2','DO','SL','CL','EL'].map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        {filter && <button className="btn tiny" onClick={()=>setFilter('')}>Clear</button>}
      </div>
      <div className="calendar-grid">
        {filtered().map(d=>(
          <button
            key={d.date}
            className={`cal-day ${d.shift || 'empty'}`}
            onClick={()=>onSelect && onSelect(d.date,d.shift)}
            title={`${d.date} - ${d.shiftTime}`}>
              <span className="cal-date">{d.date}</span>
              <span className="cal-shift">{d.shiftTime||'—'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}