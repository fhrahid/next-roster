"use client";
import { useState, useEffect } from 'react';

interface Props {
  headers: string[];
  schedule: string[];
  selectedDate?: string;
  onSelect?: (date: string, shift: string) => void;
}

export default function MiniScheduleCalendar({ headers, schedule, selectedDate, onSelect }: Props) {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  // Get days with shifts
  const getDaysWithShifts = () => {
    return headers.map((h, i) => ({
      date: h,
      shift: schedule[i] || '',
      fullDate: h
    }));
  };

  // Group days by month
  const getMonthGroups = () => {
    const days = getDaysWithShifts();
    const groups: { [key: string]: typeof days } = {};
    
    days.forEach(day => {
      // Extract month from date string (e.g., "7 Oct" -> "Oct")
      const parts = day.date.split(' ');
      const monthPart = parts.length > 1 ? parts[1] : parts[0].replace(/\d+/g, '');
      
      if (!groups[monthPart]) {
        groups[monthPart] = [];
      }
      groups[monthPart].push(day);
    });
    
    return groups;
  };

  const monthGroups = getMonthGroups();
  const monthNames = Object.keys(monthGroups);
  const currentMonthIndex = Math.min(Math.max(0, currentMonthOffset), monthNames.length - 1);
  const currentMonthName = monthNames[currentMonthIndex] || '';
  const currentDays = monthGroups[currentMonthName] || [];

  const handlePrevMonth = () => {
    if (currentMonthOffset > 0) {
      setCurrentMonthOffset(currentMonthOffset - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthOffset < monthNames.length - 1) {
      setCurrentMonthOffset(currentMonthOffset + 1);
    }
  };

  const getShiftClassName = (shift: string) => {
    if (!shift) return 'shift-empty';
    if (shift === 'DO') return 'shift-do';
    if (['SL', 'CL', 'EL'].includes(shift)) return 'shift-off';
    return 'shift-work';
  };

  const handleDateClick = (date: string, shift: string) => {
    if (onSelect) {
      onSelect(date, shift);
    }
  };

  return (
    <div className="mini-schedule-calendar">
      <div className="mini-schedule-header">
        <button 
          className="mini-schedule-nav"
          onClick={handlePrevMonth}
          disabled={currentMonthOffset === 0}
          title="Previous month"
        >
          ←
        </button>
        <span className="mini-schedule-month">{currentMonthName}</span>
        <button 
          className="mini-schedule-nav"
          onClick={handleNextMonth}
          disabled={currentMonthOffset === monthNames.length - 1}
          title="Next month"
        >
          →
        </button>
      </div>

      <div className="mini-schedule-legend">
        <div className="legend-item">
          <span className="legend-dot work"></span>
          <span>Working</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot do"></span>
          <span>Day Off</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot off"></span>
          <span>Leave</span>
        </div>
      </div>

      <div className="mini-schedule-grid">
        {currentDays.map((day, idx) => (
          <button
            key={idx}
            className={`mini-schedule-day ${getShiftClassName(day.shift)} ${day.date === selectedDate ? 'selected' : ''}`}
            title={`${day.date} - ${day.shift || 'N/A'}`}
            onClick={() => handleDateClick(day.date, day.shift)}
          >
            <div className="day-number">
              {day.date.split(' ')[0]}
            </div>
            <div className="day-shift">
              {day.shift || '—'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
