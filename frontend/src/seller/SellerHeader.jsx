import { useState, useRef, useEffect } from 'react';

function SellerProfileMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || 'S';
  };

  return (
    <div className="seller-user-menu" ref={menuRef} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
      <div className="seller-user-initial">{getInitial()}</div>
      <div className="seller-user-info">
        <strong>{user?.name || 'Seller'}</strong>
        <span>Seller account</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', color: 'var(--cream-2)' }}>
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: '#FFFFFF',
          border: '1px solid rgba(28,28,28,0.08)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          minWidth: '200px',
          padding: '8px',
          zIndex: 10
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(28,28,28,0.05)', marginBottom: '4px' }}>
            <p style={{ fontSize: '11px', color: 'var(--cream-2)' }}>Signed in as</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--black-brown)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
          </div>
          <button 
            onClick={onLogout}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              background: 'none',
              border: 'none',
              color: 'var(--cream-1)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(183, 93, 53, 0.05)'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function SellerHeader({ user, onLogout, onMenuToggle }) {
  return (
    <header className="seller-header">
      <div className="seller-header-left">
        <button className="seller-mobile-toggle" onClick={onMenuToggle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div>
          <p className="seller-eyebrow">Seller workspace</p>
          <p className="seller-header-date">Dashboard</p>
        </div>
      </div>
      
      <SellerProfileMenu user={user} onLogout={onLogout} />
    </header>
  );
}
