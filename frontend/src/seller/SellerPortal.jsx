import { useEffect, useState } from 'react';
import SellerLayout from './SellerLayout.jsx';
import SellerLogin from './SellerLogin.jsx';
import SellerDashboard from './SellerDashboard.jsx';
import SellerProducts from './SellerProducts.jsx';
import AddProduct from './AddProduct.jsx';
import EditProduct from './EditProduct.jsx';

const sessionKey = 'marki_seller_session';
const readSession = () => { try { return JSON.parse(sessionStorage.getItem(sessionKey)); } catch { return null; } };

export default function SellerPortal() {
  const [session, setSession] = useState(readSession); const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => { const onPopState = () => setPathname(window.location.pathname); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []);
  const navigate = (path) => { window.history.pushState({}, '', path); setPathname(path); window.scrollTo(0, 0); };
  const login = (nextSession) => { sessionStorage.setItem(sessionKey, JSON.stringify(nextSession)); setSession(nextSession); navigate('/seller/dashboard'); };
  const logout = () => { sessionStorage.removeItem(sessionKey); setSession(null); };
  if (!session?.token) return <SellerLogin onLogin={login} />;
  const editMatch = pathname.match(/^\/seller\/products\/([^/]+)\/edit$/);
  let page = <SellerDashboard token={session.token} navigate={navigate} />;
  if (pathname === '/seller/products') page = <SellerProducts token={session.token} navigate={navigate} />;
  if (pathname === '/seller/products/add') page = <AddProduct token={session.token} navigate={navigate} />;
  if (editMatch) page = <EditProduct token={session.token} productId={editMatch[1]} navigate={navigate} />;
  return <SellerLayout pathname={pathname} navigate={navigate} user={session.user} onLogout={logout}>{page}</SellerLayout>;
}
