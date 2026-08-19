import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { PRODUCTS, SORT_OPTIONS } from '../data/products';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Navigation View ('home', 'shop')
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('shop') || search.includes('shop') || window.location.pathname.includes('products')) {
        return 'shop';
      }
    }
    return 'shop'; // Default to shop view for quick assessment as requested
  });

  // Filter States
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'in_stock', 'out_of_stock'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedColors, setSelectedColors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sort State
  const [sortBy, setSortBy] = useState('featured');

  // Interactive UI States
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [productDetailModalProduct, setProductDetailModalProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState([
    {
      product: PRODUCTS[0],
      selectedSize: 8,
      selectedColor: 'Tan',
      quantity: 1
    }
  ]);
  const [wishlistIds, setWishlistIds] = useState(['marki-01', 'marki-03']);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#home') {
        setCurrentView('home');
      } else if (hash === '#shop') {
        setCurrentView('shop');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toast trigger helper
  const showToast = (text, type = 'info') => {
    setToastMessage({ id: Date.now(), text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Toggle Wishlist item
  const toggleWishlist = (productId) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      const product = PRODUCTS.find((p) => p.id === productId);
      if (product) {
        showToast(
          exists ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist`,
          exists ? 'remove' : 'add'
        );
      }
      return updated;
    });
  };

  // Add to Cart helper
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [...prev, { product, selectedSize, selectedColor, quantity }];
      }
    });

    showToast(`Added ${product.name} (Size ${selectedSize}, ${selectedColor}) to cart`, 'cart');
    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const updateCartQuantity = (index, delta) => {
    setCartItems((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  // Remove from Cart
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle Filter helpers
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const removeFilterPill = (filterType, value) => {
    if (filterType === 'availability') setAvailabilityFilter('all');
    if (filterType === 'category') setCategoryFilter('All');
    if (filterType === 'size') setSelectedSizes((prev) => prev.filter((s) => s !== value));
    if (filterType === 'color') setSelectedColors((prev) => prev.filter((c) => c !== value));
    if (filterType === 'priceMin') setPriceRange((prev) => ({ ...prev, min: '' }));
    if (filterType === 'priceMax') setPriceRange((prev) => ({ ...prev, max: '' }));
    if (filterType === 'search') setSearchQuery('');
  };

  const resetAllFilters = () => {
    setAvailabilityFilter('all');
    setCategoryFilter('All');
    setSelectedSizes([]);
    setPriceRange({ min: '', max: '' });
    setSelectedColors([]);
    setSearchQuery('');
  };

  // Compute Active Filters list for chips display
  const activeFilters = useMemo(() => {
    const filters = [];
    if (availabilityFilter === 'in_stock') {
      filters.push({ type: 'availability', label: 'Availability: In Stock', value: 'in_stock' });
    } else if (availabilityFilter === 'out_of_stock') {
      filters.push({ type: 'availability', label: 'Availability: Out of Stock', value: 'out_of_stock' });
    }

    if (categoryFilter !== 'All') {
      filters.push({ type: 'category', label: `Category: ${categoryFilter}`, value: categoryFilter });
    }

    selectedSizes.forEach((size) => {
      filters.push({ type: 'size', label: `Size: UK ${size}`, value: size });
    });

    selectedColors.forEach((color) => {
      filters.push({ type: 'color', label: `Color: ${color}`, value: color });
    });

    if (priceRange.min !== '') {
      filters.push({ type: 'priceMin', label: `Min: ₹${priceRange.min}`, value: priceRange.min });
    }
    if (priceRange.max !== '') {
      filters.push({ type: 'priceMax', label: `Max: ₹${priceRange.max}`, value: priceRange.max });
    }

    if (searchQuery.trim() !== '') {
      filters.push({ type: 'search', label: `Search: "${searchQuery}"`, value: searchQuery });
    }

    return filters;
  }, [availabilityFilter, categoryFilter, selectedSizes, selectedColors, priceRange, searchQuery]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Availability filter
      if (availabilityFilter === 'in_stock' && product.availability !== 'in_stock') return false;
      if (availabilityFilter === 'out_of_stock' && product.availability !== 'out_of_stock') return false;

      // Category filter
      if (categoryFilter !== 'All' && product.category !== categoryFilter) return false;

      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((size) => product.availableSizes.includes(size));
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((c) =>
          product.availableColors.includes(c) || product.color === c
        );
        if (!hasColor) return false;
      }

      // Price range filter
      if (priceRange.min !== '' && product.price < Number(priceRange.min)) return false;
      if (priceRange.max !== '' && product.price > Number(priceRange.max)) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'relevant':
        case 'featured':
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
        case 'bestselling':
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        case 'title-asc':
          return a.name.localeCompare(b.name);
        case 'title-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'date-asc':
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        case 'date-desc':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        default:
          return 0;
      }
    });
  }, [availabilityFilter, categoryFilter, selectedSizes, selectedColors, priceRange, searchQuery, sortBy]);

  // Total Cart Items Count & Subtotal
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const value = {
    currentView,
    setCurrentView,
    PRODUCTS,
    filteredProducts,
    totalProductsCount: PRODUCTS.length,
    // Filters
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
    searchQuery,
    setSearchQuery,
    // Sorting
    sortBy,
    setSortBy,
    // Active Filters
    activeFilters,
    removeFilterPill,
    resetAllFilters,
    // Wishlist & Cart
    wishlistIds,
    toggleWishlist,
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    totalCartCount,
    cartSubtotal,
    // Modals & Drawers
    quickViewProduct,
    setQuickViewProduct,
    productDetailModalProduct,
    setProductDetailModalProduct,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    toastMessage,
    showToast
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
