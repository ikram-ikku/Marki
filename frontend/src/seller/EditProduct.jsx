import { useEffect, useState } from 'react';
import ProductForm from './ProductForm.jsx';
import { sellerApi } from './api.js';

export default function EditProduct({ token, productId, navigate }) {
  const [product, setProduct] = useState(null); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  useEffect(() => { sellerApi(token, `/products/${productId}`).then((payload) => setProduct(payload.data)).catch((requestError) => setError(requestError.message)); }, [token, productId]);
  const save = async (data) => { setSubmitting(true); try { const payload = await sellerApi(token, `/products/${productId}`, { method: 'PUT', body: JSON.stringify(data) }); setProduct(payload.data); } finally { setSubmitting(false); } };
  const setStatus = async (status) => { setSubmitting(true); try { const payload = await sellerApi(token, `/products/${productId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); setProduct(payload.data); } finally { setSubmitting(false); } };
  if (error) return <div className="seller-inline-error">{error}</div>; if (!product) return <p className="seller-loading">Loading product…</p>;
  return <><div className="seller-page-intro"><div><p className="seller-eyebrow">Catalogue item</p><h1>Edit product.</h1><p>Status: <strong>{product.status.replace('_', ' ')}</strong></p></div><div className="seller-status-actions"><button className="seller-secondary-button" disabled={submitting} onClick={() => setStatus('DRAFT')}>Save draft</button><button className="seller-secondary-button" disabled={submitting} onClick={() => setStatus('UNPUBLISHED')}>Unpublish</button><button className="seller-primary-button" disabled={submitting} onClick={() => setStatus('PUBLISHED')}>Publish</button></div></div><ProductForm initialProduct={product} onSubmit={save} submitting={submitting} submitLabel="Save changes" /><button className="seller-text-button seller-back-products" onClick={() => navigate('/seller/products')}>← Back to products</button></>;
}
