export interface MenuItem {
  id: string;
  name: string;
  section: 'grill' | 'salad' | 'beverage' | 'dessert';
  cookingTime: number; // in minutes
  price: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  tableNumber: number;
  status: 'pending' | 'cooking' | 'ready' | 'served';
  orderTime: Date;
  cookingStartTime?: Date;
  readyTime?: Date;
  servedTime?: Date;
  specialInstructions?: string;
  priority: number; // calculated priority score
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  orderTime: Date;
  status: 'active' | 'completed' | 'cancelled';
  total: number;
  customerName?: string;
  notes?: string;
}

export interface KitchenSection {
  id: string;
  name: string;
  color: string;
  printerIP?: string;
}

export interface BatchCookingSuggestion {
  menuItemId: string;
  menuItem: MenuItem;
  totalQuantity: number;
  orderIds: string[];
  tableNumbers: number[];
  avgWaitTime: number;
  canBatch: boolean;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served';
export type UserRole = 'captain' | 'kitchen' | 'manager';