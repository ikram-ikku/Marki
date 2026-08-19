export default function UtilityBar() {
  return (
    <div className="utility-bar">
        <div className="utility-inner">
            <div className="utility-left">
                <span className="utility-location">India &nbsp;|&nbsp; Premium Footwear</span>
                <span className="utility-socials" aria-hidden="true">
                    <a href="#" aria-label="Instagram">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                    <a href="#" aria-label="Facebook">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
                        </svg>
                    </a>
                </span>
            </div>
            <div className="utility-right">
                <a href="pages/products.html">Track Order</a>
                <a href="#">Wishlist</a>
                <a href="#">Login</a>
            </div>
        </div>
    </div>
  );
}
