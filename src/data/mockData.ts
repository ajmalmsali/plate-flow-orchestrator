import { MenuItem, Order, OrderItem, KitchenSection } from '../types/restaurant';

export const menuItems: MenuItem[] = [
  // Grill Section
  { id: 'grill-1', name: 'Grilled Chicken Breast', section: 'grill', cookingTime: 15, price: 24.99 },
  { id: 'grill-2', name: 'Beef Steak', section: 'grill', cookingTime: 20, price: 34.99 },
  { id: 'grill-3', name: 'Grilled Salmon', section: 'grill', cookingTime: 12, price: 28.99 },
  { id: 'grill-4', name: 'BBQ Ribs', section: 'grill', cookingTime: 25, price: 29.99 },
  
  // Salad Section
  { id: 'salad-1', name: 'Caesar Salad', section: 'salad', cookingTime: 5, price: 12.99 },
  { id: 'salad-2', name: 'Greek Salad', section: 'salad', cookingTime: 5, price: 14.99 },
  { id: 'salad-3', name: 'Quinoa Bowl', section: 'salad', cookingTime: 8, price: 16.99 },
  
  // Beverage Section
  { id: 'beverage-1', name: 'Fresh Orange Juice', section: 'beverage', cookingTime: 2, price: 6.99 },
  { id: 'beverage-2', name: 'Cappuccino', section: 'beverage', cookingTime: 3, price: 4.99 },
  { id: 'beverage-3', name: 'Iced Tea', section: 'beverage', cookingTime: 1, price: 3.99 },
  
  // Dessert Section
  { id: 'dessert-1', name: 'Chocolate Cake', section: 'dessert', cookingTime: 2, price: 8.99 },
  { id: 'dessert-2', name: 'Tiramisu', section: 'dessert', cookingTime: 3, price: 9.99 },
];

export const kitchenSections: KitchenSection[] = [
  { id: 'grill', name: 'Grill Station', color: 'hsl(var(--section-grill))' },
  { id: 'salad', name: 'Salad Station', color: 'hsl(var(--section-salad))' },
  { id: 'beverage', name: 'Beverage Station', color: 'hsl(var(--section-beverage))' },
  { id: 'dessert', name: 'Dessert Station', color: 'hsl(var(--section-dessert))' },
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
        menuItem: menuItems[4],
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
        menuItem: menuItems[8],
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
        menuItem: menuItems[7],
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
        menuItem: menuItems[5],
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