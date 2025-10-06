"use client";
import { useState } from 'react';
import DatePicker from './Shared/DatePicker';
import CalendarSelector from './Shared/CalendarSelector';

interface Props {
  roster: any;
  headers: string[];
}

export default function ShiftView({ roster, headers }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
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
        const shift = emp.schedule[dateIndex] || '';
        // Apply shift filter if specified
        if (selectedShift && shift !== selectedShift) return;
        // Show employee regardless of whether they have a shift
        results.push({
          name: emp.name,
          id: emp.id,
          team: teamName,
          shift: shift || 'N/A'
        });
      });
    });

    return results;
  };

  const getShiftStats = () => {
    const employees = getEmployeesForDateAndShift();
    const shiftCounts: { [key: string]: number } = {};
    
    employees.forEach(emp => {
      const shift = emp.shift === 'N/A' ? 'Empty' : emp.shift;
      shiftCounts[shift] = (shiftCounts[shift] || 0) + 1;
    });

    return shiftCounts;
  };

  // Create a dummy schedule for calendar (all employees, first one)
  const getDummyScheduleForCalendar = () => {
    if (!roster?.teams) return [];
    const firstTeam = Object.values(roster.teams)[0] as any[];
    if (!firstTeam || firstTeam.length === 0) return [];
    return firstTeam[0].schedule || [];
  };

  const filteredEmployees = getEmployeesForDateAndShift();
  const shiftStats = selectedDate ? getShiftStats() : {};

  return (
    <div className={`shift-view-collapsible ${isExpanded ? 'expanded' : ''}`}>
      <button className="shift-view-trigger" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="shift-view-icon">👁️</span>
        <span>Shift View</span>
        <span className="shift-view-arrow">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="shift-view-content-collapsible">
          {/* Calendar Selector */}
          <div style={{marginBottom: 20}}>
            <label style={{display: 'block', marginBottom: 8, color: '#9FB7D5', fontSize: '0.85rem', fontWeight: 500}}>
              Select Date from Calendar
            </label>
            <CalendarSelector 
              headers={headers}
              schedule={getDummyScheduleForCalendar()}
              selectedDate={selectedDate}
              onSelect={(date, shift) => setSelectedDate(date)}
            />
          </div>

          <div className="shift-view-filters">
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
            <>
              {/* Stat Cards */}
              <div className="shift-view-stats" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: 20,
                marginTop: 20
              }}>
                <div className="shift-stat-card" style={{
                  background: 'linear-gradient(145deg, #1A2330, #121823)',
                  border: '1px solid #243044',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#DCE7F5'}}>
                    {filteredEmployees.length}
                  </div>
                  <div style={{fontSize: '0.7rem', color: '#7F94B1', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4}}>
                    Total Employees
                  </div>
                </div>
                
                {Object.entries(shiftStats).map(([shift, count]) => (
                  <div key={shift} className="shift-stat-card" style={{
                    background: 'linear-gradient(145deg, #1A2330, #121823)',
                    border: '1px solid #243044',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#DCE7F5'}}>
                      {count}
                    </div>
                    <div style={{fontSize: '0.7rem', color: '#7F94B1', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4}}>
                      {shift}
                    </div>
                  </div>
                ))}
              </div>

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
            </>
          )}
        </div>
      )}
    </div>
  );
}
