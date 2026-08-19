import SellerHeader from './SellerHeader.jsx';
import SellerSidebar from './SellerSidebar.jsx';
import '../css/seller.css';

export default function SellerLayout({ children, pathname, navigate, user, onLogout }) {
  return (
    <div className="seller-shell">
      <SellerSidebar pathname={pathname} navigate={navigate} />
      <div className="seller-main-area">
        <SellerHeader user={user} onLogout={onLogout} />
        <main className="seller-content">{children}</main>
      </div>
    </div>
  );
}
