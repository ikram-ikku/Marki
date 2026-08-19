import { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES, SIZES, COLORS, SORT_OPTIONS } from '../data/products';

export default function FilterBar() {
  const {
    filteredProducts,
    totalProductsCount,
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
    sortBy,
    setSortBy,
    activeFilters,
    removeFilterPill,
    resetAllFilters,
    setIsMobileFilterOpen
  } = useShop();

  const [activePopover, setActivePopover] = useState(null);
  const containerRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePopover = (name) => {
    setActivePopover((prev) => (prev === name ? null : name));
  };

  return (
    <div className="filter-toolbar-wrapper" ref={containerRef}>
      <div className="filter-toolbar">
        {/* Left Filter Group */}
        <div className="filter-group-left">
          {/* Main Filter Button (for Mobile & Quick Access) */}
          <button
            className="toolbar-btn filter-main-btn"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filter
          </button>

          {/* Desktop Filter Popovers */}
          <div className="desktop-popovers" style={{ display: 'flex', gap: '8px' }}>
            {/* Availability Popover */}
            <div className="popover-anchor">
              <button
                className={`toolbar-btn ${availabilityFilter !== 'all' ? 'active' : ''}`}
                onClick={() => togglePopover('availability')}
              >
                Availability
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {activePopover === 'availability' && (
                <div className="popover-panel">
                  <p className="popover-title">Availability</p>
                  <div
                    className={`popover-option ${availabilityFilter === 'all' ? 'selected' : ''}`}
                    onClick={() => { setAvailabilityFilter('all'); setActivePopover(null); }}
                  >
                    <span>All Products</span>
                  </div>
                  <div
                    className={`popover-option ${availabilityFilter === 'in_stock' ? 'selected' : ''}`}
                    onClick={() => { setAvailabilityFilter('in_stock'); setActivePopover(null); }}
                  >
                    <span>In Stock</span>
                  </div>
                  <div
                    className={`popover-option ${availabilityFilter === 'out_of_stock' ? 'selected' : ''}`}
                    onClick={() => { setAvailabilityFilter('out_of_stock'); setActivePopover(null); }}
                  >
                    <span>Out of Stock</span>
                  </div>
                </div>
              )}
            </div>

            {/* Category Popover */}
            <div className="popover-anchor">
              <button
                className={`toolbar-btn ${categoryFilter !== 'All' ? 'active' : ''}`}
                onClick={() => togglePopover('category')}
              >
                Category {categoryFilter !== 'All' && `(${categoryFilter})`}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {activePopover === 'category' && (
                <div className="popover-panel">
                  <p className="popover-title">Category</p>
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat}
                      className={`popover-option ${categoryFilter === cat ? 'selected' : ''}`}
                      onClick={() => { setCategoryFilter(cat); setActivePopover(null); }}
                    >
                      <span>{cat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Size Popover */}
            <div className="popover-anchor">
              <button
                className={`toolbar-btn ${selectedSizes.length > 0 ? 'active' : ''}`}
                onClick={() => togglePopover('size')}
              >
                Size {selectedSizes.length > 0 && `(${selectedSizes.length})`}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {activePopover === 'size' && (
                <div className="popover-panel" style={{ minWidth: '240px' }}>
                  <p className="popover-title">Select Shoe Sizes (UK/US)</p>
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
              )}
            </div>

            {/* Price Popover */}
            <div className="popover-anchor">
              <button
                className={`toolbar-btn ${priceRange.min !== '' || priceRange.max !== '' ? 'active' : ''}`}
                onClick={() => togglePopover('price')}
              >
                Price
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {activePopover === 'price' && (
                <div className="popover-panel" style={{ minWidth: '220px' }}>
                  <p className="popover-title">Price Range (₹)</p>
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="From"
                      className="price-input"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <span style={{ fontSize: '12px', color: 'rgba(28,28,28,0.4)' }}>–</span>
                    <input
                      type="number"
                      placeholder="To"
                      className="price-input"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Color Popover */}
            <div className="popover-anchor">
              <button
                className={`toolbar-btn ${selectedColors.length > 0 ? 'active' : ''}`}
                onClick={() => togglePopover('color')}
              >
                Color {selectedColors.length > 0 && `(${selectedColors.length})`}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {activePopover === 'color' && (
                <div className="popover-panel" style={{ minWidth: '200px' }}>
                  <p className="popover-title">Color Palette</p>
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
                          style={{ accentColor: '#B75D35', cursor: 'pointer' }}
                        />
                        <span className="color-dot" style={{ backgroundColor: clr.hex }}></span>
                        <span>{clr.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sort & Count Group */}
        <div className="filter-group-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="product-count" style={{ textTransform: 'uppercase' }}>Sort by:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <span className="product-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </span>
        </div>
      </div>

      {/* Active Filters Chips Bar */}
      {activeFilters.length > 0 && (
        <div className="active-filters-bar">
          {activeFilters.map((chip, idx) => (
            <div key={`${chip.type}-${chip.value}-${idx}`} className="filter-chip">
              <span>{chip.label}</span>
              <button onClick={() => removeFilterPill(chip.type, chip.value)} aria-label="Remove filter">
                ×
              </button>
            </div>
          ))}

          <button className="clear-all-btn" onClick={resetAllFilters}>
            Remove all
          </button>
        </div>
      )}
    </div>
  );
}
