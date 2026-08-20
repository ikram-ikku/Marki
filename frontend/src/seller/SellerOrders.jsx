import { useState, useMemo, useEffect } from 'react';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

// Mock Data matching Prisma Schema
const initialMockOrders = [
  {
    id: 'ord_101',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'PENDING',
    totalAmount: '4500.00',
    user: { name: 'John Doe', email: 'john@example.com' },
    items: [
      { id: 'item_1', product: { name: 'Classic Leather Loafers', sku: 'LOAF-001' }, variant: { size: '9', sku: 'LOAF-001-9' }, quantity: 1, price: '2500.00', status: 'PENDING' },
      { id: 'item_2', product: { name: 'Running Sneakers', sku: 'SNEAK-002' }, variant: { size: '10', sku: 'SNEAK-002-10' }, quantity: 1, price: '2000.00', status: 'PENDING' }
    ]
  },
  {
    id: 'ord_102',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'SHIPPED',
    totalAmount: '1500.00',
    user: { name: 'Alice Smith', email: 'alice@example.com' },
    items: [
      { id: 'item_3', product: { name: 'Canvas Slip-ons', sku: 'CANV-003' }, variant: { size: '8', sku: 'CANV-003-8' }, quantity: 1, price: '1500.00', status: 'SHIPPED' }
    ]
  },
  {
    id: 'ord_103',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    status: 'DELIVERED',
    totalAmount: '8000.00',
    user: { name: 'Bob Jones', email: 'bob@example.com' },
    items: [
      { id: 'item_4', product: { name: 'Premium Boots', sku: 'BOOT-004' }, variant: { size: '11', sku: 'BOOT-004-11' }, quantity: 2, price: '4000.00', status: 'DELIVERED' }
    ]
  }
];

const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED'
];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setOrders(initialMockOrders);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateStatus = (newStatus) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    
    // Simulate API delay
    setTimeout(() => {
      setOrders(current => current.map(order => 
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      ));
      setSelectedOrder(current => ({ ...current, status: newStatus }));
      setIsUpdatingStatus(false);
    }, 400);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const searchLower = search.toLowerCase();
      const matchesSearch = o.id.toLowerCase().includes(searchLower) || o.user.name.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="seller-page-intro">
        <div>
          <p className="seller-eyebrow">Order Management</p>
          <h1>Your orders.</h1>
          <p>Review and fulfill orders placed by Marki customers.</p>
        </div>
      </div>

      <section className="seller-panel seller-product-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="seller-toolbar" style={{ padding: '24px 24px 0' }}>
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
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
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {loading && <p style={{ padding: '24px', color: 'var(--cream-2)' }}>Loading orders…</p>}
        
        {!loading && orders.length === 0 && (
          <div className="seller-empty" style={{ margin: '24px' }}>
            <h3>No orders yet.</h3>
            <p>Orders will appear here once customers purchase your products.</p>
          </div>
        )}

        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="seller-empty" style={{ margin: '24px', border: 'none', background: 'transparent' }}>
            <p>No orders match your search.</p>
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <>
            <div className="seller-product-table">
              <div className="seller-table-head" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px' }}>
                <span>Order ID</span>
                <span>Date</span>
                <span>Customer</span>
                <span>Total</span>
                <span />
              </div>
              {paginatedOrders.map((order) => (
                <div className="seller-table-row" key={order.id} style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px' }}>
                  <div>
                    <strong>{order.id}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--cream-2)', marginTop: '4px' }}>{order.items.length} item(s)</span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--black-brown)' }}>{formatDate(order.createdAt)}</span>
                  <div style={{ fontSize: '13px', color: 'var(--black-brown)' }}>
                    <span>{order.user.name}</span>
                  </div>
                  <b>{money(order.totalAmount)}</b>
                  <div className="seller-table-actions">
                    <button className="seller-text-button" onClick={() => setSelectedOrder(order)}>View</button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="seller-pagination">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results</span>
                <div className="seller-pagination-controls">
                  <button className="seller-icon-button" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
                  <button className="seller-icon-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="seller-modal-overlay" onClick={() => !isUpdatingStatus && setSelectedOrder(null)}>
          <div className="seller-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Order {selectedOrder.id}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button className="seller-text-button" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--wood-2)', padding: '16px', borderRadius: '8px' }}>
                <p className="seller-eyebrow" style={{ marginBottom: '8px' }}>Customer Details</p>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{selectedOrder.user.name}</strong>
                <span style={{ fontSize: '13px', color: 'var(--cream-2)' }}>{selectedOrder.user.email}</span>
              </div>
              <div style={{ background: 'var(--wood-2)', padding: '16px', borderRadius: '8px' }}>
                <p className="seller-eyebrow" style={{ marginBottom: '8px' }}>Order Status</p>
                <select 
                  className="seller-filter-select"
                  style={{ width: '100%', padding: '8px', fontWeight: 600 }}
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={isUpdatingStatus}
                >
                  {ORDER_STATUSES.map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
                {isUpdatingStatus && <span style={{ fontSize: '11px', color: 'var(--copper-3)', marginTop: '4px', display: 'block' }}>Updating...</span>}
              </div>
            </div>

            <h4 style={{ fontSize: '16px', color: 'var(--black-brown)', marginBottom: '16px' }}>Order Items</h4>
            <div style={{ border: '1px solid rgba(28,28,28,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
              {selectedOrder.items.map((item, index) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: index < selectedOrder.items.length - 1 ? '1px solid rgba(28,28,28,0.08)' : 'none' }}>
                  <div>
                    <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>{item.product.name}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--cream-2)' }}>Size: {item.variant.size} • SKU: {item.variant.sku}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>{item.quantity} × {money(item.price)}</div>
                    <strong style={{ fontSize: '14px' }}>{money(Number(item.price) * item.quantity)}</strong>
                  </div>
                </div>
              ))}
              <div style={{ background: 'var(--wood-2)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px' }}>Total Amount</strong>
                <strong style={{ fontSize: '18px', color: 'var(--copper-3)' }}>{money(selectedOrder.totalAmount)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
