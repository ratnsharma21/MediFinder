/**
 * Medication Orders & Reorders Module
 */

import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { User } from '../../types';
import { orderService, OrderItem } from '../../services/orderService';

interface OrdersModuleProps {
  user?: User | null;
  onNavigate: (tab: string) => void;
}

export const OrdersModule: React.FC<OrdersModuleProps> = ({ user, onNavigate }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (user?.id) {
      setOrders(orderService.getUserOrders(user.id));
    } else {
      setOrders([]);
    }
  }, [user?.id]);

  return (
    <div className="module-page-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Medication Orders & Reorders</h1>
          <p className="module-subtitle">
            Track pharmacy delivery dispatches, review digital invoices, and initiate quick refill reorders.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate('medicines')}
        >
          🛒 Browse Catalogue to Order
        </button>
      </div>

      {/* Orders List / Empty State */}
      {orders.length > 0 ? (
        <div className="orders-grid">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="order-card-inner">
                <div className="order-header-line">
                  <div>
                    <div className="order-id-tag">Order #{order.orderNumber}</div>
                    <div className="order-meta-text">Placed: {order.placedDate} • {order.itemsCount} item(s) from {order.pharmacyName}</div>
                  </div>
                  <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-primary'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items-box">
                  <div className="order-items-label">Prescribed Medicines:</div>
                  <div className="order-items-names">{order.itemsSummary}</div>
                  <div className="order-delivery-address">📍 Ship to: {order.deliveryAddress}</div>
                </div>

                <div className="order-footer-line">
                  <div className="order-price-info">
                    <span className="price-label">Total:</span>
                    <span className="price-value">₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="order-action-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => alert(`Invoice #INV-${order.orderNumber} downloaded for your records.`)}
                    >
                      📄 Invoice
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate('medicines')}
                    >
                      🔄 Reorder
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748B' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
              No Medication Orders Placed Yet
            </h2>
            <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Your order history is empty. Explore our verified online medicine store to search medicines and compare prices across licensed partner pharmacies.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('medicines')}
            >
              🛒 Explore Medicine Store
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

