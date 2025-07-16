import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, BarChart3, Settings, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();

  // Calculate dashboard stats
  const activeOrders = mockOrders.filter(order => order.status === 'active');
  const totalItems = activeOrders.reduce((sum, order) => sum + order.items.length, 0);
  const pendingItems = activeOrders.reduce((sum, order) => 
    sum + order.items.filter(item => item.status === 'pending').length, 0
  );
  const cookingItems = activeOrders.reduce((sum, order) => 
    sum + order.items.filter(item => item.status === 'cooking').length, 0
  );
  const readyItems = activeOrders.reduce((sum, order) => 
    sum + order.items.filter(item => item.status === 'ready').length, 0
  );

  const dashboardCards = [
    {
      title: 'Kitchen Display',
      description: 'Real-time kitchen orders and batch cooking',
      icon: ChefHat,
      color: 'bg-section-grill',
      stats: `${cookingItems} cooking, ${readyItems} ready`,
      onClick: () => navigate('/kitchen'),
    },
    {
      title: 'Captain Dashboard',
      description: 'Order management and service tracking',
      icon: Users,
      color: 'bg-section-salad',
      stats: `${activeOrders.length} active orders`,
      onClick: () => navigate('/captain'),
    },
    {
      title: 'Analytics',
      description: 'Performance metrics and insights',
      icon: BarChart3,
      color: 'bg-section-beverage',
      stats: 'Coming soon',
      onClick: () => {},
    },
    {
      title: 'Settings',
      description: 'System configuration and preferences',
      icon: Settings,
      color: 'bg-section-dessert',
      stats: 'Printer setup, sections',
      onClick: () => {},
    },
  ];

  const recentActivity = [
    { time: '2 min ago', action: 'Order #001 - Table 12 - Grilled Chicken ready' },
    { time: '5 min ago', action: 'Order #002 - Table 8 - Batch cooking started' },
    { time: '8 min ago', action: 'Order #003 - Table 15 - New order received' },
    { time: '12 min ago', action: 'Order #001 - Table 12 - Caesar Salad served' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Restaurant Management System</h1>
              <p className="text-muted-foreground">Streamline your kitchen operations and service</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {new Date().toLocaleTimeString()}
              </Badge>
              <Badge className="bg-kitchen-ready text-white">
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-kitchen-pending">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-kitchen-pending">{pendingItems}</p>
                </div>
                <div className="p-3 bg-kitchen-pending/20 rounded-full">
                  <Clock className="w-6 h-6 text-kitchen-pending" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-kitchen-cooking">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cooking</p>
                  <p className="text-2xl font-bold text-kitchen-cooking">{cookingItems}</p>
                </div>
                <div className="p-3 bg-kitchen-cooking/20 rounded-full">
                  <ChefHat className="w-6 h-6 text-kitchen-cooking" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-kitchen-ready">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Serve</p>
                  <p className="text-2xl font-bold text-kitchen-ready">{readyItems}</p>
                </div>
                <div className="p-3 bg-kitchen-ready/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-kitchen-ready" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tables</p>
                  <p className="text-2xl font-bold text-primary">{activeOrders.length}</p>
                </div>
                <div className="p-3 bg-primary/20 rounded-full">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary"
              onClick={card.onClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 ${card.color} rounded-lg`}>
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                      <p className="text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{card.stats}</span>
                  <span>Click to access</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <span className="text-sm">{activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;