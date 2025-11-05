import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { adminApi, UserResponse } from '@/services/adminApi';
import { DashboardStats } from './DashboardStats';
import { UserList } from './UserList';
import { OrderManagement } from './OrderManagement';
import { MenuBrowser } from '@/components/shared/MenuBrowser';
import { RatingsDisplay } from '@/components/ui/RatingsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [chefs, setChefs] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [allUsers, allChefs] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllChefs()
      ]);
      
      console.log('Loaded chefs data:', allChefs);
      console.log('Verified chefs:', allChefs.filter(c => c.verified));
      
      setUsers(allUsers);
      setChefs(allChefs);
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
      console.log('Verifying chef with ID:', id);
      const updatedChef = await adminApi.verifyChef(id);
      console.log('Backend response for verified chef:', updatedChef);
      
      // Update chefs state with verified chef
      setChefs(prevChefs => {
        const updatedChefs = prevChefs.map(chef => 
          chef.id === id ? { ...chef, verified: true } : chef
        );
        console.log('Updated chefs after verification:', updatedChefs);
        console.log('Verified chefs count:', updatedChefs.filter(c => c.verified).length);
        return updatedChefs;
      });

      toast({
        title: "Success",
        description: "Chef verified successfully"
      });
    } catch (error) {
      console.error('Error verifying chef:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify chef. Please try again."
      });
    }
  };

  const stats = {
    totalUsers: users.length,
    totalChefs: chefs.length,
    activeUsers: users.filter(u => u.active).length,
    // Only count chefs who are verified, regardless of active status
    verifiedChefs: chefs.filter(c => c.verified === true).length
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => {
            logout();
            // Navigate will be handled by AuthContext's state change
          }}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </header>

      <DashboardStats {...stats} />

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="chefs">Chefs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-4">
          <OrderManagement />
        </TabsContent>
        
        <TabsContent value="menu" className="mt-4">
          <MenuBrowser userRole="admin" />
        </TabsContent>
        
        <TabsContent value="ratings" className="mt-4">
          <RatingsDisplay type="all" token={token!} />
        </TabsContent>
        
        <TabsContent value="users" className="mt-4">
          <UserList
            users={users}
            type="all"
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
          />
        </TabsContent>
        
        <TabsContent value="chefs" className="mt-4">
          <UserList
            users={chefs}
            type="chefs"
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onVerify={handleVerifyChef}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};