"use client";
import { useState, useEffect } from 'react';

export default function ClientAuthGate({onSuccess}:{onSuccess:(fullName:string,id:string)=>void}) {
  const [fullName,setFullName]=useState('');
  const [employeeId,setEmployeeId]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');

  useEffect(()=>{
    const savedUser = localStorage.getItem('rosterViewerUser');
    const savedAuth = localStorage.getItem('rosterViewerAuth');
    if (savedUser && savedAuth) {
      const u = JSON.parse(savedUser);
      onSuccess(u.fullName,u.employeeId);
    }
  },[onSuccess]);

  function submit(e:React.FormEvent) {
    e.preventDefault();
    if (!fullName || !employeeId || !password) {
      setMsg('Please fill all fields'); return;
    }
    if (!/^SLL-\d+$/i.test(employeeId)) {
      setMsg('Employee ID must be like SLL-12345'); return;
    }
    if (password !== 'cartup123') {
      setMsg('Invalid password'); return;
    }
    const user = {fullName, employeeId:employeeId.toUpperCase(), timestamp: new Date().toISOString()};
    localStorage.setItem('rosterViewerUser', JSON.stringify(user));
    localStorage.setItem('rosterViewerAuth','true');
    setMsg('Access granted! Loading...');
    setTimeout(()=> onSuccess(user.fullName,user.employeeId), 600);
  }

  return (
    <div className="auth-screen" style={{display:'flex'}}>
      <div className="auth-container">
        <div className="auth-header">
          <h1>🛒 Cartup CxP Roster Viewer</h1>
          <p className="subtitle">Secure Team Access Portal</p>
        </div>
        <div className="auth-card">
          <form onSubmit={submit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your Name"/>
            </div>
            <div className="form-group">
              <label>Employee ID (SLL-XXXXX)</label>
              <input value={employeeId} onChange={e=>{
                let v = e.target.value.toUpperCase();
                if (!v.startsWith('SLL-')) v = 'SLL-'+v.replace(/^SLL-/,'');
                setEmployeeId(v);
              }} />
            </div>
            <div className="form-group">
              <label>Team Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="cartup123"/>
              <div className="password-hint">The Password is: cartup123</div>
            </div>
            <button className="auth-btn primary" type="submit">🔓 Access Roster</button>
          </form>
          {msg && <div className={`auth-message ${msg.includes('Access')?'success':'error'}`}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}