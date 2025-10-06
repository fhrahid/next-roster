# Testing Checklist for Next Roster Improvements

## Prerequisites
- Build completed successfully ✅
- Application running on localhost
- Test credentials ready

## Client Side Testing

### Test User Login
**Credentials**: Employee ID: `SLL-88717`

#### 1. Dashboard View ✅
- [ ] Login successful
- [ ] Today's date and shift displayed correctly
- [ ] Tomorrow's date and shift displayed correctly
- [ ] Recent shift changes shown with strikethrough (if any)
- [ ] Stat cards display:
  - [ ] Upcoming Days (with shift times)
  - [ ] Planned Time Off (with shift times)
  - [ ] Shift Changes (showing previous → current)
  - [ ] Approved Shifts (if any requests approved)
  - [ ] Approved Swaps (if any swaps approved)

#### 2. Request Shift Change ✅
- [ ] Click "✏️ Request Shift Change" button
- [ ] Mini calendar displays with:
  - [ ] Month navigation (← →)
  - [ ] Dates in small compact boxes
  - [ ] Shift times shown (not codes)
  - [ ] Color-coded days (working vs. off)
- [ ] Select a date
- [ ] Preview shows: Previous Shift → Requested Shift
- [ ] Dropdown shows shift times (e.g., "8 AM – 5 PM")
- [ ] Enter reason
- [ ] Submit request
- [ ] Success message appears

#### 3. Request Swap ✅
- [ ] Click "🔁 Request Swap" button
- [ ] Mini calendar displays (same as above)
- [ ] Select a date
- [ ] Search for employee by name or ID
- [ ] Dropdown shows employees with shift times
- [ ] Select employee
- [ ] Preview shows: You (shift time) ⇄ Teammate (shift time)
- [ ] Date shown for context
- [ ] Enter reason
- [ ] Submit request
- [ ] Success message appears

#### 4. Shift View ✅
- [ ] Click "👁️ Shift View" button
- [ ] Expands to show filters
- [ ] Select date from mini calendar
- [ ] Multi-select shift times (chips):
  - [ ] Click multiple shift time chips
  - [ ] Selected chips highlighted
  - [ ] Results filtered accordingly
- [ ] Multi-select teams (chips):
  - [ ] Click multiple team chips
  - [ ] Selected chips highlighted
  - [ ] Results filtered accordingly
- [ ] Table shows:
  - [ ] Name, ID, Team
  - [ ] Shift Time (not code)
  - [ ] Employee count displayed

#### 5. Employee Search ✅
- [ ] Use search box to find another employee
- [ ] Select employee from results
- [ ] View switches to that employee's schedule:
  - [ ] Employee name/ID/team displayed
  - [ ] Today/tomorrow shifts shown
  - [ ] Calendar shows their schedule
  - [ ] Stat cards show their data
- [ ] "← Back to My Schedule" button visible
- [ ] Click "Back to My Schedule"
- [ ] View returns to your schedule
- [ ] Your name/ID/team displayed again

#### 6. Schedule Calendar ✅
- [ ] Expandable calendar selector
- [ ] Shows all dates with shift times
- [ ] Can filter by shift type
- [ ] Selected date highlighted
- [ ] Click date to select it
- [ ] Selected date shows in "Selected Date" row

---

## Admin Side Testing

### Test Admin Login
**Credentials**: Username: `istiaque`, Password: `cartup123`

#### 1. Initial Dashboard View ✅
- [ ] Login successful
- [ ] Role displays as "Head of Department" (not "Super Admin")
- [ ] Sidebar shows all tabs
- [ ] User Management, Team Management, My Profile at bottom

#### 2. Sidebar Functionality ✅
- [ ] Toggle button visible (☰ or ✕)
- [ ] Click toggle to collapse sidebar
  - [ ] Sidebar narrows
  - [ ] Icons only visible
  - [ ] Main content area expands
- [ ] Click toggle again to expand
  - [ ] Sidebar widens
  - [ ] Full labels visible
  - [ ] Main content area adjusts

#### 3. Dashboard Tab ✅
- [ ] Swap Requests Overview shows:
  - [ ] Total (not 0)
  - [ ] Accepted count
  - [ ] Rejected count
  - [ ] Pending count
  - [ ] Acceptance rate percentage
- [ ] Team Health Overview:
  - [ ] Month selector visible
  - [ ] Current month preselected
  - [ ] Shows for each team:
    - [ ] Employees count
    - [ ] Working Days count
    - [ ] Off Days count
    - [ ] Health percentage
    - [ ] Visual bar chart
  - [ ] Change month
  - [ ] Data updates for selected month
- [ ] Audit Log (not "Recent Activity"):
  - [ ] Shows latest activities
  - [ ] Includes timestamps
  - [ ] Shows swap and shift change requests
  - [ ] Employee names visible
  - [ ] Status shown (approved/rejected/pending)

#### 4. Schedule Requests Tab ✅
- [ ] Stats bar shows:
  - [ ] Pending (clickable chip)
  - [ ] Approved (clickable chip)
  - [ ] Rejected (clickable chip)
  - [ ] Shift Changes total
  - [ ] Swaps total
- [ ] Click "Pending" chip:
  - [ ] Chip highlighted
  - [ ] Table shows pending requests only
- [ ] Click "Approved" chip:
  - [ ] Chip highlighted
  - [ ] Table shows approved requests only
- [ ] Click "Rejected" chip:
  - [ ] Chip highlighted
  - [ ] Table shows rejected requests only
- [ ] Table "Employee" column shows:
  - [ ] "Employee Name (ID)" format
  - [ ] NOT "shift_change_3" format
- [ ] Shift columns show:
  - [ ] Shift times (e.g., "8 AM – 5 PM")
  - [ ] NOT codes (e.g., "M2")
- [ ] For pending requests:
  - [ ] Approve button visible
  - [ ] Reject button visible
  - [ ] Test approving one request
  - [ ] Test rejecting one request

#### 5. Admin Data Tab ✅
- [ ] Team filter chips visible at top
- [ ] Click single team chip:
  - [ ] Chip highlighted
  - [ ] Table shows that team only
- [ ] Click multiple team chips:
  - [ ] All selected chips highlighted
  - [ ] Table shows all selected teams
- [ ] Click chip again to deselect
- [ ] Table has horizontal scroll:
  - [ ] Dates don't overflow
  - [ ] Can scroll to see all dates
  - [ ] Custom scrollbar styling
- [ ] Click a shift cell to edit:
  - [ ] Input field appears
  - [ ] Can type new shift code
  - [ ] Datalist shows all valid codes
  - [ ] Save with checkmark
  - [ ] Cancel with X
- [ ] "🔄 Reset to Google Spreadsheet" button:
  - [ ] Red/danger color
  - [ ] Click shows confirmation dialog
  - [ ] Cancel works
  - [ ] (Don't actually reset unless intended)

#### 6. Team Management Tab ✅
- [ ] Located at bottom of sidebar
- [ ] All functionality works as before

#### 7. User Management Tab ✅
- [ ] Located at bottom of sidebar
- [ ] All functionality works as before

#### 8. My Profile Tab ✅
- [ ] Located at bottom of sidebar
- [ ] Profile picture section:
  - [ ] Circular placeholder visible
  - [ ] "📷 Upload Picture" button
  - [ ] Click to select image
  - [ ] Selected image previews
  - [ ] Image scales to fit circle
- [ ] Profile information:
  - [ ] Username displayed
  - [ ] Role shows "Head of Department" or "Manager"
  - [ ] Account created date shown
- [ ] Full name can be updated
- [ ] Password can be changed

---

## Integration Testing

### Test Complete Flow
1. **Employee submits shift change request**
   - [ ] Login as employee (SLL-88717)
   - [ ] Request shift change with mini calendar
   - [ ] See preview of change
   - [ ] Submit successfully

2. **Admin reviews request**
   - [ ] Logout and login as admin (istiaque)
   - [ ] Go to Schedule Requests
   - [ ] See employee name (not shift_change_n)
   - [ ] See shift times (not codes)
   - [ ] Approve the request

3. **Employee sees approved change**
   - [ ] Logout and login as employee
   - [ ] Check Approved Shifts stat card
   - [ ] See the approved change with times
   - [ ] Previous → Current shift displayed

### Test Swap Flow
1. **Employee requests swap**
   - [ ] Login as employee
   - [ ] Request swap with mini calendar
   - [ ] Search for teammate
   - [ ] See swap preview
   - [ ] Submit successfully

2. **Admin reviews swap**
   - [ ] Login as admin
   - [ ] Go to Schedule Requests
   - [ ] Filter to Pending
   - [ ] See swap with both employee names
   - [ ] Approve the swap

3. **Check dashboard stats**
   - [ ] Swap Requests Overview updates
   - [ ] Total count increases
   - [ ] Accepted count increases
   - [ ] Audit log shows swap approval

---

## Visual Checks

### UI/UX Quality
- [ ] All colors consistent with theme
- [ ] No text overflow or clipping
- [ ] Buttons have hover effects
- [ ] Transitions are smooth
- [ ] Loading states show when needed
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Mobile responsive (if applicable)

### Calendar Quality
- [ ] Compact and clean design
- [ ] Easy to read dates
- [ ] Shift times legible
- [ ] Color coding clear
- [ ] Navigation intuitive

### Admin Panel Quality
- [ ] Professional appearance
- [ ] Clear information hierarchy
- [ ] Easy navigation
- [ ] Consistent spacing
- [ ] Readable fonts

---

## Performance Checks
- [ ] Page loads quickly
- [ ] Calendar renders smoothly
- [ ] Multi-select doesn't lag
- [ ] Table scrolling is smooth
- [ ] No console errors
- [ ] No console warnings

---

## Final Sign-Off

### Developer
- [ ] All features implemented
- [ ] Code is clean and documented
- [ ] Build successful
- [ ] No TypeScript errors
- [ ] No linting errors

### Tester
- [ ] All client tests pass
- [ ] All admin tests pass
- [ ] Integration tests pass
- [ ] Visual quality approved
- [ ] Performance acceptable

### Product Owner
- [ ] Requirements met
- [ ] UI/UX approved
- [ ] Ready for production

---

## Notes & Issues Found
(Document any issues found during testing here)

---

## Sign-Off
- Tested by: ________________
- Date: ________________
- Status: ☐ Pass ☐ Fail ☐ Needs Review
- Comments: ________________________________
