export interface MenuItem {
  id: string;
  name: string;
  section: 'grill' | 'salad' | 'beverage' | 'dessert' | 'appetizer' | 'main' | 'soup';
  kitchenId: string; // Which kitchen handles this item
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
  kitchenId: string; // Which kitchen this section belongs to
  printerIP?: string;
}

export interface Kitchen {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  sections: string[]; // Array of section IDs
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  kitchenAccess?: string[]; // Array of kitchen IDs user has access to
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface BatchCookingSuggestion {
  menuItemId: string;
  menuItem: MenuItem;
  totalQuantity: number;
  orderIds: string[];
  tableNumbers: number[];
  avgWaitTime: number;
  canBatch: boolean;
  kitchenId: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served';
export type UserRole = 'manager' | 'captain' | 'kitchen' | 'admin';