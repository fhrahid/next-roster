"use client";
import { useState } from 'react';
import DatePicker from './Shared/DatePicker';

interface Props {
  roster: any;
  headers: string[];
}

export default function ShiftView({ roster, headers }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const shiftCodes = ['M2', 'M3', 'M4', 'D1', 'D2', 'DO', 'SL', 'CL', 'EL'];
  const teams = roster?.teams ? Object.keys(roster.teams) : [];

  const getEmployeesForDateAndShift = () => {
    if (!selectedDate || !roster?.teams) return [];
    
    const dateIndex = headers.indexOf(selectedDate);
    if (dateIndex === -1) return [];

    const results: any[] = [];
    
    Object.entries(roster.teams).forEach(([teamName, employees]: [string, any]) => {
      if (selectedTeam && teamName !== selectedTeam) return;
      
      employees.forEach((emp: any) => {
        const shift = emp.schedule[dateIndex];
        if (selectedShift && shift !== selectedShift) return;
        if (shift) {
          results.push({
            name: emp.name,
            id: emp.id,
            team: teamName,
            shift: shift
          });
        }
      });
    });

    return results;
  };

  const filteredEmployees = getEmployeesForDateAndShift();

  if (!isOpen) {
    return (
      <button className="shift-view-trigger" onClick={() => setIsOpen(true)}>
        <span className="shift-view-icon">👁️</span>
        Shift View
      </button>
    );
  }

  return (
    <div className="shift-view-modal">
      <div className="shift-view-overlay" onClick={() => setIsOpen(false)} />
      <div className="shift-view-content">
        <div className="shift-view-header">
          <h3>Shift View</h3>
          <button className="shift-view-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="shift-view-filters">
          <div className="shift-view-filter-group">
            <label>Select Date</label>
            <DatePicker 
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              availableDates={headers}
            />
          </div>

          <div className="shift-view-filter-group">
            <label>Filter by Shift</label>
            <select 
              value={selectedShift} 
              onChange={(e) => setSelectedShift(e.target.value)}
              className="shift-view-select"
            >
              <option value="">All Shifts</option>
              {shiftCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          <div className="shift-view-filter-group">
            <label>Filter by Team</label>
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="shift-view-select"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedDate && (
          <div className="shift-view-results">
            <div className="shift-view-results-header">
              <h4>Employees on {selectedDate}</h4>
              <span className="shift-view-count">{filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</span>
            </div>
            
            {filteredEmployees.length === 0 ? (
              <div className="shift-view-empty">No employees found for selected filters</div>
            ) : (
              <div className="shift-view-table-wrapper">
                <table className="shift-view-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ID</th>
                      <th>Team</th>
                      <th>Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, idx) => (
                      <tr key={idx}>
                        <td>{emp.name}</td>
                        <td className="shift-view-id">{emp.id}</td>
                        <td className="shift-view-team">{emp.team}</td>
                        <td className="shift-view-shift">{emp.shift}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
