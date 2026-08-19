const navigation = [
  ['Dashboard', '/seller/dashboard'],
  ['Products', '/seller/products'],
  ['Add Product', '/seller/products/add'],
  ['Orders', null],
  ['Inventory', null],
  ['Earnings', null],
  ['Settings', null]
];

export default function SellerSidebar({ pathname, navigate }) {
  return (
    <aside className="seller-sidebar">
      <a href="/seller/dashboard" className="seller-brand" onClick={(event) => { event.preventDefault(); navigate('/seller/dashboard'); }}>
        Marki <span>Seller</span>
      </a>
      <nav aria-label="Seller navigation">
        {navigation.map(([label, href]) => href ? (
          <a
            href={href}
            key={label}
            className={pathname === href || (label === 'Products' && pathname.includes('/seller/products/')) ? 'active' : ''}
            onClick={(event) => { event.preventDefault(); navigate(href); }}
          >
            {label}
          </a>
        ) : (
          <span key={label} className="seller-nav-unavailable">{label}<small>Soon</small></span>
        ))}
      </nav>
      <a href="/" className="seller-store-link">View storefront ↗</a>
    </aside>
  );
}
