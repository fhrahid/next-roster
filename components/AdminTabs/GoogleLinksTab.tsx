"use client";
import { useState, useEffect } from 'react';
interface Props { id: string; }
export default function GoogleLinksTab({id}:Props) {
  const [monthYear,setMonthYear]=useState('');
  const [link,setLink]=useState('');
  const [links,setLinks]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/get-google-links');
    if (res.ok) setLinks(await res.json());
    setLoading(false);
  }

  async function save() {
    if (!monthYear || !link) { alert('Month Year & link required'); return; }
    const res = await fetch('/api/admin/save-google-link',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({monthYear, googleLink:link})
    }).then(r=>r.json());
    if (!res.success) alert(res.error);
    else { setMonthYear(''); setLink(''); load(); }
  }

  async function remove(m:string) {
    if (!confirm(`Delete link for ${m}?`)) return;
    const res = await fetch('/api/admin/delete-google-link',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({monthYear:m})
    }).then(r=>r.json());
    if (!res.success) alert(res.error);
    else load();
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div id={id} className="tab-pane">
      <h2>Google Sheets Links</h2>
      <p>Add or manage published CSV links for roster sources.</p>
      <div className="form-grid two">
        <div>
          <label>Month (YYYY-MM)</label>
          <input value={monthYear} onChange={e=>setMonthYear(e.target.value)} placeholder="2025-10"/>
        </div>
        <div>
          <label>CSV Publish Link</label>
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://docs.google.com/.../pub?output=csv"/>
        </div>
      </div>
      <div className="actions-row">
        <button className="btn primary" onClick={save}>💾 Save Link</button>
        <button className="btn" onClick={load}>🔄 Refresh</button>
      </div>
      {loading && <div className="inline-loading">Loading links...</div>}
      <table className="data-table small">
        <thead>
          <tr><th>Month</th><th>Link</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {Object.keys(links).length===0 && <tr><td colSpan={3}>No links added yet</td></tr>}
          {Object.entries(links).map(([m,l])=>(
            <tr key={m}>
              <td>{m}</td>
              <td className="truncate"><a href={l} target="_blank" rel="noreferrer">Open</a></td>
              <td><button className="btn danger tiny" onClick={()=>remove(m)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note-box">
        Publish Google Sheets to CSV via File → Share → Publish to web → select sheet → CSV.
      </div>
    </div>
  );
}