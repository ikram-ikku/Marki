import { useEffect, useState } from 'react';
import { sellerApi } from './api.js';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function SellerDashboard({ token, navigate }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    sellerApi(token, '/products')
      .then((payload) => setProducts(payload.data))
      .catch((requestError) => setError(requestError.message));
  }, [token]);

  const published = products.filter((product) => product.status === 'PUBLISHED').length;
  const inventory = products.reduce((total, product) => total + product.variants.reduce((stock, variant) => stock + variant.stock, 0), 0);
  const collectionValue = products.reduce((total, product) => total + Number(product.price || 0), 0);

  return (
    <>
      <div className="seller-page-intro">
        <div><p className="seller-eyebrow">Overview</p><h1>Your store at a glance.</h1><p>Keep your collection polished, stocked and ready to sell.</p></div>
        <button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>+ Add product</button>
      </div>
      {error && <div className="seller-inline-error">{error}</div>}
      <section className="seller-stat-grid">
        <article><span>Collection</span><strong>{products.length}</strong><p>Products in your catalogue</p></article>
        <article><span>Published</span><strong>{published}</strong><p>Visible to Marki customers</p></article>
        <article><span>Inventory</span><strong>{inventory}</strong><p>Pairs currently in stock</p></article>
        <article><span>Collection value</span><strong>{money(collectionValue)}</strong><p>Based on current selling price</p></article>
      </section>
      <section className="seller-panel">
        <div className="seller-panel-heading"><div><p className="seller-eyebrow">Recent products</p><h2>Your latest additions</h2></div><button className="seller-text-button" onClick={() => navigate('/seller/products')}>View all products →</button></div>
        {products.length === 0 ? <div className="seller-empty"><h3>Your collection is ready for its first piece.</h3><p>Add a product to begin building your seller storefront.</p><button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>Add product</button></div> : (
          <div className="seller-recent-list">{products.slice(0, 4).map((product) => <div key={product.id}><div><strong>{product.name}</strong><span>{product.sku} · {product.category}</span></div><b>{money(product.price)}</b><em className={`seller-status ${product.status.toLowerCase()}`}>{product.status.replace('_', ' ')}</em></div>)}</div>
        )}
      </section>
    </>
  );
}
