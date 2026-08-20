import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SellerProfile() {
  const { user } = useAuth();
  
  // Mock form state based on Prisma Seller schema
  const [form, setForm] = useState({
    storeName: 'My Premium Store',
    storeDescription: 'We sell the best handcrafted shoes on the market.',
    contactEmail: user?.email || '',
    contactPhone: '+91 9876543210',
    addressLine1: '123 Market Street',
    addressLine2: 'Suite 400',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Image Mock
  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);

  // Sync user email if available
  useEffect(() => {
    if (user?.email && !form.contactEmail) {
      setForm(prev => ({ ...prev, contactEmail: user.email }));
    }
  }, [user]);

  const setField = (field, value) => setForm(current => ({ ...current, [field]: value }));

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Basic Validation
    if (!form.storeName.trim() || !form.contactEmail.trim() || !form.contactPhone.trim()) {
      setError('Please fill out all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Mock API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    }, 800);
  };

  return (
    <>
      <div className="seller-page-intro">
        <div>
          <p className="seller-eyebrow">Store Configuration</p>
          <h1>Seller Profile</h1>
          <p>Manage your public store presence and business details.</p>
        </div>
      </div>

      <form className="seller-product-form" onSubmit={handleSubmit}>
        
        {/* Personal Details (Read-only User Info) */}
        <section className="seller-panel" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '16px' }}>Account Information</h2>
          <div className="seller-form-grid">
            <label>Owner Name
              <input value={user?.name || ''} disabled style={{ background: 'var(--wood-2)', color: 'var(--cream-2)', cursor: 'not-allowed' }} />
            </label>
            <label>Login Email
              <input value={user?.email || ''} disabled style={{ background: 'var(--wood-2)', color: 'var(--cream-2)', cursor: 'not-allowed' }} />
            </label>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--cream-2)', marginTop: '8px' }}>This information is tied to your Marki account and cannot be changed here.</p>
        </section>

        {/* Store Logo Mock */}
        <section className="seller-panel" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '8px' }}>Store Logo</h2>
          <p style={{ fontSize: '13px', color: 'var(--cream-2)', marginBottom: '16px' }}>This logo will appear on your storefront and invoices.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div 
              style={{ 
                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--wood-2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              {logo ? <img src={logo} alt="Store Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--cream-2)', fontSize: '24px' }}>{form.storeName.charAt(0) || 'S'}</span>}
            </div>
            <div>
              <button type="button" className="seller-secondary-button" onClick={() => fileInputRef.current?.click()}>Upload Logo</button>
              {logo && <button type="button" className="seller-text-button" style={{ color: '#d32f2f', marginLeft: '12px' }} onClick={() => setLogo(null)}>Remove</button>}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
              <p style={{ fontSize: '11px', color: 'var(--cream-2)', marginTop: '8px' }}>JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </section>

        {/* Store Information */}
        <section className="seller-panel" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '16px' }}>Business Details</h2>
          <div className="seller-form-grid">
            <label>Store Name *<input value={form.storeName} onChange={e => setField('storeName', e.target.value)} required /></label>
            <label>Contact Email *<input type="email" value={form.contactEmail} onChange={e => setField('contactEmail', e.target.value)} required /></label>
            <label>Contact Phone *<input type="tel" value={form.contactPhone} onChange={e => setField('contactPhone', e.target.value)} required /></label>
            <label className="wide">Store Description
              <textarea value={form.storeDescription} onChange={e => setField('storeDescription', e.target.value)} rows="3" />
            </label>
          </div>
        </section>

        {/* Address */}
        <section className="seller-panel" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '16px' }}>Business Address</h2>
          <div className="seller-form-grid">
            <label className="wide">Address Line 1<input value={form.addressLine1} onChange={e => setField('addressLine1', e.target.value)} /></label>
            <label className="wide">Address Line 2 (Optional)<input value={form.addressLine2} onChange={e => setField('addressLine2', e.target.value)} /></label>
            <label>City<input value={form.city} onChange={e => setField('city', e.target.value)} /></label>
            <label>State / Province<input value={form.state} onChange={e => setField('state', e.target.value)} /></label>
            <label>Postal Code<input value={form.postalCode} onChange={e => setField('postalCode', e.target.value)} /></label>
            <label>Country<input value={form.country} onChange={e => setField('country', e.target.value)} /></label>
          </div>
        </section>

        {/* Messages & Submit */}
        {error && <div className="seller-inline-error" style={{ background: 'rgba(183, 93, 53, 0.08)', color: 'var(--copper-3)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{error}</div>}
        {success && <div className="seller-inline-error" style={{ background: 'rgba(39, 174, 96, 0.1)', color: '#27ae60', border: '1px solid #27ae60', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{success}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <button type="submit" className="seller-primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving Profile...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  );
}
