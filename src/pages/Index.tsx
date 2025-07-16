import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, getUserDashboards } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboards = getUserDashboards();
      if (dashboards.length === 1) {
        // Auto-redirect if user has only one dashboard
        navigate(`/${dashboards[0]}`);
      } else if (dashboards.length > 1) {
        // Redirect to main dashboard if multiple access
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate, getUserDashboards]);

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <ChefHat className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Restaurant Management System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline your restaurant operations with our comprehensive kitchen display system, 
              order management, and real-time tracking solution.
            </p>
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="group hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/30">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-section-grill/20 rounded-lg group-hover:bg-section-grill/30 transition-colors">
                    <ChefHat className="w-8 h-8 text-section-grill" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Kitchen Display System</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Real-time order tracking with batch cooking suggestions, priority management, 
                  and section-specific filtering for maximum kitchen efficiency.
                </p>
                <ul className="text-left space-y-2 text-sm text-muted-foreground">
                  <li>• Smart batch cooking recommendations</li>
                  <li>• Priority-based order queue</li>
                  <li>• Section-specific displays</li>
                  <li>• Real-time status updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/30">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-section-salad/20 rounded-lg group-hover:bg-section-salad/30 transition-colors">
                    <Users className="w-8 h-8 text-section-salad" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Captain Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Comprehensive order management with real-time tracking, service status updates, 
                  and multi-section KOT printing capabilities.
                </p>
                <ul className="text-left space-y-2 text-sm text-muted-foreground">
                  <li>• Order status tracking</li>
                  <li>• Mark items as served</li>
                  <li>• Multi-section KOT printing</li>
                  <li>• Table-wise order management</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Key Benefits */}
          <div className="bg-card/50 rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold mb-6">Why Choose Our System?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">40%</div>
                <div className="text-sm text-muted-foreground">Faster Kitchen Operations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <div className="text-sm text-muted-foreground">Reduced Order Errors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
