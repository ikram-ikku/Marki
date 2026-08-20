import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SellerSettings() {
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const setField = (field, value) => setForm(current => ({ ...current, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validation
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Please fill out all password fields.');
      setIsSubmitting(false);
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError('New password cannot be the same as your current password.');
      setIsSubmitting(false);
      return;
    }

    // Mock API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess('Your password has been changed successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 5000);
    }, 1000);
  };

  return (
    <>
      <div className="seller-page-intro">
        <div>
          <p className="seller-eyebrow">Account Settings</p>
          <h1>Security & Access</h1>
          <p>Manage your password and account security preferences.</p>
        </div>
      </div>

      <form className="seller-product-form" onSubmit={handleSubmit}>
        
        <section className="seller-panel" style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(28,28,28,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '8px' }}>Account Status</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--wood-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--black-brown)', fontWeight: 600, fontSize: '18px' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--black-brown)' }}>{user?.name}</strong>
                <span style={{ fontSize: '13px', color: 'var(--cream-2)' }}>{user?.email}</span>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="seller-status published">ACTIVE SELLER</span>
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '16px' }}>Change Password</h2>
          
          <div className="seller-form-grid" style={{ maxWidth: '500px' }}>
            <label className="wide">
              Current Password *
              <input 
                type="password" 
                value={form.currentPassword} 
                onChange={e => setField('currentPassword', e.target.value)} 
                required 
              />
            </label>
            <label className="wide">
              New Password *
              <input 
                type="password" 
                value={form.newPassword} 
                onChange={e => setField('newPassword', e.target.value)} 
                required 
                minLength={6}
              />
            </label>
            <label className="wide">
              Confirm New Password *
              <input 
                type="password" 
                value={form.confirmPassword} 
                onChange={e => setField('confirmPassword', e.target.value)} 
                required 
                minLength={6}
              />
            </label>
          </div>
        </section>

        {/* Messages & Submit */}
        {error && <div className="seller-inline-error" style={{ background: 'rgba(183, 93, 53, 0.08)', color: 'var(--copper-3)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{error}</div>}
        {success && <div className="seller-inline-error" style={{ background: 'rgba(39, 174, 96, 0.1)', color: '#27ae60', border: '1px solid #27ae60', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{success}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingBottom: '40px' }}>
          <button type="submit" className="seller-primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Password...' : 'Update Password'}
          </button>
        </div>
      </form>
    </>
  );
}
