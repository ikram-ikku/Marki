import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { filteredProducts, resetAllFilters } = useShop();

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-products">
        <h3>No footwear matched your filters</h3>
        <p>Try adjusting your category, size, price range, or color preferences.</p>
        <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={resetAllFilters}>
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <section className="products-grid">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
