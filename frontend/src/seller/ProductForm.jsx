import { useState } from 'react';

const blankProduct = { name: '', brand: '', category: '', subCategory: '', description: '', price: '', mrp: '', discount: '0', sku: '', gender: 'UNISEX', color: '', material: '', variants: [{ size: '', sku: '', stock: 0 }] };

export default function ProductForm({ initialProduct, onSubmit, submitting, submitLabel }) {
  const [form, setForm] = useState(() => initialProduct ? { ...blankProduct, ...initialProduct, price: String(initialProduct.price), mrp: String(initialProduct.mrp), discount: String(initialProduct.discount ?? 0) } : blankProduct);
  const [error, setError] = useState('');
  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const setVariant = (index, field, value) => setForm((current) => ({ ...current, variants: current.variants.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant) }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onSubmit({ ...form, price: Number(form.price), mrp: Number(form.mrp), discount: Number(form.discount || 0), variants: form.variants.map((variant) => ({ ...variant, stock: Number(variant.stock) })) });
    } catch (submitError) { setError(submitError.message); }
  };

  return <form className="seller-product-form" onSubmit={submit}>
    <section><h2>Product details</h2><div className="seller-form-grid">
      <label className="wide">Product name<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
      <label>Brand<input value={form.brand} onChange={(e) => set('brand', e.target.value)} required /></label>
      <label>SKU<input value={form.sku} onChange={(e) => set('sku', e.target.value)} required /></label>
      <label>Category<input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Loafers" required /></label>
      <label>Sub-category<input value={form.subCategory || ''} onChange={(e) => set('subCategory', e.target.value)} /></label>
      <label>Gender<select value={form.gender} onChange={(e) => set('gender', e.target.value)}><option>UNISEX</option><option>MEN</option><option>WOMEN</option><option>KIDS</option></select></label>
      <label>Colour<input value={form.color} onChange={(e) => set('color', e.target.value)} required /></label>
      <label>Material<input value={form.material} onChange={(e) => set('material', e.target.value)} required /></label>
      <label className="wide">Description<textarea value={form.description} onChange={(e) => set('description', e.target.value)} required rows="4" /></label>
    </div></section>
    <section><h2>Pricing</h2><div className="seller-form-grid"><label>Price (₹)<input type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required /></label><label>MRP (₹)<input type="number" min="0.01" step="0.01" value={form.mrp} onChange={(e) => set('mrp', e.target.value)} required /></label><label>Discount (%)<input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => set('discount', e.target.value)} /></label></div></section>
    <section><div className="seller-panel-heading"><div><h2>Sizes & inventory</h2><p>Add each available shoe size and its stock.</p></div><button type="button" className="seller-secondary-button" onClick={() => setForm((current) => ({ ...current, variants: [...current.variants, { size: '', sku: '', stock: 0 }] }))}>+ Add size</button></div>
      <div className="seller-variants">{form.variants.map((variant, index) => <div key={index}><label>Size<input value={variant.size} onChange={(e) => setVariant(index, 'size', e.target.value)} required /></label><label>Variant SKU<input value={variant.sku} onChange={(e) => setVariant(index, 'sku', e.target.value)} required /></label><label>Stock<input type="number" min="0" step="1" value={variant.stock} onChange={(e) => setVariant(index, 'stock', e.target.value)} required /></label>{form.variants.length > 1 && <button type="button" className="seller-remove-button" onClick={() => setForm((current) => ({ ...current, variants: current.variants.filter((_, variantIndex) => variantIndex !== index) }))}>Remove</button>}</div>)}</div>
    </section>
    {error && <p className="seller-form-error">{error}</p>}<button className="seller-primary-button" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</button>
  </form>;
}
