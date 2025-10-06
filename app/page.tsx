"use client";
import { useState, useEffect } from 'react';
import ClientAuthGate from '@/components/ClientAuthGate';
import ClientDashboard from '@/components/ClientDashboard';

export default function HomePage() {
  const [authed, setAuthed] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');

  return (
    <div>
      {!authed &&
        <ClientAuthGate
          onSuccess={(name,id)=>{
            setFullName(name);
            setEmployeeId(id);
            setAuthed(true);
          }}
        />
      }
      {authed &&
        <ClientDashboard employeeId={employeeId} fullName={fullName} onLogout={()=>{
          setAuthed(false);
          setEmployeeId('');
          localStorage.removeItem('rosterViewerUser');
          localStorage.removeItem('rosterViewerAuth');
        }}/>
      }
    </div>
  );
}