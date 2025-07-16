import React, { useState, useEffect } from 'react';
import { Plus, Eye, CheckCircle, Printer, Search, Clock, Users, LogOut, Menu, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Order, OrderItem } from '@/types/restaurant';
import { mockOrders, menuItems } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CaptainDashboard = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrders(prev => [...prev]); // Trigger re-render to show updated times
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.tableNumber.toString().includes(searchTerm);
    const matchesTable = selectedTable === 'all' || order.tableNumber.toString() === selectedTable;
    return matchesSearch && matchesTable && order.status === 'active';
  });

  const updateItemStatus = (orderId: string, itemId: string, newStatus: 'pending' | 'cooking' | 'ready' | 'served') => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? {
              ...order,
              items: order.items.map(item => 
                item.id === itemId 
                  ? { 
                      ...item, 
                      status: newStatus,
                      servedTime: newStatus === 'served' ? new Date() : item.servedTime,
                    }
                  : item
              )
            }
          : order
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Item marked as ${newStatus}`,
    });
  };

  const printKOT = (order: Order, section?: string) => {
    const itemsToPrint = section 
      ? order.items.filter(item => item.menuItem.section === section)
      : order.items;
    
    // Simulate printing
    toast({
      title: "KOT Printed",
      description: `Printed ${itemsToPrint.length} items ${section ? `for ${section} section` : ''}`,
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

  const getOrderProgress = (order: Order) => {
    const total = order.items.length;
    const served = order.items.filter(item => item.status === 'served').length;
    const ready = order.items.filter(item => item.status === 'ready').length;
    const cooking = order.items.filter(item => item.status === 'cooking').length;
    
    return { total, served, ready, cooking, pending: total - served - ready - cooking };
  };

  const getTimeSinceOrder = (orderTime: Date) => {
    const diffInMinutes = Math.floor((Date.now() - orderTime.getTime()) / 60000);
    return diffInMinutes;
  };

  const uniqueTables = [...new Set(orders.map(order => order.tableNumber))].sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <div className="bg-card border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg md:text-2xl font-bold text-foreground">Captain</h1>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {new Date().toLocaleTimeString()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.username}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-3 pt-3 border-t md:hidden">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {user?.username} • {user?.role}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Mobile-Optimized Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer or table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Tables" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {uniqueTables.map(table => (
                  <SelectItem key={table} value={table.toString()}>
                    Table {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="bg-primary hover:bg-primary/80 px-4">
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Mobile-Optimized Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const progress = getOrderProgress(order);
            const timeSinceOrder = getTimeSinceOrder(order.orderTime);
            const isDelayed = timeSinceOrder > 30;
            
            return (
              <Card key={order.id} className={`${isDelayed ? 'border-kitchen-urgent' : ''} touch-manipulation`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
                        <Badge variant="outline" className={timeSinceOrder > 20 ? 'border-kitchen-urgent text-kitchen-urgent' : ''}>
                          {timeSinceOrder}m
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName} • ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Mobile-Optimized Progress */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-kitchen-pending/20 p-3 rounded text-center">
                        <div className="text-lg font-semibold">{progress.pending}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                      <div className="bg-kitchen-cooking/20 p-3 rounded text-center">
                        <div className="text-lg font-semibold">{progress.cooking}</div>
                        <div className="text-xs text-muted-foreground">Cooking</div>
                      </div>
                      <div className="bg-kitchen-ready/20 p-3 rounded text-center">
                        <div className="text-lg font-semibold">{progress.ready}</div>
                        <div className="text-xs text-muted-foreground">Ready</div>
                      </div>
                      <div className="bg-kitchen-served/20 p-3 rounded text-center">
                        <div className="text-lg font-semibold">{progress.served}</div>
                        <div className="text-xs text-muted-foreground">Served</div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="flex-1 truncate">{item.quantity}x {item.menuItem.name}</span>
                          <Badge 
                            className={`${getStatusColor(item.status)} text-white ml-2`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-muted-foreground">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>

                    {/* Mobile-Optimized Action Buttons */}
                    <div className="flex gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh]">
                          <SheetHeader>
                            <SheetTitle>Order Details - Table {order.tableNumber}</SheetTitle>
                          </SheetHeader>
                          
                          {selectedOrder && (
                            <div className="space-y-4 mt-4 pb-6">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Customer:</span> {selectedOrder.customerName}
                                </div>
                                <div>
                                  <span className="font-medium">Time:</span> {selectedOrder.orderTime.toLocaleTimeString()}
                                </div>
                                <div>
                                  <span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> {selectedOrder.status}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-medium">Order Items</h4>
                                {selectedOrder.items.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded">
                                    <div className="flex-1">
                                      <div className="font-medium">{item.menuItem.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        Qty: {item.quantity} • ${(item.menuItem.price * item.quantity).toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getStatusColor(item.status)} text-white`}>
                                        {item.status}
                                      </Badge>
                                      {item.status === 'ready' && (
                                        <Button 
                                          size="sm" 
                                          onClick={() => updateItemStatus(selectedOrder.id, item.id, 'served')}
                                          className="bg-kitchen-served hover:bg-kitchen-served/80"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Served
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => printKOT(selectedOrder)}
                                  className="flex-1"
                                >
                                  <Printer className="w-4 h-4 mr-2" />
                                  Print KOT
                                </Button>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => printKOT(order)}
                        className="px-3"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">No active orders</h3>
            <p className="text-muted-foreground">Orders will appear here when they're placed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainDashboard;