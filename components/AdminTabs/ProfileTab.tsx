"use client";
import { useState, useEffect } from 'react';

interface Props { 
  id: string;
  currentUser: string;
}

export default function ProfileTab({ id, currentUser }: Props) {
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [uploadingPic, setUploadingPic] = useState(false);

  async function loadProfile() {
    const res = await fetch('/api/admin/users/list').then(r => r.json());
    if (res.success) {
      const user = res.users.find((u: any) => u.username === currentUser);
      if (user) {
        setUserDetails(user);
        setFullName(user.full_name);
      }
    }
  }

  async function updateProfile() {
    if (!fullName) {
      alert('Full name is required');
      return;
    }

    setLoading(true);
    const updates: any = { full_name: fullName };

    const res = await fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, updates })
    }).then(r => r.json());

    setLoading(false);
    if (res.success) {
      alert('Profile updated successfully');
      loadProfile();
    } else {
      alert(res.error || 'Failed to update profile');
    }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    // First verify current password by attempting login
    const loginRes = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, password: currentPassword })
    }).then(r => r.json());

    if (!loginRes.success) {
      setLoading(false);
      alert('Current password is incorrect');
      return;
    }

    // Update password
    const updateRes = await fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: currentUser, 
        updates: { password: newPassword } 
      })
    }).then(r => r.json());

    setLoading(false);
    if (updateRes.success) {
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert(updateRes.error || 'Failed to change password');
    }
  }

  useEffect(() => { loadProfile(); }, []);

  return (
    <div id={id} className="tab-pane">
      <h2>👤 My Profile</h2>
      <p>Manage your account settings and password.</p>

      <div className="section-card">
        <h3>Profile Information</h3>
        
        <div style={{display: 'flex', gap: 30, alignItems: 'flex-start', marginBottom: 20}}>
          <div>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: profilePicture ? `url(${profilePicture}) center/cover` : 'linear-gradient(135deg, #4A7BD0 0%, #6B9FE8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              marginBottom: 10
            }}>
              {!profilePicture && '👤'}
            </div>
            <input 
              type="file" 
              accept="image/*"
              id="profile-pic-upload"
              style={{display: 'none'}}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadingPic(true);
                // Convert to base64
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfilePicture(reader.result as string);
                  setUploadingPic(false);
                };
                reader.readAsDataURL(file);
              }}
            />
            <button 
              className="btn small" 
              onClick={() => document.getElementById('profile-pic-upload')?.click()}
              disabled={uploadingPic}
            >
              {uploadingPic ? 'Uploading...' : '📷 Upload Picture'}
            </button>
          </div>
          
          <div style={{flex: 1}}>
            {userDetails && (
              <div className="profile-info-display">
                <div className="profile-info-item">
                  <span className="profile-label">Username:</span>
                  <span className="profile-value">{userDetails.username}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-label">Role:</span>
                  <span className="profile-value">
                    {userDetails.role === 'super_admin' ? 'Head of Department' : 'Manager'}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-label">Account Created:</span>
                  <span className="profile-value">
                    {new Date(userDetails.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-grid two">
          <div>
            <label>Full Name</label>
            <input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
        </div>
        <div className="actions-row">
          <button className="btn primary" onClick={updateProfile} disabled={loading}>
            {loading ? 'Updating...' : '💾 Update Profile'}
          </button>
        </div>
      </div>

      <div className="section-card">
        <h3>Change Password</h3>
        <div className="form-grid two">
          <div>
            <label>Current Password</label>
            <input 
              type="password"
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div></div>
          <div>
            <label>New Password</label>
            <input 
              type="password"
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label>Confirm New Password</label>
            <input 
              type="password"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div className="actions-row">
          <button className="btn primary" onClick={changePassword} disabled={loading}>
            {loading ? 'Changing...' : '🔐 Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
