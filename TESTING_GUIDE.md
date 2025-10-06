# Next-Roster Testing Guide

## Overview
This guide provides comprehensive testing instructions for all the new features implemented in the Next-Roster application.

## Test Credentials

### Client-Side Users (Employees)
- **Efat Anan Shekh**: ID `SLL-88717` (VOICE team)
- **Abbas Ebna Ahmad**: ID `SLL-88477` (TL team)

### Admin Users
1. **Super Admin**
   - Username: `admin`
   - Password: `password123`
   
2. **Admin**
   - Username: `istiaque`
   - Password: `cartup123`
   
3. **Team Leader (Voice)**
   - Username: `abbas`
   - Password: `voice2024`
   - Full Name: Abbas Ebna Ahmad

---

## Client-Side Testing

### 1. Login and Basic Schedule Viewing
**Steps:**
1. Navigate to the main page
2. Login with ID: `SLL-88717`
3. Verify you see:
   - Welcome message with full name (Efat Anan Shekh)
   - Today's shift information
   - Tomorrow's shift information
   - Team designation (VOICE)

**Expected Result:** ✅ Dashboard displays correctly with proper employee information

### 2. Collapsible Calendar Selector
**Steps:**
1. After logging in, locate the "Schedule Calendar" section
2. Click on the calendar selector button (should say "Select Date from Calendar")
3. Calendar should expand showing all available dates
4. Try filtering by shift type using the dropdown
5. Select a date from the calendar
6. Verify the selected date appears in the "Selected Date" row

**Expected Result:** ✅ Calendar collapses/expands smoothly, dates are color-coded (green=working, red=off)

### 3. Employee Search Functionality
**Steps:**
1. Scroll to "Search Other Employees" section
2. Type "Abbas" in the search box
3. Select "Abbas Ebna Ahmad" from the dropdown
4. Verify the page updates to show:
   - Abbas's name and ID in the employee header
   - Abbas's today/tomorrow shifts
   - "Back to My Schedule" button appears
   - Stat cards show Abbas's data (not your own)
   - Calendar shows Abbas's schedule

**Expected Result:** ✅ Full schedule panel switches to searched employee, stat cards update accordingly

### 4. Calendar Date Selection for Searched Employee
**Steps:**
1. While viewing Abbas's schedule
2. Open the calendar selector
3. Select a different date
4. Verify "Selected Date" row shows the correct shift for Abbas

**Expected Result:** ✅ Selected date updates correctly for the searched employee

### 5. Shift View (Collapsible)
**Steps:**
1. Click on "Shift View" button (with eye icon 👁️)
2. Panel should expand (not open as modal)
3. Select a date, shift filter, and team
4. View employees working that shift

**Expected Result:** ✅ Shift View expands inline, shows correct filtering

### 6. Request Shift Change with Mini Calendar
**Steps:**
1. Return to your own schedule (click "Back to My Schedule" if needed)
2. Click "Request Shift Change" button
3. In the modal, you should see a mini calendar with:
   - Color coding (green=working days, red=off days)
   - Shift codes displayed on each date
   - Month navigation arrows
4. Select a date from the calendar
5. Choose a requested shift
6. Enter a reason
7. Submit the request

**Expected Result:** ✅ Mini calendar displays with colors, date selection works, request submits successfully

### 7. Request Shift Swap with Mini Calendar
**Steps:**
1. Click "Request Swap" button
2. Mini calendar should appear with same color coding
3. Select a date
4. Search for a team member
5. Select a team member to swap with
6. Verify the swap comparison shows both shifts
7. Enter a reason and submit

**Expected Result:** ✅ Mini calendar works, team members load, swap comparison displays correctly

### 8. Approved Shifts Stat Card
**Steps:**
1. If you have any approved requests, you should see an "Approved Shifts" stat card
2. Click on it to expand
3. View the details of approved requests showing previous vs current shift

**Expected Result:** ✅ Stat card displays approved requests with change details

---

## Admin-Side Testing

### 1. Admin Login
**Steps:**
1. Navigate to `/admin/login`
2. Try logging in with:
   - Username: `istiaque`
   - Password: `cartup123`
3. Should redirect to admin dashboard

**Expected Result:** ✅ Login successful, redirects to modern dark-themed dashboard

### 2. Modern Dark Theme UI
**Steps:**
1. After logging in, observe:
   - Left sidebar with dark corporate theme
   - Navigation items with icons
   - User card at bottom of sidebar with logout button
   - Main content area with header
   - Professional color scheme

**Expected Result:** ✅ UI is modern, dark, and professional-looking with left sidebar

### 3. Dashboard Tab
**Steps:**
1. Should be on Dashboard tab by default
2. Verify you see:
   - **Swap Requests Overview**: Total, Accepted, Rejected, Pending counts
   - **Acceptance Rate**: Visual bar showing percentage
   - **Team Health Overview**: Each team showing employees, working days, off days
   - **Recent Activity**: List of recent requests

**Expected Result:** ✅ All statistics display correctly, graphs show proper data

### 4. Schedule Requests Tab
**Steps:**
1. Click on "Schedule Requests" in sidebar
2. View pending requests
3. Try approving one request
4. Try rejecting another request
5. Toggle to view all requests

**Expected Result:** ✅ Requests display, approval/decline works, stats update

### 5. Team Management Tab
**Steps:**
1. Click on "Team Management"
2. View existing teams and employees
3. Try adding a new employee to a team
4. Try editing an existing employee
5. Try adding a new team

**Expected Result:** ✅ Team and employee management works correctly

### 6. User Management Tab
**Steps:**
1. Click on "User Management"
2. View list of admin users (should see admin, istiaque, and abbas)
3. Try adding a new user:
   - Username: `testuser`
   - Full Name: `Test User`
   - Password: `test123`
   - Role: `team_leader`
4. Edit the test user
5. Delete the test user
6. Verify you cannot delete your own account

**Expected Result:** ✅ User CRUD operations work, self-deletion prevented

### 7. My Profile Tab
**Steps:**
1. Click on "My Profile"
2. View your account information (username, role, creation date)
3. Update your full name
4. Try changing password:
   - Enter current password: `cartup123`
   - Enter new password: `cartup456`
   - Confirm new password: `cartup456`
   - Submit
5. Logout and login with new password
6. Change password back if desired

**Expected Result:** ✅ Profile updates work, password change requires current password verification

### 8. Test Abbas as Team Leader
**Steps:**
1. Logout from current admin account
2. Login with:
   - Username: `abbas`
   - Password: `voice2024`
3. Verify Abbas can access admin panel
4. Check that appropriate tabs are visible for team leader role
5. Test basic functionality (viewing requests, teams, etc.)

**Expected Result:** ✅ Team leader can login and access admin panel

### 9. Data Sync and Google Integration
**Steps:**
1. Click on "Data Sync" tab
2. Verify existing sync functionality still works
3. Click on "Google Sheets" tab
4. Verify links management works
5. Test other existing tabs (Google Data, Admin Data, CSV Import)

**Expected Result:** ✅ All existing functionality preserved and working

---

## Integration Testing

### 1. Request Flow (Client to Admin)
**Steps:**
1. **Client Side**: Login as SLL-88717
2. Submit a shift change request
3. Note the request ID
4. **Admin Side**: Login as istiaque
5. Navigate to Schedule Requests
6. Find the request you just submitted
7. Approve it
8. **Client Side**: Return to client dashboard
9. Refresh and check if request shows as "approved"
10. Check if it appears in Approved Shifts stat card

**Expected Result:** ✅ Request flows from client to admin, approval updates status, appears in approved shifts

### 2. Employee Search and Data Consistency
**Steps:**
1. Login as SLL-88717
2. Search for Abbas (SLL-88477)
3. Note Abbas's today/tomorrow shifts
4. **Admin Side**: Check Abbas's schedule in Team Management or Admin Data
5. Verify the shifts match what you saw on client side

**Expected Result:** ✅ Data is consistent across client and admin views

### 3. User Creation and Immediate Login
**Steps:**
1. **Admin Side**: Login as admin
2. Go to User Management
3. Create a new team leader user
4. Note the credentials
5. Logout
6. Login with the new credentials immediately
7. Verify access works

**Expected Result:** ✅ Newly created users can login immediately

---

## Performance and UX Testing

### 1. Responsive Design
**Steps:**
1. Test on different screen sizes (desktop, tablet, mobile)
2. Verify sidebar adapts appropriately
3. Check that tables scroll horizontally on small screens
4. Verify forms adapt to smaller screens

**Expected Result:** ✅ UI is responsive and usable on all screen sizes

### 2. Animation and Transitions
**Steps:**
1. Observe calendar selector expand/collapse animation
2. Check shift view collapsible animation
3. Verify stat card expansion is smooth
4. Check sidebar navigation transitions

**Expected Result:** ✅ All animations are smooth and enhance UX

### 3. Data Loading States
**Steps:**
1. Observe loading states when fetching data
2. Check that appropriate loading indicators appear
3. Verify error messages display if API calls fail

**Expected Result:** ✅ Loading states and error handling work properly

---

## Security Testing

### 1. Authentication
**Steps:**
1. Try accessing `/admin/dashboard` without logging in
2. Should redirect to `/admin/login`
3. Try with wrong credentials
4. Verify proper error message

**Expected Result:** ✅ Protected routes require authentication

### 2. Authorization
**Steps:**
1. As team leader, try to access admin-only features
2. Verify appropriate restrictions
3. Confirm team leaders cannot delete other admin users

**Expected Result:** ✅ Role-based access control works correctly

---

## Regression Testing

### 1. Existing Features Still Work
**Steps:**
- Test existing calendar functionality
- Test request submission without using new features
- Verify old modals still work if accessed directly
- Check that all API endpoints respond correctly

**Expected Result:** ✅ No existing functionality is broken

---

## Known Issues and Limitations

1. Employee search in swap request should show only team members with compatible shifts
2. Selected date should auto-populate when clicking request buttons from calendar
3. Mobile sidebar may need toggle button for very small screens

---

## Success Criteria

### Client Side
- ✅ Collapsible calendar selector works with color coding
- ✅ Employee search shows full schedule with updated stat cards
- ✅ Shift View is collapsible, not modal
- ✅ Request modals use mini calendar with visual indicators
- ✅ Approved Shifts stat card displays

### Admin Side
- ✅ Dark corporate theme with left sidebar
- ✅ Dashboard with graphs and metrics
- ✅ User management for team leaders
- ✅ Profile editing for all users
- ✅ Request approval/decline works
- ✅ All data syncs correctly

---

## Report Issues

If you encounter any issues during testing:
1. Note the exact steps to reproduce
2. Capture any error messages
3. Note the user/account you were using
4. Document expected vs actual behavior

---

## Conclusion

This testing guide covers all major features implemented. The application now provides a comprehensive, modern interface for both employees and administrators with enhanced functionality and improved user experience.
