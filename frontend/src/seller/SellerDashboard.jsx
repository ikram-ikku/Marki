import { useEffect, useState } from 'react';
import { sellerApi } from './api.js';

const money = (value) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function SellerDashboard({ token, navigate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    sellerApi(token, '/products')
      .then((payload) => setProducts(payload.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const productsCount = products.length;
  const published = products.filter(p => p.status === 'PUBLISHED').length;
  const inventory = products.reduce((total, p) => total + p.variants.reduce((sum, v) => sum + v.stock, 0), 0);
  const collectionValue = products.reduce((total, p) => total + Number(p.price || 0), 0);

  return (
    <>
      <div className="seller-page-intro">
        <div>
          <p className="seller-eyebrow">Overview</p>
          <h1>Your store at a glance.</h1>
          <p>Keep your collection polished, stocked and ready to sell.</p>
        </div>
        <button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>
          + Add product
        </button>
      </div>
      
      {error && <div className="seller-inline-error" style={{ background: 'rgba(183, 93, 53, 0.08)', color: 'var(--copper-3)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{error}</div>}

      <section className="seller-stat-grid">
        <article>
          <span>Collection</span>
          <strong>{loading ? '...' : productsCount}</strong>
          <p>Products in your catalogue</p>
        </article>
        <article>
          <span>Published</span>
          <strong>{loading ? '...' : published}</strong>
          <p>Visible to Marki customers</p>
        </article>
        <article>
          <span>Inventory</span>
          <strong>{loading ? '...' : inventory}</strong>
          <p>Pairs currently in stock</p>
        </article>
        <article>
          <span>Collection value</span>
          <strong>{loading ? '...' : money(collectionValue)}</strong>
          <p>Based on current selling price</p>
        </article>
      </section>

      {/* Zero State for missing Backend APIs */}
      <section className="seller-stat-grid">
        <article style={{ background: 'var(--wood-2)', borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Orders</span>
            <span style={{ background: 'rgba(28,28,28,0.05)', color: 'var(--cream-2)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>SOON</span>
          </div>
          <strong>0</strong>
          <p>No orders yet</p>
        </article>
        <article style={{ background: 'var(--wood-2)', borderStyle: 'dashed' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pending Orders</span>
            <span style={{ background: 'rgba(28,28,28,0.05)', color: 'var(--cream-2)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>SOON</span>
          </div>
          <strong>0</strong>
          <p>Awaiting fulfillment</p>
        </article>
        <article style={{ background: 'var(--wood-2)', borderStyle: 'dashed' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Revenue</span>
            <span style={{ background: 'rgba(28,28,28,0.05)', color: 'var(--cream-2)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>SOON</span>
          </div>
          <strong>{money(0)}</strong>
          <p>All time sales</p>
        </article>
      </section>
      
      <section className="seller-panel">
        <div className="seller-panel-heading">
          <div>
            <p className="seller-eyebrow">Recent products</p>
            <h2>Your latest additions</h2>
          </div>
          <button className="seller-text-button" onClick={() => navigate('/seller/products')}>
            View all products →
          </button>
        </div>
        
        {loading ? (
           <div className="seller-empty" style={{ border: 'none', background: 'transparent' }}><p>Loading...</p></div>
        ) : products.length === 0 ? (
          <div className="seller-empty">
            <h3>Your collection is ready for its first piece.</h3>
            <p>Add a product to begin building your seller storefront.</p>
            <button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>
              Add product
            </button>
          </div>
        ) : (
          <div className="seller-recent-list">
            {products.slice(0, 4).map((product) => (
              <div key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.brand} · {product.sku}</span>
                </div>
                <b>{money(product.price)}</b>
                <em className={`seller-status ${product.status.toLowerCase()}`}>{product.status.replace('_', ' ')}</em>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
