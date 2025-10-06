"use client";
import { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  team: string;
}

interface Props {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
  placeholder?: string;
}

export default function EmployeeSearch({ employees, onSelect, placeholder }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (employee: Employee) => {
    onSelect(employee);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="employee-search-container">
      <div className="employee-search-input-wrapper">
        <span className="employee-search-icon">🔍</span>
        <input
          type="text"
          className="employee-search-input"
          placeholder={placeholder || "Search employees..."}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      
      {isOpen && searchTerm && (
        <div className="employee-search-dropdown">
          {filteredEmployees.length === 0 ? (
            <div className="employee-search-empty">No employees found</div>
          ) : (
            filteredEmployees.slice(0, 10).map((emp) => (
              <button
                key={emp.id}
                className="employee-search-item"
                onClick={() => handleSelect(emp)}
              >
                <div className="employee-search-item-name">{emp.name}</div>
                <div className="employee-search-item-info">
                  <span className="employee-search-item-id">{emp.id}</span>
                  <span className="employee-search-item-team">{emp.team}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
