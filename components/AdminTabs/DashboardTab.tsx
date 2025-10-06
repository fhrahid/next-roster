"use client";
import { useState, useEffect } from 'react';

interface Props { id: string; }

interface DashboardStats {
  swap_requests: {
    total: number;
    accepted: number;
    rejected: number;
    pending: number;
    acceptance_rate: number;
  };
  team_stats: {
    [team: string]: {
      total_employees: number;
      working_days: number;
      off_days: number;
    };
  };
  recent_activity: any[];
}

export default function DashboardTab({ id }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    try {
      // Load requests data
      const requestsRes = await fetch('/api/schedule-requests/get-all').then(r => r.json());
      
      // Load admin data for team stats
      const adminRes = await fetch('/api/admin/get-admin-data').then(r => r.json());

      if (requestsRes.success && adminRes) {
        const allRequests = requestsRes.all_requests || [];
        const swapRequests = allRequests.filter((r: any) => r.type === 'swap');
        
        const swapStats = {
          total: swapRequests.length,
          accepted: swapRequests.filter((r: any) => r.status === 'approved').length,
          rejected: swapRequests.filter((r: any) => r.status === 'rejected').length,
          pending: swapRequests.filter((r: any) => r.status === 'pending').length,
          acceptance_rate: swapRequests.length > 0 
            ? Math.round((swapRequests.filter((r: any) => r.status === 'approved').length / swapRequests.length) * 100)
            : 0
        };

        // Calculate team stats
        const teamStats: any = {};
        if (adminRes.teams) {
          Object.entries(adminRes.teams).forEach(([teamName, employees]: [string, any]) => {
            let workingDays = 0;
            let offDays = 0;
            
            employees.forEach((emp: any) => {
              emp.schedule.forEach((shift: string) => {
                if (['DO', 'SL', 'CL', 'EL', ''].includes(shift)) {
                  offDays++;
                } else {
                  workingDays++;
                }
              });
            });

            teamStats[teamName] = {
              total_employees: employees.length,
              working_days: workingDays,
              off_days: offDays
            };
          });
        }

        setStats({
          swap_requests: swapStats,
          team_stats: teamStats,
          recent_activity: allRequests.slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
    setLoading(false);
  }

  useEffect(() => { loadDashboard(); }, []);

  if (loading) {
    return (
      <div id={id} className="tab-pane">
        <h2>📊 Dashboard</h2>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div id={id} className="tab-pane">
        <h2>📊 Dashboard</h2>
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div id={id} className="tab-pane">
      <h2>📊 Dashboard</h2>
      <p>Overview of team health, swap requests, and activity.</p>

      <div className="dashboard-grid">
        {/* Swap Requests Overview */}
        <div className="dashboard-card">
          <h3>🔁 Swap Requests Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.swap_requests.total}</div>
              <div className="stat-label">Total Requests</div>
            </div>
            <div className="stat-item success">
              <div className="stat-value">{stats.swap_requests.accepted}</div>
              <div className="stat-label">Accepted</div>
            </div>
            <div className="stat-item danger">
              <div className="stat-value">{stats.swap_requests.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
            <div className="stat-item warning">
              <div className="stat-value">{stats.swap_requests.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="acceptance-rate">
            <div className="rate-label">Acceptance Rate</div>
            <div className="rate-bar">
              <div 
                className="rate-fill" 
                style={{ width: `${stats.swap_requests.acceptance_rate}%` }}
              ></div>
            </div>
            <div className="rate-value">{stats.swap_requests.acceptance_rate}%</div>
          </div>
        </div>

        {/* Team Health Overview */}
        <div className="dashboard-card">
          <h3>👥 Team Health Overview</h3>
          <div className="team-stats-list">
            {Object.entries(stats.team_stats).map(([teamName, teamData]) => (
              <div key={teamName} className="team-stat-item">
                <div className="team-name">{teamName}</div>
                <div className="team-metrics">
                  <div className="team-metric">
                    <span className="metric-label">Employees:</span>
                    <span className="metric-value">{teamData.total_employees}</span>
                  </div>
                  <div className="team-metric">
                    <span className="metric-label">Working Days:</span>
                    <span className="metric-value success">{teamData.working_days}</span>
                  </div>
                  <div className="team-metric">
                    <span className="metric-label">Off Days:</span>
                    <span className="metric-value danger">{teamData.off_days}</span>
                  </div>
                </div>
                <div className="team-bar">
                  <div 
                    className="team-bar-working" 
                    style={{ 
                      width: `${(teamData.working_days / (teamData.working_days + teamData.off_days)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card full-width">
          <h3>📋 Recent Activity</h3>
          <div className="activity-list">
            {stats.recent_activity.length === 0 ? (
              <div className="no-activity">No recent activity</div>
            ) : (
              stats.recent_activity.map((activity: any, idx: number) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'swap' ? '🔁' : '✏️'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {activity.type === 'swap' 
                        ? `${activity.requester_name} requested swap with ${activity.target_employee_name}`
                        : `${activity.employee_name} requested shift change`}
                    </div>
                    <div className="activity-meta">
                      <span>{activity.date}</span>
                      <span className={`activity-status ${activity.status}`}>{activity.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="actions-row" style={{ marginTop: 20 }}>
        <button className="btn small" onClick={loadDashboard}>🔄 Refresh</button>
      </div>
    </div>
  );
}
