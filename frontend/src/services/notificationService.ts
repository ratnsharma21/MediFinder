/**
 * In-App & Push Notifications Service
 * Interacts with /api/notifications and /api/notifications/unread-count
 */

import { request } from './api';
import { ApiResponse, NotificationItem } from '../types';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await request<ApiResponse<NotificationItem[]>>('/notifications', { requiresAuth: true });
    return res.data || [];
  },

  async getUnreadCount(): Promise<number> {
    const res = await request<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count', { requiresAuth: true });
    return res.data?.unreadCount || 0;
  },

  async markAsRead(notificationId: number): Promise<NotificationItem> {
    const res = await request<ApiResponse<NotificationItem>>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
      requiresAuth: true,
    });
    return res.data;
  },
};
