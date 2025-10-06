export interface Employee {
  name: string;
  id: string;
  currentTeam?: string;
  team?: string;
  schedule: string[];
  allTeams?: string[];
}
export interface RosterData {
  teams: Record<string, Employee[]>;
  headers: string[];
  allEmployees: Employee[];
}
export interface Modification {
  employee_id: string;
  employee_name: string;
  team_name: string;
  date_index: number;
  date_header: string;
  old_shift: string;
  new_shift: string;
  modified_by: string;
  timestamp: string;
  month_year: string;
}
export interface ModifiedShiftsData {
  modifications: Modification[];
  monthly_stats: {
    [monthYear: string]: {
      total_modifications: number;
      employees_modified: string[];
      modifications_by_user: Record<string, number>;
    };
  };
}
export interface ScheduleRequestChange {
  id: string;
  employee_id: string;
  employee_name: string;
  team: string;
  date: string;
  current_shift: string;
  requested_shift: string;
  reason: string;
  status: "pending"|"approved"|"rejected";
  type: "shift_change";
  created_at: string;
  approved_at: string|null;
  approved_by: string|null;
}
export interface ScheduleRequestSwap {
  id: string;
  requester_id: string;
  requester_name: string;
  target_employee_id: string;
  target_employee_name: string;
  team: string;
  date: string;
  requester_shift: string;
  target_shift: string;
  reason: string;
  status: "pending"|"approved"|"rejected";
  type: "swap";
  created_at: string;
  approved_at: string|null;
  approved_by: string|null;
}
export interface ScheduleRequestsFile {
  shift_change_requests: ScheduleRequestChange[];
  swap_requests: ScheduleRequestSwap[];
  approved_count: number;
  pending_count: number;
}
export interface GoogleLinks { [monthYear: string]: string; }

export interface LoginPayload { username: string; password: string; }

export interface AdminUser {
  username: string;
  password: string;
  role: string;
  full_name: string;
  created_at: string;
}

export interface AdminUsersFile {
  users: AdminUser[];
}