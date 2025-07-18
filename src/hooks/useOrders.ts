import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrderItem, BatchCookingSuggestion } from '@/types/restaurant';

interface DatabaseOrderItem {
  id: string;
  menu_item_id: string;
  order_id: string;
  quantity: number;
  status: string;
  special_instructions: string | null;
  priority: number;
  cooking_start_time: string | null;
  ready_time: string | null;
  served_time: string | null;
  created_at: string;
  updated_at: string;
  orders: {
    table_number: number;
    order_time: string;
    customer_name: string | null;
  };
  menu_items: {
    id: string;
    name: string;
    section: string;
    kitchen_id: string;
    cooking_time: number;
    price: number;
  };
}

export const useOrders = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [kitchens, setKitchens] = useState<any[]>([]);
  const [kitchenSections, setKitchenSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch kitchens
        const { data: kitchensData, error: kitchensError } = await supabase
          .from('kitchens')
          .select('*')
          .eq('is_active', true);

        if (kitchensError) throw kitchensError;

        // Fetch kitchen sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('kitchen_sections')
          .select('*');

        if (sectionsError) throw sectionsError;

        // Fetch order items with related data
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            orders!inner(table_number, order_time, customer_name),
            menu_items!inner(id, name, section, kitchen_id, cooking_time, price)
          `)
          .eq('orders.status', 'active');

        if (orderItemsError) throw orderItemsError;

        // Transform data to match existing interface
        const transformedItems: OrderItem[] = (orderItemsData as DatabaseOrderItem[]).map(item => ({
          id: item.id,
          menuItemId: item.menu_item_id,
          menuItem: {
            id: item.menu_items.id,
            name: item.menu_items.name,
            section: item.menu_items.section as any,
            kitchenId: item.menu_items.kitchen_id,
            cookingTime: item.menu_items.cooking_time,
            price: item.menu_items.price
          },
          quantity: item.quantity,
          tableNumber: item.orders.table_number,
          status: item.status as any,
          orderTime: new Date(item.orders.order_time),
          cookingStartTime: item.cooking_start_time ? new Date(item.cooking_start_time) : undefined,
          readyTime: item.ready_time ? new Date(item.ready_time) : undefined,
          servedTime: item.served_time ? new Date(item.served_time) : undefined,
          specialInstructions: item.special_instructions || undefined,
          priority: item.priority
        }));

        setKitchens(kitchensData || []);
        setKitchenSections(sectionsData || []);
        setOrderItems(transformedItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update item status
  const updateItemStatus = async (itemId: string, newStatus: 'pending' | 'cooking' | 'ready' | 'served') => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'cooking') {
        updateData.cooking_start_time = new Date().toISOString();
      } else if (newStatus === 'ready') {
        updateData.ready_time = new Date().toISOString();
      } else if (newStatus === 'served') {
        updateData.served_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('order_items')
        .update(updateData)
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      setOrderItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                status: newStatus,
                cookingStartTime: newStatus === 'cooking' ? new Date() : item.cookingStartTime,
                readyTime: newStatus === 'ready' ? new Date() : item.readyTime,
                servedTime: newStatus === 'served' ? new Date() : item.servedTime,
              }
            : item
        )
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Start batch cooking
  const startBatchCooking = async (suggestion: BatchCookingSuggestion) => {
    try {
      const { error } = await supabase
        .from('order_items')
        .update({ 
          status: 'cooking',
          cooking_start_time: new Date().toISOString()
        })
        .in('id', suggestion.orderIds);

      if (error) throw error;

      // Update local state
      setOrderItems(prev => 
        prev.map(item => 
          suggestion.orderIds.includes(item.id)
            ? { ...item, status: 'cooking' as const, cookingStartTime: new Date() }
            : item
        )
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start batch cooking';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    orderItems,
    kitchens,
    kitchenSections,
    loading,
    error,
    updateItemStatus,
    startBatchCooking
  };
};