"use client";
import { useState, useEffect } from 'react';

interface Props { id: string; }

interface AdminUser {
  username: string;
  role: string;
  full_name: string;
  created_at: string;
}

export default function UserManagementTab({ id }: Props) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [fullName, setFullName] = useState('');

  async function loadUsers() {
    setLoading(true);
    const res = await fetch('/api/admin/users/list').then(r => r.json());
    if (res.success) setUsers(res.users);
    setLoading(false);
  }

  async function addUser() {
    if (!username || !password || !fullName) {
      alert('Please fill all fields');
      return;
    }

    const res = await fetch('/api/admin/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role, full_name: fullName })
    }).then(r => r.json());

    if (res.success) {
      resetForm();
      loadUsers();
    } else {
      alert(res.error || 'Failed to add user');
    }
  }

  async function updateUser() {
    if (!editingUser || !fullName) {
      alert('Please fill all required fields');
      return;
    }

    const updates: any = { full_name: fullName, role };
    if (password) updates.password = password;

    const res = await fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: editingUser, updates })
    }).then(r => r.json());

    if (res.success) {
      resetForm();
      loadUsers();
    } else {
      alert(res.error || 'Failed to update user');
    }
  }

  async function deleteUser(username: string) {
    if (!confirm(`Delete user ${username}? This cannot be undone.`)) return;

    const res = await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    }).then(r => r.json());

    if (res.success) {
      loadUsers();
    } else {
      alert(res.error || 'Failed to delete user');
    }
  }

  function startEdit(user: AdminUser) {
    setEditingUser(user.username);
    setUsername(user.username);
    setFullName(user.full_name);
    setRole(user.role);
    setPassword('');
  }

  function resetForm() {
    setEditingUser(null);
    setUsername('');
    setPassword('');
    setRole('admin');
    setFullName('');
  }

  useEffect(() => { loadUsers(); }, []);

  return (
    <div id={id} className="tab-pane">
      <h2>👥 User Management</h2>
      <p>Manage admin users and team leaders who can access the admin panel.</p>

      <div className="section-card">
        <h3>Admin Users</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5}>No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.username}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.full_name}</td>
                    <td>
                      <span className={`badge ${u.role === 'super_admin' ? 'primary' : 'secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn tiny" onClick={() => startEdit(u)}>✏️ Edit</button>
                      <button className="btn danger tiny" onClick={() => deleteUser(u.username)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
        <div className="form-grid two">
          <div>
            <label>Username</label>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="username"
              disabled={!!editingUser}
            />
          </div>
          <div>
            <label>Full Name</label>
            <input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label>Password {editingUser && '(leave blank to keep current)'}</label>
            <input 
              type="password"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="team_leader">Team Leader</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
        <div className="actions-row">
          {!editingUser ? (
            <button className="btn primary" onClick={addUser}>➕ Add User</button>
          ) : (
            <>
              <button className="btn primary" onClick={updateUser}>💾 Save Changes</button>
              <button className="btn" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
