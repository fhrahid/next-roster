"use client";
import { useEffect, useState } from 'react';

interface Props { id: string; }
interface Mod {
  employee_id: string;
  employee_name: string;
  team_name: string;
  date_index: number;
  date_header: string;
  old_shift: string;
  new_shift: string;
  modified_by: string;
  timestamp: string;
  month_year: string;
}

export default function ModifiedShiftsTab({id}:Props) {
  const [recent,setRecent]=useState<Mod[]>([]);
  const [stats,setStats]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [filter,setFilter]=useState('');
  const [userFilter,setUserFilter]=useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/get-modified-shifts').then(r=>r.json());
    if (res.recent_modifications) {
      setRecent(res.recent_modifications);
      setStats(res.monthly_stats);
    }
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  const filtered = recent.filter(m=>{
    if (filter && m.date_header !== filter) return false;
    if (userFilter && !m.modified_by.toLowerCase().includes(userFilter.toLowerCase())) return false;
    return true;
  });

  const uniqueDates = Array.from(new Set(recent.map(r=>r.date_header)));
  const uniqueUsers = Array.from(new Set(recent.map(r=>r.modified_by)));

  return (
    <div id={id} className="tab-pane">
      <h2>Modified Shifts</h2>
      <p>Audit trail of all shift modifications in the current month.</p>

      <div className="stats-bar">
        <div className="stat-chip">Total Mods: {stats?.total_modifications || 0}</div>
        <div className="stat-chip">Employees Modified: {stats?.employees_modified?.length || 0}</div>
        <div className="stat-chip">Users: {Object.keys(stats?.modifications_by_user || {}).length}</div>
        <button className="btn small" onClick={load}>🔄 Refresh</button>
      </div>

      <div className="form-grid two" style={{marginTop:10}}>
        <div>
          <label>Date Filter</label>
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="">All Dates</option>
            {uniqueDates.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label>User Filter</label>
          <input value={userFilter} onChange={e=>setUserFilter(e.target.value)} placeholder="Modified by contains..."/>
        </div>
      </div>

      <div className="table-wrapper" style={{marginTop:16}}>
        <table className="data-table compact">
          <thead>
            <tr>
              <th>Time</th>
              <th>Date</th>
              <th>Employee</th>
              <th>Team</th>
              <th>Old</th>
              <th>New</th>
              <th>Modified By</th>
            </tr>
          </thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan={7}>No modifications</td></tr>}
              {filtered.map(m=>(
                <tr key={m.timestamp + m.employee_id}>
                  <td>{new Date(m.timestamp).toLocaleString()}</td>
                  <td>{m.date_header}</td>
                  <td>{m.employee_name} ({m.employee_id})</td>
                  <td>{m.team_name}</td>
                  <td>{m.old_shift}</td>
                  <td className={m.old_shift!==m.new_shift?'status approved':''}>{m.new_shift}</td>
                  <td>{m.modified_by}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      <h3 style={{marginTop:30}}>By User</h3>
      <div className="table-wrapper">
        <table className="data-table small">
          <thead>
            <tr>
              <th>User</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {stats && Object.entries(stats.modifications_by_user || {}).map(([u,c]:any)=>(
              <tr key={u}>
                <td>{u}</td>
                <td>{c as any}</td>
              </tr>
            ))}
            {(!stats || !Object.keys(stats.modifications_by_user||{}).length) && <tr><td colSpan={2}>No data</td></tr>}
          </tbody>
        </table>
      </div>

      {loading && <div className="inline-loading">Loading modifications...</div>}
      <div className="note-box">
        Only current month modifications shown. Extend the endpoint if you need historical range queries.
      </div>
    </div>
  );
}