"use client";
import { useState, useEffect } from 'react';
import RosterTable from '../Shared/RosterTable';

interface Props { id: string; }

export default function AdminDataTab({id}:Props) {
  const [data,setData]=useState<any>(null);
  const [google,setGoogle]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [selectedTeams,setSelectedTeams]=useState<string[]>([]);

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

  const allTeams = data?.teams ? Object.keys(data.teams) : [];
  
  const handleTeamToggle = (team: string) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter(t => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const filteredTeams = () => {
    if (!data?.teams) return {};
    if (selectedTeams.length === 0) return data.teams;
    const filtered: Record<string, any[]> = {};
    selectedTeams.forEach(team => {
      if (data.teams[team]) {
        filtered[team] = data.teams[team];
      }
    });
    return filtered;
  };

  return (
    <div id={id} className="tab-pane">
      <h2>📝 Admin Data (Editable)</h2>
      <p>Modify shifts here. Differences from Google represent authorized changes.</p>
      <div className="actions-row">
        <button className="btn small" onClick={load}>🔄 Refresh</button>
        <button 
          className="btn small danger" 
          onClick={async () => {
            if (!confirm('Reset all admin data to Google Spreadsheet base? This will discard all modifications!')) return;
            const res = await fetch('/api/admin/reset-to-google', {method: 'POST'}).then(r => r.json());
            if (res.success) {
              alert('Data reset to Google base successfully!');
              load();
            } else {
              alert(res.error || 'Reset failed');
            }
          }}
        >
          🔄 Reset to Google Spreadsheet
        </button>
        {saving && <span className="saving-indicator">Saving...</span>}
      </div>
      
      {allTeams.length > 0 && (
        <div style={{marginBottom: 20}}>
          <label style={{fontSize: '.9rem', color: '#9FB7D5', marginBottom: 10, display: 'block'}}>
            Filter by Teams (Select Multiple)
          </label>
          <div className="multi-select-chips">
            {allTeams.map(team => (
              <button
                key={team}
                className={`chip-btn ${selectedTeams.includes(team) ? 'selected' : ''}`}
                onClick={() => handleTeamToggle(team)}
              >
                {team}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {loading && <div className="inline-loading">Loading admin data...</div>}
      {data && (
        <div style={{overflowX: 'auto'}}>
          <RosterTable
            headers={data.headers}
            teams={filteredTeams()}
            editable={true}
            onUpdateShift={updateShift}
          />
        </div>
      )}
      <div className="note-box">
        Click a shift cell to edit. Use valid shift codes (e.g. M2, M3, D1, D2, DO, SL, CL, EL).
      </div>
    </div>
  );
}