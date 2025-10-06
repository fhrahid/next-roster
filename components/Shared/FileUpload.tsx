"use client";
import { useState } from 'react';

interface Props {
  accept?: string;
  onFile: (file: File)=>void;
  label?: string;
}

export default function FileUpload({accept='.csv', onFile, label='Choose File'}:Props) {
  const [fileName,setFileName]=useState('');

  return (
    <label className="file-upload">
      <input type="file" accept={accept} onChange={e=>{
        const f = e.target.files?.[0];
        if (f) {
          setFileName(f.name);
          onFile(f);
        }
      }} />
      <span>{fileName || label}</span>
    </label>
  );
}