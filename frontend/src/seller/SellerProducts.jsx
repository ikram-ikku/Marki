import { useEffect, useState, useMemo } from 'react';
import { sellerApi } from './api.js';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function SellerProducts({ token, navigate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete Modal
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    sellerApi(token, '/products')
      .then((payload) => setProducts(payload.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await sellerApi(token, `/products/${deletingId}`, { method: 'DELETE' });
      setDeletingId(null);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
    try {
      await sellerApi(token, `/products/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <>
      <div className="seller-page-intro">
        <div>
          <p className="seller-eyebrow">Catalogue</p>
          <h1>Your products.</h1>
          <p>Products are saved to your Marki seller account.</p>
        </div>
        <button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>
          + Add product
        </button>
      </div>

      <section className="seller-panel seller-product-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="seller-toolbar" style={{ padding: '24px 24px 0' }}>
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            className="seller-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="seller-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNPUBLISHED">Unpublished</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {loading && <p style={{ padding: '24px', color: 'var(--cream-2)' }}>Loading your products…</p>}
        {error && <div className="seller-inline-error" style={{ margin: '24px' }}>{error}</div>}
        
        {!loading && !error && products.length === 0 && (
          <div className="seller-empty" style={{ margin: '24px' }}>
            <h3>No products yet.</h3>
            <p>Your next product will appear here as soon as you add it.</p>
            <button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>
              Add your first product
            </button>
          </div>
        )}

        {!loading && products.length > 0 && filteredProducts.length === 0 && (
          <div className="seller-empty" style={{ margin: '24px', border: 'none', background: 'transparent' }}>
            <p>No products match your search.</p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <>
            <div className="seller-product-table">
              <div className="seller-table-head">
                <span>Product</span>
                <span>Price</span>
                <span>Inventory</span>
                <span>Status</span>
                <span />
              </div>
              {paginatedProducts.map((product) => (
                <div className="seller-table-row" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.brand} · {product.sku}</span>
                  </div>
                  <b>{money(product.price)}</b>
                  <span>{product.variants.reduce((total, variant) => total + variant.stock, 0)} pairs</span>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <em 
                      className={`seller-status ${product.status.toLowerCase()}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusToggle(product.id, product.status)}
                      title="Click to toggle status"
                    >
                      {product.status.replace('_', ' ')}
                    </em>
                  </div>
                  <div className="seller-table-actions">
                    <button className="seller-text-button" onClick={() => navigate(`/seller/products/${product.id}/edit`)}>Edit</button>
                    <button className="seller-text-button" style={{ color: '#d32f2f' }} onClick={() => setDeletingId(product.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="seller-pagination">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results</span>
                <div className="seller-pagination-controls">
                  <button 
                    className="seller-icon-button" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Prev
                  </button>
                  <button 
                    className="seller-icon-button" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="seller-modal-overlay" onClick={() => !isDeleting && setDeletingId(null)}>
          <div className="seller-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone and will remove it from the catalogue completely.</p>
            <div className="seller-modal-actions">
              <button 
                className="seller-text-button" 
                style={{ color: 'var(--cream-2)' }} 
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="seller-danger-button" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
