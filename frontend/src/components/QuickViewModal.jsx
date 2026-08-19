import { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlistIds, toggleWishlist } = useShop();

  const [selectedSize, setSelectedSize] = useState(
    quickViewProduct?.availableSizes ? quickViewProduct.availableSizes[0] : 8
  );
  const [selectedColor, setSelectedColor] = useState(
    quickViewProduct?.color || 'Tan'
  );
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlistIds.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Media */}
        <div className="modal-media">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/shoes/placeholder.jpg';
            }}
          />
        </div>

        {/* Details */}
        <div className="modal-details">
          <span className="modal-category">{quickViewProduct.category}</span>
          <h2 className="modal-title">{quickViewProduct.name}</h2>

          {/* Pricing */}
          <div className="modal-price-row">
            <span className="price-current" style={{ fontSize: '20px' }}>
              ₹{quickViewProduct.price.toLocaleString('en-IN')}
            </span>
            {quickViewProduct.originalPrice && (
              <span className="price-original" style={{ fontSize: '15px' }}>
                ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {quickViewProduct.isDiscounted && (
              <span className="badge badge-discount">
                {quickViewProduct.discountPercent}% OFF
              </span>
            )}
          </div>

          <p className="modal-desc">{quickViewProduct.description}</p>

          {/* Size Selection */}
          <div style={{ marginBottom: '16px' }}>
            <p className="modal-option-title">Select Size (UK/US)</p>
            <div className="modal-sizes">
              {quickViewProduct.availableSizes.map((sz) => (
                <button
                  key={sz}
                  className={`size-chip ${selectedSize === sz ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                  style={{ width: '44px', height: '40px' }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div style={{ marginBottom: '20px' }}>
            <p className="modal-option-title">Color: <span style={{ fontWeight: 'normal' }}>{selectedColor}</span></p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {quickViewProduct.availableColors.map((clr) => (
                <button
                  key={clr}
                  onClick={() => setSelectedColor(clr)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: selectedColor === clr ? '2px solid #B75D35' : '1px solid rgba(28,28,28,0.15)',
                    background: selectedColor === clr ? 'rgba(183,93,53,0.06)' : '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {clr}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <p className="modal-option-title" style={{ marginBottom: 0 }}>Quantity:</p>
            <div className="cart-qty-controls" style={{ height: '34px' }}>
              <button
                className="cart-qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="cart-qty-num">{quantity}</span>
              <button
                className="cart-qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button className="btn-primary" onClick={handleAddToCart}>
              Add to Cart — ₹{(quickViewProduct.price * quantity).toLocaleString('en-IN')}
            </button>
            <button
              className={`btn-secondary ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(quickViewProduct.id)}
            >
              {isWishlisted ? '♥ Saved' : '♡ Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
