"use client";
import { useState } from 'react';

interface Props {
  icon: string;
  value: string|number;
  label: string;
  subtitle?: string;
  accent?: string;
  details?: any[];
  detailsType?: 'workdays' | 'timeoff' | 'changes';
}

export default function StatCard({icon,value,label,subtitle,accent,details,detailsType}:Props) {
  const [expanded, setExpanded] = useState(false);

  const renderDetails = () => {
    if (!details || details.length === 0) return <div className="stat-details-empty">No data available</div>;

    if (detailsType === 'workdays') {
      return (
        <table className="stat-details-table">
          <thead><tr><th>Date</th><th>Day</th><th>Shift</th></tr></thead>
          <tbody>
            {details.map((d:any, idx:number) => (
              <tr key={idx}>
                <td>{d.date}</td>
                <td>{d.day}</td>
                <td>{d.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (detailsType === 'timeoff') {
      return (
        <table className="stat-details-table">
          <thead><tr><th>Date</th><th>Day</th><th>Code</th></tr></thead>
          <tbody>
            {details.map((d:any, idx:number) => (
              <tr key={idx}>
                <td>{d.date}</td>
                <td>{d.day}</td>
                <td>{d.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (detailsType === 'changes') {
      return (
        <table className="stat-details-table">
          <thead><tr><th>Date</th><th>Original</th><th>Current</th></tr></thead>
          <tbody>
            {details.map((c:any, idx:number) => (
              <tr key={idx}>
                <td>{c.date}</td>
                <td>{c.original_shift}</td>
                <td className="status approved">{c.current_shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <div className={`stat-card ${accent||''} ${expanded ? 'expanded' : ''}`}>
      <div className="stat-card-header" onClick={() => details && setExpanded(!expanded)}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
          <div className="stat-number">{value}</div>
          <div className="stat-label">{label}</div>
          {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
        {details && (
          <div className="stat-expand-icon">{expanded ? '▲' : '▼'}</div>
        )}
      </div>
      {expanded && details && (
        <div className="stat-details">
          {renderDetails()}
        </div>
      )}
    </div>
  );
}