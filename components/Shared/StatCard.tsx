"use client";
interface Props {
  icon: string;
  value: string|number;
  label: string;
  subtitle?: string;
  accent?: string;
}
export default function StatCard({icon,value,label,subtitle,accent}:Props) {
  return (
    <div className={`stat-card ${accent||''}`}>
      <div className="stat-card-header">
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
          <div className="stat-number">{value}</div>
          <div className="stat-label">{label}</div>
          {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}