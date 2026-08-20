import { useState, useRef } from 'react';

const blankProduct = { 
  name: '', 
  brand: '', 
  category: '', 
  subCategory: '', 
  description: '', 
  price: '', 
  mrp: '', 
  discount: '0', 
  sku: '', 
  gender: 'UNISEX', 
  color: '', 
  material: '', 
  variants: [{ size: '', sku: '', stock: 0 }] 
};

export default function ProductForm({ initialProduct, onSubmit, submitting, submitLabel }) {
  const [form, setForm] = useState(() => initialProduct ? { ...blankProduct, ...initialProduct, price: String(initialProduct.price), mrp: String(initialProduct.mrp), discount: String(initialProduct.discount ?? 0) } : blankProduct);
  const [error, setError] = useState('');
  
  // Mock Image Upload State
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const setVariant = (index, field, value) => setForm((current) => ({ ...current, variants: current.variants.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant) }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onSubmit({ 
        ...form, 
        price: Number(form.price), 
        mrp: Number(form.mrp), 
        discount: Number(form.discount || 0), 
        variants: form.variants.map((variant) => ({ ...variant, stock: Number(variant.stock) })) 
      });
    } catch (submitError) { 
      setError(submitError.message); 
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <form className="seller-product-form" onSubmit={submit}>
      
      <section className="seller-panel" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '16px' }}>Product details</h2>
        <div className="seller-form-grid">
          <label className="wide">Product name<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
          <label>Brand<input value={form.brand} onChange={(e) => set('brand', e.target.value)} required /></label>
          <label>SKU<input value={form.sku} onChange={(e) => set('sku', e.target.value)} required /></label>
          <label>Category<input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Loafers" required /></label>
          <label>Sub-category<input value={form.subCategory || ''} onChange={(e) => set('subCategory', e.target.value)} /></label>
          <label>Gender
            <select value={form.gender} onChange={(e) => set('gender', e.target.value)}>
              <option value="UNISEX">UNISEX</option>
              <option value="MEN">MEN</option>
              <option value="WOMEN">WOMEN</option>
              <option value="KIDS">KIDS</option>
            </select>
          </label>
          <label>Colour<input value={form.color} onChange={(e) => set('color', e.target.value)} required /></label>
          <label>Material<input value={form.material} onChange={(e) => set('material', e.target.value)} required /></label>
          <label className="wide">Description<textarea value={form.description} onChange={(e) => set('description', e.target.value)} required rows="4" /></label>
        </div>
      </section>

      {/* Mock Image Upload UI */}
      <section className="seller-panel" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '8px' }}>Product Images</h2>
        <p style={{ fontSize: '13px', color: 'var(--cream-2)', marginBottom: '16px' }}>
          Upload high-quality images of the product. Note: This is a frontend visual preview only, as the backend API does not currently support image fields.
        </p>
        <div 
          style={{ 
            border: '1px dashed rgba(28,28,28,0.2)', 
            borderRadius: '8px', 
            padding: '40px 20px', 
            textAlign: 'center',
            background: 'var(--wood-2)',
            cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <p style={{ fontWeight: 600, color: 'var(--black-brown)', marginBottom: '4px' }}>Click to upload images</p>
          <p style={{ fontSize: '12px', color: 'var(--cream-2)' }}>SVG, PNG, JPG or GIF (max. 5MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            multiple 
            accept="image/*" 
            onChange={handleImageChange}
          />
        </div>
        
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="seller-panel" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)', marginBottom: '16px' }}>Pricing</h2>
        <div className="seller-form-grid">
          <label>Price (₹)<input type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required /></label>
          <label>MRP (₹)<input type="number" min="0.01" step="0.01" value={form.mrp} onChange={(e) => set('mrp', e.target.value)} required /></label>
          <label>Discount (%)<input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => set('discount', e.target.value)} /></label>
        </div>
      </section>

      <section className="seller-panel" style={{ marginBottom: '24px' }}>
        <div className="seller-panel-heading">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black-brown)' }}>Sizes & inventory</h2>
            <p style={{ fontSize: '13px', color: 'var(--cream-2)' }}>Add each available shoe size and its stock.</p>
          </div>
          <button type="button" className="seller-text-button" onClick={() => setForm((current) => ({ ...current, variants: [...current.variants, { size: '', sku: '', stock: 0 }] }))}>
            + Add size
          </button>
        </div>
        
        <div className="seller-variants" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {form.variants.map((variant, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <label>Size<input value={variant.size} onChange={(e) => setVariant(index, 'size', e.target.value)} required /></label>
              <label>Variant SKU<input value={variant.sku} onChange={(e) => setVariant(index, 'sku', e.target.value)} required /></label>
              <label>Stock<input type="number" min="0" step="1" value={variant.stock} onChange={(e) => setVariant(index, 'stock', e.target.value)} required /></label>
              {form.variants.length > 1 && (
                <button type="button" className="seller-icon-button" style={{ height: '42px', color: '#d32f2f' }} onClick={() => setForm((current) => ({ ...current, variants: current.variants.filter((_, variantIndex) => variantIndex !== index) }))}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {error && <div className="seller-inline-error" style={{ background: 'rgba(183, 93, 53, 0.08)', color: 'var(--copper-3)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{error}</div>}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
        <button type="submit" className="seller-primary-button" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
