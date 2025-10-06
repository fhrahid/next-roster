"use client";
import { useState } from 'react';

const tabs = [
  { id:'data-sync', label:'Data Sync'},
  { id:'google-links', label:'Google Sheets Links'},
  { id:'team-management', label:'Team Management'},
  { id:'schedule-requests', label:'📋 Schedule Requests'},
  { id:'google-data', label:'Google Data'},
  { id:'admin-data', label:'Admin Data'},
  { id:'csv-import', label:'CSV Import'}
];

export default function AdminLayoutShell({children, adminUser}:{children:React.ReactNode, adminUser:string}) {
  const [active,setActive]=useState('data-sync');

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>🛒 Cartup CxP Admin Panel</h1>
          <div className="admin-user-info">
            <span>Welcome, <strong>{adminUser}</strong></span>
            <form action="/api/admin/logout" method="post">
              <button className="logout-btn" formMethod="POST" onClick={async(e)=>{
                e.preventDefault();
                await fetch('/api/admin/logout',{method:'POST'});
                window.location.href='/admin/login';
              }}>Logout</button>
            </form>
          </div>
        </div>
      </header>
      <nav className="admin-nav">
        {tabs.map(t=>(
          <button key={t.id} className={`nav-btn ${active===t.id?'active':''}`} onClick={()=>setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
      <main className="admin-main">
        {/* Each tab's content component exists below (child fragments identify via ids) */}
        {Array.isArray(children) ? children.map((c:any)=>{
          if (!c?.props?.id) return null;
          return (
            <div key={c.props.id} className={`tab-content ${active===c.props.id?'active':''}`}>
              {c}
            </div>
          );
        }): children}
      </main>
      <footer className="admin-footer">
        <p>CxP Roster Admin Panel | Dual Data Storage | Next.js Port</p>
      </footer>
    </div>
  );
}