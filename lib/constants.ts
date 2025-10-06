export const DATA_DIR = "data";
export const GOOGLE_DATA_FILE = `${DATA_DIR}/google_data.json`;
export const ADMIN_DATA_FILE = `${DATA_DIR}/admin_data.json`;
export const MODIFIED_SHIFTS_FILE = `${DATA_DIR}/modified_shifts.json`;
export const GOOGLE_LINKS_FILE = `${DATA_DIR}/google_links.json`;
export const SCHEDULE_REQUESTS_FILE = `${DATA_DIR}/schedule_requests.json`;

export const SHIFT_MAP: Record<string,string> = {
  M2:"8 AM – 5 PM",
  M3:"9 AM – 6 PM",
  M4:"10 AM – 7 PM",
  D1:"12 PM – 9 PM",
  D2:"1 PM – 10 PM",
  DO:"OFF",
  SL:"Sick Leave",
  CL:"Casual Leave",
  EL:"Emergency Leave",
  "":"N/A"
};

export const ADMIN_SESSION_COOKIE = "admin_session_v1";