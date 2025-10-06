"use client";
import { useState } from 'react';
import MiniCalendar from './Shared/MiniCalendar';
import { SHIFT_MAP } from '@/lib/constants';

interface Props {
  roster: any;
  headers: string[];
}

export default function ShiftView({ roster, headers }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const shiftCodes = ['M2', 'M3', 'M4', 'D1', 'D2', 'DO', 'SL', 'CL', 'EL'];
  const teams = roster?.teams ? Object.keys(roster.teams) : [];

  const getEmployeesForDateAndShift = () => {
    if (!selectedDate || !roster?.teams) return [];
    
    const dateIndex = headers.indexOf(selectedDate);
    if (dateIndex === -1) return [];

    const results: any[] = [];
    
    Object.entries(roster.teams).forEach(([teamName, employees]: [string, any]) => {
      if (selectedTeams.length > 0 && !selectedTeams.includes(teamName)) return;
      
      employees.forEach((emp: any) => {
        const shift = emp.schedule[dateIndex];
        if (selectedShifts.length > 0 && !selectedShifts.includes(shift)) return;
        if (shift) {
          results.push({
            name: emp.name,
            id: emp.id,
            team: teamName,
            shift: shift,
            shiftTime: SHIFT_MAP[shift] || shift
          });
        }
      });
    });

    return results;
  };

  const filteredEmployees = getEmployeesForDateAndShift();

  const handleShiftToggle = (shiftCode: string) => {
    if (selectedShifts.includes(shiftCode)) {
      setSelectedShifts(selectedShifts.filter(s => s !== shiftCode));
    } else {
      setSelectedShifts([...selectedShifts, shiftCode]);
    }
  };

  const handleTeamToggle = (team: string) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter(t => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  // Get a dummy schedule for calendar (all dates with empty shifts)
  const dummySchedule = headers.map(() => '');

  return (
    <div className={`shift-view-collapsible ${isExpanded ? 'expanded' : ''}`}>
      <button className="shift-view-trigger" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="shift-view-icon">👁️</span>
        <span>Shift View</span>
        <span className="shift-view-arrow">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="shift-view-content-collapsible">
          <div className="shift-view-filters">
            <div className="shift-view-filter-group">
              <label>Select Date</label>
              <MiniCalendar 
                headers={headers}
                schedule={dummySchedule}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
              />
            </div>

            <div className="shift-view-filter-group">
              <label>Filter by Shift Times (Multiple)</label>
              <div className="multi-select-chips">
                {shiftCodes.map(code => (
                  <button
                    key={code}
                    className={`chip-btn ${selectedShifts.includes(code) ? 'selected' : ''}`}
                    onClick={() => handleShiftToggle(code)}
                  >
                    {SHIFT_MAP[code] || code}
                  </button>
                ))}
              </div>
            </div>

            <div className="shift-view-filter-group">
              <label>Filter by Teams (Multiple)</label>
              <div className="multi-select-chips">
                {teams.map(team => (
                  <button
                    key={team}
                    className={`chip-btn ${selectedTeams.includes(team) ? 'selected' : ''}`}
                    onClick={() => handleTeamToggle(team)}
                  >
                    {team}
                  </button>
                ))}
              </div>
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
                      <th>Shift Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, idx) => (
                      <tr key={idx}>
                        <td>{emp.name}</td>
                        <td className="shift-view-id">{emp.id}</td>
                        <td className="shift-view-team">{emp.team}</td>
                        <td className="shift-view-shift">{emp.shiftTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
