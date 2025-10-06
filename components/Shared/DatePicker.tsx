"use client";
import { useState } from 'react';

interface Props {
  selectedDate: string;
  onSelect: (date: string) => void;
  availableDates: string[];
}

export default function DatePicker({ selectedDate, onSelect, availableDates }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDates = availableDates.filter(date => 
    date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateSelect = (date: string) => {
    onSelect(date);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="date-picker-container">
      <button 
        className="date-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="date-picker-icon">📅</span>
        <span className="date-picker-text">
          {selectedDate || 'Select Date'}
        </span>
        <span className="date-picker-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="date-picker-search">
            <input
              type="text"
              placeholder="Search date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="date-picker-list">
            {filteredDates.length === 0 ? (
              <div className="date-picker-empty">No dates found</div>
            ) : (
              filteredDates.map((date) => (
                <button
                  key={date}
                  className={`date-picker-item ${date === selectedDate ? 'selected' : ''}`}
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="date-picker-item-icon">📆</span>
                  {date}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
