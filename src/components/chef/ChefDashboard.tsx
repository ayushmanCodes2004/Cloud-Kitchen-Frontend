import { useState, useEffect } from 'react';
import { ChefHat, LogOut, Plus, Package, IndianRupee, TrendingUp, Edit, Trash2, Star, BadgeCheck, RefreshCw, Award, Users, Sparkles, Clock, ShieldAlert, MessageSquare, X, Bell, Home, UtensilsCrossed, Truck, BarChart3, MessageCircle, Search, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { chefApi, MenuItemRequest, MenuItemResponse } from '@/services/chefApi';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { menuApi } from '@/services/menuApi';

export const ChefDashboard = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItemResponse[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItemResponse[]>([]);
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
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ratingSort, setRatingSort] = useState<'none' | 'high-to-low' | 'low-to-high'>('none');
  const [expandedItem, setExpandedItem] = useState<MenuItemResponse | null>(null);

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
      
      // Load all menu items from all chefs
      const allItemsResponse = await menuApi.getAllMenuItems();
      if (allItemsResponse.success && allItemsResponse.data) {
        setAllMenuItems(allItemsResponse.data);
      }
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/best.png" alt="PlatePal" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-900">PlatePal</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <NavItemIcon 
            icon={Home}
            label="Overview" 
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <NavItemIcon 
            icon={UtensilsCrossed}
            label="Menu" 
            active={activeTab === 'menu'}
            onClick={() => setActiveTab('menu')}
          />
          <NavItemIcon 
            icon={Star}
            label="Rating & reviews" 
            active={activeTab === 'ratings'}
            onClick={() => setActiveTab('ratings')}
          />
          <NavItemIcon 
            icon={Truck}
            label="Delivery" 
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
          />
          <NavItemIcon 
            icon={BarChart3}
            label="Analytics" 
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
          />
          <NavItemIcon 
            icon={MessageCircle}
            label="Testimonial" 
            active={activeTab === 'testimonial'}
            onClick={() => setActiveTab('testimonial')}
          />
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-600 hover:bg-gray-100"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          {(activeTab === 'overview' || activeTab === 'menu') && (
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-100 border-0 rounded-lg w-full"
              />
            </div>
          )}
          {(activeTab !== 'overview' && activeTab !== 'menu') && (
            <div />
          )}

          <div className="flex items-center gap-3">
            {user?.verified && (
              <div className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <BadgeCheck className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Verified</span>
              </div>
            )}
            {!user?.verified && (
              <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Pending</span>
              </div>
            )}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Chef</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 mt-0">
              <div className="space-y-6">
                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 mb-6 flex items-start gap-4">
                  <ChefHat className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
                    <p className="text-gray-600">Manage your menu items, track orders, and monitor customer ratings all in one place.</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                  <div className="flex items-center gap-4">
                    <Select value={ratingSort} onValueChange={setRatingSort}>
                      <SelectTrigger className="w-48 bg-white border border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sort by Rating</SelectItem>
                        <SelectItem value="high-to-low">High to Low ↓</SelectItem>
                        <SelectItem value="low-to-high">Low to High ↑</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-bold text-orange-600">{allMenuItems.length}</span> items
                    </div>
                  </div>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex gap-3 overflow-x-auto pb-4">
                  <CategoryFilterTab
                    label="All"
                    count={allMenuItems.length}
                    active={selectedCategory === 'All'}
                    onClick={() => setSelectedCategory('All')}
                  />
                  {Array.from(new Set(allMenuItems.map(item => item.category))).map((category) => {
                    const count = allMenuItems.filter(item => item.category === category).length;
                    return (
                      <CategoryFilterTab
                        key={category}
                        label={category}
                        count={count}
                        active={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                      />
                    );
                  })}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                      <p className="text-gray-600">Loading menu items...</p>
                    </div>
                  </div>
                ) : allMenuItems.length === 0 ? (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="py-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No menu items available yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {allMenuItems
                      .filter(item => {
                        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
                        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      })
                      .sort((a, b) => {
                        if (ratingSort === 'high-to-low') {
                          const ratingA = a.menuItemAverageRating || 0;
                          const ratingB = b.menuItemAverageRating || 0;
                          return ratingB - ratingA;
                        } else if (ratingSort === 'low-to-high') {
                          const ratingA = a.menuItemAverageRating || 0;
                          const ratingB = b.menuItemAverageRating || 0;
                          return ratingA - ratingB;
                        }
                        return 0;
                      })
                      .map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full cursor-pointer" onClick={() => setExpandedItem(item)}>
                        <div className="w-full h-48 bg-gray-200 relative flex-shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                              <Package className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          {item.vegetarian ? (
                            <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">Veg</Badge>
                          ) : (
                            <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">Non-Veg</Badge>
                          )}
                          <Badge variant={item.available ? "default" : "secondary"} className="absolute top-2 left-2 text-xs">
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between mb-3 pb-3 border-b">
                            <span className="text-2xl font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">{item.preparationTime} min</span>
                          </div>

                          <div className="text-sm mb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Chef:</span>
                              <span className="font-semibold text-gray-900">{item.chefName || 'Unknown'}</span>
                            </div>
                          </div>

                          {item.menuItemAverageRating && item.menuItemAverageRating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{item.menuItemAverageRating.toFixed(1)}</span>
                              <span className="text-gray-500 text-sm">({item.menuItemTotalRatings})</span>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm italic">No ratings yet</div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

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
                  {menuItems
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                    <Card key={item.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="w-full h-48 bg-gray-100 relative flex-shrink-0">
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
                      <CardContent className="p-4 flex flex-col flex-1">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between mb-3 pb-3 border-b">
                            <span className="text-2xl font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">{item.preparationTime} min</span>
                          </div>
                          
                          {/* Ratings Display */}
                          <div className="text-sm mb-3">
                            {(item.menuItemAverageRating && item.menuItemAverageRating > 0) ? (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Rating:</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                                  <span className="font-semibold">{item.menuItemAverageRating.toFixed(1)}</span>
                                  <span className="text-gray-500">({item.menuItemTotalRatings})</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 italic">
                                Awaiting customer feedback
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAvailability(item.id)}
                            className="flex-1 h-9 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 font-semibold"
                          >
                            Toggle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(item)}
                            className="h-9 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="h-9 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
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
        </div>
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

      {/* Expanded Item Modal */}
      {expandedItem && (
        <Dialog open={!!expandedItem} onOpenChange={(open) => !open && setExpandedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{expandedItem.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">

              {/* Image */}
              <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                {expandedItem.imageUrl ? (
                  <img src={expandedItem.imageUrl} alt={expandedItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-gray-900">₹{expandedItem.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preparation Time</p>
                  <p className="text-2xl font-bold text-gray-900">{expandedItem.preparationTime} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="text-lg font-semibold text-gray-900">{expandedItem.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="text-lg font-semibold">{expandedItem.vegetarian ? '🥗 Vegetarian' : '🍗 Non-Vegetarian'}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">{expandedItem.description}</p>
              </div>

              {/* Chef Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Chef</p>
                <p className="text-lg font-semibold text-gray-900">{expandedItem.chefName || 'Unknown'}</p>
              </div>

              {/* Rating */}
              {expandedItem.menuItemAverageRating && expandedItem.menuItemAverageRating > 0 ? (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{expandedItem.menuItemAverageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({expandedItem.menuItemTotalRatings} ratings)</span>
                </div>
              ) : (
                <p className="text-gray-500 italic">No ratings yet</p>
              )}

              {/* Status */}
              <div className="flex gap-2">
                <Badge variant={expandedItem.available ? "default" : "secondary"}>
                  {expandedItem.available ? 'Available' : 'Unavailable'}
                </Badge>
                <Badge className={expandedItem.vegetarian ? "bg-green-500" : "bg-red-500"} variant="default">
                  {expandedItem.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface CategoryFilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    'All': '🍽️',
    'STARTER': '🥗',
    'MAIN_COURSE': '🍛',
    'DESSERT': '🍰',
    'BEVERAGE': '🥤',
    'SNACK': '🥪',
  };
  return iconMap[category] || '🍽️';
};

const CategoryFilterTab = ({ label, count, active, onClick }: CategoryFilterTabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-lg whitespace-nowrap transition border ${
      active
        ? 'bg-green-50 border-green-300'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}
  >
    <span className={`font-semibold text-sm ${active ? 'text-green-700' : 'text-gray-700'}`}>
      {label === 'All' ? 'All' : label}
    </span>
    <span className={`text-xs font-medium ${active ? 'text-green-600' : 'text-gray-500'}`}>
      ({count})
    </span>
  </button>
);

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      active
        ? 'bg-orange-100 text-orange-600'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

interface NavItemIconProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItemIcon = ({ icon: Icon, label, active, onClick }: NavItemIconProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      active
        ? 'bg-orange-100 text-orange-600'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm">{label}</span>
  </button>
);
