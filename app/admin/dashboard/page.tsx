import AdminLayoutShell from '@/components/AdminLayoutShell';
import DashboardTab from '@/components/AdminTabs/DashboardTab';
import DataSyncTab from '@/components/AdminTabs/DataSyncTab';
import GoogleLinksTab from '@/components/AdminTabs/GoogleLinksTab';
import TeamManagementTab from '@/components/AdminTabs/TeamManagementTab';
import UserManagementTab from '@/components/AdminTabs/UserManagementTab';
import ScheduleRequestsTab from '@/components/AdminTabs/ScheduleRequestsTab';
import GoogleDataTab from '@/components/AdminTabs/GoogleDataTab';
import AdminDataTab from '@/components/AdminTabs/AdminDataTab';
import CsvImportTab from '@/components/AdminTabs/CsvImportTab';
import ModifiedShiftsTab from '@/components/AdminTabs/ModifiedShiftsTab';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function AdminDashboardPage() {
  const user = getSessionUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminLayoutShell adminUser={user}>
      <DashboardTab id="dashboard" />
      <ScheduleRequestsTab id="schedule-requests" />
      <TeamManagementTab id="team-management" />
      <UserManagementTab id="user-management" />
      <DataSyncTab id="data-sync" />
      <GoogleLinksTab id="google-links" />
      <GoogleDataTab id="google-data" />
      <AdminDataTab id="admin-data" />
      <CsvImportTab id="csv-import" />
    </AdminLayoutShell>
  );
}