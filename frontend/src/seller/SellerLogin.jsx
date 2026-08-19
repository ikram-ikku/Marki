import { useState } from 'react';

export default function SellerLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to sign in.');
      }
      if (payload.user?.role !== 'SELLER') {
        throw new Error('This account is not a seller account.');
      }

      onLogin({ token: payload.token, user: payload.user });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="seller-login-page">
      <section className="seller-login-card">
        <a className="seller-wordmark" href="/">Marki</a>
        <p className="seller-eyebrow">Seller portal</p>
        <h1>Welcome back.</h1>
        <p className="seller-login-copy">Sign in to manage your collection, inventory and storefront.</p>
        <form onSubmit={submit} className="seller-login-form">
          <label>
            Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          </label>
          {error && <p className="seller-form-error" role="alert">{error}</p>}
          <button className="seller-primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>
        <a className="seller-back-link" href="/">← Back to Marki</a>
      </section>
    </main>
  );
}
