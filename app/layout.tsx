import './globals.css';
import '../styles/admin.css';
import '../styles/viewer.css';
import '../styles/calendar.css';
import '../styles/modals.css';
import '../styles/requests.css';

import { loadAll } from '@/lib/dataStore';

export const metadata = {
  title: 'Cartup CxP Roster',
  description: 'Roster Management System (Next.js)'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  // Load data once on server start (NOTE: serverless cold start loads too)
  loadAll();
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}