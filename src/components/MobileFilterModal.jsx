import { useShop } from '../context/ShopContext';
import { CATEGORIES, SIZES, COLORS } from '../data/products';

export default function MobileFilterModal() {
  const {
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    availabilityFilter,
    setAvailabilityFilter,
    categoryFilter,
    setCategoryFilter,
    selectedSizes,
    toggleSize,
    priceRange,
    setPriceRange,
    selectedColors,
    toggleColor,
    resetAllFilters,
    filteredProducts
  } = useShop();

  if (!isMobileFilterOpen) return null;

  return (
    <div className="mobile-filter-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
      <div className="mobile-filter-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-filter-header">
          <h3>Filter Collection</h3>
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--cream-1)' }}
          >
            ×
          </button>
        </div>

        {/* Availability */}
        <div style={{ marginBottom: '24px' }}>
          <p className="popover-title">Availability</p>
          <div className="popover-option" onClick={() => setAvailabilityFilter('all')}>
            <label style={{ cursor: 'pointer', display: 'flex', gap: '8px' }}>
              <input type="radio" name="mobile-avail" checked={availabilityFilter === 'all'} readOnly />
              All Products
            </label>
          </div>
          <div className="popover-option" onClick={() => setAvailabilityFilter('in_stock')}>
            <label style={{ cursor: 'pointer', display: 'flex', gap: '8px' }}>
              <input type="radio" name="mobile-avail" checked={availabilityFilter === 'in_stock'} readOnly />
              In Stock
            </label>
          </div>
          <div className="popover-option" onClick={() => setAvailabilityFilter('out_of_stock')}>
            <label style={{ cursor: 'pointer', display: 'flex', gap: '8px' }}>
              <input type="radio" name="mobile-avail" checked={availabilityFilter === 'out_of_stock'} readOnly />
              Out of Stock
            </label>
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '24px' }}>
          <p className="popover-title">Category</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`toolbar-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div style={{ marginBottom: '24px' }}>
          <p className="popover-title">Select Sizes (UK)</p>
          <div className="size-grid">
            {SIZES.map((sz) => (
              <button
                key={sz}
                className={`size-chip ${selectedSizes.includes(sz) ? 'selected' : ''}`}
                onClick={() => toggleSize(sz)}
              >
                UK {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: '24px' }}>
          <p className="popover-title">Price Range (₹)</p>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="From"
              className="price-input"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />
            <span>–</span>
            <input
              type="number"
              placeholder="To"
              className="price-input"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>
        </div>

        {/* Colors */}
        <div style={{ marginBottom: '28px' }}>
          <p className="popover-title">Color Options</p>
          <div className="color-list">
            {COLORS.map((clr) => (
              <div
                key={clr.name}
                className="color-item"
                onClick={() => toggleColor(clr.name)}
              >
                <input
                  type="checkbox"
                  checked={selectedColors.includes(clr.name)}
                  readOnly
                  style={{ accentColor: '#B75D35' }}
                />
                <span className="color-dot" style={{ backgroundColor: clr.hex }}></span>
                <span>{clr.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={resetAllFilters}>
            Clear All
          </button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => setIsMobileFilterOpen(false)}>
            View {filteredProducts.length} Results
          </button>
        </div>
      </div>
    </div>
  );
}
