import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar" id="navbar">
        <nav className="nav-inner">
            <a href="index.html" className="nav-logo" aria-label="Marki — home">
                <img src="public\images\logo\logo 3.png" alt="Marki Logo" style={{ height: '100px' }} />
            </a>

            <ul className="nav-left" style={{ justifyContent: 'center' }}>
                <li><a href="index.html" className="active">Home</a></li>
                <li><a href="pages/products.html">Shop</a></li>
                <li><a href="pages/about.html">About&nbsp;Us</a></li>
                <li><a href="pages/products.html">Collections</a></li>
            </ul>

            <ul className="nav-right">
                <li><a href="pages/products.html">Services</a></li>
                <li><a href="pages/contact.html">Contact</a></li>
                <li>
                    <a href="pages/cart.html" className="cart-link" aria-label="Cart">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                            <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
                        </svg>
                    </a>
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
            <a href="index.html" onClick={() => setIsOpen(false)}>Home</a>
            <a href="pages/products.html" onClick={() => setIsOpen(false)}>Shop</a>
            <a href="pages/about.html" onClick={() => setIsOpen(false)}>About Us</a>
            <a href="pages/products.html" onClick={() => setIsOpen(false)}>Collections</a>
            <a href="pages/products.html" onClick={() => setIsOpen(false)}>Services</a>
            <a href="pages/contact.html" onClick={() => setIsOpen(false)}>Contact</a>
            <a href="pages/cart.html" onClick={() => setIsOpen(false)}>Cart</a>
        </div>
    </header>
  );
}
