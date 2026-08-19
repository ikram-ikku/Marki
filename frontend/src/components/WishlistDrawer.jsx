import { useShop } from '../context/ShopContext';

export default function WishlistDrawer() {
  const { isWishlistOpen, setIsWishlistOpen, wishlistIds, PRODUCTS, toggleWishlist, addToCart } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2 className="drawer-title">Wishlist ({wishlistedProducts.length})</h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--cream-1)' }}
          >
            ×
          </button>
        </div>

        <div className="drawer-body">
          {wishlistedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(28,28,28,0.5)' }}>
              <p>Your wishlist is currently empty.</p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div key={product.id} className="cart-item">
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/shoes/placeholder.jpg';
                  }}
                />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{product.name}</h4>
                  <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '9.5px' }}
                      onClick={() => addToCart(product, product.availableSizes[0], product.color, 1)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '9.5px' }}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
