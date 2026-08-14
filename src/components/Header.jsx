import { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    currentView,
    setCurrentView,
    totalCartCount,
    setIsCartOpen,
    wishlistIds,
    setIsWishlistOpen
  } = useShop();

  const handleNavClick = (view, e) => {
    e.preventDefault();
    setCurrentView(view);
    setIsOpen(false);
    window.location.hash = view;
  };

  return (
    <header className="navbar" id="navbar" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(28, 28, 28, 0.08)' }}>
      <nav className="nav-inner">
        <a
          href="#home"
          className="nav-logo"
          aria-label="Marki — home"
          onClick={(e) => handleNavClick('home', e)}
        >
          <img src="/images/logo/logo 4.png" alt="Marki Logo" style={{ height: '65px', width: 'auto', display: 'block' }} />
        </a>

        <ul className="nav-left" style={{ justifyContent: 'center' }}>
          <li>
            <a
              href="#home"
              className={currentView === 'home' ? 'active' : ''}
              onClick={(e) => handleNavClick('home', e)}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#shop"
              className={currentView === 'shop' ? 'active' : ''}
              onClick={(e) => handleNavClick('shop', e)}
            >
              Shop
            </a>
          </li>
          <li>
            <a
              href="#shop"
              onClick={(e) => handleNavClick('shop', e)}
            >
              Collections
            </a>
          </li>
        </ul>

        <ul className="nav-right">
          <li>
            <a
              href="#home"
              onClick={(e) => handleNavClick('home', e)}
            >
              Services
            </a>
          </li>

          {/* Wishlist Link */}
          <li>
            <button
              onClick={() => setIsWishlistOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'rgba(28,28,28,0.88)',
                position: 'relative'
              }}
              aria-label="Wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistIds.length > 0 && (
                <span
                  style={{
                    background: 'var(--copper-3)',
                    color: '#FFF',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '-10px',
                    marginLeft: '-6px'
                  }}
                >
                  {wishlistIds.length}
                </span>
              )}
            </button>
          </li>

          {/* Cart Icon */}
          <li>
            <button
              onClick={() => setIsCartOpen(true)}
              className="cart-link"
              aria-label="Cart"
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
              </svg>
              {totalCartCount > 0 && (
                <span
                  style={{
                    background: 'var(--black-brown)',
                    color: '#FFF',
                    fontSize: '9.5px',
                    fontWeight: 'bold',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px'
                  }}
                >
                  {totalCartCount}
                </span>
              )}
            </button>
          </li>
        </ul>

        <button
          className={`nav-toggle ${isOpen ? 'open' : ''}`}
          id="navToggle"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile ${isOpen ? 'open' : ''}`} id="navMobile">
        <a href="#home" onClick={(e) => handleNavClick('home', e)}>Home</a>
        <a href="#shop" onClick={(e) => handleNavClick('shop', e)}>Shop Collection</a>
        <a href="#shop" onClick={(e) => handleNavClick('shop', e)}>Collections</a>
        <a href="#cart" onClick={(e) => { e.preventDefault(); setIsCartOpen(true); setIsOpen(false); }}>
          Shopping Bag ({totalCartCount})
        </a>
        <a href="#wishlist" onClick={(e) => { e.preventDefault(); setIsWishlistOpen(true); setIsOpen(false); }}>
          Wishlist ({wishlistIds.length})
        </a>
      </div>
    </header>
  );
}
