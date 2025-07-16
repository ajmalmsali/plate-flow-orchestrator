import { MenuItem, Order, OrderItem, KitchenSection, Kitchen, User } from '../types/restaurant';

// Kitchen definitions
export const kitchens: Kitchen[] = [
  {
    id: 'kitchen-1',
    name: 'Main Kitchen',
    location: 'Ground Floor',
    isActive: true,
    sections: ['grill', 'main', 'soup'],
  },
  {
    id: 'kitchen-2', 
    name: 'Prep Kitchen',
    location: 'Ground Floor - Back',
    isActive: true,
    sections: ['salad', 'appetizer'],
  },
  {
    id: 'kitchen-3',
    name: 'Beverage Station',
    location: 'Bar Area',
    isActive: true,
    sections: ['beverage', 'dessert'],
  },
];

export const menuItems: MenuItem[] = [
  // Main Kitchen Items
  { id: 'grill-1', name: 'Grilled Chicken Breast', section: 'grill', kitchenId: 'kitchen-1', cookingTime: 15, price: 24.99 },
  { id: 'grill-2', name: 'Beef Steak', section: 'grill', kitchenId: 'kitchen-1', cookingTime: 20, price: 34.99 },
  { id: 'grill-3', name: 'Grilled Salmon', section: 'grill', kitchenId: 'kitchen-1', cookingTime: 12, price: 28.99 },
  { id: 'main-1', name: 'Pasta Carbonara', section: 'main', kitchenId: 'kitchen-1', cookingTime: 18, price: 22.99 },
  { id: 'soup-1', name: 'Tomato Basil Soup', section: 'soup', kitchenId: 'kitchen-1', cookingTime: 8, price: 9.99 },
  
  // Prep Kitchen Items
  { id: 'salad-1', name: 'Caesar Salad', section: 'salad', kitchenId: 'kitchen-2', cookingTime: 5, price: 12.99 },
  { id: 'salad-2', name: 'Greek Salad', section: 'salad', kitchenId: 'kitchen-2', cookingTime: 5, price: 14.99 },
  { id: 'appetizer-1', name: 'Chicken Wings', section: 'appetizer', kitchenId: 'kitchen-2', cookingTime: 12, price: 16.99 },
  { id: 'appetizer-2', name: 'Mozzarella Sticks', section: 'appetizer', kitchenId: 'kitchen-2', cookingTime: 8, price: 11.99 },
  
  // Beverage Station Items
  { id: 'beverage-1', name: 'Fresh Orange Juice', section: 'beverage', kitchenId: 'kitchen-3', cookingTime: 2, price: 6.99 },
  { id: 'beverage-2', name: 'Cappuccino', section: 'beverage', kitchenId: 'kitchen-3', cookingTime: 3, price: 4.99 },
  { id: 'beverage-3', name: 'Iced Tea', section: 'beverage', kitchenId: 'kitchen-3', cookingTime: 1, price: 3.99 },
  { id: 'dessert-1', name: 'Chocolate Cake', section: 'dessert', kitchenId: 'kitchen-3', cookingTime: 2, price: 8.99 },
  { id: 'dessert-2', name: 'Tiramisu', section: 'dessert', kitchenId: 'kitchen-3', cookingTime: 3, price: 9.99 },
];

export const kitchenSections: KitchenSection[] = [
  { id: 'grill', name: 'Grill Station', color: 'hsl(var(--section-grill))', kitchenId: 'kitchen-1' },
  { id: 'main', name: 'Main Cooking', color: 'hsl(var(--section-grill))', kitchenId: 'kitchen-1' },
  { id: 'soup', name: 'Soup Station', color: 'hsl(var(--section-grill))', kitchenId: 'kitchen-1' },
  { id: 'salad', name: 'Salad Station', color: 'hsl(var(--section-salad))', kitchenId: 'kitchen-2' },
  { id: 'appetizer', name: 'Appetizer Station', color: 'hsl(var(--section-salad))', kitchenId: 'kitchen-2' },
  { id: 'beverage', name: 'Beverage Station', color: 'hsl(var(--section-beverage))', kitchenId: 'kitchen-3' },
  { id: 'dessert', name: 'Dessert Station', color: 'hsl(var(--section-dessert))', kitchenId: 'kitchen-3' },
];

// User accounts
export const users: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@restaurant.com',
    role: 'admin',
    kitchenAccess: ['kitchen-1', 'kitchen-2', 'kitchen-3'],
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 'user-2',
    username: 'manager',
    email: 'manager@restaurant.com',
    role: 'manager',
    kitchenAccess: ['kitchen-1', 'kitchen-2', 'kitchen-3'],
    createdAt: new Date('2024-01-02'),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 'user-3',
    username: 'captain1',
    email: 'captain1@restaurant.com',
    role: 'captain',
    createdAt: new Date('2024-01-03'),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 'user-4',
    username: 'chef1',
    email: 'chef1@restaurant.com',
    role: 'kitchen',
    kitchenAccess: ['kitchen-1'],
    createdAt: new Date('2024-01-04'),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 'user-5',
    username: 'chef2',
    email: 'chef2@restaurant.com',
    role: 'kitchen',
    kitchenAccess: ['kitchen-2'],
    createdAt: new Date('2024-01-05'),
    lastLogin: new Date(),
    isActive: true,
  },
];

// Mock orders with realistic data
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    tableNumber: 12,
    orderTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'active',
    total: 67.97,
    customerName: 'Johnson Family',
    items: [
        {
          id: 'item-1',
          menuItemId: 'grill-1',
          menuItem: menuItems[0],
          quantity: 2,
          tableNumber: 12,
          status: 'cooking',
          orderTime: new Date(Date.now() - 15 * 60 * 1000),
          cookingStartTime: new Date(Date.now() - 10 * 60 * 1000),
          priority: 85,
        },
        {
          id: 'item-2',
          menuItemId: 'salad-1',
          menuItem: menuItems[5],
          quantity: 1,
          tableNumber: 12,
          status: 'ready',
          orderTime: new Date(Date.now() - 15 * 60 * 1000),
          cookingStartTime: new Date(Date.now() - 12 * 60 * 1000),
          readyTime: new Date(Date.now() - 7 * 60 * 1000),
          priority: 95,
        },
        {
          id: 'item-3',
          menuItemId: 'beverage-2',
          menuItem: menuItems[10],
          quantity: 2,
          tableNumber: 12,
          status: 'served',
          orderTime: new Date(Date.now() - 15 * 60 * 1000),
          cookingStartTime: new Date(Date.now() - 14 * 60 * 1000),
          readyTime: new Date(Date.now() - 11 * 60 * 1000),
          servedTime: new Date(Date.now() - 8 * 60 * 1000),
          priority: 100,
        },
    ],
  },
  {
    id: 'order-2',
    tableNumber: 8,
    orderTime: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    status: 'active',
    total: 52.97,
    customerName: 'Business Lunch',
    items: [
      {
        id: 'item-4',
        menuItemId: 'grill-2',
        menuItem: menuItems[1],
        quantity: 1,
        tableNumber: 8,
        status: 'pending',
        orderTime: new Date(Date.now() - 8 * 60 * 1000),
        priority: 75,
      },
        {
          id: 'item-5',
          menuItemId: 'grill-1',
          menuItem: menuItems[0],
          quantity: 1,
          tableNumber: 8,
          status: 'pending',
          orderTime: new Date(Date.now() - 8 * 60 * 1000),
          priority: 75,
        },
        {
          id: 'item-6',
          menuItemId: 'beverage-1',
          menuItem: menuItems[9],
          quantity: 2,
          tableNumber: 8,
          status: 'ready',
          orderTime: new Date(Date.now() - 8 * 60 * 1000),
          cookingStartTime: new Date(Date.now() - 6 * 60 * 1000),
          readyTime: new Date(Date.now() - 4 * 60 * 1000),
          priority: 90,
        },
    ],
  },
  {
    id: 'order-3',
    tableNumber: 15,
    orderTime: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    status: 'active',
    total: 43.97,
    customerName: 'Smith Party',
    items: [
      {
        id: 'item-7',
        menuItemId: 'grill-3',
        menuItem: menuItems[2],
        quantity: 1,
        tableNumber: 15,
        status: 'cooking',
        orderTime: new Date(Date.now() - 25 * 60 * 1000),
        cookingStartTime: new Date(Date.now() - 10 * 60 * 1000),
        priority: 92,
      },
        {
          id: 'item-8',
          menuItemId: 'salad-2',
          menuItem: menuItems[6],
          quantity: 1,
          tableNumber: 15,
          status: 'ready',
          orderTime: new Date(Date.now() - 25 * 60 * 1000),
          cookingStartTime: new Date(Date.now() - 20 * 60 * 1000),
          readyTime: new Date(Date.now() - 15 * 60 * 1000),
          priority: 98,
        },
    ],
  },
];

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find(item => item.id === id);
};

export const getOrdersByStatus = (status: string) => {
  return mockOrders.filter(order => order.status === status);
};

export const getAllOrderItems = (): OrderItem[] => {
  return mockOrders.flatMap(order => order.items);
};