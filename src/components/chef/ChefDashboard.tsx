import { useState, useEffect } from 'react';
import { ChefHat, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Alert } from '@/components/Alert';
import { MenuItemGrid } from './MenuItemGrid';
import { CreateMenuItemModal } from './CreateMenuItemModal';

export interface ChefMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vegetarian: boolean;
  available: boolean;
  preparationTime: number;
}

export const ChefDashboard = () => {
  const { user, token, logout } = useAuth();
  const [menuItems, setMenuItems] = useState<ChefMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, [token]);

  const loadMenuItems = async () => {
    try {
      const result = await api.getMyMenuItems(token!);
      if (result.success) {
        setMenuItems(result.data || []);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load menu items' });
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      const result = await api.toggleAvailability(token!, id);
      if (result.success) {
        loadMenuItems();
        setAlert({ type: 'success', message: 'Availability updated!' });
        setTimeout(() => setAlert(null), 2000);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update availability' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-soft border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <ChefHat className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Chef Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, Chef {user?.name}!</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Menu Items</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2 shadow-soft"
          >
            <Plus className="w-5 h-5" />
            Add Menu Item
          </button>
        </div>

        <MenuItemGrid
          menuItems={menuItems}
          loading={loading}
          onToggleAvailability={toggleAvailability}
        />
      </main>

      {showCreateForm && (
        <CreateMenuItemModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadMenuItems();
            setAlert({ type: 'success', message: 'Menu item created successfully!' });
          }}
          onError={(message) => setAlert({ type: 'error', message })}
        />
      )}
    </div>
  );
};
