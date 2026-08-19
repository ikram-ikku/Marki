import { useEffect, useState } from 'react';
import { sellerApi } from './api.js';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function SellerProducts({ token, navigate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    sellerApi(token, '/products').then((payload) => setProducts(payload.data)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <div className="seller-page-intro"><div><p className="seller-eyebrow">Catalogue</p><h1>Your products.</h1><p>Products are saved to your Marki seller account.</p></div><button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>+ Add product</button></div>
      <section className="seller-panel seller-product-panel">
        {loading && <p className="seller-loading">Loading your products…</p>}
        {error && <div className="seller-inline-error">{error}</div>}
        {!loading && !error && products.length === 0 && <div className="seller-empty"><h3>No products yet.</h3><p>Your next product will appear here as soon as you add it.</p><button className="seller-primary-button" onClick={() => navigate('/seller/products/add')}>Add your first product</button></div>}
        {!loading && products.length > 0 && <div className="seller-product-table"><div className="seller-table-head"><span>Product</span><span>Price</span><span>Inventory</span><span>Status</span><span /></div>{products.map((product) => <div className="seller-table-row" key={product.id}><div><strong>{product.name}</strong><span>{product.brand} · {product.sku}</span></div><b>{money(product.price)}</b><span>{product.variants.reduce((total, variant) => total + variant.stock, 0)} pairs</span><em className={`seller-status ${product.status.toLowerCase()}`}>{product.status.replace('_', ' ')}</em><button className="seller-text-button" onClick={() => navigate(`/seller/products/${product.id}/edit`)}>Edit</button></div>)}</div>}
      </section>
    </>
  );
}
