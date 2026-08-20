import { useState } from 'react';
import ProductForm from './ProductForm.jsx';
import { sellerApi } from './api.js';

export default function AddProduct({ token, navigate }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const save = async (product) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = await sellerApi(token, '/products', { 
        method: 'POST', 
        body: JSON.stringify(product) 
      });
      navigate(`/seller/products/${payload.data.id}/edit`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="seller-page-intro">
        <div>
          <button className="seller-text-button" onClick={() => navigate('/seller/products')} style={{ marginBottom: '16px', display: 'inline-block' }}>
            ← Back to products
          </button>
          <p className="seller-eyebrow">New catalogue item</p>
          <h1>Add a product.</h1>
          <p>It will begin as a draft until you publish it.</p>
        </div>
      </div>
      
      {error && <div className="seller-inline-error" style={{ background: 'rgba(183, 93, 53, 0.08)', color: 'var(--copper-3)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{error}</div>}

      <ProductForm 
        onSubmit={save} 
        submitting={submitting} 
        submitLabel="Save product" 
      />
    </>
  );
}
