import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { wishlistIds, toggleWishlist, setQuickViewProduct } = useShop();

  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <article className="product-card">
      {/* Image Area */}
      <div
        className="card-image-container"
        onClick={() => setQuickViewProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="card-image-primary"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/shoes/placeholder.jpg';
          }}
        />

        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} angle view`}
            className="card-image-secondary"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/shoes/placeholder.jpg';
            }}
          />
        )}

        {/* Badges */}
        <div className="card-badges">
          {product.isDiscounted && (
            <span className="badge badge-discount">{product.discountPercent}% OFF</span>
          )}
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.availability === 'out_of_stock' && (
            <span className="badge badge-out">Out of Stock</span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick View Hover Trigger */}
        <div className="quick-view-overlay">
          <button
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="card-content">
        <span className="card-category">{product.category}</span>
        <h3
          className="card-title"
          onClick={() => setQuickViewProduct(product)}
        >
          {product.name}
        </h3>

        <div className="card-price-row">
          <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          {product.isDiscounted && (
            <span className="price-discount-tag">Save {product.discountPercent}%</span>
          )}
        </div>
      </div>
    </article>
  );
}
