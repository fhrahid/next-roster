# Cartup CxP Roster (Next.js Port)

A full Next.js (App Router + TypeScript) port of your Flask-based roster management system with:
- Dual data layers (Google base + Admin modified)
- CSV Google Sheets sync (multiple published CSV links)
- CSV import & template generation
- Shift editing, change & swap requests
- Modification audit + monthly stats
- Employee-facing dashboard with calendar & request submission
- File-based JSON persistence (no DB required initially)

---

## Features

| Domain | Capability |
|--------|------------|
| Data Layers | google_data + admin_data + merged display |
| Sync | Aggregate multiple Google Sheets published CSVs |
| Import/Export | Upload CSV by month; download template |
| Auth | Simple admin cookie session, employee pseudo-login |
| Editing | In-place admin shift cell editing |
| Tracking | modified_shifts.json with monthly stats |
| Requests | Shift change & swap (submit, approve, reject) |
| Employee UI | Today/Tomorrow, calendar, upcoming work days, time off, shift changes, history |
| Admin UI | Tabs: Data Sync, Google Links, Team Management, Schedule Requests, Modified Shifts, Google Data, Admin Data, CSV Import |
| Audit | Modified shifts list + per-user counts |
| Middleware | Protect /admin routes |

---

## Project Structure

```
data/
  admin_data.json
  google_data.json
  modified_shifts.json
  google_links.json
  schedule_requests.json
app/
  admin/...
  api/...
components/
lib/
styles/
```

---

## Setup

1. Clone repository.
2. Copy `env.example` to `.env.local` and set:
   ```
   ADMIN_USERS_JSON=[{"username":"admin","password":"password123"}]
   APP_SECRET=change_this_secret
   ```
3. Install & run:
   ```bash
   npm install
   npm run dev
   ```
4. Visit:
   - Employee dashboard: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login

---

## CSV Template

Download via `/api/admin/download-template`.  
Import via Admin → CSV Import.

---

## Shift Codes

`M2, M3, M4, D1, D2, DO (Day Off), SL (Sick), CL (Casual), EL (Emergency)`

---

## Security Notes

- Not production hardened (no hashing, RBAC, rate limiting).
- Add proper auth (NextAuth/JWT), validation (zod), and DB (Postgres) before production.
- Consider locking request spam & input sanitization.

---

## Extending

- Add historical month filters to modified shifts tab.
- Add per-user dashboards for request status breakdown.
- Migrate JSON persistence to a database layer.

---

## Scripts

| Script | Description |
|--------|-------------|
| dev | Start Next.js dev server |
| build | Production build |
| start | Start production server |

---

## License

MIT (adapt as needed).

---

## Credits

Original Flask implementation by you. Port & refactor scaffold generated via AI assistance.
