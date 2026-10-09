/**
 * Medication Orders & Invoices Service
 * Manages user-scoped orders and pharmacy purchase records
 */

export interface OrderItem {
  id: string;
  orderNumber: string;
  placedDate: string;
  itemsCount: number;
  itemsSummary: string;
  pharmacyName: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  totalPrice: number;
  deliveryAddress: string;
}

export const orderService = {
  getUserOrders(userId?: number | null): OrderItem[] {
    if (!userId) return [];
    try {
      const key = `medicare_orders_u_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  },

  createOrder(userId: number, order: Omit<OrderItem, 'id' | 'orderNumber' | 'placedDate'>): OrderItem {
    const existing = this.getUserOrders(userId);
    const newOrder: OrderItem = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber: `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      placedDate: new Date().toLocaleDateString(),
    };
    const updated = [newOrder, ...existing];
    try {
      localStorage.setItem(`medicare_orders_u_${userId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newOrder;
  },

  clearUserOrders(userId: number): void {
    localStorage.removeItem(`medicare_orders_u_${userId}`);
  }
};
