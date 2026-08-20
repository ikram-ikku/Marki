import { useEffect, useState } from 'react';
import ProductForm from './ProductForm.jsx';
import { sellerApi } from './api.js';

export default function EditProduct({ token, productId, navigate }) {
  const [product, setProduct] = useState(null); 
  const [error, setError] = useState(''); 
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { 
    sellerApi(token, `/products/${productId}`)
      .then((payload) => setProduct(payload.data))
      .catch((requestError) => setError(requestError.message)); 
  }, [token, productId]);

  const save = async (data) => { 
    setSubmitting(true); 
    setError('');
    try { 
      const payload = await sellerApi(token, `/products/${productId}`, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
      }); 
      setProduct(payload.data); 
      alert('Product saved successfully');
    } catch (err) {
      setError(err.message);
    } finally { 
      setSubmitting(false); 
    } 
  };

  const setStatus = async (status) => { 
    setSubmitting(true); 
    setError('');
    try { 
      const payload = await sellerApi(token, `/products/${productId}/status`, { 
        method: 'PATCH', 
        body: JSON.stringify({ status }) 
      }); 
      setProduct(payload.data); 
    } catch (err) {
      setError(err.message);
    } finally { 
      setSubmitting(false); 
    } 
  };

  if (error && !product) return <div className="seller-inline-error" style={{ margin: '32px' }}>{error}</div>; 
  if (!product) return <p style={{ padding: '32px', color: 'var(--cream-2)' }}>Loading product…</p>;

  return (
    <>
      <div className="seller-page-intro">
        <div>
          <button className="seller-text-button" onClick={() => navigate('/seller/products')} style={{ marginBottom: '16px', display: 'inline-block' }}>
            ← Back to products
          </button>
          <p className="seller-eyebrow">Catalogue item</p>
          <h1>Edit product.</h1>
          <p>
            Status: <strong className={`seller-status ${product.status.toLowerCase()}`}>{product.status.replace('_', ' ')}</strong>
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="seller-text-button" style={{ color: 'var(--cream-2)' }} disabled={submitting} onClick={() => setStatus('DRAFT')}>Save draft</button>
          <button className="seller-text-button" style={{ color: 'var(--black-brown)' }} disabled={submitting} onClick={() => setStatus('UNPUBLISHED')}>Unpublish</button>
          <button className="seller-primary-button" style={{ background: '#27ae60' }} disabled={submitting} onClick={() => setStatus('PUBLISHED')}>Publish</button>
        </div>
      </div>
      
      {error && <div className="seller-inline-error" style={{ background: 'rgba(183, 93, 53, 0.08)', color: 'var(--copper-3)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{error}</div>}
      
      <ProductForm 
        initialProduct={product} 
        onSubmit={save} 
        submitting={submitting} 
        submitLabel="Save changes" 
      />
    </>
  );
}
