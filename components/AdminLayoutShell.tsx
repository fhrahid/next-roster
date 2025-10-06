"use client";
import { useState } from 'react';

const tabs = [
  { id:'dashboard', label:'📊 Dashboard'},
  { id:'schedule-requests', label:'📋 Schedule Requests'},
  { id:'data-sync', label:'🔄 Data Sync'},
  { id:'google-links', label:'🔗 Google Sheets'},
  { id:'google-data', label:'📄 Google Data'},
  { id:'admin-data', label:'📝 Admin Data'},
  { id:'csv-import', label:'📂 CSV Import'},
  { id:'team-management', label:'👥 Team Management'},
  { id:'user-management', label:'🔐 User Management'},
  { id:'profile', label:'👤 My Profile'}
];

export default function AdminLayoutShell({children, adminUser}:{children:React.ReactNode, adminUser:string}) {
  const [active,setActive]=useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Determine user role based on username (simplified for demo)
  const getUserRole = () => {
    // This would typically come from the user's data
    // For now, treating 'istiaque' as Head of Department, others as Manager
    return adminUser === 'istiaque' ? 'Head of Department' : 'Manager';
  };

  return (
    <div className="admin-layout-modern">
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">{sidebarCollapsed ? '🛒' : '🛒 Cartup CxP'}</div>
          {!sidebarCollapsed && <div className="admin-subtitle">Admin Panel</div>}
        </div>
        
        <nav className="admin-sidebar-nav">
          {tabs.map(t=>(
            <button 
              key={t.id} 
              className={`sidebar-nav-item ${active===t.id?'active':''}`} 
              onClick={()=>setActive(t.id)}
              title={sidebarCollapsed ? t.label : undefined}
            >
              {sidebarCollapsed ? t.label.split(' ')[0] : t.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          {!sidebarCollapsed && (
            <div className="admin-user-card">
              <div className="user-icon">👤</div>
              <div className="user-details">
                <div className="user-name">{adminUser}</div>
                <div className="user-role">{getUserRole()}</div>
              </div>
            </div>
          )}
          {!sidebarCollapsed && (
            <button className="logout-btn-sidebar" onClick={async()=>{
              await fetch('/api/admin/logout',{method:'POST'});
              window.location.href='/admin/login';
            }}>
              🚪 Logout
            </button>
          )}
        </div>
      </aside>
      
      <button 
        className="sidebar-toggle-btn"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {sidebarCollapsed ? '☰' : '✕'}
      </button>

      <main className="admin-main-content">
        <header className="admin-content-header">
          <h1>{tabs.find(t => t.id === active)?.label || 'Dashboard'}</h1>
          <div className="header-actions">
            <span className="timestamp">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </header>

        <div className="admin-content-body">
          {Array.isArray(children) ? children.map((c:any)=>{
            if (!c?.props?.id) return null;
            return (
              <div key={c.props.id} className={`tab-content ${active===c.props.id?'active':''}`}>
                {c}
              </div>
            );
          }): children}
        </div>
      </main>
    </div>
  );
}