import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { adminApi, UserResponse } from '@/services/adminApi';
import { testimonialApi } from '@/services/testimonialApi';
import { orderApi } from '@/services/orderApi';
import { menuApi } from '@/services/menuApi';
import { DashboardStats } from './DashboardStats';
import { UserList } from './UserList';
import { OrderManagement } from './OrderManagement';
import { TestimonialManagement } from './TestimonialManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { MenuBrowser } from '@/components/shared/MenuBrowser';
import { RatingsDisplay } from '@/components/ui/RatingsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, ShoppingBag, Users, ChefHat, Star, FileText, BarChart3, Menu } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [chefs, setChefs] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pendingTestimonials: 0,
    totalMenuItems: 0
  });

  const loadData = async () => {
    try {
      if (!token) return;
      
      const [allUsers, allChefs, pendingTestimonials, allOrdersResponse, allMenuItemsResponse] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllChefs(),
        testimonialApi.getPendingTestimonials().catch(() => []),
        orderApi.getAllOrders(token).catch(() => ({ success: false, data: [] })),
        menuApi.getAllMenuItems().catch(() => ({ success: false, data: [] }))
      ]);
      
      const allOrders = allOrdersResponse.data || [];
      const allMenuItems = allMenuItemsResponse.data || [];
      
      console.log('Loaded chefs data:', allChefs);
      console.log('Verified chefs:', allChefs.filter(c => c.verified));
      
      setUsers(allUsers);
      setChefs(allChefs);
      setAnalytics({
        totalOrders: allOrders.length,
        pendingTestimonials: pendingTestimonials.length,
        totalMenuItems: allMenuItems.length
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleActivate = async (id: number) => {
    try {
      await adminApi.activateUser(id);
      
      // Update users state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, active: true } : user
        )
      );
      
      // Update chefs state if the activated user is a chef
      setChefs(prevChefs => {
        const chef = prevChefs.find(chef => chef.id === id);
        if (!chef) return prevChefs;
        
        return prevChefs.map(chef => 
          chef.id === id ? { ...chef, active: true } : chef
        );
      });
      
      toast({
        title: "Success",
        description: "User activated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to activate user"
      });
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await adminApi.deactivateUser(id);
      
      // Update users state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, active: false } : user
        )
      );
      
      // Update chefs state if the deactivated user is a chef
      setChefs(prevChefs => {
        const isChef = prevChefs.some(chef => chef.id === id);
        if (!isChef) return prevChefs;
        
        return prevChefs.map(chef => 
          chef.id === id ? { ...chef, active: false } : chef
        );
      });
      
      toast({
        title: "Success",
        description: "User deactivated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate user"
      });
    }
  };

  const handleVerifyChef = async (id: number) => {
    try {
      console.log('Toggling verification for chef with ID:', id);
      const updatedChef = await adminApi.toggleChefVerification(id);
      console.log('Backend response for chef:', updatedChef);
      
      // Update chefs state with toggled verification
      setChefs(prevChefs => {
        const updatedChefs = prevChefs.map(chef => 
          chef.id === id ? { ...chef, verified: updatedChef.verified } : chef
        );
        console.log('Updated chefs after toggle:', updatedChefs);
        console.log('Verified chefs count:', updatedChefs.filter(c => c.verified).length);
        return updatedChefs;
      });

      toast({
        title: "Success",
        description: updatedChef.verified ? "Chef verified successfully" : "Chef unverified successfully"
      });
    } catch (error) {
      console.error('Error toggling chef verification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle chef verification. Please try again."
      });
    }
  };

  const stats = {
    totalUsers: users.length,
    totalChefs: chefs.length,
    activeUsers: users.filter(u => u.active).length,
    verifiedChefs: chefs.filter(c => c.verified === true).length,
    pendingChefs: chefs.filter(c => !c.verified).length,
    totalOrders: analytics.totalOrders,
    pendingTestimonials: analytics.pendingTestimonials,
    totalMenuItems: analytics.totalMenuItems
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/best.png" alt="PlatePal Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                try {
                  await refreshUser();
                  await loadData();
                  toast({
                    title: "✅ Refreshed",
                    description: "Dashboard data updated successfully"
                  });
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to refresh data"
                  });
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-200 text-gray-600 hover:text-gray-900"
              title="Refresh dashboard"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                logout();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">

      <DashboardStats {...stats} />

      <Card className="border-0 shadow-lg mt-6 bg-white">
        <Tabs defaultValue="orders" className="w-full">
          <div className="border-b border-gray-200 px-6 pt-6">
            <TabsList className="bg-transparent border-0 h-auto gap-1">
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ShoppingBag className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="menu" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FileText className="w-4 h-4" />
                Menu
              </TabsTrigger>
              <TabsTrigger 
                value="ratings" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Star className="w-4 h-4" />
                Ratings
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="chefs" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChefHat className="w-4 h-4" />
                Chefs
              </TabsTrigger>
              <TabsTrigger 
                value="testimonials" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FileText className="w-4 h-4" />
                Testimonials
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="orders" className="p-6 mt-0">
            <OrderManagement />
          </TabsContent>
          
          <TabsContent value="menu" className="p-6 mt-0">
            <MenuBrowser userRole="admin" />
          </TabsContent>
          
          <TabsContent value="ratings" className="p-6 mt-0">
            <RatingsDisplay type="all" token={token!} />
          </TabsContent>
          
          <TabsContent value="users" className="p-6 mt-0">
            <UserList
              users={users}
              type="all"
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          </TabsContent>
          
          <TabsContent value="chefs" className="p-6 mt-0">
            <UserList
              users={chefs}
              type="chefs"
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onVerify={handleVerifyChef}
            />
          </TabsContent>
          
          <TabsContent value="testimonials" className="p-6 mt-0">
            <TestimonialManagement />
          </TabsContent>
          
          <TabsContent value="analytics" className="p-6 mt-0">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </Card>
      </div>
    </div>
  );
};