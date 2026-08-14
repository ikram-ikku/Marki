import { useShop } from '../context/ShopContext';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    totalCartCount
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">Shopping Bag ({totalCartCount})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--cream-1)' }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(28,28,28,0.5)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ margin: '0 auto 12px' }}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
              </svg>
              <p>Your shopping bag is empty.</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="cart-item">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/shoes/placeholder.jpg';
                  }}
                />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.product.name}</h4>
                  <div className="cart-item-meta">
                    Size: UK {item.selectedSize} | Color: {item.selectedColor}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="cart-qty-controls">
                      <button className="cart-qty-btn" onClick={() => updateCartQuantity(index, -1)}>
                        -
                      </button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => updateCartQuantity(index, 1)}>
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      style={{ background: 'none', border: 'none', color: 'rgba(28,28,28,0.4)', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <p style={{ fontSize: '10.5px', color: 'rgba(28,28,28,0.5)', marginBottom: '16px' }}>
              Complimentary Insured Express Delivery across India. Taxes included.
            </p>
            <button className="btn-primary" style={{ width: '100%' }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
