import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await login(email, password);
      
      // Role-based routing
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === 'SELLER') {
        navigate('/seller/dashboard', { replace: true });
      } else if (data.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="shop-page" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingTop: '60px' 
    }}>
      <section style={{
        background: '#FFFFFF',
        width: '100%',
        maxWidth: '440px',
        borderRadius: '16px',
        padding: '48px 40px',
        border: '1px solid rgba(28, 28, 28, 0.08)',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.04)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontStyle: 'italic', 
            fontSize: '24px', 
            color: 'var(--black-brown)' 
          }}>
            Marki
          </span>
          <p className="shop-eyebrow" style={{ marginTop: '12px', marginBottom: 0 }}>
            Sign In
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--cream-1)' }}>
            Email Address
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoComplete="email"
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(28, 28, 28, 0.15)',
                borderRadius: '8px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--copper-3)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(28, 28, 28, 0.15)'}
            />
          </label>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--cream-1)', position: 'relative' }}>
            Password
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  border: '1px solid rgba(28, 28, 28, 0.15)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--copper-3)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(28, 28, 28, 0.15)'}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(28,28,28,0.5)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && (
            <div style={{ 
              background: 'rgba(183, 93, 53, 0.08)', 
              color: 'var(--copper-3)', 
              padding: '12px', 
              borderRadius: '8px', 
              fontSize: '12px', 
              fontWeight: 500,
              textAlign: 'center'
            }} role="alert">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="toolbar-btn"
            style={{ 
              marginTop: '12px', 
              justifyContent: 'center', 
              padding: '14px 20px', 
              background: 'var(--black-brown)', 
              color: '#FFFFFF',
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}
