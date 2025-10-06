"use client";
import { useState } from 'react';

interface Props {
  headers: string[];
  teams: Record<string, any[]>;
  editable?: boolean;
  onUpdateShift?: (employeeId:string,dateIndex:number,newShift:string)=>void;
}

const SHIFT_CODES = ['','M2','M3','M4','D1','D2','DO','SL','CL','EL'];

export default function RosterTable({headers, teams, editable=false, onUpdateShift}:Props) {
  const [editCell,setEditCell]=useState<{emp:string,idx:number}|null>(null);
  const [tempValue,setTempValue]=useState('');

  function startEdit(empId:string, idx:number, current:string) {
    if (!editable) return;
    setEditCell({emp:empId, idx});
    setTempValue(current);
  }

  function commit() {
    if (editCell && onUpdateShift) {
      onUpdateShift(editCell.emp, editCell.idx, tempValue.toUpperCase().trim());
    }
    setEditCell(null);
    setTempValue('');
  }

  function cancel() {
    setEditCell(null);
    setTempValue('');
  }

  function renderCell(emp:any, idx:number) {
    const value = emp.schedule[idx] || '';
    const isEditing = editCell && editCell.emp===emp.id && editCell.idx===idx;
    const cls = `shift-cell ${value ? 'filled':''}`;

    if (!editable) {
      return <td key={idx} className={cls}>{value}</td>;
    }

    if (isEditing) {
      return (
        <td key={idx} className={cls + ' editing'}>
          <div className="edit-wrapper">
            <input
              value={tempValue}
              onChange={e=>setTempValue(e.target.value)}
              list="shift-codes"
              autoFocus
              onKeyDown={e=>{
                if (e.key==='Enter') commit();
                if (e.key==='Escape') cancel();
              }}
            />
            <datalist id="shift-codes">
              {SHIFT_CODES.map(c=> <option key={c} value={c} />)}
            </datalist>
            <div className="edit-actions">
              <button className="icon-btn success" title="Save" onClick={commit}>✅</button>
              <button className="icon-btn danger" title="Cancel" onClick={cancel}>✖</button>
            </div>
          </div>
        </td>
      );
    }

    return (
      <td
        key={idx}
        className={cls + ' editable'}
        onClick={()=>startEdit(emp.id, idx, value)}
        title="Click to edit"
      >
        {value}
      </td>
    );
  }

  return (
    <div className="roster-wrapper">
      {Object.keys(teams).length===0 && <div className="empty">No teams to display</div>}
      {Object.entries(teams).map(([team, employees])=>(
        <div key={team} className="team-block">
          <div className="team-header-row">
            <h3>{team}</h3>
            <span className="team-count">{employees.length} members</span>
          </div>
          <div className="table-scroll">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  {headers.map((h,i)=><th key={i} className="date-col">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp=>(
                  <tr key={emp.id}>
                    <td className="emp-name">{emp.name}</td>
                    <td className="emp-id">{emp.id}</td>
                    {headers.map((_,i)=> renderCell(emp,i))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}