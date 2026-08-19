export default function SellerHeader({ user, onLogout }) {
  return (
    <header className="seller-header">
      <div>
        <p className="seller-eyebrow">Seller workspace</p>
        <p className="seller-header-date">Manage your Marki collection</p>
      </div>
      <div className="seller-user-menu">
        <div className="seller-user-initial">{user.name?.charAt(0)?.toUpperCase() || 'S'}</div>
        <div><strong>{user.name}</strong><span>Seller account</span></div>
        <button onClick={onLogout}>Sign out</button>
      </div>
    </header>
  );
}
