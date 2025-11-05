import { useState, useEffect } from 'react';
import { ChefHat, LogOut, Plus, Package, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react';
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

export const ChefDashboard = () => {
  const { user, logout } = useAuth();
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

  useEffect(() => {
    loadMenuItems();
  }, []);

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
    return {
      total: menuItems.length,
      available: menuItems.filter(item => item.available).length,
      avgPrice: menuItems.length > 0 
        ? (menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)
        : '0.00'
    };
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
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chef Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => {
            logout();
          }}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </header>

      <Tabs defaultValue="menu" className="mt-8">
          <TabsList>
            <TabsTrigger value="menu">My Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="ratings">My Ratings</TabsTrigger>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
          </TabsList>

          {/* Menu Items Tab */}
          <TabsContent value="menu" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Total Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Available
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.available}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Avg Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">₹{stats.avgPrice}</div>
                </CardContent>
              </Card>
            </div>

            {/* Menu Items Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Menu Items</h2>
              <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Menu Item
              </Button>
            </div>

            {/* Menu Items Grid */}
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : menuItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No menu items yet. Create your first menu item!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-200 relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {item.vegetarian ? (
                        <Badge className="absolute top-2 right-2 bg-green-500">Veg</Badge>
                      ) : (
                        <Badge className="absolute top-2 right-2 bg-red-500">Non-Veg</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <Badge variant={item.available ? "default" : "secondary"}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                        <span className="text-sm text-gray-500">{item.preparationTime} min</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAvailability(item.id)}
                          className="flex-1"
                        >
                          Toggle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="text-red-600 hover:text-red-700"
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
          <TabsContent value="orders">
            <ChefOrderManagement />
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <ChefRatingsDisplay />
          </TabsContent>

          {/* Browse All Menu Items Tab */}
          <TabsContent value="browse">
            <MenuBrowser userRole="chef" />
          </TabsContent>
        </Tabs>

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
