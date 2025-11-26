import { useState, useEffect } from 'react';
import { ChefHat, LogOut, Plus, Package, IndianRupee, TrendingUp, Edit, Trash2, Star, BadgeCheck, RefreshCw, Award, Users, Sparkles, Clock, ShieldAlert, MessageSquare, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { chefApi, MenuItemRequest, MenuItemResponse } from '@/services/chefApi';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefOrderManagement } from './ChefOrderManagement';
import { MenuBrowser } from '@/components/shared/MenuBrowser';
import { ChefRatingsDisplay } from './ChefRatingsDisplay';
import { ChefAnalytics } from './ChefAnalytics';
import { TestimonialForm } from '@/components/shared/TestimonialForm';

export const ChefDashboard = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemResponse | null>(null);
  const [formData, setFormData] = useState<MenuItemRequest>({
    name: '',
    description: '',
    price: 0,
    category: 'MAIN_COURSE',
    imageUrl: '',
    vegetarian: false,
    preparationTime: 30
  });
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    if (token) {
      loadMenuItems();
    }
  }, [token]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await chefApi.getMyMenuItems();
      setMenuItems(items);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to load menu items'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenuItem = async () => {
    try {
      await chefApi.createMenuItem(formData);
      toast({
        title: "Success",
        description: "Menu item created successfully"
      });
      setShowCreateModal(false);
      resetForm();
      loadMenuItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to create menu item'
      });
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem) return;
    try {
      await chefApi.updateMenuItem(editingItem.id, formData);
      toast({
        title: "Success",
        description: "Menu item updated successfully"
      });
      setShowEditModal(false);
      setEditingItem(null);
      resetForm();
      loadMenuItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to update menu item'
      });
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await chefApi.deleteMenuItem(id);
      toast({
        title: "Success",
        description: "Menu item deleted successfully"
      });
      loadMenuItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to delete menu item'
      });
    }
  };

  const toggleAvailability = async (id: number) => {
    try {
      await chefApi.toggleAvailability(id);
      toast({
        title: "Success",
        description: "Availability updated"
      });
      loadMenuItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to update availability'
      });
    }
  };

  const openEditModal = (item: MenuItemResponse) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      vegetarian: item.vegetarian,
      preparationTime: item.preparationTime
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'MAIN_COURSE',
      imageUrl: '',
      vegetarian: false,
      preparationTime: 30
    });
  };

  const getStats = () => {
    const total = menuItems.length;
    const available = menuItems.filter(item => item.available).length;
    const avgPrice = menuItems.length > 0 
      ? (menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)
      : '0.00';
    const totalRatings = menuItems.reduce((sum, item) => sum + (item.menuItemTotalRatings || 0), 0);
    const avgRating = menuItems.length > 0 && totalRatings > 0
      ? (menuItems.reduce((sum, item) => sum + ((item.menuItemAverageRating || 0) * (item.menuItemTotalRatings || 0)), 0) / totalRatings).toFixed(1)
      : '0.0';
    
    return { total, available, avgPrice, totalRatings, avgRating };
  };

  const stats = getStats();

  const renderMenuItemForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Menu item name"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe your dish"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Price (₹)</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Prep Time (min)</label>
          <Input
            type="number"
            value={formData.preparationTime}
            onChange={(e) => setFormData({...formData, preparationTime: parseInt(e.target.value)})}
            placeholder="30"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STARTER">Starter</SelectItem>
            <SelectItem value="MAIN_COURSE">Main Course</SelectItem>
            <SelectItem value="DESSERT">Dessert</SelectItem>
            <SelectItem value="BEVERAGE">Beverage</SelectItem>
            <SelectItem value="SNACK">Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Image URL</label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Vegetarian</label>
        <Switch
          checked={formData.vegetarian}
          onCheckedChange={(checked) => setFormData({...formData, vegetarian: checked})}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      {/* Modern Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img src="/best.png" alt="PlatePal Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-gray-900">PlatePal</span>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8">
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('testimonial')}
                className="transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                title="Leave a Testimonial"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Feedback</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    await refreshUser();
                    await loadMenuItems();
                    toast({
                      title: "Refreshed",
                      description: "Your dashboard has been updated.",
                    });
                  } catch (error) {
                    console.error('Error refreshing:', error);
                  }
                }}
                className="transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Refresh</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Professional Chef Header with Welcome Message */}
      <div className="bg-gradient-to-r from-orange-400 via-red-400 to-red-500 text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ChefHat className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
              <p className="text-orange-100 text-lg mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Manage your menu, track orders, and grow your culinary business
                {user?.verified ? (
                  <span title="Verified Chef" className="flex items-center bg-green-500 rounded-full px-2 py-0.5 ml-2">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </span>
                ) : (
                  <span title="Pending Verification" className="flex items-center bg-amber-500 rounded-full px-2 py-0.5 ml-2">
                    <ShieldAlert className="w-4 h-4 text-white" />
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.available}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.avgPrice}</p>
                  <p className="text-xs text-gray-500 mt-1">Per order</p>
                </div>
                <IndianRupee className="w-10 h-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rating</p>
                  <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {stats.avgRating}
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </p>
                </div>
                <div className="text-sm text-gray-600">{stats.totalRatings} reviews</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-8">

        <Card className="border shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="bg-transparent border-0 h-auto">
                <TabsTrigger 
                  value="menu" 
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-md"
                >
                  My Menu
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-md"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="ratings" 
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-md"
                >
                  Ratings
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-md"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="testimonial" 
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-md sr-only"
                  style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                >
                  Testimonial
                </TabsTrigger>
                <TabsTrigger 
                  value="browse" 
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-md"
                >
                  Browse
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Menu Items Tab */}
            <TabsContent value="menu" className="p-6 mt-0 space-y-6">
              {/* Menu Items Section */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Menu Items</h2>
                <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Menu Item
                </Button>
              </div>

              {/* Menu Items Grid */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  <p className="mt-4 text-gray-600 font-medium">Loading your menu...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="py-12 text-center">
                    <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No menu items yet</p>
                    <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Package className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        {item.vegetarian ? (
                          <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">Veg</Badge>
                        ) : (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">Non-Veg</Badge>
                        )}
                        <div className="absolute top-2 left-2">
                          <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center justify-between mb-3 pb-3 border-b">
                          <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                          <span className="text-sm text-gray-500">{item.preparationTime} min</span>
                        </div>
                        
                        {/* Ratings Display */}
                        {(item.menuItemAverageRating && item.menuItemAverageRating > 0) && (
                          <div className="flex items-center justify-between mb-3 text-sm">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                              <span className="font-semibold">{item.menuItemAverageRating.toFixed(1)}</span>
                              <span className="text-gray-500">({item.menuItemTotalRatings})</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAvailability(item.id)}
                            className="flex-1 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 font-semibold"
                          >
                            Toggle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(item)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-6 mt-0">
              <ChefOrderManagement />
            </TabsContent>

            {/* Ratings Tab */}
            <TabsContent value="ratings" className="p-6 mt-0">
              <ChefRatingsDisplay />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-6 mt-0">
              <ChefAnalytics />
            </TabsContent>

            {/* Testimonial Tab */}
            <TabsContent value="testimonial" className="p-6 mt-0">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Share Your Experience</h2>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Back to menu"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <TestimonialForm />
              </div>
            </TabsContent>

            {/* Browse All Menu Items Tab */}
            <TabsContent value="browse" className="p-6 mt-0">
              <MenuBrowser userRole="chef" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Menu Item</DialogTitle>
          </DialogHeader>
          {renderMenuItemForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowCreateModal(false); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleCreateMenuItem} className="bg-orange-500 hover:bg-orange-600">
              Create Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {renderMenuItemForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditModal(false); setEditingItem(null); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMenuItem} className="bg-orange-500 hover:bg-orange-600">
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
