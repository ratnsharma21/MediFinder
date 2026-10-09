/**
 * Healthcare Notifications & Dose Alerts Module
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { NotificationItem } from '../../types';
import { notificationService } from '../../services/notificationService';

interface NotificationsModuleProps {
  onNavigate: (tab: string) => void;
  onNotificationsChanged?: () => void;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({ onNavigate, onNotificationsChanged }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      if (onNotificationsChanged) onNotificationsChanged();
    } catch {
      // Local optimistic update
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const notif of unread) {
      try {
        await notificationService.markAsRead(notif.id);
      } catch {
        // ignore
      }
    }
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    if (onNotificationsChanged) onNotificationsChanged();
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.read);

  return (
    <div className="module-page-container">
      {/* Header */}
      <div className="module-header-row">
        <div>
          <h1 className="module-title">Healthcare Notifications & Dose Alerts</h1>
          <p className="module-subtitle">
            Stay on top of medication schedules, low-stock refill alarms, and prescription delivery statuses.
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleMarkAllRead}
            >
              ✓ Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="records-filter-bar">
        <button
          type="button"
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          type="button"
          className={`filter-chip ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="empty-state-box" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
              <div className="empty-state-icon" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
                No Notifications
              </h2>
              <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '0.875rem' }}>
                You are all caught up. You will receive real-time notifications when your scheduled medication dose times arrive.
              </p>
            </div>
          </Card>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`notif-card-item ${!item.read ? 'unread' : ''}`}
            >
              <div className="notif-item-left">
                <div className={`notif-badge-icon type-${item.type.toLowerCase()}`}>
                  {item.type === 'REMINDER' && '⏰'}
                  {item.type === 'SYSTEM' && '🛡️'}
                  {item.type === 'OFFER' && '🏷️'}
                </div>
                <div className="notif-text-block">
                  <div className="notif-title-row">
                    <h4 className="notif-heading">{item.title}</h4>
                    {!item.read && <span className="notif-unread-pill">New</span>}
                    <span className="notif-time-stamp">
                      {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                    </span>
                  </div>
                  <p className="notif-message-text">{item.message}</p>
                </div>
              </div>

              <div className="notif-item-actions">
                {item.type === 'REMINDER' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onNavigate('reminders')}
                  >
                    View Schedule
                  </button>
                )}
                {!item.read && (
                  <button
                    type="button"
                    className="btn btn-icon-subtle"
                    onClick={() => handleMarkAsRead(item.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
