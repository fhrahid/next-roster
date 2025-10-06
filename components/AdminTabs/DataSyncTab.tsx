"use client";
import { useState, useEffect } from 'react';
interface Props { id: string; }
export default function DataSyncTab({id}:Props) {
  const [googleStatus,setGoogleStatus]=useState('Not loaded');
  const [adminStatus,setAdminStatus]=useState('Not loaded');
  const [stats,setStats]=useState({employees:0, teams:0, dates:0, modified:0});
  const [syncing,setSyncing]=useState(false);
  const [loading,setLoading]=useState(true);

  async function load() {
    setLoading(true);
    try {
      const disp = await fetch('/api/admin/get-display-data').then(r=>r.json());
      const gRes = await fetch('/api/admin/get-google-data');
      const aRes = await fetch('/api/admin/get-admin-data');
      const g = gRes.ok ? await gRes.json() : null;
      const a = aRes.ok ? await aRes.json() : null;
      setStats({
        employees: disp.allEmployees?.length||0,
        teams: Object.keys(disp.teams||{}).length,
        dates: disp.headers?.length||0,
        modified: await calcModified(g,a)
      });
      setGoogleStatus(g?.allEmployees?.length? `${g.allEmployees.length} employees loaded` : 'Not loaded');
      setAdminStatus(a?.allEmployees?.length? `${a.allEmployees.length} employees` : 'Not available');
    } catch(e:any){
      console.error(e);
    }
    setLoading(false);
  }

  async function calcModified(g:any,a:any) {
    if (!g || !a) return 0;
    let count=0;
    for (const team of Object.keys(a.teams||{})) {
      if (!g.teams[team]) continue;
      for (const adm of a.teams[team]) {
        const goog = g.teams[team].find((e:any)=>e.id===adm.id);
        if (goog) {
          for (let i=0;i<adm.schedule.length;i++) {
            if (adm.schedule[i]!==goog.schedule[i] && adm.schedule[i]!=='') count++;
          }
        }
      }
    }
    return count;
  }

  async function syncSheets() {
    setSyncing(true);
    const res = await fetch('/api/admin/sync-google-sheets',{method:'POST'}).then(r=>r.json());
    setSyncing(false);
    alert(res.success? res.message : res.error);
    load();
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div id={id} className="tab-pane">
      <h2>Data Sync Management</h2>
      <p>Sync data from Google Sheets and view system statistics.</p>
      <div className="actions-row">
        <button onClick={syncSheets} disabled={syncing} className="btn primary">
          {syncing? '⏳ Syncing...' : '🔄 Sync Google Sheets Now'}
        </button>
      </div>
      <div className="status-grid">
        <div className="status-card">
          <h4>Google Data</h4>
          <p>{googleStatus}</p>
        </div>
        <div className="status-card">
          <h4>Admin Data</h4>
          <p>{adminStatus}</p>
        </div>
        <div className="status-card">
          <h4>Employees</h4>
          <p>{stats.employees}</p>
        </div>
        <div className="status-card">
          <h4>Teams</h4>
          <p>{stats.teams}</p>
        </div>
        <div className="status-card">
          <h4>Date Columns</h4>
          <p>{stats.dates}</p>
        </div>
        <div className="status-card">
          <h4>Modified Shifts</h4>
          <p>{stats.modified}</p>
        </div>
      </div>
      {loading && <div className="inline-loading">Loading stats...</div>}
    </div>
  );
}