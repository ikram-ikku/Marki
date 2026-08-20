import { NavLink, Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', path: '/seller/dashboard', exact: true },
  { name: 'Products', path: '/seller/products' },
  { name: 'Orders', path: '/seller/orders' },
  { name: 'Analytics', path: '/seller/analytics' },
  { name: 'Profile', path: '/seller/profile' },
  { name: 'Settings', path: '/seller/settings' }
];

export default function SellerSidebar({ isOpen, onClose }) {
  return (
    <aside className={`seller-sidebar ${isOpen ? 'open' : ''}`}>
      <Link to="/seller/dashboard" className="seller-brand" onClick={onClose}>
        Marki <span>Seller</span>
      </Link>
      
      <nav aria-label="Seller navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <Link to="/" className="seller-store-link">
        View storefront ↗
      </Link>
    </aside>
  );
}
