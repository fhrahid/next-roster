import './globals.css';
import '../styles/admin.css';
import '../styles/viewer.css';
import '../styles/calendar.css';
import '../styles/modals.css';
import '../styles/requests.css';
import '../styles/modern-ui.css';
import '../styles/calendar-selector.css';

export const metadata = {
  title: 'Cartup CxP Roster',
  description: 'Roster Management System (Next.js)'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}