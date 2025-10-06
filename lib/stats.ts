import { getModifiedShifts } from './dataStore';

export function getCurrentMonthModifiedData() {
  const ms = getModifiedShifts();
  const currentMonth = new Date().toISOString().slice(0,7);
  const monthly = ms.monthly_stats[currentMonth] || {
    total_modifications:0,
    employees_modified:[],
    modifications_by_user:{}
  };
  const recent = ms.modifications
    .filter(m=>m.month_year===currentMonth)
    .sort((a,b)=>b.timestamp.localeCompare(a.timestamp))
    .slice(0,50);
  return { monthly, recent, currentMonth };
}