"use client";
import { useState } from 'react';
import { SHIFT_MAP } from '@/lib/constants';

interface Props {
  headers: string[];
  schedule: string[];
  selectedDate?: string;
  onSelect: (date: string) => void;
}

export default function MiniCalendar({ headers, schedule, selectedDate, onSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(0); // offset from today's month
  
  const getDaysWithShifts = () => {
    return headers.map((h, i) => ({
      date: h,
      shift: schedule[i] || '',
      shiftTime: SHIFT_MAP[schedule[i] || ''] || schedule[i] || 'N/A',
      isOff: ['DO', 'SL', 'CL', 'EL', ''].includes(schedule[i] || '')
    }));
  };

  const days = getDaysWithShifts();
  
  // Group days by month for navigation
  const getMonthGroups = () => {
    const groups: { [key: string]: typeof days } = {};
    days.forEach(day => {
      // Extract month from date string (assuming format like "Dec 1")
      const monthPart = day.date.split(' ')[0];
      if (!groups[monthPart]) {
        groups[monthPart] = [];
      }
      groups[monthPart].push(day);
    });
    return groups;
  };

  const monthGroups = getMonthGroups();
  const monthNames = Object.keys(monthGroups);
  const currentMonthName = monthNames[Math.min(Math.max(0, currentMonth), monthNames.length - 1)];
  const currentDays = monthGroups[currentMonthName] || [];

  const handlePrevMonth = () => {
    if (currentMonth > 0) setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth < monthNames.length - 1) setCurrentMonth(currentMonth + 1);
  };

  return (
    <div className="mini-calendar-win11">
      <div className="mini-calendar-header">
        <button 
          className="mini-calendar-nav"
          onClick={handlePrevMonth}
          disabled={currentMonth === 0}
        >
          ←
        </button>
        <span className="mini-calendar-month">{currentMonthName}</span>
        <button 
          className="mini-calendar-nav"
          onClick={handleNextMonth}
          disabled={currentMonth === monthNames.length - 1}
        >
          →
        </button>
      </div>
      
      <div className="mini-calendar-legend">
        <span className="mini-calendar-legend-item">
          <span className="legend-color work-day"></span> Working
        </span>
        <span className="mini-calendar-legend-item">
          <span className="legend-color off-day"></span> Off
        </span>
      </div>

      <div className="mini-calendar-grid-win11">
        {currentDays.map(day => (
          <button
            key={day.date}
            className={`mini-calendar-day-win11 ${day.isOff ? 'off-day' : 'work-day'} ${day.date === selectedDate ? 'selected' : ''}`}
            onClick={() => onSelect(day.date)}
            title={`${day.date} - ${day.shiftTime}`}
          >
            <span className="mini-cal-date-win11">{day.date.split(' ')[1] || day.date}</span>
            <span className="mini-cal-shift-time">{day.shiftTime}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
