"use client";
import { useState } from 'react';

export default function AdminLoginPage() {
  const [u,setU]=useState('');
  const [p,setP]=useState('');
  const [msg,setMsg]=useState('');
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg('');
    const res = await fetch('/api/admin/login',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:u,password:p})});
    const j = await res.json();
    setLoading(false);
    if (j.success) {
      window.location.href='/admin/dashboard';
    } else {
      setMsg(j.error || 'Invalid credentials');
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>🛒 Cartup CxP Admin Panel</h1>
          <p>Team Lead & Administrator Access</p>
        </div>
        <form onSubmit={submit} className="admin-login-form">
          <div className="form-group">
            <label>Username</label>
            <input value={u} onChange={e=>setU(e.target.value)} required autoComplete="username"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input value={p} onChange={e=>setP(e.target.value)} required type="password" autoComplete="current-password"/>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>{loading? '⏳ Logging in...' : '🔐 Login to Admin Panel'}</button>
        </form>
        {msg && <div className={`login-message ${msg.includes('Invalid')?'error':'error'}`}>{msg}</div>}
        <div className="login-footer">
          <p>Return to <a href="/">Main Roster Viewer</a></p>
        </div>
      </div>
    </div>
  );
}