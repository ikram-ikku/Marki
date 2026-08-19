import { useState } from 'react';
import ProductForm from './ProductForm.jsx';
import { sellerApi } from './api.js';

export default function AddProduct({ token, navigate }) {
  const [submitting, setSubmitting] = useState(false);
  const save = async (product) => { setSubmitting(true); try { const payload = await sellerApi(token, '/products', { method: 'POST', body: JSON.stringify(product) }); navigate(`/seller/products/${payload.data.id}/edit`); } finally { setSubmitting(false); } };
  return <><div className="seller-page-intro"><div><p className="seller-eyebrow">New catalogue item</p><h1>Add a product.</h1><p>It will begin as a draft until you publish it.</p></div></div><ProductForm onSubmit={save} submitting={submitting} submitLabel="Save product" /></>;
}
