"use client";
import { useState } from 'react';

interface Props { id: string; }

export default function CsvImportTab({id}:Props) {
  const [file,setFile]=useState<File|null>(null);
  const [uploading,setUploading]=useState(false);
  const [message,setMessage]=useState('');
  const [monthInfo,setMonthInfo]=useState('');

  async function upload() {
    if (!file) { setMessage('Select a CSV file first'); return; }
    setUploading(true); setMessage('');
    const form = new FormData();
    form.append('csv_file', file);
    const res = await fetch('/api/admin/upload-csv',{method:'POST', body:form}).then(r=>r.json());
    setUploading(false);
    if (res.success) {
      setMessage(res.message);
      const m = (res.message||'').match(/for (.*)!/);
      if (m) setMonthInfo(m[1]);
    } else setMessage(res.error||'Upload failed');
  }

  return (
    <div id={id} className="tab-pane">
      <h2>CSV Import</h2>
      <p>Import roster data from a CSV file (template-compatible). This updates Google base data and merges into Admin if absent.</p>
      <div className="import-box">
        <label className="file-label">
          <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)}/>
          {file? `Selected: ${file.name}` : 'Choose CSV File'}
        </label>
        <div className="actions-row">
          <button className="btn primary" disabled={!file||uploading} onClick={upload}>
            {uploading? 'Uploading...' : '📤 Upload CSV'}
          </button>
          <a className="btn" href="/api/admin/download-template" target="_blank" rel="noreferrer">📥 Download Template</a>
        </div>
        {message && <div className="import-message">{message}</div>}
        {monthInfo && <div className="success-box">Detected Month: {monthInfo}</div>}
      </div>
      <div className="note-box">
        The importer replaces only matching date columns for the detected month; older months remain intact.
      </div>
    </div>
  );
}