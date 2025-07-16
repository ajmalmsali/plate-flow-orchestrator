import React, { useState, useEffect } from 'react';
import { Clock, Users, ChefHat, Timer, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderItem, BatchCookingSuggestion, KitchenSection } from '@/types/restaurant';
import { mockOrders, kitchenSections, menuItems } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const KitchenDisplay = () => {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [batchSuggestions, setBatchSuggestions] = useState<BatchCookingSuggestion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const allItems = mockOrders.flatMap(order => order.items);
      setOrderItems(allItems);
      generateBatchSuggestions(allItems);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateBatchSuggestions = (items: OrderItem[]) => {
    const pendingItems = items.filter(item => item.status === 'pending');
    const itemGroups = new Map<string, OrderItem[]>();
    
    pendingItems.forEach(item => {
      const key = item.menuItemId;
      if (!itemGroups.has(key)) {
        itemGroups.set(key, []);
      }
      itemGroups.get(key)!.push(item);
    });

    const suggestions: BatchCookingSuggestion[] = [];
    itemGroups.forEach((items, menuItemId) => {
      if (items.length > 1) {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const avgWaitTime = items.reduce((sum, item) => sum + (Date.now() - item.orderTime.getTime()), 0) / items.length / 60000;
        
        suggestions.push({
          menuItemId,
          menuItem: items[0].menuItem,
          totalQuantity,
          orderIds: items.map(item => item.id),
          tableNumbers: [...new Set(items.map(item => item.tableNumber))],
          avgWaitTime,
          canBatch: totalQuantity <= 6, // Reasonable batch size
        });
      }
    });

    setBatchSuggestions(suggestions);
  };

  const filteredItems = selectedSection === 'all' 
    ? orderItems 
    : orderItems.filter(item => item.menuItem.section === selectedSection);

  const updateItemStatus = (itemId: string, newStatus: 'pending' | 'cooking' | 'ready' | 'served') => {
    setOrderItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: newStatus,
              cookingStartTime: newStatus === 'cooking' ? new Date() : item.cookingStartTime,
              readyTime: newStatus === 'ready' ? new Date() : item.readyTime,
            }
          : item
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Item marked as ${newStatus}`,
    });
  };

  const startBatchCooking = (suggestion: BatchCookingSuggestion) => {
    const itemsToUpdate = suggestion.orderIds;
    setOrderItems(prev => 
      prev.map(item => 
        itemsToUpdate.includes(item.id)
          ? { ...item, status: 'cooking' as const, cookingStartTime: new Date() }
          : item
      )
    );
    
    toast({
      title: "Batch Cooking Started",
      description: `Started cooking ${suggestion.totalQuantity}x ${suggestion.menuItem.name}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-kitchen-pending';
      case 'cooking': return 'bg-kitchen-cooking';
      case 'ready': return 'bg-kitchen-ready';
      case 'served': return 'bg-kitchen-served';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cooking': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'served': return <Users className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTimeSinceOrder = (orderTime: Date) => {
    const diffInMinutes = Math.floor((Date.now() - orderTime.getTime()) / 60000);
    return diffInMinutes;
  };

  const getPriorityColor = (priority: number, timeSinceOrder: number) => {
    if (timeSinceOrder > 30) return 'border-kitchen-urgent shadow-urgent';
    if (priority > 90) return 'border-kitchen-ready';
    if (priority > 70) return 'border-kitchen-cooking';
    return 'border-kitchen-pending';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kitchen Display System</h1>
            <p className="text-muted-foreground">Real-time order management and batch cooking</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {kitchenSections.map(section => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Batch Cooking Suggestions */}
        {batchSuggestions.length > 0 && (
          <Card className="mb-6 border-kitchen-pending bg-kitchen-pending/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-kitchen-pending" />
                Batch Cooking Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {batchSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{suggestion.menuItem.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.totalQuantity} items from {suggestion.tableNumbers.length} tables
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-kitchen-pending text-white">
                        {suggestion.avgWaitTime.toFixed(0)}m wait
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tables: {suggestion.tableNumbers.join(', ')}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => startBatchCooking(suggestion)}
                        className="bg-kitchen-cooking hover:bg-kitchen-cooking/80"
                      >
                        Start Batch
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Items Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems
            .sort((a, b) => {
              // Sort by priority (higher first), then by order time
              if (a.priority !== b.priority) return b.priority - a.priority;
              return a.orderTime.getTime() - b.orderTime.getTime();
            })
            .map((item) => {
              const timeSinceOrder = getTimeSinceOrder(item.orderTime);
              const isUrgent = timeSinceOrder > 30;
              
              return (
                <Card 
                  key={item.id} 
                  className={`${getPriorityColor(item.priority, timeSinceOrder)} ${isUrgent ? 'animate-pulse' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.menuItem.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Table {item.tableNumber} • Qty: {item.quantity}
                        </p>
                      </div>
                      <Badge 
                        className={`${getStatusColor(item.status)} text-white`}
                      >
                        {getStatusIcon(item.status)}
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Order Time:</span>
                        <span>{item.orderTime.toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Wait Time:</span>
                        <span className={timeSinceOrder > 20 ? 'text-kitchen-urgent font-semibold' : ''}>
                          {timeSinceOrder}m
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Est. Cook Time:</span>
                        <span>{item.menuItem.cookingTime}m</span>
                      </div>
                      
                      {item.specialInstructions && (
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span>
                          <p className="text-muted-foreground">{item.specialInstructions}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        {item.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateItemStatus(item.id, 'cooking')}
                            className="flex-1 bg-kitchen-cooking hover:bg-kitchen-cooking/80"
                          >
                            Start Cooking
                          </Button>
                        )}
                        
                        {item.status === 'cooking' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateItemStatus(item.id, 'ready')}
                            className="flex-1 bg-kitchen-ready hover:bg-kitchen-ready/80"
                          >
                            Mark Ready
                          </Button>
                        )}
                        
                        {item.status === 'ready' && (
                          <div className="flex-1 text-center py-2 bg-kitchen-ready/20 rounded text-sm font-medium">
                            Ready for Pickup
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">No orders in this section</h3>
            <p className="text-muted-foreground">Orders will appear here when they're placed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;