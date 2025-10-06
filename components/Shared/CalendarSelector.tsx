"use client";
import { useState } from 'react';

interface Props {
  headers: string[];
  schedule: string[];
  selectedDate?: string;
  onSelect?: (date: string, shift: string) => void;
}

export default function CalendarSelector({ headers, schedule, selectedDate, onSelect }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('');

  const getDaysData = () => {
    return headers.map((h, i) => ({
      date: h,
      shift: schedule[i] || '',
      isOff: ['DO', 'SL', 'CL', 'EL'].includes(schedule[i] || '')
    }));
  };

  const filteredDays = () => {
    const days = getDaysData();
    if (!filter) return days;
    return days.filter(d => d.shift === filter);
  };

  const handleDateClick = (date: string, shift: string) => {
    if (onSelect) {
      onSelect(date, shift);
    }
  };

  return (
    <div className={`calendar-selector ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="calendar-selector-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="calendar-selector-icon">📅</span>
        <span className="calendar-selector-text">
          {selectedDate || 'Select Date from Calendar'}
        </span>
        <span className="calendar-selector-arrow">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="calendar-selector-content">
          <div className="calendar-selector-filters">
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Shifts</option>
              {['M2', 'M3', 'M4', 'D1', 'D2', 'DO', 'SL', 'CL', 'EL'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {filter && <button className="btn tiny" onClick={() => setFilter('')}>Clear</button>}
          </div>
          
          <div className="calendar-selector-grid">
            {filteredDays().map(d => (
              <button
                key={d.date}
                className={`calendar-selector-day ${d.shift || 'empty'} ${d.date === selectedDate ? 'selected' : ''} ${d.isOff ? 'off-day' : 'work-day'}`}
                onClick={() => handleDateClick(d.date, d.shift)}
                title={`${d.date} - ${d.shift || 'N/A'}`}
              >
                <span className="calendar-day-date">{d.date}</span>
                <span className="calendar-day-shift">{d.shift || '—'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
