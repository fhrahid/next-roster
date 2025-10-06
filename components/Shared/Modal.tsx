"use client";
import { ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  title?: string;
  onClose: ()=>void;
  children: ReactNode;
  width?: string;
}

export default function Modal({open,title,onClose,children,width='600px'}:Props) {
  useEffect(()=>{
    function esc(e:KeyboardEvent) { if (e.key==='Escape') onClose(); }
    if (open) window.addEventListener('keydown', esc);
    return ()=>window.removeEventListener('keydown', esc);
  },[open,onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={e=>{
      if (e.target===e.currentTarget) onClose();
    }}>
      <div className="modal-window" style={{width}}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}>✖</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}