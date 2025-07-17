import React, { useState, useEffect } from 'react';
import { Plus, Eye, CheckCircle, Printer, Search, Clock, Users, LogOut, Menu, X, Grid, List, Table } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [viewMode, setViewMode] = useState<'list' | 'floor'>('list');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
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

  const handleNewOrder = () => {
    setIsNewOrderOpen(true);
  };

  const createNewOrder = (tableNumber: number) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableNumber,
      customerName: `Customer ${tableNumber}`,
      items: [],
      status: 'active',
      orderTime: new Date(),
      total: 0,
      notes: ''
    };
    
    setOrders(prev => [...prev, newOrder]);
    setIsNewOrderOpen(false);
    toast({
      title: "New Order Created",
      description: `Order created for Table ${tableNumber}`,
    });
  };

  // Define table layout for floor view
  const tableLayout = [
    { id: 1, x: 10, y: 10, width: 60, height: 60, seats: 4 },
    { id: 2, x: 90, y: 10, width: 60, height: 60, seats: 4 },
    { id: 3, x: 170, y: 10, width: 60, height: 60, seats: 2 },
    { id: 4, x: 250, y: 10, width: 60, height: 60, seats: 6 },
    { id: 5, x: 10, y: 100, width: 60, height: 60, seats: 4 },
    { id: 6, x: 90, y: 100, width: 60, height: 60, seats: 4 },
    { id: 7, x: 170, y: 100, width: 60, height: 60, seats: 2 },
    { id: 8, x: 250, y: 100, width: 60, height: 60, seats: 8 },
    { id: 9, x: 10, y: 190, width: 60, height: 60, seats: 4 },
    { id: 10, x: 90, y: 190, width: 60, height: 60, seats: 4 },
    { id: 11, x: 170, y: 190, width: 60, height: 60, seats: 2 },
    { id: 12, x: 250, y: 190, width: 60, height: 60, seats: 4 },
    { id: 13, x: 10, y: 280, width: 60, height: 60, seats: 6 },
    { id: 14, x: 90, y: 280, width: 60, height: 60, seats: 4 },
    { id: 15, x: 170, y: 280, width: 60, height: 60, seats: 2 },
  ];

  const getTableStatus = (tableNumber: number) => {
    const tableOrders = orders.filter(order => order.tableNumber === tableNumber && order.status === 'active');
    if (tableOrders.length === 0) return 'available';
    
    const hasItems = tableOrders.some(order => order.items.length > 0);
    if (!hasItems) return 'reserved';
    
    const allServed = tableOrders.every(order => 
      order.items.every(item => item.status === 'served')
    );
    
    if (allServed) return 'ready_to_clear';
    return 'occupied';
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'reserved': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'occupied': return 'bg-red-100 border-red-300 text-red-800';
      case 'ready_to_clear': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

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
            
            <Button 
              className="bg-primary hover:bg-primary/80 px-4"
              onClick={handleNewOrder}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'floor')} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="floor" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Floor View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4 mt-4">
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
          </TabsContent>

          <TabsContent value="floor" className="mt-4">
            {/* Floor View */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Table className="w-5 h-5" />
                Restaurant Floor Plan
              </h3>
              
              <div className="relative bg-muted/30 rounded-lg p-4 min-h-[400px] overflow-auto">
                <svg viewBox="0 0 340 360" className="w-full h-full min-h-[400px]">
                  {/* Background areas */}
                  <rect x="5" y="5" width="330" height="350" fill="transparent" stroke="#e5e7eb" strokeWidth="1" rx="8"/>
                  
                  {/* Tables */}
                  {tableLayout.map((table) => {
                    const status = getTableStatus(table.id);
                    const hasActiveOrder = orders.some(order => 
                      order.tableNumber === table.id && order.status === 'active'
                    );
                    
                    return (
                      <g key={table.id}>
                        <rect
                          x={table.x}
                          y={table.y}
                          width={table.width}
                          height={table.height}
                          rx="8"
                          fill={status === 'available' ? '#f0fdf4' : 
                                status === 'reserved' ? '#fefce8' :
                                status === 'occupied' ? '#fef2f2' : '#eff6ff'}
                          stroke={status === 'available' ? '#16a34a' : 
                                  status === 'reserved' ? '#ca8a04' :
                                  status === 'occupied' ? '#dc2626' : '#3b82f6'}
                          strokeWidth="2"
                          className="cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => hasActiveOrder ? null : createNewOrder(table.id)}
                        />
                        <text
                          x={table.x + table.width / 2}
                          y={table.y + table.height / 2 - 4}
                          textAnchor="middle"
                          className="text-xs font-bold fill-gray-800"
                        >
                          {table.id}
                        </text>
                        <text
                          x={table.x + table.width / 2}
                          y={table.y + table.height / 2 + 8}
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {table.seats} seats
                        </text>
                        {hasActiveOrder && (
                          <circle
                            cx={table.x + table.width - 8}
                            cy={table.y + 8}
                            r="4"
                            fill="#dc2626"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Legend */}
                  <g transform="translate(10, 320)">
                    <rect x="0" y="0" width="12" height="12" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1" rx="2"/>
                    <text x="18" y="10" className="text-xs fill-gray-700">Available</text>
                    
                    <rect x="80" y="0" width="12" height="12" fill="#fefce8" stroke="#ca8a04" strokeWidth="1" rx="2"/>
                    <text x="98" y="10" className="text-xs fill-gray-700">Reserved</text>
                    
                    <rect x="160" y="0" width="12" height="12" fill="#fef2f2" stroke="#dc2626" strokeWidth="1" rx="2"/>
                    <text x="178" y="10" className="text-xs fill-gray-700">Occupied</text>
                    
                    <rect x="240" y="0" width="12" height="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" rx="2"/>
                    <text x="258" y="10" className="text-xs fill-gray-700">Ready to Clear</text>
                  </g>
                </svg>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Click on available tables to create new orders
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        {viewMode === 'list' && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">No active orders</h3>
            <p className="text-muted-foreground">Orders will appear here when they're placed</p>
          </div>
        )}
      </div>

      {/* New Order Dialog */}
      <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a table to create a new order:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {tableLayout.map((table) => {
                const status = getTableStatus(table.id);
                const isAvailable = status === 'available';
                return (
                  <Button
                    key={table.id}
                    variant={isAvailable ? "default" : "secondary"}
                    size="sm"
                    onClick={() => createNewOrder(table.id)}
                    disabled={!isAvailable}
                    className={`${isAvailable ? 'bg-primary hover:bg-primary/80' : ''}`}
                  >
                    Table {table.id}
                    {!isAvailable && (
                      <span className="ml-1 text-xs">({status})</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaptainDashboard;