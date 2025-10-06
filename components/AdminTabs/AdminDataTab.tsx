"use client";
import { useState, useEffect } from 'react';
import RosterTable from '../Shared/RosterTable';

interface Props { id: string; }

export default function AdminDataTab({id}:Props) {
  const [data,setData]=useState<any>(null);
  const [google,setGoogle]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);

  async function load() {
    setLoading(true);
    const aRes = await fetch('/api/admin/get-admin-data');
    const gRes = await fetch('/api/admin/get-google-data');
    if (aRes.ok) setData(await aRes.json());
    if (gRes.ok) setGoogle(await gRes.json());
    setLoading(false);
  }

  async function updateShift(employeeId:string,dateIndex:number,newShift:string) {
    setSaving(true);
    const googleShift = google?.teams ? findGoogleShift(employeeId,dateIndex) : '';
    const res = await fetch('/api/admin/update-shift',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({employeeId,dateIndex,newShift,googleShift})
    }).then(r=>r.json());
    setSaving(false);
    if (!res.success) alert(res.error||'Update failed');
    load();
  }

  function findGoogleShift(employeeId:string, dateIndex:number) {
    if (!google) return '';
    for (const team of Object.keys(google.teams)) {
      const emp = google.teams[team].find((e:any)=>e.id===employeeId);
      if (emp) return emp.schedule[dateIndex] || '';
    }
    return '';
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div id={id} className="tab-pane">
      <h2>Admin Data (Editable)</h2>
      <p>Modify shifts here. Differences from Google represent authorized changes.</p>
      <div className="actions-row">
        <button className="btn small" onClick={load}>🔄 Refresh</button>
        {saving && <span className="saving-indicator">Saving...</span>}
      </div>
      {loading && <div className="inline-loading">Loading admin data...</div>}
      {data &&
        <RosterTable
          headers={data.headers}
          teams={data.teams}
          editable={true}
          onUpdateShift={updateShift}
        />
      }
      <div className="note-box">
        Click a shift cell to edit. Use valid shift codes (e.g. M2, M3, D1, D2, DO, SL, CL, EL).
      </div>
    </div>
  );
}