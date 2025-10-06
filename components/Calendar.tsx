"use client";
import { useState } from 'react';

interface Day {
  date: string;
  shift: string;
}

interface Props {
  headers: string[];
  schedule: string[];
  onSelect?: (date:string, shift:string)=>void;
}

export default function Calendar({headers,schedule,onSelect}:Props) {
  const [filter,setFilter]=useState('');

  function filtered() {
    if (!filter) return headers.map((h,i)=>({date:h, shift:schedule[i]||''}));
    return headers
      .map((h,i)=>({date:h, shift:schedule[i]||''}))
      .filter(d=>d.shift===filter);
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
            title={d.shift||'N/A'}>
              <span className="cal-date">{d.date}</span>
              <span className="cal-shift">{d.shift||'—'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}