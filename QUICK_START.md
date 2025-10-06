# Quick Start Guide - Next-Roster

## 🚀 Get Started in 3 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

---

## 📦 Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/fhrahid/next-roster.git
cd next-roster

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 🔐 Login Credentials

### Client Dashboard
Navigate to: `http://localhost:3000`

**Test User:**
- Employee ID: `SLL-88717`
- Name: Efat Anan Shekh (VOICE team)

### Admin Panel
Navigate to: `http://localhost:3000/admin/login`

**Admin Accounts:**
| Username | Password | Role |
|----------|----------|------|
| `admin` | `password123` | Super Admin |
| `istiaque` | `cartup123` | Admin |
| `abbas` | `voice2024` | Team Leader (Voice) |

---

## 🎯 What to Try First

### Client Side (5 minutes)
1. **Login**: Use ID `SLL-88717`
2. **View Schedule**: See today and tomorrow's shifts
3. **Open Calendar**: Click "Select Date from Calendar" button
4. **Search Employee**: Type "Abbas" and select him
5. **View Stats**: Click on stat cards to expand details
6. **Try Shift View**: Click the "Shift View" button

### Admin Side (5 minutes)
1. **Login**: Use `istiaque` / `cartup123`
2. **Dashboard**: View the graphs and statistics
3. **User Management**: Add a test user
4. **Profile**: Update your profile information
5. **Schedule Requests**: View and approve/decline requests
6. **Team Management**: Browse teams and employees

---

## 📚 Key Features

### ✨ Client Dashboard
- 📅 **Collapsible Calendar** - Modern date selector
- 🔍 **Employee Search** - View any employee's schedule
- 📊 **Dynamic Stat Cards** - Expand for details
- 🎨 **Visual Indicators** - Color-coded shifts
- ✅ **Approved Requests** - Track approved shifts

### 🛠️ Admin Panel
- 📈 **Analytics Dashboard** - Team health metrics
- 👥 **User Management** - CRUD for admin users
- 📋 **Request Management** - Approve/decline workflow
- 🎨 **Modern Dark Theme** - Professional appearance
- 👤 **Profile Management** - Self-service updates

---

## 🎨 Theme Overview

The application uses a modern dark corporate theme:
- **Background**: Deep blacks and dark grays
- **Accents**: Professional blues and subtle gradients
- **Highlights**: Green (working), Red (off), Orange (pending)
- **Typography**: Clean, readable fonts

---

## 📱 Responsive Design

The application works on:
- 💻 **Desktop** (1200px+) - Full features
- 📱 **Tablet** (768-1200px) - Adapted layout
- 📱 **Mobile** (<768px) - Compact view

---

## 🔧 Common Tasks

### Submit a Shift Change Request
1. Login to client dashboard
2. Click "Request Shift Change"
3. Select date from mini calendar
4. Choose requested shift
5. Enter reason and submit

### Approve a Request (Admin)
1. Login to admin panel
2. Go to "Schedule Requests" tab
3. Find pending request
4. Click "Approve" or "Reject"

### Add a Team Leader (Admin)
1. Login as admin
2. Go to "User Management" tab
3. Click "Add New User"
4. Fill in details with role "Team Leader"
5. Submit

### Change Your Password
1. Login to admin panel
2. Go to "My Profile" tab
3. Enter current password
4. Enter new password twice
5. Click "Change Password"

---

## 📖 Documentation

For detailed information, see:
- **TESTING_GUIDE.md** - Comprehensive testing procedures
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **README.md** - Project overview

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Next.js will automatically use port 3001 if 3000 is busy
# Or kill the process using the port:
lsof -ti:3000 | xargs kill
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Login Issues
- Ensure `.env.local` file exists (created automatically)
- Check `data/admin_users.json` for user list
- Verify correct credentials from table above

---

## 🎯 Quick Testing Checklist

### Client Side ✓
- [ ] Login works
- [ ] Calendar selector expands/collapses
- [ ] Employee search shows full schedule
- [ ] Stat cards expand with details
- [ ] Can submit shift change request
- [ ] Can submit swap request

### Admin Side ✓
- [ ] Admin login works
- [ ] Dashboard shows statistics
- [ ] Can manage users
- [ ] Can approve requests
- [ ] Profile editing works
- [ ] Theme looks professional

---

## 🚀 Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 💡 Tips

1. **Use Chrome DevTools** for best debugging experience
2. **Check Browser Console** for any errors
3. **Test on Multiple Devices** for responsive design
4. **Clear Browser Cache** if seeing old data
5. **Use Incognito Mode** to test fresh sessions

---

## 📞 Support

If you encounter issues:
1. Check the **TESTING_GUIDE.md** for detailed procedures
2. Review **IMPLEMENTATION_SUMMARY.md** for technical details
3. Verify credentials are correct
4. Check console for error messages
5. Ensure all dependencies are installed

---

## ✅ Next Steps

1. ✅ Complete Quick Start (above)
2. ✅ Review TESTING_GUIDE.md for detailed testing
3. ✅ Read IMPLEMENTATION_SUMMARY.md for technical overview
4. ✅ Test all features systematically
5. ✅ Report any issues found
6. ✅ Deploy to production when satisfied

---

## 🎉 Enjoy Your New Roster Management System!

All features are implemented and ready to use. The application is production-ready with:
- Modern, professional interface
- Complete feature set
- Comprehensive documentation
- Secure authentication
- Responsive design

**Happy scheduling!** 📅✨

---

*For detailed testing procedures, see TESTING_GUIDE.md*
*For technical documentation, see IMPLEMENTATION_SUMMARY.md*
